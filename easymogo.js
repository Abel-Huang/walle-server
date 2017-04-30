/**
 * Created by huangjinajin on 2016/12/19.
 */

// this module use for mongodb
var MongoClient = require('mongodb').MongoClient;
var mongo=new MongoClient();
var strArray;
var DB_CONN_STR = 'mongodb://admin:admin@localhost:27017/admin';
exports.insertMogo=function (strArray) {
    mongo.connect(DB_CONN_STR,function (err,db) {
        if(err){
            console.log('Error:'+ err);
            return;
        }
        var myDB=db.db('walle');
        myDB.collection("wifi",function (err,collection) {
            // for(var i=0;i<strArray.length;i++) {
                // var elem=strArray[i].split(',');
                // var data = [{"ecn":elem[0].replace('\r','').replace('\n',''),"ssid":elem[1],"rssi":elem[2],"mac":elem[3],"ch":elem[4]}];
                // collection.insert(data,function (err,result) {
                    // if(err)
                    // {
                        // console.log('Error:'+ err);
                        // return;
                    // }
                    // else
                        // console.log('Result:'+ result);
                // });
            // }
			var data={"col1":strArray};
			collection.insert(data,function (err,result) {
                if(err)
                {
                    console.log('Error:'+ err);
                    return;
                }
                else
                    console.log('Result:'+ result);
                }
			);
            myDB.close(err,db);
        });
    });
}

var queryStr;
exports.queryMogo=function(queryStr){
    var selectData = function(db, callback) {
        //连接到表
        var collection = db.collection('wifi');
        //查询数据
        collection.find(queryStr).toArray(function(err, result) {
            if(err)
            {
                console.log('Error:'+ err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function(err, db) {
		db=db.db('walle');
        selectData(db, function(result) {
            console.log(result);
            db.close();
        });
    });
}
