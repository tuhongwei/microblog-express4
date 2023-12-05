const { MongoClient } = require('mongodb');
var assert = require('assert');
var settings = require('./settings');

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.insertedCount);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log("Connected correctly to server");
	const db = client.db(settings.db)

  insertDocuments(db, function() {
    findDocuments(db, function() {
      client.close();
    });
  });
});