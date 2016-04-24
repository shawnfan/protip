var express = require('express');
var app = express();
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var port = process.env.PORT || 1024;
var url = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

/*
	Mongo DB Object Modeling
*/
/*
mongoose.connect(uristr, function(err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + uristr + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + uristr);
	}
});

var userSchema = new mongoose.Schema({
	name: {
		first: String,
		last: String
	},
	email: String
});
var tipSchema = new mongoose.Schema({
	name: String,
	content: String
	userId: String
});
*/

MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log ('ERROR connecting to: ' + url + '. ' + err);
	} else {
		db.close();
		console.log ('Succeeded connected to: ' + url + " and closed");
	}
})

/*
	RESTful API
*/
app.get('/', function(req, res) {
 res.send("Hi, this is Protip!");
});

app.get('/tips', function(req, res) {
	res.send("get all tips " + process.env.DB_USERNAME);

});

app.post('/tips', function(req, res){
	//res.send("posted one tip");
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertDocument(db, data, function() {
			db.close();
		});
	});
});

app.put('/tips/:name', function(req, res){
	res.send("update one tip");
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
    console.log(result);
    callback();
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
