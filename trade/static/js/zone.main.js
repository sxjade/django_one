var EzMainCls = {
	init : function() {
		this.initNode();
		this.bindEvent();
		this.zoneReqHeader();
		this.initData();
	},initData:function(){
			// 存储行业
			this.saveIndustry();
			// 最新成交
			EzMainCls.loadLatestDeal();
			$('body').everyTime('60s', function() {
				EzMainCls.loadZoneOrderList();
			});
			//挂单头根据滚动条显示
			$(window).scroll(function(e) {
				EzMainCls.zoneReqHeader();
			});
			//右侧菜单滚动事件
			$(window).scroll(function(e) {
				EzMainHeaderCls.leftMenuMove();
			});
			$(window).resize(function() {
				EzMainHeaderCls.leftMenuMove();
			});
	},
	initNode : function() {
		//内容区域
		this.$divZoneContent = $("#jqDiv-zone-content");
		// 最近成交
		this.$UlLatestDealContent = $("#jq-latestDeal-content");
		// 供应商区域
		this.$coreSupContent = $("#jqUl-coreCompanyContent");
		// 专区产品区域展示
		this.$pContent = $("#jqDiv-pcontents");
	},bindEvent : function() {// 事件绑定
		// 加入核心供应商
		this.$divZoneContent.delegate("#jq-joinCoreSup", "click", this.joinCoreSup);
		 //挂单详情
		this.$divZoneContent.delegate(".jq-view-detail", "click", this.toViewReqDetail);
		//产品近五天曲线图
		this.$divZoneContent.delegate(".jq-viewIndexChart", "click", this.viewIndexChart);
	},
	loadCoreSupList : function(productType) {// 重新加载核心供应商
		if ("myorder" != queryParam.home) {
			$.post(_ctx + "/zone/cSupCompany.a", {
				productType : productType,
				actType : 'zoneSup',
				pageSize : 100
			}, function(rHtml) {
				if (rHtml.contains("\\|")) {// 自定义异常
					rHtml = "";
				}
				EzMainCls.$coreSupContent.html(rHtml);
			});
		}
	},toViewReqDetail:function(){
		var requestId = $(this).attr("request-id") || queryParam.requestId || "";
		queryParam.home = "reqdetail";
		window.location.href = [_ctx,"/zone/",industry.toLowerCase(),"/","requestDetail","/",requestId.toLowerCase(),".a"].join('');
	},	
	viewIndexChart : function() {// 近五天指数图
		var winW = "720px";
		var winH = "500px";
		var curSysWidth = $(window).width();
		var curSysHeight = $(window).height();
		if (curSysWidth <= 720) {
			winW = (curSysWidth - 20) + "px";
		}
		if (curSysHeight <= 500) {
			winH = (curSysHeight - 90) + "px";
		}
		var requestId = $(this).attr("request-id");
		var productType = $(this).attr("product-name");
		layer.open({
			type : 2,
			zIndex : 1000,
			shade : 0.5,
			title : [ '<b>', productType, '</b>一周指数走势' ].join(''),
			area : [ winW, winH ],
			fix : true, // 固定
			maxmin : false,
			closeBtn : 1,
			content : [ _ctx, '/zone/loadProductLatestIndex.a?requestId=', requestId ].join(''),
			cancel : function() { // 用户手动关闭
				// alert("关闭了;");
				// 右上角关闭回调
			},
			end : function() {// 用户手动或者系统关闭回调
			}
		});
	},
	joinCoreSup : function() {// 加入核心供应商
		window.location.href = _ctx + "/zone/zoneApply/join_core_sup.a";
	},
	loadZoneOrderList : function(pageNo) {
		EzMainHeaderCls.initQueryParam();
		pageNo = pageNo || queryParam.pageNo || 1;
		queryParam.pageNo = pageNo;
		if (!window.WebSocket) {// 不支持html5 websocket,使用主动请求
			// 加载最近成交
			EzMainCls.loadLatestDeal();
		}
		$.post(_ctx + "/zone/loadList", queryParam, function(rtData) {
			EzMainCls.$pContent.html(EzMainHeaderCls.buildHtml(rtData));
			EzMainHeaderCls.leftMenuMove();
		});
	},
	loadLatestDeal : function() {
		$.post(_ctx + "/zone/loadLatestDeal", queryParam, function(rtData) {
			EzMainCls.$UlLatestDealContent.html(rtData);
			if (rtData.contains('li')) {
				EzMainCls.$UlLatestDealContent.removeClass("hide");
			} else {
				EzMainCls.$UlLatestDealContent.addClass("hide");
			}
		});

	},
	saveIndustry : function() {
		if (typeof (sessionStorage) != undefined) {
			// 支持会话存储
			sessionStorage.setItem("industry", industry);
			if ("" != $(".jq-zone").text()) {
				sessionStorage.setItem("industryName", $(".jq-zone").text());
			}
		}
	},
	getIndustryName : function() {
		var industryName;
		if (typeof (sessionStorage) != undefined) {
			industryName = sessionStorage.getItem("industryName");
		}
		if (!industryName || industryName === "") {
			industryName = "基础化工";
		}
		return industryName;
	},
	closeWin : function() {// 弹出窗体关闭
		var index = layer.getFrameIndex(window.name);
		layer.close(index);
	},
	zoneReqHeader:function(){//专区挂单头部显示事件
		if($("#jq-req-header").length > 0){
			//console.log('st:'+$(window).scrollTop())	;
		if ($(window).scrollTop() != undefined && $(window).scrollTop() > 215)
			$("#jq-req-header").fadeIn();
		else
			$("#jq-req-header").fadeOut();
		}
	}
}
//通用方法
function loadList(){
	EzMainCls.loadZoneOrderList();	
}
// JavaScript Document
$(function() {
	EzMainCls.init();
});
