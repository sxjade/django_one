/**
@author piao wenjie
用于商品通的的一些常用处理 
*/
var init=function(){
	    Date.prototype.format = function(format)
								{
									 var o = {
									 "M+" : this.getMonth()+1, //month
									 "d+" : this.getDate(),    //day
									 "h+" : this.getHours(),   //hour
									 "m+" : this.getMinutes(), //minute
									 "s+" : this.getSeconds(), //second
									 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
									 "S" : this.getMilliseconds() //millisecond
									 };
									 
									 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
										(this.getFullYear()+"").substr(4 - RegExp.$1.length));
									 		for(var k in o)
									 			if(new RegExp("("+ k +")").test(format))
									 				format = format.replace(RegExp.$1,
									 				RegExp.$1.length==1 ? o[k] :
									 				("00"+ o[k]).substr((""+ o[k]).length));
									 		return format;
								};

								Number.prototype.div = function (arg){
									var t1 = 0,t2 = 0,r1,r2;
									try{t1 = this.toString().split(".")[1].length}catch(e){}
									try{t2 = arg.toString().split(".")[1].length}catch(e){}
									with(Math){
										r1 = Number(this.toString().replace(".",""))
										r2 = Number(arg.toString().replace(".",""))
										return (r1 / r2) * pow(10,t2-t1);
									}
								};						
	}();
var sptUtility = {
	offline_from : '17:30',
	offline_to : '18:00',
	getHms:function(ms){
			var vd,vh,vm,vs,leave1,leave2,leave3;
			var vd = Math.floor(ms/(24*3600*1000));

			var leave1 = ms%(24*3600*1000);    
			var vh = Math.floor(leave1/(3600*1000));
			
			var leave2 = leave1%(3600*1000);        
			var vm = Math.floor(leave2/(60*1000));
			
			var leave3 = leave2%(60*1000);     
			var vs = Math.round(leave3/1000);

			return {day:vd,hour:vh,minute:vm,second:vs};
	},
	getDeliveryTime:function(time){
		/**time为毫秒数*/
			var deliveryTime =new Date(time).format("yyyy-MM");
		    var deliveryTag = new Date(time).getDate() <= 15 ? "上" : "下";

		    return deliveryTime + deliveryTag;
	},
	getValiteTime:function(time,timeDiffer){
		/**time为毫秒数,timeDiffer为服务器和本地的时间差*/
		var timeTag = new Date(time).getTime() -  new Date().getTime() + timeDiffer;
		var vTime = sptUtility.getHms(timeTag);
		return vTime;
	},
	/**currentTime为毫秒数*/
	outOfServer:function(currentTime){
		var flag;
		var current_time = currentTime == null? new Date() : new Date(currentTime);
		var date = current_time.getFullYear() + "/" + (current_time.getMonth() + 1) + "/" + current_time.getDate();
		var begin = date + " " + sptUtility.offline_from;
		var end = date + " " + sptUtility.offline_to;

		if(current_time.getTime() >= new Date(begin).getTime() && current_time.getTime() <= new Date(end).getTime())
			flag = true;
		else 
			flag = false;

		return flag;
	},
	/**
	 *在ajax回调中调用，
	 *正确情况：sucFlag，typeof=object
	 *错误情况：errormsg，errorid
	 *return:是否成功，对象数组，错误编号，错误信息
	*/
	parseAjaxResult:function(data,sucFlag){
		var result_flag,result_data,error_id = 0,error_msg = "",string_flag = true;
		if(typeof(data) === "object" || data == sucFlag)
		{
			result_data = typeof(data) === "object" ? data : "";
			result_flag = true;
			string_flag = false

			if(data.errorId == 255)
			{
				result_flag = false;
				result_data = "";
				error_id = 255;
				error_msg = data.errMsg;
			}	

		}

		if(typeof(data) === "string" && string_flag == true)
		{
			result_flag = false;
			result_data = "";
			error_id = data.split("|")[1];
			error_msg = data.split("|")[0];
		}

		return {result_flag:result_flag,result_data:result_data,error_id:error_id,error_msg:error_msg};	
	}
}
