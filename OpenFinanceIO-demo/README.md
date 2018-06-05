# A demo of OpenFinance S3 (Smart Securities Standard) token on Travis

OpenFinance Network is a trading platform for trading, clearing & settlement process that is designed to be "efficiency, transparency, and interoperability". Its framework contains a uniform protocol providing standardizations and regulations for assets/data. 

Know more about OpenFinance Network here: <https://www.openfinance.io/>

Or check out their GitHub repo to see source code: <https://github.com/OpenFinanceIO>

This repo shows the process of deploying a token that meets the OpenFinance S3 standard and how each requirement is implemented under the hood.

## The demo tokens

Either the RegD 506(c) or the Reg S will work as the token regulation. `demo.sol` is the demo token using RegD 506(c) as regulation and `ARegD506cToken.sol` as base (just slightly modified for space efficiency and avoiding deployment errors).

## Deployment with Truffle 

The config files are all included in the `S3Demo` folder for reference.

In the `truffle.js` you need to set the network to Travis (you can ignore the gas reporter tool). In the `migrations` folder you need to config the deployment details. 

One way to deploy it is to deploy the needed contracts one by one in Solidity. This is recommended if you want to fully implement a functional token with the framework, because the token contract contruction is based on the creation and setup of other contracts. 

However, here since it's a demo and we don't have a DApp for front end, we do it in a compressed way: deploy the needed contracts in Truffle all at once.

`demo` contract constructor needs 5 arguments as the `ARegD506cToken` does: 1 `bool`, 3 `address`, 1 `uint256`. `index_` to the corresponding security is set to be 1 initially (after `IndexConsumer` first deployed). Let `restrictor_` be the address of the `TheRegD506c` contract address--that means we use the RegD 506 (c) with basic token logic as the restrictor. And `capTables_` is the address of newly deployed `CapTables` 

We need to deploy `TheRegD506c` and `CapTables` before `demo` and pass the addresses to the deployer of `demo`. The default holding period of `TheRegD506c` is set to 12 months as required by the regulation.

After deployment, go to Travis console and initialize the total supply in `CapTables`:

```
> cap.initialize(1000000) // whatever amount...
"0x..." //transaction hash
```
Then the demo contract is ready to go. You can initialize the security by `demo.issue` and call `demo.migrate` to transfer control over the cap table to the token contract.

## Some elaborations on token & regulation logic

Once you call `demo.issue()`, the holding period of the security will start. Reg D 506 (c) requires an initial shareholder to make transactions after a 12 month holding period. The specific holding period is passed in the restrictor's constructor.

Also, the regulation requires both buyer and seller to conform AML-KYC, and the buyer must be accredited. These two requirements are declared in `UserChecker`, implemented by `SimpleUserChecker`. `RestrictedTokenLogic` is the super class of `demo` and when a `.transfer()`/`.transferFrom()` is called, methods in the super class are called so as to do the qualification check. `TransferRestrictor` is the interface containing rules about whether to approve a transfer or not. Its concrete implementation is in `TheRegD506c` and used by `RestrictedTokenLogic`. `.test()` method in `TheRegD506c` contains AML-KYC check and accreditation, implemented in `SimpleUserChecker`.

The number of shareholders restricted depends on whether a security is issued by a fund or not. If it is issued by a fund, #shareholders <= 99 ; otherwise #shareholders <= 2000. Whenever a `.transfer()`/`.transferFrom()` is called, the shareholder number changes until the upper limit is exceeded.
