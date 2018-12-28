# InsuranceClaim

This contract is a simplified travel insurance.
The insurer compensate for flight delay according the table below.

| Delay hours |   Compensation                                  |
| ---------   | ----------------------------------------------- |
| 4 or more   | 5 Ether                                          |
| 6 or more   | 5 Ether or accountable expense no more than 15 Ether|

Insureds need to apply in advance.
If the flight delays for 4 hours or more, insureds have to apply claim.
On the other side, flight information input is by the insurer and open for query.
Once the insurer calls `sendClaim`, claims are cacluated and sent out automatically.

## Deployment

The insurer is responsable for deploying this contract.
First compile the contract using Lity compiler.

```
lityc --abi --bin InsuranceClaim.lity
======= InsuranceClaim.lity:InsuranceClaim =======
Binary:
<bytecode>
Contract JSON ABI
<ABI>
```

Prepare the script for deploying. (Note that byte code and ABI are copied from compiler output.)

```
$ cat deploy.js
bytecode = "0x<bytecode>"
abi = "<ABI>"
var testContract = web3.cmt.contract(abi);
var test = testContract.new({
  from: <INSURER_ACCOUNT>,
  data: bytecode,
  gas: '4700000'
}, function (e, contract){
  if (typeof contract.address !== 'undefined') {
    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
  }
})
```

Enter Travis console to deploy the contract.

```
$ travis attach http://localhost:8545
> personal.unlockAccount(<INSURER_ACCOUNT>, '<YOUR_PASSWORD>')
true
> loadScript('deploy.js')
true
Contract mined! address: <address> transactionHash: <hash>
```

## Interacting with the deployed contract

Insureds apply insurance by `applyInsurance()` with flightID as parameter. (Insurance fee is paid upon application.)

```
> cmt.getBalance(<INSURED_ACCOUNT>)
only enough for contract gas
> test.applyInsurance.sendTransaction(8888, {from:<INSURED_ACCOUNT>, gas:12345678})
```

The insurer updates flight information by `addFlight` with flightID and flight delay as parameters.

```
> test.addFlight.sendTransaction(123, 5, {from:<INSURER_ACCOUNT>, gas:12345678})
```

The insured apply claim by `applyClaim` with accountable expense as parameter.

```
> test.applyClaim.sendTransaction(8888000, {from:<INSURED_ACCOUNT>, gas:12345678})
```

Finally, the insurer send out compensation by `sendClaim`.

```
> test.sendClaim.sendTransaction({from:<INSURER_ACCOUNT>, gas:12345678})
```

Insureds can check claim status and flight information by `queryStatus` and `queryFlight`.

```
> test.queryFlightDelay(8888)
5
> test.queryClaimReceived()
true
> cmt.getBalance(<INSURED_ACCOUNT>)
about 5 ether
```
