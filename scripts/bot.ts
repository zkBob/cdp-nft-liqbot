import { BigNumber, ethers } from "ethers";
import { Vault } from "../.graphclient";
import { DEBT_DENOMINATOR, DENOMINATOR } from "./constants";
import axios from "axios";
import url from "url";
import { formatUnits, Interface } from "ethers/lib/utils";
import { logger } from "./logger";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export const liquidate = async (vault: Vault, cdp: ethers.Contract, bot: ethers.Contract, address: string) => {
    const { overallCollateral, adjustedCollateral: borrowLimit } = await cdp.calculateVaultCollateral(vault.id);
    const actualDebt = await cdp.getOverallDebt(vault.id);
    if (actualDebt.lte(borrowLimit)) {
        const health = BigNumber.from(100).mul(borrowLimit).div(actualDebt).toNumber() / 100;
        logger.warn(
            {
                id: vault.id,
                borrowLimit: borrowLimit.div(DEBT_DENOMINATOR).toString(),
                debt: actualDebt.div(DEBT_DENOMINATOR).toString(),
                health,
            },
            "Vault appeared to be ineligible for liquidation, skipping"
        );
        return;
    }
    const { liquidationPremiumD } = await cdp.protocolParams();
    logger.debug({ premium: liquidationPremiumD / DENOMINATOR.toNumber() }, "Fetched liquidation premium");

    logger.debug({ id: vault.id }, "Fetching collateral list");
    const nfts = await cdp.vaultNftsById(vault.id);
    logger.info(
        { id: vault.id, count: nfts.length, nfts: nfts.map((x: BigNumber) => x.toString()) },
        "Fetched collateral list"
    );

    let toRepay = overallCollateral.mul(DENOMINATOR.sub(liquidationPremiumD)).div(DENOMINATOR);
    if (actualDebt.gt(toRepay)) {
        toRepay = actualDebt;
    }
    logger.info(
        {
            id: vault.id,
            borrowLimit: borrowLimit.div(DEBT_DENOMINATOR).toString(),
            repayment: toRepay.div(DEBT_DENOMINATOR).toString(),
            debt: actualDebt.div(DEBT_DENOMINATOR).toString(),
        },
        "Building liquidation calldata"
    );
    const { swapAddresses, swapData } = await buildAllSwapData(bot.address, nfts, bot.provider);

    // TODO use better lib for gas estimation
    const feeData = await bot.provider.getFeeData();
    const maxFeePerGas = feeData.maxFeePerGas || BigNumber.from(process.env.MAX_FEE_PER_GAS);
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || BigNumber.from(process.env.MAX_FEE_PER_GAS);
    logger.info(
        {
            maxFeePerGas: formatUnits(maxFeePerGas, "gwei") + "gwei",
            maxPriorityFeePerGas: formatUnits(maxPriorityFeePerGas, "gwei") + "gwei",
        },
        "Fetched gas price"
    );

    let expectedGas = BigNumber.from(0);
    try {
        expectedGas = await bot.estimateGas.liquidate(
            process.env.FLASH_MINTER,
            process.env.TOKEN,
            {
                vaultId: vault.id,
                debt: toRepay.mul(105).div(100),
                nfts,
                swapAddresses,
                swapData,
                positionManager: process.env.POSITION_MANAGER,
                cdp: cdp.address,
            },
            address
        );
        logger.info({ estimate: expectedGas.toString() }, "Estimated transaction gas");
    } catch (error: any) {
        logger.warn(
            { reason: error?.reason, errorData: error?.error?.error?.data, txData: error?.transaction },
            "Failed on estimateGas with reason"
        );
        return;
    }
    const tx: TransactionResponse = await bot.liquidate(
        process.env.FLASH_MINTER,
        process.env.TOKEN,
        {
            vaultId: vault.id,
            debt: toRepay,
            nfts,
            swapAddresses,
            swapData,
            positionManager: process.env.POSITION_MANAGER,
            cdp: cdp.address,
        },
        address,
        {
            gasLimit: expectedGas.mul(110).div(100),
            maxFeePerGas: maxFeePerGas.mul(110).div(100),
            maxPriorityFeePerGas: maxPriorityFeePerGas.mul(110).div(100),
        }
    );
    logger.info(
        { id: vault.id, txHash: tx.hash, nonce: tx.nonce, from: tx.from, to: tx.to, data: tx.data },
        "Sent liquidation tx"
    );
};

const buildAllSwapData = async (bot: string, nfts: BigNumber[], provider: ethers.providers.Provider) => {
    const result: { [key: string]: BigNumber } = await getActualTokenAmounts(nfts, provider);
    let swapData: string[] = [];
    let swapAddresses: string[] = [];
    const { chainId } = await provider.getNetwork();
    for (let token in result) {
        if (token == process.env.TOKEN || result[token].eq(0)) {
            continue;
        }
        const { address, data } = await buildSwapData(bot, token, result[token], chainId);
        swapAddresses.push(address);
        swapData.push(data);
    }
    if (process.env.TRUE_TOKEN) {
        // this branch is only for testing
        // wrap BOB to Mock token
        swapAddresses.push(process.env.TOKEN as string);
        const wrapperInterface = new Interface(["function wrapAll()"]);
        swapData.push(wrapperInterface.encodeFunctionData("wrapAll", []));
    }
    return { swapAddresses, swapData };
};

const getActualTokenAmounts = async (nfts: BigNumber[], provider: ethers.providers.Provider) => {
    const uniV3Amounts = new ethers.Contract(
        process.env.UNI_V3_AMOUNTS as string,
        [
            "function getAmounts(uint256 nft, address positionManager) view returns (tuple(address[2] tokens, uint256[2] tokenAmounts))",
        ],
        provider
    );
    let result: { [key: string]: BigNumber } = {};
    for (let i = 0; i < nfts.length; ++i) {
        var tokens: string[];
        var amounts: BigNumber[];
        [tokens, amounts] = await uniV3Amounts.getAmounts(nfts[i], process.env.POSITION_MANAGER);
        for (let j = 0; j < 2; ++j) {
            if (!(tokens[j] in result)) {
                result[tokens[j]] = BigNumber.from(0);
            }
            result[tokens[j]] = result[tokens[j]].add(amounts[j]);
        }
    }
    return result;
};

const buildSwapData = async (bot: string, tokenFrom: string, amount: BigNumber, chainId: number) => {
    const outToken = process.env.TRUE_TOKEN ? (process.env.TRUE_TOKEN as string) : (process.env.TOKEN as string);
    const amountNorm = amount.mul(99).div(100).toString();
    const payload = new url.URLSearchParams({
        fromTokenAddress: tokenFrom,
        toTokenAddress: outToken,
        amount: amountNorm,
        fromAddress: bot,
        disableEstimate: "true",
        slippage: "10",
    });
    logger.info({ inToken: tokenFrom, outToken, amount: amountNorm }, "Fetching swap data");
    const {
        data: { tx },
    } = await axios.get(`${process.env.BASE_API_URL}/${chainId}/swap?${payload}`);
    return {
        address: tx.to as string,
        data: tx.data as string,
    };
};
