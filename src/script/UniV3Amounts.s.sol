// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../helpers/UniV3Amounts.sol";

contract Deployment is Script {
    function run() external {
        vm.startBroadcast();
        UniV3Amounts uniV3Amounts = new UniV3Amounts();
        (address[2] memory tokens, uint256[2] memory amounts) = uniV3Amounts.getAmounts(
            51647,
            INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88)
        );
        console2.log("Contract: ", address(uniV3Amounts));
        console2.log("Token0: ", tokens[0]);
        console2.log("Token1: ", tokens[1]);
        console2.log("Amount0: ", amounts[0]);
        console2.log("Amount1: ", amounts[1]);
        vm.stopBroadcast();
    }
}
