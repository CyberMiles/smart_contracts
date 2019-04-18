const contract_address = '0x8f982c59312e87e7a0ad15a6d14d35e4e8780cbb';
const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
var userAddress = '';
var abi = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

$(function () {
    webBrowser.openBrowser();
    // init the abi and bin
    getAbi();
    getBin();
    // initLanguage();

    var interval = setInterval(function () {
        if (abi.length > 0) {
            window.onload = getInfo();
            clearInterval(interval);
        }
    }, 50);
});

// init language
var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
}

var getInfo = function () {
    $('#play-panel').css("display", "none");
    $('#draw-panel').css("display", "none");
    $('#ended-panel').css("display", "none");
    $('#confirm-panel').css("display", "none");
    $('#winners-panel').css("display", "none");
    $('#players-panel').css("display", "none");

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb.error);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);

            var status = 0;
            instance.info (function (e, r) {
                if (e) {
                    console.log(e);
                    tip.error(lgb.error);
                    return;
                } else {
                    status = r[0];
                    $('#title-div').text(r[1]);
                    $('#desc-div').text(r[2]);
                    $('#image-img').attr("src", r[3]);
                }
            });

            instance.playerInfo (userAddress, function (e, r) {
                if (e) {
                    console.log(e);
                    tip.error(lgb.error);
                } else {
                    var is_winner = r[0];
                    var ts = r[1];
                    var name = r[2];
                    var contact = r[3];
                    var mesg = r[4];
                    var confirm_mesg = r[5];

                    if (status == 0) {
                        if (ts < now) {
                            $('#play-panel').css("display", "block");
                            if (contact == null || contact == "") {
                                // show empty play form
                            } else {
I                               // Show prefilled play form
                                $('#name-field').val(name);
                                $('#mesg-field').val(mesg);
                                var cc = contact.split(":");
                                $('#contact-app-field').val(cc[0].trim());
                                $('#contact-id-field').val(cc[1].trim());
                            }
                        } else {
                            // Show drawing form
                            $('#draw-panel').css("display", "block");
                        }
                    } else if (status == 1) {
                        if (contact == null || contact == "") {
                            // Show ended message
                            $('#ended-panel').css("display", "block");
                        } else {
                            if (is_winner) {
                                if (confirm_mesg == null || confirm_mesg == "") {
                                    // Show confirm form
                                    $('#confirm-panel').css("display", "block");
                                }
                            }
                        }
                    }
                }
            });

            if (status == 1) {
                // Display the winners
                instance.winner_addrs (function (e, r) {
                    if (e) {
                        console.log(e);
                    } else {
                        var winners = r[0];
                        if (winners.length > 0) {
                            $('#winners-panel').css("display", "block");
                        }
                        for (var i = 0; i < winners.length; i++) {
                            instance.playerInfo (winners[i], function (epi, rpi) {
                                if (epi) {
                                    console.log(epi);
                                } else {
                                    var html_old = $('#winners-panel-table').html();
                                    var html_snippet = "<tr><td>" + rpi[2] + "</td><td>";
                                    if (rpi[5] == null || rpi[5] == "") {
                                        html_snippet = html_snippet + rpi[4] + "</td></tr>";
                                    } else {
                                        html_snippet = html_snippet + rpi[5] + "</td></tr>";
                                    }
                                    $('#winners-panel-table').html(html_old + html_snippet);
                                }
                            });
                        }
                    }
                });
            }

            // Display players
            instance.player_addrs (function (e, r) {
                if (e) {
                    console.log(e);
                } else {
                    var players = r[0];
                    if (players.length > 0) {
                        $('#players-panel').css("display", "block");
                    }
                    for (var i = 0; i < players.length; i++) {
                        instance.playerInfo (players[i], function (epi, rpi) {
                            if (epi) {
                                console.log(epi);
                            } else {
                                var html_old = $('#players-panel-table').html();
                                var html_snippet = "<tr><td>" + rpi[2] + "</td><td>" + rpi[4] + "</td></tr>";
                                $('#players-panel-table').html(html_old + html_snippet);
                            }
                        }
                    }
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

var play = function () {
    var contactApp = $("#contact-app-field").val();
    var contactId = $("#contact-id-field").val();
    var contact = contactApp + ": " + contactId;
    var name = $("#name-field").val();
    var mesg = $("#mesg-field").val();
    if (contactId == null || contactId == '') {
        tip.error(lgb.error);
        return;
    }
    $(".main-button").css("background-color", "#696969");
    $('#play-submit').text(lgb.wait);
    $('#play-submit').removeAttr('onclick');

    instance.play(name, contact, mesg, {
        gas: '200000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            if (e.code == '1001') {
                tip.error(lgb.cancelled);
            } else {
                tip.error(lgb.error);
            }
        } else {
            tip.closeLoad();
                
            setTimeout(function () {
                getInfo();
            }, 20 * 1000);
        }
    });
}

var draw = function () {
    $(".main-button").css("background-color", "#696969");
    $('#draw-submit').text(lgb.wait);
    $('#draw-submit').removeAttr('onclick');

    instance.draw({
        gas: '200000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            if (e.code == '1001') {
                tip.error(lgb.cancelled);
            } else {
                tip.error(lgb.error);
            }
        } else {
            tip.closeLoad();
                
            setTimeout(function () {
                getInfo();
            }, 20 * 1000);
        }
    });
}

var confirm = function () {
    var v = $("#confirm-field").val();
    if (v == null || v == '') {
        tip.error(lgb.error);
        return;
    }
    $(".main-button").css("background-color", "#696969");
    $('#confirm-submit').text(lgb.wait);
    $('#confirm-submit').removeAttr('onclick');

    instance.confirm(v, {
        gas: '200000',
        gasPrice: 0
    }, function (e, result) {
        if (e) {
            if (e.code == '1001') {
                tip.error(lgb.cancelled);
            } else {
                tip.error(lgb.error);
            }
        } else {
            tip.closeLoad();
                
            setTimeout(function () {
                getInfo();
            }, 20 * 1000);
        }
    });
}

function saveFile(data, filename) {
    const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
}

function saveNow(){
    let canvas= document.querySelector('#qrcode-image canvas');
    let url = canvas.toDataURL('image/png');
    saveFile(url, 'sayLove')
}

