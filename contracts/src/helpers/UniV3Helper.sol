// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "../interfaces/IUnoswapV3Router.sol";
import "../interfaces/ISwapHelper.sol";

contract UniV3Helper is ISwapHelper {
    /// @inheritdoc ISwapHelper
    function swap(IERC20 srcToken, uint256 amount, bytes calldata data) external returns (uint256) {
        (uint256[] memory pools, address router) = abi.decode(data, (uint256[], address));
        srcToken.transferFrom(msg.sender, address(this), amount);
        return IUnoswapV3Router(router).uniswapV3SwapTo(payable(msg.sender), amount, 0, pools);
    }

    /// @notice give an approval of spending unlimited amount of tokens
    /// @param token address of the token to spend
    /// @param to address of the spender
    function approveAll(IERC20 token, address to) external {
        token.approve(to, type(uint256).max);
    }
}
