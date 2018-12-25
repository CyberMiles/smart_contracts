var fun = new MainFun();
const lang = fun.languageChoice();
var tip = IUToast;
var userAddress = '';
var betAbi = '';
var betBin = '';
var contract_address = '';
var contract = '';
var instance = '';
var loading = 'Loading...';
var betStatusColor = ['#ff3636', '#6aba0c', '#f5a623', '#ff3636'];
var webBrowser = new AppLink();
var divCount = 0;
var hadLoading = false;
var pageSize = 10;
$(function () {
    getAbi();
    getBin();
    initLanguage();
    initUserAddress();
    showListContent();
    webBrowser.openBrowser();
    fun.addMainEvent(document.getElementById("backBetList"), "click", backNewContract);
});

$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var clientHeight = $(this).height()
    if (!hadLoading) {
        if (scrollTop + clientHeight >= scrollHeight) {
            //showListContent();
            document.getElementById("listContent").lastChild.style = 'margin-bottom:60px';
        } else if (scrollTop <= 0) {
            //tip.right(lang.tip.firstPage);
            return;
        }
    }
});

var sleep = function (milliseconds) {
    new Promise(resolve => setTimeout(resolve, milliseconds))

}

// init language
var initLanguage = function () {
    if (lang == '' || lang == null) {
        return;
    }
    fun.changeDomContentById("backBetList", lang.my.backBetList);
}

var initUserAddress = function () {
    var interval = setInterval(function () {
        web3.cmt.getAccounts(function (e, address) {
            if (address) {
                userAddress = address.toString();
                $("#userAddress").val(userAddress);
                clearInterval(interval);
            }
        });
    }, 300);
}

var backNewContract = function () {
    window.location.href = "./simplebet_index.html";
}

var showListContent = function (pageNo, userAddress) {
    var pageNo = Number($("#currentPage").val());
    var totalPage = Number($("#totalPage").val());
    if (pageNo >= totalPage) {
        pageNo = totalPage;
        tip.right(lang.tip.lastPage);
        return;
    } else {
        pageNo++;
    }
    $("#currentPage").val(pageNo);
    tip.loading(lang.tip.loading);
    var interval = setInterval(function () {
        userAddress = $("#userAddress").val();
        if (userAddress) {
            clearInterval(interval);
            requestListInfo(1);
        }
    }, 300);
}

var requestListInfo = function (pageNo) {
    var methodId = 'de2fd8ab,83bd72ba,3cc4c6ce,9c16667c,340190ec';
    var url = 'https://test-api.cmttracking.io/api/v3/contractsByType?funcIds=' + methodId + "&limit=" + pageSize + "&page=" + pageNo
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (result) {
            if (result && result.data && result.data.objects) {
                $("#totalCount").val(result.data.meta.total);
                var totalPage = parseInt(result.data.meta.total / pageSize) + 1;
                $("#totalPage").val(totalPage);
                var lastCount = result.data.meta.total % pageSize;
                if (pageNo < totalPage) {
                    lastCount = pageSize;
                }
                var id = "listContent";
                divCount = 0;
                for (var i = 0; i < result.data.objects.length; i++) {
                    var obj = result.data.objects[i];
                    appendChildList(obj.address, id, lastCount, userAddress);
                }
            }
        },
        error: function (e) {
            console.log("Get user contract address failed" + e)
        }
    });
}


var appendChildList = function (contractAddress, id, lastCount, userAddress) {
    document.getElementById(document.getElementById("listContent").lastChild.style = 'margin-bottom:1px');
    var contract = web3.cmt.contract(betAbi, contractAddress);
    var instance = contract.at(contractAddress);
    instance.checkStatus(userAddress, function (statusError, choiceResult) {
        if (!statusError) {
            var userChoice = Number(choiceResult[2]);
            var showCount = $("#showCount").val();
            if (userChoice > 0) {
                appendHtml(instance, showCount, contractAddress, id);
            }
            instance.owner(function (e, ownerAddress) {
                if (ownerAddress.toString().toLowerCase() == userAddress.toLowerCase()) {
                    appendHtml(instance, showCount, contractAddress, id);
                }
            });
            var total = $("#totalPage").val();
            var selfPageNo = Number($("#currentPage").val());
            if (selfPageNo < total) {
                if (selfPageNo < total) {
                    selfPageNo++;
                    $("#currentPage").val(selfPageNo);
                    requestListInfo(selfPageNo);
                }
                return;
            }
        }
    });
    var interval = setInterval(function () {
        var currentPage = $("#currentPage").val();
        var showCount = $("#showCount").val();
        var totalPage = $("#totalPage").val();
        if (showCount >= pageSize || currentPage >= totalPage) {
            setTimeout(function () {
                hadLoading = false;
                clearInterval(interval);
                tip.closeLoad();
            }, 500)
        }
    }, 500);
}

var appendHtml = function (instance, showCount, contractAddress, id) {
    instance.getBetInfo(function (e, result) {
        if (e) {
            console.log("It have an error when get this Bet Game info ：" + e);
            if (e.code == '1001') {
                tip.error(lang.tip.getBetInfoError + "：" + e.message);
            }
        } else {
            showCount++;
            $("#showCount").val(showCount);
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
                var length = 0;
                var subLength = 0;
                for (var i = 0; i < title.length; i++) {
                    if (length <= 15) {
                        subLength++;
                        if (/.*[\u4e00-\u9fa5]+.*$/.test(title[i])) {
                            length += 2;
                        } else {
                            length++;
                        }
                    } else {
                        break;
                    }
                }
                if (length > 15) {
                    title = title.substr(0, subLength) + "...";
                }
            }
            var html = '<div class="index-content-div list-detail-div"><a href="./simplebet_join.html?contract=' + contractAddress + '"><div class="index-main-content">' +
                '<div class="main-bet-detail">' + title + '</div><div class="list-bet-status">' +
                '<div class="index-details-left"><div style="color:' + betStatusColor[gameStatus] + '">' + lang.gameStatus[gameStatus] + '</div></div><div>' +
                '<div class="index-details-right index-details-right-count">' + lang.index.from + totalBetCount + lang.index.participants + '</div>' +
                '<div class="index-details-right">' + totalBetAmount + ' CMT&nbsp;&nbsp;</div></div></div></div></a></div>';
            $("#" + id).append(html);
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
            tip.error(lang.tip.exceedTitle);
            return;
        }
    } else {
        if (inputValue.length >= 20) {
            tip.error(lang.tip.exceedTitle);
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
        tip.error(lang.tip.lessThan);
        return;
    }
    var title = $("#title").val();
    if (title == null || title == '') {
        tip.error(lang.tip.nullTitle);
        return;
    }
    gameDesc = gameDesc.replace(/(^;)|(;$)/g, "");
    // deploy and start the game
    var contract = web3.cmt.contract(betAbi);
    var feeDate = '0x' + contract.new.getData(gameDesc, numChoices - 1, {data: betBin.object});
    tip.loading(lang.bet.init + title);
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
                tip.error(lang.tip.createFailed);
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
        tip.right(lang.bet.betCreated);
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
    tip.error(lang.tip.createFailed);
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
