# CryptoKitties -- an open source smart contract based game on blockchain

  

In this example, we will be deploying a style game that is originally on Ethereum onto Travis.

  

CryptoKitties is a game for buying (through auction), selling (also through auction), and breeding digital cats. Although each cat is represented by `uint256` as genetic code in Solidity, there is a CryptoKitty’s web server visualizing the cats. But now we are only focusing on the smart contracts that functionally consist the game.

  

More detailed description can be found: <[https://medium.com/loom-network/how-to-code-your-own-cryptokitties-style-game-on-ethereum-7c8ac86a4eb3](https://medium.com/loom-network/how-to-code-your-own-cryptokitties-style-game-on-ethereum-7c8ac86a4eb3)>

  

Or you can check out (try and play) the game directly from here: <[https://www.cryptokitties.co/](https://www.cryptokitties.co/)>

  

The open source code the game can be found: <[https://ethfiddle.com/09YbyJRfiI](https://ethfiddle.com/09YbyJRfiI)>

  

or in the `/kitties/contracts` subdirectory (this `kitties.sol` file is slightly modified from the original source code to avoid compiling and deployment errors/warnings).

  

## Deployment

  

### 1.Truffle framework

  

Using Solidity compiler for getting the information to deploy in the Travis console is the 'classic' way of deployment, as we tried for simple contracts like 'HelloWorld' in the other subdirectory. But for a more complicated project like this, Truffle is highly recommended to simplify the process.

  

If you haven't yet installed it, check out the tutorial here: <[http://truffleframework.com/docs/getting_started/installation](http://truffleframework.com/docs/getting_started/installation)>

  

Create a new directory and run `init truffle` inside the directory. Copy or create a `.sol` file of the source code in the `/contracts` subdirectory (*NOT* the same as `build/contracts`). Then you will need to specify deployment configuration in `migrations/2_deploy_contracts.js`.

  

```

var ClockAuction = artifacts.require("ClockAuction");
var ClockAuctionBase = artifacts.require("ClockAuctionBase");
var ERC721Metadata = artifacts.require("ERC721Metadata");
var geneScience = artifacts.require("geneScience");
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
  deployer.deploy(geneScience);
  deployer.deploy(KittyBreeding);
  deployer.deploy(ClockAuctionBase);
  deployer.deploy(Pausable);
  deployer.deploy(ClockAuction, "0xINSERT_ACCOUNT_HERE", 100);
  deployer.deploy(SiringClockAuction, "0xINSERT_ACCOUNT_HERE", 100);
  deployer.deploy(SaleClockAuction, "0xINSERT_ACCOUNT_HERE", 100);
    deployer.deploy(KittyAuction);
  deployer.deploy(KittyMinting);
  deployer.deploy(KittyCore);
};
```

  

Please note that Interface contracts are not deployable. So contracts like `GeneScienceInterface` are not included.

  

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
    from: "0xINSERT_ACCOUNT_HERE",
    gas: 8000000,
        gasPrice: 10000000000
    }
  }
};
```

  

Make sure the amount of gas is sufficient and the address of `from` section is the default account (check `cmt.defaultAccount` or set it to a valid address with sufficient balance) in your Travis console.

  

Run `truffle compile` from the initialized directory and then`truffle migrate --network testnet` to deploy. Make sure you have attached to Travis network  with `travis attach http://localhost:8545`and unlocked your default account before deployment with `personal.unlockAccount(cmt.accounts[0])` (normally unlocking is needed before every `migrate`).

  

The results should be similar to:

  

```
truffle migrate --network testnet

Using network 'testnet'.

  

Running migration: 1_initial_migration.js

Replacing Migrations...

... 0x0e26e1a4cdcaba67e6852f21690d8557cfa632ac176591d1abaaa0f5797414cf

Migrations: 0xa8f0f104b0713c727ceba4f43f3cd912708c0601

Saving successful migration to network...

... 0xfff5813b7a76d2978c201fd59fef91b7d9cc2b377ab7fbd1b0578bf05147f569

Saving artifacts...

Running migration: 2_deploy_contracts.js

Deploying Ownable...

... 0x1def81a00aaef5c641bdd646220551e61b6e333c5639b0bce0e21ca8d5fe8378

Ownable: 0xa8113283ce7802097da48d88add5fe1c05f8c36b

Deploying KittyAccessControl...

... 0x3fa9825d223f7ef54849f57f80d379dd3a708b6a19c1c5c71afb84da727e267d

KittyAccessControl: 0xe935449a5fb3ba2fd060b1a1b84505ce4ff13615

Deploying KittyBase...

... 0xc38fce89e3509083804e381a4daba165baf979c9829cdf3e2572e778c889dca7

KittyBase: 0x66bcdcca5d8b4fd97d2bd158fa185b3db74053b1

Deploying ERC721Metadata...

... 0x86c35863326edf1bd156963ab58a6d3c6be53755f455090ff86ac85fa616f684

ERC721Metadata: 0xc2f13598145384ef8aee6f12b1dd15a6888ab432

Deploying KittyOwnership...

... 0x7625232ed895666b61b8e85bb19dc4f6f60d74d60b6e8c36d4bdf7aea9f71cd9

KittyOwnership: 0xc67b6d37b02fa7b756e0aed9fa72425ccfe11334

Deploying geneScience...

... 0x9982513f46506444327f00a65a043c8be41c1d3a9aaa126fd4b0626a5e7dc357

geneScience: 0xb871cba0e7cbb344537724c74c4332a8530831d4

Deploying KittyBreeding...

... 0x0fcf1067e75afd4e6abd69e21b095745936d9be09094af854b5d42dddfd8a0b6

KittyBreeding: 0x914ca9d5f7fcf787228c58094475194bb893daaf

Deploying ClockAuctionBase...

... 0x4d0db341c064252f4ab9661123c78eeaf7b863d43127c28c55fb4786ae1031a9

ClockAuctionBase: 0x90d97ce39dce83945e2e243695db0540e21d6871

Deploying Pausable...

... 0x96866091ec07cb8ea3840c72c4d2ed897f47443bc4e3d2029373e67a22fe8aed

Pausable: 0x4855014f558625e65441d3ccf4d08471d092e867

Deploying ClockAuction...

... 0x76b2aa37f52aa2b15e2483aacc7ae860b2e8444dfe9271ff839674c6ec0cf3d1

ClockAuction: 0xa3197c93528e5908768631754d67c8445292cb8c

Deploying SiringClockAuction...

... 0x56d7316298ae9c6b87c47128118835f512a42393703e98e9d1d224dd8fc5f940

SiringClockAuction: 0x9dfcb76f4e886385028a645de53764a476cdab4c

Deploying SaleClockAuction...

... 0xb142b8f44f6b34a295d3cb321475591f9b3ca05892be2e40c70a3fdeb64b0a9f

SaleClockAuction: 0x4e923ab7f608099db68caa681f9468f96f59d1d0

Deploying KittyAuction...

... 0xff0a0ec3bda245c0029e424bd95392d1b83c592b4f45f32b4d7b0cd7f1d2336e

KittyAuction: 0x3855aa90a59954a135677cd95e46e6174d1c05cd

Deploying KittyMinting...

... 0xbdf49c85b8532fbbc50866edd049cd718d674b97aabc51d9810404c9fa8c04c5

KittyMinting: 0xbe5dca781a70becb960c290e48de5b071e35318b

Deploying KittyCore...

... 0x6ee9d77f78f1e3a90d7ba53ad5c3526bb2e2b4cd33712120a066a1f2c4942604

KittyCore: 0xfba877300489afd1bf3a5a33158874e4057886c7

Saving artifacts...

```


  

## Interacting with the deployed contracts

To interact with the smart contracts we will use abstraction from the truffle console.

Start the truffle console by entering `truffle console --network testnet`

To call a function, use

    KittyCore.deployed().then(instance => instance.INSERT_FUNCTIONNAME_HERE.call()).then(result => storeData = result)

For example, to find the CEO address, we would enter

    KittyCore.deployed().then(instance => instance.ceoAddress.call()).then(result => storeData = result)

To call a function with parameters, use

    KittyCore.deployed().then(instance => instance.FUNCTION_NAME.sendTransaction(PARAMETERS)).then(result => newStoreData = result)

For example, to set the CFO address, we would enter

    KittyCore.deployed().then(instance => instance.setCFO.sendTransaction("0xfc60d1d90b112c2e4fa629ac484d40a0c8194e5f")).then(result => newStoreData = result)

In general, when interacting with deployed smart contracts, use

    CONTRACT_NAME.deployed().then(instance => instance.FUNCTION_NAME.sendTransaction(PARAMS)).then(result => storeData = result)


