var PushMsgCls = {
	init : function() {
		if (window.WebSocket) {
			var host = window.location.host;
			var pushMsgWebSocket = new WebSocket('ws://' + host + '/ws/pushmsg');

			pushMsgWebSocket.onerror = function(event) {
				PushMsgCls.onError(event)
			};

			pushMsgWebSocket.onopen = function(event) {
				PushMsgCls.onOpen(event)
			};

			pushMsgWebSocket.onmessage = function(event) {
				PushMsgCls.onMessage(event)
			};
		}else{
			console.log('当前浏览器暂不支持websocket!');
		}
	},
	onOpen : function() {
		console.log('new pushmsg websocket...');
	},
	onMessage : function(event) {// 消息 处理
		console.log('pushMsg', event);
		if (uuid) {// 当前用户登陆
//			var notifyKey = "pushMsg" + uuid;
//			var msgNums = TradeHeadCls.readCookie(notifyKey) || 0;
//			console.log('notifyKey:', notifyKey, msgNums);
//			msgNums++;
//			TradeHeadCls.setCookie(notifyKey, msgNums);
//			var notifyNums = msgNums;
//			if (notifyNums > 0) {
//				if (notifyNums > 99) {
//					notifyNums = "99+";
//				}
//				$("#jq-ntf-nums-tip").text(notifyNums).removeClass("hide");
//			}
			TradeHeadCls.loadUserNotify();
		}
		if (event.data == null || event.data == '') {
			return;
		}
		var data = eval('(' + event.data + ')');
		var entity = data.data;
		console.log(entity);
		// 展示推送消息
		TradeHeadCls.showOpMsgWin(data.notifyTitle, data.content);
	},
	onError : function(event) {
		if (console) {
			console.log(console);
		}
	}
};
$(function() {
	// 初始化websocket
	PushMsgCls.init();
});