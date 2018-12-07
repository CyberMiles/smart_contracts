var fun = new MainFun();
var userAddress = '';
var betAbi = '';
var betBin = '';
var boxDivId = 'pupopBox';
var contract_address = '';
fun.addMainEvent(document.getElementById("addDiv"), "click", fun.createDivById("main-div-count"));
fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));

$(function () {
    var intervalFun = fun.popupLoadTip('pending .....', 1000);
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            fun.popupTip('The account address have an error');
        } else {
            $("#userAddress").val(address);
            removedTheInterval(intervalFun);
            userAddress = address;
        }
    });
    getAbi();
    getBin();
});

/**
 * if the popupTip had showed,then we will hide the popupTip div
 */
var removedTheInterval = function (intervalFun) {
    $("#removedTheInterval").val(true);
    fun.popupLoadTipClose(intervalFun, boxDivId);
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
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value != null && inputs[i].value != '') {
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
        fun.popupTip('The choices must bigger then two!');
    }
    var title = $("#title").val();
    if (title == null || title == '') {
        fun.popupTip('The game title should be input');
        return;
    }
    gameDesc = gameDesc.replace(/(^;)|(;$)/g, "");
    // deploy and start the game
    var contract = web3.cmt.contract(betAbi);
    var feeDate = '0x' + contract.new.getData(gameDesc, numChoices - 1, {data: betBin.object});
    var intervalFun = fun.popupLoadTip('pending .....', 3100);
    web3.cmt.estimateGas({data: feeDate}, function (e, returnGas) {
        var gas = '4700000';
        if (!e) {
            gas = returnGas;
        }
        contract.new([gameDesc, numChoices - 1], {
            from: userAddress.toString(),
            data: feeDate,
            gas: gas,
            gasPrice: '2000000000'
        }, function (e, instance) {
            if (e) {
                fun.popupTip('Start game failed!');
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
 * create contract success callback function
 */
var setTheContractAddressAndTurn = function (result) {
    if (result != null && (result.contractAddress != 'undefined' || result.address != 'undefined')) {
        fun.popupTip('Create this Bet Game Success，and then will turn to Bet Page!');
        setTimeout(function () {
            var turnAddress = result.contractAddress;
            if (turnAddress == 'undefined') {
                turnAddress = result.address
            }
            console.log(turnAddress);
            window.location.href = './simplebet_join.html?contract=' + turnAddress;
        }, 3000);
    }
};

/**
 * create contract success callback function
 */
var callbackError = function () {
    fun.popupTip('Create this Bet Game Failed，please refresh !');
};
