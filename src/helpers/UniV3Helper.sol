// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "../interfaces/IUnoswapV3Router.sol";

contract UniV3Helper {
    function uniswapV3SwapTo(
        IERC20 srcToken,
        IUnoswapV3Router router,
        uint256 ratio,
        address payable recepient,
        uint256 minReturn,
        uint256[] calldata pools
    ) external {
        uint256 balance = srcToken.balanceOf(msg.sender);
        uint256 amount = (balance * ratio) / 100;
        srcToken.transferFrom(msg.sender, address(this), amount);
        srcToken.approve(address(router), type(uint256).max);
        router.uniswapV3SwapTo(recepient, amount, minReturn, pools);
    }
}
