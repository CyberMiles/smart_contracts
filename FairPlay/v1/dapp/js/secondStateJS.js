$.ajaxPrefilter( function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //options.url = "http://cors.corsproxy.io/url=" + options.url;
  }
});

//var publicIp = "https://cmt-testnet.search.secondstate.io";

var publicIp = "https://cmt.search.secondstate.io";
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
            var itemArray = await getItemsViaFlask();
           
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
blacklist = ["0xFb1072dA1f6123fa389B6385D5AB7D1cd4BDe509",
            "0x9C5D158e3c51E9eCFfA6770965b8b96E3D16074c",
            "0xF290D4b07f7c49B44d8e2785595745F5BCfaDb34",
            "0x18A45abfE471F8A5814e3Aa4Ea4a9C4cC40DCBdf",
            "0x7D45b9FFdDdc035D8D7e237E3fFBD6d1125d082c",
            "0xc92d6d591124d713AB0Ad6E1030a5Fdf5538AecC",
            "0x3271ABfCF2BfA228cE9Ef4A8dA6CCd1c6f4C9103",
            "0xA09cBF5572489A97cc5A5d4B1e7D1eCA92f78452",
            "0x67bc96cb6667Ff38Fd2E308f6781184Bf43B8F7d",
            "0x07c4B016FCF1f8769C1300dd6F9ad291bB18fD43",
            "0xc759725e0b0a96868e54eD02BeD12789D3d66C73",
            "0x6738F7c0693de2225B6EcA933e28991eB8b64982",
            "0x5698517f40Bac6D50828E65Ab3556127A13c6cC5",
            "0xF2d312053Bdc4f92a8f882cEa50DC240C6006756",
            "0x1eba151Dc5a7bF25CE1f914DDB3bfC769CE35EAC",
            "0xb4c7fCE398746DfE62b3b9D316aa5320833b7494",
            "0x3927535c29e88Aa79f1182cd29561c02DD9B3810",
            "0x5cB1f91A7152699913B8b273404c429d4b6B0Bc1",
            "0xE703E4ffb0002fBddf2818A251112206187556f6",
            "0xFAD771EF92a91F2cC2978B66a2C6361bCE70B3aA",
            "0x3ffD4fa53C7DE9e032732092B92770B5D26D3A4d",
            "0x4e480efc4d29e553965bB14ca8caAeBa0a2BC41D",
            "0xCBd3534b28025512f528EC62428F456d38E43E16",
            "0xC213827c671a6E5dF46E310D3eBE63809a07C5a7",
            "0x0E8f8E15172a0BDFF460c7c74e7e3bDDdE3b1455",
            "0x4Ebdfa1F3386c1358e7f82AD8F80Ce962d947Fb2",
            "0x464E78e0f89df9E5000C2cb6A6bC80595D7a71A2",
            "0xc23AE6997EaeE221be5c3CfF3bea61A4EEDb5F02",
            "0x4427D1a16A945ac2f2bbeB95Fa5af201b3990000",
            "0xD77ee59879F93abE823d738f8Ef75fD51f8b1A71",
            "0x3927535c29e88Aa79f1182cd29561c02DD9B3810",
            "0x9FC832898501CCCd48b508876D478e5afBE1cA77",
            "0xc01204D9297Ebc717b43e385d822F036C5dAB742",
            "0x84d05e3192Ab3ea5C55AaD721C21e8aB6827d337",
            "0x12E8EADf823cdF987F18d8aBB5A3b8C06D4Acd14",
            "0x892B86C180f5Dd0b5512527B1cD8EDB2238ea627",
            "0xadeC9ca6b970840812295aF05eD63309e9994dd1",
            "0xc0E6743bf1ec810CDCbe74530166560cF5A159B1",
            "0x50Da300d6dc63465BAE045483EeAd35B49aCa2C7",
            "0x1ee6f879D84FeE31488834439E2a243A9Eb72CD7",
            "0x4FD965011Ec3d06C84e22EC96747C8e3530c25fd",
            "0x9FDB79aA29aa6f0D541aFC7164d0B03a46536BE1",
            "0xe61ddb5a154d172A4c53CA05365d0720f256657c",
            "0x327705097AB01D5f029b01e558df45214DDcc86f",
            "0x2651a22d33B7c2a5DE2Af94cB83d15a6F4c66d11",
            "0xb0e36c0b474b6f98436377d198264F35B1f44351"
            ];

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
        filteredRes = Object.values(response).filter(function(obj){
        if(blacklist.indexOf(obj._source.contractAddress) == -1)
            return obj
        })
        sortedRes = Object.values(filteredRes).sort(compare(params))
        renderNow ? renderGiveaways(sortedRes) : {};
        return sortedRes;
    }catch(error){
       console.log("Get items failed");
    }
}

var renderGiveaways = async (_hits) =>{
    var abi = "";

    let real_length;
    try{
        data = await $.ajax({
            url: 'FairPlay.abi',
            sync: true,
            dataType: 'text',
        });

        abi = JSON.parse(data);
        //empty all the card except the template
        $(".card").slice(1).detach()

        $.each(_hits, (index, value)=>{
            modifyTemplate(index, value);
        })
    }catch(error){
       console.log("Get abi failed");
    }
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
        $(".card-deck").append(template)
}
