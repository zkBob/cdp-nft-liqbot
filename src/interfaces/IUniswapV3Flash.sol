// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

interface IUniswapV3Pool {
    function flash(address recipient, uint256 amount0, uint256 amount1, bytes calldata data) external;
}
