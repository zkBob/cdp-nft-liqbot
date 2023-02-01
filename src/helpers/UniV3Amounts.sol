// SPDX-License-Identifer
pragma solidity ^0.8.0;

import "../interfaces/external/univ3/INonfungiblePositionManager.sol";
import "../interfaces/external/univ3/IUniswapV3Pool.sol";
import "../interfaces/external/univ3/IUniswapV3Factory.sol";
import "../libraries/external/LiquidityAmounts.sol";
import "../libraries/external/TickMath.sol";
import "../libraries/UniswapV3FeesCalculation.sol";

contract UniV3Amounts {
    function getAmounts(
        uint256 nft,
        INonfungiblePositionManager positionManager
    ) external view returns (address[2] memory tokens, uint256[2] memory tokenAmounts) {
        IUniswapV3Factory factory = IUniswapV3Factory(positionManager.factory());
        INonfungiblePositionManager.PositionInfo memory info = positionManager.positions(nft);
        IUniswapV3Pool pool = IUniswapV3Pool(factory.getPool(info.token0, info.token1, info.fee));

        (uint160 sqrtRatioX96, int24 tick, , , , , ) = pool.slot0();

        tokens[0] = info.token0;
        tokens[1] = info.token1;

        uint160 sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(info.tickLower);
        uint160 sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(info.tickUpper);
        (tokenAmounts[0], tokenAmounts[1]) = LiquidityAmounts.getAmountsForLiquidity(
            sqrtRatioX96,
            sqrtRatioAX96,
            sqrtRatioBX96,
            info.liquidity
        );
        (uint256 actualTokensOwed0, uint256 actualTokensOwed1) = UniswapV3FeesCalculation._calculateUniswapFees(
            pool,
            tick,
            info
        );
        tokenAmounts[0] += actualTokensOwed0;
        tokenAmounts[1] += actualTokensOwed1;
    }
}
