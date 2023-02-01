// SPDX-License-Identifer: MIT
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import "@cdp/src/Vault.sol";
import "@cdp/src/VaultRegistry.sol";
import "@cdp/src/oracles/UniV3Oracle.sol";
import "@cdp/test/mocks/MockOracle.sol";
import "@cdp/src/interfaces/IMUSD.sol";
import "@cdp/src/proxy/EIP1967Proxy.sol";
import "./BotConfig.sol";
import "./Utilities.sol";
import "./FlashMinter.sol";
import "../src/Bot.sol";
import "../src/helpers/UniV3Helper.sol";
import "../src/helpers/PathExecutorHelper.sol";
import "./interfaces/IMintableBurnableERC20.sol";

contract BotPolygonTest is Test, Utilities {
    Vault cdp;
    MockOracle oracle;
    address treasury;
    Bot bot;
    UniV3Helper uniHelper;
    PathExecutorHelper pathHelper;
    FlashMinter minter;

    function setupCDP() public {
        oracle = new MockOracle();
        oracle.setPrice(wmatic, (uint256(1 << 96) * 78) / 100);
        oracle.setPrice(usdc, uint256(1 << 96) * (10 ** 12));
        IERC20(usdc).approve(UniV3PositionManager, type(uint256).max);
        IERC20(wmatic).approve(UniV3PositionManager, type(uint256).max);
        address tokenPool = IUniswapV3Factory(UniV3Factory).getPool(wmatic, usdc, 100);
        treasury = getNextUserAddress();
        cdp = new Vault(
            INonfungiblePositionManager(UniV3PositionManager),
            INFTOracle(new UniV3Oracle(INonfungiblePositionManager(UniV3PositionManager), IOracle(address(oracle)))),
            treasury,
            bob
        );
        bytes memory initData = abi.encodeWithSelector(
            Vault.initialize.selector,
            address(this),
            10 ** 7,
            (10 ** 6) * (10 ** 18)
        );
        cdp = Vault(address(new EIP1967Proxy(address(this), address(cdp), initData)));
        IERC20(bob).approve(address(cdp), type(uint256).max);
        address[] memory depositors = new address[](1);
        depositors[0] = address(this);
        cdp.addDepositorsToAllowlist(depositors);
        cdp.changeMaxNftsPerVault(5);
        cdp.setWhitelistedPool(tokenPool);
        cdp.setLiquidationThreshold(tokenPool, 6e8); // 0.6 * DENOMINATOR == 60%
        cdp.setVaultRegistry(IVaultRegistry(address(new VaultRegistry(cdp, "name", "symbol", ""))));
        minter = new FlashMinter(bob, type(uint96).max, getNextUserAddress(), 10 ** 14, type(uint96).max);
        vm.startPrank(Ownable(bob).owner());
        IMintableBurnableERC20(bob).updateMinter(address(minter), true, true);
        IMintableBurnableERC20(bob).updateMinter(address(cdp), true, true);
        vm.stopPrank();
    }

    function setUp() public {
        setupCDP();
        bot = new Bot(address(this), address(minter));
        uniHelper = new UniV3Helper();
        pathHelper = new PathExecutorHelper();
        bot.approve(IERC20(wmatic), address(pathHelper), type(uint256).max);
        bot.approve(IERC20(usdc), address(pathHelper), type(uint256).max);
        pathHelper.approveAll(IERC20(wmatic), address(uniHelper));
        pathHelper.approveAll(IERC20(usdc), address(uniHelper));
        uniHelper.approveAll(IERC20(usdc), OneInchAggregator);
        uniHelper.approveAll(IERC20(wmatic), OneInchAggregator);
    }

    function testSimple() public {
        uint256[] memory nfts = new uint256[](1);
        nfts[0] = openUniV3Position(usdc, wmatic, 700 * (10 ** 6), 1000 * (10 ** 18), address(this));
        INonfungiblePositionManager(UniV3PositionManager).approve(address(cdp), nfts[0]);
        uint256 vaultId = cdp.mintDebtFromScratch(nfts[0], 700 * (10 ** 18));
        oracle.setPrice(wmatic, uint256(1 << 96) / 10);
        uint256 balanceBefore = IERC20(bob).balanceOf(address(this));
        liquidate(vaultId, nfts, uniHelper, pathHelper, cdp, bot, address(minter));
        uint256 balanceAfter = IERC20(bob).balanceOf(address(this));
        assertGt(balanceAfter, balanceBefore + 500 * (10 ** 18));
        assertEq(IERC20(usdc).balanceOf(address(bot)), 0);
        assertEq(IERC20(wmatic).balanceOf(address(bot)), 0);
        assertEq(IERC20(bob).balanceOf(address(bot)), 0);
    }
}
