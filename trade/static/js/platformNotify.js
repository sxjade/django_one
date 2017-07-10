
var notify={
		loadNotify: function (notifyType, currentPage) {
			window.location.href=_ctx+'/nv/loadNotifyList.a?notifyType='+notifyType+'&currentPage='+currentPage;
		},
		
		pageChage: function(notifyType, obj){
			notify.loadNotify(notifyType, $(obj).val());
		},
		
		notifyDetail: function(noticeId){
			window.location.href=_ctx+'/nv/viewNotify/'+noticeId+'.a';
		}
};

$(function(){
	$("#notifyCompanyNews").click(function(){
		notify.loadNotify('0', '1');
	});
	$("#notifyPlatformNotifies").click(function(){
		notify.loadNotify('1', '1');
	});
	
	var parentH=$('.news_right').height();
	
	$('.news_left').height(parentH-30);
	//公司动态新闻和公告菜单点击事件
	$("#company_dynamicMenu li").click(function(){
		var _url = $(this).attr("url");
		window.location.href = _url;
	});
});



