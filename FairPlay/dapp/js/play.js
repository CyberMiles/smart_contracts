const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
const contract_address = fun.getParameter("contract");
var userAddress = '';
var ownerAddress = '';
var abi = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

$(function () {
    webBrowser.openBrowser();
    tip.loading(lgb["loading"] || "Loading ...");
    // init the abi and bin
    getAbi();
    getBin();
    initLanguage();
    bindShowShare();
      
    var interval = setInterval(function () {
        if (abi.length > 0) {
            window.onload = getInfo();
            clearInterval(interval);
        }
    }, 50);
});

var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
     $("[data-translate]").each(function(){
        var key = $(this).data('translate');
        if(lgb[key]){
            if(this.tagName.toLowerCase() == "input" || this.tagName.toLowerCase() == "textarea"){
                $(this).attr("placeholder", lgb[key])
            }else{
                $(this).html(lgb[key]);
            }
        }
    });
}

function hideShare(){
     $(".share-panel").addClass("d-none");
}

var bindShowShare = function(){
    //noDisplay = ['xing', 'print', 'vk'];
    $(".share-btn").click(function(){
       $(".share-panel").removeClass("d-none");  
       $("#share-link").text(window.location.href);
    })
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
    $('.sticky-footer').css("display", "none");

    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb.error);
        } else {
            userAddress = address.toString();

            contract = web3.cmt.contract(abi);
            instance = contract.at(contract_address);
            instance.owner.call (function (e, r) {
                if (e) {
                    console.log(e);
                } else {
                    ownerAddress = r.toString();
                }
            });

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
                    $('#drawing-creater').text(ownerAddress);
                    
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
                            
                           $('.sticky-footer').css("display", "block");


                            if (status == 0) {
                                if (cutoff_ts > Math.round(new Date().getTime()/1000)) {
                                    $('#play-panel').css("display", "block");
                                    
                                    if (contact == null || contact == "") {
                                        // show empty play form
                                        $('#play-submit').text(lgb["enter"]);
                                    } else {

                                        // Show prefilled play form
                                        $('#name-field').val(name);
                                        $('#mesg-field').val(mesg);
                                        var cc = contact.split(":");
                                        $('#contact-app-field').val(cc[0].trim());
                                        $('#contact-id-field').val(cc[1].trim());

                                        $("#name-field").attr("disabled", true);
                                        $("#contact-id-field").attr("disabled", true);
                                        $("#contact-app-field").attr("disabled", true);
                                        $("#mesg-field").attr("disabled", true);
                                        
                                        $('#play-submit').text(lgb["update"]);
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
                                            $("#confirm-field").val(confirm_mesg);
                                            $("#confirm-field").attr("disabled", true);
                                            $('#confirm-panel').css("display", "block");
                                            $('#confirm-submit').text(lgb["update"]);
                                            //$('#confirm-ended-panel').css("display", "block");
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
                                
                                console.log(ownerAddress);
                                console.log(userAddress);
                                
                                for (var i = 0; i < winners.length; i++) {
                                    instance.playerInfo (winners[i], function (epi, rpi) {
                                        if (epi) {
                                            console.log(epi);
                                        } else {
                                            var html_old = $('#winners-panel-table').html();
                                            var html_snippet = "<tr><td>" + rpi[2] + "</td><td>";
                                            if (ownerAddress == userAddress) {
                                                $(".winner-contact").removeClass("d-none");
                                                if (rpi[5] == null) {
                                                    html_snippet = html_snippet + "</td><td>";
                                                } else {
                                                    html_snippet = html_snippet + rpi[5] + "</td><td>";
                                                }
                                                html_snippet = html_snippet + rpi[3] + "</td></tr>";
                                            } else {
                                                if (rpi[5] == null) {
                                                    html_snippet = html_snippet + "</td></tr>";
                                                } else {
                                                    html_snippet = html_snippet + rpi[5] + "</td></tr>";
                                                }
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
    if( $("#name-field").is('[disabled=disabled]') ){//update
        $("#name-field").removeAttr("disabled");
        $("#contact-id-field").removeAttr("disabled");
        $("#contact-app-field").removeAttr("disabled");
        $("#mesg-field").removeAttr("disabled");

        $('#play-submit').text(lgb["confirm_update"]);
    }else{
        $("#mesg-field").removeAttr("disabled");

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

        $("#name-field").attr("disabled", true);
        $("#contact-id-field").attr("disabled", true);
        $("#contact-app-field").attr("disabled", true);
        $("#mesg-field").attr("disabled", true);

        instance.play(name, contact, mesg, {
            gas: '200000',
            gasPrice: 0
        }, function (e, result) {
            if (e) {
                if(e.message.includes('User denied transaction signature.') ){
                    tip.error(lgb.cancelled);
                    location.reload(true);
                }
                else {
                    tip.error(lgb.error);
                    location.reload(true);

                }
            } else {
                tip.closeLoad();
                    
                setTimeout(function () {
                    location.reload(true);
                }, 20 * 1000);
            }
        });
    }
    
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
                console.log(e.code)
            if(e.message.includes('User denied transaction signature.') ){
               tip.error(lgb.cancelled);
                location.reload(true);

            }
            else {
                tip.error(lgb.error);
                location.reload(true);
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
    if ($("#confirm-field").is('[disabled=disabled]')){
        $("#confirm-field").removeAttr("disabled");
        $('#confirm-submit').text(lgb["confirm_update"]);
    }else{
        $("#confirm-field").attr("disabled", true);

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
                if(e.message.includes('User denied transaction signature.') ){
                    tip.error(lgb.cancelled);
                    location.reload(true);
                }
                else {
                    tip.error(lgb.error);
                    location.reload(true);
                }
            } else {
                tip.closeLoad();
                    
                setTimeout(function () {
                    location.reload(true);
                }, 20 * 1000);
            }
        }); 
    }
  
}

