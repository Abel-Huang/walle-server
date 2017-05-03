/**
 * Created by huangjianjin on 2016/12/20.
 */
//delete a certain obj from array.
// Array.prototype.indexOf = function(val) {
// 	for (var i = 0; i < this.length; i++) {
// 		if (this[i] == val)
// 			return i;
// 	}
// 	return -1;
// };
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
// this is a function use for certain if a obj in an array
exports.contains = function(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) {
			return true;
		}
	}
	return false;
}
exports.removeFromArray = function(arr, obj) {
	arr.remove(obj);
}
exports.array_remove_repeat=function(a) { // 去重
    var r = [];
    for(var i = 0; i < a.length; i ++) {
        var flag = true;
        var temp = a[i];
        for(var j = 0; j < r.length; j ++) {
            if(temp === r[j]) {
                flag = false;
                break;
            }
        }
        if(flag) {
            r.push(temp);
        }
    }
    return r;
}
exports.array_intersection=function (a, b) { // 交集
    var result = [];
    for(var i = 0; i < b.length; i ++) {
        var temp = b[i];
        for(var j = 0; j < a.length; j ++) {
            if(temp === a[j]) {
                result.push(temp);
                break;
            }
        }
    }
    return array_remove_repeat(result);
}
exports.array_union=function (a, b) { // 并集
    return this.array_remove_repeat(a.concat(b));
}

/**
 * 计算平均值和方差
 * @param  {Array} numbers 需要计算的一维数组
 * @return {Object}         
 * {"mean": mean,"variance": variance}
 */
exports.getMeanAndVariance = function(numbers) {
	var mean = 0;
	var sum = 0;
	for (var i = 0; i < numbers.length; i++) {
		numbers[i] = parseFloat(numbers[i]);
	}
	for (var i = 0; i < numbers.length; i++) {
		sum += numbers[i];
	}
	mean = sum / numbers.length;
	sum = 0;
	for (var i = 0; i < numbers.length; i++) {
		sum += Math.pow(numbers[i] - mean, 2);
	}
	var variance = sum / numbers.length;
	return new Object({
		"mean": mean,
		"variance": variance
	});
}