var fs = require('fs');
var express = require("express");
var app = express();

app.use(express.static("../public"));
app.use(function(req, res) {
	fs.readFile("../public/index.html", function (err, data) {
		if (err) throw err;
		res.type("html");
		res.send(200, data);
	});
});

app.listen(8080);
