const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/v2/dapp/play.html';
var webBrowser = new AppLink();
var compare = function ([prop, subprop]) {
    return function (obj1, obj2) {
        var val1 = obj1[prop][subprop];
        var val2 = obj2[prop][subprop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}

$(document).ready(function () {
    webBrowser.openBrowser();
    initLanguage();

    initCSS();
    bindSearch();
    initInfo();
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

initCSS = () => {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
}


var bindSearch = () => {
    $(".search-box").click(()=>{
        window.location.href = "./search.html"
    })
}

async function applyandGetN(items) {
    n = await renderGiveaways(items);
    console.log(n)
    return n
}

var initInfo =  async () => {
    $(".more-plays").text(lgb["loading"] || "loading...")
    
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb["error"] || "There is an error");
        } else {
            var userAddress = address.toString();
            $("#self_addr").html(userAddress);
        }
    })

    var n_current_giveaway = 0 
    if(sessionStorage.getItem('latestGiveaways')){
        arrLG = JSON.parse(sessionStorage.getItem('latestGiveaways'))
        n_current_giveaway = await applyandGetN(arrLG)
    }

    var data //undefined (intended to prefill)
    latestGiveaways = await getItemsViaFlask(data, compare, ["_source","blockNumber"], false);
    console.log(latestGiveaways, latestGiveaways.length, n_current_giveaway)
    if(n_current_giveaway == 0){
        n_current_giveaway = await applyandGetN(latestGiveaways)
    }
    if(n_current_giveaway >= 10)
    {
        $(".more-plays").text(lgb["more"] || "More")
    }else{
        $(".more-plays").text(lgb["nomore"] || "No more items.")
    }
    console.log(latestGiveaways.length, n_current_giveaway)
    if(latestGiveaways.length > n_current_giveaway){
         jsonLG = JSON.stringify(latestGiveaways)
         sessionStorage.setItem('latestGiveaways', jsonLG);
         //reapply new items
         renderGiveaways(latestGiveaways)
    }

    $(".more-plays").click(()=>{
      var moreitems = 0   
      var n_itmes = $(".card").length
      $(".card").each((i, obj)=>{
        if(!$(obj).hasClass("card-template") && $(obj).hasClass("d-none") && moreitems < 10){
            $(obj).removeClass("d-none")
            moreitems ++
            if(i == n_itmes - 1){
              $(".more-plays").html(lgb["nomore"]||"No more itmes.")
            }
        }
      });
    });
}

