const fs = require("fs")
const request = require("request")
const Web3 = require("web3-cmt")

let provider = "http://localhost:8545"
let web3 = new Web3(new Web3.providers.HttpProvider(provider))
if (!web3 || !web3.isConnected())
  throw new Error("cannot connect to server.")

let account = web3.cmt.accounts[0]
let password = "<your_password_here>"
let balance = web3.cmt.getBalance(account)
web3.personal.unlockAccount(account, password, 86400)

console.log("Account: " + account)
console.log("Balance: " + balance)

let txOption = {from: account, gas: "4700000"}
let btcrelayBytecode = "0x" + fs.readFileSync('../output/BTCRelay.bin')
let btcrelayAbi = JSON.parse(fs.readFileSync('../output/BTCRelay.abi'))

// if btcrelayAddress is null, this script will deploy new BTCRelay contract
// otherwise, it will use it as existed BTCRelay contract address

//let btcrelayAddress = '<btcrelay_contract_address>'
let btcrelayAddress = null

let deploy = (bytecode, abi, address = null) => {
  let contractProto = web3.cmt.contract(abi)
  if (address !== null) return contractProto.at(address)
  return new Promise((resolve, reject) => {
    contractProto.new(
      {
        from: account,
        data: bytecode,
        gas: "4700000",
      },
      function (e, contract) {
        if (e) reject(e)
        if (typeof contract.address !== "undefined") {
          console.log(`Contract: ${contract.address}`)
          btcrelayAddress = contract.address
          resolve(contract)
        }
      }
    )
  })
}

let getTransactionReceiptMined = txHash => {
  let transactionReceiptAsync = (resolve, reject) => {
    web3.cmt.getTransactionReceipt(txHash, (e, receipt) => {
      if (e) reject(e)
      else if (receipt === null) transactionReceiptAsync(resolve, reject)
      else resolve(receipt)
    })
  }
  return new Promise(transactionReceiptAsync)
}

let fetchBlockHeader = blockNumber => {
  let url = `https://blockchain.info/block-height/${blockNumber}?format=json`
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: url
      },
      (error, response, body) => {
        if (error) reject(error)
        try {
          let json = JSON.parse(body)
          resolve(json.blocks[0])
        } catch (e) {
          reject(new Error(body))
        }
      }
    )
  })
}

let fetchAndStoreHeader = async blockNumber => {
  let contract = await deploy(btcrelayBytecode, btcrelayAbi, btcrelayAddress)
  let block = await fetchBlockHeader(blockNumber)
  console.log(`Block ${blockNumber}`)
  console.log(`  Hash: 0x${block.hash}`)

  let flip = str => {
    return str.match(/[a-fA-F0-9]{2}/g).reverse().join('')
  }
  let leadingZero = (str, length) => {
    return ("0".repeat(length) + str).substr(-length, length)
  }
  let version = flip(leadingZero(block.ver.toString(16), 8))
  let prevBlock = flip(block.prev_block)
  let merkleRoot = flip(block.mrkl_root)
  let time = flip(leadingZero(block.time.toString(16), 8))
  let bits = flip(leadingZero(block.bits.toString(16), 8))
  let nonce = flip(leadingZero(block.nonce.toString(16), 8))
  let header = `0x${version}${prevBlock}${merkleRoot}${time}${bits}${nonce}`
  console.log('  Header: ' + header)
  let txHash = contract.storeHeader.sendTransaction(header, blockNumber, txOption);
  let receipt = await getTransactionReceiptMined(txHash)
  return receipt
}

let run = async (fromBlockNumber, toBlockNumber) => {
  let blockNumber = fromBlockNumber
  while (blockNumber <= toBlockNumber) {
    await fetchAndStoreHeader(blockNumber)
    blockNumber++
  }
  return 'done'
}

run(1, 99999999)
.then(console.log)
.catch(console.log)
