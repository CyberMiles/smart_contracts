const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/v2/dapp/play.html';
var webBrowser = new AppLink();
const contract_address = fun.getParameter("contract");
var userAddress = '';
var ownerAddress = '';
var abi = '';
var bin = '';
var contract = '';
var instance = '';  // contract instance

$(function () {
    window.lgb = lgb;
    webBrowser.openBrowser();
    tip.loading(lgb["loading"] || "Loading ...");
    // init the abi and bin
    getAbi();
    getBin();

    initLanguage();
    bindShowShare();
    
    var addr_clipboard = new ClipboardJS('.cp-addr-btn');
    addr_clipboard.on('success', function(e) {
        $('.cp-addr-btn').text(lgb["copied"] || "copied")
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });
    var test_cpboard = new ClipboardJS('.test-cp-btn');
      var share_clipboard = new ClipboardJS('.copy-btn');


    share_clipboard.on('success', function(e) {
        $('.copy-btn').text(lgb["copied"] || "copied")

        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    share_clipboard.on('error', function(e) {
        alert('Action:', e.action);
        alert('Trigger:', e.trigger);
    });

    $('#cp-addr-panel').on('show.bs.modal', function (e) {
        var addr = $(e.relatedTarget).attr("alt");
        $("#user-addr-input").val(addr)
        $(".cp-addr-btn").text(lgb["copy"] || "copy")
    })
    $('#share-panel').on('show.bs.modal', function (e) {
        console.log($("#share-link").val())
        $(".copy-btn").text(lgb["copy"] || "copy")
    })


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
     $(".overlay").addClass("d-none");
}

function copyLink(){
    var copyText = document.getElementById("share-link");
    copyText.select();
    document.execCommand("copy");
    $(".copy-btn").text(lgb["copied"] || "copied");
}


var bindShowShare = function(){
    $("iframe").attr("src", "./share.html?code=" + contract_address)
    $("#share-link").val(baseUrl + "?contract=" + contract_address);
    
    $(".overlay").click(()=>{
        $(".share-panel").addClass("d-none");
        $(".overlay").addClass("d-none");
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
                    if(r[7] == "")
                    {
                        $("#tags-panel").addClass("d-none")
                    }
                    tags_arr = r[7].split(",")
                    tags_arr.forEach(function(tag){
                        tagItem = $(".tags-item.d-none").clone(true).removeClass("d-none")
                        tagItem.text(tag)
                        $("#tags-panel > ul").append(tagItem)
                    })

                    desc_md = r[2]
                    var converter = new showdown.Converter(),
                    desc_html = converter.makeHtml(desc_md);
                    window.desc_html = desc_html;
                    var status = r[0];
                    $('#title-div').text(r[1]);
                    $('#desc-panel').append(desc_html);
                    $('#desc-panel > #description').text(lgb['desc'] ||"Description");
                    //for v1 compatility
                    $('#desc-panel > #shoppinglink').text(lgb['shopping_platform']||"Shopping Platform");
                    
                    purchase_json = r[8]
                    //v2
                    if(purchase_json != "")
                    {
                        purchase_links = JSON.parse(purchase_json)
                        $(".purchase-link-panel").removeClass("d-none")
                        purchase_links.forEach(function(item){
                            linkEle = $(".purchase-link-item.d-none").clone(true).removeClass("d-none")
                            linkEle.find("a").attr("href", item["link"])
                            linkEle.find("a").text(item["platform"])
                            $(".purchase-link-panel").find('ul').append(linkEle)
                        })
                    }

                    $('#image-img').html('<img src="' + r[3] + '" class="img-fluid img-thumbnail">');
                    var number_of_winners = r[4];
                    $('#number-of-winners-div').text(number_of_winners + "  " + (lgb['winner_unit'] || "person"));
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
                                
                                console.log(ownerAddress);
                                console.log(userAddress);
                                
                                for (let i = 0; i < winners.length; i++) {
                                    thiswinner = winners[i]
                                    instance.playerInfo (thiswinner, (epi, rpi) => {
                                        if (epi) {
                                              console.log(epi);
                                        } else {
                                              // console.log(winners[i])
                                              thisAddr = winners[i]
                                              winner_row = $("#winners-panel-table").find("tr.d-none").clone(true).removeClass("d-none")
                                              winner_row.find(".user-name").text(rpi[2])
                                              winner_row.find(".user-comment").text(rpi[5])
                                              if (ownerAddress == userAddress) {
                                                  $(".winner-contact").removeClass("d-none")
                                                  winner_row.find(".user-addr").removeClass("d-none")
                                                  winner_row.find(".user-addr > a").attr("alt", thisAddr)
                                                  winner_row.find(".user-addr-txt").text(thisAddr.slice(0, 4) + "****" + thisAddr.slice(-2))
                                                  winner_row.find(".user-contact").removeClass("d-none")
                                                  winner_row.find(".user-contact").text(rpi[3])
                                              }
                                              $("#winners-panel-table").append(winner_row)
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
                        // $('#players-panel-table').html("");
                        for (let i = 0; i < players.length; i++) {
                            instance.playerInfo (players[i], function (epi, rpi) {
                                if (epi) {
                                    console.log(epi);
                                } else {
                                    thisAddr = players[i]
                                    player_row = $("#players-panel-table").find("tr.d-none").clone(true).removeClass("d-none")
                                    player_row.find(".user-name").text(rpi[2])
                                    player_row.find(".user-note").text(rpi[4])
                                    if (ownerAddress == userAddress) {
                                      $(".users-contact").removeClass("d-none")
                                      player_row.find(".user-addr").removeClass("d-none")
                                      player_row.find(".user-addr > a").attr("alt", thisAddr)
                                      player_row.find(".user-addr-txt").text(thisAddr.slice(0, 4) + "****" + thisAddr.slice(-2))
                                      player_row.find(".user-contact").removeClass("d-none")
                                      player_row.find(".user-contact").text(rpi[3])
                                    }
                                    $("#players-panel-table").append(player_row)

                                    // var html_old = $('#players-panel-table').html();
                                    // var html_snippet = "<tr><td>" + rpi[2] + "</td><td>";
                                    // if (ownerAddress == userAddress) {
                                    //     $(".users-contact").removeClass("d-none");
                                    //     if (rpi[4] == null) {
                                    //         html_snippet = html_snippet + "</td><td>";
                                    //     } else {
                                    //         html_snippet = html_snippet + rpi[4] + "</td><td>";
                                    //     }
                                    //     html_snippet = html_snippet + rpi[3] + "</td></tr>";
                                    // } else {
                                    //     if (rpi[4] == null) {
                                    //         html_snippet = html_snippet + "</td></tr>";
                                    //     } else {
                                    //         html_snippet = html_snippet + rpi[4] + "</td></tr>";
                                    //     }
                                    // }
                                    // $('#players-panel-table').html(html_old + html_snippet);

                                    // var html_old = $('#players-panel-table').html();
                                    // var html_snippet = "<tr><td>" + rpi[2] + "</td><td>" + rpi[4] + "</td></tr>";
                                    // $('#players-panel-table').html(html_old + html_snippet);
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
        }, function (e, txhash) {
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
                //filter to watch all the latest blocks:
                //https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethfilter
                //unfortunately, the object passed as parameter seems not work?
                //so... it might be a little complex
                filter = web3.cmt.filter("latest")
                filter.watch(function(error, blockhash){
                    if (!error){
                        console.log(blockhash, txhash)
                        web3.cmt.getBlock(blockhash, function(e,r){
                            console.log(blockhash, txhash, r.transactions)
                            if(txhash.indexOf(r.transactions) != -1){
                                filter.stopWatching()
                                location.reload(true);
                            }
                        });
                    }
            });

                // setTimeout(function () {
                //     location.reload(true);
                // }, 20 * 1000);
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

