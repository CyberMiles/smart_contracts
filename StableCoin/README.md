# CyberMiles Stable Coin Smart Contract

This stable coin smart contract (CMTD) is designed to work in conjunction with a payment gateway. At present the contract inherits 4 pre-existing contracts from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity).

It was found that the following 4 OpenZeppelin contracts inherit from and implement a variety of contracts and libraries which in-turn provide sufficient functionality to implement the CyberMiles Stable Coin Smart Contract (CMTD).

# Creating the CMTD Smart Contract
The first iteration of the CMTD contract was importing the OpenZeppelin contracts dynamically. The first iteration has now been renamed from StableCoinCMTD.lity to StableCoinCMTD.lity.old.
The second iteration of the CMTD contract will be a single file which includes all of the OpenZeppelin imports as static code.

## Flattening the OpenZeppelin imports
The followig process details how the OpenZeppelin contracts are utilized statically (by flattening the entire OpenZeppelin inheritance heirarchy); the result being, a large single static file called StableCoinCMTD.lity.

```bash
# Using Ubuntu 16.04LTS
cd ~
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install build-essential
sudo apt-get -y install libz3-dev
sudo apt-get -y install curl
```
[Install Lity on Ubuntu 16.04](https://lity.readthedocs.io/en/latest/developers-guide.html#developers-guide)
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g truffle
mkdir flattenedContract
cd flattenedContract
# Just make sure that your home directory is owned by ubuntu
sudo chown -R ubuntu:ubuntu /home/ubuntu/
truffle init
# Install the OpenZeppelin Solidity codebase via npm
npm install openzeppelin-solidity
```
Create a new CMTD smart contract, in the contracts folder.
Make sure that the new CMTD smart contract has the appropriate import statements (relative URLs as shown below).
```javascript
pragma solidity ^0.5.2;

/**
 * WARNING
 * This contract is a draft for a stable coin prototype which is being designed to work in conjunction with a payment gateway.
 * At present this contract is in Beta and must not be used in production or when there is real value at stake.
 * Use this contract at your own risk.
 */

//Import contracts
//This file has been marked old because dynamically linking to these contracts was causing issues at times when OpenZeppelin updated their code base and GitHub repository file structure etc.
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

//Create CMTD contract
contract CMTD is ERC20Mintable, ERC20Burnable, ERC20Pausable, ERC20Detailed {
    constructor() public
    ERC20Mintable()
    ERC20Burnable()
    ERC20Pausable()
    ERC20Detailed("CyberMiles Stable Coin", "CMTD", 18) {}
}
```
Install the Truffle Flattener
```bash
sudo npm install truffle-flattener
```
Please note, you may have to run the following commands if permission issues present.
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/lib/node_modules
sudo chown -R $USER /usr/local/lib/node_modules
```
To flatten the file please use the following command
```bash
truffle-flattener contracts/cmtd.sol > flat_cmtd.sol
```
The flattened file from the above instructions is now stored as StableCoinCMTD.sol.

# Functionality

Below is a quick overview of what all of the 4 inherited contract bring to the CMTD contract. The most significant functionality is the ability to mint and burn tokens as well as the ability to manage roles as apposed to the traditional method of just having the owner perform all of the administration functions (i.e. using the Ownable contract). 

Any additional functionality can now be added to the CMTD contract in the form of function overrides and/or additional modifiers.

## Mintable
The OpenZeppelin ERC20Mintable contract inherits from ERC20 and MinterRole. MinterRole subsequently implements the Roles Library. The Roles Library manages addresses which are assigned to a single role. Using the ERC20Mintable contract provides not only the ability to mint new tokens, but the ability to completely manage access control for one or more "minters" which are technically an instance of Roles.Role.

## Burnable
The OpenZeppelin ERC20Burnable contract inherits from ERC20. It has a function called burnFrom which allows a specific amount of tokens from the target address to be burned. The burning of tokens is on the proviso that an allowance to do so has been set.

## Pausable
The OpenZeppelin ERC20Pausable contract inherits from ERC20 and Pausable. Pausable inherits from PauserRole. PauserRole subsequently implements the Roles Library. The Roles Library manages addresses which are assigned to a single role, as we mentioned in the Mintable section.

## Detailed
The OpenZeppelin ERC20Detailed contract is IERC20 and simply provides an opportunity to enrich the contract with additional name, symbol and number of decimals for the token.

All in all, the above 4 contracts (and their inherited contracts and implemented libraries) provide the following functionality to the CMTD contract without any modification whatsoever. As mentioned any additional functionality can be created through the use of function overriding and/or additional modifiers.

![Functionality](images/functionality.png)

## Supply
The CMTD contract is designed to have a variable supply. The initial supply is set to zero. Tokens minted will increase the supply and tokens burned will decrease the supply. The minting and burning of tokens will come about as a result of logic in the payment gateway.
