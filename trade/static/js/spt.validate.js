var sptValid = {
	validNum : function(val,opts,domName) {
		var msg = "";
		var s = val;
		//console.log('s', s);
		if (!domName){
			domName='';
		}
		var reg = new RegExp("^\\d+(\\d|(\\.[0-9]{0," + opts.prec + "}))?$");
		var r = reg.test(s);
		if (r) {
			var val = parseFloat(s).toFixed(opts.prec);
			if (typeof (opts.min) == "number" && val < opts.min) {
				msg = domName+"正确范围是[" + opts.min + " , " + opts.max + "]";
				if (opts.prec > 0) {
					msg += "," + opts.prec + "位小数";
				}
				r = false;
			} else {
				if (typeof (opts.max) == "number" && val > opts.max) {
					msg = domName+"正确范围是[" + opts.min + " , " + opts.max + "]";
					if (opts.prec > 0) {
						msg += "," + opts.prec + "位小数";
					}
					r = false;
				}
			}

		} else {
			msg = domName+"正确范围是[" + opts.min + " , " + opts.max + "]";
			if (opts.prec > 0) {
				msg += "," + opts.prec + "位小数";
			}
		}
		return {
			result : r,
			msg : msg
		};
	}
}
