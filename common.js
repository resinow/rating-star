/**
 * Created by user on 2017/11/21.
 */
/*setCookie('_at', 'CUr6MkSTQwR-CwpQAwiMCZXQ==', '2018-2-10T05:19:04.000Z');

 var HOST_URL = judgeDomain(),
 UPLOAD_URL = 'https://upload-na0.qbox.me',
 ACCESS_TOKEN = getCookie('_at'),
 UPLOAD_CODE = '上传防伪码',

 STORE_ORDER_LIST = {},
 STORE_ORDER_LIST_PARAMS = {order_no: '', created_on: '', product_list: [], index: 0},
 STORE_PRODUCT_LIST = {},
 STORE_PRODUCT_LIST_PARAMS = {spec_list: [], index: 0},
 PRODUCT_LIST_PARAMS = {category_id: 0, keywords: '', order_by: 4, limit: 10, page: 1},
 PAGINATION_PARAMS = {currentPage: 1, total: 0},

 uploadInfo = {
 upload_token: '',
 domain: ''
 },
 orderInfo = {},
 pageStep = 0,
 resetProducts = false,     //false,新增商品；true,添加商品
 asParams = {
 purchase_channel: 0,
 purchase_order_no: '',
 purchase_store: '',
 purchase_receipt: '',
 purchase_time: '',
 content: '',
 video: '',
 email: '',
 tel: '',
 address_id: '',
 product_list: [],
 image_list: []
 },
 choosedAddress = '',
 imageList = [],
 addressList = [],
 pageElements = $('.as-detail'),
 stepElements = $('.as-step-item'),
 productContent = $('#productContent'),
 channelElement = $('#channel'),
 orderNoElement = $('#order_no'),
 storeElement = $('#store'),
 dateElement = $('#date'),
 contentElement = $('#content');

 Date.prototype.Format = function (fmt, local, utc) {
 var tempTime = this;
 var o = {};
 if (utc) {
 o = {
 "y+": tempTime.getUTCFullYear(),
 "M+": tempTime.getUTCMonth() + 1,                 //月份
 "d+": tempTime.getUTCDate(),                    //日
 "h+": tempTime.getUTCHours(),                   //小时
 "m+": tempTime.getUTCMinutes(),                 //分
 "s+": tempTime.getUTCSeconds(),                 //秒
 "q+": Math.floor((tempTime.getUTCMonth() + 3) / 3), //季度
 "S+": tempTime.getMilliseconds()             //毫秒
 };
 } else {
 o = {
 "y+": tempTime.getFullYear(),
 "M+": tempTime.getMonth() + 1,                 //月份
 "d+": tempTime.getDate(),                    //日
 "h+": tempTime.getHours(),                   //小时
 "m+": tempTime.getMinutes(),                 //分
 "s+": tempTime.getSeconds(),                 //秒
 "q+": Math.floor((tempTime.getMonth() + 3) / 3), //季度
 "S+": tempTime.getMilliseconds()             //毫秒
 };
 }

 for (var k in o) {
 if (new RegExp("(" + k + ")").test(fmt)) {
 if (k == "y+") {
 fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
 }
 else if (k == "S+") {
 var lens = RegExp.$1.length;
 lens = lens == 1 ? 3 : lens;
 fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
 }
 else {
 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 }
 }
 }
 if (local) {
 var timeOff = new Date().getTimezoneOffset() / 60;
 var sign = Math.sign(timeOff);
 var zone = (("00" + Math.abs(timeOff) + "00").substr(("" + Math.abs(timeOff)).length));
 zone = sign === -1 ? '+' + zone.toString() : '-' + zone.toString();
 fmt = fmt + ' ' + zone;
 }
 return fmt;
 };

 function getQiniuToken(successHandler) {
 if (getCookie('_ut')) {
 uploadInfo.upload_token = getCookie('_ut');
 uploadInfo.domain = getCookie('domain');
 successHandler && successHandler()
 } else {
 $.ajax({
 type: 'get',
 url: HOST_URL + 'api/upload/access_token',
 success: function (resp) {
 switch (resp.code) {
 case '1000000':
 var date = new Date();
 date.setTime(date.getTime() + (resp.data.expires - 300 * 1000));
 setCookie('_ut', resp.data.access_token, resp.data.expires);
 setCookie('domain', resp.data.domain, resp.data.expires);
 uploadInfo.upload_token = resp.data.access_token;
 uploadInfo.domain = resp.data.domain;
 successHandler && successHandler();
 break;
 default:
 // globalInfo.severError(resp);
 break;
 }
 },
 error: function (resp) {
 }
 });
 }
 }

 function initUpload(picker, accept, successHandler, index) {
 getQiniuToken(function () {
 var uploader = new WebUploader.create({
 swf: 'https://cdnjs.cloudflare.com/ajax/libs/webuploader/0.1.1/Uploader.swf',
 auto: true,
 server: UPLOAD_URL,
 pick: picker,
 // dnd: picker,
 // disableGlobalDnd: false,
 fileSingleSizeLimit: 100 * 1024 * 1024,
 resize: false,
 compress: false,
 formData: {key: '', token: uploadInfo.upload_token},
 duplicate: true,
 accept: accept
 });
 /!* 当有文件被添加进队列的时候*!/
 uploader.on('fileQueued', function (file) {
 //          uploader.removeFile(file, true); //停止上传
 $(picker).siblings('.img-loader').removeClass('hide');
 uploader.options.formData.key = 'www/files/' + Date.now() + '_smok_' + file.name;
 // globalInfo.appLoadIn();
 });
 uploader.on('uploadProgress', function (file, percentage) {
 //            me.editor.showUploadProgress(percentage);
 });

 uploader.on('uploadSuccess', function (file, resp) {
 toastInfo('Upload Success.');
 $(picker).siblings('.img-loader').addClass('hide');

 var url = uploadInfo.domain + '/' + resp.key;
 // globalInfo.appLoadOut();
 successHandler && successHandler(url, index);
 if (index || index === 0) {
 initImgAction(picker, url, index);
 }
 });

 uploader.on('uploadError', function (file, reason) {
 toastInfo('Upload failed, please try again.');
 $(picker).siblings('.img-loader').addClass('hide');
 deleteCookie('_ut');
 getQiniuToken();
 });
 $('.webuploader-pick').css('background', 'transparent');
 })
 }

 function initImgAction(picker, url, index) {
 $(picker).css('backgroundImage', 'url(' + url + ')');
 $(picker).find('.icon-shangchuantupian5').addClass('opacity');
 $(picker).siblings('.icon-cuo2').removeClass('hide');
 $(picker).siblings('.icon-cuo2').click(function () {
 imageList[index] = '';
 $(picker).css('backgroundImage', 'url("")');
 $(picker).siblings('.icon-cuo2').addClass('hide');
 $(picker).find('.icon-shangchuantupian5').removeClass('opacity');
 saveAsParams();
 });
 }

 function uploadImg() {
 for (var i = 1; i < 6; i++) {
 var picker = '#imgUpload' + i,
 n = i - 1;
 if (!$(picker).find('.webuploader-pick').length) {
 imageList = asParams.image_list;
 imageList.length = 5;
 if (imageList[n]) {
 initImgAction(picker, imageList[n], n);
 }

 initUpload(picker, {
 title: 'Images',
 extension: 'gif,jpg,png,jpeg,bmp',
 mimeTypes: 'image/!*'
 }, function (url, index) {
 imageList[index] = url;
 createHint($('.as-upload-text'), '');
 asParams.image_list = imageList;
 saveAsParams();
 }, n);
 }
 }
 }

 function uploadVideo() {
 var picker = '#videoUpload';
 if (!$(picker).find('.webuploader-pick').length) {
 initUpload(picker, {
 title: 'Videos',
 extension: 'webm,ogg,mp4,avi,movie,wmv,mov,flv,ts,f4v,rmvb,3gp,mkv',
 mimeTypes: 'video/!*'
 }, function (url) {
 asParams.video = url;
 createHint($('.as-upload-text'), '');
 var name = asParams.video.split('_smok_').splice(-1);
 if (name) {
 $(picker).find('.icon-shangchuanshipin1').after('' +
 '<span class="icon-bg-text"><span class="iconfont icon-video"></span><span class="video-name">' + name + '</span></span>');
 $(picker).find('.icon-shangchuanshipin1').hide();
 }
 $(picker).find('.icon-shangchuanshipin1').hide();
 $(picker).siblings('.icon-cuo2').removeClass('hide');
 $(picker).siblings('.icon-cuo2').click(function () {
 asParams.video = '';
 $(picker).find('.icon-bg-text').remove();
 $(picker).siblings('.icon-cuo2').addClass('hide');
 $(picker).find('.icon-shangchuanshipin1').show();
 saveAsParams();
 });
 saveAsParams();
 });
 if (asParams.video) {
 var name = asParams.video.split('_smok_').splice(-1);
 if (name) {
 $(picker).find('.icon-shangchuanshipin1').after('' +
 '<span class="icon-bg-text"><span class="iconfont icon-video"></span><span class="video-name">' + name + '</span></span>');
 $(picker).find('.icon-shangchuanshipin1').hide();
 }
 $(picker).find('.icon-shangchuanshipin1').hide();
 $(picker).siblings('.icon-cuo2').removeClass('hide');
 $(picker).siblings('.icon-cuo2').click(function () {
 asParams.video = '';
 $(picker).find('.icon-bg-text').remove();
 $(picker).siblings('.icon-cuo2').addClass('hide');
 $(picker).find('.icon-shangchuanshipin1').show();
 saveAsParams();
 });
 }
 }
 }

 function uploadCode(picker) {
 if (!$(picker).find('.webuploader-pick').length) {
 initUpload(picker, {
 title: 'Images',
 extension: 'gif,jpg,png,jpeg,bmp,bat,svg',
 mimeTypes: 'image/!*'
 }, function (url) {
 // asParams.image = url;
 var n = $('.btn-upload-wrap .btn-upload').index($(picker));
 asParams.product_list[n].image = url;
 createHint($('.btn-upload-wrap').eq(n), '');

 var name = url.split('_smok_').splice(-1);
 if (name) {
 $(picker).find('.webuploader-pick').text(name);
 }
 $('.icon-cuo2').eq(n).show();
 });
 }
 }

 function uploadInvoice() {
 if (!$('#invoiceUpload').find('.webuploader-pick').length) {
 initUpload('#invoiceUpload', {
 title: 'Images',
 extension: 'gif,jpg,png,jpeg,bmp,bat,svg',
 mimeTypes: 'image/!*'
 }, function (url) {
 asParams.purchase_receipt = url;
 createHint($('#invoiceUpload'), '');

 var name = url.split('_smok_').splice(-1);
 if (name) {
 $('#invoiceUpload').find('.webuploader-pick').text(name);
 }
 });
 }
 }

 function changeProduct(index) {
 var picker = '#delProduct' + index,
 codePicker = '#delCode' + index,
 countPicker = '#productCount' + index;

 $(picker).click(function () {
 if ($('.as-product-item').length > 1) {
 var tempElement = $(this).parents('.as-product-item'),
 n = $('.as-product-item').index(tempElement);
 asParams.product_list.splice(n, 1);
 saveAsParams();
 tempElement.remove();
 }
 });

 $(codePicker).click(function () {
 var n = $('.btn-upload-wrap .icon-cuo2').index($(this));
 $(this).hide().prev('.btn-upload').find('.webuploader-pick').text(UPLOAD_CODE);
 asParams.product_list[n].image = '';
 });

 $(countPicker).bind('input', function () {
 var n = $('.as-product-count').index(this),
 value = $(this).val(),
 picker = $(this).siblings('.btn-upload-wrap'),
 confirm = initInputVerify('count', $(this), picker);
 if (confirm) {
 asParams.product_list[n].quantity = value;
 } else {
 asParams.product_list[n].quantity = 0;
 }
 })
 }

 function createProduct(data, index) {
 var picker = '#codeUpload' + index,
 product = '<div class="as-product-item">' +
 '<div class="as-product-name">' +
 '<input type="text" placeholder="Product Name" value="' + data.name + '" disabled>' +
 '<span id="delProduct' + index + '" class="as-product-del iconfont icon-cuo1"></span>' +
 '</div><span class="as-product-text">X</span><input class="as-product-count" id="productCount' + index + '" type="number" value="' + data.quantity + '"><span' +
 ' class="as-product-text">件</span>' +
 '<div class="btn-upload-wrap"><span class="btn-upload btn-sm btn-default" id="codeUpload' + index + '">' + UPLOAD_CODE + '</span><span' +
 ' id="delCode' + index + '" class="as-product-del iconfont icon-cuo2"></span></div></div>';
 productContent.append(product);
 uploadCode(picker);
 changeProduct(index);
 if (asParams.purchase_channel == 1001) {
 $('#productCount' + index).attr('disabled', 'disabled');
 }
 if (data.image) {
 var name = data.image.split('_smok_').splice(-1);
 if (name) {
 $(picker).find('.webuploader-pick').text(name);
 }
 }
 }

 function saveAsParams() {
 if (dateElement.val()) {
 asParams.purchase_time = dateElement.val()
 }
 if (storeElement.val()) {
 asParams.purchase_store = storeElement.val()
 }
 if (contentElement.val()) {
 asParams.content = contentElement.val()
 }
 asParams.purchase_channel = parseInt(asParams.purchase_channel);
 setCookie('_ap', JSON.stringify(asParams));
 console.log('save', asParams);
 if (resetProducts) {
 setCookie('_rp', resetProducts);
 }
 }

 function getAddressList() {
 switchItemDisplay('show', 'loader-overlay');
 $.ajax({
 type: 'get',
 url: HOST_URL + 'api/customer/addresses',
 headers: {
 'Authorization': ACCESS_TOKEN
 },
 dataType: 'json',
 traditional: true,
 success: function (resp) {
 switchItemDisplay('hide', 'loader-overlay');
 addressList = resp.data;
 $('.as-address-item').remove();
 for (var n in addressList) {
 var index = parseInt(n) + 1;
 createAddress(addressList[n], index)
 }
 },
 error: function (resp) {
 switchItemDisplay('hide', 'loader-overlay');
 }
 })
 }

 function chooseAddress(picker, data) {
 $('.as-address-item').removeClass('address-default');
 $(picker).addClass('address-default');
 choosedAddress = data;
 asParams.address_id = data.id;
 asParams.email = data.email;
 asParams.tel = data.tel;
 }

 function changeAddress(id, address) {
 $('#' + id).click(function () {
 chooseAddress(this, address);
 })
 }

 function createAddress(data, index) {
 var addressId = 'address' + data.id,
 picker = '#' + addressId,
 addressContent = data.address2 ? data.address2 + ', ' + data.address1 : data.address1,
 address = '<div class="as-address-item" id="' + addressId + '">' +
 '<h2 class="as-address-title">Address' + index + '</h2>' +
 '<h3>' + data.first_name + ' ' + data.last_name +
 '<span class="as-address-edit">' +
 // '<span>Default</span>' +
 // '<span>Edit</span>' +
 '</span>' +
 '</h3>' +
 '<p class="as-address-info">' +
 '<span class="as-address-text">Tel:' + data.tel + '</span>' +
 '<span class="as-address-text">Postcode:0000000</span>' +
 '</p>' +
 '<p class="as-address-info">Add: ' + addressContent + '</p>' +
 '<p class="as-address-info">City: ' + data.city + '</p>' +
 '<p class="as-address-info">Province: ' + data.province + '</p>' +
 '<p class="as-address-info">Country: ' + data.country + '</p>' +
 '</div>';
 $('.as-address-add').before(address);

 if (asParams.address_id === data.id) {
 chooseAddress(picker, data);
 } else if (data.is_default && !asParams.address_id) {
 chooseAddress(picker, data);
 }
 changeAddress(addressId, data);
 }

 function checkPageData() {
 switch (pageStep) {
 case 0:
 if (asParams.purchase_channel == 1001 && !initInputVerify('purchase_order_no', orderNoElement)) {
 return false
 } else if (asParams.purchase_channel != 1001) {
 if (!initInputVerify('purchase_store', storeElement)) {
 return false
 }
 if (!asParams.purchase_receipt) {
 createHint($('#invoiceUpload'), 'Please upload receipt');
 return false
 } else {
 createHint($('#invoiceUpload'), '');
 }
 }
 if (!initInputVerify('purchase_channel', channelElement) || !initInputVerify('purchase_time', dateElement)) {
 return false
 }
 for (var n in asParams.product_list) {
 var item = asParams.product_list[n];
 if (!item.name || !item.quantity || isNaN(item.quantity)) {
 createHint($('.btn-upload-wrap').eq(n), 'Product data error');
 return false
 } else if (!item.image) {
 createHint($('.btn-upload-wrap').eq(n), 'Please upload anti-fake code');
 return false
 } else {
 createHint($('.btn-upload-wrap').eq(n), '');
 }
 }
 break;
 case 1:
 if (!initInputVerify('content', contentElement)) {
 return false
 }
 var file = asParams.video;
 if (imageList) {
 for (var n in imageList) {
 if (imageList[n]) {
 file = imageList[n];
 }
 }
 }
 if (!file) {
 createHint($('.as-upload-text'), 'Please upload attachment');
 return false
 } else {
 createHint($('.as-upload-text'), '');
 }
 break;
 case 2:
 if (!asParams.address_id) {
 toastInfo('Please choose address');
 return false
 }
 break;
 default:
 break;
 }
 return true
 }

 function initPage() {
 if (getCookie('_ap') && !getCookie('_ol')) {
 asParams = JSON.parse(getCookie('_ap'));
 if (asParams.purchase_store) {
 storeElement.val(asParams.purchase_store);
 }
 if (asParams.purchase_time) {
 dateElement.val(asParams.purchase_time);
 }
 if (asParams.content) {
 contentElement.val(asParams.content);
 }
 }
 if (getCookie('_rp')) {
 resetProducts = getCookie('_rp')
 }
 // resetProducts = getCookie('_rp') ? getCookie('_rp') : resetProducts;
 if (getCookie('_ol') || asParams.purchase_channel == 1001) {
 if (getCookie('_ol')) {
 var _ol = JSON.stringify(getCookie('_ol'));
 orderInfo = JSON.parse(JSON.parse(_ol));
 asParams.product_list = [];
 asParams.purchase_time = new Date(orderInfo.created_on).Format('yyyy-MM-dd');
 asParams.purchase_order_no = orderInfo.order_no;
 if (orderInfo.product_list) {
 for (var n in orderInfo.product_list) {
 asParams.product_list.push(orderInfo.product_list[n]);
 }
 }
 deleteCookie('_ol')
 }
 asParams.purchase_channel = 1001;

 for (var n in asParams.product_list) {
 createProduct(asParams.product_list[n], n)
 }
 $('.as-smok').removeClass('hide');
 $('.as-other').addClass('hide');
 orderNoElement.val(asParams.purchase_order_no);
 dateElement.val(asParams.purchase_time).attr('disabled', 'disabled');
 } else if (getCookie('_pl') || asParams.purchase_channel == 1002 || asParams.purchase_channel == 1003) {
 uploadInvoice();
 $('#addProductItem').click(function () {
 resetProducts = true;
 saveAsParams();
 window.location.href = './product-list.html'
 });
 if (getCookie('_pl')) {
 var _pl = JSON.stringify(getCookie('_pl'));
 var productList = JSON.parse(JSON.parse(_pl)).spec_list;
 if (resetProducts) {
 asParams.product_list = asParams.product_list.concat(productList);
 } else {
 asParams.product_list = productList
 }
 deleteCookie('_pl');
 }

 for (var i in asParams.product_list) {
 createProduct(asParams.product_list[i], i);
 }
 // deleteCookie('_ap');
 $('.as-smok').addClass('hide');
 $('.as-other').removeClass('hide');
 dateElement[0].removeAttribute('disabled');

 if (getCookie('_ct')) {
 asParams.purchase_channel = 1003;
 asParams.purchase_store = 'SMOK 天猫旗舰店';
 storeElement.val(asParams.purchase_store);
 $('.as-tm').addClass('hide');
 } else {
 asParams.purchase_channel = 1002;
 }
 if (asParams.purchase_receipt) {
 var name = asParams.purchase_receipt.split('_smok_').splice(-1);
 $('#invoiceUpload').find('.webuploader-pick').text(name);
 }
 } else {
 window.location.href = './';
 return
 }
 channelElement.val(asParams.purchase_channel);
 contentElement.val(asParams.content);
 checkInput();
 pageChange();
 }

 function pageChange(type) {
 switch (type) {
 case 1:
 if (!checkPageData()) {
 return
 }

 if (pageStep > -1 && pageStep < 4) {
 if (pageStep === 0) {
 if (!asParams.product_list || asParams.product_list.length === 0) {

 }
 }
 // checkInput(1);
 pageStep++;
 } else {
 return
 }
 break;
 case -1:
 if (pageStep > 0 && pageStep < 4) {
 pageStep--;
 } else if (pageStep === 0) {
 resetProducts = false;
 switch (asParams.purchase_channel) {
 case 1001:
 saveAsParams();
 // window.location.href = './order-list.html';
 history.go(-1);
 break;
 default:
 saveAsParams();
 // window.location.href = './product-list.html';
 history.go(-1);
 break;
 }
 return;
 } else {
 return
 }
 break;
 default:
 break;
 }
 pageElements.addClass('hide');
 stepElements.removeClass('pass');
 pageElements.eq(pageStep).removeClass('hide');
 for (var i = 0; i <= pageStep; i++) {
 stepElements.eq(i).addClass('pass pc-display');
 }
 $('.pass').last().removeClass('pc-display');
 // if (pageStep === 0) {
 //   // checkChannel();
 // }
 if (pageStep === 1) {
 uploadVideo();
 uploadImg();
 }
 if (pageStep === 2) {
 getAddressList();
 }
 if (pageStep === 3) {
 checkSubmitData();
 $('#btnNext').addClass('hide');
 $('#btnSubmit').removeClass('hide');
 } else {
 $('#btnNext').removeClass('hide');
 $('#btnSubmit').addClass('hide');
 }
 if (pageStep === 4) {
 $('.as-steps').hide();
 $('.btn-row').hide();
 $('.as-frame-header').hide();
 }
 resetProducts = false;
 saveAsParams();
 window.scrollTo(0, 60);
 }

 function checkValue(type, data) {
 var reg;
 switch (type) {
 // case 'purchase_store':
 //   reg = /^[a-z][a-z0-9_]+$/g;
 //   return reg.test(data);
 //   break;
 case 'first_name':
 reg = /^[a-zA-Z][a-zA-Z0-9_]+$/g;
 return reg.test(data);
 break;
 case 'last_name':
 reg = /^[a-zA-Z][a-zA-Z0-9_]+$/g;
 return reg.test(data);
 break;
 case 'tel':
 reg = /^[-.()+0-9]*$/g;
 return reg.test(data);
 break;
 case 'email':
 reg = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,10}){1,2})$/g;
 return reg.test(data);
 break;
 case 'purchase_time':
 reg = new Date().getTime();
 var time = new Date(data).getTime();
 console.log(time, reg);
 if (time > reg) {
 return false;
 } else return true;
 break;
 default:
 return true;
 break;
 }
 }

 function checkInput() {
 if (typeof String.prototype.trim !== 'function') {
 String.prototype.trim = function () {
 return this.replace(/^\s+|\s+$/g, '');
 };
 }
 channelElement.bind('input', function () {
 initInputVerify('purchase_channel', channelElement);
 });
 if (asParams.purchase_channel == 1001) {
 orderNoElement.bind('input', function () {
 initInputVerify('purchase_order_no', orderNoElement);
 });
 } else if (asParams.purchase_channel == 1002) {
 storeElement.bind('input', function () {
 initInputVerify('purchase_store', storeElement);
 });
 }
 dateElement.bind('input', function () {
 initInputVerify('purchase_time', dateElement);
 });
 contentElement.bind('input', function () {
 initInputVerify('content', contentElement);
 })
 }

 function createHint(hintArea, hint) {
 console.log(33, hintArea, hint);
 if (hintArea.next('p.input-hint').length > 0) {
 hintArea.next('p.input-hint').text(hint)
 } else {
 var html = '<p class="input-hint red">' + hint + '</p>';
 hintArea.after(html)
 }
 }

 function initInputVerify(type, target, picker) {
 var errorMsg = {
 'purchase_channel': {
 'required': '*Please choose channel'
 },
 'purchase_order_no': {
 'required': '*Please choose order',
 },
 'purchase_store': {
 'required': '*Please enter store name'
 // 'pattern': '*Please enter valid store name'
 },
 'purchase_time': {
 'required': '*Please enter time',
 'pattern': '*Please enter valid time'
 },
 'content': {
 'required': '*Please enter description'
 },
 'count': {
 'required': '*Please enter product quantity'
 }
 };
 var text = target.val().trim(),
 hint = '',
 hintArea = picker ? picker : target;

 if (!text || (type === 'count' && parseInt(text) === 0)) {
 hint = errorMsg[type].required;
 } else if (!checkValue(type, text)) {
 hint = errorMsg[type].pattern;
 }
 createHint(hintArea, hint);
 if (hint) {
 target.addClass('border-red');
 if (!picker) {
 asParams[type] = '';
 }
 return false;
 } else {
 target.removeClass('border-red');
 if (!picker) {
 asParams[type] = text;
 }
 return true
 }
 }

 function checkSubmitData() {
 asParams.purchase_store = storeElement.val();
 asParams.purchase_time = dateElement.val();
 asParams.content = contentElement.val();

 var images = $.grep(imageList, function (n) {
 return $.trim(n).length > 0;
 });

 // asParams.image_list = JSON.stringify(images);
 asParams.image_list = images;

 var addressContent = choosedAddress.address2 ? choosedAddress.address2 + ', ' + choosedAddress.address1 : choosedAddress.address1,
 productContent = '', imagesContent = '';
 for (var n in asParams.product_list) {
 var item = asParams.product_list[n];
 productContent += '<p class="as-ensure-product">' + item.name + ' * ' + item.quantity + ' 件</p>';
 }
 if (asParams.video) {
 var name = asParams.video.split('_smok_').splice(-1);
 if (name) {
 imagesContent = '<div class="as-upload">' +
 '<span class="icon-bg-text">' +
 '<span class="iconfont icon-video"></span>' +
 '<span class="video-name">' + name + '</span>' +
 '</span>' +
 '</div>';
 }
 }
 for (var i in asParams.image_list) {
 var data = asParams.image_list[i];
 imagesContent += '<div class="as-upload"><img class="as-description-image" src="' + data + '" alt=""></div>';
 // '<p class="as-ensure-product">' + data.name + ' * ' + data.quantity + '件</p>'
 }

 // $('.as-ensure').html(asContent);
 if (asParams.purchase_channel == 1001) {
 $('.ap_store').parents('.as-detail-item').addClass('hide');
 $('.ap_order_no').html('<span>' + asParams.purchase_order_no + '</span>');
 } else {
 $('.ap_order_no').parents('.as-detail-item').addClass('hide');
 $('.ap_store').html('<span>' + asParams.purchase_store + '</span>');
 }
 $('.ap_time').html('<span>' + asParams.purchase_time + '</span>');
 $('.ap_products').html(productContent);
 $('.ap_content').html('<span>' + asParams.content + '</span>');
 $('.ap_images').html(imagesContent);
 $('.ap_contact').html('<span>' + choosedAddress.first_name + ' ' + choosedAddress.last_name + '</span>');
 $('.ap_email').html('<span>' + asParams.email + '</span>');
 $('.ap_tel').html('<span>' + asParams.tel + '</span>');
 $('.ap_country').html('<span>' + choosedAddress.country + '</span>');
 $('.ap_province').html('<span>' + choosedAddress.province + '</span>');
 $('.ap_city').html('<span>' + choosedAddress.city + '</span>');
 $('.ap_postcode').html('<span>' + choosedAddress.postcode + '</span>');
 $('.ap_address').html('<span>' + addressContent + '</span>');
 }

 function submitAfterSales() {
 asParams.product_list = JSON.stringify(asParams.product_list);
 console.log('submit', asParams);

 switchItemDisplay('show', 'loader-overlay');
 $.ajax({
 type: 'post',
 url: HOST_URL + 'api/after_sales',
 headers: {
 'Authorization': ACCESS_TOKEN
 },
 data: asParams,
 traditional: true,
 dataType: 'json',
 success: function (resp) {
 switchItemDisplay('hide', 'loader-overlay');
 switch (resp.code) {
 case '1000000':
 pageChange(1);
 cleanCookie();
 // window.location.href = './'
 break;
 default:
 toastInfo('error');
 break;
 }
 },
 error: function (resp) {
 toastInfo('error');
 switchItemDisplay('hide', 'loader-overlay');
 }
 })
 }

 $('#btnNext').click(function () {
 pageChange(1);
 });

 $('#btnPrev').click(function () {
 pageChange(-1);
 });

 $('#btnSubmit').click(function () {
 submitAfterSales()
 });

 $('#channelChooseBtn').click(function () {
 setCookie('_ct', 1003)
 });

 //-----------------------------------------------------------------------------------------------//
 //Order List
 function getOrderList() {
 if (getCookie('_ol')) {
 deleteCookie('_ol');
 }
 var dataUrl = HOST_URL + 'api/order_basic_list';
 var params = {
 with_product: true,
 limit: 100,
 page: 1
 };
 $.ajax({
 type: 'GET',
 url: dataUrl,
 headers: {
 'Authorization': ACCESS_TOKEN
 },
 data: params,
 dataType: 'json',
 success: function (resp) {
 if (resp.data.list) {
 STORE_ORDER_LIST = resp.data.list;
 createOrderList(STORE_ORDER_LIST);
 STORE_ORDER_LIST_PARAMS.order_no = STORE_ORDER_LIST[0].order_no;
 STORE_ORDER_LIST_PARAMS.created_on = STORE_ORDER_LIST[0].created_on;
 STORE_ORDER_LIST_PARAMS.product_list = {};
 } else {
 var item = '<div class="list-null">No Content</div>';
 STORE_ORDER_LIST = {};
 STORE_ORDER_LIST_PARAMS = {order_no: '', created_on: '', product_list: [], index: 0};
 $('.list-items').html(item);
 }
 },
 error: function (resp) {
 console.log('Oh no! Error')
 }
 });
 }

 function createOrderList(list) {
 var items = $('.list-items'), htmlText = '';
 for (var i in list) {
 var a = list[i], o_number = '订单号 : ' + a.order_no, o_contact = '联系人 : ' + a.first_name + ' ' + a.last_name,
 o_time = '购买时间 : ' + new Date(a.created_on).Format('yyyy-MM-dd'), product = '';
 for (var j in a.product_list) {
 var b = a.product_list[j], i_img = b.image, i_name = b.name, i_spec = '', i_total = b.quantity;
 for (var k in b.specs) {
 i_spec += b.specs[k].name + ' : ' + b.specs[k].value;
 }
 product +=
 '<div class="item-detail">' +
 '<label class="check-box"><input type="checkbox" name="check-box"/></label>' +
 '<span class="item-show">' +
 '<img class="pic" src=' + i_img + ' />' +
 '<span class="item-intro">' +
 '<span class="item-name">' + i_name + '</span>' +
 '<span class="item-spec">' + i_spec + '</span>' +
 '<span class="item-mobile-total">Amount : ' + i_total + '</span></span></span>' +
 '<span class="item-total">' + i_total + '</span>' +
 '<span class="item-operation">' +
 '<span class="operation-panel">' +
 '<span class="iconfont icon-minus">-</span>' +
 '<label><input class="count-input" type="number" value="0"/></label>' +
 '<span class="iconfont icon-add">+</span>' +
 '</span></span></span></div>';
 }
 htmlText +=
 '<div class="list-item">' +
 '<div class="item-header">' +
 '<span class="order-number">' + o_number + '</span>' +
 '<span class="order-contact">' + o_contact + '</span>' +
 '<span class="order-time">' + o_time + '</span>' +
 '</div>' + '<div class="item-container">' + product + '</div></div>';
 }
 items.html(htmlText);
 bindOrderListClick(list.length)
 }

 function bindOrderListClick(length) {
 var item = $('.list-items .list-item');
 item.eq(0).addClass('show');
 $('.btn-confirm').click(function () {
 storeOrderListParams(item);
 });
 $('.btn-cancel').click(function () {
 window.location.href = './index.html';
 });
 for (var i = 0; i < length; i++) {
 !function (i) {
 var current = item.eq(i);
 current.find('.item-header').click(function () {
 toggleListItem(item, current, length, i, 'order');
 });
 setOrderListValueChange(item, i);
 }(i);
 }
 }

 function setOrderListValueChange(items, index) {
 var item = items.eq(index);
 item.find('.item-detail').each(function () {
 var maxValue = $(this).find('.item-total').html(), input = $(this).find('.count-input'),
 check = $(this).find('input[name="check-box"]'), result = 0;
 bindChangeValueEvent(this, maxValue, input, check, result);
 });
 }

 function bindChangeValueEvent(target, maxValue, input, check, result) {
 check.change(function () {
 if (this.checked) {
 $(target).addClass('pick');
 setValue(input, 1);
 } else {
 $(target).removeClass('pick');
 setValue(input, 0);
 }
 });
 $(target).find('.icon-add').click(function () {
 result = calculateQuantity(+1, input.val(), maxValue);
 check.prop("checked", true);
 $(target).addClass('pick');
 setValue(input, result);
 });
 $(target).find('.count-input').blur(function () {
 result = calculateQuantity(0, input.val(), maxValue);
 if (result !== 0) {
 check.prop("checked", true);
 $(target).addClass('pick');
 } else {
 check.prop("checked", false);
 $(target).removeClass('pick');
 }
 setValue(input, result);
 });
 $(target).find('.icon-minus').click(function () {
 result = calculateQuantity(-1, input.val(), maxValue);
 if (result !== 0) {
 check.prop("checked", true);
 $(target).addClass('pick');
 } else {
 check.prop("checked", false);
 $(target).removeClass('pick');
 }
 setValue(input, result);
 });
 }

 function toggleListItem(item, target, length, index, type) {
 if (!target.hasClass('show')) {
 for (var i = 0; i < length; i++) {
 item.eq(i).removeClass('show');
 }
 target.addClass('show');
 if (type === 'order') {
 updateOrderListParams(index);
 } else if (type === 'product') {
 updateProductListParams(index)
 }
 } else {
 target.removeClass('show');
 }
 }

 function calculateQuantity(type, inputValue, maxStock) {
 inputValue = parseInt(inputValue);
 if (isNaN(inputValue)) {
 inputValue = 1;
 }
 maxStock = parseInt(maxStock);
 if (type === 0) {
 } else {
 inputValue += type;
 }
 inputValue = Math.max(inputValue, 0);
 inputValue = Math.min(inputValue, maxStock);
 return inputValue;
 }

 function setValue(target, value) {
 target.val(value);
 }

 function updateOrderListParams(index) {
 STORE_ORDER_LIST_PARAMS.order_no = STORE_ORDER_LIST[index].order_no;
 STORE_ORDER_LIST_PARAMS.created_on = STORE_ORDER_LIST[index].created_on;
 STORE_ORDER_LIST_PARAMS.product_list = {};
 STORE_ORDER_LIST_PARAMS.index = index;
 }

 function storeOrderListParams(items) {
 var index = STORE_ORDER_LIST_PARAMS.index;
 calculateOrderListParams(items, index);
 if (STORE_ORDER_LIST_PARAMS.product_list.length > 0) {
 setCookie('_ol', JSON.stringify(STORE_ORDER_LIST_PARAMS), 60 * 60);
 console.log(STORE_ORDER_LIST_PARAMS);
 window.location.href = './after-sales.html'
 } else {
 if (getCookie('_rp')) {
 window.location.href = './after-sales.html'
 } else {
 toastInfo('Please choose One');
 }
 }
 }

 function calculateOrderListParams(items, index) {
 var item = items.eq(index),
 listArray = [];
 item.find('input[name="check-box"]').each(function (i) {
 if ($(this).is(':checked')) {
 var targetItem = STORE_ORDER_LIST[index].product_list[i],
 currentRow = item.find('.item-detail').eq(i), quantity = currentRow.find('.count-input').val();
 if (quantity > 0) {
 listArray.push({
 name: targetItem.name + '-' + targetItem.specs[0].value,
 name_alias: targetItem.name_alias + '-' + targetItem.specs[0].value_alias,
 sku: targetItem.sku,
 quantity: quantity
 });
 }
 }
 });
 STORE_ORDER_LIST_PARAMS.product_list = listArray;
 }

 //Product List
 function initProductList() {
 getCategoriesList();
 getProductList();
 $('.btn-confirm').click(function () {
 storeProductListParams();
 });
 $('.btn-cancel').click(function () {
 getCookie('_rp') ? window.location.href = './after-sales.html' : window.location.href = './';
 });
 }
 function getCategoriesList() {
 var list = [], all = [{
 alias: '全部',
 id: 0,
 name: 'All',
 parent_id: 0,
 position: 121,
 status: 1
 }];
 if (sessionStorage.getItem('categoryList')) {
 list = JSON.parse(sessionStorage.getItem('categoryList'));
 list = all.concat(list);
 createCategoriesList(list);
 } else {
 var dataUrl = HOST_URL + 'api/product/categories';
 $.ajax({
 type: 'GET',
 url: dataUrl,
 headers: {
 'Authorization': ACCESS_TOKEN
 },
 dataType: 'json',
 success: function (resp) {
 if (resp.data) {
 sessionStorage.setItem('categoryList', JSON.stringify(resp.data));
 list = all.concat(resp.data);
 createCategoriesList(list);
 }
 },
 error: function (resp) {
 console.log('Oh no! Error')
 }
 });
 }
 }

 function createCategoriesList(list) {
 var categories = $('.list-category');
 for (var i in list) {
 var a = list[i], c_name = a.name, c_id = a.id;
 var category = '<span class="category-item" id=' + c_id + '>' + c_name + '</span>';
 categories.append(category);
 }
 bindCategoryListClick(list.length);
 }

 function bindCategoryListClick(length) {
 var item = $('.list-category .category-item');
 item.eq(0).addClass('choose');
 for (var i = 0; i < length; i++) {
 !function (i) {
 var current = item.eq(i), current_id = item.eq(i).attr('id');
 current.click(function () {
 for (var j = 0; j < length; j++) {
 item.eq(j).removeClass('choose');
 }
 current.addClass('choose');
 chooseGetMethod('category', current_id);
 });
 }(i);
 }
 bindSearchInput()
 }

 function bindSearchInput() {
 if (typeof String.prototype.trim !== 'function') {
 String.prototype.trim = function () {
 return this.replace(/^\s+|\s+$/g, '');
 };
 }
 if (document.all) {
 $('input').each(function () {
 var that = this;
 if (this.attachEvent) {
 this.attachEvent('onpropertychange', function (e) {
 if (e.propertyName != 'value') return;
 $(that).trigger('input');
 });
 }
 });
 }
 var inputFrame = $('.list-input .search-option-input'), searchIcon = $('.list-input .icon-sousuo');
 inputFrame.keypress(function (event) {
 var keycode = (event.keyCode ? event.keyCode : event.which);
 var inputValue = inputFrame.val().trim();
 if (keycode == '13') {
 chooseGetMethod('keywords', inputValue);
 }
 });
 searchIcon.click(function () {
 var inputValue = inputFrame.val().trim();
 chooseGetMethod('keywords', inputValue);
 });
 }

 function chooseGetMethod(type, data) {
 switch (type) {
 case 'category':
 PRODUCT_LIST_PARAMS.category_id = data;
 break;
 case 'keywords':
 PRODUCT_LIST_PARAMS.keywords = data;
 break;
 case 'page-number':
 PRODUCT_LIST_PARAMS.page = data;
 break;
 case 'page-button':
 var a = Math.min(PAGINATION_PARAMS.currentPage + data, PAGINATION_PARAMS.total);
 PAGINATION_PARAMS.currentPage = Math.max(a, 1);
 PRODUCT_LIST_PARAMS.page = PAGINATION_PARAMS.currentPage;
 break;
 default:
 break;
 }
 getProductList(PRODUCT_LIST_PARAMS);
 }

 function getProductList() {
 var dataUrl = HOST_URL + 'api/product_basic_list';
 $.ajax({
 type: 'GET',
 url: dataUrl,
 headers: {
 'Authorization': ACCESS_TOKEN
 },
 data: PRODUCT_LIST_PARAMS,
 dataType: 'json',
 success: function (resp) {
 if (resp.data.list) {
 STORE_PRODUCT_LIST = resp.data.list;
 STORE_PRODUCT_LIST_PARAMS.spec_list = {};
 createProductList(STORE_PRODUCT_LIST);
 calculatePagination(resp.data.page, resp.data.total, PRODUCT_LIST_PARAMS.limit);
 $('.pagination-bar').removeClass('hide');
 } else {
 var item = '<div class="list-null">No Content</div>';
 STORE_PRODUCT_LIST = {};
 STORE_PRODUCT_LIST_PARAMS = {spec_list: [], index: 0};
 $('.list-items').html(item);
 $('.pagination-bar').addClass('hide');
 }
 },
 error: function (resp) {
 console.log('Oh no! Error')
 }
 });
 }

 function createProductList(list) {
 var items = $('.list-items'), htmlText = '';
 for (var i in list) {
 var a = list[i], p_name = a.name, spec = '';
 for (var j in a.spec_list) {
 var b = a.spec_list[j], s_spec = b.specs, s_img = checkImgUrl(b.specs_image, a.image);
 var before =
 '<div class="p-spec">' +
 '<label class="spec-checkbox"><input type="checkbox" name="check-box"/></label>' +
 '<span class="spec-detail">';
 var imgRow = '';
 var after =
 '<span class="intro">' + s_spec + '</span></span>' +
 '<span class="spec-operation item-operation">' +
 '<span class="operation-panel">' +
 '<span class="iconfont icon-minus">-</span>' +
 '<label><input class="count-input" type="number" value="0"/></label>' +
 '<span class="iconfont icon-add">+</span>' +
 '</span></span></div>';
 if (s_img !== '') {
 imgRow = '<img class="pic" src=' + s_img + ' />';
 } else {
 imgRow = '<span class="pic no-img">SMOK</span>';
 }
 spec += before + imgRow + after;
 }
 htmlText +=
 '<div class="product-item">' +
 '<div class="p-name">' + p_name + '</div>' +
 '<div class="p-specs">' + spec + '</div></div>';
 }
 items.html(htmlText);
 bindProductListClick(list.length);
 }

 function checkImgUrl(url, defaultUrl) {
 var result = defaultUrl;
 if (url && !/^#/g.test(url) && (url.indexOf('http') !== -1)) {
 result = url;
 }
 return result;
 }

 function bindProductListClick(length) {
 var item = $('.list-items .product-item');
 item.eq(0).addClass('show');
 for (var i = 0; i < length; i++) {
 !function (i) {
 var current = item.eq(i);
 current.find('.p-name').click(function () {
 toggleListItem(item, current, length, i, 'product');
 });
 setProductListValueChange(item, i);
 }(i);
 }
 }

 function setProductListValueChange(items, index) {
 var item = items.eq(index);
 item.find('.p-spec').each(function () {
 var maxValue = 999999, input = $(this).find('.count-input'),
 check = $(this).find('input[name="check-box"]'), result = 0;
 bindChangeValueEvent(this, maxValue, input, check, result);
 });
 }

 function updateProductListParams(index) {
 STORE_PRODUCT_LIST_PARAMS.spec_list = {};
 STORE_PRODUCT_LIST_PARAMS.index = index;
 }

 function storeProductListParams() {
 var index = STORE_PRODUCT_LIST_PARAMS.index;
 calculateProductListParams(index);
 if (STORE_PRODUCT_LIST_PARAMS.spec_list.length > 0) {
 setCookie('_pl', JSON.stringify(STORE_PRODUCT_LIST_PARAMS), 60 * 60);
 console.log(JSON.stringify(STORE_PRODUCT_LIST_PARAMS));
 window.location.href = './after-sales.html'
 } else {
 if (getCookie('_rp')) {
 window.location.href = './after-sales.html'
 } else {
 toastInfo('Please choose One');
 }
 }
 }

 function calculateProductListParams(index) {
 var item = $('.list-items .product-item').eq(index), listArray = [];
 item.find('input[name="check-box"]').each(function (i) {
 if ($(this).is(':checked')) {
 var targetItem = STORE_PRODUCT_LIST[index].spec_list[i],
 currentRow = item.find('.spec-operation').eq(i), quantity = currentRow.find('.count-input').val();
 if (quantity > 0) {
 listArray.push({
 name: STORE_PRODUCT_LIST[index].name + '-' + targetItem.specs,
 name_alias: STORE_PRODUCT_LIST[index].alias + '-' + targetItem.specs_alias,
 sku: targetItem.sku,
 quantity: quantity
 });
 }
 }
 });
 STORE_PRODUCT_LIST_PARAMS.spec_list = listArray;
 }

 function calculatePagination(page, total, limit) {
 var list = Math.ceil(total / limit), tempArray = [], pagination = [];
 PAGINATION_PARAMS.currentPage = page;
 PAGINATION_PARAMS.total = list;
 var rule = {
 len: 10,
 left: 6,
 right: 2,
 page: 5,
 half: 4,
 more: '· · ·'
 };
 if (window.innerWidth < 1024) {
 rule = {
 len: 6,
 left: 3,
 right: 1,
 page: 2,
 half: 2,
 more: '· · ·'
 };
 }
 if (list > 0) {
 for (var i = 1; i <= list; i++) {
 tempArray.push(i);
 }
 if (list < rule.len) {
 pagination = tempArray;
 } else if (page < rule.page) {
 pagination = tempArray.splice(0, rule.left).concat(rule.more, tempArray.splice(-rule.right, rule.right));
 } else if (page > list - rule.half) {
 pagination = tempArray.splice(0, rule.right).concat(rule.more, tempArray.splice(-rule.left, rule.left));
 } else if (page >= rule.page) {
 pagination = tempArray.splice(page - rule.half, rule.left).concat(rule.more, tempArray.splice(-rule.right, rule.left));
 }
 }
 createPagination(pagination);
 }

 function createPagination(pagination) {
 var bar = $('.pagination-list'), liText = '';
 for (var i in pagination) {
 var a = pagination[i], a_id = parseInt(a), aText = '';
 if (a_id) {
 aText = '<li class="pagination-item pagination-num"><a>' + a + '</a></li>'
 } else {
 aText = '<li class="pagination-item" ><a>' + a + '</a></li>'
 }
 liText += aText;
 }
 var htmlText = '<div class="pagination-bar">' +
 '<ul class="ul-no-margin">' +
 '<li class="pagination-item"><a class="pagination-btn page-prev">Previous</a></li>' + liText +
 '<li class="pagination-item"><a class="pagination-btn page-next">Next</a></li>' +
 '</ul></div>';
 bar.html(htmlText);
 bindPaginationClick()
 }

 function bindPaginationClick() {
 var item = $('.pagination-bar');
 item.find('.page-prev').click(function () {
 chooseGetMethod('page-button', -1);
 });
 item.find('.page-next').click(function () {
 chooseGetMethod('page-button', 1);
 });
 item.find('.pagination-num').each(function () {
 var id = parseInt($(this).find('a').html());
 if (id) {
 $(this).click(function () {
 chooseGetMethod('page-number', id);
 PAGINATION_PARAMS.currentPage = id;
 });
 if (id === PAGINATION_PARAMS.currentPage) {
 $(this).addClass('choose');
 }
 }
 });
 }

 var countryList, storeAddressParams = {
 first_name: '',
 last_name: '',
 tel: '',
 email: '',
 country_id: '',
 province: '',
 city: '',
 postcode: '',
 address1: ''
 };

 function initAddressAdd() {
 var overlay = $('.address-add-overlay'), confirm = $('#aa-confirm'), cancel = $('#aa-cancel'),
 countryElement = $('#country').find('select');
 $('#address-add').click(function () {
 getCountryList(function () {
 for (var i in countryList) {
 var a = countryList[i];
 if (a.id === 222) {
 countryElement.append($("<option selected></option>")
 .attr("value", a.id)
 .text(a.name));
 } else {
 countryElement.append($("<option></option>")
 .attr("value", a.id)
 .text(a.name));
 }
 }
 });
 initAddressInput();
 overlay.css('display', 'block');
 setTimeout(function () {
 overlay.css('opacity', '1');
 }, 100);
 });
 cancel.click(function () {
 resetAddressForm();
 });
 confirm.click(function () {
 uploadAddress();
 });
 }

 function getCountryList(successHandler) {
 if (localStorage.getItem('countryList')) {
 countryList = JSON.parse(localStorage.getItem('countryList'));
 successHandler && successHandler();
 } else {
 var dataUrl = HOST_URL + 'api/countries';
 $.ajax({
 type: 'GET',
 url: dataUrl,
 dataType: 'json',
 success: function (resp) {
 switch (resp.code) {
 case '1000000':
 localStorage.setItem('countryList', JSON.stringify(resp.data));
 countryList = JSON.parse(localStorage.getItem('countryList'));
 successHandler && successHandler(resp);
 break;
 default:
 break;
 }
 },
 error: function (resp) {
 }
 });
 }
 }

 function initAddressInput() {
 var firstInput = $('#first_name');
 initAddressInputVerify('first_name', firstInput);
 var lastInput = $('#last_name');
 initAddressInputVerify('last_name', lastInput);
 var telInput = $('#tel');
 initAddressInputVerify('tel', telInput);
 var emailInput = $('#email');
 initAddressInputVerify('email', emailInput);
 var provinceInput = $('#province');
 initAddressInputVerify('province', provinceInput);
 var cityInput = $('#city');
 initAddressInputVerify('city', cityInput);
 var postcodeInput = $('#postcode');
 initAddressInputVerify('postcode', postcodeInput);
 var addressInput = $('#address1');
 initAddressInputVerify('address1', addressInput);
 }

 function initAddressInputVerify(type, picker) {
 var errorMsg = {
 'first_name': {
 'required': '*Please enter First Name',
 'pattern': '*Please enter valid contact'
 },
 'last_name': {
 'required': '*Please enter Last Name',
 'pattern': '*Please enter valid contact'
 },
 'tel': {
 'required': '*Please enter your telephone number',
 'pattern': '*Please enter valid telephone number'
 },
 'email': {
 'required': '*Please enter your email address',
 'pattern': '*Please enter valid email'
 },
 'province': {
 'required': '*Please enter province'
 },
 'city': {
 'required': '*Please enter city'
 },
 'postcode': {
 'required': '*Please enter postcode'
 },
 'address1': {
 'required': '*Please enter address'
 }
 };
 if (typeof String.prototype.trim !== 'function') {
 String.prototype.trim = function () {
 return this.replace(/^\s+|\s+$/g, '');
 };
 }
 if (document.all) {
 $('input').each(function () {
 var that = this;
 if (this.attachEvent) {
 this.attachEvent('onpropertychange', function (e) {
 if (e.propertyName != 'value') return;
 $(that).trigger('input');
 });
 }
 });
 }
 var currentInput = picker.find('input'), errorShow = picker.find('.warning-msg');
 currentInput.bind('input', function () {
 var text = currentInput.val().trim();
 if (text === '') {
 errorShow.html(errorMsg[type].required);
 storeAddressParams[type] = '';
 picker.addClass('aa-empty');
 } else if (!checkValue(type, text)) {
 errorShow.html(errorMsg[type].pattern);
 storeAddressParams[type] = '';
 picker.addClass('aa-empty');
 } else {
 picker.removeClass('aa-empty');
 storeAddressParams[type] = text;
 errorShow.html('');
 }
 });
 }

 function uploadAddress() {
 storeAddressParams['country_id'] = $('#country').find('select').val();
 for (var a in storeAddressParams) {
 if (storeAddressParams[a] === '') {
 var name = '';
 switch (a) {
 case 'first_name':
 name = 'First Name';
 break;
 case 'last_name':
 name = 'Last Name';
 break;
 case 'tel':
 name = 'Tel';
 break;
 case 'email':
 name = 'Email';
 break;
 case 'province':
 name = 'Province';
 break;
 case 'city':
 name = 'City';
 break;
 case 'postcode':
 name = 'Postcode';
 break;
 case 'address1':
 name = 'Address';
 break;
 default:
 break;
 }
 $('#' + a).addClass('aa-empty');
 toastInfo('Please fill in ' + name);
 return;
 }
 }
 var dataUrl = HOST_URL + 'api/customer/address';
 $.ajax({
 type: 'POST',
 url: dataUrl,
 data: storeAddressParams,
 headers: {
 'Authorization': getCookie('_at')
 },
 traditional: true,
 dataType: 'json',
 success: function (resp) {
 resetAddressForm();
 getAddressList();
 toastInfo('Add Successful!');
 },
 error: function (resp) {
 }
 });
 }

 function resetAddressForm() {
 var target = $('.address-add-overlay');
 target.css('opacity', '0');
 setTimeout(function () {
 target.css('display', 'none');
 }, 500);
 var rows = $('.address-add-frame .aa-row');
 for (var a = 0; a < 8; a++) {
 rows.eq(a).removeClass('aa-empty');
 rows.eq(a).find('input').val('');
 rows.eq(a).find('.warning-msg').html('');
 }
 }

 function cleanCookie() {
 deleteCookie('_ol');
 deleteCookie('_pl');
 deleteCookie('_ap');
 deleteCookie('_rp');
 deleteCookie('_ct');
 }*/


(function () {
  var counter = 0,
    inline = false,
    half = false,
    rate_status = false,
    rateParams = {
      rating: -1,
      after_sales_id: GetQueryString('id'),
      remark: ''
    },
    starList = $('.star'),
    starLeft = $('.star-left'),
    starRight = $('.star-right'),
    starTips = $('.star-tip'),
    starClasses = 'icon-star icon-star-half icon-star-full';

  $('.rate-content').hover(function () {
    inline = true;
  }, function () {
    inline = false;
    checkStar()
  });
  starLeft.hover(function () {
    if (rate_status)return;
    counter = starLeft.index(this);
    checkStar(1)
  });
  starRight.hover(function () {
    if (rate_status)return;
    counter = starRight.index(this);
    checkStar(2)
  });
  $('#starZero').hover(function () {
    if (rate_status)return;
    counter = 0;
    checkStar(3);
  });
  starTips.click(function () {
    var type = 0,
      n = starTips.index(this) / 2;
    counter = Math.floor(n);
    type = counter === n ? 1 : 2;
    checkStar(type);
    rateParams.rating = half ? 2 * counter + 11 : 2 * counter + 12;
    rate_status = true;
    console.log('---------------rate---------------', rateParams.rating, n, counter);
  });
  $('#starZero').click(function () {
    counter = 0;
    checkStar(3);
    rateParams.rating = 0;
    rate_status = true;
  });
  $('#rateSubmit').click(function () {
    if (!rateParams.after_sales_id) {
      toggleItemDisplay("show", "rateOverlay");
      return
    }
    if (rateParams.rating < 0) {
      toastInfo('Please select a rating');
      return
    }
    console.log('REPLY_PARAMS', REPLY_PARAMS);
    console.log('rateParams', rateParams);
    rateParams.remark = $('#rateRemark').val();
    submitRate();
  });

  function GetQueryString(e) {
    var o = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"), t = window.location.search.substr(1).match(o);
    return null != t ? unescape(t[2]) : null
  }

  function checkStar(type) {
    if (inline) {
      var name = '',
        array = '';
      switch (type) {
        case 1:
          name = 'icon-star-half';
          half = true;
          array = starList.eq(counter);
          starList.removeClass(starClasses).addClass('icon-star');
          starList.slice(0, counter).removeClass(starClasses).addClass('icon-star-full');
          array.removeClass(starClasses).addClass(name);
          console.log('half', counter);
          break;
        case 2:
          name = 'icon-star-full';
          half = false;
          array = starList.slice(0, counter + 1);
          starList.removeClass(starClasses).addClass('icon-star');
          array.removeClass(starClasses).addClass(name);
          console.log('full', counter);
          break;
        case 3:
          starList.removeClass(starClasses).addClass('icon-star');
          console.log('zero', counter);
          break;
      }
    } else if (!rate_status) {
      starList.removeClass(starClasses).addClass('icon-star')
    }
  }

  function submitRate() {
    $.ajax({
      type: 'post',
      url: HOST_URL + 'api/after_sales/rating',
      data: rateParams,
      headers: {
        'Authorization': getCookie('_at')
      },
      dataType: 'json',
      success: function (resp) {
        switch (resp.code) {
          case '1000000':
            toastInfo('Upload Success.');
            toggleItemDisplay("hide", "rateOverlay");
            break;
          default:
            break;
        }
      },
      error: function (resp) {
        toggleItemDisplay("hide", "rateOverlay");
        console.log(resp.responseJSON.code, resp.responseJSON.message)
      }
    });
  }
})();