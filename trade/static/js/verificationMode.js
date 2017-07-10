//////////////////////////////////////////////验证正则表达式(规则)///////////////////////////////////////////
var r_int = /^[0-9]*$/;//数字
var r_chinese = /^[\u4e00-\u9fa5]{0,}$/;//汉字
var r_english = /^\w+[\w\s]+\w+$/;//英文可有空格
var r_en_int = /^[A-Za-z0-9]+/;//英文和数字
var r_en = /^[A-Za-z]+$/;//字母
var r_email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;//email
var r_mobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;//手机号码
var r_phone = /\d{3}-\d{8}|\d{4}-\d{7}/;//国内电话号码(0511-4405222、021-87888822)
var r_fax = /^(\d{3,4}-)?\d{7,8}$/;//传真
var r_idcard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;//身份证号码18位或者15位
var r_accounts = /^[a-zA-Z][a-zA-Z0-9_]{5,19}$/; //用户名，字母开头，允许6-20字节，允许字母数字下划线
var r_date = /^\d{4}-\d{1,2}-\d{1,2}/;//日期格式
var r_postcode = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;//邮编
var r_double = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;//可有两位小数的数字
var r_num = /^[1-9]{1}[\d]*$/;//正整数
////////////////////////////////////验证器类//////////////////////////////////////////////////////////
//长度验证的验证器类
function Len_val(min_l,max_l,tip){
    this.min_v=min_l;
    this.max_v=max_l;
    this.tips=tip;
    this.on_suc;
    this.on_error;
}
Len_val.prototype.validate=function(fd){
    if(fd.length<this.min_v||fd.length>this.max_v){
        this.on_error();
        return false;
    }
    this.on_suc();
    return true;
};

//不可为空验证器
function Nul_val(tip){
	this.tips=tip;
	this.on_error;
	this.on_suc;
}
Nul_val.prototype.validate=function(fd){
	if(fd==""||fd.length==0){
		this.on_error();
        return false;
	}
	this.on_suc();
    return true;
};

function Com_val(min,max,tip)
{
	this.min = min;
	this.max = max;
	this.tip = tip;
	this.on_error;
	this.on_suc;
}
Com_val.prototype.validate=function(fd)
{
	if(this.min < this.max)
	{
		this.on_suc();
		return true;
	}
		
	else
	{
		this.on_error();
		return false;
	}
};

//确认密码验证器
function Again_val(func,tip){
	this.func=func;
	this.tips=tip;
	this.on_error;
	this.on_suc;
}
Again_val.prototype.validate=function(fd){
	if(fd!=this.func()){
		this.on_error();
		return false;
	}
	this.on_suc();
	return true;
};
//正则表达式验证器
function Exp_val(expresion,tip){
    this.exps=expresion;
    this.tips=tip;
    this.on_suc;
    this.on_error;
}
Exp_val.prototype.validate=function(fd){
    if(!fd){
        this.on_suc();
        return true;
    }
    if(this.exps.test(fd)){
        this.on_suc();
        return true;
    }else{
        this.on_error();
        return false;
    }
};
//远程验证器
function Remote_val(url,tip){
    this.p_url=url;
    this.tips=tip;
    this.on_suc;
    this.on_error;
}
Remote_val.prototype.validate=function(fd){
    var self=this;
    $.ajax(
    {
    	url: this.p_url, 
    	data:{f:fd}, 
    	success: function(data){
    		if(!data){
                self.on_suc();
                return true;
            }else{
                self.on_error();
                return false;
            }
    	},
    	error:function(){
    		return false;
    	}
    }
    );
};
//自定义函数验证器
function Man_val(func,tip){
    this.tips=tip;
    this.val_func=func;
    this.on_suc;
    this.on_error;
}
Man_val.prototype.validate=function(fd){
    if(this.val_func()){
        this.on_suc();
    }else{
        this.on_error();
    }
};

//绑定blur事件
function UserForm(items){
	this.f_item=items;                             //把字段验证对象数组复制给属性
    for(var idx=0;idx<this.f_item.length;idx++){  
    	var fc=this.get_check(this.f_item[idx]);   //获取封装后的回调事件
       $("#"+this.f_item[idx].field_id).blur(fc); //绑定到控件上
    }
}
//绑定验证事件的处理器，为了避开循环对闭包的影响
UserForm.prototype.get_check=function(v){
    return function(){   //返回包装了调用validate方法的事件   
    v.validate();
    };
};

//绑定提交事件到元件
UserForm.prototype.set_submit=function(bid,bind){
   var self=this;
   $("#"+bid).click(
       function(){
           if(self.validate()){
               bind();
           }
       }
    );
};

//验证所有的字段
UserForm.prototype.validate=function(){
//   for(idx in this.f_item){             //循环每一个验证器
   for(var idx=0;idx<this.f_item.length;idx++){
       this.f_item[idx].validate();     //再检测一遍
       if(!this.f_item[idx].checked){  
           return false;                //如果错误就返回失败，阻止提交
       }
   }
   return true;                         //一个都没错就返回成功执行提交
};


//pwd
function AuthPasswd(string) {
    if (string.length >= 6) {
        if (/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string) && /\W+\D+/.test(string)) {
            noticeAssign(1);
        } else if (/[a-zA-Z]+/.test(string) || /[0-9]+/.test(string) || /\W+\D+/.test(string)) {
            if (/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string)) {
                noticeAssign(-1);
            } else if (/\[a-zA-Z]+/.test(string) && /\W+\D+/.test(string)) {
                noticeAssign(-1);
            } else if (/[0-9]+/.test(string) && /\W+\D+/.test(string)) {
                noticeAssign(-1);
            } else {
                noticeAssign(0);
            }
        }
    } else {
        noticeAssign(2);
    }
}

//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色   
function noticeAssign(num) {
    var O_color = "#eeeeee";
    var L_color = "#FF4040";
    var M_color = "#FF9900";
    var H_color = "#33CC00";
    var info = "";
    switch (num) {
        case 1:
            Lcolor = Mcolor = Hcolor = H_color;
            info = "强";
            break;
        case 0:
            Lcolor = L_color;
            Mcolor = Hcolor = O_color;
            info = "弱 试试字符、数字和特殊符号的混搭";
            break;
        case -1:
            Lcolor = Mcolor = M_color;
            Hcolor = O_color;
            info = "中 试试字符、数字和特殊符号的混搭";
            break;
        default:
            Mcolor = Hcolor = Lcolor = O_color;
            info = "试试字符、数字和特殊符号的混搭";
    }
    $("#strength_L").css("background", Lcolor);
    $("#strength_M").css("background", Mcolor);
    $("#strength_H").css("background", Hcolor);
    $("#pw_check_info").html(info); //密码强度提示信息
    return;
}

function Field(params){
    this.field_id=params.fid;     //要验证的字段的ID
    this.validators=params.val;   //验证器对象数组
/*    this.on_suc=params.suc;       //当验证成功的时候执行的事件
    this.on_error=params.err;     //当验证失败的时候执行的事件
*/  this.msg_id=params.msg_id;	   //验证不通过显示提示位置
    this.checked=false;           //是否通过验证
}



Field.prototype.validate=function(){
   //循环每一个验证器
	for(var item=0;item<this.validators.length;item++)
		{
	       //给验证器附加验证成功和验证失败的回调事件
	       this.set_callback((this.validators)[item],this.msg_id);
	       //执行验证器上的Validate方法，验证是否符合规则
	       if(!this.validators[item].validate(this.data())){
	           break; //一旦任意一个验证器失败就停止
	       }
		}
};

//获取字段值的方法
Field.prototype.data=function(){
   return document.getElementById(this.field_id).value;
};

//设置验证器回调函数的方法set_callback
Field.prototype.set_callback=function(val,msg_id){
   var self=this;              //换一个名字来存储this，不然函数的闭包中会覆盖这个名字
   val.on_suc=function(){      //验证成功执行的方法
       self.checked=true;   //将字段设置为验证成功 
       SucessStatus(msg_id);	//执行验证成功的事件
      // self.on_suc(val.tips);  
   };
   val.on_error=function(){    //验证失败的时候执行的方法
       self.checked=false;     //字段设置为验证失败
       //self.on_error(val.tips);
       ErrorStatus(msg_id,val.tips);//执行验证失败的事件
   };
};
//成功调用
function SucessStatus(controlId) {
   if (typeof (controlId) == 'undefined')
       return;
   controlId.html("&nbsp;");
   //controlId.removeClass();
   controlId.attr("style", "display:inline");
}
//错误调用
function ErrorStatus(controlId, errMsg) {
   if (typeof (controlId) == 'undefined')
       return;
   //controlId.removeClass();
   //controlId.addClass("tipstext");

   controlId.html(errMsg);
   controlId.attr("style", "display:inline");
}

//判断是否为空
function isNull(obj){
	var isnull = true;
	if(obj.value.replace(/s/g,"") == '' || obj==null)
		isnull = true;
	else
		isnull = false;
	return isnull;
}
