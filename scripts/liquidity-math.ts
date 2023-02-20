import { BigNumber } from "ethers";

export const getAmountsForLiquidty = (
    sqrtRatioX96: BigNumber,
    sqrtRatioAX96: BigNumber,
    sqrtRatioBX96: BigNumber,
    liquidity: BigNumber
) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    let amount0 = BigNumber.from(0);
    let amount1 = BigNumber.from(0);
    if (sqrtRatioX96.lte(sqrtRatioAX96)) {
        amount0 = getAmount0ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    } else if (sqrtRatioX96.lt(sqrtRatioBX96)) {
        amount0 = getAmount0ForLiquidity(sqrtRatioX96, sqrtRatioBX96, liquidity);
        amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioX96, liquidity);
    } else {
        amount1 = getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity);
    }
    return [amount0, amount1];
};

const getAmount0ForLiquidity = (sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    liquidity = liquidity.mul(BigNumber.from(2).pow(96));
    return liquidity.mul(sqrtRatioBX96.sub(sqrtRatioAX96)).div(sqrtRatioBX96).div(sqrtRatioAX96);
};

const getAmount1ForLiquidity = (sqrtRatioAX96: BigNumber, sqrtRatioBX96: BigNumber, liquidity: BigNumber) => {
    if (sqrtRatioAX96.gt(sqrtRatioBX96)) {
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }
    return liquidity.mul(sqrtRatioBX96.sub(sqrtRatioAX96)).div(BigNumber.from(2).pow(96));
};
