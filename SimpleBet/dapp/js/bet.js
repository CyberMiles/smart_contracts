var fun = new MainFun();

// init the html
$(function () {
    //TODO judge if the owner
    var isOwner = true;

    if (isOwner) {
        var result = fun.addOwnerButton();
        if (result) {
            alert(result);
        }
    }
    showChoices();
    bindChoice();

});

var betSetting = function () {
    alert("分享");
}

var confirmOption = function () {
    var selectEdValue = $("#selectEdValue").val();
    if (selectEdValue == null || selectEdValue == '' || selectEdValue < 0) {
        fun.popupTip('please select you choice!');
        return;
    }
    alert("confirmOption");
}


var showChoices = function () {
    var values = {0: 'A. Smog', 1: 'B. Snowing', 2: 'C. Rain'}
    var html = '';
    for (var choiceValue in values) {
        var div = '<div class="main-contain"><div class="main-bet-choice" name="choice">' +
            '<p class="main-bet-join-div">' + values[choiceValue] + '</p><p class="main-bet-choice-right-div main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></p><p hidden="hidden">' + choiceValue + '</p></div></div>';
        html += div;
    }
    document.getElementById("choices").innerHTML = html;
};


var bindChoice = function () {
    var elements = document.getElementsByName("choice");
    for (var i = 0; i < elements.length; i++) {
        console.log(elements[i]);
        fun.addMainEvent(elements[i], "click", optionSelect);
    }
}

// change the selected option style
var optionSelect = function () {
    var inputValue = this.children[2].innerHTML;
    var currentVisible = this.children[1].style.visibility;
    hiddenAllSelect();
    if (currentVisible != 'visible') {
        this.children[1].style.visibility = 'visible';
        document.getElementById("selectEdValue").value = inputValue;
        var root = document.getElementsByClassName("main-button")[0];
        root.style.cssText = "background-color: #1976d2;";
        var obj = document.getElementById("submit-div");
        fun.addMainEvent(obj, "click", confirmOption);
    }
    console.log(inputValue);
}

var hiddenAllSelect = function () {
    var allElement = document.getElementsByClassName("main-bet-choice-right-div");
    console.log(allElement);
    for (var i = 0; i < allElement.length; i++) {
        allElement[i].style.visibility = 'hidden';
    }
    document.getElementById("selectEdValue").value = '';
}
