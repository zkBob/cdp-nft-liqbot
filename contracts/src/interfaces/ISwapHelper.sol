// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";

interface ISwapHelper {
    function swap(IERC20 srcToken, uint256 amount, bytes calldata) external returns (uint256);
}
