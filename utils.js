/**
 * Created by huangjianjin on 2016/12/20.
 */
// this is a function use for certain if a obj in an array
exports.contains=function (arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
//delete a certain obj from array.
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
exports.removeFromArray=function (arr,obj) {
    arr.remove(obj);
}