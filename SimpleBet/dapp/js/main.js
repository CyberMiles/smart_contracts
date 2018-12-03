document.write("<script type='text/javascript' src='https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js'></script>");
document.write("<script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js' integrity='sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49' crossOrigin='anonymous'></script>");
document.write("<script type='text/javascript' src='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js' integrity='sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy' crossOrigin='anonymous'></script>");
document.write("<script type='text/javascript' src='http://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js'></script>");

var MainFun = (function () {

    var _createDiv = function (elementObj) {
        var divs = elementObj.children;
        var str = _convert(divs.length - 1);
        var newDiv = '<div class="main-div"><input name="choice" onkeyup="checkChoice()"' +
            ' placeholder="Option ' + str + '"><div class="main-line"></div></div>'
        $(".add-div").before(newDiv)
    };

    var _removeLastDiv = function (parent) {
        var divs = parent.children;
        var lastDiv = divs[divs.length - 2];
        if (divs.length < 5) {
            alert("不能小于2个选项！");
            return;
        }
        parent.removeChild(lastDiv);
    };

    var _eventOption = function (obj, type, handle, option) {
        if (option == null || option == '' || option == 'add') {
            try {
                obj.addEventListener(type, handle, false);
            } catch (e) {
                obj.attachEvent('on' + type, handle);
            }
        } else {
            try {
                obj.removeEventListener(type, handle, false);
            } catch (e) {
                obj.unbind(type, handle);
            }
        }
    };

    var _show_or_hidden = function (type, element) {
        var args = 'hidden';
        if (type == 'visible') {
            args = 'visible'
        }
        element.style.visibility = args;
    }

    /*参数说明：
        * pupW 弹出层宽度 单位可以是px rem, 百分百
        * pupH 弹出层高度
        * pupText 弹出层提示语 可以加html标签
        * pupClose 关闭按钮
        * pupCloseH 关闭按钮高度 用来定位关闭按钮的位置
        * btnText 按钮文字 （可缺省，不加按钮）
        * */
    var _popupTip = function (pupW, pupH, pupText, pupClose, pupCloseH, btnText) {
        var popup = $('<div id="pupopBox" class="pupopBox" style="display:none;position: fixed;top:0;left: 0;width: 100%;height: 100%;background-color:rgba(0,0,0,0.6); "><div  class="pupopContent" style="position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);display:flex;flex-direction:column;justify-content:center;align-items:center;width:' + pupW + ';height: ' + pupH + ';background-color: #fff;border-radius: 10px;padding: 20px">' +
            '<img class="pupClose" src="' + pupClose + '" style="position: absolute;height:' + pupCloseH + '; top:-' + pupCloseH + ';right:0; cursor: pointer " />' +
            '<div style="font-size: 14px;">' + pupText + ' </div>' +
            '</div></div>');
        $("body").append(popup);
        if (btnText) {
            $('.pupopContent').append($('<a style="display:; background-color:#1976d2;border-radius: 6px;margin-top:15px;padding:8px 20px;color: #fff; text-decoration: none;font-size: 14px; " id="pup_btn" href="javascript:;">' + btnText + '</a>'));
        }
        $('.pupopBox').fadeIn();
        $('body').on('click', '.pupClose', function () {
            $('.pupopBox').fadeOut(500, function () {
                $(this).remove()
            })
        })
    };

    // 关闭弹窗
    var _clousePopupTip = function () {
        // 获取弹窗
        var modal = document.getElementById('pupopBox');
        // 在用户点击其他地方时，关闭弹窗
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // show owner setting button ,before call it you should add id "owner-bet"
    var _showOwnerBetSetting = function () {
        var ownerDiv = '<div class="main-contain main-bottom"><div class="main-button-div"><div class="main-button" id="owner-button"><p id="setting" class="main-button-not-click-font">Bet settings</p></div></div></div>';
        var element = document.getElementById("owner-bet");
        if (element == 'undefind' || element == null || element == '') {
            return 'you should add a div with the id "owner-bet" '
        }
        element.innerHTML = ownerDiv;
        var element = document.getElementById("owner-button");
        element.style.cssText = "background-color: #1976d2;";
        fun.addMainEvent(element, "click", betSetting);
        fun.divShow(element);
    };

    var _convert = function (num) {
        var saveLet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var singleLet = "";
        var val = 0;

        while (num > 0) {
            val = (num - 1) % 26
            singleLet = saveLet[val] + singleLet;
            num = Math.floor((num - 1) / 26);
        }
        return singleLet;
    }

    var MainFunction = function (...args) {
    };

    var options = ['add', 'del'];

    MainFunction.createDivById = function (id) {
        var elementObj = document.getElementById(id);
        return function createDiv() {
            _createDiv(elementObj);
        };
    };

    MainFunction.createDivByClassName = function (className) {
        var elementObj = document.getElementsByClassName(className)
        return function createDiv() {
            _createDiv(elementObj);
        };
    };

    MainFunction.createDivByName = function (name) {
        var elementObj = document.getElementsByName(name)
        return function createDiv() {
            _createDiv(elementObj);
        };
    };

    MainFunction.removeLastDiv = function (id) {
        var elementObj = document.getElementById(id);
        return function removeDiv() {
            _removeLastDiv(elementObj);
        };
    };

    MainFunction.addOwnerButton = function(){
        return _showOwnerBetSetting();
    }

    MainFunction.divShow = function (element) {
        _show_or_hidden('visible', element)
    };

    MainFunction.divHide = function (element) {
        _show_or_hidden('hidden', element)
    };

    MainFunction.addMainEvent = function (...args) {
        _eventOption(args[0], args[1], args[2], options[0]);
    };

    MainFunction.delMainEvent = function (...args) {
        _eventOption(args[0], args[1], args[2], options[1]);
    };

    MainFunction.popupTip = function (pupText, btnText) {
        _popupTip('255px', '160px', pupText, 'images/add.png', '38px', btnText);
    }

    MainFunction.closePopupTip = function () {
        _clousePopupTip();
    }

    return MainFunction;
});

