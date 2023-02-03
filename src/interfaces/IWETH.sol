// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
}
