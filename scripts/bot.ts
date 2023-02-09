import { BigNumber, BigNumberish, ethers } from "ethers";
import { Vault } from "../.graphclient";
import { readFileSync } from "fs";
import axios from "axios";
import url from "url";
import { AbiCoder, Interface } from "ethers/lib/utils";

export const liquidate = async (vault: Vault, cdp: ethers.Contract, provider: ethers.providers.Provider) => {
    const bot = new ethers.Contract(
        process.env.BOT as string,
        readFileSync("./scripts/abis/Bot.json", "utf-8"),
        provider
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

    const { overallCollateral, adjustedCollateral } = await cdp.calculateVaultCollateral(vault.id);
    const actualDebt = await cdp.getOverallDebt(vault.id);
    if (adjustedCollateral.gte(actualDebt)) {
        return;
    }
    const { liquidationPremiumD } = await cdp.protocolParams();
    const DENOMINATOR = BigNumber.from(10).pow(9);
    const toRepay = overallCollateral.mul(DENOMINATOR.sub(liquidationPremiumD)).div(DENOMINATOR);
    console.log(
        "Trying to liquidate vault %s with repayment %s and debt %s",
        vault.id,
        toRepay.toString(),
        actualDebt.toString()
    );
    const nfts = await cdp.vaultNftsById(vault.id);
    const { swapAddresses, swapData } = await buildAllSwapData(
        bot.address,
        await cdp.positionManager(),
        nfts,
        provider
    );
    const tx = await bot.connect(signer).liquidate(
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
    await tx.wait();
};

const buildAllSwapData = async (
    bot: string,
    positionManager: string,
    nfts: BigNumber[],
    provider: ethers.providers.Provider
) => {
    const result: { [key: string]: BigNumber } = await getActualTokenAmounts(positionManager, nfts, provider);
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

const getActualTokenAmounts = async (
    positionManager: string,
    nfts: BigNumber[],
    provider: ethers.providers.Provider
) => {
    const uniV3Amounts = new ethers.Contract(
        process.env.UNI_V3_AMOUNTS as string,
        readFileSync("./scripts/abis/UniV3Amounts.json", "utf-8"),
        provider
    );
    let result: { [key: string]: BigNumber } = {};
    for (let i = 0; i < nfts.length; ++i) {
        var tokens: string[];
        var amounts: BigNumber[];
        [tokens, amounts] = await uniV3Amounts.getAmounts(nfts[i], positionManager);
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
        readFileSync("./scripts/abis/UniV3Factory.json", "utf-8"),
        provider
    );
    const pool = new ethers.Contract(
        await factory.getPool(tokenFrom, process.env.TOKEN, 3000),
        readFileSync("./scripts/abis/UniV3Pool.json", "utf-8"),
        provider
    );
    let poolID = BigNumber.from(pool.address);
    const flag = (await pool.token0()) == tokenFrom;
    if (!flag) {
        poolID = poolID.add(BigNumber.from(2).pow(255));
    }
    const coder = new ethers.utils.AbiCoder();
    const uniV3Data = coder.encode(["uint256[]", "address"], [[poolID], process.env.ROUTER]);
    const pathHelperInterface = new ethers.utils.Interface(
        readFileSync("./scripts/abis/PathExecutorHelper.json", "utf-8")
    );
    return {
        address: process.env.PATH_HELPER as string,
        data: pathHelperInterface.encodeFunctionData("swap", [
            tokenFrom,
            [{ part: 100, tokenFrom: tokenFrom, helper: process.env.UNI_V3_HELPER, data: uniV3Data }],
            process.env.TOKEN,
        ]),
    };
};
