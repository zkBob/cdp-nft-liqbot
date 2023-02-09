// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "../interfaces/ISwapHelper.sol";

contract PathExecutorHelper {
    struct SwapData {
        uint16 part;
        IERC20 tokenFrom;
        ISwapHelper helper;
        bytes data;
    }

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

    function approveAll(IERC20 token, address to) external {
        token.approve(to, type(uint256).max);
    }
}
