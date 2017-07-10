var checkAll = null;

var cas_login_methods = {
	initData : function() {// ��ʼ���ݺ�״̬
		if ($("#name").val() != null && $("#name").val() != '') {
			$('#userName').val($('#name').val());
		} else {
			// ��ȡcookie��ֵ
			var username = $.cookie('username');
			var password = $.cookie('password');
			$('#username').val(username);
			$('#password').val(password);
			if (username != null && username != '' && password != null && password != '') {// ѡ�б������ܵĸ�ѡ��
				$("#remember_password").prop("checked", true); 
			}
		}
		checkAll = new UserForm([ new Field({
			fid : "username",
			val : [ new Nul_val("�û����������") ],
			msg_id : $("#checkUserName")
		}), new Field({
			fid : "password",
			val : [ new Nul_val("�����������") ],
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
		/** �۽������� */
		$("#username").focus();
	},
	bindEvent : function(serverName) {
		$(".loginBtns").click(function() {
			var _btnType = $(this).attr("btnType");
			if ("btnToHome" == _btnType) { // ��ҳ����
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
		if ($('#remember_password').is(":checked")) {// ��������
			$.cookie('username', uName, {
				expires : 7,
				path : '/'
			});
			$.cookie('password', psw, {
				expires : 7,
				path : '/'
			});

		} else {// ɾ��cookie
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
		// �ж�������Ƿ�֧��placeholder����
		supportPlaceholder = 'placeholder' in document.createElement('input');
		// ���������֧��placeholder����ʱ������placeholder����
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
			//����� �¼�
			$("input[placeholder]").bind("keyup blur",function() {
				var _val = $(this).val();
				if ("" == $.trim(_val)) {
					$(this).parent().find(".placeHoderTip").removeClass("hide");
				} else {
					$(this).parent().find(".placeHoderTip").addClass("hide");
				}
			});
			//���ü�ʱ�����ڴ����û������˺�����Ȼ���ѡ������Զ�����û�������
			window.setInterval("cas_login_methods.setTimeoutPlaceHolder()",100);
		}
	},setTimeoutPlaceHolder:function(){//�Զ�������Ҫ����ʾȥ��
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

// ��ȡ������url������������⣩
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

// ���iframeǶ������
if (window != top) {
	top.location.href = document.referrer;
	window.event.returnValue = false;
}
