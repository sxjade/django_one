RegMap = {
		init:function(){
			//更改样式
			var regContentClass = $("#regContentClass").val();
			if(regContentClass){
				$("#reg_content").removeClass("register").addClass(regContentClass);
			}
			$.post(_ctx+"/reg/getAppDownAddr",function(data){
				if(typeof(data) == "string"){
					data = eval(data);
				}
				$("div[downType=ios]").attr("url",data.iosApp);
				$("div[downType=android]").attr("url",data.androidApp);
			});
		},
		bindEvent:function(){
			//升级企业账号
			$("#reg_content").delegate("#btnUpgradeCompany","click",function(){
				$("#upgradeCompanyForm").submit();
			});
			//登录
			$("#reg_content").delegate(".btn-login","click",function(){
				window.location.href= _loginUrl;
			});
			//app下载
			$("#reg_content").delegate(".download","click",function(){
				console.log($(this).attr("url"));
				window.open($(this).attr("url"),"_blank")
			});
			//返回上一步
			$("#reg_content").delegate(".btnGoBack","click",function(){
				history.go(-1);
			});
			//清空前后空格
			$("#reg_content").delegate("input","change",function(){
				var _val = $(this).val().replace(/\s/g,"");
				 $(this).val($.trim(_val));
				 $(this).blur();
			});
}
};
$(function(){
	RegMap.init();
	RegMap.bindEvent();
});