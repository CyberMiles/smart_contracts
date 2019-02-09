console.log('Client-side code running');

window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        console.log("Connected to web3 - Success!")
    } else {
        // set the provider you want from Web3.providers
        console.log("Was unable to connect to web3. Trying localhost ...")
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    async function getBlockNumberOld() {

        let blockNumber = await web3.eth.getBlockNumber(function(error, result) {
            if (!error) {
                console.log("Block number is : " + result);
                return result;
            } else {
                console.log(error);
            }
        });
    }

    function getCurrentBlock() {
        return new Promise(function(fulfill, reject) {
            web3.eth.getBlockNumber(function(error, content) {
                if (error) reject(error)
                else fulfill(content);
            })
        })
    }

    async function loadABI() {
        console.log("Loading ABI");
        abi = [{
            "constant": false,
            "inputs": [{
                "name": "account",
                "type": "address"
            }],
            "name": "addMinter",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "account",
                "type": "address"
            }],
            "name": "addPauser",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "spender",
                "type": "address"
            }, {
                "name": "value",
                "type": "uint256"
            }],
            "name": "approve",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "value",
                "type": "uint256"
            }],
            "name": "burn",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "from",
                "type": "address"
            }, {
                "name": "value",
                "type": "uint256"
            }],
            "name": "burnFrom",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "spender",
                "type": "address"
            }, {
                "name": "subtractedValue",
                "type": "uint256"
            }],
            "name": "decreaseAllowance",
            "outputs": [{
                "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "spender",
                "type": "address"
            }, {
                "name": "addedValue",
                "type": "uint256"
            }],
            "name": "increaseAllowance",
            "outputs": [{
                "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "to",
                "type": "address"
            }, {
                "name": "value",
                "type": "uint256"
            }],
            "name": "mint",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "renounceMinter",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "renouncePauser",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "to",
                "type": "address"
            }, {
                "name": "value",
                "type": "uint256"
            }],
            "name": "transfer",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "from",
                "type": "address"
            }, {
                "name": "to",
                "type": "address"
            }, {
                "name": "value",
                "type": "uint256"
            }],
            "name": "transferFrom",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "name": "account",
                "type": "address"
            }],
            "name": "Paused",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "name": "account",
                "type": "address"
            }],
            "name": "Unpaused",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "account",
                "type": "address"
            }],
            "name": "PauserAdded",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "account",
                "type": "address"
            }],
            "name": "PauserRemoved",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "account",
                "type": "address"
            }],
            "name": "MinterAdded",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "account",
                "type": "address"
            }],
            "name": "MinterRemoved",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "from",
                "type": "address"
            }, {
                "indexed": true,
                "name": "to",
                "type": "address"
            }, {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }],
            "name": "Transfer",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "owner",
                "type": "address"
            }, {
                "indexed": true,
                "name": "spender",
                "type": "address"
            }, {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }],
            "name": "Approval",
            "type": "event"
        }, {
            "constant": true,
            "inputs": [{
                "name": "owner",
                "type": "address"
            }, {
                "name": "spender",
                "type": "address"
            }],
            "name": "allowance",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "owner",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "name": "",
                "type": "uint8"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "account",
                "type": "address"
            }],
            "name": "isMinter",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "account",
                "type": "address"
            }],
            "name": "isPauser",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "paused",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }]
        console.log("Loading Address");
        address = "0xc68620677ad1785c838ff88b928c74f33a953798";
        console.log("Instantiating contract");
        try {
            let loadedAbi = await web3.eth.contract(abi);
            console.log("Loaded ABI: " + loadedAbi);
            return loadedAbi;
        } catch (error) {
            console.log(error);
        }
    }

    async function loadContract(theContractInstance) {
        let theDeployedContract = await theContractInstance.at(address, function(error, result) {
            if (!error) {
                console.log("inside: " + result);
                return result;
            } else {
                console.log(error);
            }
        });

        let theTotalSupply = await theDeployedContract.totalSupply(function(error, result) {
            if (!error) {
                console.log("Total supply: " + result);
            } else {
                console.log(error);
            }
        });

    }

    async function getTotalSupply(theDeployedContract) {
        console.log("Fetching total supply");
        let theTotalSupply = await theDeployedContract.totalSupply(function(error, result) {
            if (!error) {
                console.log("Total supply: " + result);
            } else {
                console.log(error);
            }
        });
    }

    async function testEverything() {
        //await getBlockNumber();
        var theContractInstance = await loadABI();
        var theDeployedContract = await loadContract(theContractInstance);
        //console.log("outside: " + theDeployedContract);
        //return theDeployedContract;
    }

    class StableCoin {

        constructor(a) {
            this.firstPassComplete = false;
            this.firstPassReadyToStart = false;
            this.blockNumber = 0;
        }

        async setVariables() {
            console.log("Calling block number.");
            getCurrentBlock().then(value => this.setBlockNumber(value));
            //console.log("value" + value)
            console.log("Waiting for variables to sync");
            this.printBlockNumber();
            console.log("Now we can get on with the rest of the code!")
        }

        setBlockNumber(_blockNumber) {
            this.blockNumber = _blockNumber;
        }

        printBlockNumber() {
            console.log(this.blockNumber);
        }

        isFirstPassReady() {
            console.log("Checking that block number is set");
            if (this.blockNumber != 0) {
                console.log("Success!");
                this.firstPassReadyToStart = true;
            } else {
                console.log("Block number is set to zero, testing can not commence. Please try again in a second")
                this.firstPassReadyToStart = false;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async work() {
            console.log('Start sleeping');
            await this.sleep(5000);
            this.isFirstPassReady();
            console.log('Five seconds later');
            this.conductFirstPass();
        }

        conductFirstPass() {
            if (this.firstPassComplete == false) {
                console.log("First pass has not yet been completed");
                if (this.firstPassReadyToStart == false) {
                    this.work();
                } else {
                    if (this.firstPassReadyToStart == true) {
                        console.log("Conducting first pass");
                        this.printBlockNumber();
                        this.firstPassComplete = true;
                        console.log("First pass complete!")
                    }
                }
            }
        }
    }

    st = new StableCoin("a");
    st.setVariables();
    st.conductFirstPass();

})
