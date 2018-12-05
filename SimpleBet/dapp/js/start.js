var fun = new MainFun();

fun.addMainEvent(document.getElementById("addDiv"), "click", fun.createDivById("main-div-count"));
fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));

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
    fun.popupTip('The account address have an error');
    return;
    gameDesc = gameDesc.replace(/(^;)|(;$)/g, "");
    // deploy and start the game
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            fun.popupTip('The account address have an error');
        } else {
            var feeDate = '0x' + contract.new.getData(gameDesc, numChoices, {data: betByteCode.object});
            web3.cmt.estimateGas({data: feeDate}, function (e, estimategas) {
                var gas = '4700000';
                if (!e) {
                    gas = estimategas;
                }
                contract.new([gameDesc, numChoices], {
                    from: address.toString(),
                    data: feeDate,
                    gas: gas,
                    gasPrice: '2000000000'
                }, function (e, instance) {
                    console.log(instance);
                    console.log(e);
                    if (e) {
                        fun.popupTip('Start game failed!');
                    } else {
                        if (typeof instance.address !== 'undefined') {
                            var contract_address = instance.address;
                            window.location.search = "?contract=" + contract_address;
                            document.getElementById("startGameResult").innerHTML = "Success hash : " + instance + ". You can stop / resume it as people vote.";
                            showQRAndUrl(contract_address);
                            console.log('Contract mined! address: ' + contract_address + ' transactionHash: ' + instance.transactionHash);
                        } else {
                            document.getElementById("alertTxtSuccess").innerHTML = "Please wait for the game deploy !";
                            fun.popupTip('Please wait for the game deploy !');
                        }
                    }
                });
            });
        }
    });
}

/*

new MainFun.addEvent(document.getElementById("addDiv"), "click", mainFun.createDiv());
new MainFun.addEvent(document.getElementById("delDiv"), "click", mainFun.removeLastDiv());
// check choice and show the submit button
mainFun.checkChoice(document.getElementsByName("choice"), document.getElementsByClassName("main-button")[0], document.getElementById("submit-div"), "click", startFun.startGame());

var startFun = (function () {

    var _startGame = function () {
        alert("start game");
    };

    var StartFun = function (...args) {
    };``

    StartFun.startGame = function () {
        _startGame();
    };

    return startFun;
});*/
