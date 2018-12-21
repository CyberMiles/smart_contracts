document.write("<script type='text/javascript' src='../js/qrcode.js'></script>");
document.write("<script type='text/javascript' src='../js/jquery.min.js'></script>");
document.write("<script type='text/javascript' src='../js/popper.min.js'></script>");
document.write("<script type='text/javascript' src='../js/bootstrap.min.js'></script>");
document.write("<script type='text/javascript' src='../js/clipboard.js'></script>");
document.write("<script type='text/javascript' src='../js/popuTip/layer.js'></script>");
document.write("<script type='text/javascript' src='../js/popupTip.js'></script>");
document.write("<script type='text/javascript' src='../js/browser.js'></script>");
document.write("<script type='text/javascript' src='../js/language/en.js'></script>");
document.write("<script type='text/javascript' src='../js/language/zh.js'></script>");

const domType = ["div", "span", "p"];
const attrType = ["id", "name", "class"];
const appendType = ["after", "before", "children", "body", "bodyFirst"];

var MainFun = (function () {

        var _languageChoice = function () {
            var lang = EnLanguage;
            var language = '';
            if (navigator.appName == 'Netscape') {
                language = navigator.language;
            } else {
                language = navigator.browserLanguage;
            }
            if (language.indexOf('zh') > -1) {
                document.write("<script type='text/javascript' src='../js/language/zh.js'></script>");
                lang = ZHLanguage;
            }
            return lang;
        }

        var _createDiv = function (elementObj) {
            var divs = elementObj.children;
            var str = _convert(divs.length - 1);
            var newDiv = '<div class="main-div"><input  maxlength="21" name="choice" onkeyup="checkChoice(this.value)"' +
                ' placeholder="' + lang.option + ' ' + str + '"><div class="main-line"></div></div>'
            $(".add-div").before(newDiv)
        };

        var _removeLastDiv = function (parent, tipMsg) {
            var divs = parent.children;
            var lastDiv = divs[divs.length - 2];
            if (divs.length < 5) {
                IUToast.error(tipMsg);
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
            var popDiv = document.getElementById("pupopBox");
            if (popDiv != null && popDiv != '') {
                popDiv.remove();
            }
            var popup = $('<div id="pupopBox" class="pupopBox" style="display:none;position: fixed;top:0;left: 0;width: 100%;height: 100%;' +
                'background-color:rgba(0,0,0,0.6); "><div  class="pupopContent" style="position:absolute;top:39%;left:50%;' +
                'transform: translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;width:' + pupW + ';' +
                'height: ' + pupH + ';background-color: #fff;border-radius: 10px;padding: 20px">' +
                '<img class="pupClose" src="' + pupClose + '" style="position: absolute;height:' + pupCloseH + '; top:-' + pupCloseH + ';' +
                'right:0; cursor: pointer " />' +
                '<div style="font-size: 14px;">' + pupText + ' </div>' +
                '</div></div>');
            $("body").append(popup);
            if (btnText) {
                $('.pupopContent').append($('<a style="display:; background-color:#1976d2;border-radius: 6px;margin-top:15px;padding:8px 20px;' +
                    'color: #fff; text-decoration: none;font-size: 14px; " id="pup_btn" href="javascript:;">' + btnText + '</a>'));
            }
            $('.pupopBox').fadeIn();
            $('body').on('click', '.pupClose', function () {
                $('.pupopBox').fadeOut(500, function () {
                    $(this).remove()
                })
            })
        };

        var _popupLoadTip = function (content, fadeTime) {
            var popDiv = document.getElementById("pupopBox");
            if (popDiv != null && popDiv != '') {
                popDiv.remove();
            }
            var popup = $('<div id="pupopBox" class="pupopBox" style="display:none;position: fixed;top:0;left: 0;width: 100%;height: 100%;' +
                'background-color:rgba(0,0,0,0.6); ">' +
                '<div id="layout" class="layoutLoading">' +
                '<img id="loadImg" src="../images/cybermiles.ico"/><div style="align-content: center;margin-top: 12px;width:100%" id="over">' + content + '</div></div>' +
                '<input type="hidden" id="removedTheInterval" value="false"></div>');
            $("body").append(popup);
            $('.pupopBox').fadeIn();
            document.getElementById("layout").style.display = "block";
            var time = fadeTime / 2;
            $('#loadImg').fadeOut(time);
            $('#loadImg').fadeIn(time)
            var intervalFun = setInterval(function () {
                // if the popupTip had start then hided,after will be not executed and stop the interval;
                var stop = $("#boxHaveStop").val();
                if (stop != null && stop != '' && Boolean(stop)) {
                    clearInterval(intervalFun);
                    return;
                }
                $('#loadImg').fadeOut(time, function () {
                });
                $('#loadImg').fadeIn(time, function () {
                })
            }, fadeTime);
            return intervalFun;
        };

        /**
         * hide the popupTip
         * @param boxId
         * @private
         */
        var _popupLoadTipHide = function (intervalFun, boxId) {
            clearInterval(intervalFun);
            var domId = "#" + boxId;
            $(domId).css("display", "none");
        }


        /**
         * add choice div
         * @param title         div title
         * @param select[]        div content
         * @param bottomBtn[]     div button name
         * @private
         */
        var _popupSelectTip = function (title, select, bottomBtn) {
            var popDiv = document.getElementById("pupopBox");
            if (popDiv != null && popDiv != '') {
                popDiv.remove();
            }
            var btnDiv = '';
            var selectDiv = '';
            var divStyle = 'style="position:relative;top: 23px;bottom: 18px;flex: auto;"';
            var length = 0;
            for (var i = 0; i < title.length; i++) {
                if (/.*[\u4e00-\u9fa5]+.*$/.test(title[i])) {
                    length += 2;
                }
            }
            var titleHeight = parseInt((length + 28) / 28) * 20;
            var divFontStyle = 'style="position:relative;flex: auto;margin-left: 25px;margin-top:5px;margin-bottom:5px;bottom: 10px;font-size: 16px;font-weight: 500;font-family: SFProText;height: ' + titleHeight + 'px;"';
            var divSelectFontStyle = 'style="position:relative;flex: auto;margin-left: 25px;margin-top: 6px;margin-bottom:19px;font-size: 16px;font-weight: normal;font-family: SFProText;height: 19px;"';
            var bottomBtnStyle = 'style="position:relative;float:right;margin-right:20px;margin-top:5px;margin-bottom:35px;font-family: SFUIText;font-size: 16px;font-weight: 500;color: #1976d2;"';
            if (select instanceof Array) {
                for (var i = 0; i < select.length; i++) {
                    selectDiv += '<div class="main-bet-choice-alert main-contain" name="choiceAlert"><div ' + divSelectFontStyle + ' id="' + select[i] + '">' + select[i] + ' </div>' +
                        '<div class="main-bet-choice-right-div-alert main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></div>' +
                        '<div hidden="hidden">' + (i + 1) + '</div>' +
                        '</div>'
                }
            } else {
                selectDiv += '<div class="main-bet-choice-alert main-contain" name="choiceAlert"><div ' + divSelectFontStyle + ' id="' + select + '">' + select + ' </div>' +
                    '<div class="main-bet-choice-right-div-alert main-hidden"><img class="main-bet-choice-right" src="../images/choice.png"></div>' +
                    '<div hidden="hidden">' + 1 + '</div>' +
                    '</div>'
            }
            if (bottomBtn instanceof Array) {
                for (var i = 0; i < bottomBtn.length; i++) {
                    btnDiv += '<div ' + bottomBtnStyle + ' id="' + bottomBtn[i] + '">' + bottomBtn[i] + ' </div>'
                }
            } else {
                btnDiv += '<div ' + bottomBtnStyle + ' id="' + bottomBtn + '">' + bottomBtn + ' </div>'
            }
            btnDiv = '<div style="margin-bottom: 10px;">' + btnDiv + '</div>';

            var popup = $('<div id="pupopBox" class="pupopBox main-bet-title" style="display:none;position: fixed;top:0;left: 0;width: 100%;height: 100%;' +
                'background-color:rgba(0,0,0,0.6); "><div  class="pupopContent" style="position:absolute;top:50%;left:50%;' +
                'transform: translate(-50%,-50%);display:flex;flex-direction:column;justify-content:center;width: 80%' +
                ';background-color: #fff;">' +
                '<div ' + divStyle + '><p ' + divFontStyle + ' id="selectBetTitle">' + title + '</p><div style="border: solid 1px #e7eaec;position: relative"></div>' +
                selectDiv +
                '<div style="border: solid 1px #e7eaec;position: relative;float: bottom;margin-bottom: 8px"></div>' +
                btnDiv +
                '</div></div></div>'
            );
            $("body").append(popup);
            $('.pupopBox').fadeIn();
            $('body').on('click', '.pupClose', function () {
                $('.pupopBox').fadeOut(500, function () {
                    $(this).remove()
                })
            })
        };


        /**
         * add input div
         * @param title           div title
         * @param select[]        div desc
         * @private
         */
        var _popupInputTip = function (title, content, btnName, btnId) {
            var popDiv = document.getElementById("pupopBox");
            if (popDiv != null && popDiv != '') {
                popDiv.remove();
            }

            var divStyle = 'style="position:relative;top: 23px;bottom: 18px;flex: auto;"';
            var divFontStyle = 'style="position:relative;flex: auto;margin-left: 25px;margin-top:5px;margin-bottom:5px;bottom: 10px;font-size: 16px;font-weight: 500;font-family: SFProText;height: 19px;"';
            var bottomBtnStyle = 'style="position:relative;float:right;margin-right:20px;margin-top:5px;margin-bottom:35px;font-family: SFUIText;font-size: 16px;font-weight: 500;color: #1976d2;text-align:right;"';
            var inputDivFontStyle = 'style="width: 90%;height: 44px;padding-top:20px;padding-bottom:20px;border-radius: 4px;background-color: #f4f6f8;font-family: SFUIText;font-size: 16px;font-weight: normal;"';
            var inputDiv = '<div style="margin: 10px;"><input ' + inputDivFontStyle + 'id="' + btnId + 'Value" type="number" placeholder="' + content + '" onkeyup="onlyNumber(this.value)"></div>';
            var btnDiv = '<div style="margin-bottom: 10px;"><p ' + bottomBtnStyle + ' id="' + btnId + '">' + btnName + ' </p></div>';
            var popup = $('<div id="pupopBox" class="pupopBox main-bet-title" style="display:none;position: fixed;top:0;left: 0;width: 100%;height: 100%;' +
                'background-color:rgba(0,0,0,0.6); "><div  class="pupopContent" style="position:absolute;top:39%;left:50%;' +
                'transform: translate(-50%,-50%);display:flex;flex-direction:column;justify-content:center;width: 80%' +
                ';background-color: #fff;">' +
                '<div ' + divStyle + '><div ' + divFontStyle + '>' + title + '</div><p style="border: solid 1px #e7eaec;position: relative;width: 100%;"></p>' +
                inputDiv +
                '<p style="border: solid 1px #e7eaec;position: relative;float: bottom;margin-bottom: 8px;width: 100%;"></p>' +
                btnDiv +
                '</div></div></div>'
            );
            $("body").append(popup);
            $('.pupopBox').fadeIn();
            $('body').on('click', '.pupClose', function () {
                $('.pupopBox').fadeOut(500, function () {
                    $(this).remove()
                })
            })
        };

        var _popupTipBottom = function (options, funArray, cancel) {
            //底部对话框 1：content 2：btn array 3：fun array
            options.unshift('');
            layer.open({
                btn: '',
                skin: 'footer',
                yes: function (index, type) {
                    const map = funArray();
                    var clickFun = map.get(type.innerText);
                    clickFun();
                    layer.closeAll();
                },
                no: function (index, type) {

                },
                success: function () {
                    var obj = document.querySelector('.layui-m-layerbtn');
                    for (var i = 1; i < options.length; i++) {
                        var newbtn = document.createElement('span');
                        newbtn.setAttribute('yes', '');
                        newbtn.setAttribute('name', options[i]);
                        newbtn.textContent = options[i];
                        newbtn.setAttribute('type', i);
                        obj.appendChild(newbtn);
                    }
                    obj.removeChild(obj.firstChild);
                    var cancelBtn = document.createElement('span');
                    cancelBtn.textContent = cancel;
                    cancelBtn.setAttribute('no', '');
                    cancelBtn.setAttribute('id', 'cancel');
                    cancelBtn.setAttribute('type', 0);
                    obj.appendChild(cancelBtn);
                }
            });
        };

        // 关闭弹窗
        var _closePopupTip = function () {
            // 获取弹窗
            var modal = document.getElementById('pupopBox');
            // 在用户点击其他地方时，关闭弹窗
            window.onclick = function (event) {
                if (event.target == modal) {
                    //modal.style.display = "none";
                    $('.pupopBox').fadeOut(500, function () {
                        modal.style.display = "none";
                    })
                }
            }
        }

        // 移除弹窗
        var _hidePopupTip = function () {
            // 获取弹窗
            var modal = document.getElementById('pupopBox');
            modal.style.display = "none";
        }

        // create a button show owner setting button ,before call it you should add id "owner-bet"
        var _addButton = function (id, afterId, content, color, bindFun) {
            var parentId = id + '-parent';
            _createDivInnerHtml(domType[0], attrType[0], appendType[0], '', parentId, afterId);
            var ownerDiv = '<div class="main-contain main-div-button"><div class="main-button-div"><div class="main-button" id="create-button"><p id="setting" class="main-button-not-click-font">' + content + '</p></div></div></div>';
            _createDivInnerHtml(domType[0], attrType[0], appendType[2], ownerDiv, id, parentId);
            var element = document.getElementById(id);
            var btnElement = document.getElementById("create-button");
            btnElement.style.cssText = "background-color: " + color;
            fun.addMainEvent(btnElement, "click", bindFun);
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

        var _createDivInnerHtml = function (type, attrArray, aptType, divContent, id, divId) {
            var div = document.createElement(type);

            var appendDiv = document.getElementById(divId);
            if (aptType == appendType[0]) {
                appendDiv.after(div);
            }
            if (aptType == appendType[1]) {
                appendDiv.before(div);
            }
            if (aptType == appendType[2]) {
                appendDiv.appendChild(div);
            }
            if (aptType == appendType[3]) {
                document.body.appendChild(div)
            }
            if (aptType == appendType[4]) {
                document.body.appendChild(div, document.body.firstElementChild);
            }
            if (attrArray instanceof Array) {
                for (var i = 0; i < attrArray.length; i++) {
                    var attr = document.createAttribute(attrArray[i]);
                    attr.value = id[i];
                    div.setAttributeNode(attr);
                    if (divContent != null && divContent != '') {
                        var element = document.getElementById(id[i]);
                        if (attrArray[i] == attrType[1]) {
                            element = document.getElementsByName(id[i]);
                        }
                        if (attrArray[i] == attrType[2]) {
                            element = document.getElementsByClassName(id[i]);
                        }
                        element.innerHTML = divContent;
                    }
                }
            } else {
                var attr = document.createAttribute(attrArray);
                attr.value = id;
                div.setAttributeNode(attr);
                if (divContent != null && divContent != '') {
                    var element = document.getElementById(id);
                    if (attrArray == attrType[1]) {
                        element = document.getElementsByName(id);
                    }
                    if (attrArray == attrType[2]) {
                        element = document.getElementsByClassName(id);
                    }
                    element.innerHTML = divContent;
                }
            }
        }

        var _getUrlParameter = function (name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        var _checkTransactionStatus = function (tx, successCallback, errorCallback) {
            var checkTransactionTimer = setInterval(function () {
                web3.cmt.getTransactionReceipt(tx, function (error, result) {
                    if (!error) {
                        if (result != null && result.status == '0x1') {
                            clearInterval(checkTransactionTimer);
                            if (successCallback != null && successCallback != undefined) {
                                successCallback(result);
                            } else {
                                alert('Transaction successfully!')
                            }

                        } else if (result != null && result.status == '0x0') {
                            if (errorCallback != null && errorCallback != undefined) {
                                errorCallback(error);
                            } else {
                                IUToast.show('error', 'Transaction failed!', 1500);
                            }
                            clearInterval(checkTransactionTimer);
                        }
                    }
                })
            }, 3000)
        };

        var _onlyNumber = function (obj) {
            obj = obj.replace(/[^\d]/g, '');
            obj = obj.replace(/^\./g, '');
            obj = obj.replace('.', '$#$').replace(/\./g, '').replace(
                '$#$', '.');
            return obj;
        }

        var _changeInputPlaceholder = function (type, id, value) {
            if (type == attrType[0]) {
                $("#" + id).attr("placeholder", value);
            }
            if (type == attrType[1]) {
                var inputs = document.getElementsByName(id);
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].setAttribute("placeholder", value + ' ' + _convert(i));
                }
            }
            if (type == attrType[2]) {
                $("." + id).attr("placeholder", value);
            }
        }

        var _changeDomContent = function (type, id, value) {
            if (type == attrType[0]) {
                $("#" + id).html(value);
            }
            if (type == attrType[1]) {
                var inputs = document.getElementsByName(id);
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].html(value);
                }
            }
            if (type == attrType[2]) {
                $("." + id).html(value);
            }
        }

        var MainFunction = function (...args) {
        };


        var options = ['add', 'del'];

        MainFunction.changeDomContentById = function (id, value) {
            _changeDomContent(attrType[0], id, value);
        }

        MainFunction.changeDomContentByName = function (id, value) {
            _changeDomContent(attrType[1], id, value);
        }
        MainFunction.changeDomContentByClass = function (id, value) {
            _changeDomContent(attrType[2], id, value);
        }

        MainFunction.choiceInputLangById = function (id, value) {
            _changeInputPlaceholder(attrType[0], id, value);
        }

        MainFunction.choiceInputLangByName = function (id, value) {
            _changeInputPlaceholder(attrType[1], id, value);
        }

        MainFunction.choiceInputLangByClass = function (id, value) {
            _changeInputPlaceholder(attrType[2], id, value);
        }

        MainFunction.languageChoice = function () {
            return _languageChoice();
        }

        MainFunction.onlyNumber = function (args) {
            return _onlyNumber(args);
        }

        MainFunction.createDivById = function (id) {
            var elementObj = document.getElementById(id);
            return function createDiv() {
                _createDiv(elementObj);
            };
        };

        MainFunction.checkTransactionStatus = function (tx, successCallback, errorCallback) {
            _checkTransactionStatus(tx, successCallback, errorCallback);
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

        MainFunction.removeLastDiv = function (id, tipMsg) {
            var elementObj = document.getElementById(id);
            return function removeDiv() {
                _removeLastDiv(elementObj, tipMsg);
            };
        };

        MainFunction.addButton = function (id, afterId, content, color, callBack) {
            return _addButton(id, afterId, content, color, callBack);
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
            _popupTip('255px', '100px', pupText, '', '38px', btnText);
            this.addMainEvent(document.getElementById("pupopBox"), "click", this.closePopupTip)
        }

        MainFunction.getLetterByNum = function (number) {
            return _convert(number);
        }

        /**
         * middle popupTip
         * @param title
         * @param select
         * @param bottomBtn
         */
        MainFunction.popupSelectTip = function (title, select, buttonBtn) {
            _popupSelectTip(title, select, buttonBtn);
            this.addMainEvent(document.getElementById("pupopBox"), "click", this.closePopupTip)
        }

        /**
         * alert input div
         * @param title         div title
         * @param inputDesc     input desc
         * @param buttonName    button name
         */
        MainFunction.popupInputTip = function (title, inputDesc, buttonName, btnId) {
            _popupInputTip(title, inputDesc, buttonName, btnId);
            this.addMainEvent(document.getElementById("pupopBox"), "click", this.closePopupTip)
        }

        MainFunction.popupTipBottom = function (button, funArray, cancel) {
            _popupTipBottom(button, funArray, cancel);
        }

        /**
         * create a content with domType,if appendType == body ,you can ignore afterId
         * @param domType           "div", "span", "p"
         * @param attrType[]        "id", "name", "class"
         * @param appendType[]      "after", "before", "children", "body", "bodyFirst"
         * @param content           div content
         * @param id                div id
         * @param afterId           afterId
         */
        MainFunction.addDivInnerhtml = function (domType, attrType, appendType, content, id, afterId) {
            _createDivInnerHtml(domType, attrType, appendType, content, id, afterId);
        }

        MainFunction.popupLoadTip = function (content, fadeTime) {
            return _popupLoadTip(content, fadeTime);
        }

        MainFunction.popupLoadTipClose = function (intervalFun, boxId) {
            _popupLoadTipHide(intervalFun, boxId);
        }

        MainFunction.closePopupTip = function () {
            _closePopupTip();
        }

        MainFunction.removePopupTip = function () {
            _hidePopupTip();
        }

        MainFunction.getParameter = function (name) {
            return _getUrlParameter(name);
        }

        return MainFunction;
    })
;

