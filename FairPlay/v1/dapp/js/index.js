const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
var compare = function (prop, subprop) {
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
    initCSS();
    initInfo();
});

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

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('#back-to-top').tooltip('show');
}

initInfo = () => {
    
    $(".self_addr").html(web3.cmt.accounts[0]);
    
    $.get(elasticSearchUrl, function(data, status) {
        latestGiveaways = data.hits.hits.sort(compare("_source","blockNumber")).reverse();
        n_items = renderGiveaways(latestGiveaways);
        // console.log(n_items)
    });
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

