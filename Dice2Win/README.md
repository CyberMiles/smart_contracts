# Dice2Win -- an open source smart contract based gambling game on blockchain

  

In this example, we will be deploying a game originally designed for Ethereum onto the Travis Testnet.

  

Dice2Win is a gambling application that allows players to gamble their ethereum for a potential payout. The web interface can be accessed at http://dice2.win

The open source code for the game can be found: <[https://github.com/dice2-win/contracts/blob/master/Dice2Win.sol](https://ethfiddle.com/09YbyJRfiI)>

  

or in the `/Dice2Win/contracts` subdirectory.

  

## Deployment

  

### 1.Truffle framework

  

Using the Solidity compiler for getting the information to deploy in the Travis console is the 'classic' way of deployment, as we tried for simple contracts like 'HelloWorld' in the other subdirectory; however, for more complicated projects like this, Truffle is highly recommended to simplify the process.

  

If you haven't yet installed it, check out the tutorial here: <[http://truffleframework.com/docs/getting_started/installation](http://truffleframework.com/docs/getting_started/installation)>

  

Create a new directory and run `init truffle` inside the directory. Copy or create a `.sol` file of the source code in the `/contracts` subdirectory (*NOT* the same as `build/contracts`). Then you will need to specify deployment configuration in `migrations/2_deploy_contracts.js`.

  

```

var Dice2Win = artifacts.require("./Dice2Win.sol");

module.exports = function(deployer) {
  deployer.deploy(Dice2Win);
};

```
  

This will deploy the contracts one by one in the specified order. Make sure the parameters you pass for the constructors are valid.


Then configure the networks in `truffle.js` file:

  

```
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration
  networks: {
    testnet: {
    host: "localhost",
    port: 8545,
    network_id: 3,
    from: "0xFROM_ADDRESS",
    gas: 2000000,
        gasPrice: 10000000000
    }
  }
};
```

  

Make sure the amount of gas is sufficient and the address of `from` section is the default account (check `cmt.defaultAccount` or set it to a valid address with sufficient balance) in your Travis console.

  

Run `truffle compile` from the initialized directory and then`truffle migrate --network testnet` to deploy. Make sure you have a running synced up Travis node, attached to Travis network with `travis attach http://localhost:8545`and unlocked your default account with `personal.unlockAccount(cmt.accounts[0])` before deployment (normally unlocking is needed before every `migrate`).

  

The results should be similar to:

  

```
truffle migrate --network testnet

Using network 'testnet'.
  
Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0x77396630afbd2eb4b696b533aa41b9718c61a2a964577f861f58112bad866ebe
  Migrations: 0xbb81fbe1eef8b210072b272537d54a4313e8038d
Saving successful migration to network...
  ... 0xc1625bf598ea3479e64e0fa67dc8bef0a59dd9d14e84c8d2f388bdf5d2ba4259
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing Dice2Win...
  ... 0x6c15229ea4c4053d4dac9dc0d6aa144ad97182ded652ae66fafee5e583e3ccdb
  Dice2Win: 0x632dccb8cf3880831e7ed7a23997f1e76df49dc4
Saving artifacts...

```


  

## Interacting with the deployed contracts

To interact with the smart contracts we will use abstraction from the truffle console.

Start the truffle console by entering `truffle console --network testnet`

To be continued soon...


