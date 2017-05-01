/**
 * Created by huangjinajin on 2016/12/19.
 */

// this module use for mongodb
var MongoClient = require('mongodb').MongoClient;

//db config
var DB_CONN_STR = 'mongodb://admin:admin@localhost:27017/admin';
var DB_NAME = 'walle';
var COLLECTION_NAME = 'test';

var IBEACON_DATA = 'ibeacon_data';
var WIFI_DATA = "wifi_data";

exports.insertMogo = function (type, insert_doc) {
	MongoClient.connect(DB_CONN_STR, function (err, db) {
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
		default:
			console.log("insert mongo: check type");
			return;
		}
		db = db.db(DB_NAME);
		db.collection(COLLECTION_NAME, function (err, collection) {
			if (typeof(insert_doc) != "object") {
				console.log("insertMogo params is not a object");
				return;
			}
			collection.insert(insert_doc, function (err, result) {
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

exports.queryMogo = function (queryStr) {
	MongoClient.connect(DB_CONN_STR, function (err, db) {
		db = db.db(DB_NAME);
		db.collection(COLLECTION_NAME).find(queryStr).toArray(function (err, result) {
			if (err) {
				console.log('Error:' + err);
				return;
			}
			console.log(result);
			db.close();
		});
	});
}
