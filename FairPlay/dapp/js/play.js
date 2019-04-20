const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
const contract_address = fun.getParameter("contract");
var userAddress = '';
var abi = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

$(function () {
    webBrowser.openBrowser();
    tip.loading("Loading ...");
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
    $('#info-panel').css("display", "none");
    $('#play-panel').css("display", "none");
    $('#draw-panel').css("display", "none");
    $('#ended-panel').css("display", "none");
    $('#confirm-panel').css("display", "none");
    $('#confirm-ended-panel').css("display", "none");
    $('#not-winner-panel').css("display", "none");
    $('#winners-panel').css("display", "none");
    $('#players-panel').css("display", "none");

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb.error);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);

            instance.info (function (e, r) {
                if (e) {
                    console.log(e);
                    tip.error(lgb.error);
                    return;
                } else {
                    var status = r[0];
                    $('#title-div').text(r[1]);
                    $('#desc-div').text(r[2]);
                    $('#image-img').html('<img src="' + r[3] + '" class="img-fluid img-thumbnail">');
                    var number_of_winners = r[4];
                    $('#number-of-winners-div').text(number_of_winners);
                    var cutoff_ts = r[5];
                    $('#cutoff-ts-div').text((new Date(cutoff_ts * 1000)).toLocaleString());
                    
                    // Show the info panel
                    $('#info-panel').css("display", "block");
                    // Dismiss the spinner now. The rest of the page can load gradually
                    tip.closeLoad();
                    
                    instance.playerInfo (userAddress, function (epi, rpi) {
                        if (epi) {
                            console.log(epi);
                            tip.error(lgb.error);
                        } else {
                            var is_winner = rpi[0];
                            var ts = rpi[1];
                            var name = rpi[2];
                            var contact = rpi[3];
                            var mesg = rpi[4];
                            var confirm_mesg = rpi[5];

                            if (status == 0) {
                                if (cutoff_ts > Math.round(new Date().getTime()/1000)) {
                                    $('#play-panel').css("display", "block");
                                    if (contact == null || contact == "") {
                                        // show empty play form
                                        $('#play-submit').text("Enter");
                                    } else {
                                        // Show prefilled play form
                                        $('#name-field').val(name);
                                        $('#mesg-field').val(mesg);
                                        var cc = contact.split(":");
                                        $('#contact-app-field').val(cc[0].trim());
                                        $('#contact-id-field').val(cc[1].trim());
                                        $('#play-submit').text("Update");
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
                                        } else {
                                            $('#confirm-ended-panel').css("display", "block");
                                        }
                                    } else {
                                        $('#not-winner-panel').css("display", "block");
                                    }
                                }
                            }
                        }
                    });
                    // END instance.playerInfo
                    
                    if (status == 1) {
                        // Display the winners
                        instance.winner_addrs (function (ewa, rwa) {
                            if (ewa) {
                                console.log(ewa);
                            } else {
                                var winners = rwa;
                                if (winners && winners.length > 0) {
                                    $('#winners-panel').css("display", "block");
                                }
                                $('#winners-panel-table').html("");
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
                    // END if (status == 1)  
                }
            });

            // Display players
            instance.player_addrs (function (e, r) {
                if (e) {
                    console.log(e);
                } else {
                    var players = r;
                    if (players && players.length > 0) {
                        $('#players-panel').css("display", "block");
                        $('#players-panel-table').html("");
                        for (var i = 0; i < players.length; i++) {
                            instance.playerInfo (players[i], function (epi, rpi) {
                                if (epi) {
                                    console.log(epi);
                                } else {
                                    var html_old = $('#players-panel-table').html();
                                    var html_snippet = "<tr><td>" + rpi[2] + "</td><td>" + rpi[4] + "</td></tr>";
                                    $('#players-panel-table').html(html_old + html_snippet);
                                }
                            });
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
                location.reload(true);
            }, 20 * 1000);
        }
    });
}

var draw = function () {
    $(".main-button").css("background-color", "#696969");
    $('#draw-submit').text(lgb.wait);
    $('#draw-submit').removeAttr('onclick');

    instance.draw({
        gas: '9000000',
        gasPrice: 2000000000
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
                location.reload(true);
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
                location.reload(true);
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
