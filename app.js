// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var index = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
//
// var http=require("http");
// var sio=require("socket.io");
// var fs=require("fs");
// var server=http.createServer(function (req,res) {
//     res.writeHead(200,{"Content-type":"text/html"});
//     res.end(fs.readFileSync("./public/index.html"));
// });
// server.listen(12345);
// var i=0;
// var socket=sio.listen(server);
// socket.on("connection", function (socket) {
//     console.log("客户端建立连接")
//     socket.send("你好"+i);
//     i++;
//     socket.on("message", function (msg) {
//         console.log("接收到一个消息:"+msg);
//     });
//     socket.on("disconnect", function () {
//         console.log("客户端断开连接.");
//     });
// });

//this is my code
var connectMap=new Array();
var clientObj=new Object();
var clientIP;
var clientPort;
clientObj.setIP=function (clientIP) {
    this.clientIP=clientIP;
}
clientObj.setPort=function (clientPort) {
    this.clientPort=clientPort;
}

var iconv = require('iconv-lite');
var net = require('net');
var timeout = 20000;//超时
var listenPort = 8989;//监听端口

var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('connect: ' +socket.remoteAddress + ':' + socket.remotePort+'  client has connected');
    clientObj.setIP(socket.remoteAddress);
    clientObj.setPort(socket.remotePort);
    connectMap.push(clientObj);
    console.log(connectMap.length);
    socket.write('hello');
    //接收到数据,并对收到的消息进行对应的处理
    socket.on('data',function(data){
        console.log('recv:' + data);
        var resultStr=String(data);
        //case0:
        if(resultStr.replace('\n','')==='hello')
            console.log('小车');
        //case1：wifi
        var str=resultStr.replace(/\+CWLAP:\(/g,'');
        str=str.replace(/"/g,'');
        var strArray=str.split(")");
        var myInsert=require('./easymogo');
        //myInsert.insertMogo(strArray);
        //case2:bluetooth
    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort+'  client has disconnected');
        clientObj.setIP(socket.remoteAddress);
        clientObj.setPort(socket.remotePort);
        var isContains=require('./utils');
        var removeObj=require('./utils');
        if(isContains.contains(connectMap,clientObj)){
            removeObj.removeFromArray(connectMap,clientObj);
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

