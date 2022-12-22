// SPDX-License-Identifer: MIT
pragma solidity 0.8.13;

import "forge-std/Test.sol";
import "@cdp/src/Vault.sol";
import "@cdp/src/ProtocolGovernance.sol";
import "@cdp/test/mocks/MockOracle.sol";
import "@cdp/src/interfaces/IMUSD.sol";
import "@cdp/src/proxy/EIP1967Proxy.sol";
import "./BotConfig.sol";
import "./Utilities.sol";
import "../src/Bot.sol";
import "../src/helpers/UniV3Helper.sol";
import "./interfaces/IMintableBurnableERC20.sol";

contract BotPolygonTest is Test, Utilities {
    Vault cdp;
    MockOracle oracle;
    ProtocolGovernance protocolGovernance;
    address treasury;
    address[] pools;
    Bot bot;
    UniV3Helper helper;

    function setupCDP() public {
        oracle = new MockOracle();
        oracle.setPrice(wmatic, (uint256(1 << 96) * 78) / 100);
        oracle.setPrice(usdc, uint256(1 << 96) * (10 ** 12));
        protocolGovernance = new ProtocolGovernance(address(this), type(uint256).max);
        protocolGovernance.changeMaxNftsPerVault(5);
        IERC20(usdc).approve(UniV3PositionManager, type(uint256).max);
        IERC20(wmatic).approve(UniV3PositionManager, type(uint256).max);
        address tokenPool = IUniswapV3Factory(UniV3Factory).getPool(wmatic, usdc, 100);
        protocolGovernance.setWhitelistedPool(tokenPool);
        protocolGovernance.setLiquidationThreshold(tokenPool, 6e8); // 0.6 * DENOMINATOR == 60%
        treasury = getNextUserAddress();
        cdp = new Vault(
            INonfungiblePositionManager(UniV3PositionManager),
            IUniswapV3Factory(UniV3Factory),
            IProtocolGovernance(protocolGovernance),
            treasury,
            bob
        );
        bytes memory initData = abi.encodeWithSelector(Vault.initialize.selector, address(this), oracle, 10 ** 7);
        cdp = Vault(address(new EIP1967Proxy(address(this), address(cdp), initData)));
        IERC20(bob).approve(address(cdp), type(uint256).max);
        address[] memory depositors = new address[](1);
        depositors[0] = address(this);
        cdp.addDepositorsToAllowlist(depositors);
        vm.prank(bobAdmin);
        IMintableBurnableERC20(bob).updateMinter(address(cdp), true, true);
    }

    function setUp() public {
        setupCDP();
        pools = new address[](1);
        pools[0] = IUniswapV3Factory(UniV3Factory).getPool(bob, usdc, 100);
        bot = new Bot(pools);
        helper = new UniV3Helper();
    }

    function testSimple() public {
        uint256[] memory nfts = new uint256[](1);
        nfts[0] = openUniV3Position(usdc, wmatic, 700 * (10 ** 6), 1000 * (10 ** 18), address(this));
        INonfungiblePositionManager(UniV3PositionManager).approve(address(cdp), nfts[0]);
        uint256 vaultId = cdp.mintDebtFromScratch(nfts[0], 700 * (10 ** 18));
        oracle.setPrice(wmatic, uint256(1 << 96) / 10);
        uint256 balanceBefore = IERC20(bob).balanceOf(address(this));
        liquidate(vaultId, nfts, helper, cdp, bot, pools[0]);
        uint256 balanceAfter = IERC20(bob).balanceOf(address(this));
        assertGt(balanceAfter, balanceBefore + 500 * (10 ** 18));
        assertEq(IERC20(usdc).balanceOf(address(bot)), 0);
        assertEq(IERC20(wmatic).balanceOf(address(bot)), 0);
        assertEq(IERC20(bob).balanceOf(address(bot)), 0);
    }
}
