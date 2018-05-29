# Hello, World

This example is about deploying a simple smart contract on Travis Testnet.

**The source code 'HelloWorld.sol' is also in the directory**.

The contract has two main methods: sayHello() and updateMessage(). 

sayHello() returns a greeting message `(type bytes32)` to its caller which is initially set to 'Hello, World' when the Smart Contract is deployed.  

updateMessage() allows the method caller to change the greeting message to another message passed by function argument `(type bytes32)`.  
## 1.1 Solidity

One option for getting the key information is to compile the .sol file in your command console using Solidity compiler.

See installation instructions here: <http://solidity.readthedocs.io/en/v0.4.21/installing-solidity.html>

Once you have *Solidity* installed, go create the smart contract file **HelloWorld.sol** (or download/pull/copy directly from this directory) and run:

`solc --abi HelloWorld.sol`
  
`solc --bin HelloWorld.sol`
  
`solc --gas HelloWorld.sol`
  
for obtaining the associated ABI definition, compiled EVM bytecode and gas fee estimation of the contract.

## 1.2 Remix IDE

Another option is to compile it from a user-friendly IDE.

Access the IDE here: <http://remix.ethereum.org>

The IDE compiles and creates the ABI, bytecode, gas fee estimation in a convenient manner. The information can be obtained ubder the **compile/details** section, indicated as **'ABI'**, **'BYTECODE'** and **'GASESTIMATES'**. Other info under the section as an auxiliary.

## 2.1 Deployment on Travis 

Now since we have the key information, this contract is ready to be deployed from GETH or Travis and obtain an address on the blockchain for the deployed contract instance. 

If you haven't attached to the Travis network yet, please check out the instruction here: <https://medium.com/cybermiles/running-a-travis-node-ac7447b754d4>

The following commands can be run in the GETH or Travis console attached to the *Travis network*.

`> abi = ...`

`> bytecode = '0x...'`

`> gas = ... (please notice this is supposed to be a single number rather than a JSON structure)`

Then you need to have your own unlocked account with balance to deploy it.

`> deploy = { from: "0x...", data: bytecode, gas: gas }`

`> helloContract = cmt.contract(abi)`

`> hello = helloContract.new("0x...", deploy) (please notice the first argument is the same as the 'from' argument in 'deploy' is supposed to be simple 'address' type)`

If authentication error is encountered, make sure you unlock the account before deployment.

Once the contract is mined and recorded on the blockchain, you should be able to create an instance of it and call its public methods. Note that for now, the address of 'hello' is `undefined`. But when we interact with the contract we need to mention the address.

`> hello2 = helloContract.at(hello.address)`

Now we have the instance of the contract, and we are able to call the public methods of the contract.

`> hello2.sayHello()`

`"0x" // no hash`

`> hello2.updateMessage("hi")`

`"0x..." // hashed`

The sayHello() method does not change the internal state, so execution of it doesn't have cost. However, updateMessage changes the state and gas fee is required. The account to pay can be specified as a function argument or if not specified, the default account set as: 

`> cmt.defaultAccount="0x..."`

## 2.2 Simplified deployment by Truffle

*Truffle* automates and simplifies the deployment process. 

See installation instructions here: <http://truffleframework.com/docs/getting_started/installation>

Once the installation is done, we can make a new directory and run `init truffle` inside of it. Then create or copy the *HelloWorld.sol* file inside the *'contracts'* directory. Create a *migrations/2_deploy_contracts.js* file with the content:

`var HelloWorld = artifacts.require("./HelloWorld.sol");
module.exports = function(deployer) {
  deployer.deploy(HelloWorld);
};`

Then update the *truffle.js* file for configuration:

`module.exports = {
 networks: {
   testnet: {
     host: "localhost",
     port: 8545,
     network_id: -, // left empty for customized value
     from: "-", // left empty for customized value
     gas: -, // left empty for customized value
     gasPrice: - // left empty for customized value
   }
 }
};`

Run *'truffle compile'* for compilation and run *'truffle migrate --network testnet'*. Make sure your account in *'from'* is unlocked. You can get the compile results (like abi) from *build/contracts/HelloWorld.json*.

The result should be similar to:

`Using network 'testnet'.
Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0x55af8b489dbb6b301222f269fd7bd2f38864c938dbc84f0b7df1446046d91300
  Migrations: 0x4fff013cca1c469b6ac07ee2102bb49ed459a363
Saving successful migration to network...
  ... 0x5dfc702411192787520bfa7ad52905c9f140eecb30fde4ae69aa360331453073
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Replacing HelloWorld...
  ... 0xd53a301742a855b390e9f04b59f80d68c3c1a999f8fbca8fe6e399f55f419abe
  HelloWorld: 0x98b43faf1dace04fcc70df235367c456507df0d8
Saving artifacts...`

Then you can verify the address on an explorer or in the Travis console. 

Now you have the contract address and its abi, you are able to interact with the contract in Travis console. Simply create the contract instance by:

`> helloWorldContract = cmt.contract(abi)`

and 

`> helloWorld = helloWorldContract.at("0x...")`

Then you can go and test the methods in the contract like sayHello() with the instance you just created. Make sure your default account (with sufficient balance for costly methods) is set by

`> cmt.defaultAccount="0x..."`

## 3.1 Deployment on TestRPC with Truffle

First, if you have not installed testRPC, check out: <https://www.npmjs.com/package/truffle-testrpc>

Use the same procedure to get the ABI, bytecode and gas from either local Solidity compiler or the IDE tool.

Then you will need to configure the files in your Truffle folder. You should have *HelloWorld.sol* in the *contracts* directory and *truffle.js* should look like:

`module.exports = {
        networks: {
            development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
            }
        }
};`

*2_deploy_contracts.js* should be the same as we configured for Travis.

Then, run `truffle console` in the folder and you will enter the truffle console for the network you specified:

`truffle(development)> `

Create instances to hold the info (or pass them all at once by the end):

`> var abi=[...]`

`> var bytecode='0x...'`

`> gas=...`

Then create the contract by:

`> helloContract = web3.eth.contract(abi)`

Make sure you specify the default account before deploy or creating the 'deploy' instance:

`> web3.eth.defaultAccount="0x..." // default account`

`> deploy={from:"0x...", data: bytecode, gas: gas} // 1st arg is default account`

Now you can use the `.new()` method to deploy.

`> var hello = helloContract.new('0x...', deploy) // 1st arg is default account
undefined`

Notice that for now the address is not shown. We need to get it from the transaction receipt.

`> var addr=web3.eth.getTransactionReceipt(hello.transactionHash).contractAddress
undefined`

`> addr
'0x...' // this is the address of the deployed contract`

So now we have the address of the deployed contract, we are able to interact with it:

`> hello2=helloContract.at('0x35b36dbe0cec23e2d4c63059c649187e2ef2e166')`

`> hello2.sayHello.call()
'0x...00000000000000000000000000000000000000'`

`> hello2.updateMessage("hi")
'0x...'`

