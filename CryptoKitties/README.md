# CryptoKitties -- an open source smart contract based game on blockchain 

In this example, we will be deploying a style game that is originally on Ethereum onto Travis. 

CryptoKitties is a game for buying (through auction), selling (also through auction), and breeding digital cats. Although each cat is represented by `uint256` as genetic code in Solidity, there is a CryptoKitty’s web server visualizing the cats. But now we are only focusing on the smart contracts that functionally consist the game.

More detailed description can be found: <https://medium.com/loom-network/how-to-code-your-own-cryptokitties-style-game-on-ethereum-7c8ac86a4eb3>

Or you can check out (try and play) the game directly from here: <https://www.cryptokitties.co/>

The open source code the game can be found: <https://ethfiddle.com/09YbyJRfiI> 

or in the `/kitties/contracts` subdirectory (this `kitties.sol` file is slightly modified from the original source code to avoid compiling and deployment errors/warnings).

## Deployment

### 1.Truffle framework

Using Solidity compiler for getting the information to deploy in the Travis console is the 'classic' way of deployment, as we tried for simple contracts like 'HelloWorld' in the other subdirectory. But for a more complicated project like this, Truffle is highly recommended to simplify the process.

If you haven't yet installed it, check out the tutorial here: <http://truffleframework.com/docs/getting_started/installation>

Create a new directory and run `init truffle` inside the directory. Copy or create a `.sol` file of the source code in the `/contracts` subdirectory (*NOT* the same as `build/contracts`). Then you will need to specify deployment configuration in `migrations/2_deploy_contracts.js`. 

```
var ClockAuction = artifacts.require("ClockAuction");
var ClockAuctionBase = artifacts.require("ClockAuctionBase");
var ERC721Metadata = artifacts.require("ERC721Metadata");
var KittyAccessControl = artifacts.require("KittyAccessControl");
var KittyAuction = artifacts.require("KittyAuction");
var KittyBase = artifacts.require("KittyBase");
var KittyBreeding = artifacts.require("KittyBreeding");
var KittyCore = artifacts.require("KittyCore");
var KittyMinting = artifacts.require("KittyMinting");
var KittyOwnership = artifacts.require("KittyOwnership");
var Ownable = artifacts.require("Ownable");
var Pausable = artifacts.require("Pausable");
var SaleClockAuction = artifacts.require("SaleClockAuction");
var SiringClockAuction = artifacts.require("SiringClockAuction");

module.exports = function(deployer) {
	deployer.deploy(Ownable);
	deployer.deploy(KittyAccessControl);
	deployer.deploy(KittyBase);
	deployer.deploy(ERC721Metadata);
	deployer.deploy(KittyOwnership);
	deployer.deploy(KittyBreeding);
	deployer.deploy(ClockAuctionBase);
	deployer.deploy(Pausable);
	deployer.deploy(ClockAuction, "0xf...", 100);
	deployer.deploy(SiringClockAuction, "0x...", 100);
	deployer.deploy(SaleClockAuction, "0x...", 100);
  deployer.deploy(KittyAuction);
	deployer.deploy(KittyMinting);
	deployer.deploy(KittyCore);
};
```

Please the abstract contracts are not deployable. So contracts like `GeneScienceInterface` are not included.

This will synchronously deploy the contracts one by one in the specified order. Make sure the parameters you pass for some constructors are valid. 

Then configure the networks in `truffle.js` file:

```
module.exports = {
	NETWORK_NAME: {
		testnet: {
		host: "localhost",
		port: 8545,
		network_id: -,
		from: "0x...",
		gas: -,
		gasPrice: -
		}
	}
};
```

Make sure the amount of gas is sufficient and the address of `from` section is the default account (check `cmt.defaultAccount` or set it to a valid address with sufficient balance) in your Travis console. 

Run `truffle compile` from the initialyzed directory (information of all contracts like ABI can be found in `build/contracts` as `.json` files after compilation) and run `truffle migrate --network NETWORK_NAME` to deploy. Make sure you have attached to Travis network and unlocked your default account before deployment (normally unlocking is needed before every `migrate`).

The results should be similar to:

```
~/kitties$ truffle migrate --network testnet
(node:20889) ExperimentalWarning: The fs.promises API is experimental
Using network 'testnet'.

Running migration: 1_initial_migration.js
  Replacing Migrations...
  ... 0xfacd580621a3004026337615465ab5cde6710e3d13593f7ff81953c861acf10c
  Migrations: 0x7932c0a5335f763efc05240d615a23f5549f9fc5
Saving successful migration to network...
  ... 0xa3b833c21455863e1accd5eb59fcfa0abdaa61e556b37659a8a0e22e8a5adf99
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying Ownable...
  ... 0xf1e2f6e6292d6454fac84e32867c95b79ba18296af2db973dff59a29b2d2ff75
  Ownable: 0xcc4d33c11b4a509901b5ea686657e3a36c480f21
  Deploying KittyAccessControl...
  ... 0x6771c04e87256c3092f82fa0cb5237f2e2dd77ffea49569ff86b8a0f076d28c5
  KittyAccessControl: 0xc75d57eff9a32bb965659eb2cd833ad4b0283bd4
  Deploying KittyBase...
  ... 0x56b0684009a11c67b90236b75b89198bd16ad6e795d97dbdad81e3093c781a00
  KittyBase: 0x5c17827704462e607faa68312c733ba4039c113b
  Deploying ERC721Metadata...
  ... 0x087d5bb5ad3ae609637d00b0b7092606d2608182a9a3336c71332b1c59b1711d
  ERC721Metadata: 0x9fd0f7d617f9a5f18a3612f9f037e20a03f981fd
  Deploying KittyOwnership...
  ... 0xc322e2d32b42a58f498d5e91fc7a2100fd03049e779a541541b11e020c5321af
  KittyOwnership: 0xd55efd6c67ffc0f53d3b15eb67bf2e4da62f9ed2
  Deploying KittyBreeding...
  ... 0xc42ed682062525b90a0b4fb366ec0fc7ed41b7a6fa165edd0c3d475e37bc983b
  KittyBreeding: 0xc5cf3b5691ad0816922fdb844e0e9dd8da0c014d
  Deploying ClockAuctionBase...
  ... 0x9c4bb41044ea99f1804637ced8e3d60a68f746abe76dbcf5764124ef9c91cd02
  ClockAuctionBase: 0xf714436d132a5b8c5eae349ce728918433585eaa
  Deploying Pausable...
  ... 0x4b1a456a714f1671bad5e0e94c854d8627bc058c6b919eaa155b5e696f40ca5b
  Pausable: 0x588f78a02f16a46e5f34781d5971b5c160a4a465
  Deploying ClockAuction...
  ... 0xdab80ea76fd404a013f8df2c4ccab8284419f88622ed517b121e29ca0cb3b2c9
  ClockAuction: 0xe5418b44c635654a7206ce59d2a2d05ce25c4a11
  Deploying SiringClockAuction...
  ... 0x3a4aea1859e44456ce0a754c6783b0ae1a798144c6e23ea6a7a56879957142ee
  SiringClockAuction: 0xbc9cd4e67349f5a969e2534a01f05b8e9494407d
  Deploying SaleClockAuction...
  ... 0x71e6615cc367449b58b9c9bf2aa7e99aa74b09f539542a6a9ffedce6e47aa72a
  SaleClockAuction: 0xfc4485d9fa292a1dc625225c3027cf8aa76e4275
  Deploying KittyAuction...
  ... 0x4197263fa14c8fae58205dda8396be4861139cb9c8bf0785727fafc0f814a752
  KittyAuction: 0xcadf0ac29f51ccbcead229c77512680fa4b5b3e5
  Deploying KittyMinting...
  ... 0x672205b2bbb4efb6fa3a51ff02d76b340d4add126d4e092b98d59d201570caf6
  KittyMinting: 0x058b73576ef66da1cdbd522e08c1b27202960e4f
  Deploying KittyCore...
  ... 0xab914d0b37d913789c43f41d5d26fd3fb49d0f4e8122c85db532efae34eda56c
  KittyCore: 0x9faad515b881c503b4cf7d8d55b7e0e8425c8b5b
Saving artifacts...
```

Addresses of deployed contracts will be given respectively. Now we have the address and ABIs of all contracts, we will be able to interact with them in the Travis console.

### 2.Solidity compiler from terminal and Remix IDE

Although deploment of the whole project can be troublesome with Solidity compiler, it can be the choice if you only want to test one of the contracts in the project. Remix IDE can have 'misleading' error message when inheritance is complicated.

`solc --abi`, `solc --bin` and `solc --gas` plus the `.sol` file name will give you the information for deployment, same as sections under `details` section of each contract in Remix.

If you compile it from command console, the results (abi, bin or gas) will be separated by contracts' name though you put them in one `.sol` file:

```
...
======= kitties.sol:ClockAuction =======
Contract JSON ABI 
[{…}]

======= kitties.sol:ClockAuctionBase =======
Contract JSON ABI 
[{…}]

...
```

One thing to notice is Solidity takes all functions with loops and undefined-length strcutures as costly, usually `infinity` gas funds. But it may not be the case when you actually interact with them.

## Interacting with the deployed contracts

Construct the contract by `cmt.contract(THE_ABI)` and create the instance of the contract by `.at(THE_ADRESS)` function:

```
> kittyContract=cmt.contract([{…}])
> kitty=kittyContract.at("0x...")
> personal.unlockAccount("YOUR_DEFAULT_ACCOUNT")
Unlock account 0x...
Passphrase: 
true
```

Then you can call any public method in the contract, for example in `Ownable` contract:

```
> kitty.owner({from:"YOUR_DEFAULT_ADDRESS",gas:-})
"0x..."
```
If you have set the default account and are sure to use it for gas funds, you can leave the JSON structured parameter empty.


