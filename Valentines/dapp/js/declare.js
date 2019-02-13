const contract_address = '0xb6da9f8889c42b1fabf4d3bcdc83a1193884aa73';
const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'http://valentine.codeislaw.co/declare.html';
var webBrowser = new AppLink();
var userAddress = '';
var targetAddress = '';
var abi = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

var stmt = '';
var reply_from = '';
var reply_stmt = '';

$(function () {
    webBrowser.openBrowser();
    // init the abi and bin
    getAbi();
    getBin();
    initLanguage();

    targetAddress = fun.getParameter("a");

    $('title').text(lgb.declare_your_love);
    $('h2').text(lgb.declare_your_love);
    $('#declaration-submit').text(lgb.declare);
    $('#reply-submit').text(lgb.reply_to);
    $('#declaration-text').text(lgb.no_declaration);
    $('#reply-text').text(lgb.no_reply);
    $('#replies-html').text(lgb.no_replies);
    $('#declaration-addr').text(lgb.declaration);
    $('#reply-addr').text(lgb.reply);
    $('#replies-addr').text(lgb.all_my_replies);
    $('#qrcode-addr').text(lgb.share_qr);

    var interval = setInterval(function () {
        if (abi.length > 0) {
            window.onload = getDeclaration();
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

var getDeclaration = function () {
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb.error);
        } else {
            userAddress = address.toString();
            if (targetAddress) {
                // has target address
            } else {
                targetAddress = userAddress;
            }

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);
            instance.getDeclaration (targetAddress, function (e, r) {
                if (e) {
                    console.log(e);
                    tip.error(lgb.error);
                    return;
                } else {
                    stmt = r[0];
                    reply_from = r[1];
                    reply_stmt = r[2];
                    console.log(stmt);
                    console.log(reply_from);
                    console.log(reply_stmt);

                    if (stmt) {
                        // there is a declaration from this address -- show the declarartion
                        $('#declaration-addr').text(lgb.declaration_from + " " + targetAddress);
                        $('#declaration-text').css("display", "block");
                        $('#declaration-text').text(stmt);
                        $('#declaration-field').css("display", "none");
                        $('#declaration-button').css("display", "none");
                        $('#reply').css("display", "block");
                        if (reply_from == "0x0000000000000000000000000000000000000000") {
                            // no reply
                            if (targetAddress == userAddress) {
                                // cannot reply self
                                $('#reply').css("display", "none");
                            } else {
                                // Show reply for new user
                                $('#reply-text').css("display", "none");
                                $('#reply-field').css("display", "block");
                                $('#reply-button').css("display", "block");
                            }
                        } else {
                            // show the reply
                            $('#reply-text').css("display", "block");
                            $('#reply-addr').text(lgb.reply_from + " " + reply_from);
                            $('#reply-text').text(reply_stmt);
                            $('#reply-field').css("display", "none");
                            $('#reply-button').css("display", "none");
                        }

                        // show the QR code to share this page
                        $('#qrcode').css("display", "block");
                        if (reply_from == "0x0000000000000000000000000000000000000000") {
                            $('#qrcode-addr').text(lgb.share_qr);
                        } else {
                            $('#qrcode-addr').text(lgb.share_qr_all);
                        }
                        $('#qrcode-image').html("");
                        setTimeout(function () {
                            new QRCode(document.getElementById("qrcode-image"), {
                                text: baseUrl + '?a=' + targetAddress,
                                width: 146,
                                height: 148,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        }, 1);

                    } else {
                        // no declaration from this address
                        // hide reply section
                        $('#reply').css("display", "none");
                        if (targetAddress == userAddress) {
                            // Allow the user to create a new declaration -- show the declare box
                            $('#declaration-text').css("display", "none");
                            $('#declaration-field').css("display", "block");
                            $('#declaration-button').css("display", "block");
                        } else {
                            // leave the placeholder text
                            $('#declaration-field').css("display", "none");
                            $('#declaration-button').css("display", "none");
                        }
                    }
                }
            });

            instance.getReplies (userAddress, function (e, r) {
                if (e) {
                    console.log(e);
                    tip.error(lgb.error);
                    return;
                } else {
                    // var addrs = r[0];
                    console.log(r);
                    if (r && r.length > 0) {
                        var html = "<ul>";
                        for (var i = 0; i < r.length; i++) {
                            html += "<li><a href='declare.html?a='>" + r[i] + "</a></li>";
                        }
                        html += "</ul>";
                        $('#replies-html').html(html);
                    }
                }
            });
        }
    });
}

var getAbi = function () {
    $.ajax({
        url: 'Valentines.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'Valentines.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}

var declare = function () {
    var v = $("#declaration-field").val();
    if (v == null || v == '') {
        tip.error(lgb.error);
        return;
    }
    // $('#declaration-button').css("display", "none");
    $(".main-button").css("background-color", "#696969");
    $('#declaration-submit').text(lgb.wait);
    $('#declaration-submit').removeAttr('onclick');

    instance.declare(v, {
        gas: '200000',
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
                getDeclaration();
            }, 20 * 1000);
        }
    });
}

var reply = function () {
    var v = $("#reply-field").val();
    if (v == null || v == '') {
        tip.error(lgb.error);
        return;
    }
    // $('#reply-button').css("display", "none");
    $(".main-button").css("background-color", "#696969");
    $('#reply-submit').text(lgb.wait);
    $('#reply-submit').removeAttr('onclick');

    instance.reply(targetAddress, v, {
        gas: '200000',
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
                getDeclaration();
            }, 20 * 1000);
        }
    });
}

