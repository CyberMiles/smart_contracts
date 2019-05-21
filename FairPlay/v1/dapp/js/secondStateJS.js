var publicIp = "http://13.211.31.225"; // This must be an empty string, unless you are hosting this on a public server
//var publicIp = "http://54.66.215.89"; // If you are hosting this on a public server, this must be the IP address or Base Domain (including the protocol i.e. http://mysite.com or http://123.456.7.8)
 var elasticSearchUrl = "https://search-smart-contract-search-engine-cdul5cxmqop325ularygq62khi.ap-southeast-2.es.amazonaws.com/fairplay/_search/?size=100"
 var currentAccount = "";
// The above config must be placed in a better system (master config area)

var ICreatedButton = () => {
        async function setUpAndProgress() {
            var originalState = $("#pb.progress-bar").clone();
            $("#pbc").show()
            $('#collapseAdvancedSearch').removeClass('show');
            this.currentAccount = "";
            $('.results').empty();
            $("#pb.progress-bar").attr('style', 'width:25%');
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });
           
            $("#pb.progress-bar").attr('style', 'width:100%');
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
            $("#pbc").hide('slow');
            var jsonString = JSON.stringify(dQuery);
            // If this is a public website then we need to call ES using Flask
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

            $("#pb.progress-bar").replaceWith(originalState.clone());

            return itemArray.length;
        }
        return setUpAndProgress();
    }

var IParticipatedButton = () => {
        async function setUpAndProgress() {
            var originalState = $("#pb.progress-bar").clone();
            $("#pbc").show()
            $('#collapseAdvancedSearch').removeClass('show');
            this.currentAccount = "";
            $('.results').empty();
            $("#pb.progress-bar").attr('style', 'width:25%');
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });

            $("#pb.progress-bar").attr('style', 'width:100%');
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
            $("#pbc").hide('slow');
            var jsonString = JSON.stringify(dQuery);

            // If this is a public website then we need to call ES using Flask
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

            $("#pb.progress-bar").replaceWith(originalState.clone());

            return itemArray.length;
        }
        return setUpAndProgress();
    }

var IWonButton = () => {
        async function setUpAndProgress() {
            var originalState = $("#pb.progress-bar").clone();
            $("#pbc").show()
            $('#collapseAdvancedSearch').removeClass('show');
            this.currentAccount = "";
            $('.results').empty();
            $("#pb.progress-bar").attr('style', 'width:25%');
            await web3.cmt.getAccounts((err, accounts) => {
                this.currentAccount = accounts[0]
            });
            
            $("#pb.progress-bar").attr('style', 'width:100%');
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
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

            $("#pb.progress-bar").replaceWith(originalState.clone());

            return itemArray.length;
        }
        return setUpAndProgress();
    }


var searchButton =  async () => {
        $('.results').empty()
        var theAddress = $("#searchAddressInput").val();
        var theText = $("#searchTextInput").val();
        //console.log($.trim(theAddress.length));
        if ($.trim(theAddress.length) == "0" && $.trim(theText.length) == "0") {
            //console.log("Address and text are both blank, fetching all results without a filter");
            if(publicIp){
                getItemsViaFlask(elasticSearchUrl);
            }else{
                getItems(elasticSearchUrl);
            }
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
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

            
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
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

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
            if(publicIp){
                var itemArray = await getItemsUsingDataViaFlask(jsonString);
            }else{
                var itemArray = await getItemsUsingData(elasticSearchUrl, "post", jsonString, "json", "application/json");
            }

            //console.log(itemArray);
        }
        return itemArray.length;

    }


async function getItemsUsingData(_url, _type, _data, _dataType, _contentType) {
    let response;
    try {
        response = await $.ajax({
            url: _url,
            type: _type,
            data: _data,
            dataType: _dataType,
            contentType: _contentType,
        });
        renderGiveaways(response.hits.hits)
        return response.hits.hits;
    } catch (error) {
        console.error("Get items failed", error);
    }

}

async function getItemsUsingDataViaFlask(_data) {
    theUrlForData1 = publicIp + ":5000/data1";
    console.log("getItemsUsingDataViaFlask");
    console.log(theUrlForData1);
    console.log(_data);
    let response;
    try {
        response = await   $.ajax({
            url: theUrlForData1,
            type: "POST",
            data: _data,
            dataType: "json",
            contentType: "application/json",
        });
        renderGiveaways(response.hits.hits)
        return response.hits.hits;
    } catch (error) {
        console.error("Get items failed", error);
    }

  
}

 function getItems(_url) {
     $.get(_url, function(data, status) {
         //console.log(data.hits.hits);
        renderGiveaways(data.hits.hits);
     });
 }
 
function getItemsViaFlask() {
    theUrlforData2 = publicIp + ":5000/data2";
    console.log("getItemsViaFlask");
    console.log(theUrlforData2);
    console.log("GET");
    $.get(theUrlforData2, function(data, status) {
        //console.log(data.hits.hits);
        renderGiveaways(data.hits.hits);
    });
}

var renderGiveaways = (_hits) =>{
    $.each(_hits, (index, value)=>{
        if(index < 10)
            template = $(".card-template").clone().removeClass("card-template d-none")
        else
            template = $(".card-template").clone().removeClass("card-template")
        func_data = value._source.functionData;
        template.find(".prize-img").attr("src",func_data.image_url);
        template.find(".giveaway-title").text(func_data.title);
        template.find(".block-number").text("Block Height:  " + value._source.blockNumber)
        template.find(".n-winners").text("Number of winners:  " + func_data.number_of_winners);

        
        
        desc_txt = func_data.desc.split("##### Shopping Link")[0].split("##### Description").filter(Boolean)[0]
        template.find(".giveaway-desc").text(desc_txt);
        template.find(".rm-giveaway").attr("id", value._source.contractAddress)
         // Expiry time
         var epochRepresentation = value._source.functionData.info[5];
         if (epochRepresentation.toString().length == 10) {
             var endDate = new Date(epochRepresentation);
         }
 

         // Current time
         var currentDate = new Date();
 
         if (currentDate > endDate) {

            template.find(".end-time").text("end time: " + endDate)
            template.find(".end-time").addClass("expired")
            template.find(".nav-details > a").text(lgb["result"] || "Result")
            template.find(".nav-details").addClass("btn-danger")
            template.find(".prize-img").addClass("img-filter")
            template.find(".tag-font").text(lgb['timeup'] || "time is up")
            template.find(".tag-font").addClass("red")
         } else if (currentDate < endDate) {

            template.find(".end-time").text("end time: " + endDate)
            template.find(".end-time").addClass("current")
            template.find(".nav-details > a").text(lgb["play"] || "Play")
            template.find(".nav-details").addClass("btn-success")
            template.find(".tag-font").removeClass("tag-font")
            
            // template.find(".tag-font").text("ongoing")
            // template.find(".tag-font").addClass("green")
        }

        var playUrl = "https://cybermiles.github.io/smart_contracts/FairPlay/v1/dapp/play.html?contract=" + value._source.contractAddress;
        template.find(".nav-details > a").attr("href", playUrl)
        template.find(".giveaway-url").attr("href", playUrl)
        $(".card-deck").append(template)

    })
    return _hits.length
}
