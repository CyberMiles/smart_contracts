var fun = new MainFun();
var tip = IUToast;
var lang = fun.languageChoice();
var betStatusColor = ['#ff3636', '#6aba0c', '#f5a623', '#ff3636'];
var betAbi = '';
var betBin = '';
var contract_address = '';
var contract = '';
var instance = '';
var pageSize = 10;
var webBrowser = new AppLink();
var divCount = 0;
var hadLoading = false;

$(function () {
    getAbi();
    getBin();
    initLanguage();
    webBrowser.openBrowser();
    showBetList();
    fun.addMainEvent(document.getElementById("newBet"), "click", newBetContract);
    fun.addMainEvent(document.getElementById("showBetListId"), "click", turnBetList);

});

$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var clientHeight = $(this).height();
    if (!hadLoading) {
        if (scrollTop + clientHeight >= scrollHeight) {
            hadLoading = true;
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
            showListContent(pageNo);
        } else if (scrollTop <= 0) {
            //tip.right(lang.tip.firstPage);
            return;
        }
    }
});

var sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// init language
var initLanguage = function () {
    if (lang == '' || lang == null) {
        return;
    }
    fun.changeDomContentById("newBet", lang.index.newBet);
    fun.changeDomContentById("showBetListId", lang.viewBetList);
}

var newBetContract = function () {
    window.location.href = "./simplebet_start.html";
}

var turnBetList = function () {
    window.location.href = "./simplebet_my.html";
}

var showBetList = function () {
    showListContent(1);
}


var showListContent = function (pageNo) {
    var methodId = 'de2fd8ab,83bd72ba,3cc4c6ce,9c16667c,340190ec';
    if (pageNo == null || pageNo == '' || pageNo == 'undefined' || pageNo <= 0) {
        pageNo = 1;
    }
    tip.loading(lang.tip.loading);
    var url = 'https://test-api.cmttracking.io/api/v3/contractsByType?address=&funcIds=' + methodId + "&limit=" + pageSize + "&page=" + pageNo
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        async: true,
        success: function (result) {
            if (result && result.data && result.data.objects) {
                $("#totalCount").val(result.data.meta.total);
                var totalPage = parseInt(result.data.meta.total / 10) + 1;
                $("#totalPage").val(totalPage);
                var lastCount = result.data.meta.total % 10;
                if (pageNo < totalPage) {
                    lastCount = pageSize;
                }
                loadCount = 0;
                divCount = 0;
                for (var i = 0; i < result.data.objects.length; i++) {
                    var id = 'showAllBetList';
                    var obj = result.data.objects[i];
                    appendChildList(obj.address, id, lastCount);
                }
            }
        },
        error: function (e) {
            console.log("Get Bet List Info Failed" + JSON.stringify(e));
        }
    });
}

var appendChildList = function (contractAddress, id, lastCount) {
    document.getElementById("showAllBetList").lastChild.style = 'margin-bottom:1px';
    var contract = web3.cmt.contract(betAbi, contract_address);
    var instance = contract.at(contractAddress);
    instance.getBetInfo(function (e, result) {
        loadCount++;
        if (e) {
            console.log("It have an error when get this Bet Game info ：" + e);
            if (e.code == '1001') {
                tip.error(lang.tip.getBetInfoError + "：" + e.message);
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
                var length = 0;
                var subLength = 0;
                for (var i = 0; i < title.length; i++) {
                    if (length <= 20) {
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
                if (length > 20) {
                    title = title.substr(0, subLength) + "...";
                }
            }
            divCount++;
            var html = '<div class="index-content-div"><div class="index-main-content"><div class="main-bet-detail">' + title + '</div>' +
                '<div class="main-bet-status"><div style="color:' + betStatusColor[gameStatus] + '">' + lang.gameStatus[gameStatus] + '</div></div><div class="index-details-font">' +
                '<div class="main-bet-details-font"><div class="index-content-div-left">' + totalBetAmount + ' CMT&nbsp;&nbsp;</div>' +
                '<div class="main-bet-detail main-bet-address-left">' + lang.index.from + totalBetCount + lang.index.participants + '</div>' +
                '<div class="main-bet-detail main-bet-address-right"><a href="./simplebet_join.html?contract=' + contractAddress + '">' + lang.index.participate + ' ></a></div></div></div></div></div>'
            $("#" + id).append(html);
        }
        if (loadCount >= lastCount) {
            if (divCount == 0) {
                $("#showAllBetList").append('<div style="height: 1px"></div>');
            }
            document.getElementById("showAllBetList").lastChild.style = 'margin-bottom:97px';
            setTimeout(function () {
                hadLoading = false;
                tip.closeLoad();
            }, 500)
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
