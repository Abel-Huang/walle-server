var http = require("http");
var easymogo = require('./easymogo');
var utils = require('./utils');
var FastPriorityQueue = require("fastpriorityqueue");
var generateDB = require("./calculate.js");
var url = require("url");
var net = require('net');

var smartCarSocket = undefined; //小车socket
var socketPort = 8080; //小车socket监听端口
var httpPort = 8081; //http port
var INF = 100000000;

//-------------------------------some function-------

function initIbeaconBuf(ibeaconDataBuf, json) {
	ibeaconDataBuf = new Object();
	ibeaconDataBuf.location = new Object();
	ibeaconDataBuf.location.x = json.x;
	ibeaconDataBuf.location.y = json.y;
	ibeaconDataBuf.timeStamp = new Date();
	ibeaconDataBuf.data = new Object();
	ibeaconDataBuf.data[json.uuid] = json.rssi;
	return ibeaconDataBuf;
}

function insertWifi(json) {
	var wifiData = new Object();
	wifiData.location = new Object();
	wifiData.location.x = json.x;
	wifiData.location.y = json.y;
	wifiData.timeStamp = new Date();
	wifiData.data = new Object();

	var dataArray = json.data.split("+");
	var itemArray;
	for (var i in dataArray) {
		itemArray = String(dataArray[i]).split(",");
		if (itemArray.length != 7)
			continue;
		wifiData.data[itemArray[3]] = itemArray[2];
	}
	easymogo.insertMogo("wifiData", wifiData);
}

function getDistence(ob1, ob2) {
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
	// console.log(keySet);
	var count = 0;
	for (var i = 0; i < keySet.length; i++) {
		if (keySet[i].length == 0)
			continue;
		if (!isNaN(Number(ob1[keySet[i]])) && !isNaN(Number(ob2[keySet[i]]))) {
			dis += (ob1[keySet[i]] - ob2[keySet[i]]) * (ob1[keySet[i]] - ob2[keySet[i]]);
			count++;
		}
		// console.log(dis);
	}
	// console.log(dis + "--" + count);
	if (count == 0)
		return INF;
	else return dis / count;
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
		// console.log(dis);
		if (dis == INF) {
			continue; //无穷远
		}
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
			x: -1,
			y: -1
		}
	}

	response.writeHead(200, {
		"Content-Type": "application/json;charset=utf-8"
	});
	response.write(JSON.stringify(output));
	response.end();
}

//--------------------------------------------end function


var socketServer = net.createServer(function(socket) {
	console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort + '  client has connected');
	smartCarSocket = socket;

	var ibeaconDataBuf = new Object();
	//接收消息事件
	socket.on('data', function(data) {
		data = String(data);
		var jsonArray = data.split("\r\n");
		console.log(jsonArray);
		for (var i = 0; i < jsonArray.length; i++) {
			if (jsonArray[i].length == 0)
				continue;
			var json = JSON.parse(jsonArray[i]);
			switch (json.type) {
				case "ibeacon":
					//首次接收到蓝牙信息，初始化ibeaconBuf中的值(只会在程序一开始的时候运行一次)
					if (!ibeaconDataBuf.location) {
						ibeaconDataBuf = initIbeaconBuf(ibeaconDataBuf, json);
					}
					//如果检测到此次rssi的信号与buf中的值重叠，则把上个buf插入到数据库，并初始化buf
					else if (ibeaconDataBuf.data[json.uuid]) {
						easymogo.insertMogo("ibeaconData", ibeaconDataBuf);
						ibeaconDataBuf = initIbeaconBuf(ibeaconDataBuf, json);
					} else {
						ibeaconDataBuf.data[json.uuid] = json.rssi;
					}
					break;
				case "wifi":
					insertWifi(json);
					break;
				default:
					console.log("json 不合法");
					return;
			}
		}
	});

	//数据错误事件
	socket.on('error', function(exception) {
		console.log('socket error:' + exception);
		socket.end();
	});

	//客户端关闭事件
	socket.on('close', function(data) {
		console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort + '  client has disconnected');
		smartCarSocket = undefined;
	});
}).listen(socketPort);

var httpServer = http.createServer(function(req, response) {
	req.setEncoding('utf-8');
	var postData = "";
	req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	req.addListener("end", function() {
		postData = JSON.parse(postData);
		if (postData.task != undefined) { //所有指定task的请求，都认为是生成指纹库的请求
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
					console.log(postData);
					easymogo.queryMogo("ibeaconDB", undefined, dealResult, [postData, response]);
					break;
				case "/wifi":
					easymogo.queryMogo("wifiDB", undefined, dealResult, [postData, response]);
					break;
				case "/ctr":
					if (postData.message != undefined) { //完全转发给小车
						if (smartCarSocket != undefined) {
							smartCarSocket.write(postData.message);
							response.writeHead(200, {
								"Content-Type": "application/json;charset=utf-8"
							});
							response.write('{"message":"ok"}');
							response.end();
						} else {
							response.writeHead(200, {
								"Content-Type": "application/json;charset=utf-8"
							});
							response.write('{"error":"smart car not online"}');
							response.end();
						}
					} else {
						response.writeHead(200, {
							"Content-Type": "application/json;charset=utf-8"
						});
						response.write('{"error":"message can\'t be null"}');
						response.end();
					}
					break;
				default:
					response.writeHead(200, {
						"Content-Type": "application/json;charset=utf-8"
					});
					response.write('{"error":"path error"}');
					response.end();
			}
		}
	});
}).listen(httpPort);