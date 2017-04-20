// reads and returns events from local file
function readEvents(file) {
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var rawFile = new XMLHttpRequest(), events = [];
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0))
    {
      var allText = rawFile.responseText,
      json = JSON && JSON.parse(allText) || $.parseJSON(allText);
      events = json["events"]["event"];
    }
  }
  rawFile.send(null);
  return events;
}

// inserts the PU events into the DB
var insertEvents = function(db, callback) {
  // Get the PU events collection
  var collection = db.collection('eventsPU');
  var file = "file:///Users/osamakhld/Courses/Spring2017/COS333/TigerMaps/jsonFeeds/eventsPU.json";

  // Insert events into collection
  collection.insertMany(readEvents(file), function(err, result) {
    assert.equal(err, null);
    assert.notEqual(result, [])
    console.log("Inserted events into the collection");
    if (callback) callback(result);
  });
}

// finds the results from PU events that match the query
var findByBuilding = function(db, query, callback) {
  // Get the documents collection
  var collection = db.collection('eventsPU');

  // Find events
  collection.find({"locationName": { "$regex": query } }).toArray(function(err, results) {
    assert.equal(err, null);
    assert.notEqual(results, [])
    console.log("Found the following records");
    console.log(results);
    if (callback) callback(results);
  });
}

// finds the results from PU events that match the query
var findByName = function(db, query, callback) {
  // Get the documents collection
  var collection = db.collection('eventsPU');

  // Find events
  collection.find({"title": { "$regex": query } }).toArray(function(err, results) {
    assert.equal(err, null);
    assert.notEqual(results, [])
    console.log("Found the following records");
    console.log(results);
    if (callback) callback(results);
  });
}

// uncomment to connect to the database and access the functions
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL
//var url = 'mongodb://localhost:27017/myproject';
var url = 'mongodb://heroku_745dvgs9:7pfvvi77khfh3qfor2qt0rf090@ds159330.mlab.com:59330/heroku_745dvgs9'

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  assert.notEqual(null, db);
  console.log("Connected successfully to server");

  // replace with desired functions
  findByBuilding(db, "Richardson", function() {
    db.close(function (err) {
      if(err) throw err;
    });
  });
});
