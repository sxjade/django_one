//我的商品通是否登陆
var isCheckUserSiteLogin = false;
var IndexCls = {
	init : function() {
		this.initNode();
		this.bindEvent();
		this.loadLatestDealNotify();
		this.getIndexMark("HG_CL_YE"); // 获取首页指数仓库走势图,默认获取苯乙烯 HG_FT_BY HG_CL_YE
		this.checkBindAcctInfo(); //检验是否收到企业邀请信息
		this.initData();
	},initData:function(){
		//每天分钟请求一次最新成交
		$('body').everyTime('120s', function() {
			IndexCls.loadLatestDealNotify();
		});
	},
	initNode : function() {
		// 询价商城
		this.$queryPrice = $(".jq-btn-queryPrice");
		// 商品专区
		this.$zone = $(".jq-btn-zone");
		// 通通
		this.$lineTT = $(".jq-btn-lineTT");
		this.$productName = $(".productName");
		//最近成交区域
		this.$latestDealContent = $("#jqDiv-latestDeal-Content");
	},
	bindEvent : function() {
		// 登陆
		$("div.btn-login").on("click", this.login);
		// 注册事件
		$("div.btn-register").on("click", this.register);
		// 注销事件
		$("div.btn-logout").on("click", this.logout);
		// 开发中提示
		$(".btn-undevp").on("click", function() {
			layer.msg("开发中。。。");
		});
		// 公告更多
		$("#jq-notify-more").on("click", this.notifyMore);
		// 新闻更多
		$("#jq-news-more").on("click", this.newsMore);
		// 公司通告事件
		$(".notice-div").on("click", this.viewNotify);
		// 询价商城div
		this.$queryPrice.on('click', this.jumpXj);
		// 专区div
		this.$zone.on('click', this.jumpZone);
		// 通通
		this.$lineTT.on('click', this.lineTT);
	},
	jumpXj : function() {
		window.location.href = _ctx + "/qp/queryPrice.a";
	},
	jumpZone : function() {
		window.location.href = _ctx + "/zone.a";
	},
	lineTT : function() {
		var isLogin = false;
		$.ajax({
			url : _ctx + "/validate/checksession.a?timeStamp=" + new Date().getTime(),
			async : false,
			success : function(resultData) {
				if (resultData == "invalid") {
					layer.confirm('您还没有登录，请先登录！', {
						icon : 3
					}, function(index) {
						layer.close(index);
						window.location.href = cas + "cas/login?service=" + window.document.location.href;
					});
				} else {
					isLogin = true;
				}
			}
		});
		if (isLogin) {
			window.open(_ctx + "/mobile/im/check/main", "_blank");
		}
	},
	getIndexMark : function(productType) {
		$.post(_ctx + '/zone/loadIndex/' + productType, {}, function(data) {
			var xAxis = [];
			var series = [];
			var indexArray = [];
			var productName = "苯乙烯";
			for ( var i in data) {
				var row = data[i];
				xAxis.push(row.indexTimeStr.substring(5));
				indexArray.push(row.indexNumber);
				productName = row.productName;
			}
			IndexCls.$productName.html(productName + "一周走势");
			series.push({
				name : '数值',
				data : indexArray
			});
			Highcharts.chart('jq-indexChart', {
				title : {
					text : ''
				},
				xAxis : {
					categories : xAxis,
					tickmarkPlacement : 'on'
				},
				yAxis : {
					title : {
						text : ''
					},
					tickPixelInterval : 5,
					plotLines : [ {
						value : 0,
						width : 1,
						color : '#808080'
					} ]
				},
				tooltip : {
					valueSuffix : ''
				},
				legend : {
					layout : 'vertical',
					align : 'right',
					verticalAlign : 'middle',
					borderWidth : 0,
					x : 200
				},
				series : series,
				exporting : {
					enabled : false
				},
				credits : {
					enabled : false
				},
				// chart: {
				// type: 'line',//设置图表样式
				// marginRight: 5,//右边间距
				// marginBottom: 59//底部间距/空隙
				// },
				lang : {
					noData : "暂无数据"
				}
			});
		});
	},
	register : function() {
		window.location.href = "/user/reg/";
	},
	login : function() {
		if ("" == cas) {
			$.post("/fwd/getCassAddr", function(rData) {
				$("#getCasAddress").html(rData);
				var urlList = $.trim(rData).split(">");
				if (urlList.length > 1) {
					cas = urlList[1];
				}
				window.location.href = cas + "cas/login?service=" + window.document.location.href;
			});
			return;
		}
		window.location.href = cas + "cas/login?service=" + window.document.location.href;
	},
	logout : function() {
		layer.confirm('确认退出吗？', {
			icon : 3
		}, function(index) {
			layer.close(index);
			window.location.href = _ctx + '/logout.a';
		});
	},
	notifyMore : function() {
		window.location.href = _ctx + '/nv/loadNotifyList.a?notifyType=1';
	},
	viewNotify : function() {
		var _noticeId = $(this).attr("noticeId");
		if (_noticeId == "") {
			return;
		}
		window.location.href = _ctx + "/nv/viewNotify/" + _noticeId + ".a";
	},
	newsMore : function() {
		window.location.href = _ctx + '/nv/loadNotifyList.a?notifyType=0';
	},checkBindAcctInfo:function(){ //查询自由人是否收到绑定企业信息
		$.post(_ctx + "/validate/checksession.a?timeStamp=" + new Date().getTime(),{},function(resultData){
			if (resultData == "invalid") {
			} else {
				if(!IndexCls.checkUserSiteLogin()){return;}
				$.post(_ctx+'/common/checkBindAcctInfo.a',{},function(result){ //是否收到企业邀请信息
					if(result){
						var companyTag = result.companyTag || "";
						var configGroupId = result.configGroupId || "";
						var companyName = result.companyName || "";
						var configVal = "";
						if(configGroupId.indexOf("T") > -1){
							configVal = [configVal,"交易"].join('');
						}
						if(configGroupId.indexOf("F") > -1){
							if(configGroupId.indexOf("T") > -1){
								configVal = [configVal,"/"].join('');
							}
							configVal = [configVal,"资金"].join('');
						}
						if(configGroupId.indexOf("D") > -1){
							if(configGroupId.indexOf("T") > -1 || configGroupId.indexOf("F") > -1){
								configVal = [configVal,"/"].join('');
							}
							configVal = [configVal,"物管"].join('');
						}
						if($.trim(configVal) == ''){
							configVal = "二级";
						}
						configVal = [configVal,"帐号"].join('');
						var params = new Object();
						params.companyTag = companyTag;
						layer.confirm([companyName,"公司邀请你成为",configVal,"，确认加入？"].join(''), 
								{ icon:3,
								  btn: ['接受','拒绝'], 
								  btn1:function(){
									  params.optionTag = "1";
									  IndexCls.submitBindAcct(params);
								  }, 
								  btn2: function () {
									  params.optionTag = "0";
									  IndexCls.submitBindAcct(params);
								  }
								}
						);
					}
				});
			}
		});
//			}
//		});
	},submitBindAcct:function(params){
		layer.load();
		var index = layer.getFrameIndex(window.name);
		$.post(_ctx+'/user/common/updateUserCompany.a',params,function(result){
			layer.closeAll('loading');
			var datas = sptUtility.parseAjaxResult(result,"success");
			if(!datas.result_flag){
				parent.layer.msg(datas.error_msg);				
				return false;
			}
			var $lineHeight = $('#content').height(); 
			var height = $lineHeight / 2 - 100;
			layer.msg( '操作成功！',{icon: 1, offset:height+'px'});
		});
	},loadLatestDealNotify:function(){//加载最新成交
		$.post(_ctx+"/latestDealNotify.a",function(dealHtml){
			if(scrollTimer){
				 clearInterval(scrollTimer); 
			 }
			 IndexCls.$latestDealContent.html(dealHtml);
			 if(!scrollTimer){
				//新换开 始切换
				doStartSolid(); 
			 }else{
				 $('div.scrollNews').mouseout();
			 }
		});
	},checkUserSiteLogin:function(){//查看我的商品通是否已登陆，未登陆尝试模拟登陆一次
		$.ajax({
			url :_ctx+"/user/validate/checksession.a?timeStamp=" + new Date().getTime(),
			async : false,
			success : function(resultData) {
						if (resultData == "invalid"){
								var curUrl = document.location.toString();
								var pathName = window.location.pathname; //返回/a/index.php或者/index.php  
								curUrl = curUrl.replace(pathName,'')
								if(curUrl.indexOf("?") > -1){
									curUrl = curUrl.split('?')[0];
								}
								try{
									//跨域需要使用jsonp
									$.ajax({
									url :cas+"cas/login?service="+curUrl+"/user/acct/checkLoginStatus.a",
									async : false,
							          dataType: "jsonp",
							          jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
							          jsonpCallback:"successCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你
						             success : function(checkLoginData) {
							            	 //console.log('success：',checkLoginData);
							            	 if(checkLoginData.isLogin){
							            			isCheckUserSiteLogin = true;
						            		}
										},
										error: function(xhr){
											console.log('fail',xhr);										  
							             }
										
									});
								}catch(err)	{
									console.log('efail',err);
								}
						}else{
							isCheckUserSiteLogin = true;
						}
					}
				});
	  	console.log('isCheckUserSiteLogin:'+isCheckUserSiteLogin);
		return isCheckUserSiteLogin;
	}
}
//我的商品通登陆回调
function successCallback(result){
	//console.log("successCallback",result);
	if(result.isLogin){
		isCheckUserSiteLogin = true;
	}
}
var scrollTimer = null; 
var delay = 5000; 
//1.鼠标对新闻触发mouseout事件后每2s调用scrollNews() 
//2.鼠标对新闻触发mouseover事件后停止调用scrollNews() 
//3.初次加载页面触发鼠标对新闻的mouseout事件 
//滚动新闻 
function scrollNews() { 
	try{
	var $news = $('div.scrollNews>ul'); 
	var $lineHeight = $news.find('li:first').height(); 
		$news.animate({ 'marginTop': -$lineHeight + 'px' }, 600, function () { 
		$news.css({ margin: 0 }).find('li:first').appendTo($news); 
	}); 
	}catch(ee){
		
	}
}         
//切换新闻
function doStartSolid(){
	$('div.scrollNews').hover(function () { 
		clearInterval(scrollTimer); 
		}, function () { 
		scrollTimer = setInterval(function () { 
		scrollNews(); 
		}, delay); 
		}).triggerHandler('mouseout'); 
};
$(function() {
	IndexCls.init();
});
