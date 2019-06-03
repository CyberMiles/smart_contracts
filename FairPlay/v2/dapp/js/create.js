const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
var webBrowser = new AppLink();
var abi = '';
var bin = '';

$(function () {
    window.lgb = lgb;
    webBrowser.openBrowser();
    // init the abi and bin
    getAbi();
    getBin();
    initLanguage();
    initLinkTb();
    initAddTags();


    $('.image-upload-wrap').bind('dragover', function () {
             $('.image-upload-wrap').addClass('image-dropping');
    });
    $('.image-upload-wrap').bind('dragleave', function () {
             $('.image-upload-wrap').removeClass('image-dropping');
    });
    // Data Picker Initialization
    // $('.datepicker').pickadate();
    $('#cutoff').datetimepicker({
        ignoreReadonly: true,
        defaultDate:moment().add(5, 'm'),
        minDate: moment().add(1, 'm'),
        icons: {
            time: 'far fa-clock',
            date: 'far fa-calendar',
            up: 'fas fa-arrow-up',
            down: 'fas fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'far fa-calendar-check-o',
            clear: 'far fa-trash',
            close: 'far fa-times'
        },
    });
});

// init language
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



function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

var initLinkTb = function(){
    

    var $TABLE = $('#purchase_table');

    $('.table-remove').click(function () {
    $(this).parents('tr').detach();
    });

    $(".add-purchase").click(()=>{
      $("#emptytip-platform").addClass("d-none")
      $("#emptytip-link").addClass("d-none")
      $("#invalid-url").addClass("d-none")
      
      if($("#purchase-platform").val()===""){
        $("#emptytip-platform").removeClass("d-none")
      }
      else if($("#purchase-link").val()===""){
        $("#emptytip-link").removeClass("d-none")

      }
      else if(!isUrlValid($("#purchase-link").val())){
        $("#invalid-url").removeClass("d-none")
      }
      else{
        var $clone = $TABLE.find('tr.d-none').clone(true).removeClass('d-none table-line');
        $clone.find('td:eq(0)').text($("#purchase-platform").val())
        $clone.find('td:eq(1)').text($("#purchase-link").val())
        $TABLE.find('table').append($clone);

          console.log($("#purchase-platform").val())
          console.log($("#purchase-link").val())
         $("#exampleModal").modal("hide")
         $("#purchase-platform").val("")
         $("#purchase-link").val("")
      }
    })
}

var initAddTags = () => {
    $(".add-tag").click(()=>{
        var newTag = $(".input-tag").val()
        if(newTag != "")
        {
            $(".tag-list").removeClass("d-none")
            $(".input-tag").val("")
            tagTemplate = $("li.tag-item.d-none").clone(true).removeClass("d-none")
            tagTemplate.find(".tag-txt").text(newTag)
            $(".tag-list").append(tagTemplate)
        }
        
    })

    $(".rm-tag").click(() => {
        var target = $( event.target );
        target.parents(".tag-item").detach()
    })
}

var getTags = () => {
    var tags = Array()
    $(".tag-txt").each(function(){
        tags.push($(this).text())
    })
    tags =  tags.slice(1)
    return tags
}

var create = function () {
    tip.loading(lgb["creating"] || "Creating contract ... This could take a few minutes!");
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error(lgb["error"] || "There is an error");
        } else {
            var userAddress = address.toString();
            var title = $('#title').val();
            var desc = $('#desc').val();

            //create the shopping_site and shopping_link
            i = 1;

            shopping_site = [];
            shopping_link = [];
            $('#purchase_table').each(function(){
                $(this).find('td').each(function(){
                    td_content = $(this).text()
                    if(i%3 == 1 ){
                        shopping_site.push(td_content)
                    }else if(i%3 == 2){
                        shopping_link.push(td_content)
                    }else if(i%3 == 0){

                    }
                    i++;
                })
            })

            //make the md of desc 
            //   `    #Description
            //          ddddfdfdf fdf dfdf
            //      
           
            desc_md = "##### Description" + "\n\n" 
            desc_md += desc + "\n\n"
            
            //Shopping Link (json of purchase_links)
            //purchase_links = "[{\"platform\":\" "+ platform +"\",\"link\":\"" + link + "\"},{\"platform\":\" "+ platform +"\",\"link\":\"" + link + "\"}]"
            shopping_json = ""
            var i;
            for(i = 0; i < shopping_site.length; i++){
                if(shopping_site[i] !== "" && shopping_link[i] !== ""){
                    shopping_json += "{\"platform\":\" "+ shopping_site[i] +"\",\"link\":\"" + shopping_link[i] + "\"},"
                }
            }
            if(shopping_json != "")
            {
                shopping_json = shopping_json.slice(0, -1)
                shopping_json = "[" + shopping_json + "]"
            }
            
            var image_url = $('#img').val();
            var num_of_winners = $('#num').val();
            var cutoff_ts = $('#cutoff').datetimepicker('date').unix();
            
            var contract = web3.cmt.contract(abi);
            //string _title, string _desc, string _image_url, 
            //uint256 _number_of_winners, uint _cutoff_ts, string _lang_code,
            //string _tags, string _purchase_links
            var lang_code = window.language;
            var tags = String(getTags());
            var purchase_links = shopping_json;

            var data = '0x' + contract.new.getData(title, desc_md, image_url, num_of_winners, cutoff_ts, lang_code, tags, purchase_links, {data: bin.object});

            contract.new([title, desc_md, image_url, num_of_winners, cutoff_ts, lang_code, tags, purchase_links], {
                from: userAddress.toString(),
                data: data,
                gas: '9999000',
                gasPrice: 2000000000
            }, function (e, instance) {
                if (e) {
                    console.log(e);
                    tip.close();
                    tip.error(lgb["fail_to_create"] || "Failed to create contract");
                } else {
                    filter = web3.cmt.filter("latest")
                    filter.watch(function(error, blockhash){
                        if (!error){
                            txhash = instamce.transactionHash
                            console.log(blockhash, txhash)
                            web3.cmt.getBlock(blockhash, function(e,r){
                                console.log(blockhash, txhash, r.transactions)
                                if(txhash.indexOf(r.transactions) != -1){
                                    filter.stopWatching()
                                    window.location.href = "qrcode.html?code=" + instance.address;
                                }
                            });
                        }
                    });

                    // console.log(instance.address);
                    // if (instance.address != undefined) {
                    //     window.location.href = "qrcode.html?code=" + instance.address;
                    // } else {
                    //     var checkTransactionTimer = setInterval(function () {
                    //         web3.cmt.getTransactionReceipt(instance.transactionHash, function (error, result) {
                    //             if (!error) {
                    //                 if (result != null && result.status == '0x1') {
                    //                     clearInterval(checkTransactionTimer);
                    //                     if (result.contractAddress != undefined) {
                    //                         window.location.href = "qrcode.html?code=" + result.contractAddress;
                    //                     } else if (result.address != undefined) {
                    //                         window.location.href = "qrcode.html?code=" + result.address;
                    //                     } else {
                    //                         tip.close();
                    //                         tip.error("Could not get a contract address");
                    //                     }
                    //                 } 
                    //                 // else if (result != null && result.status == '0x0') {
                    //                 //     tip.close();
                    //                 //     tip.error(lgb["fail_to_create"] || "Failed to create contract");
                    //                 //     clearInterval(checkTransactionTimer);
                    //                 // }
                    //             }
                    //         })
                    //     }, 3000);
                    // }
                }
            });
        }
    });
}

var getAbi = function () {
    $.ajax({
        url: 'FairPlay.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'FairPlay.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}

function imgfrom(imgsource){
    if(imgsource.id == "fromurl"){
        $("#url-input").removeClass("d-none");
        $("#local-input").addClass("d-none");
        $("#fromurl").addClass("btn-outline-fairplay-lightred");
        $("#fromlocal").removeClass("btn-outline-fairplay-lightred");
    }else if(imgsource.id == "fromlocal"){
        $("#url-input").addClass("d-none");
        $("#local-input").removeClass("d-none");
        $("#fromurl").removeClass("btn-outline-fairplay-lightred");
        $("#fromlocal").addClass("btn-outline-fairplay-lightred");
    }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $(".uploading-text").addClass("d-none");
  changeBoxCSS()
  $('.image-upload-wrap').show();
}

$('#img-form').ajaxForm({
    beforeSubmit: function(){
        var imgname = $("#selected-img").val()
        var ext = imgname.substr( (imgname.lastIndexOf('.') +1) );
        var imgsize = $('#selected-img')[0].files[0].size / 1024 / 1024; // in MB
        console.log(ext, imgsize)
        if (ext=='jpg' || ext=='jpeg' || ext=='png' || ext=='gif' || ext=='PNG' || ext=='JPG' || ext=='JPEG'){
            if(imgsize <= 5){
                $(".uploading-text").removeClass("d-none");
                $(".drag-text").addClass("d-none");

                return true;
            }
        }
        
        $("#local-input").removeClass("d-none");
        tip.error(lgb["fail_to_upload"] || "Fail to upload. Please check your size and extension.");
        return false;
    },
    success: function(data) {
        url = data['secure_url']

        $(".uploading-text").addClass("d-none");
        $(".drag-text").removeClass("d-none");

        $('.image-upload-wrap').hide();
        $("#uploaded").attr("src", url)
        $('.file-upload-content').show();
        $('.image-title').html($("#selected-img").val());

        $("#img").val(url)
    }
}); 


function uploadPic(){
    if($("#selected-img").val()){
        $(".image-upload-wrap").css("background-color","#888888")
        $(".image-upload-wrap").css('border','4px dashed #ffffff') 
        console.log("start")
        $("#submit").click()
    }
}

function changeBoxCSS(){
 $(".image-upload-wrap").css('background-color','#888888')
 $(".image-upload-wrap").css('border','4px dashed #ffffff') 
 $(".image-upload-wrap").css('transition','.5s')
  setTimeout(function() {
    $(".image-upload-wrap").css('background-color','transparent') 
    $(".image-upload-wrap").css('border','4px dashed #888888') 

  }, 500);
}