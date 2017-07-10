var TradeMsgProCls = {
		init:function(){
			this.initNode();
			this.initBindEvent();
		},
		initNode:function(){
			
		},initBindEvent:function(){
			//点击消息
			$("#jqDiv-notify-items li,#jq-uNotify-content li").on("click",this.readMsg);
		},menuMap:{
			/*"requestExprie":ctx+"/zone/HG/myorder/my_request.a",已失效不点击*/
			"newZoneRequest":ctx+"/zone/hg/requestDetail/",
			"dealRequest":ctx+"/user/cont/index.a",
			"arrivedDeliveryTime":ctx+"/user/cont/index.a",
			"startDelivery":ctx+"/user/cont/index.a",
			"remainPaid":ctx+"/user/cont/index.a",
			"appendSellerBond":ctx+"/user/cont/index.a",
			"appendSellerBondSuccess":ctx+"/user/cont/index.a",
			"appendSellerBondFailed":ctx+"/user/cont/hisContract.a",
			"appendBuyerBond":ctx+"/user/cont/index.a",
			"appendBuyerBondSuccess":ctx+"/user/cont/index.a",
			"appendBuyerBondFailed":ctx+"/user/cont/hisContract.a",
			"confirmReceive":ctx+"/user/cont/index.a",
			"confirmReceived":ctx+"/user/cont/hisContract.a",
			"remainUnPay":ctx+"/user/cont/index.a",
			"unDelivery":ctx+"/user/cont/hisContract.a"
		},readMsg:function(){  //读消息
			//标记已读
			var param = new Object(),msgDom = $(this);
			param.historyId = msgDom.attr("jq-hId")
			//step1:设置消息已读
			$.post(ctx+'/common/read.a',param,function(result){ 
				msgDom.removeClass("font_weight");
			});
			var mtype = msgDom.attr("jq-mtype");
			var mUrl = TradeMsgProCls.menuMap[mtype];
			//step2:相应消息页面跳转
			if(mUrl){
				var pathUrl = window.location.pathname;
				if(mtype == 'newZoneRequest'){
					var offerId = msgDom.attr("jq-mId");
					if(offerId != ''){
						$.post(ctx+'/common/getZoneOffer.a',{offerId:offerId},function(data){
							if(null != data && data.requestId){
								mUrl = [mUrl,data.requestId,'.a'].join('');
								if(pathUrl.indexOf("loadUserMsgNotifyList") > -1){
//									window.open(mUrl);
									parent.window.location.href = mUrl;
								}else{
									window.location.href = mUrl;
								}
							}else{
								layer.msg("当前挂单已撤销");
							}
						});
					}else{
						layer.msg("当前挂单已撤销");
					}
				}else{
					if(pathUrl.indexOf("loadUserMsgNotifyList") > -1){
//						window.open(mUrl);
						parent.window.location.href = mUrl;
					}else{
						window.location.href = mUrl;
					}
				}
			}
	    }
};	
$(document).ready(function() {
		TradeMsgProCls.init();
});
