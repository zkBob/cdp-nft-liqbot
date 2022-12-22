// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

interface ICDP {
    // -------------------  EXTERNAL, MUTATING  -------------------

    /// @notice Liquidate a vault
    /// @param vaultId Id of the vault subject to liquidation
    function liquidate(uint256 vaultId) external;

    // -------------------  EXTERNAL, VIEW  -------------------

    /// @notice Get all NFTs, managed by vault with given id
    /// @param vaultId Id of the vault
    /// @return uint256[] Array of NFTs, managed by vault
    function vaultNftsById(uint256 vaultId) external view returns (uint256[] memory);

    /// @notice Get total debt for a given vault by id (including fees)
    /// @param vaultId Id of the vault
    /// @return uint256 Total debt value (in weis)
    function getOverallDebt(uint256 vaultId) external view returns (uint256);

    /// @notice Calculate adjusted collateral for a given vault (token capitals of each specific collateral in the vault in MUSD weis)
    /// @param vaultId Id of the vault
    /// @return uint256 Adjusted collateral
    function calculateVaultAdjustedCollateral(uint256 vaultId) external view returns (uint256);
}
