// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "../interfaces/ISwapHelper.sol";

contract PathExecutorHelper {
    /// @notice contains information about swap route
    /// @param part percent of amount to be swapped via this route
    /// @param tokenFrom address of the token to swap
    /// @param helper the address of swap helper
    /// @param data additional data for the swap
    struct SwapData {
        uint16 part;
        IERC20 tokenFrom;
        ISwapHelper helper;
        bytes data;
    }

    /// @notice swaps srcToken to destToken via route described in data
    /// @param srcToken address of the token to swap
    /// @param data array of routes describing the swaps
    /// @param destToken address of the token to receive after swap
    function swap(IERC20 srcToken, SwapData[] calldata data, IERC20 destToken) external {
        uint256 tokenFromBalance = srcToken.balanceOf(msg.sender);
        uint256 tokenToBalance;
        uint16 totalParts = 100;
        srcToken.transferFrom(msg.sender, address(this), tokenFromBalance);
        for (uint256 i = 0; i < data.length; ++i) {
            if (totalParts == 0) {
                totalParts = 100;
                tokenFromBalance = tokenToBalance;
                tokenToBalance = 0;
            }
            uint256 toSwap = (tokenFromBalance * data[i].part) / totalParts;
            totalParts -= data[i].part;
            tokenToBalance += data[i].helper.swap(data[i].tokenFrom, toSwap, data[i].data);
        }
        destToken.transfer(msg.sender, destToken.balanceOf(address(this)));
    }

    /// @notice give an approval of spending unlimited amount of tokens
    /// @param token address of the token to spend
    /// @param to address of the spender
    function approveAll(IERC20 token, address to) external {
        token.approve(to, type(uint256).max);
    }
}
