var net = require('net');
var easymogo = require('./easymogo');
var utils = require('./utils');

// var connectMap = new Array();
// var clientObj = new Object();
// clientObj.setIP = function (clientIP) {
// this.clientIP = clientIP;
// }
// clientObj.setPort = function (clientPort) {
// this.clientPort = clientPort;
// }

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

	var dataArray=json.data.split("+");
	var itemArray;
	for(var i in dataArray){
		itemArray=String(dataArray[i]).split(",");
		if(itemArray.length!=6)
			continue;
		wifiData.data[itemArray[3]]=itemArray[2];
	}
	easymogo.insertMogo("wifiData", wifiData);
}

var listenPort = 8080; //监听端口
var server = net.createServer(function (socket) {
		// 我们获得一个连接 - 该连接自动关联一个socket对象
		console.log('connect: ' + socket.remoteAddress + ':' + socket.remotePort + '  client has connected');
		// clientObj.setIP(socket.remoteAddress);
		// clientObj.setPort(socket.remotePort);
		// socket.write('hello');

		var ibeaconDataBuf = new Object();

		//接收到数据,并对收到的消息进行对应的处理
		socket.on('data', function (data) {
			var json = JSON.parse(data);
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
			// console.log(json);
			// console.log(JSON.stringify(ibeaconDataBuf));

			// console.log(data.toString('hex'));
			// data = String(data);
			// console.log('recv:' + data);
			// var obj = new Object();
			// obj.bluetooth=new Array();
			// obj.wifi=new Array();
			// obj.pos_x=0;
			// obj.pos_y=0;
			// easymogo.insertMogo(obj);

			// if (data.replace('\n', '') === 'hello') {
			// connectMap.push(clientObj);
			// console.log(connectMap.length);
			// }

			// var resultStr=String(data);
			// //case0:
			// if(resultStr.replace('\n','')==='hello')
			//     console.log('小车');
			// //case1：wifi
			// var str=resultStr.replace(/\+CWLAP:\(/g,'');
			// str=str.replace(/"/g,'');
			// var strArray=str.split(")");
			// var easymogo=require('./easymogo');
			//easymogo.insertMogo(strArray);
			//case2:bluetooth
		});

		//数据错误事件
		socket.on('error', function (exception) {
			console.log('socket error:' + exception);
			socket.end();
		});
		//客户端关闭事件
		socket.on('close', function (data) {
			console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort + '  client has disconnected');
			// clientObj.setIP(socket.remoteAddress);
			// clientObj.setPort(socket.remotePort);
			// if (utils.contains(connectMap, clientObj)) {
			// utils.removeFromArray(connectMap, clientObj);
			// }
			// console.log(connectMap.length);
		});
	}).listen(listenPort);

//服务器监听事件
server.on('listening', function () {
	console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error", function (exception) {
	console.log("server error:" + exception);
});
