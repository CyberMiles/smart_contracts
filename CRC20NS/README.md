# The CRC20 Naming Service Contract

The naming service contract is from the `CRC20NS.sol` file, and it is currently deployed on the CyberMiles Testnet at address `0xccab53f7c01fdb5e9310dfbe31a09f7143cc0b42`.
https://testnet.cmttracking.io/address/0xccab53f7c01fdb5e9310dfbe31a09f7143cc0b42

The DEMO token used in the example below is from the `CRC20Demo.sol` file and deployed at `0x85f30253218fcaaa8e0c8f32ae7909d217eb1256`.
https://testnet.cmttracking.io/token/0x85f30253218fcaaa8e0c8f32ae7909d217eb1256

## Applications 

For applications / wallets / explorer web site that need to verify the “official” status of a CRC20 token symbol, they should use the `isRegistered` function. This function takes the symbol and contract address as input parameters, and returns a boolean value indicating whether the pair is registered. There is no gas fee for this function call. Here is how it works on Remix. 

![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/isRegistered01.png)
![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/isRegistered02.png)

Applications could also use the `lookup` function on the contract to get more information. The function takes a single parameter, the symbol, and returns the official contract address for this symbol. This function call requires no gas. The function's return values are as follows. 

* The contract address of this symbol.
* The exit price for the symbol (how much a new person has to pay to replace the CRC20 contract associated with this symbol). 

If the symbol is not registered, all those above fields will return 0.

Here is an example of the `lookup` function call in remix. 

![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/lookup01.png)
![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/lookup02.png)

## Token creators

If you are a token creator, you can call the register function on this contract to officially register your token's contract address. You will need to pay a fee based on how many characters you symbol has in order to complete the registration. 

* For symbols that are two chars, you will pay 1000 CMTs
* For symbols that are three chars, you will pay 100 CMTs
* For symbols that are four chars, you will pay 10 CMTs. 
* For symbols that are five or more chars, you will pay 1 CMT. 

The register function takes the following parameters, in addition to the above registration fee in the TX value and gas fee. 

* The CRC20 contract address to be registered.
* The exit price for the symbol (how much a new person has to pay to replace the CRC20 contract associated with this symbol). 

You must be the current owner of the CRC20 token contract in order to call the `register` function. Here is how it works in remix. 

![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/register01.png)
![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/register02.png)
![](https://github.com/CyberMiles/smart_contracts/raw/master/CRC20NS/images/register03.png)

Once registered, the current owner of the contract can also call the `updateRegistration` function to update the exit price. 

If another token owner wishes to make "official" another contract address for the same symbol and hence replacing the current registration for this symbol, she can call the `register` function again and pay enough fee in the TX value. The fee should be equal to the previous owner's exit price plus the registration fee. The previous contract owner will be paid the exit price and the symbol will be registered for the new owner. 



