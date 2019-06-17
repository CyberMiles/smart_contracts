var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const contract_address = getUrlParameter("contract");
var userAddress = '';
var ownerAddress = '';
var abi = '';
var abi_crc20 = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

$(function () {
    getAbi();
    getBin();

    var interval = setInterval(function () {
        if (abi.length > 0) {
            getInfo();
            clearInterval(interval);
        }
    }, 50);
});

var getInfo = function () {

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            console.log(e);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);

            instance.getPricesCount (function (e, r) {
                if (e) {
                    console.log(e);
                    return;
                } else {
                    int i = 0;
                    for (i = 0; i < r[0]; i++) {
                        instance.getPrice (i, function (e_price, r_price) {
                            if (e_price) {
                                console.log(e_price);
                            } else {
                                var token_name = "Unknown";
                                var token_crc20 = r_price[0].toString();
                                var amount = r_price[1];

                                if (token_crc20 == "0x0000000000000000000000000000000000000000") {
                                    token_name = "CMT";
                                } else if (token_crc20 == "0xce9a6ec5f153b87ad0f05915c85dbd3a0f6ed99a") {
                                    token_name = "OPB";
                                }
                                $('#prices-tbody').append("<tr><td>" + token_name + "</td><td>" + amount + "</td></tr>");  
                            }
                        }); // getPrice
                    }
                }
            }); // info
        }
    }); // getAccounts
}

var getAbi = function () {
    $.ajax({
        url: 'Listing.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'Listing.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}

var setPrice = function () {
    var crc20 = $("#crc20-select").val();
    var amount = $('#amount').val();

    instance.setPrice (crc20, amount, {
        gas: '400000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            console.log(e);
        } else {
            setTimeout(function () {
                window.location.reload(true);
            }, 20 * 1000);
        }
    });
}
