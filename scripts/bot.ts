import { BigNumber, ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { Vault } from "../.graphclient";
import { readFileSync } from "fs";
import { DENOMINATOR } from "./constants";
import axios from "axios";
import url from "url";
import { AbiCoder, Interface } from "ethers/lib/utils";

export const liquidate = async (vault: Vault, cdp: ethers.Contract, provider: ethers.providers.Provider) => {
    const bot = new ethers.Contract(
        process.env.BOT as string,
        [
            "function liquidate(address flashMinter, address token, tuple(uint256 vaultId, uint256 debt, uint256[] nfts, address[] swapAddresses, bytes[] swapData, address positionManager, address cdp), address recipient)",
        ],
        provider
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    const nonceManager = new NonceManager(signer);

    const { overallCollateral, adjustedCollateral } = await cdp.calculateVaultCollateral(vault.id);
    const actualDebt = await cdp.getOverallDebt(vault.id);
    if (adjustedCollateral.gte(actualDebt)) {
        return;
    }
    const { liquidationPremiumD } = await cdp.protocolParams();
    const toRepay = overallCollateral.mul(DENOMINATOR.sub(liquidationPremiumD)).div(DENOMINATOR);
    console.log(
        "Trying to liquidate vault %s with repayment %s and debt %s",
        vault.id,
        toRepay.toString(),
        actualDebt.toString()
    );
    const nfts = await cdp.vaultNftsById(vault.id);
    const { swapAddresses, swapData } = await buildAllSwapData(bot.address, nfts, provider);
    let { maxFeePerGas } = await provider.getFeeData();
    const expectedGas = await bot.connect(signer).estimateGas.liquidate(
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
        signer.address
    );
    if (maxFeePerGas == null) {
        maxFeePerGas = BigNumber.from(process.env.MAX_FEE_PER_GAS);
    }
    await bot.connect(nonceManager).liquidate(
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
        signer.address,
        {
            gasLimit: expectedGas.mul(101).div(100),
            maxFeePerGas: maxFeePerGas.mul(101).div(100),
        }
    );
};

const buildAllSwapData = async (bot: string, nfts: BigNumber[], provider: ethers.providers.Provider) => {
    const result: { [key: string]: BigNumber } = await getActualTokenAmounts(nfts, provider);
    let swapData: string[] = [];
    let swapAddresses: string[] = [];
    for (let token in result) {
        if (token == process.env.TOKEN || result[token].eq(0)) {
            continue;
        }
        const { address, data } = await buildSwapData(bot, token, result[token], provider);
        swapAddresses.push(address);
        swapData.push(data);
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

const buildSwapData = async (
    bot: string,
    tokenFrom: string,
    amount: BigNumber,
    provider: ethers.providers.Provider
) => {
    // TODO: query calldata from 1inch
    const factory = new ethers.Contract(
        process.env.FACTORY as string,
        ["function getPool(address token0, address token1, uint24 fee) view returns (address)"],
        provider
    );
    const pool = new ethers.Contract(
        await factory.getPool(tokenFrom, process.env.TOKEN, 3000),
        ["function token0() view returns (address)"],
        provider
    );
    let poolID = BigNumber.from(pool.address);
    const flag = (await pool.token0()) == tokenFrom;
    if (!flag) {
        poolID = poolID.add(BigNumber.from(2).pow(255));
    }
    const coder = new ethers.utils.AbiCoder();
    const uniV3Data = coder.encode(["uint256[]", "address"], [[poolID], process.env.ROUTER]);
    const pathHelperInterface = new ethers.utils.Interface([
        "function swap(address srcToken, tuple(uint16 part, address tokenFrom, address helper, bytes data)[] data, address destToken)",
    ]);
    return {
        address: process.env.PATH_HELPER as string,
        data: pathHelperInterface.encodeFunctionData("swap", [
            tokenFrom,
            [{ part: 100, tokenFrom: tokenFrom, helper: process.env.UNI_V3_HELPER, data: uniV3Data }],
            process.env.TOKEN,
        ]),
    };
};
