// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@univ3-core/interfaces/IUniswapV3Factory.sol";
import "@univ3-core/interfaces/IUniswapV3Pool.sol";
import {NonfungiblePositionManager, INonfungiblePositionManager} from "@univ3-periphery/NonfungiblePositionManager.sol";
import {IERC20} from "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC20.sol";
import {ChainlinkOracle} from "@cdp/src/oracles/ChainlinkOracle.sol";
import {BobToken} from "@zkbob/BobToken.sol";
import {EIP1967Proxy} from "@zkbob/proxy/EIP1967Proxy.sol";
import "@univ3-core/libraries/FullMath.sol";
import "@univ3-core/libraries/FixedPoint96.sol";
import "@cdp/lib/openzeppelin-contracts/contracts/utils/math/Math.sol";
import "@cdp/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../src/test-deployment/Deployment.sol";
import "../src/Bot.sol";
import "../src/helpers/UniV3Amounts.sol";

contract GasEstimationTest is Test, Deployment {
    struct SwapJson {
        bytes data;
        address to;
        address token;
    }

    struct SwapData {
        address to;
        bytes data;
    }

    Bot bot;
    address[] tokens;
    ChainlinkOracle oracle;
    address[] pools;
    uint256[] vaults;
    address uniFactory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address positionManager = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    address constant router = 0x1111111254EEB25477B68fb85Ed929f73A960582;
    Vault cdp;
    MockOracle cdpOracle;
    address flashMinter;
    address bob = 0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B;
    uint32 DENOMINATOR = 10 ** 9;
    mapping(address => SwapData) swapData;

    function setUp() external {
        setTokens();
        setOracles();
        setPools();
        deployAll();
        mintVaults();
        for (uint256 i = 0; i < tokens.length; ++i) {
            (, uint256 price) = cdpOracle.price(tokens[i]);
            cdpOracle.setPrice(tokens[i], price / 2);
        }
        for (uint256 i = 0; i < tokens.length; ++i) {
            bot.approve(IERC20(tokens[i]), router, type(uint256).max);
        }
        setSwaps();
    }

    function setTokens() internal {
        tokens = new address[](10);
        tokens[0] = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270; // wmatic
        tokens[1] = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // usdc
        tokens[2] = 0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6; // wbtc
        tokens[3] = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F; // usdt
        tokens[4] = 0xb33EaAd8d922B1083446DC23f610c2567fB5180f; // uni
        tokens[5] = 0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7; // busd
        tokens[6] = 0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89; // frax
        tokens[7] = 0xD6DF932A45C0f255f85145f286eA0b292B21C90B; // aave
        tokens[8] = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063; // DAI
        tokens[9] = 0x5fe2B58c013d7601147DcdD68C143A77499f5531; // GRT
    }

    function setOracles() internal {
        address[] memory oracles = new address[](10);
        oracles[0] = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
        oracles[1] = 0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7;
        oracles[2] = 0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6;
        oracles[3] = 0x0A6513e40db6EB1b165753AD52E80663aeA50545;
        oracles[4] = 0xdf0Fb4e4F928d2dCB76f438575fDD8682386e13C;
        oracles[5] = 0xE0dC07D5ED74741CeeDA61284eE56a2A0f7A4Cc9;
        oracles[6] = 0x00DBeB1e45485d53DF7C2F0dF1Aa0b6Dc30311d3;
        oracles[7] = 0x72484B12719E23115761D5DA1646945632979bB6;
        oracles[8] = 0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D;
        oracles[9] = 0x3FabBfb300B1e2D7c9B84512fe9D30aeDF24C410;
        uint48[] memory heartbeats = new uint48[](10);
        for (uint256 i = 0; i < heartbeats.length; ++i) {
            heartbeats[i] = 1 days;
        }
        oracle = new ChainlinkOracle(tokens, oracles, heartbeats, 1 days);
        cdpOracle = new MockOracle();
        for (uint256 i = 0; i < tokens.length; ++i) {
            (, uint256 priceX96) = oracle.price(tokens[i]);
            cdpOracle.setPrice(tokens[i], priceX96);
        }
    }

    function setPools() internal {
        pools = new address[](tokens.length / 2);
        for (uint256 i = 0; i < tokens.length / 2; ++i) {
            address pool = IUniswapV3Factory(uniFactory).getPool(tokens[i * 2], tokens[i * 2 + 1], 3000);
            if (address(pool) == address(0)) {
                pool = createPool(tokens[i * 2], tokens[i * 2 + 1]);
            }
            pools[i] = pool;
        }
    }

    function createPool(address token0, address token1) internal returns (address pool) {
        pool = IUniswapV3Factory(uniFactory).createPool(token0, token1, 3000);
        token0 = IUniswapV3Pool(pool).token0();
        token1 = IUniswapV3Pool(pool).token1();
        (, uint256 price0X96) = oracle.price(token0);
        (, uint256 price1X96) = oracle.price(token1);
        uint256 sqrtRatioX48 = Math.sqrt(FullMath.mulDiv(price0X96, FixedPoint96.Q96, price1X96));
        IUniswapV3Pool(pool).initialize(uint160(sqrtRatioX48) << 48);
    }

    function mintVaults() internal {
        vaults = new uint256[](pools.length);
        for (uint256 i = 0; i < pools.length; ++i) {
            uint256[] memory nfts = new uint256[](i + 1);
            for (uint256 j = 0; j < nfts.length; ++j) {
                address token0 = IUniswapV3Pool(pools[j]).token0();
                address token1 = IUniswapV3Pool(pools[j]).token1();
                (, uint256 price0X96) = oracle.price(token0);
                (, uint256 price1X96) = oracle.price(token1);
                uint256 amount0 = FullMath.mulDiv(uint256(1000 ether), FixedPoint96.Q96, price0X96);
                uint256 amount1 = FullMath.mulDiv(uint256(1000 ether), FixedPoint96.Q96, price1X96);
                deal(token0, address(this), amount0);
                deal(token1, address(this), amount1);
                IERC20(token0).approve(positionManager, amount0);
                IERC20(token1).approve(positionManager, amount1);
                (uint160 sqrtRatio, int24 origTick, , , , , ) = IUniswapV3Pool(pools[j]).slot0();
                int24 tick = TickMath.getTickAtSqrtRatio(sqrtRatio);
                tick -= tick % 60;
                INonfungiblePositionManager.MintParams memory mintParams = INonfungiblePositionManager.MintParams({
                    token0: token0,
                    token1: token1,
                    fee: 3000,
                    tickLower: tick - 300,
                    tickUpper: tick + 300,
                    amount0Desired: amount0,
                    amount1Desired: amount1,
                    amount0Min: 0,
                    amount1Min: 0,
                    recipient: address(this),
                    deadline: type(uint256).max
                });
                (nfts[j], , , ) = NonfungiblePositionManager(payable(positionManager)).mint(mintParams);
                INonfungiblePositionManager(positionManager).approve(address(cdp), nfts[j]);
            }
            vaults[i] = cdp.openVault();
            for (uint256 j = 0; j < nfts.length; ++j) {
                cdp.depositCollateral(vaults[i], nfts[j]);
            }
            (, uint256 borrowLimit, ) = cdp.calculateVaultCollateral(vaults[i]);
            cdp.mintDebt(vaults[i], (borrowLimit * 7) / 10);
        }
    }

    function deployAll() internal {
        vm.startPrank(Ownable(bob).owner());
        flashMinter = deployFlashMinter(IMintableBurnableERC20(bob));
        address treasury = deployTreasury(IMintableBurnableERC20(bob));
        address debtMinter = deployDebtMinter(IMintableBurnableERC20(bob), treasury);

        VaultRegistry registry = deployVaultRegistry(address(this));
        cdp = deployCDP(address(this), bob, positionManager, treasury, debtMinter, cdpOracle, registry);
        upgradeBob();
        vm.stopPrank();
        registry.setMinter(address(cdp), true);

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
        for (uint256 i = 0; i < pools.length; ++i) {
            cdp.setPoolParams(pools[i], params);
        }
        cdp.makeLiquidationsPublic();
        bot = deployBot(address(this), flashMinter);
        require(address(bot) == 0x8087e84897F26aF7227B14C33138AeE222e68d2f, "Bot has wrong address");
    }

    function setSwaps() internal {
        string memory rawJson = vm.readFile("contracts/test/swaps.json");
        bytes memory encoded = vm.parseJson(rawJson);
        SwapJson[] memory swaps = abi.decode(encoded, (SwapJson[]));
        for (uint256 i = 0; i < swaps.length; ++i) {
            SwapData memory data = SwapData({to: swaps[i].to, data: swaps[i].data});
            swapData[swaps[i].token] = data;
        }
    }

    function upgradeBob() internal {
        BobToken impl = new BobToken(bob);
        EIP1967Proxy(payable(bob)).upgradeTo(address(impl));
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function test1() external {
        genericTest(vaults[0]);
    }

    function test2() external {
        genericTest(vaults[1]);
    }

    function test3() external {
        genericTest(vaults[2]);
    }

    function test4() external {
        genericTest(vaults[3]);
    }

    function test5() external {
        genericTest(vaults[4]);
    }

    function genericTest(uint256 vaultId) internal {
        uint256[] memory nfts = cdp.vaultNftsById(vaultId);
        address[] memory swapAddresses = new address[](nfts.length * 2);
        bytes[] memory swapData_ = new bytes[](nfts.length * 2);
        for (uint256 i = 0; i < nfts.length; ++i) {
            SwapData memory data = swapData[tokens[i]];
            swapData_[i] = data.data;
            swapAddresses[i] = data.to;
        }
        Bot.FlashCallbackData memory flashData = Bot.FlashCallbackData({
            vaultId: vaultId,
            debt: 0,
            nfts: nfts,
            swapAddresses: swapAddresses,
            swapData: swapData_,
            positionManager: INonfungiblePositionManager(positionManager),
            cdp: ICDP(address(cdp))
        });

        bot.liquidate(IERC3156FlashLender(flashMinter), IERC20(bob), flashData, address(this));
    }
}
