/**通用方法*/

var paymethodOption;
var innerTrade = new Array("CA","AP","CR","CRBL","CR60","CR30","CRIN","NEGO","CRAI","CRD0");
var outerTrade = new Array("CRIN1","CRIN2","CR30BL","CR30DO","CR90","T/T","CRBL","CR60","CR30","CRIN","NEGO","CRAI","CRD0");

var qp_common={
		hidePauMethod:function(items , obj){
			var target
			if(obj == "" || obj == null)
				target = $("#qk_payMethod");
			else
				target = $(obj);
			target.html(paymethodOption);
			for(var i = 0 ; i<items.length;i++){
				target.find("option[value='"+items[i]+"']").remove();
			}
		},

		//贸易方式->付款方式
		tradeModePayMethod:function (paydomId,tradeMode){
			if(!paymethodOption){
				paymethodOption = $("#"+paydomId).html();
			}else{
				$("#"+paydomId+">option").html("");
			}
			
				//$("#payMethod>option").show();
			if(tradeMode == "DM"){
				//内贸
				qp_common.hidePauMethod(outerTrade,$("#"+paydomId));
				//$("#payMethod>option[value='CA']").attr("selected","selected");
			}else{
				//外贸
				qp_common.hidePauMethod(innerTrade,$("#"+paydomId));
				//$("#payMethod>option[value='CRIN1']").attr("selected","selected");
			}
		},

		contructDelivery:function ($deliveryTime,productType)
		{
			var deliveryTime = $deliveryTime;
			var nowDate = new Date();
			// 是否为前半月
			var day=nowDate.getDate();
			var isPreHalfMonth = day <= 15;
			var nextDateArry = new Array();
			var deliveryTimeHtml = new Array();
			for (var m = 0; m <= 6; m++) {
				var fmtDate = this.fmtDateAddMonth(m, "yyyy-MM");
				if(m==0){
					if(productType == 'HG_CL_JC' || productType == 'HG_CL_EG' ||productType == 'HG_FT_BY' ){
						 if (day <= 10){
							 deliveryTimeHtml.push("<option value=" + fmtDate + "_UP>" + fmtDate + "上</option>");
						 }
						 if (day <= 20){
							 deliveryTimeHtml.push("<option value=" + fmtDate + "_MD>" + fmtDate + "中</option>");
						 }
					}else if (isPreHalfMonth){
						deliveryTimeHtml.push("<option value=" + fmtDate + "_UP>" + fmtDate + "上</option>");
					}
				}else{
					deliveryTimeHtml.push("<option value=" + fmtDate + "_UP>" + fmtDate + "上</option>");
					if (productType == 'HG_CL_JC' || productType == 'HG_CL_EG' ||productType == 'HG_FT_BY' ){
						//甲醇，含(月中)的盘子
						deliveryTimeHtml.push("<option value=" + fmtDate + "_MD>" + fmtDate + "中</option>");
					}
				}
				if (productType.startWith('GT') && deliveryTimeHtml.length >= 8) {// 钢铁仅上下共4个月
					break;
				} 
//				else if (deliveryTimeHtml.length >= 12) {// 其他上下共6个月
//					break;
//				}
				deliveryTimeHtml.push("<option value=" + fmtDate + "_DOWN>" + fmtDate + "下</option>");
			}
			// 增加日期选择
			$deliveryTime.html(deliveryTimeHtml.join(''));
			return;
		},
		fmtDateAddMonth : function(offsetM, fmt) {// 格式增加指定月份后日期
			var curDate = new Date();
			curDate.setMonth(curDate.getMonth() + offsetM);
			return curDate.format(fmt || "yyyy-MM");
		},
		getMonthAfter:function (n){
			
			var date =new Date(); 
			var format_date =new Date().format('yyyy-MM'); 
			var dt = format_date.split("-");
			var year = parseInt(dt[0]);
			var month = parseInt(dt[1]) - 1;
			var day = date.getDate();
			date.setDate(01);
			if(month + 1 + n > 12){				
				year+=1;			
				date.setFullYear(year);
				date.setMonth(month + n - 12);
			}else{
				date.setMonth(parseInt(date.getMonth()) + n);			
			}

			var n_date = new Date(date.getFullYear(),date.getMonth()).format("yyyy-MM"); 
			return n_date;
		}
}


