var allNotifyWin = null;//推送消息窗体
//定时器推送消息
var iMsgInterv = null;
//我的商品通是否登陆
var isCheckUserSiteLogin = false;
var TradeHeadCls = {
		init:function(){
			this.initNode();
			this.initBindEvent();
			this.initData();
			this.checkUserInfo();
		},
		initNode:function(){
			this.$uNotifyContent = $("#jq-uNotify-content");
			this.$liPushMsg = $("#jq-sys-notify");
		},initData:function(){
			this.loadUserNotify();
		},initBindEvent:function(){
			//自由人需要升级
			$(".jq-upgradeCompany").on("click",this.upgradeCompany);
			//登陆
			$("#login,.btn-login").on("click",this.login);
			//注册事件
			$("#register,.btn-register").on("click",this.register);
			//注销事件
			$("#logout,.btn-logout").on("click",this.logout);
			//消息鼠标移动事件
			this.$liPushMsg.on("mouseover",this.notifyTipExpand);
			this.$liPushMsg.on("mouseout",this.notifyTipCollapse);
			//菜单事件
			$("li[jq-mtype],span[jq-mtype]").on("click",this.switchMenu);
			//子菜单展开与折叠
			$("li.jq-selMenu").on("mouseover",this.menuExpand);
			$("li.jq-selMenu").on("mouseout",this.menuCollapse);
			//切换询价商成
			$("div.jq-qp-menus").on("click","span",this.switchQp);
			//切换专区
			$("div.jq-zone-menus").on("click","span",this.switchZone);
			//查看更多通知
			this.$uNotifyContent.delegate(".btn_notify_more","click",this.viewAllNotify);
		},switchMenu:function(){//菜单切换
			var mtype = $(this).attr("jq-mtype");
			var mUrl = TradeHeadCls.menuMap[mtype];
			if(mUrl){
				if (mtype=='tt'){
					window.open(mUrl);
				}else{
					window.location.href = mUrl;
				}
			}else if("cusService" === mtype){
				$(".layer-4").click();
			}
		},doLoginInput:function (){
			layer.confirm('您还没有登录，请先登录！', {icon: 3}, function(index){
			    layer.close(index);
				window.location.href=cas+"cas/login?service="+window.document.location.href;
			});
		}, /**
		  * 校验当前用户登陆状态
		  * @param callBack
		  */
		checkLogin:function (){
			var isLogin = false;
			$.ajax({
				url :ctx+"/validate/checksession.a?timeStamp=" + new Date().getTime(),
				async : false,
				success : function(resultData) {
							if (resultData == "invalid"){
								TradeHeadCls.doLoginInput();
							}else{
								isLogin = true;
							}
						}
					});
			return isLogin;
		},validUserStatus:function(){//判断用户状态，决定用户是否可以操作
			var isUserStatus = false;
			$.ajax({
				url :ctx+"/validate/validUserStatus.a?timeStamp=" + new Date().getTime(),
				async : false,
				success : function(resultData) {
						if("OK" != resultData ){
							layer.msg(resultData.split('\|')[0]);
						}else{//通过
							isUserStatus = true;
						}
				}
			});
			return isUserStatus;
		},upgradeCompany:function(){//自由人账户升级
			//是否登陆
			if(!TradeHeadCls.checkLogin()){return;}
			window.location.href =  _ctx+"/user/acct/toUpgradeCompany.a";
		},checkUserInfo:function (){
			$.post(ctx+'/common/checkUserInfo.a',{},function(result){
					if (result.failure && result.failure.indexOf("0") > -1){//自由人
						//显示头部账户升级
						$("#jq-personTip").removeClass('hide');
							var userId = result.failure.split('\:')[1];
							var isPerson = TradeHeadCls.readCookie(userId);
							if("p" != isPerson){
								layer.confirm('您当前为自由人用户无法进行交易操作,是否升级企业账户？', {
									  btn: ['去升级','不再提示'], btn1:function(index){
										  layer.close(index);
										  window.location.href= _ctx+"/user/acct/toUpgradeCompany.a";
						                }
						                , btn2: function (index) {
						                	layer.close(index);
											TradeHeadCls.setCookie(userId,"p");
											//查看是否有邀请记录
											TradeHeadCls.checkBindAcctInfo();
						                } //按钮
								},"",function(){
									TradeHeadCls.checkBindAcctInfo();
								});
							}else{
								TradeHeadCls.checkBindAcctInfo();
							}
					}else{
						TradeHeadCls.checkBindAcctInfo();
					}
			})
		},
		//写cookies 
		setCookie:function(name,value) { 
		    var days = 1;//默认1天不过期 
		    var exp = new Date(); 
		    exp.setTime(exp.getTime() + days*24*60*60*1000); 
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/"; 
		},
		//读取cookies 
		readCookie:function (name) {
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg)){
		        return unescape(arr[2]); 
		    }else{
		        return null;
		    }
		        
		},login:function(){	//登陆
			window.location.href=cas+"cas/login?service="+window.document.location.href;
		},register:function(){	//注册事件
			window.location.href="/user/reg/";
		},logout:function(){//注销事件、退出登陆
			layer.confirm('确认退出吗？', {icon: 3}, function(index){
			    layer.close(index);
			    window.location.href=ctx+'/logout.action';
			});
		},menuMap:{
			"about":ctx+"/fwd/a/ent_intro/",
			"home":ctx+"/index.a",
			"login":cas+"cas/login?service="+window.document.location.href,
			"m-app":ctx+"/fwd/app/down.a",
			"qp":ctx+"/qp/queryPrice.a",
			/*'rule':"",//内容未完善暂时不链接
*/			"tt":ctx+"/mobile/im/check/main",
			"zone":ctx+"/zone.a"
		},checkUserSiteLogin:function(){//查看我的商品通是否已登陆，未登陆尝试模拟登陆一次
			$.ajax({
				url :ctx+"/user/validate/checksession.a?timeStamp=" + new Date().getTime(),
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
		},checkBindAcctInfo:function(){ //查询自由人是否收到绑定企业信息
			$.post(_ctx + "/validate/checksession.a?timeStamp=" + new Date().getTime(),{},function(resultData){
				if (resultData == "invalid") {
				} else {
					//未登陆成功不调用
					  if(!TradeHeadCls.checkUserSiteLogin()){return;}
						$.post(ctx+'/common/checkBindAcctInfo.a',{},function(result){ //是否收到企业邀请信息
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
										TradeHeadCls.submitBindAcct(params);
									}, 
									btn2: function () {
										params.optionTag = "0";
										TradeHeadCls.submitBindAcct(params);
									}
										}
								);
							}
						});
				}
			});
		},submitBindAcct:function(params){
			layer.load();
			$.post(_ctx+'/user/common/updateUserCompany.a',params,function(result){
				layer.closeAll('loading');
				var datas = sptUtility.parseAjaxResult(result,"success");
				if(!datas.result_flag){
					parent.layer.msg(datas.error_msg);				
					return false;
				}
				layer.msg( '操作成功！',{icon: 1},function(){window.location.reload();});
			});
		},menuExpand : function() {
			$(this).find(".sel_industry").show();
		},
		menuCollapse : function() {
			$(this).find(".sel_industry").hide();
		},switchQp:function(){
			var productType = $(this).attr("menu");
			window.location.href = ctx +"/qp/queryPrice.a?productType="+productType;
		},switchZone:function(){
			var industry = $(this).attr("menu") || "";
			window.location.href = ctx +"/zone/"+industry.toLowerCase()+".a";
		},loadUserNotify:function(){//加载用户头部消息通知
			var that = this.$uNotifyContent;
			$.post(ctx+"/common/loadUserMsgNotify",function(notifyHtml){
				that.html(notifyHtml);
				//设置header消息数
				var notifyNums = $("#jq-notify-nums").val();
				if(notifyNums > 0){
					if(notifyNums > 99 ){
						notifyNums = "99+";
					}
					$("#jq-ntf-nums-tip").text(notifyNums).removeClass("hide");
				}
			})
		},notifyTipExpand : function() {
			var ntfNum = $("#jq-uNotify-content").find("li").length;//text().replace("+","") || 0;
			console.log(ntfNum);
			if(ntfNum> 0){
				$(".notify_body").show();
			}else{
				$(".notify_body").hide();
			}
		},
		notifyTipCollapse : function() {
			$(".notify_body").hide();
			var notifyKey = "pushMsg"+uuid;
			var pushMsgNums = 0;
			var notifyNums = $("#jq-notify-nums").val();
			if(notifyNums < 1){
				$("#jq-ntf-nums-tip").text(notifyNums).addClass("hide");
			}
			//阅读后置未读为0
			TradeHeadCls.setCookie(notifyKey,pushMsgNums);
		},viewAllNotify:function(pageNo){
			//消息通知tip隐藏，查看明细
			TradeHeadCls.notifyTipCollapse();
			if(null != allNotifyWin){//关闭原来窗体
				 layer.close(allNotifyWin);
			}
			allNotifyWin = layer.open({
				type : 2,
				zIndex : 1000,
				shade : 0.5,
				title : '推送消息',
				area : [ "600px", "660px" ],
				fix : true, // 固定
				maxmin : false,
				closeBtn : 1,
				content : ctx + '/common/loadUserMsgNotifyList.a',
				cancel : function() { // 用户手动关闭
				},
				end : function() {// 用户手动或者系统关闭回调
				}
			});
		},showOpMsgWin:function(title,msgContent){//显示消息通知框
	    	if($("#msgWinLayer").length > 0){//已存在
		    	$("#msgWinTitle").html(title);
		    	$("#msgWinContent").html(msgContent);
	    	}else{//未存在
	    		var msgWinHtml = this.opMsgWin(title,msgContent);
	    		$("body").append(msgWinHtml);
	    	}
	    	//显示消息框
	    	$("#msgWinLayer").slideDown(700,function(){}); 
	    	//关闭按钮
	    	$("#msgWinClose").on("click",TradeHeadCls.opMsgClose);
	    	//消息内空点击
	    	//$("#msgWinLayer").delegate('.msgWinContent', 'click',TradeHeadCls.forwardIM);
	    	if(null != iMsgInterv){//如果有新消息，当前窗体未关闭，则先重置之前定时器重新开始算
	    		window.clearInterval(iMsgInterv);
	    	}
	    	//5秒钟自动关闭右下角消息框
	    	iMsgInterv = window.setInterval( function() {
	    		TradeHeadCls.opMsgClose();
			},5000);
	    },opMsgWin:function(title,msgContent){//构建右下角消息框内容
	    	var winHtml =['<div class="messageBox"  id="msgWinLayer" style="display:none;">',
	    	 ' <i id="msgWinClose">×</i>',
	    	 ' <div class="messageBox1">',
	    	 ' <h2 id="msgWinTitle">',title,'</h2>',
	    	 ' <div>',
	    	 ' <span id="msgWinContent">',msgContent,'</span>',
	    	 ' </div>',
	    	 ' </div>',
	    	 '  </div>'].join('');
	    	return winHtml;
	    },opMsgClose:function(){//关闭右下角框
	    	window.clearInterval(iMsgInterv);
	    	iMsgInterv = null;
	    	$("#msgWinLayer").slideUp(700,function(){})
	    }
};	
//我的商品通登陆回调
function successCallback(result){
	//console.log("successCallback",result);
	if(result.isLogin){
		isCheckUserSiteLogin = true;
	}
}
$(document).ready(function() {
		TradeHeadCls.init();
		//菜单菜点击事件
		$(".classificationNew >li").click(function(){
			  window.location.href= $(this).attr("url");
		});
		//开发中提示
		$(".btn-undevp").click(function() {
			layer.msg("开发中。。。");
		});
		//顶部logo点击事件
		$("div.logo").click(function(){
			window.location.href="/index.a";
		});
	});
