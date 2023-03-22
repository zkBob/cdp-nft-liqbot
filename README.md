# Liquidation Bot for CDP Module
This is a bot designed to monitor and execute liquidation actions for a Collateralized Debt Position (CDP) module in a blockchain-based system. The bot consists of two parts: a smart contract that allows flashloan borrowing, and a script for executing liquidations.

## How it Works
The bot constantly monitors the health of the CDPs in the system, querying data from The Graph to check factors such as collateralization ratio and outstanding debt. When a CDP is identified as being at risk of becoming undercollateralized, the bot will initiate the liquidation process.

The liquidation process involves using a portion of the CDP's collateral to pay off the outstanding debt. The bot will use a flashloan to borrow the necessary amount of tokens to repay, and then initiate a sell order for the collateral in the open market via 1inch API.

## Getting started
Create `.env` file following `.env.example` for proper testing

Run `yarn test` for running all tests.

Run `yarn test:better` if you also set `ETHERSCAN_API_KEY`. This command allow showing readable trace for external contracts.

## References
* [Subgraph repository](https://github.com/zkBob/cdp-nft-subgraph): contains the graph manifest for data indexing
* [CDP repository](https://github.com/zkBob/bob-cdp-contracts): implementation of CDP module
