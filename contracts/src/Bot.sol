// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {INonfungiblePositionLoader} from "@cdp/src/interfaces/external/univ3/INonfungiblePositionLoader.sol";
import {INonfungiblePositionManager} from "@univ3-periphery/interfaces/INonfungiblePositionManager.sol";
import {IERC3156FlashLender, IERC3156FlashBorrower} from "@cdp/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashLender.sol";
import {ICDP} from "@cdp/src/interfaces/ICDP.sol";
import "./interfaces/IWETH.sol";

contract Bot is IERC3156FlashBorrower {
    /// @notice minter for flashloans of BOB token
    /// it should implement IERC3156FlashLender interface
    /// used only for validation of the onFlashLoan call
    address public immutable flashMinter;

    /// @notice admin of the bot
    /// admin can execute any calls via bot
    address public immutable admin;

    /// @notice the structure containing all information needed for flashloan + liquidation
    /// @param vaultId id of the position in CDP contract
    /// @param debt amount of the loan (in BOB wei) needed to liquidate the position
    /// @param nfts all positions nfts
    /// @param swapAddresses the addresses of other contracts, needed to execute swaps
    /// @param swapData the data for external calls (abi.encodeWithSelector(selector, arg))
    /// @param positionManager the address of UniV3 position manager, needed to burn all positions
    /// @param cdp the address of cdp contract
    struct FlashCallbackData {
        uint256 vaultId;
        uint256 debt;
        uint256[] nfts;
        address[] swapAddresses;
        bytes[] swapData;
        INonfungiblePositionManager positionManager;
        ICDP cdp;
    }

    /// @param admin_ admin address
    /// @param flashMinter_ flashMinter address
    constructor(address admin_, address flashMinter_) {
        admin = admin_;
        flashMinter = flashMinter_;
    }

    /// @notice liquidating CDP position without frontrun liquidity
    /// @param lender address of flashloan minter
    /// @param token address of token for liquidation (in our case it is BOB)
    /// @param flashData data passed to flashloan callback
    /// @param recipient address of beneficiar
    /// @return earnings amount of tokens earned via liquidation
    function liquidate(
        IERC3156FlashLender lender,
        IERC20 token,
        FlashCallbackData memory flashData,
        address recipient
    ) public isAuthorized returns (uint256 earnings) {
        uint256 debt = flashData.cdp.getOverallDebt(flashData.vaultId);
        if (flashData.debt < debt) {
            flashData.debt = debt;
        }
        // liquidation itself
        bytes memory data = abi.encode(flashData);
        lender.flashLoan(this, address(token), flashData.debt, data);

        // return earnings
        earnings = token.balanceOf(address(this));
        token.transfer(recipient, earnings);
    }

    /// @inheritdoc IERC3156FlashBorrower
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external isAuthorized returns (bytes32) {
        FlashCallbackData memory decoded = abi.decode(data, (FlashCallbackData));
        require(initiator == address(this), "not authorized");

        // liquidate
        ICDP cdp = decoded.cdp;
        IERC20(token).approve(address(cdp), decoded.debt);
        cdp.liquidate(decoded.vaultId);

        // close all contracts positions
        for (uint256 i = 0; i < decoded.nfts.length; i++) {
            closeUniV3Position(decoded.nfts[i], decoded.positionManager);
        }

        // swapping all tokens for the bob
        executeCalls(decoded.swapAddresses, decoded.swapData);

        require(IERC20(token).balanceOf(address(this)) >= amount + fee, "Not enough tokens after swaps");
        IERC20(token).approve(msg.sender, amount + fee);
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }

    /// @notice just wraps eth to swap it later, can be called by the bot itself or by the admin
    /// it can also be called by the flashMinter, but a flashLoan contract don't use this method
    /// @param weth the address of weth contract
    function wrapEth(address weth) public isAuthorized {
        IWETH(weth).deposit{value: address(this).balance}();
    }

    /// @notice gives allowance to spend tokens
    /// @param token the token address to spend
    /// @param to the address to give allowance
    /// @param amount the allowed amount to spend
    function approve(IERC20 token, address to, uint256 amount) external isAuthorized {
        token.approve(to, amount);
    }

    /// @notice executes external calls (it is expected to be swaps to bob)
    /// if one of the calls reverts, the whole function reverts
    /// @param addresses the addresses of other contracts, needed to execute methods
    /// @param data the data for external calls (abi.encodeWithSelector(selector, arg))
    function executeCalls(address[] memory addresses, bytes[] memory data) public isAuthorized {
        for (uint256 i = 0; i < addresses.length; i++) {
            (bool res, bytes memory returndata) = addresses[i].call(data[i]);
            if (!res) {
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            }
        }
    }

    /// @notice closes the uniV3 position
    /// @param nft the position nft
    /// @param positionManager the address of uniV3 position manager
    function closeUniV3Position(uint256 nft, INonfungiblePositionManager positionManager) internal {
        INonfungiblePositionLoader.PositionInfo memory info = INonfungiblePositionLoader(address(positionManager))
            .positions(nft);
        positionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: nft,
                liquidity: info.liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: type(uint256).max
            })
        );
        positionManager.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: nft,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );
        positionManager.burn(nft);
    }

    /// @notice checks that the caller is admin, flashMinter or the contract itself
    modifier isAuthorized() {
        require(msg.sender == address(this) || msg.sender == admin || msg.sender == flashMinter, "not authorized");
        _;
    }
}
