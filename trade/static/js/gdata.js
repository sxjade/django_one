//将参数传递到指定选项卡
function appendDictionary(obj,objid){
	var element = "";
	for ( var i=0;i< obj.length;i++) {
		element+="<option value="+obj[i].value+">"+obj[i].name+"</option>"
	}
	$(objid).html(element);
}

//刷数据出来
function loadData(obj){
	var jsondata = new Object();
	var index = null;
	$.ajax({
		"url":obj.url,
		"type":"GET",
		"async":false,
		"data":obj,
		beforeSend:function(){
			//请求前该处理需要添加布局的加载中
//			index = layer.load();
		},success:function(data){
			if(typeof(data) == "object")
			{
				jsondata = data;
			}else{
				try{
					jsondata =  eval("0,("+data+")");
				}catch(error){
					layer.msg(data.split("|")[0]);
				}
			}
		}
	});
//	layer.close(index);
	return jsondata;
}

//esay table data bind 
//数据绑定以及分页
function esayDatabindAndPaging(paramObj) {

	//下面部分为封装部分
	var numberPerPage = paramObj.data.numberPerPage;
	$.ajax({
				"url" : paramObj.url,
				"type" : "POST",
				"async" : false,
				"data" : paramObj.data,

				beforeSend : function() {
					//请求前该处显示加载中内容
				},
				success : function(data) {
					var obj = new Object();
					try {
						$("#showData").empty();
						obj = eval("(" + data + ")");
					} catch (error) {
						alert(data);
					}
					
					if(obj.dataList.length == 0){
						$("#fenye").hide();
						$("#nofenye").show();
					}else{
						$("#nofenye").hide();
						$("#fenye").show();
					}
					
					//分页封装
					//总行数
					obj.totalCount = parseInt(obj.totalCount);
					//当前页
					obj.currentPageNumber = parseInt(obj.currentPageNumber);
					//每页行数量
					numberPerPage = parseInt(numberPerPage);
					//最后页
					var pageCount = obj.totalCount % numberPerPage == 0 ? parseInt(obj.totalCount
							/ numberPerPage)
							: parseInt(obj.totalCount / numberPerPage) + 1;
					var back = $("#back");
					var next = $("#next");
					var sy = $("#sy");
					var my = $("#my");
					var dy = paramObj.data.currentPageNumber;
					if (pageCount > obj.currentPageNumber) {
						paramObj.data.currentPageNumber = paramObj.data.currentPageNumber + 1;
						next
								.html("<a href=javascript:databindAndPaging("
										+ JSON.stringify(paramObj)
										+ ") >下一页</a>");
						paramObj.data.currentPageNumber = pageCount;
						my.html("<a href=javascript:databindAndPaging("
								+ JSON.stringify(paramObj)
								+ ") >末页</a>");
					} else {
						next
								.html("<lable class='buttonsty1'>下一页</lable>");
						my.html("<lable class='buttonsty1'>末页</lable>");
					}

					if (obj.currentPageNumber <= 1) {
						back
								.html("<lable class='buttonsty1'>上一页</lable>");
						sy.html("<lable class='buttonsty1'>首页</lable>");
					} else {
						paramObj.data.currentPageNumber = dy - 1;
						back
								.html("<a href=javascript:databindAndPaging("
										+ JSON.stringify(paramObj)
										+ ") >上一页</a>");
						paramObj.data.currentPageNumber = 1;
						sy.html("<a href=javascript:databindAndPaging("
								+ JSON.stringify(paramObj)
								+ ") >首页</a>");
					}

					if (pageCount > 0) {
						var str = "<select onchange='databindAndPaging("+ JSON.stringify(paramObj) +")' id='companySel'>";
						for (var i = 1; i <= pageCount; i++) {
							if (i == obj.currentPageNumber)
								str += "<option value="+i+" selected = 'selected'>"
										+ i + "/" + pageCount + "</option>";
							else{
								paramObj.data.currentPageNumber = i;
								str += "<option value="+i+" >" + i + "/"
										+ pageCount + "</option>";
							}
						}
						str += "</select>";

						$("#selection").html("跳转至" + str);
					}
					$("#fenye #total").html(obj.totalCount);

				},
				error : function() {
					//请求错误
				}
			});
}