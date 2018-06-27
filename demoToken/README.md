# Demo Token

  

In this example, we will be deploying a demo token called "eriCoin" onto the Travis Testnet.

  

The open source code for the token can be found in the `/demoToken/contracts` subdirectory.



## Deployment

## 1. Remix IDE

To test the smart contract on the Remix IDE, go to [https://remix.ethereum.org/](https://remix.ethereum.org/). 

First, paste the solidity code for the demo token code over the voting smart contract sample code provided by remix. 

Then, **select the "Compile" tab** on the right hand portion of the window. **Click on the "Start to compile" button** to compile the code. 

After that, **select the "Run" tab** on the right hand portion of the window. Ensure that the environment is **set to "JavaScript VM".** Also make sure that you input an initial supply before deploying the contract.

**Click on the "Deploy" button.** This will deploy the smart contract onto the blockchain. The first default account on the "Accounts" field should now have slightly less than 100 ether. This is because it deployed the contract and had to pay a gas fee to do so. You should now also have some accessor functions for every public variable (blue buttons) and the main function (red button) appear at the bottom right corner of the window. Click on these to call the functions.

To send tokens to another account, scroll back up to the "Account" field in the "Run" tab. Select any account that is not the first one. In the **"Transfer" text field, enter in the address of the account you want to send eriCoin to as well as the number of coins you would like to send**. **Click on the red "transact" button** on the lower bottom right hand side of the window. The token transfer should now be complete.

If you decide to check the balances of the account you deployed the demo token smart contract with as well as the account that you decided to transfer to tokens to, they should now have the accurate account balances reflecting this transaction. To check the balances of the accounts, scroll down to the red "balanceOf" button and input the address of the account balance you want to check. Then, hit the red "transact" button on the bottom right hand corner of the screen. This should output to you the correct account balances for each account. 
  

### 2.Truffle framework

  

Using the Solidity compiler for getting the information to deploy in the Travis console is the 'classic' way of deployment, as we tried for simple contracts like 'HelloWorld' in the other subdirectory; however, for more complicated projects like this, Truffle is highly recommended to simplify the process.

  

If you haven't yet installed it, check out the tutorial here: <[http://truffleframework.com/docs/getting_started/installation](http://truffleframework.com/docs/getting_started/installation)>

  

Create a new directory and run `init truffle` inside the directory. Copy or create a `.sol` file of the source code in the `/contracts` subdirectory (*NOT* the same as `build/contracts`). Then you will need to specify deployment configuration in `migrations/2_deploy_contracts.js`.

  

```

var ericoin = artifacts.require("./ericoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ericoin, 69);
};

```

This will deploy the contracts one by one in the specified order.

Then configure the networks in `truffle.js` file:



```
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration
  networks: {
    testnet: {
    host: "localhost",
    port: 8545,
    network_id: 3,    //Doesn't matter, any network id works          
    from: "0xINSERT_ACCOUNT_HERE",
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
  Deploying Migrations...
  ... 0x37f81ca93ca413b9eee3722c3b41e68d5a590a2b836cee46edf697448aced518
  Migrations: 0xa2d70210413a01ea0ac8f23df698ba140bca34f5
Saving successful migration to network...
  ... 0x7251463f265192bbbf103ba3cfb6a0604b368b73ed4c0ae8b1d0072dcb2b281a
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying ericoin...
  ... 0x1b3118ff8b599a22cd7c46afc702a25d46637a7a61e74fa9bab79bc9ef1f7e8d
  ericoin: 0x62c905a34b3ee7f25567d53b0ac24cf57b6c3e56
Saving artifacts...

```


  

## Interacting with the deployed contracts

To interact with the smart contracts we will use abstraction from the truffle console.

Start the truffle console by entering `truffle console --network testnet`

To call a function that doesn't change data, use

    ericoin.deployed().then(instance => instance.INSERT_FUNCTIONNAME_HERE.call(PARAMS)).then(result => storeData = result)

For example, to find the balance, we would enter

    ericoin.deployed().then(instance => instance.balance.call("0xACCOUNT_NUM")).then(result => storeData = result)

To transfer tokens, we would enter

    ericoin.deployed().then(instance => instance.transfer.sendTransaction("0xACCOUNT_NUM", 1)).then(result => storeData = result)

In general, when interacting with deployed smart contracts to change data, use

    CONTRACT_NAME.deployed().then(instance => instance.FUNCTION_NAME.sendTransaction(PARAMS)).then(result => storeData = result)


