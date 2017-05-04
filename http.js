var http = require("http");
var easymogo = require('./easymogo');
var utils = require('./utils');
var FastPriorityQueue = require("fastpriorityqueue");
var generateDB = require("./calculate.js");
var url = require("url");

/*
	request json:
	{
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 16":-10,
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 11":-80,
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 12":-9,
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 15":-91,
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 23":-20,
		"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 22":-33
	}
	response json:
	{
		x:100,
		y:100
	}
 */

function getDistence(ob1, ob2) {
	var MIN_RSSI = -127;
	var dis = 0;
	var array1 = new Array();
	var array2 = new Array();
	for (var i in ob1) {
		array1.push(i);
	}
	for (var i in ob2) {
		array2.push(i);
	}
	var keySet = utils.array_union(array1, array2);
	for (var i = 0; i < keySet.length; i++) {
		if (ob1[keySet[i]] == undefined && ob2[keySet[i]] == undefined) {
			continue;
		} else if (ob1[keySet[i]] == undefined) {
			dis += (ob2[keySet[i]] - MIN_RSSI) * (ob2[keySet[i]] - MIN_RSSI);
		} else if (ob2[keySet[i]] == undefined) {
			dis += (ob1[keySet[i]] - MIN_RSSI) * (ob1[keySet[i]] - MIN_RSSI);
		} else {
			dis += (ob1[keySet[i]] - ob2[keySet[i]]) * (ob1[keySet[i]] - ob2[keySet[i]]);
		}
	}
	return dis; //no sqrt
}

function dealResult(rows, params) {
	var request = params[0];
	var response = params[1];

	var p_que = new FastPriorityQueue(function(a, b) {
		return a.dis < b.dis
	});
	var K = 1;
	var cmp_obj1 = request;

	//generate priority_queue
	for (var i = 0; i < rows.length; i++) {
		var cmp_obj2 = new Object();
		var data = rows[i].data;
		for (var j in data) {
			cmp_obj2[j] = data[j].mean;
		}
		var dis = getDistence(cmp_obj1, cmp_obj2);
		p_que.add({
			"location": rows[i].location,
			"dis": dis
		});
	}

	//get the ans
	var xx = 0,
		yy = 0;
	var count = 0;
	while (!p_que.isEmpty() && (K--) > 0) {
		var item = p_que.poll().location;
		xx += item.x;
		yy += item.y;
		count++;
	}
	// while (!p_que.isEmpty()) {
	// 	console.log(p_que.poll());
	// }	
	if (count > 0) {
		var output = {
			x: xx / count,
			y: yy / count
		}
	} else {
		var output = {
			x: 0,
			y: 0
		}
	}

	response.writeHead(200, {
		"Content-Type": "application/json;charset=utf-8"
	});
	response.write(JSON.stringify(output));
	response.end();
}

var server = http.createServer(function(req, response) {
	req.setEncoding('utf-8');
	var postData = "";
	req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	req.addListener("end", function() {
		postData = JSON.parse(postData);
		if (postData.task != undefined) {
			generateDB.start();
			response.writeHead(200, {
				"Content-Type": "application/json;charset=utf-8"
			});
			response.write('{"message":"ok"}');
			response.end();
		} else {
			var pathname = url.parse(req.url).pathname;
			console.log(pathname);
			switch (pathname) {
				case "/ibeacon":
					easymogo.queryMogo("ibeaconDB", undefined, dealResult, [postData, response]);
					break;
				case "/wifi":
					easymogo.queryMogo("wifiDB", undefined, dealResult, [postData, response]);
					break;
				default:
					response.writeHead(200, {
						"Content-Type": "application/json;charset=utf-8"
					});
					response.write('{"message":"path error"}');
					response.end();
			}
		}
	});
}).listen(8080);

console.log("server is listening");