/**
 * 常用工具JS
 * */

/**拓展日期格式化方法*/
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

/**
 * 获取当天日期
 * */
Date.prototype.getWeek = function()
{
	if(new Date().getDay()==0)          
		return "周日";
	if(new Date().getDay()==1)          
		return "周一";
	if(new Date().getDay()==2)          
		return "周二";
	if(new Date().getDay()==3)          
		return "周三";
	if(new Date().getDay()==4)          
		return "周四";
	if(new Date().getDay()==5)          
		return "周五";
	if(new Date().getDay()==6)          
		return "周六";
};

/**
	传入毫秒为单位的时间差
*/
Date.prototype.getHms = function(ms)
{
	var vd,vh,vm,vs,leave1,leave2,leave3;
	var vd = Math.floor(ms/(24*3600*1000));

	var leave1 = ms%(24*3600*1000);    
	var vh = Math.floor(leave1/(3600*1000));
	
	var leave2 = leave1%(3600*1000);        
	var vm = Math.floor(leave2/(60*1000));
	
	var leave3 = leave2%(60*1000);     
	var vs = Math.round(leave3/1000);

	return {day:vd,hour:vh,minute:vm,second:vs};
}

/**
 * 冒泡排序
 * */
function bubbleSort(secArray)
{
        var len = secArray.length,empty;
        for(var k=0; k<len-1; k++) {
            for(var i=0; i<len-k-1; i++) {
                if(secArray[i]>secArray[i+1]) {
                    empty = secArray[i+1];
                    secArray[i+1] = secArray[i];
                    secArray[i] = empty;
                }
            }
        }
}

/**
 * 将ProductType塞到session中
 */
function setProductTypeToSession(tagId)
{
	var productType = $("#"+tagId+"_three_type").val();
	if(!strIsNull(productType))
	{
		$.ajax({
			url:"${pageContext.request.contextPath}/setCurrentProductType.action",
			type:"get",
			data:{productType:productType}
		});
	}
}

/**
 * 字符串判空
 * @param str
 * @returns
 */
function strIsNull(str)
{
	return (str == null || str == "" || str.length <= 0);
}

function getServerDate()
{
	var xmlHttp = false;
	try {
	xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
	try {
	    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (e2) {
	    xmlHttp = false;
	}
	}

	if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
	xmlHttp = new XMLHttpRequest();
	}

	xmlHttp.open("GET", "resources/klinePages.jsp", false);
	xmlHttp.setRequestHeader("Range", "bytes=-1");
	xmlHttp.send(null);

	severtime = new Date(xmlHttp.getResponseHeader("Date"));
	return 	severtime;
}
//strignbuffer
function StringBuffer(){ 
	this.content = new Array; 
	} 
	StringBuffer.prototype.append = function( str ){ 
	this.content.push( str ); 
	} 
	StringBuffer.prototype.toString = function(){ 
	return this.content.join(""); 
	} 
	String.prototype.startWith=function(str){     
		  var reg=new RegExp("^"+str);     
		  return reg.test(this);        
		}  
		String.prototype.endWith=function(str){     
		  var reg=new RegExp(str+"$");     
		  return reg.test(this);        
		}
		String.prototype.contains=function(substr) {
		    return new RegExp(substr).test(this);
		}