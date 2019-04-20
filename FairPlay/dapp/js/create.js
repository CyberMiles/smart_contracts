const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
var abi = '';
var bin = '';

$(function () {
    webBrowser.openBrowser();
    // init the abi and bin
    getAbi();
    getBin();
    // initLanguage();

    $('#datetimepicker').datetimepicker();
});

// init language
var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
}

var create = function () {
    tip.loading("Creating ...");
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error("There is an error");
        } else {
            var userAddress = address.toString();
            var image_url = $('#img').val();
            var num_of_winners = $('#num').val();
            var cutoff_ts = $('#cutoff').datetimepicker('date').unix();

            var contract = web3.cmt.contract(abi);
            var data = '0x' + contract.new.getData(title, desc, image_url, num_of_winners, cutoff_ts, {data: bin.object});

            contract.new([title, desc, image_url, num_of_winners, cutoff_ts], {
                from: userAddress.toString(),
                data: data,
                gas: '999000',
                gasPrice: '2000000000'
            }, function (e, instance) {
                if (e) {
                    tip.close();
                    tip.error("Failed to create contract");
                } else {
                    var url = baseUrl + "?contract=" + instance.address;
                    tip.closeLoad();

                    $('#create-panel').css("display", "none");
                    $('#qr-panel').css("display", "block");
                    setTimeout(function () {
                        new QRCode(document.getElementById("qrcode"), {
                            text: url,
                            width: 300,
                            height: 300,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                    }, 1);
                }
            });
        }
    });
}

var getAbi = function () {
    $.ajax({
        url: 'FairPlay.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'FairPlay.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}
