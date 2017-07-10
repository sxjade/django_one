// 请求地址
var td_submit={
		init:function(){
			this.initNode();
			// 事件绑定
			this.bindEvent();
			this.initParamData();
			this.getQualityAjax();
			this. getProductPlaceAjax();
			this.getDeliveryPlaceAjax();
			this.initParamData();
			// 如果查询框有值则说明需要全局搜索
			if("" != $(".search input[name=searchKey]").val()){
				barGinSearchData.searchBuySell = $(".search_tit >span.on").attr("key");
				barGinSearchData.searchKey=  $(".search input[name=searchKey]").val();
			}
			// 首次进入询价商城加载数据
			loadByFlag(subTab,'1');
		
		},initNode:function(){
			// 查询条件体
			this.$condBody = $("#jqDiv-condBody");
		},
		initParamData:function(){// 初始化条件
			// 条件筛选事件，初始化查询条件
			this.$condBody.find(".jq-esubconds span.on").each(function(i,item){
				var _pName = $(this).parent().attr("name");
				var _pVal = $(this).attr("val");
				barGinSearchData[_pName] = _pVal;	
			});
		},bindEvent:function(){
			//查询条件鼠标移入显示与隐藏
			this.$condBody.delegate("li","mouseover",this.condS);
			this.$condBody.delegate("li","mouseout",this.condH);
			// 子查询条件事件托管
			this.$condBody.delegate(".jq-esubconds span", "click", this.subCondClickEvent);
			// 排序事件绑定
			$(".btn-querySort").on("click",this.orderQuickSort);
			// 品牌号更改值时事件触发
			$("#qk_brandNo").on("change",function(){
					barGinSearchData ["brand"]	 = $.trim($(this).val());
			});
			// 塑料下专用查询
			$("#qk_search").on("click",function(){
				// 加载数据
				loadByFlag(subTab,'1');
			});
			
		},subCondClickEvent:function(){
			var cName = $(this).parent().attr("name");
			var cvalue = $(this).attr("val");
			// 点击对象需要执行的操作
			var cEvt = $(this).parent().attr("et");
			if (barGinSearchData[cName] == cvalue) {// 点击的对象是当前对象，则不做操作
				return;
			}else{// 设置选择的条件
				var condHeader = $(this).parent().parent().find("span:first");
				console.log(condHeader);
				 var title =condHeader.attr("title");
				 if(!title){
					 title = condHeader.text()
					 condHeader.attr("title",title);
				 }
				if("不限" === $(this).text()){
					condHeader.text(title);
				}else{
					condHeader.text($(this).text());
				}
				
			}
			// 更改样式
			$(this).siblings().removeClass("on");
			$(this).addClass("on");
			// 点击某条件隐藏菜单
			$(this).parent().hide();
			if (cEvt) {
				var level = $(this).parent().attr("level");
				barGinSearchData[cName] = cvalue;
				if("eReloadPage" === cEvt){// 当前面页刷新，点击的是行业
					window.location.href = _ctx +"/qp/queryPrice.a?productType="+cvalue;
					return;
				}else if ("eProductFilter" == cEvt) {// 需要根据类别过滤具体品名
					$("div[name=productType] span").hide();
					// 第一个不限品名显示并显示为选中
					$("div[name=productType] span:first").show().addClass("on").siblings().removeClass("on");
					$("div[name=productType] span[val^=" + cvalue + "]").show();
				} else if ("eReloadCondit" == cEvt) {// 需要重新加载核心供应商、质量标准、原产地址、交货地
					td_submit.getQualityAjax();
					td_submit.getProductPlaceAjax();
					td_submit.getDeliveryPlaceAjax();
					
					$("div[pl^=" + level + "]").parent().each(function(condHeader){
						var condHeader = $(this).find("span:first");
						var title =condHeader.attr("title");
						condHeader.text(title);
					});
				}
				// 相应的选中样式要重新刷新
				$("div[pl^=" + level + "]").find("span:first").addClass("on").siblings().removeClass("on");
			}
			// 加载数据
			loadByFlag(subTab,'1');
		},orderQuickSort:function(){//排序
			// 排序字段
			var _sort = $(this).attr("sort");
			var _order = "desc";// 降序
			if($(this).find("i").hasClass("sortDown")){// 降降，则此需要升序
				_order = "asc";
			}
			barGinSearchData.sort = _sort;
			// 排序方向desc,asc
			barGinSearchData.order = _order;
			if(undefined != barGinSearchData.sort && null != barGinSearchData.sort){
				var curSortField = $("a[sort="+barGinSearchData.sort+"]");
				$(".btn-querySort").removeClass("sort_active");
				curSortField.addClass("sort_active");
				// 排序字段
				if("desc" == barGinSearchData.order){// 增加降序样式
					$(".btn-querySort").find("i").removeClass("sortUp");
					$(curSortField).find("i").addClass("sortDown");
				}else{// 增加升序样式
					$(".btn-querySort").find("i").removeClass("sortDown");
					$(curSortField).find("i").addClass("sortUp");
				}
			}
			loadByFlag(subTab,'1');	
		},openOnlineCusService:function(){
			var productType = $(this).attr("product_type");
			// 打开在线IM
			window.open(_ctx+"/mobile/im/check/main?productType="+productType , "_blank");
		},subItemBindEvent:function(){// 查询子结果数据事件绑定
			$("a.btn-trade").unbind("click");
			// 交易预预览事件
			$("a.btn-trade").click(function(){ 
				var _pDom = $(this).parent();
				var _sumbitId= $(_pDom).attr("submitId");
				var _expiredDate= $(_pDom).attr("expiredDate");
				var _uid=  $(_pDom).attr("uid");
				var _curStatus= $(_pDom).attr("curStatus");
				var _curIndex= $(_pDom).attr("curIndex");
				var _tradeMode = barGinSearchData.tradeMode;// $("div[name=tradeMode]").find("a.on").getAttr("val");
				var _productType = barGinSearchData.productType;// $("div[name=productType]").find("")
				var myUserId =$('#myUserId').val();
				td_submit.dealPreview(this,_sumbitId, _productType, _tradeMode, _expiredDate, myUserId);
				});
			$("li.tab_sub").unbind("click");
			//
			$("li.tab_sub").click(function(){
				var _subTab = $(this).attr("name");
				if("tab_default" != _subTab && (!TradeHeadCls.checkLogin() || !TradeHeadCls.validUserStatus())){
					return;
				}
				td_submit.initOrderClass();
				// 询价商城子tab样式
				loadByFlag(_subTab,'1');
			});
			// 在线im
			$("#div_qp_content_item").delegate('.contact_cusService', 'click',this.openOnlineCusService);
		},
		// 产地
		getProductPlaceAjax:function(){
			td_submit.getProductConfig($("div[name=manufacturer]"),"PRODUCTPLACECFG","productPlace");
		},
		// 交货地
		getDeliveryPlaceAjax:function()
		{
			td_submit.getProductConfig($("div[name=deliveryPlace]"),"DELIVERYPLACECFG","deliveryPlace");
		},
		// 质量标准
		getQualityAjax:function()
		{
			td_submit.getProductConfig($("div[name=productQuality]"),"QUALITYCFG","productQuality");
		},
		getProductConfig:function (sDom,prop,dictCat)
		{   
			var productType = barGinSearchData.productType;
			if(productType != "")
			{
				var jsonDta = {productType:productType,prop:prop,dictCat:dictCat};
				var actionUrl = _ctx+"/qp/getProductConfigAjax.a";
				$.ajax({
					url : actionUrl,
					data : jsonDta,
					async : true,
					success : function(data) {
						sDom.empty();
						var _nLimitDom = $('<span class="on" val="">不限</span>');
						_nLimitDom.appendTo(sDom);
						if (data!=null && data.length != 0) {
							for (var i = 0; i < data.length; i++) {
								var _dom = $("<span  val='"+ data[i].value + "'>" + data[i].name+ "</span>");
//								if(i>11){// 子项大于12个后自动隐藏
//									$(_dom).hide();
//								}
								_dom.appendTo(sDom);
							}
						}
					},
					error : function() {
					}
				});
			}
		},
		queryPrice:function(barGinSearchData,param){// 询价查询
			$("#data_loading").show();
			$.ajax({
				url :_ctx+"/qp/queryPriceItem.a" ,
				data : barGinSearchData,
				type : "post",
				cache : false,
				async : false,
				success : function(data) {
					$("#data_loading").hide();
					$('#qp_content').html(data);
					// 询价商城子tab样式
					$("li[name="+subTab+"]").addClass("li_on");
					if (barGinSearchData.currentPageNumber==1){
						$('body,html').animate({scrollTop:0},1000);
					}else{
						$('body,html').animate({scrollTop:400},1000);
					}
					// 绑定事件
					td_submit.subItemBindEvent();
				}
			});
		},doRepeal:function(submitId,valid){// 撤销询价
			if(valid == false){
				layer.msg( '对不起，该询价已经过期！');
				return;
			}			
			layer.confirm('您确定撤销该询价么？', {icon: 3}, function(index){
			    layer.close(index);
			   // 加载层-默认风格
			    layer.load();
			    $.ajax({
					type: "post",
					url: _ctx+"/qp/removeBuySellIntension.a?timeStamp=" + new Date().getTime(),
					data: {submitId:submitId},
					success: function(data) {
						layer.close(index);
					    layer.closeAll('loading');
						var result = sptUtility.parseAjaxResult(data,"success");
						if(result.result_flag == true){
							loadByFlag("tab_myBargin");
							layer.msg( '撤销成功！',{icon: 1});
						}
						else{
							layer.msg(result.error_msg);
							return;
						}	
					}
				});
			});

		},closeQSWin:function(){// 弹出窗体关闭
			var index = layer.getFrameIndex(window.name);
			layer.close(index);
		},dealPreview:function(obj,submitId,productType,tradeMode, validTime, opUserId){
			var winW = "680px";
			var winH = "550px";
			var curSysWidth = $(window).width();
			var curSysHeight = $(window).height();
		     if(curSysWidth <= 680){// 仅针分辨率800
		    	 winW = (curSysWidth-20)+"px";
		     }
		     if(curSysHeight <= 550){
		    	 winH = (curSysHeight-90)+"px";
		     }
			/*
			 * 成交预览
			 */
			var _url = '/qp/dealView/'+submitId+".a?dealFlag=freeDeal";
			td_submit.loadDealReview(_url);
			return;
		},loadNotice:function (type,pageNo){// 加载议价管理,type:0-当前，1-历史
			// 用户是否登陆
			if(!TradeHeadCls.checkLogin()){return;};
			$.ajax({
				url :_ctx+"/nego/negoLogByUserId.a",
				data : {"currentPageNumber":pageNo,
		              "numberPerPage":10,
		              "type":type,
		              "productType":barGinSearchData.productType
						},
				type : "post",
				cache : false,
				async : false,
				success : function(data) {
					$('#div_qp_content_item').html(data);
				}
			});
		},loadCommonUse:function(pageNo){// 加载常用询价
			$.ajax({
				url :_ctx+"/qp/commonUse.a",
				data : {"currentPageNumber":pageNo,
		                "numberPerPage":10,
		                "type":1,
		                "productType":barGinSearchData.productType
						},
				type : "post",
				cache : false,
				async : false,
				success : function(data) {
					$('#div_qp_content_item').html(data);
				}
			});
		},loadNoticeCount:function (){// 加载通知个数
			// 获取会话列表
			$.post(_ctx+"/nego/getReplyCount.a?productType=" + barGinSearchData.productType,
					 function(data) {
					 $(".listingNew_tit_ul .li_num").html(data);
			});
		},initOrderClass:function(){
			// 重新选择一个标签则需要把排序样式去掉还原默认
			$(".btn-querySort").removeClass("sort_active");
			$(".btn-querySort").eq(0).addClass("sort_active");
			$(".btn-querySort").find("i").removeClass("sortUp");
			$(".btn-querySort").find("i").removeClass("sortDown");
			barGinSearchData.sort = "";
		},loadDealReview:function(_url){// 加载成交预览
			window.location.href = _url;
		},condS:function(){
			$(this).find(".product_classify").show();
		},condH:function(){
			$(this).find(".product_classify").hide();
		}
		
}
// 点击查询
var barGinSearchData={};
// 询价商城子tagb,默认全部
var subTab = "tab_default";
$(document).ready(function() {
	// 初始化数据
	td_submit.init();	
	try{
		// 定时刷新
	  	$('body').everyTime('120s',function(){
	  		if(subTab != "tab_manageBargain"){// 除议个管理外，基他数据每2分钟查询一次
	  			loadByFlag(subTab,'1');
	  		}
		});
	}catch (e) {
  	}
});
// 询价商城数据库加载
function doLoadList(pageNo){
	barGinSearchData.currentPageNumber=pageNo;
	td_submit.queryPrice(barGinSearchData,{});
	return;
}
/** 分页用 */
function pageChange(obj) {
	loadByFlag('tab_default',$(obj).val());
}

/**
 * 根据子tab标签加载分页
 * 
 * @param _subTab
 *            子tab名 tab_default：询价商城，tab_myBarin个人询价
 * @param page页码
 */
function loadByFlag(_subTab,page){
	// 初始化条件
	td_submit.initParamData();
	if("" == _subTab || null == _subTab){
		 _subTab = subTab;// 主要用于分页查询
	}
	if (page==undefined){page=1;}
	$("#currentPageNumber").val(page);
	
	if(_subTab == "tab_myBargin" ){
		barGinSearchData.userNego = true;// 查看自己询价
	}else{
		barGinSearchData.userNego = false;// 查看所有询价商城
	}
	// 设置交易模式和买卖方向
	if(undefined != barGinSearchData.tradeMode){
		if(barGinSearchData.tradeMode == ""){
				barGinSearchData["buySell"] = "";
		}else{
			   var _tradeMode  = barGinSearchData.tradeMode;
			   if(_tradeMode.indexOf("_")>0){
				   var _valList = _tradeMode.split("_");
					barGinSearchData["tradeMode"] = _valList[0];
					barGinSearchData["buySell"] = _valList[1];   
			   }
		}
	}

	
	// 如果点击是询价商城，不需要登陆
	if(_subTab == "tab_default"){
		if("" != _subTab){// 为空，则为分页调用，则不更改子标签的值，直接翻页
			subTab = _subTab;	
		}
		// 初始化询价商城选中
		initSubTabSelected();
		doLoadList(page);
	}else if (_subTab == "tab_myBargin" || _subTab == "tab_commBargin"  || _subTab == "tab_manageBargain" ){
		// 常用询价
		$.post("/validate/checksession.a?timeStamp=" + new Date().getTime(),
			 function(data) {
				if (data == "invalid") {
					TradeHeadCls.doLoginInput();
					return;
				}else{
					if("" != _subTab){// 为空，则为分页调用，则不更改子标签的值，直接翻页
						subTab = _subTab;	
					}
					// 初始化个人询价、常用询价选中
					initSubTabSelected();
					if(subTab == "tab_myBargin"){// 个人询价
						doLoadList(page);
					}else if (subTab == "tab_commBargin" ){// 常用询价
						td_submit.loadCommonUse(1);
					}else if ( subTab == "tab_manageBargain" ){// 议价管理
						td_submit.loadNotice(0,1);
					}
				}
		});
	}
	// 加载议价管理通知
	td_submit.loadNoticeCount();
	// 使用全局查询
	if("" != barGinSearchData.searchBuySell && null != barGinSearchData.searchBuySell){
		if(_subTab != "tab_default"){
			// 清除全局搜索条件
			barGinSearchData.searchBuySell = "";
			barGinSearchData.searchKey = "";
		}
		// 使用全局查询，则清除所有条件
		$("div.product_change_div >span").removeClass("on");
		$("div.product_change_div").find("span:first").addClass("on");
		// 初始化查询条件
		td_submit.initParamData();	
	}

}
// 初始化tab样式
function initSubTabSelected(){
	// 去除原来选中样式
	$("li.tab_sub").removeClass("li_on");
	// 询价商城子tab样式
	$("li[name="+subTab+"]").addClass("li_on");
}

// 公开议价
function beginNego(obj,index)
{
	var tradeMode = $("#payMethod_"+index).attr("tm");
	qp_common.tradeModePayMethod('payMethod_'+index,tradeMode);
	
	var _bot =$(obj).parents('.listingNew_list').find('.listingNew_list_bot');
	if (_bot.css('display')=='none'){
		_bot.show();
	}else{
		_bot.hide();
	}
}

// 快速发布弹出框
function openQuickSend(){	
	_isCncel = true;// 默认操作成功
	var productType=barGinSearchData.productType;
	var winW = "720px";
	var winH = "580px";
	var curSysWidth = $(window).width();
	var curSysHeight = $(window).height();
     if(curSysWidth <= 720){
    	 winW = (curSysWidth-20)+"px";
     }
     if(curSysHeight <= 580){
    	 winH = (curSysHeight-90)+"px";
     }
    
	// 查看session是否过期
	$.post("/validate/checksession.action?timeStamp=" + new Date().getTime(),
		 function(data) {
			if (data == "invalid") {
				TradeHeadCls.doLoginInput();
				return;
			}else{
				
			  layer.open({
				    type: 2,
				    zIndex: 1000,
				    shade: 0.5,
				    title: '快速发布',
				    area:[winW,winH],
				    fix:true, // 固定
				    maxmin: false,
				    closeBtn:1,
				    content:_ctx+'/qp/quickSendView.a?productType='+productType,
				    cancel: function(){ // 用户手动关闭
				    	// alert("关闭了;");
				        // 右上角关闭回调
				    },end : function(){// 用户手动或者系统关闭回调
				    }
				});
			}
		}
	);
}
// 1v1竞价
function competeOne(obj,submitId,sessionId,tag)
{
	var myUserId = $('#myUserId').val();
	var winW = "820px";
	var winH = "590px";
	var curSysWidth = $(window).width();
	var curSysHeight = $(window).height();
     if(curSysWidth <= 840){// 仅针分辨率800
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
					if(myUserId == $(obj).attr("uid") || "true" == _isMyRequest)
					{
						layer.msg(_nogoErrMsg);		
						return;
					}	
					if(tag == "notice")
					{			
						$(obj).removeClass("info_button_bli");
						$(obj).addClass("info_button");
					}	
					window.preView = $(obj).parents(".listingNew_list").find(".a_contact");
					
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


// 合同预览 新
function viewContract(submitId,productType,companyTag,anonymousTag,requestUserId){
	var winW = "950px";
	var winH = "600px";
	var curSysWidth = $(window).width();
	var curSysHeight = $(window).height();
    if(curSysWidth <= 950){
    	 winW = (curSysWidth-40)+"px";
    }
    winH = (curSysHeight-70)+"px";
			  layer.open({
				    type: 2,
				    zIndex: 1000,
				    shade: 0.5,
				    title: "合同明细",
				    area:[winW,winH],
				    fix:true, // 固定
				    maxmin: false,
				    content:_ctx+'/qp/getTemplateContentByAjax.a?submitId='+submitId+'&productType='+productType+'&companyTag='+companyTag+'&anonymousTag='+anonymousTag+'&requestUserId='+requestUserId
				});
}


// 公开议价
function quickSend2(obj,submitId,i,paymethod,negoType){
	 
	 $.post("/validate/checksession.a?timeStamp=" + new Date().getTime(),
			 function(data) {
				if (data == "invalid") {
					TradeHeadCls.doLoginInput();
					return;
				}else{
					doYijiao(obj, submitId, i, paymethod, negoType);
				}
		});
	 
}
// 公开议价
function doYijiao(obj,submitId,i,paymethod,negoType){
	var productType = $(obj).attr("productType");
	var number = $("#num_"+i).val();
	var price = $("#price_"+i).val();
	var hour = $("#hour_"+i).val();
	var minute = $("#minute_"+i).val();
	var paymethod = $("#payMethod_" + i).val();
	var tradeMode = $("#payMethod_" + i).attr('tm');;
	var r_int = /^[0-9]*$/;
	var r_float = /^\d+(\d|(\.[1-9]{0,2}))?$/;
	if(productType.indexOf("GT") > -1){
		productType = "GT";
	}
	// 单价
	var numberCfg = loadData({url: _ctx+"/qp/getProductConfigStrAjax.a",productType:productType,prop:"PRICECFG",tradeMode:$('#qk_tradeMode').val(),tradeMode:tradeMode});
	if (numberCfg){
		var rest = sptValid.validNum(price,numberCfg,"单价");
		if(rest.result==false)
		{
			layer.msg(rest.msg);
			$("#price_"+i).focus();
			return;
		}
	}
	// 数量
	var numberCfg = loadData({url: _ctx+"/qp/getProductConfigStrAjax.a",productType:productType,prop:"NUMBERCFG"});
	// console.log('cfg',numberCfg);
	if (numberCfg){
		var rest = sptValid.validNum(number,numberCfg,"数量");
		if(rest.result==false)
		{
			layer.msg(rest.msg);
			$("#num_"+i).focus();
			return;
		}
	}
	
	if(hour == 0 && minute == 0)
	{
		layer.msg("请输入有效时间");
		return 						
	}
	// 加载层-默认风格
    layer.load();
	$.ajax({
		type:'post',
		url:_ctx+'/nego/quickNego.a?timeStamp=' + new Date().getTime(),
		data:{	
			productType:productType,
			opSubmitId : submitId, 
			number : number,          
			price : price,			 
			paymethod : paymethod,	 
			hour:hour,
			minute:minute,
			negoType : negoType
		},
		success:function(data){
			 layer.closeAll('loading');
			var result = sptUtility.parseAjaxResult(data);
			if(result.result_flag == false)
			{
				layer.msg(result.error_msg);
				return;
			}
			
			layer.msg("发送成功！");
			doLoadList('1');
		}

	});
}

