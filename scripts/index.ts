import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + "/.env" });

import { VaultsDocument, execute, Vault } from "../.graphclient";
import { ethers, providers, BigNumber } from "ethers";
import { TickMath } from "@uniswap/v3-sdk";

const { JsonRpcProvider } = providers;
import { getAmountsForLiquidty } from "./liquidity-math";
import { sqrt } from "./math-utils";
import { liquidate } from "./bot";
import { Q96, Q48, DENOMINATOR, DEBT_DENOMINATOR } from "./constants";
import { logger } from "./logger";
import * as fs from "fs";
import { NonceManager } from "@ethersproject/experimental";

const main = async () => {
    const provider = new JsonRpcProvider(process.env.RPC);
    const cdp = new ethers.Contract(
        process.env.CDP as string,
        [
            "function normalizationRate() view returns (uint256)",
            "function updateNormalizationRate() view returns (uint256)",
            "function oracle() view returns (address)",
            "function calculateVaultCollateral(uint256 vaultId) view returns (tuple(uint256 overallCollateral, uint256 adjustedCollateral))",
            "function getOverallDebt(uint256 vaultId) view returns (uint256)",
            "function protocolParams() view returns (tuple(uint256 maxDebtPerVault, uint256 minSingleNftCollateral, uint32 liquidationFeeD, uint32 liquidationPremiumD, uint8 maxNftsPerVault))",
            "function vaultNftsById(uint256 vaultId) view returns (uint256[])",
        ],
        provider
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    const nonceManager = new NonceManager(signer);
    const bot = new ethers.Contract(
        process.env.BOT as string,
        [
            "function liquidate(address flashMinter, address token, tuple(uint256 vaultId, uint256 debt, uint256[] nfts, address[] swapAddresses, bytes[] swapData, address positionManager, address cdp), address recipient)",
        ],
        nonceManager
    );

    const balance = await provider.getBalance(signer.address);

    const interval = parseInt(process.env.INTERVAL as string);
    logger.info(
        {
            address: signer.address,
            interval: interval / 1000 + "s",
            balance: ethers.utils.formatEther(balance),
        },
        "Starting liquidator bot"
    );

    const chainlinkOracle = await getChainlinkOracle(provider, cdp);
    logger.info({ address: chainlinkOracle.address }, "Chainlink price oracle");

    while (true) {
        const toIgnore = new Set(
            fs
                .readFileSync("./scripts/vaults.ignore", "utf-8")
                .split("\n")
                .map((x) => x.replace(" ", ""))
                .filter((x) => x.length > 0)
        );
        if (toIgnore.size > 0) {
            logger.debug("Skipping health check on some vaults", { count: toIgnore.size, ids: toIgnore.values() });
        }
        const start = performance.now();
        try {
            logger.debug("Fetching active vaults");
            const vaults: Vault[] = (await execute(VaultsDocument, {})).data.vaults;
            logger.info({ count: vaults.length }, "Fetched active vaults");

            logger.debug("Fetching token prices");
            const tokenPricesX96 = await getNeededPricesX96(vaults, chainlinkOracle);

            logger.debug("Fetching normalization rate");
            const normalizationRate = await cdp.updateNormalizationRate();
            logger.info({ rate: normalizationRate.toString() }, "Fetched normalization rate");

            for (const vault of vaults) {
                if (toIgnore.has(vault.id)) {
                    logger.debug({ id: vault.id }, "Skipping active vault due to ignore settings");
                } else if (await liquidationNeeded(vault, tokenPricesX96, normalizationRate)) {
                    logger.warn({ id: vault.id }, "Attempting vault liquidation");
                    await liquidate(vault, cdp, bot, signer.address);
                }
            }
        } catch (error: any) {
            logger.error({ error: error.message }, "UNKNOWN ERROR");
        }
        const finish = performance.now();
        if (finish - start < interval) {
            await sleep(interval - (finish - start));
        }
    }
};

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getChainlinkOracle = async (provider: ethers.providers.Provider, cdp: ethers.Contract) => {
    const positionOracle = new ethers.Contract(
        await cdp.oracle(),
        ["function oracle() view returns(address)"],
        provider
    );
    return new ethers.Contract(
        await positionOracle.oracle(),
        ["function price(address token) view returns (tuple(bool success, uint256 priceX96))"],
        provider
    );
};

const getNeededPricesX96 = async (vaults: Vault[], chainlinkOracle: ethers.Contract) => {
    let tokens: { [key: string]: BigNumber } = {};
    for (let i = 0; i < vaults.length; ++i) {
        const vault = vaults[i];
        for (let j = 0; j < vault.uniV3Positions.length; ++j) {
            const position = vault.uniV3Positions[j];
            const token0 = position.token0;
            const token1 = position.token1;
            if (!(token0 in tokens)) {
                tokens[token0] = (await chainlinkOracle.price(token0))[1];
                logger.debug({ token: token0, priceX96: tokens[token0].toString() }, "Fetched token price");
            }
            if (!(token1 in tokens)) {
                tokens[token1] = (await chainlinkOracle.price(token1))[1];
                logger.debug({ token: token1, priceX96: tokens[token1].toString() }, "Fetched token price");
            }
        }
    }
    return tokens;
};

const liquidationNeeded = async (vault: Vault, tokenPricesX96: any, normalizationRate: BigNumber) => {
    const borrowLimit = getAdjustedCapital(vault, tokenPricesX96);
    const debt = getOverallDebt(vault, normalizationRate);
    const health = BigNumber.from(100).mul(borrowLimit).div(debt).toNumber() / 100;
    const level = health > 1.5 ? "debug" : health > 1.15 ? "info" : health > 1 ? "warn" : "error";
    logger[level](
        {
            id: vault.id,
            borrowLimit: borrowLimit.div(DEBT_DENOMINATOR).toString(),
            debt: debt.div(DEBT_DENOMINATOR).toString(),
            health,
        },
        "Calculated vault status"
    );
    return debt.gt(borrowLimit);
};

const getAdjustedCapital = (vault: Vault, tokenPricesX96: any) => {
    // NOTE: here the value of adjusted capital can be a bit lower than actual value
    // because position accumulated fees are not considered
    let capital = BigNumber.from(0);
    for (let i = 0; i < vault.uniV3Positions.length; ++i) {
        const price0X96 = tokenPricesX96[vault.uniV3Positions[i].token0];
        const price1X96 = tokenPricesX96[vault.uniV3Positions[i].token1];
        let [amount0, amount1] = getAmounts(
            BigNumber.from(vault.uniV3Positions[i].liquidity),
            vault.uniV3Positions[i].tickLower,
            vault.uniV3Positions[i].tickUpper,
            price0X96,
            price1X96
        );
        let currentCapital = BigNumber.from(0);
        amount0 = amount0.add(vault.uniV3Positions[i].amount0);
        amount1 = amount1.add(vault.uniV3Positions[i].amount1);
        currentCapital = currentCapital.add(amount0.mul(price0X96).div(Q96));
        currentCapital = currentCapital.add(amount1.mul(price1X96).div(Q96));
        capital = capital.add(currentCapital.mul(vault.uniV3Positions[i].pool.liquidationThreshold).div(DENOMINATOR));
    }
    return capital;
};

const getActualAdjustedCapital = async (cdp: ethers.Contract, vaultId: BigNumber) => {
    const { adjustedCollateral } = await cdp.calculateVaultCollateral(vaultId);
};

const getAmounts = (
    liquidity: BigNumber,
    tickLower: number,
    tickUpper: number,
    price0X96: BigNumber,
    price1X96: BigNumber
) => {
    const priceX96 = price0X96.mul(Q96).div(price1X96);
    const sqrtPriceX96 = sqrt(priceX96).mul(Q48);
    const sqrtRatioAX96 = BigNumber.from(TickMath.getSqrtRatioAtTick(tickLower).toString());
    const sqrtRatioBX96 = BigNumber.from(TickMath.getSqrtRatioAtTick(tickUpper).toString());
    return getAmountsForLiquidty(sqrtPriceX96, sqrtRatioAX96, sqrtRatioBX96, liquidity);
};

const getOverallDebt = (vault: Vault, normalizationRate: BigNumber) => {
    return mulDivRoundingUp(BigNumber.from(vault.vaultNormalizedDebt), normalizationRate, DEBT_DENOMINATOR);
};

const mulDivRoundingUp = (lhs: BigNumber, rhs: BigNumber, divisor: BigNumber) => {
    let result = lhs.mul(rhs).div(divisor);
    if (!lhs.mul(rhs).mod(divisor).eq(0)) {
        result = result.add(1);
    }
    return result;
};

main();
