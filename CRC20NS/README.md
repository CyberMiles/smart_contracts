# The CRC20 Naming Service Contract

The naming service contract is from the `CRC20NS.sol` file. The compiled ABI and bytecode are in the `CRC20NS.abi` and `CRC20NS.bin` files respectively.

The DEMO token used in the example below is from the `CRC20Demo.sol` file.

## Applications 

For applications / wallets / explorer web site that need to verify the "official" status of a CRC20 token symbol, they should use the `isRegistered` function. This function takes the symbol and contract address as input parameters, and returns a boolean value indicating whether the pair is registered. There is no gas fee for this function call. In web3-cmt.js and the Travis client console, we will first construct a contract instance from its deployed address. 

```
// unlock or inject from account: 0x9ee2dfa53038b4d2bbcefcd3517f21384490cbb1
abi = [{...}]
contract = web3.cmt.contract(abi, "0xcc549613436838f03946d29749ba2ed1fbd5618f")
```

Then we can call the `isRegistered` function without gas.

```
contract.isRegistered("DEMO", "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256")
true

contract.isRegistered("DEMO123", "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256")
false
```

Applications could also use the `lookup` function on the contract to get more information. The function takes a single parameter, the symbol, and returns the official contract address for this symbol. This function call requires no gas. The function's return values are as follows. 

* The contract address of this symbol.
* The exit price for the symbol (how much a new person has to pay to replace the CRC20 contract associated with this symbol). 

If the symbol is not registered, all those above fields will return 0.

Here is an example of the `lookup` function call in web3-cmt.js or Travis client console. 

```
contract.lookup("DEMO")

{
	"string _symbol": "DEMO",
	"address _contractAddr": "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256"
}
```

## Token creators

If you are a token creator, you can call the register function on this contract to officially register your token's contract address. You will need to pay a fee based on how many characters you symbol has in order to complete the registration. 

* For symbols that are two chars, you will pay 1000 CMTs
* For symbols that are three chars, you will pay 100 CMTs
* For symbols that are four chars, you will pay 10 CMTs. 
* For symbols that are five or more chars, you will pay 1 CMT. 

The `register` function takes the following parameters, in addition to the above registration fee in the TX value and gas fee. 

* The CRC20 contract address to be registered.
* The exit price for the symbol (how much a new person has to pay to replace the CRC20 contract associated with this symbol). 

You must be the current owner of the CRC20 token contract in order to call the `register` function. Here is how it works in web3-cmt.js and Travis client console. 


```
contract.register("0x85F30253218fCAaa8e0c8f32ae7909D217eB1256", "100000000000000000000", {
    from: '0x9ee2dfa53038b4d2bbcefcd3517f21384490cbb1',
    value: 10000000000000000000,
    gas: 1500000
})
```

Once registered, the current owner of the contract can also call the `updateRegistration` function to update the exit price. 

If another token owner wishes to make "official" another contract address for the same symbol and hence replacing the current registration for this symbol, she can call the `register` function again and pay enough fee in the TX value. The fee should be equal to the previous owner's exit price plus the registration fee. The previous contract owner will be paid the exit price and the symbol will be registered for the new owner. 



