var _prodcutTypeUrl = _ctx + "/pt/getProductType.a";
var _placeUrl = _ctx + "/pt/getPlace.a";
// 查询参数
var queryParam = new Object();
var industry;
var EzMainHeaderCls = {
	init : function() {
		this.initNode();
		this.bindEvent();
		this.initData();
	},initData:function(){
		industry = $("#industry").val();
		// 第 一个选中,同时加载数据
		if(this.$eConds.find("div[name=secClassif] span").length > 0){
			this.$eConds.find("div[name=secClassif] span:first").click();
		}
	},
	initNode : function() {
		//当前位置区域
		this.$divLocationPanel = $("#jqDiv-location-panel");
		// 条件内容体
		this.$divCondBody = $("#jqDiv-condBody");
		// 查询条件区域
		this.$eConds = $("#jq-econds");
		//内容区域
		this.$bodyPanel= $("#jq-bodyPanel");
		// 创建卖单
		this.$sellOrder = $("#jq-btnSellOrder");
		// 创建买单
		this.$buyOrder = $("#jq-btnBuyOrder");
		// 我的订单
		this.$myOrder = $("#jq-btnMyOrder");
		// 我的库存
		this.$myStock = $("#jq-btnMyStock");
		// 最近成交
		this.$latestDeal = $("#jq-btnLatestDeal");
	},
	bindEvent : function() {// 事件绑定
		// 子查询条件事件托管
		this.$eConds.delegate(".jq-esubconds span", "click", this.subCondClickEvent);
		this.$eConds.delegate("li", "mouseover", this.condS);
		this.$eConds.delegate("li", "mouseout", this.condH);
		// 跳转到专区大类主页
		this.$divLocationPanel.delegate(".jq-home", "click", this.zoneHome);
		// 跳转到专区中心
		this.$divLocationPanel.delegate(".jq-zone", "click", this.zoneCenter);
		
		this.$sellOrder.on("click", this.createSellOrder);
		this.$buyOrder.on("click", this.createBuyOrder);
		this.$myOrder.on("click", this.myOrder);
		this.$myStock.on("click", this.myStock);
		this.$latestDeal.on("click", this.latestDeal);
		// 点击挂单中的了报价查看报价详情
		this.$bodyPanel.delegate(".jqP-offerItem", "click", this.doOfferDetail);
		// 我要卖，高的价格向上
		this.$bodyPanel.delegate(".jq-btnMyToSell,.jqP-createSellofferItem", "click", this.myToSell);
		// 我要买，低的下格向下
		this.$bodyPanel.delegate(".jq-btnMyToBuy,.jqP-createBuyofferItem", "click", this.myToBuy);
	},
	subCondClickEvent : function() {// 条件选中
		var cName = $(this).parent().attr("name");
		var cvalue = $(this).attr("val");
		// 点击对象需要执行的操作
		var cEvt = $(this).parent().attr("et");
		if (queryParam[cName] == cvalue) {// 点击的对象是当前对象，则不做操作
			return;
		} else {// 设置选择的条件名称
			var condHeader = $(this).parent().parent().find("span:first");
			var title = condHeader.attr("title");
			if (!title) {
				title = condHeader.text()
				condHeader.attr("title", title);
			}
			if ("不限" === $(this).text()) {
				condHeader.text(title);
			} else {
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
			queryParam[cName] = cvalue;
			if ("eProductFilter" == cEvt) {// 需要根据类别过滤具体品名
				$("div[name=productType] span").hide();
				// 第一个不限品名显示并显示为选中
				$("div[name=productType] span:first").show().addClass("on").siblings().removeClass("on");
				$("div[name=productType] span[val^=" + cvalue + "]").show();
				$("div[pl^=" + level + "]").parent().each(function(condHeader){
					var condHeader = $(this).find("span:first");
					var title =condHeader.attr("title");
					condHeader.text(title);
				});
				// 需要重新加载核心供应商
				if(typeof(EzMainCls) != "undefined"){
				EzMainCls.loadCoreSupList(cvalue);
				}
				if($("div[name=productType]").find("span:first").hasClass("on")){
				    //品名不限则交货地、产地、质量标准都只显示“不限”，其子项都删除
					$("div[dpl=p00]").find("span:first").siblings().remove();
				}
			} else if ("eReloadCondit" == cEvt) {// 需要重新加载核心供应商、质量标准、原产地址、交货地
				if(typeof(EzMainCls) != "undefined"){
					EzMainCls.loadCoreSupList(cvalue);
				}
				if(!$("div[name=productType]").find("span:first").hasClass("on")){
					EzMainHeaderCls.getQualityAjax();
					EzMainHeaderCls.getProductPlaceAjax();
					EzMainHeaderCls.getDeliveryPlaceAjax();
				}else{//品名不限则交货地、产地、质量标准都只显示“不限”，其子项都删除
					$("div[dpl=p00]").find("span:first").siblings().remove();
					//醇类默为不限
					$("div[name=secClassif]").find("span:first").addClass("on").siblings().removeClass("on");
				}
				$("div[pl^=" + level + "]").parent().each(function(condHeader){
					var condHeader = $(this).find("span:first");
					var title =condHeader.attr("title");
					condHeader.text(title);
				});
			}
			// 相应的选中样式要重新刷新
			$("div[pl^=" + level + "]").find("span:first").addClass("on").siblings().removeClass("on");
		}
		if(typeof(loadList) != "undefined"){
		//加载数据
		loadList();
	 }
	},// 产地
	getProductPlaceAjax : function() {
		this.getProductConfig($("div[name=productPlace]"), "PRODUCTPLACECFG", "productPlace");
	},
	// 交货地
	getDeliveryPlaceAjax : function() {
		this.getProductConfig($("div[name=deliveryPlace]"), "DELIVERYPLACECFG", "deliveryPlace");
	},
	// 质量标准
	getQualityAjax : function() {
		this.getProductConfig($("div[name=productQuality]"), "QUALITYCFG", "productQuality");
	},
	getProductConfig : function(sDom, prop, dictCat) {
		var productType = queryParam.productType;
		if (productType != "") {
			var jsonDta = {
				productType : productType,
				prop : prop,
				dictCat : dictCat
			};
			var actionUrl = _ctx + "/qp/getProductConfigAjax.a";
			$.ajax({
				url : actionUrl,
				data : jsonDta,
				async : true,
				success : function(data) {
					sDom.empty();
					var _domList = new Array();
					// 不限
					_domList.push('<span href="javascript:void(0);" class="on" val="">不限</span>');
					if (data != null && data.length != 0) {
						for (var i = 0; i < data.length; i++) {
							_domList.push([ '<span  href="javascript:void(0);"', (i > 11 ? ' style="display:none"' : ''), ' val="', data[i].value, '">', data[i].name, '</span>' ]
									.join(''));
						}
						// 元素添加
						$(sDom).html(_domList.join(''));
					}
				},
				error : function() {
				}
			});
		}
	},initQueryParam : function() {// 构建查询条件
		$.each(this.$eConds.find(".jq-esubconds span.on"), function() {
			var _pName = $(this).parent().attr("name");
			var _pVal = $(this).attr("val");
			queryParam[_pName] = _pVal;
		});
		if (industry == queryParam.productType) {// 如果品名为不限则使用类别大类查询
			queryParam.productType = queryParam.secClassif;
		}
	},
	createSellOrder : function() {// 创建卖单
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		var winW = "720px";
		var winH = "650px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 650) {
			winH = (curSysHeight - 90) + "px";
		}
		layer.open({
			type : 2,
			zIndex : 1000,
			shade : 0.5,
			title : '创建卖单',
			skin: 'zone-layer-sell',
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : _ctx + '/zone/createSellOrder.a?buySell=S&productType=' + queryParam.productType,
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},
	createBuyOrder : function() {// 创建买单
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		var winW = "720px";
		var winH = "620px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (queryParam.productType.indexOf('SL') > -1) {
			winH = "640px";
			if (curSysHeight <= 640) {
				winH = (curSysHeight - 90) + "px";
			}
		} else {
			if (curSysHeight <= 580) {
				winH = (curSysHeight - 90) + "px";
			}
		}
		layer.open({
			type : 2,
			zIndex : 1000,
			shade : 0.5,
			title : '创建买单',
			skin: 'zone-layer-buy',
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : _ctx + '/zone/createOrder.a?buySell=B&productType=' + queryParam.productType,
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},
	myOrder : function() {// 我的订单|变更订单
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		window.location.href = [ _ctx, '/zone/', industry.toLowerCase() + '/myorder/my_request.a' ].join('');
		return;
	},
	myStock : function() {
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		window.location.href = [ _ctx, '/zone/', industry.toLowerCase() + '/myorder/my_stock.a' ].join('');
		return;
	},
	latestDeal : function() {// 最新成交
		// var winW = "750px";
		// var winH = "560px";
		var winW = "680px";
		var winH = "560px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 650) {
			winH = (curSysHeight - 90) + "px";
		}
		console.log(winW,winH)
		layer.open({
			type : 2,
			zIndex : 1000,
			shade : 0.5,
			title : '最新成交',
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : _ctx + '/zone/latestDealList.a?productType=' + queryParam.productType,
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},
	doOfferDetail : function() {
		// 校验用户登陆状态
		/*
		 * if (!TradeHeadCls.checkLogin()) { return; }
		 */
		var winW = "720px";
		var winH = "620px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 620) {
			winH = (curSysHeight - 90) + "px";
		}
		var requestId = $(this).attr("request-id");
		var offerId = $(this).attr("offer-id");
		var buySell = $(this).attr("buy-sell");
		// console.log('b:'+buySell);
		var url = [ _ctx, '/zone/requestOfferDetail.a?matchOfferId=', offerId ].join('');
		if ("B" == buySell) {
			url = [ _ctx, '/zone/offerBuyDetail.a?matchOfferId=', offerId ].join('');
		}
		layer.open({
			type : 2,
			zIndex : 1000,
			shade : 0.5,
			skin: 'zone-layer-'+("B" == buySell ? 'buy' : 'sell'),
			title : [ ("B" == buySell ? '买方' : '卖方'), '订单详情' ].join(''),
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : url,
			cancel : function() { // 用户手动关闭
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},myToSell : function() {// 我要卖
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		var winW = "720px";
		var winH = "650px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 650) {
			winH = (curSysHeight - 90) + "px";
		}
		var requestId = $(this).attr("request-id");
		var productType = $(this).attr("product-type");
		layer.open({
			type : 2,
			skin: 'zone-layer-sell',
			zIndex : 1000,
			shade : 0.5,
			title : '创建卖单',
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : [ _ctx, '/zone/req/my_to_sell.a?buySell=S&requestId=', requestId, '&productType=', productType ].join(''),
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},
	myToBuy : function() {// 我要买
		// 校验用户登陆状态
		if (!TradeHeadCls.checkLogin()) {
			return;
		}
		var winW = "720px";
		var winH = "470px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 650) {
			winH = (curSysHeight - 90) + "px";
		}
		var requestId = $(this).attr("request-id");
		var productType = $(this).attr("product-type");
		layer.open({
			type : 2,
			skin: 'zone-layer-buy',
			zIndex : 1000,
			shade : 0.5,
			title : '创建买单',
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : [ _ctx, '/zone/req/my_to_buy.a?buySell=B&requestId=', requestId, '&productType=', productType ].join(''),
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},buildHtml : function(retHtml) {
		if (retHtml.contains("jqDiv-sysError")) {// 500错误
			retHtml = EzMainHeaderCls.errHTML("程序异常", "500");
		} else if (retHtml.contains("\\|")) {// 自定义异常
			var errMsgs = retHtml.split('|');
			retHtml = EzMainHeaderCls.errHTML(errMsgs[0], errMsgs[1]);
		} else {// 数据直接展示

		}
		return retHtml;
	},
	errHTML : function(errMsg, errorId) {// 页面出错
		var html = [ '<div class="error_admin">', '<div class="error_bg">', '<span class="span1">', errMsg, '</span>', '<span class="span2">', errorId, '</span>', '</div>',
				'</div>' ].join('');
		return html;
	},
	buildLocation : function(curLocation) {
		return [ '<span class="float_left">您现在的位置：</span>', '<span class="float_left cursor jq-home">专区首页</span>', '<span class="float_left">></span>',
				'<span class="float_left  cursor jq-zone">基础化工</span>', '<span class="float_left">></span>', '<span class="float_left colorLan">', curLocation, '</span>' ]
				.join('');
	},
	zoneHome : function() {// 跳转专区
		window.location.href = _ctx + "/zone.a";
	},
	zoneCenter : function() {// 跳转专区中心
		window.location.href = _ctx + "/zone/" + $("#industry").val().toLowerCase() + ".a";
	},
	condS : function() {
		$(this).find(".product_classify").show();
	},
	condH : function() {
		$(this).find(".product_classify").hide();
	},
	leftMenuMove:function(){//右侧菜单滚动事件
		var wHeight =$(window).height();
		var dHeight =$(document).height();
//		console.log(wHeight,dHeight);
//		console.log($('#jq-req-header2').offset(),$('#jq-req-header2').width(),$(window).width());
		var right = $(window).width()-$('#jqDiv-condBody').offset().left-1200-70;
//		if (wHeight<dHeight){
//			right = right-9;
//		}
//		console.log(right);
		$('.list_navigation').css('right',right).css("display","block");
	}
	
}
// JavaScript Document
$(function() {
	EzMainHeaderCls.init();
});
