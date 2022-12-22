// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./interfaces/ICDP.sol";
import "@cdp/src/interfaces/external/univ3/IUniswapV3Pool.sol";
import "@cdp/src/interfaces/external/univ3/INonfungiblePositionManager.sol";
import "./interfaces/IUniswapV3FlashCallback.sol";
import "./interfaces/IWETH.sol";

contract Bot is IUniswapV3FlashCallback {
    address[] public pools;

    /// @notice the structure containing all information needed for flashloan + liquidation
    /// @param vaultId id of the position in CDP contract
    /// @param debt amount of the loan (in BOB wei) needed to liquidate the position
    /// @param nfts all positions nfts
    /// @param swapAddresses the addresses of other contracts, needed to execute swaps
    /// @param swapData the data for external calls (abi.encodeWithSelector(selector, arg))
    /// @param positionManager the address of UniV3 position manager, needed to burn all positions
    /// @param cdp the address of cdp contract
    /// @param token the bob address
    struct FlashCallbackData {
        uint256 vaultId;
        uint256 debt;
        uint256[] nfts;
        address[] swapAddresses;
        bytes[] swapData;
        INonfungiblePositionManager positionManager;
        ICDP cdp;
        IERC20 token;
    }

    constructor(address[] memory pools_) {
        pools = pools_;
    }

    /// @notice liquidating CDP position without frontrun liquidity
    /// @param pool the address of uniV3 pool for flashloan
    /// @param flashData the data passed to flashloan callback
    /// @param recepient the address of beneficiar
    /// @return earnings amount of tokens earned via liquidation
    function liquidate(
        IUniswapV3Pool pool,
        FlashCallbackData calldata flashData,
        address recepient,
        bool isZeroToken
    ) public returns (uint256 earnings) {
        uint256 debt = flashData.cdp.getOverallDebt(flashData.vaultId);
        uint256[] memory actualNfts = flashData.cdp.vaultNftsById(flashData.vaultId);
        require(actualNfts.length == flashData.nfts.length, "wrong NFT list");
        for (uint256 i = 0; i < actualNfts.length; ++i) {
            require(actualNfts[i] == flashData.nfts[i], "wrong NFT list");
        }
        require(debt >= flashData.cdp.calculateVaultAdjustedCollateral(flashData.vaultId), "vault is healthy");

        // liquidation itself
        bytes memory data = abi.encode(flashData);
        if (isZeroToken) {
            pool.flash(address(this), flashData.debt, 0, data);
        } else {
            pool.flash(address(this), 0, flashData.debt, data);
        }

        // return earnings
        IERC20 token = flashData.token;
        earnings = token.balanceOf(address(this));
        token.transfer(recepient, earnings);
    }

    /// @inheritdoc IUniswapV3FlashCallback
    function uniswapV3FlashCallback(uint256 fee0, uint256 fee1, bytes calldata data) external {
        bool senderAuthorized;
        for (uint256 i = 0; i < pools.length; i++) {
            if (msg.sender == pools[i]) {
                senderAuthorized = true;
            }
        }
        require(senderAuthorized, "not authorized");
        FlashCallbackData memory decoded = abi.decode(data, (FlashCallbackData));

        // liquidate
        ICDP cdp = decoded.cdp;
        decoded.token.approve(address(cdp), decoded.debt);
        cdp.liquidate(decoded.vaultId);

        // close all contracts positions
        for (uint256 i = 0; i < decoded.nfts.length; i++) {
            closeUniV3Position(decoded.nfts[i], decoded.positionManager);
        }

        // swapping all tokens for the bob
        executeCalls(decoded.swapAddresses, decoded.swapData);

        // repay debt
        if (fee0 > 0) {
            decoded.token.transfer(msg.sender, decoded.debt + fee0);
        }
        if (fee1 > 0) {
            decoded.token.transfer(msg.sender, decoded.debt + fee1);
        }
    }

    /// @notice just wraps eth to swap it later
    /// @param weth the address of weth contract
    function wrapEth(address weth) public {
        IWETH(weth).deposit{value: address(this).balance}();
    }

    /// @notice executes external calls (it is expected to be swaps to bob)
    /// if one of the calls reverts, the whole function reverts
    /// @param swapAddresses the addresses of other contracts, needed to execute swaps
    /// @param swapData the data for external calls (abi.encodeWithSelector(selector, arg))
    function executeCalls(address[] memory swapAddresses, bytes[] memory swapData) internal {
        for (uint256 i = 0; i < swapAddresses.length; i++) {
            (bool res, bytes memory returndata) = swapAddresses[i].call(swapData[i]);
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
        (, , , , , , , uint128 liquidity, , , , ) = positionManager.positions(nft);
        positionManager.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: nft,
                liquidity: liquidity,
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
}
