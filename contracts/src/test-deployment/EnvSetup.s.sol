// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "@cdp/test/mocks/MockOracle.sol";
import {Vault} from "@cdp/src/Vault.sol";
import {ChainlinkOracle} from "@cdp/src/oracles/ChainlinkOracle.sol";
import "@univ3-periphery/interfaces/ISwapRouter.sol";
import "@zkbob/proxy/EIP1967Proxy.sol";
import "./Env.sol";
import "./WMatic.sol";
import {Token} from "./Token.sol";
import {IERC20, ICDP} from "../Bot.sol";
import "./Deployment.sol";

contract EnvSetup is Deployment {
    function run() external {
        require(tx.origin == deployer, "Deployer is different from anvil user");

        vm.startBroadcast();

        Token token = deployToken();
        address flashMinter = deployFlashMinter(IMintableBurnableERC20(address(token)));
        address treasury = deployTreasury(IMintableBurnableERC20(address(token)));
        address debtMinter = deployDebtMinter(IMintableBurnableERC20(address(token)), treasury);

        MockOracle oracle = deployOracle();
        VaultRegistry registry = deployVaultRegistry(deployer);
        Vault cdp = deployCDP(deployer, address(token), positionManager, treasury, debtMinter, oracle, registry);
        registry.setMinter(address(cdp), true);

        cdp.changeLiquidationPremium(DENOMINATOR / 2);
        cdp.changeMaxDebtPerVault(type(uint256).max);
        cdp.changeMaxNftsPerVault(uint8(5));
        ICDP.PoolParams memory params = ICDP.PoolParams({
            liquidationThreshold: (DENOMINATOR / 10) * 6,
            borrowThreshold: (DENOMINATOR / 10) * 6,
            minWidth: 0
        });
        cdp.setPoolParams(address(pool), params);
        cdp.makeLiquidationsPublic();

        mintDebt(cdp);

        (, uint256 priceMatic) = oracle.price(wmatic);
        oracle.setPrice(wmatic, priceMatic / 2);
        (, uint256 priceEth) = oracle.price(weth);
        oracle.setPrice(weth, priceEth / 2);

        Bot bot = deployBot(deployer, flashMinter);

        // approve spending for router v5
        bot.approve(IERC20(wmatic), address(0x1111111254EEB25477B68fb85Ed929f73A960582), type(uint256).max);
        bot.approve(IERC20(weth), address(0x1111111254EEB25477B68fb85Ed929f73A960582), type(uint256).max);

        // approve spending for router v4
        bot.approve(IERC20(wmatic), address(0x1111111254fb6c44bAC0beD2854e76F90643097d), type(uint256).max);
        bot.approve(IERC20(weth), address(0x1111111254fb6c44bAC0beD2854e76F90643097d), type(uint256).max);

        // approve wrapping bob in mock token
        bot.approve(IERC20(0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B), address(token), type(uint256).max);

        UniV3Amounts uniV3Amounts = deployUniV3Amounts();

        vm.stopBroadcast();

        require(address(token) == 0x8b0D0EEB49838c7ce6904A947A4345ef117Ea12b, "Wrong token address");
        require(address(flashMinter) == 0x6bba8722c6b7F0a7720b114162640f134ed9aFfa, "Wrong minter address");
        require(address(registry) == 0x14040Ff5f1579F1D4BbC1356f386091FD6937BFc, "Wrong registry address");
        require(address(cdp) == 0x1317F83e833D8604c22EB8431476c3A62e3A5f4d, "Wrong CDP address");
        require(address(bot) == 0xc136917cC604B6B1f5eD25A1024C5f67E7AF50C0, "Wrong bot address");
        require(address(uniV3Amounts) == 0x3D6f62D61FEE5D99ba1C8fEfeaC318E304CF9247, "Wrong uniV3Amounts address");

        console2.log("Token address: ", address(token));
        console2.log("Flash minter: ", address(flashMinter));
        console2.log("Registry: ", address(registry));
        console2.log("CDP: ", address(cdp));
        console2.log("Bot: ", address(bot));
        console2.log("UniV3Amounts: ", address(uniV3Amounts));
    }

    function deployToken() internal returns (Token) {
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/EIP1967Proxy.sol/EIP1967Proxy.json"),
            abi.encode(deployer, address(0xdead), "")
        );
        EIP1967Proxy proxy = EIP1967Proxy(factory.deploy(creationCode, bytes32(uint256(555))));

        Token impl = new Token(address(proxy));
        proxy.upgradeTo(address(impl));
        return Token(address(proxy));
    }

    function deployOracle() internal returns (MockOracle) {
        address[] memory tokens = new address[](2);
        tokens[0] = weth;
        tokens[1] = wmatic;
        address[] memory oracles = new address[](2);
        oracles[0] = ethOracle;
        oracles[1] = maticOracle;
        uint48[] memory heartbeats = new uint48[](2);
        heartbeats[0] = 1 hours;
        heartbeats[1] = 1 hours;
        ChainlinkOracle originalOracle = new ChainlinkOracle(tokens, oracles, heartbeats, 1 days);
        bytes memory creationCode = vm.getCode("contracts/out/MockOracle.sol/MockOracle.json");
        MockOracle oracle = MockOracle(factory.deploy(creationCode, bytes32(uint256(555))));
        (, uint256 price) = originalOracle.price(wmatic);
        oracle.setPrice(wmatic, price);
        (, price) = originalOracle.price(weth);
        oracle.setPrice(weth, price);
        return oracle;
    }

    function mintDebt(Vault cdp) internal {
        address[] memory depositors = new address[](1);
        depositors[0] = deployer;
        cdp.addDepositorsToAllowlist(depositors);
        WMATIC(wmatic).deposit{value: 9500 ether}();
        IERC20(wmatic).approve(address(router), type(uint256).max);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: wmatic,
            tokenOut: weth,
            fee: 3000,
            recipient: deployer,
            deadline: type(uint256).max,
            amountIn: 4750 ether,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        ISwapRouter(router).exactInputSingle(params);
        uint256 tokenId = mintNft();
        INonfungiblePositionManager(positionManager).approve(address(cdp), tokenId);
        uint256 vaultId = cdp.openVault();
        cdp.depositCollateral(vaultId, tokenId);
        (, uint256 adjustedCollateral, uint256 borrowLimit) = cdp.calculateVaultCollateral(vaultId);
        cdp.mintDebt(vaultId, (borrowLimit * 9) / 10);
    }

    function mintNft() internal returns (uint256) {
        IERC20(wmatic).approve(address(positionManager), type(uint256).max);
        IERC20(weth).approve(address(positionManager), type(uint256).max);
        (, int24 tick, , , , , ) = IUniswapV3Pool(pool).slot0();
        int24 tickSpacing = IUniswapV3Pool(pool).tickSpacing();
        INonfungiblePositionManager.MintParams memory mintParams = INonfungiblePositionManager.MintParams({
            token1: weth,
            token0: wmatic,
            fee: 3000,
            tickLower: tick - (tick % tickSpacing) - tickSpacing * 10,
            tickUpper: tick - (tick % tickSpacing) + tickSpacing * 10,
            amount1Desired: IERC20(weth).balanceOf(deployer),
            amount0Desired: IERC20(wmatic).balanceOf(deployer),
            amount0Min: 0,
            amount1Min: 0,
            recipient: deployer,
            deadline: type(uint256).max
        });
        (uint256 tokenId, , , ) = INonfungiblePositionManager(positionManager).mint(mintParams);
        return tokenId;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    ) external returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
