// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

abstract contract BotConfig {
    address constant UniV3PositionManager = address(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    address constant UniV3Factory = address(0x1F98431c8aD98523631AE4a59f267346ea31F984);
    address constant SwapRouter = address(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address constant bob = address(0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B);
    address constant usdc = address(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174);
    address constant wmatic = address(0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270);
    address constant bobAdmin = address(0xd4a3D9Ca00fa1fD8833D560F9217458E61c446d8);
    address constant OneInchAggregator = address(0x1111111254EEB25477B68fb85Ed929f73A960582);

    address constant chainlinkUsdc = address(0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7);

    address[] tokens = [usdc, wmatic];
    address[] chainlinkOracles = [chainlinkUsdc];
}
