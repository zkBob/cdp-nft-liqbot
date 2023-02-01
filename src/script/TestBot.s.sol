// // SPDX-License-Identifer: MIT
// pragma solidity ^0.8.0;

// import "@cdp-lib/FullMath.sol";
// import "@cdp/src/interfaces/ICDP.sol";
// import "forge-std/Script.sol";
// import "forge-std/console2.sol";
// import "../Bot.sol";
// import "../helpers/UniV3Helper.sol";
// import "./interfaces/IUniswapV3Factory.sol";
// import "./interfaces/IUniswapV3Pool.sol";
// import "./Env.s.sol";

// contract Test is Script {
//     function run() external {
//         // Bot bot = Bot(0x772c2c271f155B89632c72074fa04e9d2B03c3f0);
//         IERC20 bob = IERC20(0x7F33De9781De5764B1F1992F16116323220a5445);
//         address executor = 0xCDF6A56853C2D5FCaaF18fE20C3e3C043cC884E6;
//         ICDP cdp = ICDP(0xe0338003e3f11385266478525aa12435e8F24b33);
//         uint256 DENOMINATOR = 10 ** 9;

//         vm.startBroadcast();
//         // Bot bot = new Bot(admin, minter);
//         UniV3Helper helper = new UniV3Helper();
//         console2.log("Helper: ", address(helper));

//         // (uint256 collateral, ) = cdp.calculateVaultCollateral(1);

//         // console2.log("Collateral: ", collateral);
//         // ICDP.ProtocolParams memory params = cdp.protocolParams();
//         // uint256[] memory nfts = cdp.vaultNftsById(1);
//         // address[] memory swapAddresses = new address[](4);
//         // swapAddresses[0] = address(0x34852e54D9B4Ec4325C7344C28b584Ce972e5E62);
//         // swapAddresses[1] = address(0x1F2cd0D7E5a7d8fE41f886063E9F11A05dE217Fa);
//         // swapAddresses[2] = address(helper);
//         // swapAddresses[3] = address(helper);

//         // bytes[] memory swapData = new bytes[](4);
//         // swapData[0] = abi.encodeWithSelector(IERC20.approve.selector, address(helper), type(uint256).max);
//         // swapData[1] = abi.encodeWithSelector(IERC20.approve.selector, address(helper), type(uint256).max);
//         // swapData[2] = buildSwapData(address(bot), address(0x1F2cd0D7E5a7d8fE41f886063E9F11A05dE217Fa), address(bob), 3000);
//         // swapData[3] = buildSwapData(address(bot), address(0x34852e54D9B4Ec4325C7344C28b584Ce972e5E62), address(bob), 3000);
 
//         // Bot.FlashCallbackData memory data = Bot.FlashCallbackData({
//         //     vaultId: 1,
//         //     debt: FullMath.mulDiv(DENOMINATOR - params.liquidationPremiumD, collateral, DENOMINATOR),
//         //     nfts: nfts,
//         //     swapAddresses: swapAddresses,
//         //     swapData: swapData,
//         //     positionManager: INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88),
//         //     cdp: ICDP(0xe0338003e3f11385266478525aa12435e8F24b33)
//         // });

//         // // // liquidation
//         // uint256 balanceBefore = bob.balanceOf(executor);
//         // bot.liquidate(
//         //     IERC3156FlashLender(0x80eB645C501a6E2EaA4c17263F6ea68C9882a498),
//         //     bob,
//         //     data,
//         //     0xCDF6A56853C2D5FCaaF18fE20C3e3C043cC884E6
//         // );
//         // uint256 balanceAfter = bob.balanceOf(executor);
//         // console2.log("Earned: ", balanceAfter - balanceBefore);
//         vm.stopBroadcast();
//     }

//     function buildSwapData(
//         address bot,
//         address tokenFrom,
//         address tokenTo,
//         uint24 fee
//     ) public view returns (bytes memory) {
//         address pool = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984).getPool(tokenFrom, tokenTo, fee);
//         bool flag = IUniswapV3Pool(pool).token0() == tokenFrom;
//         uint256[] memory pools = new uint256[](1);
//         pools[0] = uint256(uint160(pool));
//         if (!flag) {
//             pools[0] += (1 << 255);
//         }
//         return 
//             abi.encodeWithSelector(
//                 UniV3Helper.uniswapV3SwapTo.selector,
//                 tokenFrom,
//                 0xF14d5639F05e9DFA8526fAE1EE21b2F9B070aC4f,
//                 100,
//                 bot,
//                 0,
//                 pools
//             );
//     }

// }