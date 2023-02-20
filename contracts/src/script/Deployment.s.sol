// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "../Bot.sol";
import "./Env.s.sol";

contract Deployment is Script {
    function run() external {
        vm.startBroadcast();
        Bot bot = new Bot(admin, minter);
        vm.stopBroadcast();
        console2.log("Bot: ", address(bot));
    }
}
