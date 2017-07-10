var comRegister = null;
$(function() {
	reg_methods.initData();
	// 防止自动填充，1秒钟后置出金密码为password密码框 。不能直接设置否则仍然会填充
	window.setTimeout("reg_methods.clearAutoFill()", 500);//由1000调整到500，解决SPT-430对话框失焦问题
});
//ok通过
var _checkUserTypePass = "ok";
var reg_methods = {
	initData : function() {
		reg_methods.initPlacehoder();
	},
	clearAutoFill : function() {
		$("input.password").focus();
		$("input.password").each(function() {
			var _html = $(this).parent().html().replace("text", "password").replace(/value/ig, "v1");
			$(this).parent().html(_html);
		});
		reg_methods.bindEvent();
		reg_methods.initPlacehoder();
	},
	bindEvent : function() {
		comRegister = new UserForm([ new Field({
			fid : "mobileNumber",
			val : [ new Nul_val("请填写有效的手机号码"), new Exp_val(r_mobile, "请填写有效的手机号码") ],
			msg_id : $("#CheckMobileNumber"),
		}), new Field({
			fid : "valiteWrite",
			val : [ new Nul_val("请填写验证码"), new Len_val(4, 4, "验证码的长度为4位") ],
			msg_id : $("#CheckValiteWrite"),
		}), new Field({
			fid : "validateSMS",
			val : [ new Nul_val("请填写短信验证码"), new Len_val(4, 4, "短信验证码的长度为4位") ],
			msg_id : $("#CheckValiteSMS"),
		}), new Field({
			fid : "realName",
			val : [ new Nul_val("请填写姓名"), new Len_val(0, 20, "姓名长度不能超过20位"), new Exp_val(r_speciChar, "姓名不能包括特殊字符") ],
			msg_id : $("#CheckRealName"),
		}), new Field({
			fid : "password",
			val : [ new Nul_val("请设置密码"), new Differ_val(function() {
				return $("#accountPassWord").val();
			}, "资金密码不允许和主账户密码相同") ,new Exp_val(r_reg_pwd, "以字母开头8-20位，可包含字母、数字和下划线")],
			msg_id : $("#CheckPassword"),
		}), new Field({
			fid : "password2",
			val : [ new Nul_val("请再次输入密码"), new Again_val(function() {
				return $("#password").val();
			}, "两次密码输入不一致") ],
			msg_id : $("#CheckPassWord2"),
		})
		]);
		// 验证码刷新
		$("#checkCode").click(function() {
			var _timestamp = (new Date()).valueOf();
			var _checkCodeUrl = _ctx + "/reg/getPicValidate.a";
			_checkCodeUrl = _checkCodeUrl + "?timestamp=" + _timestamp;
			$(this).attr("src", _checkCodeUrl);
		});
		$("#mobileNumber").on("blur",function(){
			if($.trim($(this).val()) == ""){return;}
			$.post(_ctx+"/reg/isExistCompanyAcct.a",{param:$(this).val(),isCheckUserType:"1"},function(data){
				_checkUserTypePass = data;
				reg_methods.isExsit();
			});
		});
		if($("#mobileNumber").val() != ""){
			console.log('m:'+$("#moibleNumber").val());
			$("#mobileNumber").blur();
		}
		// 事件绑定
		$(".regBtns").bind("click", function() {
			var _btnType = $(this).attr('btnType');
			if ("btnSendSms" == _btnType) {// 获取短信
				reg_methods.getSMS();
			} else if ("btnViewTradeProtocol" == _btnType) {
				// 商品通用户注册交易协议
				reg_methods.tradeProtocolView();
			} else if ("doSumitReg" == _btnType) {
				// 注册提交
				reg_methods.doSumitReg();
			}
		});

		// 去掉前后空格
		$("input").blur(function() {
			$(this).val($.trim($(this).val()));
		});
	},
	checkValidate : function() {// 校验验证码
		var flag = false;
		$.ajax({
			url : _ctx + "/reg/checkPicValidate.a",
			data : {
				validateWrite : $("#valiteWrite").val()
			},
			async : false,
			success : function(data) {
				if (data.success == 1) {
					flag = true;
				} else {
					layer.msg("请输入正确的验证码!");
					flag = false;
				}
			}
		});
		return flag;
	},
	getSMS : function() {// 获取短信
		var phone = $("#mobileNumber").val();
		if (phone.match(r_mobile) == null) {
			$("#mobileNumber").focus();
			layer.msg("请输入正确的手机号");
			return false;
		}
		$("#btnSendSms").addClass("again_gain");
		// 解除事件
		$("#btnSendSms").unbind("click");
		// 校验账号是否存在
		$.post(_ctx + "/reg/isExistCompanyAcct.a", {
			param : $("#mobileNumber").val()
		}, function(data) {
			if (data == "true") {// 已存在
				$("#mobileNumber").focus();
				layer.msg("该用户已经存在，请重新输入");
				// 移除发送状态，绑定事件
				reg_methods.clearSendSmsStatus();
				return;
			} else {
				// 发送短信
				$.post(_ctx + "/reg/getSMSValidate.a", {
					phone : phone
				}, function(sResult) {
					if (sResult.success == 1) {
						var time = 60;
						var rsl = setInterval(function() {
							$("#btnSendSms").text(time + "秒后重发");
							time--;
							if (time < 0) {
								$("#btnSendSms").text("重新验证");
								clearInterval(rsl);
								// 移除发送状态，绑定事件
								reg_methods.clearSendSmsStatus();
							}
						}, 1000);
					} else {
						layer.msg("短信发送失败!");
						// 移除发送状态，绑定事件
						reg_methods.clearSendSmsStatus();
					}
				});
			}
		});
	},
	clearSendSmsStatus : function() {// 移除发送状态，绑定事件
		$("#btnSendSms").removeClass("again_gain");
		$("#btnSendSms").unbind("click");
		// 事件重新绑定
		$("#btnSendSms").bind("click", function() {
			reg_methods.getSMS()
		});
	},
	checkSMS : function() {// 校验短信
		var flag = false;
		var phone = $("#mobileNumber").val();
		$.ajax({
			url : _ctx + "/reg/checkSMSValidate.a",
			data : {
				phone : phone,
				SMSvalidate : $("#validateSMS").val()
			},
			async : false,
			success : function(data) {
				if (data.success == 1) {
					flag = true;
				} else {
					layer.msg("请输入正确的短信验证码");
				}
			}
		});
		return flag;
	},
	tradeProtocolView : function() {// 商品通服务协议
		layer.open({
			type : 2,
			move : false,
			shade : 0.3,
			title : '商品通用户注册协议',
			offset : '10px',
			fix : false,
			area : [ '680px', '560px' ],
			content : _ctx + "/reg/tradeProtocolView.a"
		});
	},isExsit:function(){//用户是否存在
		var isCanReg = false;
		$("#CheckMobileNumber").addClass("msg_o");
		if("P" == _checkUserTypePass){
			layer.confirm("该账号已被注册为自由人账户，是否登录升级为企业账户?", {
				icon : 3
			}, function(index) {
				layer.close(index);
				//进入用户中心点击升级企业
                window.location.href= _ctx+"/acct/userinfo.a";
			});
		}else if("ok" == _checkUserTypePass){
			isCanReg = true;
		}else{//企业已存在
			$("#CheckMobileNumber").html("该用户已经存在，请重新输入");
		}
		return isCanReg;
	},
	doSumitReg : function() {
		if (!comRegister.validate() || !this.isExsit() || !reg_methods.checkValidate() || !reg_methods.checkSMS()) {
			return;
		}
		if (!$("input[name=btnAgree]").is(':checked')) {
			layer.msg("请阅读服务条款");
			return;
		}
		$("#userRegForm").submit();
	},
	initPlacehoder : function() {// 判断浏览器是否支持placeholder属性
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
			$("input[placeholder]").unbind("keyup blur");
			$("input[placeholder]").bind("keyup blur",function() {
				var _val = $(this).val();
				$(this).val(_val);
				if ("" == $.trim(_val)) {
					$(this).parent().find(".placeHoderTip").removeClass("hide");
				} else {
					$(this).parent().find(".placeHoderTip").addClass("hide");
				}
			});
		}
	}
};
