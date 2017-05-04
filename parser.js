/*
BEFORE USING THIS:

Make sure you allow requests to any site with ajax from any source.

Use this Chrome extension:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
It adds to response 'Allow-Control-Allow-Origin: *' header

This is just for development purposes only.
*/

// pre-made Node.js modules
var MongoClient = require('mongodb').MongoClient
const https = require("https");
var assert = require("assert");
// TODO unused
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var toJson = require("./xml2json");

// datafeed URIs
var publicEventsURL = "https://etcweb.princeton.edu/webfeeds/events/"
var compPrintURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=5"
var diningURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=20"
var locationsURL = "https://etcweb.princeton.edu/webfeeds/map/"
var placesURL = "https://etcweb.princeton.edu/webfeeds/places/"
var USGEventsURL = "https://etcweb.princeton.edu/webfeeds/events/usg/"
var laundryURL = " https://etcweb.princeton.edu/webfeeds/places/?categoryID=14"

// MongoDB Conncetion URI
var uri = 'mongodb://heroku_745dvgs9:7pfvvi77khfh3qfor2qt0rf090@ds159330.mlab.com:59330/heroku_745dvgs9'

// TODO unused
//  retrieves an XML string from url (OLD VERSION)
/*function getFeedOLD(webFeedURL, returnResult) {

  var xmlReq = new XMLHttpRequest();
  xmlReq.open("GET", webFeedURL, true);
  xmlReq.send(null);
  xmlReq.onreadystatechange = function () {
    // If request was a success
    if (xmlReq.status == 200) {
      // wait until response is ready
      if (xmlReq.readyState == 4) {
        var json = toJson.xml2json(xmlReq.responseText, "");
        if (returnResult) (returnResult(json))
        else return json
      }
    }
    else {
      console.log("parser failure. Error: %d", xmlReq.status);
      if (!returnResult) return null
    }
  };
}*/

// Retrieves a JSON object from a URL containing an XML feed.
function getFeed(webFeedURL, callback) {
  const req = https.request(webFeedURL, function(response) {
    let str = ""
    response.on("data", function(data) {
      str += data;
    });
    response.on("end", function(data) {
      var json = toJson.xml2json(str, "");
      callback(json);
    });
  });

  req.on("error", function(error) {
    console.error(error);
  });

  req.end();
}

// Uodate all DB collections
function getAllFeeds(db) {
  var puEvents, dining, printers, locations, places, usgEvents, laundry

  // Public events collection
  getFeed(publicEventsURL, function(json) {
    console.log("Retrieved Public Events Data");
    puEvents = json["events"]["event"];
    for (var i = 0; i < puEvents.length; i++){
      var doc = puEvents[i];
      db.collection('puEvents').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Public Events");
  });

  // Dining collection
  getFeed(diningURL, function(json) {
    console.log("Retrieved Dining Data");
    dining = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < dining.length; i++){
      var doc = dining[i];
      db.collection('dining').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Dining Info");
  });

  // Printer collection
  getFeed(compPrintURL, function(json) {
    console.log("Retrieved Computing and Printing Data");
    printers = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < printers.length; i++){
      var doc = printers[i];
      db.collection('printers').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Printers Info");
  });

  // Locations collection
  getFeed(locationsURL, function(json) {
    console.log("Retrieved Locations Data");
    locations = json["locations"]["location"];
    for (var i = 0; i < locations.length; i++){
      var doc = locations[i];
      db.collection('locations').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Locations Info");
  });

  // Places collection
  getFeed(placesURL, function(json) {
    console.log("Retrieved Places Data")
    places = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < places.length; i++){
      var doc = places[i];
      db.collection('places').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Places Info");
  });


  // USG events collection
  getFeed(USGEventsURL, function(json) {
    console.log("Retrieved USG Events Data");
    usgEvents = json["events"]["event"];
    for (var i = 0; i < usgEvents.length; i++){
      var doc = usgEvents[i];
      db.collection('usgEvents').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted USG Events ");
  });

  // Laundry collection
  getFeed(laundryURL, function(json) {
    console.log("Retrieved Laundry Data");
    laundry = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < laundry.length; i++){
      var doc = laundry[i];
      db.collection('laundry').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    console.log("Inserted Laundry Info");
  });
}

function updateDB() {
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    getAllFeeds(db);
    //db.close(function (err) {
    //  if (err) throw err;
    //});
  });
}

function clearDB() {
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db.collection('puEvents').remove({});
    db.collection('dining').remove({});
    db.collection('printers').remove({});
    db.collection('locations').remove({});
    db.collection('places').remove({});
    db.collection('usgEvents').remove({});
    db.collection('laundry').remove({});
    console.log("Database Cleared");
    db.close(function (err) {
      if (err) throw err;
    });
  });
}

module.exports = {
  updateDB: updateDB,
  clearDB: clearDB
};
