const fun = new MainFun();
const functionArray = ['Stop Bet', 'Declare Correct Option', 'Resume Bet', 'Copy Bet Link', 'Share Bet QR Code'];
const betStatus = ['Not Start', 'In Progress', 'Pending Confirm', 'End'];// functionArray status 0:init 1:progress 2:stop 3:end
const betStatusColor = ['#ff3636', '#6aba0c', '#f5a623', '#ff3636'];// betting status 0:init 1:progress 2:stop 3:end
//TODO online should replace this const to the prod env
const contract_address = fun.getParameter("contract");
const baseUrl = 'http://192.169.31.32:8088/workspace_go/smart_contracts/SimpleBet/dapp/betting/simplebet_join.html';
var localUrl = baseUrl + "?contract=" + contract_address;
var userAddress = '';
const displayLink = "Copy CMT Code and goto CMT Wallet App to Open Red Packet! " + localUrl + "CMT Wallet Download Link：https://www.cybermiles.io/cmt-wallet/";
const popupTipId = "pupopBox";
//fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));
var betAbi = '';
var betBin = '';
var contract = '';
var instance = '';  // contract instance
var gameDesc = '';  // the bet desc with title and choices
//Game status -1:unknown 0:init 1:progress 2:stop 3:end
var gameStatus = -1;
// Game correct choice
var correctChoice = -1;
// User choice of this Bet Game
var userChoice = -1;
// if paid for this Bet Game（type is boolean）
var statusPaid = -1;
// user pay amount for this Bet Game
var userPayAmount = 0;
// paid amount to user for this Bet Game
var payoutAmount = 0;

// init the functions in the html
$(function () {
    // init the abi and bin
    getAbi();
    getBin();
    bindShare();
    var interval = fun.popupLoadTip('pending .....', 1000);
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            fun.popupTip('The account address have an error');
        } else {
            userAddress = address.toString();
            $("#userAddress").html(dealUserAddress(userAddress));
            $("#removedTheInterval").val(true);
            fun.popupLoadTipClose(interval, popupTipId);
            contract = web3.cmt.contract(betAbi, contract_address);
            instance = contract.at(contract_address);
            instance.checkStatus(userAddress, function (gameError, result) {
                if (gameError) {
                    console.log(gameError);
                    fun.popupTip('Game status have an error ：' + gameError);
                    return;
                } else {
                    console.log(result.toString());
                    gameStatus = Number(result[0]);
                    gameDesc = result[1];
                    userChoice = Number(result[2]);
                    userPayAmount = Number(result[3] / 1000000000000000000);
                    payoutAmount = Number(result[4] / 1000000000000000000);
                    statusPaid = Boolean(result[5]);
                    // if the owner of this bet then show the betting settings
                    instance.owner(function (e, owner) {
                        if (owner && owner == address) {
                            if (gameStatus == 1) {
                                showBetSetting(contentId, afterBtnName, "Bet settings", betSettingStop);
                            }
                            if (gameStatus == 2) {
                                showBetSetting(contentId, afterBtnName, "Bet settings", betSettingResume);
                            }
                        }
                    });
                    showChoices(gameDesc);
                    betStatusFun(gameStatus);
                    $("#userAmount").text(userPayAmount);
                    // when the game stop or end ,unbind the event with these choice
                    if (gameStatus == 2 || gameStatus == 3) {
                        unbindSelect();
                    }
                    // user can not choice when user 1:selected 2:the game stop 3:the game end
                    if (userChoice > 0) {
                        showChoice(gameStatus, userChoice, correctChoice);
                    }
                    //if the bet game had end
                    var contentId = "owner-bet";
                    var afterBtnName = "after-button";
                    var buttonName = "Withdraw bet reward";
                    if (gameStatus == 3) {
                        // use selected the correct choice
                        if (userChoice > 0 && correctChoice == userChoice) {
                            showWithdraw(contentId, afterBtnName, buttonName, withdraw);
                        } else {
                            showFailed(contentId);
                        }
                    }
                }
            });
        }
    });
});

/**
 * hide some of userAddress
 * @param address
 * @returns {string}
 */
var dealUserAddress = function (address) {
    var result = "0x0000....0000";
    if (address != null && address != '' && address.length > 10) {
        result = address.substr(0, 5) + '....' + address.substr(address.length - 5, 5);
    }
    return result;
}

/**
 * show user choice and the correct choice
 * @param status        game status
 * @param userChoice    user choice
 * @param correctChoice correct choice
 */
var showChoice = function (status, userChoice, correctChoice) {
    unbindSelect();
    document.getElementById("submit-div").remove();
    var elements = document.getElementsByName("choice");
    for (var i = 0; i < elements.length; i++) {
        var selectValue = elements[i].lastChild.textContent
        if (selectValue == userChoice) {
            elements[i].childNodes[1].style.visibility = 'visible';
        }
        if (selectValue == correctChoice) {
            elements[i].style.cssText = 'background-color: rgba(79, 234, 57, 0.2);';
        }
    }
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

/**
 * remove choice onclick event
 */
var unbindSelect = function () {
    var elements = document.getElementsByName("choice");
    for (var i = 0; i < elements.length; i++) {
        fun.delMainEvent(elements[i], "click", optionSelect);
    }
}

/**
 * add choice onclick event
 */
var bindSelect = function () {
    var elements = document.getElementsByName("choice");
    for (var i = 0; i < elements.length; i++) {
        fun.addMainEvent(elements[i], "click", optionSelect);
    }
}

/**
 * init bet status with functions
 * @param status
 */
var betStatusFun = function (status) {
    var element = document.getElementById("bet-status");
    var betValue = betStatus[0];
    var betColor = betStatusColor[0];
    for (var st in betStatus) {
        if (status == st) {
            betValue = betStatus[st];
            betColor = betStatusColor[st];
            break;
        }
    }
    element.innerText = betValue;
    element.style.cssText = 'color:' + betColor;
}

/**
 * add popuTip when the game status is running
 */
var betSettingStop = function () {
    fun.popupTipBottom([functionArray[0], functionArray[1]], funArray);
}

/**
 * add popuTip when the game status is stop
 */
var betSettingResume = function () {
    fun.popupTipBottom([functionArray[2], functionArray[1]], funArray);
}

/**
 * bind bet setting btn event
 * @param btnId
 * @param afterBtnName
 * @param buttonName
 * @param betFun
 */
var showBetSetting = function (btnId, afterBtnName, buttonName, betFun) {
    var showColor = "#1976d2";
    fun.addButton(btnId, afterBtnName, buttonName, showColor, betFun);
}

/**
 * show the game win result and bind withdraw event
 * @param contentId
 * @param afterBtnName
 * @param buttonName
 * @param betFun
 */
var showWithdraw = function (contentId, afterBtnName, buttonName, betFun) {
    var showColor = "#1976d2";
    fun.addButton(contentId, afterBtnName, buttonName, showColor, betFun);
    var id = "winner-div";
    var content = '<div class="winner-show"><img class="end-icon" src="../images/trophy.png">&nbsp;&nbsp;&nbsp;&nbsp;Congratulations, to the winner!</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[1], content, [id], contentId);
}

/**
 * show the game failed result
 */
var showFailed = function () {
    var contentId = "choices";
    var id = "failed-div";
    var content = '<div class="failed-show"><img class="end-icon" src="../images/failed.png">&nbsp;&nbsp;&nbsp;&nbsp;Sorry, you bet failed!</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[0], content, [id], contentId);
}

/**
 * user withdraw
 */
var withdraw = function () {
    //TODO user withdraw
    alert("withdraw");
}

/**
 * get all functions
 * @returns {Map<any, any>}
 */
var funArray = function () {
    const map = new Map();
    for (var id in functionArray) {
        var key = functionArray[id];
        if (key == functionArray[0]) {
            map.set(key, stopBet);
        }
        if (key == functionArray[1]) {
            map.set(key, declareBet);
        }
        if (key == functionArray[2]) {
            map.set(key, resumeBet);
        }
        if (key == functionArray[3]) {
            map.set(key, shareLink);
        }
        if (key == functionArray[4]) {
            map.set(key, shareQRCode);
        }
    }
    return map;
}

/**
 * declare correct choice
 */
var declareBetGame = function () {
    //TODO declare correct option
    fun.popupTip('declare game ing...........');
    var choiceValue = $("#selectedValue").val();
}

/**
 * bind the declare button event
 */
var declareBet = function () {
    var title = "how is the weather today？";
    var select = ['A. Smog', 'B. Snowing', 'C. Rain', 'D. Rain', 'E. Rain'];
    var btnName = ['Declare', 'Cancel'];
    // create select popupTip
    fun.popupSelectTip(title, select, btnName);
    fun.addMainEvent(document.getElementById(btnName[0]), "click", declareBetGame);
    fun.addMainEvent(document.getElementById(btnName[1]), "click", declareBetCancel);
    var elements = document.getElementsByName("choiceAlert");
    for (var i = 0; i < elements.length; i++) {
        fun.addMainEvent(elements[i], "click", optionSelectAlert);
    }
}

/**
 * show the choice where user selected
 */
var optionSelectAlert = function () {
    var inputValue = this.children[2].innerHTML;
    var currentVisible = this.children[1].style.visibility;
    hiddenAllSelectAlert();
    if (currentVisible != 'visible') {
        this.children[1].style.visibility = 'visible';
        document.getElementById("selectedValue").value = inputValue;
    }
}

/**
 * declare cancel
 */
var declareBetCancel = function () {
    fun.removePopupTip();
}

/**
 * stop the bet
 */
var stopBet = function () {
    var interval = fun.popupLoadTip('resume ing .....', 3100);
    instance.stopGame({
        gas: 3000000,
        gasPrice: 2000000000
    }, function (e, result) {
        if (e) {
            fun.popupTip('It have a error when stop this Bet Game : ' + e);
        } else {
            getGameStatus("stop");
            setTimeout(function () {
                fun.popupLoadTipClose(interval, popupTipId);
            }, 20000)
        }
    });
}

/**
 * resume the game
 */
var resumeBet = function () {
    var interval = fun.popupLoadTip('resume ing .....', 3100);
    instance.resumeGame({
        gas: 3000000,
        gasPrice: 2000000000
    }, function (e, result) {
        if (e) {
            fun.popupTip('It have a error when resume this Bet Game : ' + e);
        } else {
            getGameStatus("resume");
            fun.popupLoadTipClose(interval, popupTipId);
        }
    });
}

/**
 * the bet link for share
 */
var shareLink = function () {
    var clipboard = new ClipboardJS('#create_share_btn');
    clipboard.on('success', function (e) {
        fun.popupTip('Bet Link Copied');
        setTimeout(function () {
            fun.removePopupTip();
        }, 2000);
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

/**
 * init copy link
 */
var initCopyLink = function () {
    $("#share_link").val(displayLink);
    var copyId = '#share_link';
    var btnId = 'create_share_btn';
    var element = document.getElementsByName(functionArray[3])[0];
    // add alert msg div
    fun.addDivInnerhtml(domType[0], [attrType[0], attrType[2]], appendType[3], 'Bet Link Copied！', ["copy_tip_share", "copy_tip_share main-hidden-display"], '');
    element.setAttribute("data-clipboard-target", copyId);
    element.setAttribute("id", btnId);
    var clipboard = new ClipboardJS('#create_share_btn');
    clipboard.on('success', function (e) {
        fun.popupTip('resume game');
        setTimeout(function () {
            fun.removePopupTip();
        }, 2000);
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}

/**
 * share QR Code for the Bet Game
 */
var shareQRCode = function () {
    document.getElementById("showChoice").style.display = "none";
    document.getElementById("betShare").style.display = "none";
    document.getElementById("shareDiv").style.display = "block";
    var url = baseUrl + '?contract=' + contract_address;
    setTimeout(function () {
        new QRCode(document.getElementById("qrcode"), {
            text: url,
            width: 146,
            height: 148,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }, 1);
}

/**
 * download the image to local
 */
var saveQRImage = function () {
    var img = document.getElementById('qrcode').getElementsByTagName('img')[0];
    // 构建画布
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    // 构造url
    var url = canvas.toDataURL('image/png');
    // 构造a标签并模拟点击
    var downloadLink = document.getElementById('downloadLink');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', 'WeBet share image：' + contract_address);
    downloadLink.click();
}

/**
 * submit your choice and input amount
 */
var confirmOption = function () {
    var selectedValue = $("#selectedValue").val();
    if (selectedValue == null || selectedValue == '' || selectedValue < 0) {
        fun.popupTip('please select you choice!');
        return;
    }
    var divTitle = "Bet CMT amount";
    var inputDesc = "Enter Amount";
    var btnName = "Submit";
    fun.popupInputTip(divTitle, inputDesc, btnName);
    fun.addMainEvent(document.getElementById(btnName), "click", confirmOptionSubmit);
}

/**
 * submit the result with your choice and amount
 */
var confirmOptionSubmit = function () {
    var amount = $("#SubmitValue").val();
    var selectedValue = $("#selectedValue").val();
    fun.popupLoadTip('pending .....', 3100);
    if (amount <= 0) {
        fun.popupTip('The amount you fill should more than zero!')
        return;
    }
    if (gameStatus == 0) {
        fun.popupTip('The Game have not start yet!')
        return;
    }
    if (gameStatus == 2) {
        fun.popupTip('The Game had been stopped !')
        return;
    }
    var feeData = instance.placeBet.getData(selectedValue + "");
    var amountStr = String(web3.toWei(amount, "cmt"));
    web3.cmt.estimateGas({
        data: feeData,
        to: contract_address,
        value: amountStr
    }, function (error, gas) {
        var virtualGas = '20000000';
        if (error) {
            console.log("error for get gas");
        } else {
            virtualGas = gas;
        }
        instance.placeBet(selectedValue, {
            value: web3.toWei(amount, "cmt"),
            gas: virtualGas,
            gasPrice: 2000000000
        }, function (e, result) {
            if (e) {
                console.log("bet result : " + result);
                fun.popupTip('The game you bet have some error :' + e);
            } else {
                getGameStatus('bet');
            }
        });
    });
}

/**
 * show the choice
 */
var showChoices = function (gameDesc) {
    if (gameDesc == null || gameDesc == '' || gameDesc.split(";").length < 1) {
        console.log("This bet game have no set choice and title");
        return;
    }
    var descs = gameDesc.split(";");
    if (descs.length == 1) {
        console.log("This bet game have no choice");
        $("#betTitle").text(descs[0]);
        return;
    }
    var values = descs;
    var html = '';
    $("#betTitle").text(descs[0]);
    if (values instanceof Array) {
        for (var i = 1; i < values.length; i++) {
            var div = '<div class="main-contain"><div class="main-bet-choice" name="choice">' +
                '<p class="main-bet-join-div">' + fun.getLetterByNum(i) + '. ' + values[i] + '</p><p class="main-bet-choice-right-div main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></p><p hidden="hidden">' + i + '</p></div></div>';
            html += div;
        }
    } else {
        if (values == null || values == undefined) {
            values = 'Have No choice! ';
        }
        var div = '<div class="main-contain"><div class="main-bet-choice" name="choice">' +
            '<p class="main-bet-join-div">' + values + '</p><p class="main-bet-choice-right-div main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></p><p hidden="hidden">' + 0 + '</p></div></div>';
        html += div;
    }
    document.getElementById("choices").innerHTML = html;
    var elements = document.getElementsByName("choice");
    for (var i = 0; i < elements.length; i++) {
        fun.addMainEvent(elements[i], "click", optionSelect);
    }
};

/**
 * get the game status
 */
var getGameStatus = function (type) {
    var interval = setInterval(function () {
        instance.checkStatus(userAddress, function (gameError, result) {
            if (gameError) {
                console.log(gameError);
                fun.popupTip('Game status have an error ：' + gameError);
                return;
            } else {
                console.log(result.toString());
                gameStatus = Number(result[0]);
                gameDesc = result[1];
                userChoice = Number(result[2]);
                userPayAmount = Number(result[3] / 1000000000000000000);
                payoutAmount = Number(result[4] / 1000000000000000000);
                statusPaid = Boolean(result[5]);
                if (gameError) {
                    console.log("Get the bet game status : " + result);
                    fun.popupTip('Get the bet game status have some error :' + e);
                } else {
                    // if stop the game ,when the result for the game had return ,then will refresh this page
                    console.log("Game check result is ：" + result);
                    if (result) {
                        if (type == 'stop' && gameStatus == 2) {
                            fun.popupTip("The Game had stopped!");
                            clearInterval(interval);
                            betStatusFun(gameStatus);
                            unbindSelect();
                            hiddenAllSelect();
                            gameStatus = 2;
                        }
                        if (gameStatus == 1) {
                            gameStatus = 1;
                            if (type == 'resume') {
                                clearInterval(interval);
                                fun.popupTip("The Game had resumed !");
                                betStatusFun(gameStatus);
                                bindSelect();
                            }
                            if (type == 'bet' && userChoice > 0) {
                                clearInterval(interval);
                                fun.popupTip("The Game you bet success !");
                                showChoice(gameStatus, userChoice, correctChoice);
                                $("#userAmount").text(userPayAmount);
                            }
                        }
                    }
                }
            }
        });
    }, 3000);
}

/**
 * change the selected option style
 */
var optionSelect = function () {
    var inputValue = this.children[2].innerHTML;
    var currentVisible = this.children[1].style.visibility;
    hiddenAllSelect();
    if (currentVisible != 'visible') {
        this.children[1].style.visibility = 'visible';
        document.getElementById("selectedValue").value = inputValue;
        var root = document.getElementsByClassName("main-button")[0];
        root.style.cssText = "background-color: #1976d2;";
        var obj = document.getElementById("submit-div");
        fun.addMainEvent(obj, "click", confirmOption);
    }
}

/**
 * bind the share button onclick event
 */
var bindShare = function () {
    $("#share_link").val(displayLink);
    fun.addMainEvent(document.getElementById("betShare"), "click", shareFunctions);
}

/**
 * bind share function
 */
var shareFunctions = function () {
    fun.popupTipBottom([functionArray[3], functionArray[4]], funArray);
    initCopyLink();
}

/**
 * hidden all choice
 */
var hiddenAllSelect = function () {
    var allElement = document.getElementsByClassName("main-bet-choice-right-div");
    for (var i = 0; i < allElement.length; i++) {
        allElement[i].style.visibility = 'hidden';
    }
    var root = document.getElementsByClassName("main-button")[0];
    root.style.cssText = "background-color: #c6cfd5;";
    var obj = document.getElementById("submit-div");
    fun.delMainEvent(obj, "click", confirmOption);
    document.getElementById("selectedValue").value = '';
}

/**
 * hidden all alert choice
 */
var hiddenAllSelectAlert = function () {
    var allElement = document.getElementsByClassName("main-bet-choice-right-div-alert");
    for (var i = 0; i < allElement.length; i++) {
        allElement[i].style.visibility = 'hidden';
    }
    document.getElementById("selectedValue").value = '';
}

/**
 * create contract success callback function
 */
var setTheContractAddressAndTurn = function (result) {
    console.log(result);
    if (result != null && (result.contractAddress != 'undefined' || result.address != 'undefined')) {
        fun.popupTip('Create this Bet Game Success，and then will turn to Bet Page!');
        setTimeout(function () {
            // window.location.reload();
        }, 3000);
    }
};

/**
 * create contract success callback function
 */
var callbackError = function () {
    fun.popupTip('Create this Bet Game Failed，please refresh !');
};