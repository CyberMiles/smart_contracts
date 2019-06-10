// $.ajaxPrefilter( function (options) {
//   if (options.crossDomain && jQuery.support.cors) {
//     var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
//     options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
//     //options.url = "http://cors.corsproxy.io/url=" + options.url;
//   }
// });

var publicIp = "https://cmt-testnet.search.secondstate.io";

//var publicIp = "https://cmt.search.secondstate.io";
// The above config must be placed in a better system (master config area)

var ICreatedButton = () => {
        async function setUpAndProgress() {
            this.currentAccount = "";
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });

            await new Promise((resolve, reject) => setTimeout(resolve, 1500));
            var dFunctionDataOwner = {};
            dFunctionDataOwner['functionData.owner'] = this.currentAccount;
            var dMatchFunctionDataOwner = {};
            dMatchFunctionDataOwner['match'] = dFunctionDataOwner;
            var dMust = {};
            dMust['must'] = dMatchFunctionDataOwner;
            var dBool = {};
            dBool['bool'] = dMust;
            var dQuery = {};
            dQuery['query'] = dBool;
            var jsonString = JSON.stringify(dQuery);
            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});


            return itemArray.length;
        }
        return setUpAndProgress();
    }

var IParticipatedButton = () => {
        async function setUpAndProgress() {
            
            this.currentAccount = "";
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });

            await new Promise((resolve, reject) => setTimeout(resolve, 1500));
            lShould = [];
            for (i = 0; i < 50; i++) {
                var dPTemp = {};
                var dPTemp2 = {};
                var fString = 'functionData.player_addrs.' + i;
                dPTemp[fString] = this.currentAccount;
                dPTemp2['match'] = dPTemp;
                lShould.push(dPTemp2);
            }
            var dMust = {};
            dMust['should'] = lShould;
            var dBool = {};
            dBool['bool'] = dMust;
            var dQuery = {};
            dQuery['query'] = dBool;
            var jsonString = JSON.stringify(dQuery);

            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});

            return itemArray.length;
        }
        return setUpAndProgress();
    }

var IWonButton = () => {
        async function setUpAndProgress() {
            var originalState = $("#pb.progress-bar").clone();
            this.currentAccount = "";
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });
            
            await new Promise((resolve, reject) => setTimeout(resolve, 1500));
            lShould = [];
            for (i = 0; i < 50; i++) {
                var dPTemp = {};
                var dPTemp2 = {};
                var fString = 'functionData.winner_addrs.' + i;
                dPTemp[fString] = this.currentAccount;
                dPTemp2['match'] = dPTemp;
                lShould.push(dPTemp2);
            }
            var dMust = {};
            dMust['should'] = lShould;
            var dBool = {};
            dBool['bool'] = dMust;
            var dQuery = {};
            dQuery['query'] = dBool;
            $("#pbc").hide('slow');
            var jsonString = JSON.stringify(dQuery);
            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});

            return itemArray.length;
        }
        return setUpAndProgress();
    }


var searchButton =  async () => {
        var theAddress = $("#searchAddressInput").val();
        var theText = $("#searchTextInput").val();
        //console.log($.trim(theAddress.length));
        if ($.trim(theAddress.length) == "0" && $.trim(theText.length) == "0") {
            //console.log("Address and text are both blank, fetching all results without a filter");
            getItemsViaFlask();
           
        } else if ($.trim(theAddress.length) == "0" && $.trim(theText.length) > "0") {
            var dFields = {};
            var dQueryInner = {};
            var dMultiMatch = {};
            var dQueryOuter = {};
            var lFields = ["functionData.title", "functionData.desc"];
            dTemp = {};
            dTemp["fields"] = lFields;
            dTemp["query"] = theText;
            dMultiMatch["multi_match"] = dTemp;
            dQueryOuter["query"] = dMultiMatch;
            var jsonString = JSON.stringify(dQueryOuter);
                        
            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});
            

            
        } else if ($.trim(theAddress.length) > "0" && $.trim(theText.length) > "0") {
            var dDesc = {};
            dDesc['desc'] = theText;
            //console.log(dDesc);
            var dTitle = {};
            dTitle['title'] = theText;
            //console.log(dTitle);
            var dFunctionDataOwner = {};
            dFunctionDataOwner['functionData.owner'] = theAddress;
            //console.log(dFunctionDataOwner);
            var dContractAddress = {};
            dContractAddress['contractAddress'] = theAddress;
            //console.log(dContractAddress);
            var dMatchContractAddress = {};
            dMatchContractAddress['match'] = dContractAddress;
            //console.log(dMatchContractAddress);
            var dMatchFunctionDataOwner = {};
            dMatchFunctionDataOwner['match'] = dFunctionDataOwner;
            //console.log(dMatchFunctionDataOwner);
            var dMatchTitle = {};
            dMatchTitle['match'] = dTitle;
            //console.log(dMatchTitle);
            var dMatchDesc = {};
            dMatchDesc['match'] = dDesc;
            //console.log(dMatchDesc);
            var lShould = [];
            lShould.push(dMatchContractAddress);
            lShould.push(dMatchFunctionDataOwner);
            lShould.push(dMatchTitle);
            lShould.push(dMatchDesc);
            // Start - Players and Winners
            // Players
            for (i = 0; i < 50; i++) {
                var dPTemp = {};
                var dPTemp2 = {};
                var fString = 'functionData.player_addrs' + i;
                dPTemp[fString] = theAddress;
                dPTemp2['match'] = dPTemp;
                lShould.push(dPTemp2);
            }
            // Winners
            for (i = 0; i < 50; i++) {
                var dWTemp = {};
                var dWTemp2 = {};
                var fStringW = 'functionData.player_addrs' + i;
                dWTemp[fStringW] = theAddress;
                dWTemp2['match'] = dWTemp;
                lShould.push(dWTemp2);
            }
            // End - Players and Winners
            //console.log(lShould);
            var dShould = {};
            dShould['should'] = lShould;
            //console.log(dShould);
            var dBool = {};
            dBool['bool'] = dShould;
            //console.log(dBool);
            var dQuery = {};
            dQuery['query'] = dBool;
            //console.log(dQuery);
            //console.log(JSON.stringify(dQuery));
            var jsonString = JSON.stringify(dQuery);
                        
            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});
         
            //console.log(itemArray);
        } else if ($.trim(theAddress.length) > "0" && $.trim(theText.length) == "0") {
            var dFunctionDataOwner = {};
            dFunctionDataOwner['functionData.owner'] = theAddress;
            //console.log(dFunctionDataOwner);
            var dContractAddress = {};
            dContractAddress['contractAddress'] = theAddress;
            //console.log(dContractAddress);
            var dMatchContractAddress = {};
            dMatchContractAddress['match'] = dContractAddress;
            //console.log(dMatchContractAddress);
            var dMatchFunctionDataOwner = {};
            dMatchFunctionDataOwner['match'] = dFunctionDataOwner;
            //console.log(dMatchFunctionDataOwner);
            var lShould = [];
            lShould.push(dMatchContractAddress);
            lShould.push(dMatchFunctionDataOwner);
            // Start - Players and Winners
            // Players
            for (i = 0; i < 50; i++) {
                var dPTemp = {};
                var dPTemp2 = {};
                var fString = 'functionData.player_addrs' + i;
                dPTemp[fString] = theAddress;
                dPTemp2['match'] = dPTemp;
                lShould.push(dPTemp2);
            }
            // Winners
            for (i = 0; i < 50; i++) {
                var dWTemp = {};
                var dWTemp2 = {};
                var fStringW = 'functionData.winner_addrs' + i;
                dWTemp[fStringW] = theAddress;
                dWTemp2['match'] = dWTemp;
                lShould.push(dWTemp2);
            }
            // End - Players and Winners
            //console.log(lShould);
            var dShould = {};
            dShould['should'] = lShould;
            //console.log(dShould);
            var dBool = {};
            dBool['bool'] = dShould;
            //console.log(dBool);
            var dQuery = {};
            dQuery['query'] = dBool;
            //console.log(dQuery);
            //console.log(JSON.stringify(dQuery));
            var jsonString = JSON.stringify(dQuery);
            
            // If this is a public website then we need to call ES using Flask
            var itemArray = await getItemsViaFlask({_data: jsonString});
            

            //console.log(itemArray);
        }
        return itemArray.length;;

    }

 
_defaultData = {
       "query": {
            "match_all": {}
       }
    }
var _defaultDataString = JSON.stringify(_defaultData);

var giveawayPreFilter = (obj) => {
    if(obj._source.hasOwnProperty('contractAddress')){
        blacklist = ["0xbc88c27Ad36a7B950890917A6592D8597a3C1732"]

        var lowerCaseBlacklist = blacklist.map(function (addr) {
          return addr.toLowerCase()
        });
        if(lowerCaseBlacklist.indexOf(obj._source.contractAddress.toLowerCase()) == -1)
            return obj
    }
    
}

var giveawayRulesFilter = (obj) => {
    whitelist = ["0xbE221B62527E42969A694502a3b1358E6B9CF1dF"]
    var lowerCaseWhitelist = whitelist.map(function (addr) {
          return addr.toLowerCase()
    });
    if(lowerCaseWhitelist.indexOf(obj._source.contractAddress.toLowerCase()) != -1)
      return obj
}

var restructure = async (giveawayArr) => {
    customedArr = []
    $.each(giveawayArr, (index, value) => {
        dappVersion = ""
       if (value._source.abiSha3BytecodeSha3 == "0x39e76f559313a52e86c540b63ec64fbf1c88624855ad60cc0380c0d7d47aed4b"){
            dappVersion = "v1";
        }
        else if (value._source.abiSha3BytecodeSha3 == "0x82069af99bd87d7c8271916cd33cff9f6176d1bb6da18a75379107df30da6fc5") {
            dappVersion = "v2";
        }
        // console.log(value._source.abiSha3BytecodeSha3)
        func_data = value._source.functionData.info;

        newGiveaway = {
            dappVersion: dappVersion,
            title: func_data[1],
            desc: func_data[2],
            imgUrl: func_data[3],
            nWinners: func_data[4],
            drawDate: func_data[5],
            contractAddress: value._source.contractAddress,
            blockNumber: value._source.blockNumber
        }
        customedArr.push(newGiveaway)
    })
    return customedArr;   
}

async function getItemsViaFlask({_data = _defaultDataString, _renderNow = true, _filtered = false}) {
    theUrlForData = publicIp + "/api/es_search";
    console.log("getItemsViaFlask");
    console.log(theUrlForData);
    console.log(_data)
    console.log("POST");
    
    let response; //response is an object
    try {
        response = await $.ajax({
           url: theUrlForData,
           type: "POST",
           data: _data,
           dataType: "json",
           contentType: "application/json",
        });

        console.log(Object.values(response))
        //whether filtered or unfilterd, first remove the elements in blacklist
        prefilteredRes = (Object.values(response)).filter(giveawayPreFilter)

        _filtered ? filteredRes = prefilteredRes.filter(giveawayRulesFilter) : filteredRes = prefilteredRes

        customedRes = await restructure(filteredRes)

        _renderNow ? renderGiveaways(customedRes) : {};

        return customedRes;

    }catch(error){
       console.log(error, "Get items failed");
    }
}


var renderGiveaways = (_hits) =>{
    var abi = "";

    $.ajax({
        url: 'FairPlay.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
            //empty all the card except the template
            $(".card").slice(1).detach()
            $.each(_hits, (index, value)=>{
                contract = web3.cmt.contract(abi);
                instance = contract.at(value.contractAddress);
                //callback hell =_=|| in web3 callback you don't know when it will be done!
                instance.owner.call (function (e, r) {
                    if (e) {
                        console.log("Destructed. Ignored.");
                    }else{
                        if(r !== "0x"){
                            modifyTemplate(index, value);
                        }
                    }
                });

            })
        }
    });


    return _hits.length
}

var modifyTemplate = (index, item) => {
        var baseUrl = "https://cybermiles.github.io/smart_contracts/FairPlay/"
        var relativePlayUrl = "/dapp/play.html?contract="
        if(index < 10)
            template = $(".card-template").clone().removeClass("card-template d-none")
        else
            template = $(".card-template").clone().removeClass("card-template")

        if(item.imgUrl == ""){
            template.find(".prize-img-container").detach()
        }else{
            template.find(".prize-img").attr("src",item.imgUrl);
        }
        template.find(".giveaway-title").text(item.title);
        template.find(".n-winners").text((lgb["n_of_winners"] || "Number of winners") + ":  " + item.nWinners);

        template.find(".block-number").text((lgb["block_height"] || "Block Height") + ": " + item.blockNumber)
        template.find(".dapp-version").text(item.dappVersion)
        
        desc_txt = item.desc.split("##### Shopping Link")[0].split("##### Description").filter(Boolean)[0]
        template.find(".giveaway-desc").text(desc_txt);
        template.attr("id", item.contractAddress)
        
        // Expiry time
        var epochRepresentation = item.drawDate;
        if (epochRepresentation.toString().length == 10) {
            var endDate = new Date(epochRepresentation * 1000);
        } else if (epochRepresentation.toString().length == 13) {
            var endDate = new Date(epochRepresentation);
        }

         // Current time
         var currentDate = new Date();
 
         if (currentDate > endDate) {

            template.find(".end-time").text((lgb["end_time_short"] || "End Time") +": " + endDate)
            template.find(".end-time").addClass("expired")
            template.find(".nav-details").text(lgb["result"] || "Result")
            template.find(".nav-details").addClass("btn-danger")
            template.find(".prize-img").addClass("img-filter")
            template.find(".tag-font").text(lgb['timeup'] || "time is up")
            template.find(".tag-font").addClass("red")
         } else if (currentDate < endDate) {

            template.find(".end-time").text((lgb["end_time_short"] || "End Time") +": " + endDate)
            template.find(".end-time").addClass("current")
            template.find(".nav-details").text(lgb["play"] || "Play")
            template.find(".nav-details").addClass("btn-fairplay-yellow")
            template.find(".tag-font").removeClass("tag-font")
            
            // template.find(".tag-font").text("ongoing")
            // template.find(".tag-font").addClass("green")
        }
        
        if(item.dappVersion == "v1"){
            template.find(".rm-giveaway").detach()
        }else{
            template.find(".rm-giveaway").attr("alt", item.contractAddress)
        }

        var playUrl = baseUrl + item.dappVersion + relativePlayUrl + item.contractAddress;
        template.find(".nav-details").attr("href", playUrl)
        template.find(".giveaway-url").attr("href", playUrl)
        
        let difference = 0;
        let last = 0;
        const currentHeight = item.blockNumber
        $(".card").each((id, card) => {
            sub = $(card).find(".block-number").text().split(" ")[2] - currentHeight
            if (difference == 0){
                $(".card-deck").append(template)
            }
            if(sub > 0 && (sub < difference || difference == 0))
            {
                difference = sub;
                last = $(card).attr("id")
            }
        })
        //$(".card-deck").append(template)
        $(template).insertAfter( "#" + last );
}
