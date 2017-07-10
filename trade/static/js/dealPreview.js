var interval  = null;
var dataCache = {
	curLayer : ""
};
var viewData = {};
var detail = {
	saveCurUrl:function(){
		//主要用于1v1成交预览时，如果用户未登陆，则成交时跳转到cas中再回来时，地址参数丢失
		if(typeof(sessionStorage) != "undefined"){
		var _curUrl = window.location.href;
				var dealPreviewUrl = sessionStorage.getItem('dealPreviewUrl');
				if(dealPreviewUrl != undefined &&_curUrl.indexOf("dealFlag=myDeal")> -1 && _curUrl.indexOf("sessionId=")<0){
					//cas登陆返回后地址参数丢失不正确，则使用储存的地址重新刷新页面
					sessionStorage.removeItem('dealPreviewUrl');
					if(dealPreviewUrl.indexOf("sessionId=") > -1){//防止死循环
						window.location.href = dealPreviewUrl;
					}
				}else{
					sessionStorage.removeItem('dealPreviewUrl');
					sessionStorage.setItem('dealPreviewUrl',window.location.href);
				}
		}
	},
	init : function() {
		$('body').everyTime('1s',function(){
			detail.countDown($("#validDate").val(),"#validTime");
		});
		//interval =  window.setInterval(function(){detail.countDown($("#validDate").val(),"#validTime");}, 1000); 
		$(".informUrl").html(window.location.href);
		$("#copyContent").val(detail.getCopyContent());
//	    $(".deliveryTime").text(this.fillDeliTime());
	    $(".companyInfo .span1").on('click',this.viewCompanyInfo);
	    $(".span2").on("click",this.addSupplier);//添加供应商
	    //火狐49.0.2生版本有问题
	    $("body").delegate("#global-zeroclipboard-html-bridge","mouseover",function(){
	    	$("#global-zeroclipboard-flash-bridge").attr("style","width:100px!important; height:50px!important;z-index: 999999999999;filter:alpha(opacity=0); -moz-opacity:0;  opacity:0;");
	    	$("#global-zeroclipboard-flash-bridge").attr("data",_ctx+"/static/js/ZeroClipboard.swf?noCache="+new Date().getTime());
	    });
	    $("body").delegate("#btnCopy","mouseout",function(){
	    	$("#global-zeroclipboard-flash-bridge").attr("style","width:100px!important; height:50px!important;z-index: 999999999999;filter:alpha(opacity=0); -moz-opacity:0;  opacity:0;");
		    $("#global-zeroclipboard-flash-bridge").attr("data",_ctx+"/static/js/ZeroClipboard.swf?"+new Date().getTime());
	    });
	},getCopyContent:function(){
		var _html = $(".informUrl").text()+"\r\n";
		$(".informDiv").find("span").each(function(){
			_html += $.trim($(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, ''))+"   ";
		});
		return _html;
	},
	fillDeliTime : function() {
		var time = $("#deliveryTimeHidden").val();
		var deliveryTime = new Date(time);
		var productType = $('#productType').val();
		if (productType.indexOf('SL') != -1) {
			deliveryTime = new Date(deliveryTime.getTime() - 24 * 60 * 60 * 1000).format("yyyy年MM月dd日");
			return deliveryTime + ' 前';
		} else {
			deliveryTime = new Date(deliveryTime.getTime() - 24 * 60 * 60 * 1000).format("yyyy年MM月");
			var deliveryTag = new Date(time).getDate() == 15 || new Date(time).getDate() == 16 ? "上" : "下";
			return deliveryTime + deliveryTag;
		}
	},countDown:function(validTimeVal,countDownDom){
		//系统时间
		var now = new Date($("#sysDate").val()); 
		var curSecond = now.getTime()+1000;
		now = new Date(curSecond);
		//重置系统时间
		$("#sysDate").val(now.format("yyyy/MM/dd hh:mm:ss"));
		var endDate = new Date(validTimeVal); 
		var leftTime=endDate.getTime()-now.getTime(); 
		var leftsecond = parseInt(leftTime/1000); 
		var eDay=Math.floor(leftsecond/(60*60*24)); 
		var eHour=Math.floor((leftsecond-eDay*24*60*60)/3600); 
		var eMinute=Math.floor((leftsecond-eDay*24*60*60-eHour*3600)/60); 
		var eSecond=Math.floor(leftsecond-eDay*24*60*60-eHour*3600-eMinute*60); 
		var validText = "";
		if(eDay < 0 || (eHour < 1 && eMinute < 0 && eSecond < 1)){
			validText = "失效";
			$("body").stopTime(); 
		}else{
			var dayText = '';
			if(eDay > 0){//天大于0显示
				dayText=['<span class="content_td_1_table_tr_3_span">',eDay,'天</span>'].join('');
			}
			validText = ['仅剩 ',dayText,
			             '<span class="content_td_1_table_tr_3_span">',
			             eHour,'时</span> <span class="content_td_1_table_tr_3_span">',
			             eMinute,'分</span> <span class="content_td_1_table_tr_3_span">',
			             eSecond,'秒</span>'].join('');
		}
		$(countDownDom).html(validText);
	},viewCompanyInfo:function(){//查看匿名公司信息
		dataCache.activeTarge = $(this);
		$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(), function(data) {
			 //不需要登陆校验
			if (data == "invalid") {
				TradeHeadCls.doLoginInput();
				return;
			}else{
				viewData = {
					bizOpType : dataCache.activeTarge.attr("bizOpType"),
					bizId : dataCache.activeTarge.attr("bizId"),
					negoStatus : dataCache.activeTarge.attr("negoStatus")
				};
				console.log(viewData);
				dataCache.curLayer = layer.confirm("", {
					area : [ '420px', '230px' ],
					success : function(layero, index) {
						$(layero).removeClass("layui-layer");
						$(layero).addClass("layui-layer-cus");
						$(layero).html(detail.dedductAmtTip());
					}
				}, function() {
				});
			}
		});
	},dedductAmtTip : function() {
		var _html = [ '<div class="chatPop marginAuto viewPop">', '<div class="chatTit width_100">', '<span>查看公司名称</span>',
						'<i class="float_right" onclick="detail.viewCompanyClose()"></i>', '</div>', '<div class="viewBot paddingBto20">',
						'<p class="marginAuto">查看对方公司信息需要消费<span class="colorHong">' + $("#deductAmt").val() + '</span>个通商宝，是否继续？</p>', '<div class="clearFix viewButton">',
						'<a href="javascript:;" class="float_left" onclick="detail.viewCompanyClose()">取消</a>',
						'<a href="javascript:;" class="float_right backGrond" id="doDedcutView" onclick="detail.doViewCompanyInfo()">继续</a>', '</div>', '</div>', '</div>' ]
						.join('');
		return _html;
	},viewCompanyClose : function() {// 用户取消查看
		layer.close(dataCache.curLayer);
	},doViewCompanyInfo:function(){
		var url = _ctx + "/qp/viewCompanyInfo.a";
		$.post(url, viewData, function(rData) {
			if (typeof (rData) == "string") {
				if (rData.indexOf("|") > -1) {
					layer.msg(rData.split('\|')[0]);
					return;
				} else {
					rData = eval(rData);
				}
			}
			if (rData.success == "Ok") {
				console.log(rData.viewCompanyName);
				detail.viewCompanyClose();
				dataCache.activeTarge.removeAttr("bizOpType");
				var registCapital="暂无",address="暂无";
				if(!rData.registCapital==''){
					registCapital = rData.registCapital;
				}
				if(!rData.address==''){
					address = rData.address
				}
				$(".registCapital").html(registCapital);
				$(".address").html(address);
				$(".registName").html(rData.viewCompanyName);
				if(rData.isSupplier !='true' && rData.isSelfCompany !='true'){ //非供应商，添加按钮显示
					$(".addSupplier").append('<a href="javascript:void(0);" cTag="'+rData.viewCompanyTag+'" class="span2 float_right" onclick="detail.addSupplier()">+ 添加</a>');
				}
				$("img").parent().append('<i class="level_'+rData.supplierLevel+'"></i>');
				$("img").remove();
//				dataCache.activeTarge.parent().siblings().find(".companyCont").eq(1)
//					.append('<a href="javascript:void(0);" class="span2 float_right">+ 添加</a>');
				dataCache.activeTarge.remove();
			} else {
				layer.msg(rData.errMsg);
			}
		});
	},addSupplier:function(){
		$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(), function(data) {
			 //不需要登陆校验
			if (data == "invalid") {
				TradeHeadCls.doLoginInput();
				return;
			}else{
				var cTag = $(".jq-addSupplier").attr("cTag");
				console.log(cTag);
				layer.confirm("你确认要添加当前企业为自己供应商吗？", {icon: 3}, function(index){
					  layer.close(index);
					$.post(_ctx+"/qp/supplierFollow",{supCompanyTag:cTag},function(data) {
						 //layer.closeAll('loading');
						var result = sptUtility.parseAjaxResult(data, "success");
						if (!result.result_flag) {
							// 操作失败
							layer.msg(result.error_msg);
							return false;
						}
						// 关闭弹出框，重新加载数据
						layer.msg("操作成功！", {
							icon : 1,
							time :700
						}, function() {
							$(".span2").remove();
						});
					});
				});
			}
		});
	}
}

var deliveryTime2;
var dataParam;
$(function() {
	detail.init();
	detail.saveCurUrl();
	var time = $("#deliveryTimeHidden").val();
	deliveryTime2 = new Date(time).format("yyyy-MM");

	if ($("#cjFlag").val() == "sess") {
		$.ajax({
			type : "post",
			url : '/getDealPriceAndNumber.action?timeStamp=' + new Date().getTime(),
			data : {
				requestId : $("#requestId").val(),
				sessionId : $("#sessionId").val(),
				meOrOpp : '1'
			},
			dataType : 'json',
			success : function(data) {
				var negoPrice = data.negoPrice;
				var negoNumber = data.negoNumber;

				$("#productPrice").val(negoPrice);
				$("#productRemainNumber").val(negoNumber);
				$("#jg").html(negoPrice);
				$("#sl_value").html(negoNumber);

			}
		});
	}
	$("#btnToQueryPrice").click(function() {
		window.location.href = _ctx + "/qp/queryPrice.a";
	});

	$('#readContract').click(
			function() {
				// parent.window.preView.click();
				var submitId = $("#submitId").val();
				var opSubmitId = $("#opSubmitId").val();
				var requestUserId = $("#requestUserId").val();
				if (opSubmitId != null && opSubmitId != "") {
					submitId = opSubmitId;
				}
				// 查看session是否过期
				$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(), function(data) {
					 //不需要登陆校验
					data = "ok";
					if (data == "invalid") {
						TradeHeadCls.doLoginInput();
						return;
					} else {
						var winW = "950px";
						var winH = "600px";
						var curSysWidth = $(window).width();
						var curSysHeight = $(window).height();
						if (curSysWidth <= 950) {
							winW = (curSysWidth - 20) + "px";
						}
						winH = (curSysHeight - 70) + "px";
						layer.open({
							type : 2,
							zIndex : 1000,
							shade : 0.5,
							title : "合同明细",
							area : [ winW, winH ],
							fix : true, // 固定
							maxmin : false,
							content : _ctx + '/qp/getTemplateContentByAjax.a?submitId=' + submitId + '&requestUserId=' + requestUserId + "&productPrice="
									+ $("input[name=productPrice]").val() + "&dealNumber=" + $("input[name=dealNumber]").val() + "&anonymousTag=" + $("#anonymousTag").val()
						});
					}
				});

			});

	$(".btnCancel").on("click", function() {
		window.location.href = _ctx + "/qp/queryPrice.a";
	});

	$(".but1").on("click", function() {
		// 查看session是否过期
		$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(), function(data) {
			if (data == "invalid") {
				TradeHeadCls.doLoginInput();
				return;
			} else {
				btnDeal();
			}
		});
	});
	//复制
	var client = new ZeroClipboard($("#btnCopy"));
	client.on("aftercopy",function(e){
		 layer.msg("复制成功");
		});
	client.on("error",function(e){
		$("#btnCopy").click(function(){
			 layer.msg("请确认浏览是否开启flash功能,禁止flash会影响使<br/>用复制功能！未安装请点击-》<a style='color:red' href='http://www.adobe.com/go/getflashplayer'>下载Flash插件</a>", {
					time : 5000
				}, function() {
				});
		});
		});
	//鼠标移到复制上重新初始化拷贝值
	$("#btnCopy").mouseover(function(){
		$("#copyContent").val(detail.getCopyContent());
	});
});
function btnDeal() {
	if (!$("#btnDealAgree").is(':checked')) {
		layer.msg("请先阅读并同意合同");
		return;
	}
	var _useLoan = $("#userLoan").is(":checked") ? "1" : "0";
	var _isMyRequest = $(this).parent().attr('isMyRequest');
	if ("true" == _isMyRequest) {
		_useLoan = "0";
		// 自己不可用定金贷
		$("#userLoan").prop("checked", false);
	}

	var submitId = $("#submitId").val();
	var opSubmitId = $("#opSubmitId").val();
	var productRemainNumber = $("#productRemainNumber").val();
	var productPrice = $("#productPrice").val();
	var payMethod = $('#payMethod').val();
	var productType = $("#productType").val();
	// 取值不能使用$("#id").html()而是使用text(),不然在ie8使用layer.confirm报错
	var direct = $("#direct").text();
	var sl = $("#sl").text();
	var jg = $("#jg").text();
	var productName = $("#productName").text();
	var formConfigId = $("#formConfigId").val();
	var bond = $("#bond").val();
	if (opSubmitId == null || opSubmitId == "") {
		dataParam = {
			productType : productType,
			opSubmitId : submitId,
			number : productRemainNumber,
			price : productPrice,
			paymethod : payMethod,
			p2p : true,
			opUserId : $("#opUserId").val(),
			negoType : 'D',
			bond : bond,
			useLoan : _useLoan
		};
	} else {
		// 应用于1v1成交
		dataParam = {
			productType : productType,
			opSubmitId : opSubmitId,
			number : productRemainNumber,
			price : productPrice,
			paymethod : payMethod,
			formConfigId : formConfigId,
			sessionId : $("#sessionId").val(),
			p2p : true,
			opUserId : $("#opUserId").val(),
			negoType : 'D',
			bond : bond,
			useLoan : _useLoan
		};
	}
	layer.confirm("您确定与\"" + sl + "-" + jg + "元/吨" + "-" + productName + "-" + direct + "\"的订单进行成交吗？", {
		icon : 3
	}, function(index) {
		layer.close(index);
		// 加载层-默认风格
		layer.load();
		$.ajax({
			type : "post",
			url : _ctx + '/nego/quickNego.a',
			async : false,
			data : dataParam,
			success : function(data) {
				layer.closeAll('loading');
				// 获取结果处理集
				var datas = sptUtility.parseAjaxResult(data);
				if (!datas.result_flag) {
					layer.msg(datas.error_msg);
					return false;
				}
				// 关闭弹出框，重新加载数据
				parent.layer.msg("成交成功！", {
					icon : 1,
					time : 500
				}, function() {
					// 刷父窗体数据
					// 重新加载议价管理
					window.location.href = _ctx + "/qp/queryPrice.a";
				});
			}
		});
	});
}

function Trim(str, is_global) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	if (is_global) {
		result = result.replace(/\s/g, "");
	}
	return result;
}

//1v1竞价
function competeOne(obj,submitId,sessionId,tag)
{
	var winW = "820px";
	var winH = "590px";
	var curSysWidth = $(window).width();
	var curSysHeight = $(window).height();
     if(curSysWidth <= 840){//仅针分辨率800
    	 winW = (curSysWidth-20)+"px";
     }
     if(curSysHeight <= 590){
    	 winH = (curSysHeight-90)+"px";
     }
     
	$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(),
			 function(data) {
				if (data == "invalid") {
					TradeHeadCls.doLoginInput();
					return;
				}else{
					// 是否为自己或者企业内部挂单
					var _isMyRequest = $(obj).parent().attr("isMyRequest");
					if("true" == _isMyRequest)
					{
						layer.msg(_nogoDealErrMsg);		
						return;
					}	
					if(sessionId == "" || sessionId == null)
						sessionId = 0;
					
					layer.open({
					    type: 2,
					    zIndex: 1000,
					    shade: 0.5,
					    title: "<img src='/static/images/one_v_one_logo.png'>",
					    area: [winW,winH],
					    fix:false, // 不固定
					    maxmin: false,
					    content:_ctx+'/nego/1v1.a?opSubmitId=' + submitId + "&sessionId=" + sessionId + "&tag=" + tag// +"&productType="+barGinSearchData.productType
					});
				}
			}
		);
	
		
}

