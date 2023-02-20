import * as dotenv from "dotenv";
import { VaultsDocument, execute, Vault } from "../.graphclient";
import { ethers, providers, BigNumber } from "ethers";
import { TickMath } from "@uniswap/v3-sdk";
const { AlchemyProvider, JsonRpcProvider } = providers;
import { readFileSync } from "fs";
import { getAmountsForLiquidty } from "./liquidity-math";
import { sqrt } from "./math-utils";
import { liquidate } from "./bot";
import { Q96, Q48, DENOMINATOR } from "./constants";

dotenv.config({ path: __dirname + "/.env" });

const main = async () => {
    const provider = new JsonRpcProvider(process.env.RPC);
    let cdp = new ethers.Contract(
        process.env.CDP as string,
        [
            "function globalStabilisationFeePerUSDD() view returns (uint256)",
            "function oracle() view returns (address)",
            "function calculateVaultCollateral(uint256 vaultId) view returns (tuple(uint256 overallCollateral, uint256 adjustedCollateral))",
            "function getOverallDebt(uint256 vaultId) view returns (uint256)",
            "function protocolParams() view returns (tuple(uint256 maxDebtPerVault, uint256 minSingleNftCollateral, uint32 liquidationFeeD, uint32 liquidationPremiumD, uint8 maxNftsPerVault))",
            "function vaultNftsById(uint256 vaultId) view returns (uint256[])",
        ],
        provider
    );
    const interval = parseInt(process.env.INTERVAL as string);
    while (true) {
        const start = performance.now();
        try {
            const vaults: Vault[] = (await execute(VaultsDocument, {})).data.vaults;
            const tokenPricesX96 = await getNeededPricesX96(vaults, provider, cdp);
            const globalStabilisationFeePerUSDD = await cdp.globalStabilisationFeePerUSDD();
            for (let i = 0; i < vaults.length; ++i) {
                const vault = vaults[i];
                if (await liquidationNeeded(vault, tokenPricesX96, globalStabilisationFeePerUSDD)) {
                    await liquidate(vault, cdp, provider);
                }
            }
        } catch (error) {
            // TODO: report error
            console.log("Error: ", error);
        }
        const finish = performance.now();
        let duration = finish - start;
        if (duration > interval) {
            duration = interval;
        }
        await sleep(interval - duration);
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

const getNeededPricesX96 = async (vaults: Vault[], provider: ethers.providers.Provider, cdp: ethers.Contract) => {
    let tokens: { [key: string]: BigNumber } = {};
    const chainlinkOracle = await getChainlinkOracle(provider, cdp);
    for (let i = 0; i < vaults.length; ++i) {
        const vault = vaults[i];
        for (let j = 0; j < vault.uniV3Positions.length; ++j) {
            const position = vault.uniV3Positions[j];
            const token0 = position.token0;
            const token1 = position.token1;
            if (!(token0 in tokens)) {
                tokens[token0] = (await chainlinkOracle.price(token0))[1];
            }
            if (!(token1 in tokens)) {
                tokens[token1] = (await chainlinkOracle.price(token1))[1];
            }
        }
    }
    return tokens;
};

const liquidationNeeded = async (vault: Vault, tokenPricesX96: any, globalStabilisationFeePerUSDD: BigNumber) => {
    const capital = getAdjustedCapital(vault, tokenPricesX96);
    const debt = getOverallDebt(vault, globalStabilisationFeePerUSDD);
    return capital.lt(debt);
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
        capital = capital.add(
            currentCapital.mul(vault.uniV3Positions[i].liquidationThreshold.liquidationThreshold).div(DENOMINATOR)
        );
    }
    return capital;
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

const getOverallDebt = (vault: Vault, globalStabilisationFeePerUSDD: BigNumber) => {
    const currentDebt = BigNumber.from(vault.vaultDebt);
    const deltaGlobalStabilisationFeeD = globalStabilisationFeePerUSDD.sub(
        vault.globalStabilisationFeePerUSDVaultSnapshotD
    );
    // .sub(BigNumber.from(vault.globalStabilisationFeePerUSDVaultSnapshotD));
    return currentDebt
        .add(vault.stabilisationFeeVaultSnapshot)
        .add(currentDebt.mul(deltaGlobalStabilisationFeeD).div(DENOMINATOR));
};

main();
