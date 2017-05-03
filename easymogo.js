/**
 * Created by huangjinajin on 2016/12/19.
 */

// this module use for mongodb
var MongoClient = require('mongodb').MongoClient;

//db config
var DB_CONN_STR = 'mongodb://walle:walle@120.25.69.243:27017/walle';
// var DB_NAME = 'walle';
var COLLECTION_NAME = 'test';

var IBEACON_DATA = 'ibeacon_data';
var WIFI_DATA = "wifi_data";
var IBEACON_DB = "ibeacon_db";
var WIFI_DB = "wifi_db";

exports.insertMogo = function(type, insert_doc) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        switch (type) {
            case "ibeaconData":
                COLLECTION_NAME = IBEACON_DATA;
                break;
            case "wifiData":
                COLLECTION_NAME = WIFI_DATA;
                break;
            case "ibeaconDB":
                COLLECTION_NAME = IBEACON_DB;
                break;
            case "wifiDB":
                COLLECTION_NAME = WIFI_DB;
                break;
            default:
                console.log("insert mongo: check type");
                return;
        }
        // db = db.db(DB_NAME);
        db.collection(COLLECTION_NAME, function(err, collection) {
            if (typeof(insert_doc) != "object") {
                console.log("insertMogo params is not a object");
                return;
            }
            collection.insert(insert_doc, function(err, result) {
                if (err) {
                    console.log('Error:' + err);
                    return;
                } else
                    console.log(JSON.stringify(result));
            });
            db.close(err, db);
        });
    });
}

exports.queryMogo = function(type, queryStr, fun_callback, fun_callback_params) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        switch (type) {
            case "ibeaconData":
                COLLECTION_NAME = IBEACON_DATA;
                break;
            case "wifiData":
                COLLECTION_NAME = WIFI_DATA;
                break;
            case "ibeaconDB":
                COLLECTION_NAME = IBEACON_DB;
                break;
            case "wifiDB":
                COLLECTION_NAME = WIFI_DB;
                break;
            default:
                console.log("insert mongo: check type");
                return;
        }
        // db = db.db(DB_NAME);
        db.collection(COLLECTION_NAME).find(queryStr).toArray(function(err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            fun_callback(result, fun_callback_params);
            db.close();
        });
    });
}

exports.clearCollection = function(type, queryStr) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        switch (type) {
            case "ibeaconData":
                COLLECTION_NAME = IBEACON_DATA;
                break;
            case "wifiData":
                COLLECTION_NAME = WIFI_DATA;
                break;
            case "ibeaconDB":
                COLLECTION_NAME = IBEACON_DB;
                break;
            case "wifiDB":
                COLLECTION_NAME = WIFI_DB;
                break;
            default:
                console.log("clearCollection: check type");
                return;
        }
        db.collection(COLLECTION_NAME).remove(queryStr, function(err, removed) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            db.close();
        });
    });
}