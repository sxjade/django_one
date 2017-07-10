var curDom = 6; // 每版放6个图片
var domLen = 0;
$(function() {
	recruit_methods.bindEvent();
});
var recruit_methods = {
	bindEvent : function() {
		// 向后 按钮
		$("div.next").bind("click", function() { // 绑定click事件
			recruit_methods.doNext();
		});
		// 职位点击事件
		$("ul.station_ul li").click(function() {
			var _job = $(this).attr("position");
			$("ul.station_ul li").removeClass("active_p");
			$(this).addClass("active_p");
			
			$.post(_ctx+"/fwd/a/job_detail/",{job:_job},function(rData){
				$("#station_cont").html(rData);
			});
		});
	},
	doNext : function() {
		var content = $("div#content");
		var content_list = $("ul.station_ul");
		domLen = content_list.find("li").length;
		var v_width = content.width();
		var len = content_list.find("li").length;
		if (!content_list.is(":animated")) { // 判断“内容展示区域”是否正在处于动画
			if (curDom == domLen - 1) { // 已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
				$("div.next").unbind("click");
				$("div.next").addClass("disabled");
			} else {
				content_list.animate({
					"margin-left" : '-=' + 146
				}, "slow"); // 通过改变left值，达到每次换一个版面
				curDom++;
				$("div.prev").removeClass("disabled");
				$("div.prev").unbind("click");
				// 往前 按钮
				$("div.prev").bind("click", function() { // 绑定click事件
					recruit_methods.doPrev();
				});
			}
		}
	},
	doPrev : function() {
		var content = $("div#content");
		var content_list = $("ul.station_ul");
		domLen = content_list.find("li").length;
		var v_width = content.width();
		var len = content_list.find("li").length;
		if (!content_list.is(":animated")) { // 判断“内容展示区域”是否正在处于动画
			if (curDom == 6) { // 已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
				$("div.prev").unbind("click");
				$("div.prev").addClass("disabled");
			} else {
				content_list.animate({
					"margin-left" : '+=' + 146
				}, "slow"); // 通过改变left值，达到每次换一个版面
				curDom--;
				$("div.next").removeClass("disabled");
				$("div.next").unbind("click");
				// 往前 按钮
				$("div.next").bind("click", function() { // 绑定click事件
					recruit_methods.doPrev();
				});
			}
		}
	}
};