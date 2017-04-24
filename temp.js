/**
 * Created by huangjianjin on 2016/12/5.
 */
// var myModule=require('./easymogo');
// var data2="hu4tyjin,abg3,sciedst)huanin,abel,sienst)hngjin,abl,sctist)hfghngjin,arbel,sciegeregst";
// var strArray=data2.split(")");
// var myInsert=require('./easymogo');
// // var test={
// //     "ecn" : "\r\n4",
// //     "ssid" : "TP-LINK_7F0A",
// //     "rssi" : "-90",
// //     "mac" : "ec:26:ca:43:7f:0a",
// //     "ch" : "1"
// // };
// // myInsert.insertMogo(strArray);
//
// var queryStr={"ssid" : "maid"};
// var myQuery=require('./easymogo');
// myQuery.queryMogo(queryStr);

// var net = require('net');
// var port = 8989;
// var host = '127.0.0.1';
//
// var client= new net.Socket();
// client.setEncoding('binary');
// //连接到服务端
// client.connect(port,host,function(){
//     client.write('I am node.js');
// });
// client.on('data',function(data){
//     console.log('recv data:'+ data);
// });
// client.on('error',function(error){
//     console.log('error:'+error);
// });
// client.on('close',function(){
//     console.log('Connection closed');
// });
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/accounts');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongoose opened!');
    var userSchema = new mongoose.Schema({
            name:{type: String, unique: true},
            password:String
        },
        {collection: "accounts"}
    );
    var User = mongoose.model('accounts', userSchema);

    User.findOne({name:"WangEr"}, function(err, doc){
        if(err)
            console.log(err);
        else
            console.log(doc.name + ", password - " + doc.password);
    });

    // var lisi = new User({name:"WangEr", password:"654321"});
    // lisi.save(function(err, doc){
    //     if(err)console.log(err);
    //     else console.log(doc.name + ' saved');
    // });
});