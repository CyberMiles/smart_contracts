$.ajaxPrefilter( function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //options.url = "http://cors.corsproxy.io/url=" + options.url;
  }
});

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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);


            return Object.keys(itemArray).length;
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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);

            return Object.keys(itemArray).length;
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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);

            return Object.keys(itemArray).length;
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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);
            

            
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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);
         
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
            var itemArray = await getItemsUsingDataViaFlask(jsonString);
            

            //console.log(itemArray);
        }
        return Object.keys(itemArray).length;;

    }

async function getItemsUsingDataViaFlask(_data) {
    return getItemsViaFlask(_data) 
}
 
_defaultData = {
       "query": {
            "match_all": {}
       }
    }
var _defaultDataString = JSON.stringify(_defaultData);

var cmpFunc = () => { }

var filterGiveaway = (obj, abi) => {
    blacklist = ["0xbc88c27Ad36a7B950890917A6592D8597a3C1732"]
    if(blacklist.indexOf(obj._source.contractAddress) == -1)
        return obj
}

async function getItemsViaFlask(_data = _defaultDataString, compare = cmpFunc, params = [], renderNow = true) {
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

        filteredRes = Object.values(response).filter(filterGiveaway(obj))

        sortedRes = Object.values(filteredRes).sort(compare(params))
        renderNow ? renderGiveaways(sortedRes) : {};
        return sortedRes;
    }catch(error){
       console.log("Get items failed");
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
                instance = contract.at(value._source.contractAddress);
                //callback hell =_=||
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

var modifyTemplate = (index, value) => {
        if(index < 10)
            template = $(".card-template").clone().removeClass("card-template d-none")
        else
            template = $(".card-template").clone().removeClass("card-template")
        func_data = value._source.functionData.info;
        if(func_data[3] == ""){
            template.find(".prize-img-container").detach()
        }else{
            template.find(".prize-img").attr("src",func_data[3]);
        }
        template.find(".giveaway-title").text(func_data[1]);
        template.find(".n-winners").text((lgb["n_of_winners"] || "Number of winners") + ":  " + func_data[4]);

        template.find(".block-number").text((lgb["block_height"] || "Block Height") + ": " + value._source.blockNumber)
        template.find(".dapp-version").text(value._source.dappVersion)
        
        desc_txt = func_data[2].split("##### Shopping Link")[0].split("##### Description").filter(Boolean)[0]
        template.find(".giveaway-desc").text(desc_txt);
        template.attr("id", value._source.contractAddress)
        
        // Expiry time
        var epochRepresentation = value._source.functionData.info[5];
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
        
        template.find(".rm-giveaway").attr("alt", value._source.contractAddress)

        var playUrl = "https://cybermiles.github.io/smart_contracts/FairPlay/" + value._source.dappVersion + "/dapp/play.html?contract=" + value._source.contractAddress;
        template.find(".nav-details").attr("href", playUrl)
        template.find(".giveaway-url").attr("href", playUrl)
        
        let difference = 0;
        let last = 0;
        const currentHeight = value._source.blockNumber
        $("card").each((id, card) => {
            sub = $(card).find(".block-number").text().split(" ")[2] - currentHeight
            if(sub > 0 && (sub < difference || difference == 0))
            {
                difference = sub;
                last = $(card).attr("id")
            }
        })
        $(".card-deck").append(template)
        $(template).insertAfter( "#" + last );
}
