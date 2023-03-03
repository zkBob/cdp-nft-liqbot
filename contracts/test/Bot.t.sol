// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import {Vault} from "@cdp/src/Vault.sol";
import "@cdp/src/VaultRegistry.sol";
import "@cdp/src/oracles/UniV3Oracle.sol";
import "@cdp/test/mocks/MockOracle.sol";
import {EIP1967Proxy} from "@zkbob/proxy/EIP1967Proxy.sol";
import {BobToken} from "@zkbob/BobToken.sol";
import "./BotConfig.sol";
import "./Utilities.sol";
import {FlashMinter} from "@zkbob/minters/FlashMinter.sol";
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
    address flashMinter;
    uint32 DENOMINATOR = 10 ** 9;

    function setupCDP() public {
        oracle = new MockOracle();
        oracle.setPrice(wmatic, (uint256(1 << 96) * 78) / 100);
        oracle.setPrice(usdc, uint256(1 << 96) * (10 ** 12));
        address tokenPool = IUniswapV3Factory(UniV3Factory).getPool(wmatic, usdc, 100);

        vm.startPrank(Ownable(bob).owner());
        flashMinter = deployFlashMinter(IMintableBurnableERC20(bob));
        address treasury = deployTreasury(IMintableBurnableERC20(bob));
        address debtMinter = deployDebtMinter(IMintableBurnableERC20(bob), treasury);

        VaultRegistry registry = deployVaultRegistry(address(this));
        cdp = deployCDP(address(this), bob, UniV3PositionManager, treasury, debtMinter, oracle, registry);
        vm.stopPrank();
        registry.setMinter(address(cdp), true);
        IERC20(bob).approve(address(cdp), type(uint256).max);

        address[] memory depositors = new address[](1);
        depositors[0] = address(this);
        cdp.addDepositorsToAllowlist(depositors);
        cdp.changeLiquidationPremium(DENOMINATOR / 2);
        cdp.changeMaxDebtPerVault(type(uint256).max);
        cdp.changeMaxNftsPerVault(uint8(5));
        ICDP.PoolParams memory params = ICDP.PoolParams({
            liquidationThreshold: (DENOMINATOR / 10) * 6,
            borrowThreshold: (DENOMINATOR / 10) * 6,
            minWidth: 0
        });
        cdp.setPoolParams(tokenPool, params);
        cdp.makeLiquidationsPublic();
    }

    function upgradeBob() public {
        BobToken impl = new BobToken(bob);
        vm.startPrank(Ownable(bob).owner());
        EIP1967Proxy(payable(bob)).upgradeTo(address(impl));
        vm.stopPrank();
    }

    function setUp() public {
        upgradeBob();
        setupCDP();
        bot = new Bot(address(this), flashMinter);
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
        liquidate(vaultId, nfts, uniHelper, pathHelper, cdp, bot, flashMinter);
        uint256 balanceAfter = IERC20(bob).balanceOf(address(this));
        assertGt(balanceAfter, balanceBefore + 500 * (10 ** 18));
        assertEq(IERC20(usdc).balanceOf(address(bot)), 0);
        assertEq(IERC20(wmatic).balanceOf(address(bot)), 0);
        assertEq(IERC20(bob).balanceOf(address(bot)), 0);
    }
}
