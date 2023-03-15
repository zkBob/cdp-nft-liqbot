import { BigNumber, ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { Vault } from "../.graphclient";
import { DENOMINATOR } from "./constants";
import axios from "axios";
import url from "url";
import { Interface } from "ethers/lib/utils";

export const liquidate = async (vault: Vault, cdp: ethers.Contract, provider: ethers.providers.Provider) => {
    console.log("In liquidation");
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
    const payload = new url.URLSearchParams({
        fromTokenAddress: tokenFrom,
        toTokenAddress: process.env.TRUE_TOKEN ? (process.env.TRUE_TOKEN as string) : (process.env.TOKEN as string),
        amount: amount.mul(99).div(100).toString(),
        fromAddress: bot,
        disableEstimate: "true",
        slippage: "10",
    });
    const {
        data: { tx },
    } = await axios.get(`${process.env.BASE_API_URL}/${chainId}/swap?${payload}`);
    console.log("Data: ", tx.data);
    console.log("Address: ", tx.to);
    return {
        address: tx.to as string,
        data: tx.data as string,
    };
};
