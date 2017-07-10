function showTopBtn() {
	$(window).scroll(function(e) {
		if ($(window).scrollTop() != undefined && $(window).scrollTop() > 300)
			$(".prompt").fadeIn(1000);
		else
			$(".prompt").fadeOut(1000);
	});
}
function return2Top() {
	$('body,html').animate({
		scrollTop : 0
	}, 500);
}

$(function() {
	//$("#aboutSpt").remove();
	$(".prompt").hide();
	showTopBtn();
	$('.back_under').click(return2Top);
	// 菜单选中事件
	$("ul.about_menus li").each(function() {
		var _url = $(this).attr("url");
		var _curmenu = $(this).attr("menu");
		var _curUrl = window.location.href;
		if ((""!= _menu && _curmenu.indexOf(_menu) > -1) ||
			_curUrl.indexOf(_curmenu) > -1) {
			$("ul.about_menus li").removeClass("li_active");
			$(this).addClass("li_active");
			return false;
		}
	});
	// 菜单选中事件
	$(".btn_menus").each(function() {
		var _url = $(this).attr("url");
		var _curUrl = window.location.href;
		if (_curUrl.indexOf(_url) > -1) {
			$(".btn_menus").removeClass("li_on");
			$(this).addClass("li_on");
		}
	});
     //主菜单击事件
	$("ul.about_menus li").click(function(){
		var _url = $(this).attr("url");
		window.location.href = _url;
	});
	// 子菜单单击
	$(".btn_menus").click(function() {
		var _url = $(this).attr("url");
		window.location.href = _url;
	});
	//顶部logo点击事件
	$("div.logo").click(function(){
		window.location.href="/trade";
	});
});