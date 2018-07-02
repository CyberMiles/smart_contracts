# Travis Messenger dApp

  

In this example, we will be deploying a messenger dApp called "EtherChat" onto the Travis Testnet.

  

The open source code for the messenger can be found in the `/travisMessenger/contracts` subdirectory.



## Deployment

## 1. Remix IDE

To test the smart contract on the Remix IDE, go to [https://remix.ethereum.org/](https://remix.ethereum.org/). 

First, paste the solidity code for the messenger code over the voting smart contract sample code provided by remix. 

Then, **select the "Compile" tab** on the right hand portion of the window. **Click on the "Start to compile" button** to compile the code. 

After that, **select the "Run" tab** on the right hand portion of the window. Ensure that the environment is **set to "JavaScript VM".** Also make sure that you input an initial supply before deploying the contract.

**Click on the "Deploy" button.** This will deploy the smart contract onto the blockchain. The first default account on the "Accounts" field should now have slightly less than 100 ether. This is because it deployed the contract and had to pay a gas fee to do so. You should now also have some accessor functions for every public variable (blue buttons) and the main function (red button) appear at the bottom right corner of the window. Click on these to call the functions.

  

### 2.Truffle framework

  

Using the Solidity compiler for getting the information to deploy in the Travis console is the 'classic' way of deployment, as we tried for simple contracts like 'HelloWorld' in the other subdirectory; however, for more complicated projects like this, Truffle is highly recommended to simplify the process.

  

If you haven't yet installed it, check out the tutorial here: <[http://truffleframework.com/docs/getting_started/installation](http://truffleframework.com/docs/getting_started/installation)>

  

Create a new directory and run `init truffle` inside the directory. Copy or create a `.sol` file of the source code in the `/contracts` subdirectory (*NOT* the same as `build/contracts`). Then you will need to specify deployment configuration in `migrations/2_deploy_contracts.js`.

  

```

var EtherChat = artifacts.require("./EtherChat.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherChat);
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

Deploying Migrations...
  ... 0xc15e1051cc23dfd3650c32ac6b35d7efca7d35a86c1077fd241b419ae34fc737
  Migrations: 0xb00ac1fc0410694bdc3985b3529a3e2b6486643d
Saving successful migration to network...
  ... 0x14e61ba60c1db7eb0a6ccb9703baa68ca79c5841e82013c3f3ae444225a01492
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying EtherChat...
  ... 0x77876d5864ebea8aa1900a8f8e537fe19bcb5037d2465c94631929bbcdeaa339
  EtherChat: 0xf2fe69d97e63650b04a581ce70f7fdde066260a9
Saving artifacts...

```


  

## Interacting with the deployed contracts

To interact with the smart contracts we will use abstraction from the truffle console.

Start the truffle console by entering `truffle console --network testnet`

README to be continued soon...

