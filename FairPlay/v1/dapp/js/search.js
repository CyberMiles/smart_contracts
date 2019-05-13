const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
const baseUrl = 'https://cybermiles.github.io/smart_contracts/FairPlay/dapp/play.html';
var webBrowser = new AppLink();
var getUrlParameter = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var isAddress = function (address) {
    // function isAddress(address) {
        if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}


var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
}


$(document).ready(function() {

  webBrowser.openBrowser();
  initLanguage();

  initBtn();
  var method = getUrlParameter("method");
  if(method == 'created'){
    $(".card-tips").html(lgb["giveaways_icreated"] || "Giveaways, I created...")
    $("#ICreated").click()
  }else if(method == "participated"){
    $(".card-tips").html(lgb["giveaways_iparticipated"] || "Giveaways, I participated...")
    $("#IParticipated").click()
  }else if(method == "won"){
    $(".card-tips").html(lgb["giveaways_iwon"] || "Giveaways, I won...")
    $("#IWon").click()
  }else{
    if(srch_term = getUrlParameter("srch-term")){
      // if(isAddress(srch_term)){
        // $("#searchAddressInput").val(srch_term)
      // }else{
        $("#searchTextInput").val(srch_term);
        console.log( $("#searchTextInput").val())
      // }
      $("#searchAddressButton").click()
    } 
  }
})

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
var initBtn = function(){
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

