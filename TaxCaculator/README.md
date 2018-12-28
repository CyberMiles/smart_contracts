# TaxCaculator

This example helps you caculate your income tax.
It is a simplified version of 
[this region](https://www.ntbt.gov.tw/etwmain/web/ETW118W/CON/2074/5702201758651492080) .
We ignore exemptions and deductions in this case, so actual tax in reality is less than result of this contract.

| Net income            |  Tax rate |
| --------------------  | --------- |
|         0 ~   540,000 |   5%      |
|   540,000 ~ 1,210,000 |  12%      |
| 1,210,001 ~ 2,420,000 |  20%      |
| 2,420,001 ~ 4,530,000 |  30%      |
| 4,530,001 ~ ∞         |  40%      |

## Deployment

First compile the contract using Lity compiler.

```
lityc --abi --bin TaxCaculator.lity
======= TaxCaculator.lity:TaxCaculator =======
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
  from: web3.cmt.accounts[0],
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
> personal.unlockAccount(cmt.accounts[0], '<YOUR_PASSWORD>')
true
> loadScript('deploy.js')
true
Contract mined! address: <address> transactionHash: <hash>
```

## Interacting with the deployed contract
To query income tax amount, call `queryTax()` with your net income as parameter and see result in the receipt.

```
> test.queryTax.sendTransaction(1000000, {from:cmt.accounts[0], gas:12345678})
<Txaddress>
# see the receipt
> cmt.getTransactionReceipt("<Txaddress>")
{
  ...
  logs: [{
      ...
      data: "0x0000000000000000000000000000000000000000000000000000000000014118",
      ...
  }],
  ...
}
```