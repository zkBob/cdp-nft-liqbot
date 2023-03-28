// SPDX-License-Identifer
pragma solidity ^0.8.0;

import {INonfungiblePositionLoader} from "@cdp/src/interfaces/external/univ3/INonfungiblePositionLoader.sol";
import {INonfungiblePositionManager} from "@univ3-periphery/interfaces/INonfungiblePositionManager.sol";
import "@univ3-core/interfaces/IUniswapV3Pool.sol";
import "@univ3-core/interfaces/IUniswapV3Factory.sol";
import "@univ3-periphery/libraries/LiquidityAmounts.sol";
import "@univ3-core/libraries/TickMath.sol";
import "@cdp/src/libraries/UniswapV3FeesCalculation.sol";

contract UniV3Amounts {
    /// @notice calculating actual amounts of tokens in the position
    /// @param nft positon nft
    /// @param positionLoader address of positionManager
    /// @return tokens array of tokens in the position
    /// @return tokenAmounts array of amounts of the corresponding tokens
    function getAmounts(
        uint256 nft,
        INonfungiblePositionLoader positionLoader
    ) external view returns (address[2] memory tokens, uint256[2] memory tokenAmounts) {
        IUniswapV3Factory factory = IUniswapV3Factory(INonfungiblePositionManager(address(positionLoader)).factory());
        INonfungiblePositionLoader.PositionInfo memory info = positionLoader.positions(nft);
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
