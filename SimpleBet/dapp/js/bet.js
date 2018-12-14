const fun = new MainFun();
const tip = IUToast;
const functionArray = ['Stop Bet', 'Declare Correct Option', 'Resume Bet', 'Copy Bet Link', 'Share Bet QR Code'];
const betStatus = ['Not Start', 'In Progress', 'Pending Confirm', 'End'];// functionArray status 0:init 1:progress 2:stop 3:end
const betStatusColor = ['#ff3636', '#6aba0c', '#f5a623', '#ff3636'];// betting status 0:init 1:progress 2:stop 3:end
const contract_address = fun.getParameter("contract");
const baseUrl = 'https://cybermiles.github.io/smart_contracts/SimpleBet/dapp/betting/simplebet_join.html';
var shareUrl = window.location.href;//baseUrl + "?contract=" + contract_address;
var userAddress = '';
const displayLink = "Copy CMT Code and goto CMT Wallet App to Bet! cmtwallet://dapp?url=" + shareUrl + " CMT Wallet Download Link：http://www.cybermiles.io/cmt-wallet/";
var contentId = "owner-bet";
var afterBtnName = "after-button";
var withdrawButtonName = "Withdraw bet reward";
var betAbi = '';
var betBin = '';
var contract = '';
var instance = '';  // contract instance
var gameDesc = '';  // the bet desc with title and choices
//Game status -1:unknown 0:init 1:progress 2:stop 3:end
var gameStatus = -1;
//Game title
var title = 'Bet title！';
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
// total bet user count
var totalBetCount = 0;
// total bet amount
var totalBetAmount = 0;
var lg = "";
// init the functions in the html
$(function () {
    // init the abi and bin
    getAbi();
    getBin();
    bindShare();
    var interval = setInterval(function () {
        if (betAbi.length > 0) {
            window.onload = checkGameStatus();
            clearInterval(interval);
        }
    }, 50);

    setInterval(function () {
        checkGameStatus('reload');
    }, 15 * 1000);

    setInterval(function () {
        getBetInfo();
    }, 10 * 1000);
});

var checkGameStatus = function (type) {
    if (type != 'reload') {
        tip.loading("Loading...");
    }
    try {
        web3.cmt
    } catch (e) {
        getUserAgent();
        return;
    }
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error("The account address have an error!");
        } else {
            userAddress = address.toString();
            var contractLink = '<a href="https://www.cmttracking.io/address/' + contract_address + '">' + dealUserAddress(contract_address) + '</a>'
            $("#contractAddress").html(contractLink);
            $("#removedTheInterval").val(true);
            contract = web3.cmt.contract(betAbi, contract_address);
            instance = contract.at(contract_address);
            instance.checkStatus(userAddress, function (gameError, result) {
                if (gameError) {
                    console.log(gameError);
                    tip.error("Game status have an error ,please refresh !");
                    return;
                } else {
                    gameStatus = Number(result[0]);
                    gameDesc = result[1];
                    userChoice = Number(result[2]);
                    userPayAmount = Number(result[3] / 1000000000000000000);
                    payoutAmount = Number(result[4] / 1000000000000000000);
                    statusPaid = Boolean(result[5]);
                    correctChoice = Number(result[6]);
                    // if the owner of this bet then show the betting settings
                    instance.owner(function (e, owner) {
                        if (owner && owner.toLowerCase() == userAddress.toLowerCase()) {
                            if (gameStatus != 3) {
                                showBetSetting(contentId, afterBtnName, "Bet settings", betSetting);
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
                        showUserChoice(gameStatus, userChoice, correctChoice);
                    }
                    //if the bet game had end
                    if (gameStatus == 3) {
                        if (document.getElementById("submit-div")) {
                            document.getElementById("submit-div").style.display = 'none';
                        }
                        // use selected the choice
                        showRightChoice(contentId, userChoice, correctChoice, afterBtnName, withdrawButtonName, statusPaid, payoutAmount);
                    }
                    // if it is first load ,when get result then close the popup
                    var callbackStop = $("#callbackStop").val();
                    if (!callbackStop) {
                        tip.closeLoad();
                    }
                    getBetInfo();
                }
            });
        }
    });
}

/**
 * update bet game info
 */
var getBetInfo = function () {
    instance.getBetInfo(function (e, result) {
        if (e) {
            console.log("It have an error when get this Bet Game info ：" + e);
            if (e.code == '1001') {
                tip.error("The Game you Get : " + e.message)
            } else {
                tip.error('The game you Get Bet Info have some error :' + e.code + ' , ' + e.message);
            }
        } else {
            gameStatus = Number(result[0]);
            totalBetCount = Number(result[3]);
            totalBetAmount = Number(result[4] / 1000000000000000000);
            betStatusFun(gameStatus);
            $("#totalBetCount").html(totalBetCount);
            $("#totalBetAmount").html(totalBetAmount);
        }
    });
}

/**
 * get bet info
 */
var getUserAgent = function () {
    var agent = navigator.userAgent;
    if (agent.indexOf('iPad') != -1 || agent.indexOf('iPhone') != -1 || agent.indexOf('Android') != -1) {
        tip.error("You should download CMT Wallet first！");
        setTimeout(function () {
            window.location.href = 'http://www.cybermiles.io/cmt-wallet/';
        }, 3000)
    } else {
        tip.error("You should download MetaMask for CMT first！");
        setTimeout(function () {
            window.location.href = 'https://www.cybermiles.io/metamask/';
        }, 3000)
    }
}

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
var showUserChoice = function (status, userChoice, correctChoice) {
    unbindSelect();
    if (document.getElementById("submit-div")) {
        document.getElementById("submit-div").remove();
    }
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
        sync: true,
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
    if (elements == undefined || elements == '' || elements == null) {
        return;
    }
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
 * add popuTip with the game status
 */
var betSetting = function () {
    // when the game is running
    if (gameStatus == 1) {
        fun.popupTipBottom([functionArray[0], functionArray[1]], funArray);
    }
    if (gameStatus == 2) {
        //when the game stop
        fun.popupTipBottom([functionArray[2], functionArray[1]], funArray);
    }
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
    if (!document.getElementById(btnId)) {
        fun.addButton(btnId, afterBtnName, buttonName, showColor, betFun);
    }
}

/**
 * show the game win result and bind withdraw event
 * @param contentId
 * @param afterBtnName
 * @param buttonName
 * @param betFun
 */
var showWithdraw = function (contentId, afterBtnName, buttonName, betFun) {
    var id = "winner-div";
    var showColor = "#1976d2";
    if (!document.getElementById(id)) {
        fun.addButton(contentId, afterBtnName, buttonName, showColor, betFun);
    }
    var content = '<div class="winner-show"><img class="end-icon" src="../images/trophy.png">&nbsp;&nbsp;&nbsp;&nbsp;Congratulations, to the winner!</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[1], content, [id], contentId);
}

/**
 * show the game win result and bind withdraw event
 * @param contentId
 * @param afterBtnName
 * @param buttonName
 * @param betFun
 */
var showWithdrawSuccess = function (contentId, payAmount) {
    var id = "winner-div";
    var divId = "choices";
    if (document.getElementById(id)) {
        document.getElementById(id).style.display = 'none';
    }
    var content = '<div class="winner-show"><img class="end-icon" src="../images/trophy.png">&nbsp;&nbsp;&nbsp;&nbsp;Congratulations, to the winner!</div>';
    content += '<div class="winner-show">You had got ' + payAmount + ' !</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[0], content, [id], divId);
}

/**
 * show the game failed result
 */
var showFailed = function (contentId) {
    var contentId = "choices";
    var id = "failed-div";
    if (document.getElementById(id)) {
        return;
    }
    var content = '<div class="failed-show"><img class="end-icon" src="../images/failed.png">&nbsp;&nbsp;&nbsp;&nbsp;Sorry, you bet failed!</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[0], content, [id], contentId);
}

/**
 * show the game not join
 */
var showNotJoin = function () {
    var contentId = "choices";
    var id = "not-join-div";
    if (document.getElementById(id)) {
        return;
    }
    var content = '<div class="failed-show"><img class="end-icon" src="../images/failed.png">&nbsp;&nbsp;&nbsp;&nbsp;Bet game is over！</div>';
    fun.addDivInnerhtml(domType[0], [attrType[0]], appendType[0], content, [id], contentId);
}

/**
 * user withdraw
 */
var withdraw = function () {
    tip.loading("Transaction Processing...");
    $("#callbackStop").val(true);
    instance.payMe(function (e, result) {
        if (e != null) {
            if (e.code == '1001') {
                tip.error("You withdraw : " + e.message)
            } else {
                tip.error('It have a error when withdraw :' + e.message);
            }
        } else {
            getGameStatus('withdraw');
        }
    });
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
    var choiceValue = $("#declareValue").val();
    var dateTime = new Date();
    var desc = "This Bet Game stop at the Time : " + dateTime + "， and the correct choice is ：" + fun.getLetterByNum(choiceValue);
    if (choiceValue <= 0) {
        tip.error("Please select a correct option！");
        return;
    }
    document.getElementById("pupopBox").style.display = "none";
    tip.loading("Transaction Processing...");
    $("#callbackStop").val(true);
    var feeData = instance.endGame.getData(choiceValue, desc);
    web3.cmt.estimateGas({
        data: feeData,
        to: contract_address
    }, function (error, gas) {
        var virtualGas = '20000000';
        if (error) {
            console.log("error for get gas");
        } else {
            virtualGas = gas;
        }
        console.log("Declare Bet Game gas is : " + virtualGas);
        instance.endGame(Number(choiceValue), desc, {
            gas: virtualGas,
            gasPrice: 2000000000
        }, function (e, result) {
            if (e) {
                if (e.code == '1001') {
                    tip.error("The Game you Declare : " + e.message)
                } else {
                    tip.error('"It have an error when declare this Bet Game :' + e.message);
                }
            } else {
                getGameStatus('declare');
            }
        });
    });
}

/**
 * bind the declare button event
 */
var declareBet = function () {
    var descs = gameDesc.split(";");
    var selects = [];
    for (var i = 1; i < descs.length; i++) {
        selects.push(fun.getLetterByNum(i) + '. ' + descs[i]);
    }
    var title = descs[0];
    var btnName = ['Declare', 'Cancel'];
    // create select popupTip
    fun.popupSelectTip(title, selects, btnName);
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
        document.getElementById("declareValue").value = inputValue;
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
    tip.loading("Transaction Processing...");
    $("#callbackStop").val(true);
    instance.stopGame({
        gas: 3000000,
        gasPrice: 2000000000
    }, function (e, result) {
        if (e) {
            if (e.code == '1001') {
                tip.error("The Game you Stop : " + e.message)
            } else {
                tip.error('"It have a error when stop this Bet Game：' + e.message);
            }
        } else {
            getGameStatus("stop");
        }
    });
}

/**
 * resume the game
 */
var resumeBet = function () {
    tip.loading("Transaction Processing...");
    $("#callbackStop").val(true);
    instance.resumeGame({
        gas: 3000000,
        gasPrice: 2000000000
    }, function (e, result) {
        if (e) {
            if (e.code == '1001') {
                tip.error("The Game you resume : " + e.message)
            } else {
                tip.error('"It have a error when resume this Bet Game：' + e.message);
            }
        } else {
            getGameStatus("resume");
        }
    });
}

/**
 * the bet link for share
 */
var shareLink = function () {
    var shareBetLink = "【WeBet：" + title + "】" + displayLink;
    var clipboard = new ClipboardJS('#create_share_btn', {
        text: shareBetLink
    });
    clipboard.on('success', function (e) {
        tip.right("Bet Link Copied！");
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
    var shareBetLink = "【WeBet：" + title + "】" + displayLink;
    var btnId = 'create_share_btn';
    var element = document.getElementsByName(functionArray[3])[0];
    // add alert msg div
    fun.addDivInnerhtml(domType[0], [attrType[0], attrType[2]], appendType[3], 'Bet Link Copied！', ["copy_tip_share", "copy_tip_share main-hidden-display"], '');
    //element.setAttribute("data-clipboard-target", copyId);
    element.setAttribute("id", btnId);
    element.setAttribute("data-clipboard-text", shareBetLink);
    var clipboard = new ClipboardJS('#create_share_btn', {});
    clipboard.on('success', function (e) {
        tip.right("Bet Link Copied！");
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
    if (document.getElementById('qrcode').childNodes.length > 0) {
        return;
    }
    setTimeout(function () {
        new QRCode(document.getElementById("qrcode"), {
            text: shareUrl,
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
    var isSupportDownload = 'download' in document.createElement('a'); //js 检测浏览器是否支持
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
    downloadLink.setAttribute('download', 'true');
    downloadLink.click();
}

var returnBack = function () {
    $("#showChoice").css("display", "block");
    $("#betShare").css("display", "block");
    $("#shareDiv").css("display", "none");
}

/**
 * submit your choice and input amount
 */
var confirmOption = function () {
    var selectedValue = $("#selectedValue").val();
    if (selectedValue == null || selectedValue == '' || selectedValue < 0) {
        tip.error("Please select you choice！")
        return;
    }
    var divTitle = "Bet CMT Amount";
    var inputDesc = "Enter Amount";
    var btnName = "Submit";
    fun.popupInputTip(divTitle, inputDesc, btnName);
    fun.addMainEvent(document.getElementById(btnName), "click", confirmOptionSubmit);
}

var onlyNumber = function (obj) {
    obj = obj.replace(/\D/g, '');
    var t = obj.charAt(0);
    if (t == 0) {
        obj = obj.substr(1, obj.length);
    }
    $("#SubmitValue").val(obj);
}

/**
 * submit the result with your choice and amount
 */
var confirmOptionSubmit = function () {
    var amount = $("#SubmitValue").val();
    var selectedValue = $("#selectedValue").val();
    amount = fun.onlyNumber(amount);
    if (amount == null || amount == '') {
        tip.error("Please fill right amount ！")
        return;
    }
    if (amount <= 0) {
        tip.error("The amount you fill should more than zero！")
        return;
    }

    if (gameStatus == 0) {
        tip.error("The Game have not start yet！")
        return;
    }
    if (gameStatus == 2) {
        tip.error("The Game had been stopped ！");
        return;
    }
    document.getElementById("pupopBox").style.display = "none";
    tip.loading("Transaction Processing...");
    $("#callbackStop").val(true);
    // change the submit button color and event
    var root = document.getElementsByClassName("main-button")[0];
    root.style.cssText = "background-color: #c6cfd5;";
    var obj = document.getElementById("submit-div");
    fun.delMainEvent(obj, "click", confirmOption);
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
                if (e.code == '1001') {
                    tip.error("The Game you Bet : " + e.message)
                } else {
                    tip.error('The game you Bet have some error :' + e.code + ' , ' + e.message);
                }
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
    title = descs[0];
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
    var choiceValue = $("#selectedValue").val();
    for (var i = 0; i < elements.length; i++) {
        fun.addMainEvent(elements[i], "click", optionSelect);
    }
    if (choiceValue != null && choiceValue != '' && choiceValue != undefined) {
        elements[choiceValue - 1].children[1].style.visibility = "visible";
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
                tip.error('Game status have an error ,please refresh !');
                return;
            } else {
                console.log(result.toString());
                gameStatus = Number(result[0]);
                gameDesc = result[1];
                userChoice = Number(result[2]);
                userPayAmount = Number(result[3] / 1000000000000000000);
                payoutAmount = Number(result[4] / 1000000000000000000);
                statusPaid = Boolean(result[5]);
                correctChoice = Number(result[6]);
                // if stop the game ,when the result for the game had return ,then will refresh this page
                console.log("Game check result is ：" + result);
                if (result) {
                    if (type == 'stop' && gameStatus == 2) {
                        tip.right("Bet Stopped ！");
                        $("#callbackStop").val();
                        clearInterval(interval);
                        betStatusFun(gameStatus);
                        unbindSelect();
                        if (userChoice < 1) {
                            hiddenAllSelect();
                        }
                        gameStatus = 2;
                    }
                    if (gameStatus == 1) {
                        gameStatus = 1;
                        if (type == 'resume') {
                            clearInterval(interval);
                            tip.right("Bet Resumed ！");
                            $("#callbackStop").val();
                            betStatusFun(gameStatus);
                            if (userChoice > 0) {
                                showUserChoice(gameStatus, userChoice, correctChoice);
                            } else {
                                bindSelect();
                            }
                        }
                        if (type == 'bet' && userChoice > 0) {
                            clearInterval(interval);
                            tip.right("Bet Submitted！");
                            $("#callbackStop").val();
                            showUserChoice(gameStatus, userChoice, correctChoice);
                            $("#userAmount").text(userPayAmount);
                        }
                    }

                    // when owner declare the bet game
                    if (gameStatus == 3) {
                        clearInterval(interval);
                        unbindSelect();
                        showUserChoice(gameStatus, userChoice, correctChoice);
                        if (type == 'declare') {
                            tip.right("Correct Option Declared！");
                            $("#callbackStop").val();
                            if (document.getElementById(contentId)) {
                                document.getElementById(contentId).style.display = 'none';
                            }
                            showRightChoice(contentId, userChoice, correctChoice, afterBtnName, withdrawButtonName, statusPaid, payoutAmount);
                        }
                        if (type == 'withdraw') {
                            tip.right("Withdraw success ! ");
                            $("#callbackStop").val();
                            if (document.getElementById(contentId)) {
                                document.getElementById(contentId).style.display = 'none';
                            }
                            showRightChoice(contentId, userChoice, correctChoice, afterBtnName, withdrawButtonName, statusPaid, payoutAmount);
                        }
                    }
                }
            }
        });
        // check bet game info
        getBetInfo();
    }, 6 * 1000);
}

/**
 * show right choice 、button and msg
 * @param contentId
 * @param userChoice
 * @param correctChoice
 * @param afterBtnName
 * @param withdrawButtonName
 * @param statusPaid
 * @param payoutAmount
 */
var showRightChoice = function (contentId, userChoice, correctChoice, afterBtnName, withdrawButtonName, statusPaid, payoutAmount) {
    if (userChoice > 0) {
        if (correctChoice == userChoice) {
            if (statusPaid) {
                showWithdrawSuccess(contentId, payoutAmount);
            } else {
                showWithdraw(contentId, afterBtnName, withdrawButtonName, withdraw);
            }
        } else {
            showFailed(contentId);
        }
    } else {
        showNotJoin(contentId);
    }
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
    document.getElementById("declareValue").value = '';
}