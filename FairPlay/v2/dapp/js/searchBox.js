const fun = new MainFun();
const lgb = fun.languageChoice();
var baseUrl = "https://cybermiles.github.io/smart_contracts/FairPlay/v2/dapp/"

$(()=>{
    init();


})

var init = ()=>{
    return initPage();
}

var initPage = () => {
    $(".form-search-result").attr("action", baseUrl + "search-results.html")
    $(".href-index").attr("href", baseUrl + "index.html")
    initLanguage();
    initHerstory();
    initSuggestion();
    return bindEvents();
}

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

var initHerstory = () => {
    if(localStorage.getItem('herstory')) {
        var jsonHerstory = localStorage.getItem('herstory');
        arrHerstory = JSON.parse(jsonHerstory).reverse()
        arrHerstory.forEach(function(ele, index){
            var tagItem = $("li.search-history-tag-item.d-none").clone(true).removeClass("d-none")
            tagItem.text(ele)
            //only 3 history will be shown
            if(index < 3)
            {
                $(".search-history-list").append(tagItem)
            }
        })
        $(".search-history").removeClass("d-none")
    }
}

var initSuggestion = () => {
    arrSuggestion = ['pizza', 'camera', 'gift']
    arrSuggestion.forEach(function(ele){
        var tagItem = $("li.suggestion-tag-item.d-none").clone(true).removeClass("d-none")
        tagItem.text(ele)
        $(".suggestion-list").append(tagItem)
    })
}
 
var bindEvents = ()=>{
    $(".search-box").focus()
    bindSearchBtn()
    bindSearchTag()
    bindClearHistory()
}

var bindSearchBtn = ()=>{
    $(".search-btn").click(()=>{
        if($(".search-box").val() != "")
        {   
            arrHerstory = Array()
            searchWord = $(".search-box").val();
            if(localStorage.getItem('herstory')) {
                var jsonHerstory = localStorage.getItem('herstory');
                arrHerstory = JSON.parse(jsonHerstory)
            }
            arrHerstory.push(searchWord)
            var jsonHerstory = JSON.stringify(arrHerstory)
            localStorage.setItem('herstory', jsonHerstory)        
        }
        
    })
}

var bindSearchTag = () => {
    $(".tag-item").click((ele)=>{
        searchText = $(event.target).text()
        window.location.href = "./search-results.html?srch-term=" + searchText
    })
}

var bindClearHistory = () => {
    $("#confirm-del").click(()=>{
        localStorage.removeItem('herstory');
        $(".search-history").hide()
        $("#confirmDelHistory").modal("hide")
    })
}