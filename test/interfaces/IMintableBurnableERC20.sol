// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMintableBurnableERC20 {
    function mint(address to, uint256 amount) external;

    function burn(uint256 amount) external;

    function updateMinter(address _account, bool _canMint, bool _canBurn) external;
}
