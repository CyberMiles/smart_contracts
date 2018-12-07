let toastTemplate = `<div id="iutoast" class="iu-loading" style="display: none;">
        <div class="iu-loading-mask "></div>
        <div class="flag note note--secondary">
            <div class="flag__image note__icon">
                <div id="okIUToastFlag" data-code="icon" style="display: none;"><i class="checkmark draw" > </i></div>
                <i id='errorIUToastFlag' data-code="icon" class="checkfork" style="display: none;"></i>
                <div id="loadingIUToastFlag" data-code="icon" class="lds-ring"  style="display: none;"><div></div><div></div><div></div>           <div></div></div>
            </div>
            <div id="iutitle" class="flag__body note__text">
            </div>
            <a href="#" class="note__close">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
const IUToast = {
    //use example
    runExample: function(){
        console.log('example go!');
        IUToast.show('loading', 'test loading', 1000);
        setTimeout(function(){
            IUToast.show('error', 'test error', 2000);
        }, 2000);
        setTimeout(function(){
            IUToast.show('ok', 'test ok');
        }, 5000);
        console.log('example over!');
    },

    //param1: itype: ok error loading
    //param2: ititle: tip title
    //param3: idelay: delay seconds
    show: function(itype, ititle, idelay){
        // if the toast not exist then create it, else reuse the toast
        if(!IUToast.isToastExist()){
            IUToast.appendHtml(document.getElementsByTagName('body')[0], toastTemplate);
        }
        document.getElementById(itype + 'IUToastFlag').style.display = 'block';
        document.getElementById('iutoast').style.display = 'block';
        document.getElementById('iutitle').innerHTML = ititle;
        if(idelay != null && idelay != '' && idelay != undefined){
            setTimeout(function () {
                document.getElementById(itype + 'IUToastFlag').style.display = 'none';
                document.getElementById('iutoast').style.display = 'none';
            }, idelay);
        }
    },

    isToastExist: function(){
        const toast = document.getElementById('iutoast');
        if(!toast){
            return false;
        }
        return true;
    },

    appendHtml: function(el, str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        while (div.children.length > 0) {
            el.appendChild(div.children[0]);
        }
    }

}

//test code
window.onload = function(){
    IUToast.runExample();
}