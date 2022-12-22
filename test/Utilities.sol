// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Vm.sol";
import "forge-std/Test.sol";
import "@cdp/src/Vault.sol";
import "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import "@cdp/src/interfaces/external/univ3/IUniswapV3Pool.sol";
import "@cdp/src/interfaces/external/univ3/ISwapRouter.sol";
import "@cdp/src/interfaces/external/univ3/IUniswapV3Factory.sol";
import "@cdp/src/interfaces/external/univ3/INonfungiblePositionManager.sol";
import "@cdp/src/interfaces/external/univ3/IUniswapV3Pool.sol";
import "./BotConfig.sol";
import "../src/Bot.sol";
import "../src/helpers/UniV3Helper.sol";

//common utilities for forge tests
contract Utilities is Test, BotConfig {
    bytes32 internal nextUser = keccak256(abi.encodePacked("user address"));

    function getNextUserAddress() public returns (address payable) {
        //bytes32 to address conversion
        address payable user = payable(address(uint160(uint256(nextUser))));
        nextUser = keccak256(abi.encodePacked(nextUser));
        return user;
    }

    //create users with 100 ether balance
    function createUsers(uint256 userNum) public returns (address payable[] memory) {
        address payable[] memory users = new address payable[](userNum);
        for (uint256 i = 0; i < userNum; i++) {
            address payable user = this.getNextUserAddress();
            vm.deal(user, 100 ether);
            users[i] = user;
        }
        return users;
    }

    //assert that two uints are approximately equal. tolerance in 1/10th of a percent
    function assertApproxEqual(uint256 expected, uint256 actual, uint256 tolerance) public {
        uint256 leftBound = (expected * (1000 - tolerance)) / 1000;
        uint256 rightBound = (expected * (1000 + tolerance)) / 1000;
        assertTrue(leftBound <= actual && actual <= rightBound);
    }

    //move block.number forward by a given number of blocks
    function mineBlocks(uint256 numBlocks) public {
        uint256 targetBlock = block.number + numBlocks;
        vm.roll(targetBlock);
    }

    function getLength(address[] memory arr) public pure returns (uint256 len) {
        assembly {
            len := mload(add(arr, 0))
        }
    }

    function getLength(uint256[] memory arr) public pure returns (uint256 len) {
        assembly {
            len := mload(add(arr, 0))
        }
    }

    function makeSwap(address token0, address token1, uint256 amount) public returns (uint256 amountOut) {
        ISwapRouter swapRouter = ISwapRouter(SwapRouter);
        deal(token0, address(this), amount);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: token0,
            tokenOut: token1,
            fee: 3000,
            recipient: address(this),
            deadline: type(uint256).max,
            amountIn: amount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        return swapRouter.exactInputSingle(params);
    }

    function openUniV3Position(
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1,
        address recepient
    ) public returns (uint256) {
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
            (amount0, amount1) = (amount1, amount0);
        }

        INonfungiblePositionManager positionManager = INonfungiblePositionManager(UniV3PositionManager);
        IUniswapV3Pool pool = IUniswapV3Pool(IUniswapV3Factory(UniV3Factory).getPool(token0, token1, 100));

        deal(token0, address(this), amount0 * 100);
        deal(token1, address(this), amount1 * 100);
        vm.deal(address(this), 1 ether);

        (, int24 currentTick, , , , , ) = pool.slot0();
        currentTick -= currentTick % 60;
        (uint256 tokenId, , , ) = positionManager.mint(
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: 100,
                tickLower: currentTick - 120,
                tickUpper: currentTick + 120,
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: recepient,
                deadline: type(uint256).max
            })
        );

        return tokenId;
    }

    function buildSwapData(
        address bot,
        address tokenFrom,
        address tokenTo,
        uint24 fee
    ) public view returns (bytes memory) {
        address pool = IUniswapV3Factory(UniV3Factory).getPool(tokenFrom, tokenTo, fee);
        bool flag = IUniswapV3Pool(pool).token0() == tokenFrom;
        uint256[] memory pools = new uint256[](1);
        pools[0] = uint256(uint160(pool));
        if (!flag) {
            pools[0] += (1 << 255);
        }
        return
            abi.encodeWithSelector(
                UniV3Helper.uniswapV3SwapTo.selector,
                tokenFrom,
                OneInchAggregator,
                100,
                bot,
                0,
                pools
            );
    }

    function liquidate(
        uint256 vaultId,
        uint256[] memory nfts,
        UniV3Helper helper,
        Vault cdp,
        Bot bot,
        address pool
    ) public {
        // TODO: Add calculation
        uint256 debt = 1533280164485283615600;
        address[] memory swapAddresses = new address[](4);
        swapAddresses[0] = address(usdc);
        swapAddresses[1] = address(wmatic);
        swapAddresses[2] = address(helper);
        swapAddresses[3] = address(helper);
        bytes[] memory swapData = new bytes[](4);
        swapData[0] = abi.encodeWithSelector(IERC20.approve.selector, address(helper), type(uint256).max);
        swapData[1] = abi.encodeWithSelector(IERC20.approve.selector, address(helper), type(uint256).max);
        swapData[2] = buildSwapData(address(bot), usdc, wmatic, 500);
        swapData[3] = buildSwapData(address(bot), wmatic, bob, 500);
        Bot.FlashCallbackData memory flashData = Bot.FlashCallbackData({
            vaultId: vaultId,
            debt: debt,
            nfts: nfts,
            swapAddresses: swapAddresses,
            swapData: swapData,
            positionManager: INonfungiblePositionManager(UniV3PositionManager),
            cdp: ICDP(address(cdp)),
            token: cdp.token()
        });
        bot.liquidate(IUniswapV3Pool(pool), flashData, address(this), false);
    }
}
