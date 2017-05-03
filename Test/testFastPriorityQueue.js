var FastPriorityQueue = require("fastpriorityqueue");
var x = new FastPriorityQueue(function(a, b) {
	return a.dis > b.dis
});
x.add({"dis":10});
x.add({"dis":11});
x.add({"dis":100});
x.add({"dis":20});
x.add({"dis":11});
x.add({"dis":90});
while (!x.isEmpty()) {
	console.log(x.poll());
}
// { dis: 100 }
// { dis: 90 }
// { dis: 20 }
// { dis: 11 }
// { dis: 11 }
// { dis: 10 }
