var http = require("http");
var url = require("url");

var server = http.createServer(function(req, response) {
	req.setEncoding('utf-8');
	var postData = "";
	req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
	});
	req.addListener("end", function() {
		postData = JSON.parse(postData);
		console.log(postData);
		response.writeHead(200, {
			"Content-Type": "application/json;charset=utf-8"
		});
		response.write('{"statusCode":200}');
		response.end();
	});
}).listen(8081);

console.log("server is listening");