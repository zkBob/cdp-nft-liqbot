// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "./AggregationRouterV5.sol";

contract Deployment is Script {
    function run() external {
        vm.startBroadcast();
        AggregationRouterV5 router = new AggregationRouterV5(IWETH(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6));
        vm.stopBroadcast();
        console2.log("Router: ", address(router));
    }
}
