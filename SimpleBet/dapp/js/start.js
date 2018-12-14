var fun = new MainFun();

var tip = IUToast;
var userAddress = '';
var betAbi = '';
var betBin = '';
var contract_address = '';
fun.addMainEvent(document.getElementById("addDiv"), "click", fun.createDivById("main-div-count"));
fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));

var webBrowser = new AppLink();


$(function () {
    getAbi();
    getBin();
    initUserAddress;
    webBrowser.openBrowser();
});

var initUserAddress = function () {
    var interval = setInterval(function () {
        web3.cmt.getAccounts(function (e, address) {
            if (result) {
                userAddress = address;
                $("#userAddress").val(address);
                userAddress = address;
                tip.closeLoad();
                clearInterval(interval);
            }
        });
    }, 300);
}

/**
 * read the abi info from the abi file
 */
var getAbi = function () {

    $.ajax({
        url: '../../BettingGame.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            betAbi = JSON.parse(data);
        }
    });
}

/**
 * read the bin info from the bin file
 */
var getBin = function () {
    $.ajax({
        url: '../../BettingGame.bin',
        dataType: 'text',
        success: function (data) {
            betBin = JSON.parse(data);
        }
    });
}


var checkChoice = function () {
    var obj = document.getElementById("submit-div");
    var inputs = document.getElementsByName("choice");
    var root = document.getElementsByClassName("main-button")[0];
    var count = 0;
    var title = $("#title").val();
    if (title.length > 140) {
        tip.error("Title should less than 140 ！");
        return;
    }
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != '') {
            if (inputs[i].value.length > 70) {
                tip.error("Option should less than 70 ！");
                return;
            }
            count++;
        }
        if (count >= 3 && title != null && title != '') {
            root.style.cssText = "background-color: #1976d2;";
            fun.addMainEvent(obj, "click", startGame);
        } else {
            root.style.cssText = "background-color: #c6cfd5;";
            fun.delMainEvent(obj, "click", startGame);
        }
    }
};

var startGame = function () {

    var inputs = document.getElementsByName("choice");
    var numChoices = 0;
    var gameDesc = '';
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != '') {
            var inputValue = inputs[i].value
            gameDesc += inputValue.trim() + ";";
            numChoices++;
        }
    }
    if (numChoices <= 2) {
        tip.error('The choices must bigger then two!');
        return;
    }
    var title = $("#title").val();
    if (title == null || title == '') {
        tip.error('The game title should be input!');
        return;
    }
    gameDesc = gameDesc.replace(/(^;)|(;$)/g, "");
    // deploy and start the game
    var contract = web3.cmt.contract(betAbi);
    var feeDate = '0x' + contract.new.getData(gameDesc, numChoices - 1, {data: betBin.object});
    tip.loading('The Game : ' + title + " Initialization !");
    web3.cmt.estimateGas({data: feeDate}, function (e, returnGas) {
        var gas = '1700000';
        if (!e) {
            gas = Number(returnGas * 2);
        }
        contract.new([gameDesc, numChoices - 1], {
            from: userAddress.toString(),
            data: feeDate,
            gas: gas,
            gasPrice: '2000000000'
        }, function (e, instance) {
            if (e) {
                tip.close();
                tip.error('Bet contract Create failed ！');
            } else {
                contract_address = instance.address;
                // if callback fun have no result then should call function for check result for this tx
                var shouldCheckTheResult = Boolean($("#shouldCheckTheResult").val());
                if (typeof contract_address != 'undefined' && shouldCheckTheResult) {
                    shouldCheckTheResult = false;
                    console.log('Contract mined! address: ' + contract_address + ' transactionHash: ' + instance.transactionHash);
                    setTheContractAddressAndTurn(instance);
                    $("#shouldCheckTheResult").val("");
                }

                if (shouldCheckTheResult) {
                    console.log("call back have not result ,then will call the function for check the result by this tx ");
                    fun.checkTransactionStatus(instance.transactionHash, setTheContractAddressAndTurn, callbackError);
                    $("#shouldCheckTheResult").val("");
                }
            }
        });
    });
};

/**
 * get bet info
 */
var getUserAgent = function () {
    var agent = navigator.userAgent;
    var dappUrl = "cmtwallet://dapp?url=" + window.location.href;
    if (agent.indexOf('iPad') != -1 || agent.indexOf('iPhone') != -1 || agent.indexOf('Android') != -1) {
        tip.right("It will open the cmt wallet ")
        setTimeout(function () {
            window.location.href = dappUrl;
            setTimeout(function () {
                tip.error("Do not find CMT Wallet ,You should download first！");
                window.location.href = '../betting/testone.html';
                setTimeout(function () {
                    tip.error("Copy the link <a href='http://www.cybermiles.io/cmt-wallet/'>http://www.cybermiles.io/cmt-wallet/</a> and open the Browser ！");
                }, 3000)
            }, 3000)
        }, 2000);
    } else {
        tip.error("You should download MetaMask for CMT first！");
        setTimeout(function () {
            window.location.href = 'https://www.cybermiles.io/metamask/';
        }, 3000)
    }
}

/**
 * create contract success callback function
 */
var setTheContractAddressAndTurn = function (result) {
    if (result != null && (result.contractAddress != 'undefined' || result.address != 'undefined')) {
        tip.right('Bet contract Created ！');
        setTimeout(function () {
            var turnAddress = result.contractAddress;
            if (turnAddress == 'undefined') {
                turnAddress = result.address
            }
            console.log(turnAddress);
            window.location.href = './simplebet_join.html?contract=' + turnAddress;
        }, 2000);
    }
};

/**
 * create contract success callback function
 */
var callbackError = function () {
    tip.error('Bet contract Create failed ！');
};
