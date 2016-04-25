var express = require('express');
var app = express();
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var port = process.env.PORT || 1024;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/test";


/*
	Midware
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/*
	RESTful API
*/
app.get('/', function(req, res) {
 res.send("Hi, this is Protip!");
});

app.get('/tips', function(req, res) {
	res.send("Haven't implement 'all tips' yet");
});

app.post('/tips', function(req, res){
	var data = {
		name: req.body.name,
		content: req.body.content,
		userId: req.body.userId
	};

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertDocument(db, data, function(result) {
			res.send(result);
			db.close();
		});
	});
});

app.put('/tips/:name', function(req, res){
	res.send("//TODO: update one tip.");
});

app.get('/tips/name/:name', function(req, res) {
	//res.send("get specific tip: " + req.params.id);
	var rst = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findDocByKey(db, {'name': req.params.name}, function(data){
			if (data == null) {
				db.close();
				res.send(rst);
			}
			rst.push(data);
		});
	});
});

app.get('/tips/user/:userId', function(req, res) {
	//res.send("get specific tip: " + req.params.id);
	var rst = [];
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		findDocByKey(db, {'userId': req.params.userId}, function(data){
			if (data == null) {
				db.close();
				res.send(rst);
			}
			rst.push(data);
		});
	});
});



app.listen(port, function() {
	console.log("Hey, Protip is running at port 1024!");
});

var insertDocument = function(db, data, callback) {
   db.collection('tips').insertOne(data, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the tips collection.");
    callback(result.ops[0]);
  });
};

var findDocByKey = function(db, key, callback) {
	var cursor = db.collection('tips').find(key);
	var rst = [];
	cursor.each(function(err, doc) {
      assert.equal(err, null);
      rst.push(doc);
      callback(doc);
   });
};
