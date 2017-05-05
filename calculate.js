var easymogo = require('./easymogo');
var utils = require('./utils.js');

/*
rows:
	[{
		"_id": ObjectId("5908249430ed0c0f80c5473e"),
		"location": {
			"x": 10,
			"y": 100
		},
		"timeStamp": ISODate("2017-05-01T18:04:30.372+08:00"),
		"data": {
			"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 11": NumberInt("-99"),
			"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 12": NumberInt("-30"),
			"00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 13": NumberInt("-25")
		}
	}]
midSet: {
	'{"x":10,"y":"-10}': {
		'00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 16': [-100]
	},
	'{"x":10,"y":100}': {
		'00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 11': [-99, -95, -91, -99],
		'00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 12': [-30, -32, -33, -33],
		'00 00 00 00 11 11 22 22 33 33 CC CC CC CC CC 13': [-25, -21, -28, -33]
	}
}
 */

function dealIbeaconData(rows) {
	var ansArray = new Array();
	var midSet = new Object();
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var location_str = JSON.stringify(row.location);
		if (!midSet[location_str]) {
			midSet[location_str] = new Object();
		}
		for (var j in row.data) {
			if (!midSet[location_str][j]) {
				midSet[location_str][j] = new Array();
			}
			midSet[location_str][j].push(row.data[j]);
		}
	}
	// console.log(midSet);
	for (var i in midSet) {
		var location = JSON.parse(i);
		var data = new Object();
		for (var j in midSet[i]) {
			data[j] = utils.getMeanAndVariance(midSet[i][j]);
		}
		ansArray.push(new Object({
			"location": location,
			"data": data
		}));
	}
	if (ansArray.length != 0)
		easymogo.insertMogo("ibeaconDB", ansArray);
}

function dealWifiData(rows) {
	var ansArray = new Array();
	var midSet = new Object();
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var location_str = JSON.stringify(row.location);
		if (!midSet[location_str]) {
			midSet[location_str] = new Object();
		}
		for (var j in row.data) {
			if (!midSet[location_str][j]) {
				midSet[location_str][j] = new Array();
			}
			midSet[location_str][j].push(row.data[j]);
		}
	}
	// console.log(midSet);
	for (var i in midSet) {
		var location = JSON.parse(i);
		var data = new Object();
		for (var j in midSet[i]) {
			data[j] = utils.getMeanAndVariance(midSet[i][j]);
		}
		ansArray.push(new Object({
			"location": location,
			"data": data
		}));
	}
	if (ansArray.length != 0)
		easymogo.insertMogo("wifiDB", ansArray);
}

exports.start = function() {
	//first clear previous documents
	easymogo.clearCollection("ibeaconDB", {});
	easymogo.clearCollection("wifiDB", {});
	//calculate
	easymogo.queryMogo("ibeaconData", undefined, dealIbeaconData);
	easymogo.queryMogo("wifiData", undefined, dealWifiData);
}