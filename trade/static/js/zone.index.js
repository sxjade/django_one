var ZoneCls = {
		init:function(){//入口
			this.initNode();
			this.bindEvent();
		},initNode:function(){//初始化节点
			//专区申请
			this.$zoneApply= $("#jq-zoneApply");
			//行业选择区域
			this.$ulIndustry = $("#jqUl-industry");
			//专区须知
			this.$ulZoneRules = $("#jqUl-zoneRules");
			//行业更多
			this.$more = $("#jq-more");
		},bindEvent:function(){//事件绑定
			//专区申请事件
			//this.$zoneApply.on("click",this.zoneApply);
			//申请
			this.$ulIndustry.delegate(".jq-zoneApply", "click",this.zoneApply);
			//行业选择事件
			this.$ulIndustry.delegate("li[ptype]", "click",this.switchIndustry);
			//专区更多
			this.$more.on("click", this.showMore);
			//专区须知事件
			this.$ulZoneRules.delegate("li", "click",this.zoneRule);
		},zoneApply:function(){
			window.location.href = _ctx+"/zone/zoneApply/zone_apply.a";
		},switchIndustry:function(){//行业选择
			if("HG" !=  $(this).attr("ptype")){
				layer.msg("目前【基础化工专区】已开放<br/>其他专区即将陆续开放，敬请关注！");
				return;
			}
			window.location.href = _ctx + "/zone/" + $(this).attr("ptype").toLowerCase()+ ".a";
		},showMore:function(){//显示更多
			var isExpand = $(this).attr("isExpand") || "0";
			if("0" === isExpand){
				ZoneCls.$zoneApply.hide();
				ZoneCls.$ulIndustry.find(".jq-m-industrys").removeClass("disNone");
				 $(this).attr("isExpand","1");
				 $(this).text("收起    <");
			}else{
				 ZoneCls.$ulIndustry.find(".jq-m-industrys").addClass("disNone");
				 ZoneCls.$zoneApply.show();
				 $(this).attr("isExpand","0");
				 $(this).text("更多    >");
			}
		},zoneRule:function(){//专区须知
			var guide  =$(this).attr("jq-guide");
			window.location.href = ctx+"/zone/guide/"+guide+".a";
		}
};
$(function() {
	ZoneCls.init();
});
