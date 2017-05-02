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
	/**
	 * 计算平均值和方差
	 * @param  {Array} numbers 需要计算的一维数组
	 * @return {Object}         
	 * {"mean": mean,"variance": variance}
	 */
exports.getMeanAndVariance = function(numbers) {
	var mean = 0;
	var sum = 0;
	for(var i = 0; i < numbers.length; i++){
		numbers[i]=parseFloat(numbers[i]);
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