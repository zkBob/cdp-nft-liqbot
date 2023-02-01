// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "forge-std/console2.sol";
import "./interfaces/IUniswapV3Factory.sol";

contract Deployment is Script {
    function run() external {
        IUniswapV3Factory factory = IUniswapV3Factory(address(0x1F98431c8aD98523631AE4a59f267346ea31F984));
        address bob = address(0x7F33De9781De5764B1F1992F16116323220a5445);
        address usdc = address(0x1F2cd0D7E5a7d8fE41f886063E9F11A05dE217Fa);
        address wbtc = address(0x34852e54D9B4Ec4325C7344C28b584Ce972e5E62);
        vm.startBroadcast();
        console2.log("BOB / USDC pool: ", factory.createPool(bob, usdc, 3000));
        console2.log("BOB / WBTC pool: ", factory.createPool(bob, wbtc, 3000));
        vm.stopBroadcast();
    }
}
