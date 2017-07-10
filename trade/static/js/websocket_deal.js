function initWebSocket(){
	if(window.WebSocket){
		var host = window.location.host;
		var webSocket = new WebSocket('ws://' + host + '/ws/zonedeal');
		
		webSocket.onerror = function(event) {
			onError(event)
		};
		
		webSocket.onopen = function(event) {
			onOpen(event)
		};
		
		webSocket.onmessage = function(event) {
			onMessage(event)
		};
		
		function onMessage(event) {
		//	console.log(event);
			if (event.data==null || event.data==''){
				return;
			}
		//	var json = JSON.parse(event.data); 
		//	console.log(json);
			var data = eval('('+event.data+')');
			var entity = data.data;
			console.log(entity);
			var html  = [
						'<li class="clearFix" id="li_last_deal">',
						'<i class="float_left newest"></i>',
						'<span class="float_left">最新成交：</span>',
						'<span class="float_left marginR15 dd">',entity.dealTimeStr,'</span>',
						'<span class="float_left marginR15 colorhei fontBold productName">',entity.productName,'</span>',
						'<span class="float_left', (entity.incAmount >0?' newUp':(entity.incAmount<0?' newDown':' newSame')),'  marginR15 span_price">',
							'<span class="float_left">￥<span class="price">',entity.dealPrice,'</span>/吨</span>',
							'<i class="float_left"></i>', 
						'</span>',
						'<span class="float_left marginR15 colorhei"><span class="number">',entity.dealNumber,'</span>吨</span>',
						'<span class="float_left marginR15 deliveryTime">',entity.dealTimeStr,'</span>',
						'<span class="float_left deliveryPlace">',entity.deliveryPlace,'</span>',
						'</li>'].join('');
			console.log(html);
			//追加的话使用preappend
			$("#jq-latestDeal-content").removeClass("hide").html(html);
		}
		
		function onOpen(event) {
			console.log('new websocket');
		}
		
		function onError(event) {
			if(console){
				console.log(console);
			}
		}
	}else{
		//console.log('不支持websocket');
	}
}
$(function(){
	//初始化websocket
	initWebSocket();
});