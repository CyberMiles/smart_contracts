# CyberMiles Stable Coin Smart Contract Documentation

## Unit testing with Truffle

[Truffle with Lity support](https://github.com/CyberMiles/truffle) can be used to perform unit tests on the CMTD stable coin.

Download and install Truffle

```
cd ~
git clone https://github.com/CyberMiles/truffle.git -b lity
cd ~/truffle
npm install -g lerna yarn
npm run bootstrap
export PATH="$PWD/node_modules/.bin:$PATH"
```

Create a new environment
```
$ mkdir ~/truffle/truffle_env
$ cd ~/truffle/truffle_env
$ truffle init
$ truffle compile
```

Download the raw (flattened) source code of the CMTD stable coin
```
$ cd ~/truffle/truffle_env/contracts
wget https://raw.githubusercontent.com/CyberMiles/smart_contracts/master/StableCoin/StableCoinCMTD.lity
```
Copy [all of StableCoin tests](https://github.com/CyberMiles/smart_contracts/tree/master/StableCoin/tests) into the ```~/truffle/truffle_env/test``` directory.

### Run the unit tests
```
cd ~/truffle/truffle_env
truffle test
``` 
### Adding more unit tests

#### Assert
Assert should be saved for internal invariants (reserved for an internal invariant which is assumed to always be true at run time).
Remaining gas is kept.
State conditions are rolled back to before code execution.

#### Require
The require function acts as a gate condition, preventing execution of the rest of the function and producing an error if it is not satisfied.[1]
Remaining gas is returned to the sender
State conditions are rolled back to before code execution.

#### Revert
The Revert function can also be used to prevent further execution but it can also produce an error message (taken as one of its arguments).

### Unit test example
```

```


# References
[1] https://github.com/ethereumbook/ethereumbook/blob/develop/07smart-contracts-solidity.asciidoc



