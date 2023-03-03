// SPDX-License-Identifer: MIT
pragma solidity ^0.8.0;

import "./SingletonFactory.sol";

address constant deployer = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
// address constant deployer = 0xCDF6A56853C2D5FCaaF18fE20C3e3C043cC884E6;
address constant maticOracle = 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0;
address constant ethOracle = 0xF9680D99D6C9589e2a93a78A04A279e509205945;
address constant wmatic = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
address constant weth = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
address constant positionManager = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
uint32 constant DENOMINATOR = 10 ** 9;
address constant pool = 0x167384319B41F7094e62f7506409Eb38079AbfF8;
address constant router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
SingletonFactory constant factory = SingletonFactory(0xce0042B868300000d44A59004Da54A005ffdcf9f);
