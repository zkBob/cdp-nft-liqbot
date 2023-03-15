// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../../test/interfaces/IMintableBurnableERC20.sol";
import {Bot} from "../Bot.sol";
import "@cdp/src/VaultRegistry.sol";
import "@cdp/test/mocks/MockOracle.sol";
import "@cdp/src/oracles/UniV3Oracle.sol";
import {Vault} from "@cdp/src/Vault.sol";
import {FlashMinter} from "@zkbob/minters/FlashMinter.sol";
import {DebtMinter} from "@zkbob/minters/DebtMinter.sol";
import {SurplusMinter} from "@zkbob/minters/SurplusMinter.sol";
import "./SingletonFactory.sol";
import {UniV3Amounts} from "../helpers/UniV3Amounts.sol";

contract Deployment is Script {
    SingletonFactory constant factory = SingletonFactory(0xce0042B868300000d44A59004Da54A005ffdcf9f);

    function deployTreasury(IMintableBurnableERC20 token) internal returns (address) {
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/SurplusMinter.sol/SurplusMinter.json"),
            abi.encode(address(token))
        );
        SurplusMinter treasury = new SurplusMinter(address(token));
        token.updateMinter(address(treasury), true, true);
        return address(treasury);
    }

    function deployFlashMinter(IMintableBurnableERC20 token) internal returns (address) {
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/FlashMinter.sol/FlashMinter.json"),
            abi.encode(address(token), type(uint96).max, address(0), 0, type(uint96).max)
        );
        address minter = factory.deploy(creationCode, bytes32(uint256(555)));
        token.updateMinter(minter, true, true);
        return minter;
    }

    function deployDebtMinter(IMintableBurnableERC20 token, address treasury) internal returns (address) {
        DebtMinter minter = new DebtMinter(address(token), type(uint104).max, type(uint104).max - 1000, 0, 1, treasury);
        token.updateMinter(address(minter), true, true);
        return address(minter);
    }

    function deployVaultRegistry(address admin) internal returns (VaultRegistry) {
        VaultRegistry impl = new VaultRegistry("Bob Vault Token", "BVT", "");
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/EIP1967Proxy.sol/EIP1967Proxy.json"),
            abi.encode(admin, address(impl), "")
        );
        return VaultRegistry(factory.deploy(creationCode, bytes32(uint256(555))));
    }

    function deployCDP(
        address admin,
        address token,
        address positionManager,
        address treasury,
        address debtMinter,
        IOracle oracle,
        VaultRegistry registry
    ) internal returns (Vault) {
        Vault impl = new Vault(
            INonfungiblePositionManager(positionManager),
            INFTOracle(new UniV3Oracle(positionManager, oracle, 100000000000000000)),
            treasury,
            token,
            debtMinter,
            address(registry)
        );
        bytes memory initData = abi.encodeWithSelector(Vault.initialize.selector, admin, 10 ** 9, type(uint256).max);
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/EIP1967Proxy.sol/EIP1967Proxy.json"),
            abi.encode(admin, address(impl), initData)
        );
        address cdp = factory.deploy(creationCode, bytes32(uint256(555)));
        DebtMinter(debtMinter).setMinter(cdp, true);
        SurplusMinter(treasury).setMinter(cdp, true);
        return Vault(cdp);
    }

    function deployBot(address admin, address minter) internal returns (Bot) {
        bytes memory creationCode = bytes.concat(
            vm.getCode("contracts/out/Bot.sol/Bot.json"),
            abi.encode(admin, minter)
        );
        return Bot(factory.deploy(creationCode, bytes32(uint256(555))));
    }

    function deployUniV3Amounts() internal returns (UniV3Amounts) {
        bytes memory creationCode = vm.getCode("contracts/out/UniV3Amounts.sol/UniV3Amounts.json");
        return UniV3Amounts(factory.deploy(creationCode, bytes32(uint256(555))));
    }
}
