module.exports = {
	checkPositiveInt : function(val, defVal = null){
		if (typeof(val) == 'undefined') {
			return defVal;
		}
	
		val = Number(parseInt(val));
		if ((isNaN(val) || val < 0)) {
			return -1;
		}
		
		return val;
    }
}