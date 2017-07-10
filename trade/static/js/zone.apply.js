var _submitForm = null;
var _applyType = null;
var ZoneApplyCls={
		init:function(){
			this.initNode();
			this.bindEvent();
			 $(".jq-zone").text(ZoneApplyCls.getIndustryName());
			 this.$divApplyBody.removeClass("hide");
		},initNode:function(){
			//申请区域
			this.$divApplyBody = $("#jqDiv-applyBody");
			//提交申请
			this.$divBtn = $("#jq-btnSend");
			//申请内容区域
			this.$divContent = $(".foundApply");
		},
		bindEvent : function(){
			//商品专区主页（大类）
			this.$divApplyBody.delegate(".jq-home","click",this.zoneHome);
			//商品专区中心
			this.$divApplyBody.delegate(".jq-zone","click",this.zoneCenter);
			//确认申请按钮点击
			this.$divBtn.on("click", ZoneApplyCls.btnOk);
			//循环绑定上传插件
			this.$divContent.find(".span2").each(function(i,n){
				$(this).prev().attr("readonly","readonly");
				ZoneApplyCls.fileUpload($(this).attr("id"), $(this).next().attr("id"));
			});
			//循环遍历input设置验证
			var items = new Array();
			this.$divContent.find("input").not(".input2,.dataId").each(function(i,n){ 
				var item =  new Field({
		          	fid:$(this).attr("id"),
		          	val:[new Nul_val("不能为空")],
		         	msg_id:$("#err"+$(this).attr("id"))
		          });
				items.push(item);
			});
			_submitForm = new UserForm(items);
			//失败重新申请
			this.$divContent.delegate('.applyAgain','click',this.applyAgain);
			//下载app
			this.$divContent.delegate('.download','click',this.downloadApp);
		},zoneHome:function(){//跳转专区
			window.location.href = _ctx+"/zone.a";
		},zoneCenter:function(){//跳转专区中心
			window.location.href = _ctx+"/zone/"+ZoneApplyCls.getIndustry().toLowerCase()+".a";
		},
		btnOk : function(){
			if(!_submitForm.validate()){
				$('body,html').animate({scrollTop:160},1000);
				return;
			}
			_applyType = $(this).attr("applyType");
			var addSubmitParams = {};
			//循环获取input值
			ZoneApplyCls.$divContent.find("input").not(".input2").each(function(i,n){
				var _name = $(this).attr("name");
				addSubmitParams[_name] = $(this).val();
			});
			//console.log(addSubmitParams);
			ZoneApplyCls.$divBtn.unbind("click");
			var index = layer.load(3, {shade: [0.5,'#000']}); //加载中的遮罩层
			$.post(_ctx+"/zone/zoneApply/saveZoneApply",addSubmitParams, function(data){
				layer.closeAll('loading');
				var result = sptUtility.parseAjaxResult(data,"success");
				ZoneApplyCls.getTheResultHtml(result.result_flag);
//				if(result.result_flag){
//					layer.msg( '操作成功！',{time:1000},function(){
//						window.location.reload();
//					});
//				}else{
//					layer.msg(result.error_msg);		
//					ZoneApplyCls.$divBtn.on("click", ZoneApplyCls.btnOk);
//					return false;
//				}
			});
		},fileUpload : function(fileUploadId, fuSaveId){
			// fileUploadId:点击弹出选择文件事件的dom对象
			// fusaveId:文件上传成功后，保存的服务文件Id
			// --start-文件上传---
			var thumbnailWidth = 100;
			var thumbnailHeight = 100;
			var uploader = WebUploader.create({
				auto : true,
				// swf文件路径
				swf : _ctx + '/static/webuploader-0.1.5/Uploader.swf',
				// 文件接收服务端。
				server : _ctx + '/file/uploadLicense.a?tableName=tbl_zone_apply',
				// 选择文件的按钮。可选。
				// 内部根据当前运行是创建，可能是input元素，也可能是flash.
				pick : '#' + fileUploadId,
				// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
				resize : false,
				duplicate :true ,//true可重复上传，默认不可多次重复上传
				// 只允许选择图片文件。
				accept : {
					title : '企业证件',
					extensions : 'gif,jpg,jpeg,bmp,png,zip,rar,rar5,7z',
					mimeTypes :	".rar,.zip,.7z,image/*"
				}
			});
			// 去掉文件上传组件样式，使用上传dom 自己样式
			$(".webuploader-pick").removeClass();
			// 当有文件添加进来的时候
			uploader.on('fileQueued', function(file) {
				layer.load();
			});

			// 文件上传成功，给item添加成功class, 用样式标记上传成功。
			uploader.on('uploadSuccess', function(file, response) {
				layer.closeAll('loading');
				var theInput = $("#"+fileUploadId).prev();
				if(file &&file.size > 10485760){
					theInput.val("");
					layer.msg("上传文件不能超过10M!");
					return;
				}
				if(response && response._raw && response._raw.indexOf("success")> -1){//上传成功
					theInput.val(file.name );
//					theInput.focus();
					var fileId = response._raw.substr(8);
					// 保存上传后的文件fileid
					$('#' + fuSaveId).val(fileId);
				}else{
					theInput.val("");
					layer.msg("上传文件失败，失败信息："+ response._raw);
				}
			
			});
			// 文件上传失败，显示上传出错。
			uploader.on('uploadError', function(file) {
				layer.closeAll('loading');
				layer.msg("文件上传失败,请重试!");
			});
		},getIndustry:function(){
			var industry = "SL";//默认大类
	         if(typeof(sessionStorage) != undefined){
	        	 //支持会话存储
	        	 industry = sessionStorage.getItem("industry");
	         } 
	         return industry;
		},getIndustryName:function(){
			var industryName;
	        if(typeof(sessionStorage) != undefined){
	        	industryName = sessionStorage.getItem("industryName");
	        } 
	        if(!industryName || industryName === ""){
	        	 industryName = "基础化工";
	        }
	        return industryName;
		},getTheResultHtml:function(flag){
			var _html = ['<div class="width_1200 regist_complete">','<div class="float_left registSucceed">'];
			var result;
			var reason;
			if(flag){
				result = "提交成功";
				reason = "您的申请资料已收到，我们会及时与您联系，";
				_html.push(['<div class="clearFix registSucceed_top">'].join(''));
			}else{
				result = "提交失败";
				reason = "由于网络原因，你的资料提交失败了，";
				_html.push(['<div class="clearFix registSucceed_top fail">'].join(''));
			}
			_html.push(['<i class="succeed_regist float_left"></i><div class="float_left">',
			         '<span class="succeed_span1">',result,'</span><br/>',
			         '<span class="colorhei">',reason,'<span class="colorhong">5 </span>秒后回到商品专区首页。</span>',
			         '</div></div>'].join(''));
			if(!flag){
				_html.push(['<div class="applyAgain">','<span>重新申请</span>','</div>'].join(''));
			}
			_html.push(['</div>','<div class="Client float_right">','<div class="client">',
			            '<p class="colorlan">商品通在线客户端</p>','<div class="client_erweima">',
			            '<span class="color_hei">扫一扫，立即下载</span></div>',
			            '<div class="download">','<i class="float_left iOS"></i>',
			            '<span class="float_left iOS2">IOS</span>',
			            '<span class="float_left">下载</span></div>',
			            '<div class="download"><i class="float_left android"></i>',
			            '<span class="float_left android2">Android</span>',
			            '<span class="float_left">下载</span>',
			            '</div></div></div></div>'].join(''));
			this.$divContent.addClass("regist_complete").html(_html.join(''));
			$('body,html').animate({scrollTop:160},1000);
			//5秒后回到专区首页
			$('body').oneTime('5s',function(){
				window.location.href = _ctx+"/zone.a";
			});
		},applyAgain:function(){
			if(_applyType == 'joinCoreSup'){
				window.location.href= _ctx+"/zone/zoneApply/join_core_sup.a";
			}else{
				window.location.href= _ctx+"/zone/zoneApply/zone_apply.a";
			}
		},downloadApp:function(){
			if($(this).find("i").hasClass("android")){
				window.location.href= _android;
			}else{
				window.location.href= _ios;
			}
		}
}

$(function(){
	ZoneApplyCls.init();
});