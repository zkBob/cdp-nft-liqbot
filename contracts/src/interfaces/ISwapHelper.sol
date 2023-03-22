// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";

interface ISwapHelper {
    /// @notice swaps token on uniV3 via 1inch router
    /// @param srcToken token to swap
    /// @param amount swapping amount
    /// @param data bytes encoding the route for swap
    /// @return amountOut amoun of tokens got from swap
    function swap(IERC20 srcToken, uint256 amount, bytes calldata data) external returns (uint256 amountOut);
}
