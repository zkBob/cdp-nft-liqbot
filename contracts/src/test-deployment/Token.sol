// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BobToken} from "@zkbob/BobToken.sol";
import {IERC20} from "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";

contract Token is BobToken {
    address public constant bob = 0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B;

    constructor(address _self) BobToken(_self) {}

    function wrapAll() public {
        uint256 amount = IERC20(bob).balanceOf(msg.sender);
        IERC20(bob).transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }
}
