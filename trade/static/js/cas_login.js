var checkAll = null;

var cas_login_methods = {
	initData : function() {// 初始数据和状态
		if ($("#name").val() != null && $("#name").val() != '') {
			$('#userName').val($('#name').val());
		} else {
			// 获取cookie的值
			var username = $.cookie('username');
			var password = $.cookie('password');
			$('#username').val(username);
			$('#password').val(password);
			if (username != null && username != '' && password != null && password != '') {// 选中保存秘密的复选框
				$("#remember_password").prop("checked", true); 
			}
		}
		checkAll = new UserForm([ new Field({
			fid : "username",
			val : [ new Nul_val("用户名输入错误") ],
			msg_id : $("#checkUserName")
		}), new Field({
			fid : "password",
			val : [ new Nul_val("密码输入错误") ],
			msg_id : $("#checkPassword")
		}) ]);

		$("body").bind("keydown", function(e) {
			if (e.keyCode == 13) {
				setTimeout(function() {
					if (checkAll.validate())
						submitForm();
				}, 100);
			}
		});

		$("#broker2").attr("src", "http://www.totrade.cn/SptBrokerManagement/login.jsp");
		/** 聚焦在输入 */
		$("#username").focus();
	},
	bindEvent : function(serverName) {
		$(".loginBtns").click(function() {
			var _btnType = $(this).attr("btnType");
			if ("btnToHome" == _btnType) { // 首页链接
				window.location.href = "http://www.totrade.cn/index/";
			} else if ("btnForgetPsw" == _btnType) {
				cas_login_methods.forgetPsw(serverName);
			} else if ("btnToRegister" == _btnType) {
				window.location.href = "http://www.totrade.cn/user/reg/"
			}
		});
	},
	forgetPsw : function(serverName) {
		window.location.href = serverName + "/user/reg/forgetPwd/";
	},
	rememberPwd : function() {
		var uName = $('#username').val();
		var psw = $('#password').val();
		if ($('#remember_password').is(":checked")) {// 保存密码
			$.cookie('username', uName, {
				expires : 7,
				path : '/'
			});
			$.cookie('password', psw, {
				expires : 7,
				path : '/'
			});

		} else {// 删除cookie
			$.cookie('username', '', {
				expires : -1,
				path : '/'
			});
			$.cookie('password', '', {
				expires : -1,
				path : '/'
			});
		}
	},
	initPlacehoder : function() {
		// 判断浏览器是否支持placeholder属性
		supportPlaceholder = 'placeholder' in document.createElement('input');
		// 当浏览器不支持placeholder属性时，调用placeholder函数
		if (!supportPlaceholder) {
			$("input[placeholder]").each(function() {
				var _val = $(this).val();
				if ("" == $.trim(_val)) {
					$(this).parent().find(".placeHoderTip").removeClass("hide");
				}
			});
			$(".placeHoderTip").click(function() {
				$(this).addClass("hide");
				$(this).parent().find("input").focus();
			});
			//输入框 事件
			$("input[placeholder]").bind("keyup blur",function() {
				var _val = $(this).val();
				if ("" == $.trim(_val)) {
					$(this).parent().find(".placeHoderTip").removeClass("hide");
				} else {
					$(this).parent().find(".placeHoderTip").addClass("hide");
				}
			});
			//设置计时器有于处理用户输入账号名，然后从选择框中自动填充用户和密码
			window.setInterval("cas_login_methods.setTimeoutPlaceHolder()",100);
		}
	},setTimeoutPlaceHolder:function(){//自动填充后需要把提示去掉
		$("input[placeholder]").each(function() {
			var _val = $(this).val();
			if ("" == $.trim(_val)) {
				$(this).parent().find(".placeHoderTip").removeClass("hide");
			}else{
				$(this).parent().find(".placeHoderTip").addClass("hide");
			}
		});
	}
};
/**
 * 
 */

// 获取父窗口url（解决跨域问题）
function getParentUrl() {
	var url = null;
	if (parent !== window) {
		try {
			url = top.location.href;
		} catch (e) {
			url = document.referrer;
		}
	} else {
		url = top.location.href;
	}
	return url;
}

// 解决iframe嵌套问题
if (window != top) {
	top.location.href = document.referrer;
	window.event.returnValue = false;
}
