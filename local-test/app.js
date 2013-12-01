var express = require("express");
var path = require("path");
var app = express();

app.use(express.static("../public"));
app.all("*", function(req, res) {
	res.type("html");
	res.sendfile(path.resolve('../public/index.html'));
});

app.listen(8080);
