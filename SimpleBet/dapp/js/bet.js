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
//fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));
var betAbi = '';
var betBin = '';
var contract = '';
var instance = '';  // contract instance
//Game status -1:unknown 0:init 1:progress 2:stop 3:end
var gameStatus = -1;
// Game correct choice
var correctChoice = -1;
// User choice of this bet Game
var userChoice = -1;
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
            fun.popupLoadTipClose(interval, "pupopBox");
            contract = web3.cmt.contract(betAbi, contract_address);
            instance = contract.at(contract_address);
            instance.checkStatus(userAddress, function (gameError, result) {
                if (gameError) {
                    console.log(gameError);
                    fun.popupTip('Game status have an error ：' + gameError);
                    return;
                } else {
                    gameStatus = BigInt(result[0]);
                    var gameDesc = result[1];
                    var choice = BigInt(result[2]);
                    var status_amount = BigInt(result[3] / 1000000000000000000);
                    var status_payout = BigInt(result[4] / 1000000000000000000);
                    var status_paid = Boolean(result[5]);
                    // if the owner of this bet then show the betting settings
                    console.log(gameStatus);
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
                    showChoices();
                    betStatusFun(gameStatus);
                    // user can not choice when user 1:selected 2:the game stop 3:the game end
                    if (gameStatus != 1 || userChoice >= 0) {
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
            //betAbi = JSON.parse(data);
            betAbi = [
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_correct_choice",
                            "type": "int8"
                        },
                        {
                            "name": "_correct_choice_txt",
                            "type": "string"
                        }
                    ],
                    "name": "endGame",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "payMe",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [
                        {
                            "name": "_choice",
                            "type": "int8"
                        }
                    ],
                    "name": "placeBet",
                    "outputs": [],
                    "payable": true,
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "resumeGame",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "stopGame",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "constant": false,
                    "inputs": [],
                    "name": "terminate",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "name": "_game_desc",
                            "type": "string"
                        },
                        {
                            "name": "_number_of_choices",
                            "type": "int8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "constant": true,
                    "inputs": [
                        {
                            "name": "_addr",
                            "type": "address"
                        }
                    ],
                    "name": "checkStatus",
                    "outputs": [
                        {
                            "name": "",
                            "type": "int8"
                        },
                        {
                            "name": "",
                            "type": "string"
                        },
                        {
                            "name": "",
                            "type": "int8"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "correct_choice",
                    "outputs": [
                        {
                            "name": "",
                            "type": "int8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "correct_choice_txt",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "game_desc",
                    "outputs": [
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "game_status",
                    "outputs": [
                        {
                            "name": "",
                            "type": "int8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "getAnswer",
                    "outputs": [
                        {
                            "name": "",
                            "type": "int8"
                        },
                        {
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "number_of_choices",
                    "outputs": [
                        {
                            "name": "",
                            "type": "int8"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "constant": true,
                    "inputs": [],
                    "name": "owner",
                    "outputs": [
                        {
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "payable": false,
                    "stateMutability": "view",
                    "type": "function"
                }
            ]
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
 * stop the bet
 */
var stopBet = function () {
    //TODO stop game
    fun.popupTip('stop pending');
    setTimeout(function () {
        fun.removePopupTip();
    }, 112000)
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
 * resume the game
 */
var resumeBet = function () {
    //TODO resume game
    fun.popupTip('resume game');
    setTimeout(function () {
        fun.removePopupTip();
    }, 2000)
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
    fun.popupLoadTip('pending .....', 3100);
    return;
    if (amount <= 0) {
        fun.popupTip('The amount you fill should more than zero!')
        return;
    }
    //fun.popupTip('The choice you submit is pending， wait for seconds!')
    fun.popupLoadTip('pending .....', 3100);
}

/**
 * show the choice
 */
var showChoices = function (values) {
    var html = '';
    if (values instanceof Array) {
        for (var i = 0; i < values.length; i++) {
            var div = '<div class="main-contain"><div class="main-bet-choice" name="choice">' +
                '<p class="main-bet-join-div">' + values[i] + '</p><p class="main-bet-choice-right-div main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></p><p hidden="hidden">' + i + '</p></div></div>';
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
