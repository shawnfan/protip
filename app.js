var express = require('express');
var app = express();

app.get('/', function(req, res) {
 res.send("Hi, this is Protip!");
});

app.listen(1024, function() {
	console.log("Hey, Protip is running at port 1024!");
});

/*
	RESTful API
*/
app.get('/tips', function(req, res) {
	res.send("get all tips");
});

app.post('/tips', function(req, res){
	res.send("posted one tip");
});

app.put('/tips/:id', function(req, res){
	res.send("update one tip");
});

app.get('/tips/:id', function(req, res) {
	res.send("get specific 1 tip");
});