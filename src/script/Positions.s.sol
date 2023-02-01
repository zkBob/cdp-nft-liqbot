// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/console2.sol";
import "forge-std/Script.sol";
import "@v3-periphery/INonfungiblePositionManager.sol";
import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "./interfaces/IUniswapV3Pool.sol";

contract Deployment is Script {
    function run() external {
        INonfungiblePositionManager positionManager = INonfungiblePositionManager(
            0xC36442b4a4522E871399CD717aBDD847Ab11FE88
        );
        address bob = address(0x7F33De9781De5764B1F1992F16116323220a5445);
        address usdc = address(0x1F2cd0D7E5a7d8fE41f886063E9F11A05dE217Fa);
        address wbtc = address(0x34852e54D9B4Ec4325C7344C28b584Ce972e5E62);
        vm.startBroadcast();
        IUniswapV3Pool pool = IUniswapV3Pool(0xCff43DB2EC51C8236aFC7f7f74aEcbcD20617Ee2);
        pool.initialize(1202964212346320683218091092316520448);
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: wbtc,
            token1: bob,
            fee: 3000,
            tickLower: -600000,
            tickUpper: 600000,
            amount1Desired: (10 ** 18) * (10 ** 5),
            amount0Desired: (10 ** 7),
            amount0Min: 0,
            amount1Min: 0,
            recipient: address(0xCDF6A56853C2D5FCaaF18fE20C3e3C043cC884E6),
            deadline: type(uint256).max
        });
        (uint256 tokenId, , uint256 amount0, uint256 amount1) = positionManager.mint(params);
        vm.stopBroadcast();
        console2.log("NFT: ", tokenId);
        console2.log("Amount0: ", amount0);
        console2.log("Amount1: ", amount1);
    }
}
