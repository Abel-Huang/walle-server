var net = require('net');
var easymogo=require('./easymogo');
var utils=require('./utils');

// easymogo.queryMogo({"col1":"213"});

var connectMap=new Array();
var clientObj=new Object();
clientObj.setIP=function (clientIP) {
    this.clientIP=clientIP;
}
clientObj.setPort=function (clientPort) {
    this.clientPort=clientPort;
}

var listenPort = 8989;//监听端口
var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('connect: ' +socket.remoteAddress + ':' + socket.remotePort+'  client has connected');
    clientObj.setIP(socket.remoteAddress);
    clientObj.setPort(socket.remotePort);
    socket.write('hello');
    //接收到数据,并对收到的消息进行对应的处理
    socket.on('data',function(data){
		data=String(data);
        console.log('recv:' + data);
        easymogo.insertMogo(data);
		if(data.replace('\n','')==='hello')
		{
			connectMap.push(clientObj);
			console.log(connectMap.length);
		}
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
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' + socket.remoteAddress + ' ' + socket.remotePort+'  client has disconnected');
        clientObj.setIP(socket.remoteAddress);
        clientObj.setPort(socket.remotePort);
        if(utils.contains(connectMap,clientObj)){
            utils.removeFromArray(connectMap,clientObj);
        }
        console.log(connectMap.length);
    });
}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
});

