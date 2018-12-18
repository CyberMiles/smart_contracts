const betStatus = ['Not Start', 'Progress', 'Pending', 'End'];
var fun = new MainFun();
const lang = fun.languageChoice();
var tip = IUToast;
var userAddress = '';
var betAbi = '';
var betBin = '';
var contract_address = '';
var contract = '';
var instance = '';
var loadCount = 0;
fun.addMainEvent(document.getElementById("addDiv"), "click", fun.createDivById("main-div-count"));
fun.addMainEvent(document.getElementById("delDiv"), "click", fun.removeLastDiv("main-div-count"));

var webBrowser = new AppLink();


$(function () {
    getAbi();
    getBin();
    initLanguage();
    initUserAddress();
    webBrowser.openBrowser();
});

// init language
var initLanguage = function () {
    if (lang == '' || lang == null) {
        return;
    }
    //$("#title").attr("placeholder", lang.title);
    console.log(lang.title);
    console.log(lang.title);
}

var initUserAddress = function () {
    var interval = setInterval(function () {
        web3.cmt.getAccounts(function (e, address) {
            if (address) {
                userAddress = address.toString();
                $("#userAddress").val(address);
                userAddress = address;
                tip.closeLoad();
                clearInterval(interval);
            }
        });
    }, 300);
}

var showBetList = function (type) {
    $(".start-content").css("display", "none");
    $(".list-content").css("display", "block");
    $("#listButton").css("display", "block");
    var pageNo = $("#currentPage").val();
    var pageSize = 10;
    if (type == 'first') {
        pageNo = 1;
    }
    if (type == 'last') {
        pageNo = $("#totalPage").val()
    }
    if (type == 'previous') {
        if (pageNo > 1) {
            pageNo = pageNo - 1;
        } else {
            pageNo = 1;
            tip.right("This is already the First Page！");
            return;
        }
    }
    if (type == 'next') {
        var totalPage = $("#totalPage").val();
        if (pageNo >= totalPage) {
            pageNo = totalPage;
            tip.right("This is already the Last Page！");
            return;
        } else {
            pageNo = Number(pageNo) + 1;
        }
    }
    $("#currentPage").val(pageNo);
    showListContent(pageSize, pageNo);
}

var backNewContract = function () {
    $(".start-content").css("display", "block");
    $(".list-content").css("display", "none");
    $("#listButton").css("display", "none");
    $("#listContent").children().remove();
}

var showListContent = function (pageSize, pageNo) {
    var methodId = 'de2fd8ab,83bd72ba,3cc4c6ce,9c16667c,340190ec';
    if (pageNo == 1) {
        $("#previousPage").remove("href");
    }
    var textHtml = '';
    if (pageSize == null || pageSize == '' || pageSize == 'undefined' || pageSize <= 0 || pageSize >= 10) {
        pageSize = 10;
    }
    if (pageNo == null || pageNo == '' || pageNo == 'undefined' || pageNo <= 0) {
        pageNo = 1;
    }
    tip.loading("Loading...");
    var url = 'https://test-api.cmttracking.io/api/v3/contractsByType?funcIds=' + methodId + "&address=" + userAddress + "&limit=" + pageSize + "&page=" + pageNo
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (result) {
            if (result && result.data && result.data.objects) {
                $("#listContent").children().remove();
                $("#totalCount").val(result.data.meta.total);
                var totalPage = parseInt(result.data.meta.total / 10) + 1;
                $("#totalPage").val(totalPage);
                var lastCount = result.data.meta.total % 10;
                if (pageNo < totalPage) {
                    lastCount = pageSize;
                }
                loadCount = 0;
                for (var i = 0; i < result.data.objects.length; i++) {
                    var id = 'showListId' + i;
                    var obj = result.data.objects[i];
                    textHtml = '<a id="' + id + '" href="../betting/simplebet_join.html?contract=' + obj.address + '" ></a>'
                    $("#listContent").append(textHtml);
                    appendChildList(obj.address, id, lastCount);
                }
            }
        },
        error: function (e) {
            console.log("Get user contract address failed" + e)
        }
    });
}

var appendChildList = function (contractAddress, id, lastCount) {
    contract = web3.cmt.contract(betAbi, contract_address);
    instance = contract.at(contractAddress);
    instance.getBetInfo(function (e, result) {
        loadCount++;
        if (e) {
            console.log("It have an error when get this Bet Game info ：" + e);
            if (e.code == '1001') {
                tip.error("The Game you Get : " + e.message);
            }
        } else {
            var gameStatus = Number(result[0]);
            var gameDesc = result[1];
            var totalBetCount = Number(result[3]);
            var totalBetAmount = Number(result[4] / 1000000000000000000);
            if (totalBetAmount > 0) {
                totalBetAmount = totalBetAmount.toFixed(4);
            }
            var descArray = gameDesc.split(";");
            var title = 'Bet title';
            if (descArray.length > 0) {
                title = descArray[0];
                if (title.length > 15) {
                    title = title.substr(0, 10) + "...";
                }
            }
            var html = '<div class="showBetContent share-font"><div>' +
                '<div class="list-head">' + title + '</div>' +
                '<div class="list-head">' + betStatus[gameStatus] + '</div>' +
                '<div class="list-head">' + totalBetCount + '</div>' +
                '<div class="list-head">' + totalBetAmount + '</div></div><div class="list-head-div"><div class="list-line"></div></div></div>';
            $("#" + id).append(html);
        }
        if (loadCount >= lastCount) {
            tip.closeLoad();
        }
    });
}

var checkChoice = function (inputValue) {
    var obj = document.getElementById("submit-div");
    var inputs = document.getElementsByName("choice");
    var root = document.getElementsByClassName("main-button")[0];
    var count = 0;
    var title = $("#title").val();
    if (inputValue == '' || inputValue == null || inputValue == 'undefined') {
        if (title.length >= 140) {
            tip.error("Title should less than 140 ！");
            return;
        }
    } else {
        if (inputValue.length >= 20) {
            tip.error("Option should less than 20 ！");
            return;
        }
    }
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
