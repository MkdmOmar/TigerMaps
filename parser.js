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
var toJson = require("./xml2json");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var assert = require("assert");

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

//  retrieves an XML string from url
function getFeed(webFeedURL, returnResult) {

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
}

// inserts the PU events into the DB
function getAllFeeds(db) {
  var puEvents, dining, printers, locations, places, usgEvents, laundry

  // Public events collection
  getFeed(publicEventsURL, function(json) {
    console.log("Retrieved Public Events Data");
    puEvents = json["events"]["event"];
    db.collection('puEvents').remove({});
    db.collection('puEvents').insertMany(puEvents, function(err, result) {
      assert.equal(err, null)
      //assert.notEqual(result, null)
      //assert.notEqual(result, [])
      console.log("Inserted Public Events");
    });
  });

  // Dining collection
  getFeed(diningURL, function(json) {
    console.log("Retrieved Dining Data");
    dining = json["places"]["places"]["PLPlace"];
    db.collection('dining').remove({});
    db.collection('dining').insertMany(dining, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, null);
      console.log("Inserted Dining Data");
    });
  });

  // Printer collection
  getFeed(compPrintURL, function(json) {
    console.log("Retrieved Computing and Printing Data");
    printers = json["places"]["places"]["PLPlace"];
    db.collection('printers').remove({});
    db.collection('printers').insertMany(printers, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, null);
      console.log("Inserted Computing and Printing Data");
    });
  });

  // Locations collection
  getFeed(locationsURL, function(json) {
    console.log("Retrieved Locations Data");
    locations = json["locations"]["location"];
    db.collection('locations').remove({});
    db.collection('locations').insertMany(locations, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, null);
      console.log("Inserted Locations Data");
    });
  });

  // Places collection
  getFeed(placesURL, function(json) {
    console.log("Retrieved Places Data")
    places = json["places"]["places"]["PLPlace"];
    db.collection('places').remove({});
    db.collection('places').insertMany(places, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, []);
      console.log("Inserted Places Data");
    });
  });


  // USG events collection
  getFeed(USGEventsURL, function(json) {
    console.log("Retrieved USG Events Data");
    usgEvents = json["events"]["event"];
    db.collection('usgEvents').remove({});
    db.collection('usgEvents').insertMany(usgEvents, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, []);
      console.log("Inserted USG Events Data");
    });
  });

  // Laundry collection
  getFeed(laundryURL, function(json) {
    console.log("Retrieved Laundry Data");
    laundry = json["places"]["places"]["PLPlace"];
    db.collection('laundry').remove({});
    db.collection('laundry').insertMany(laundry, function(err, result) {
      assert.equal(err, null);
      assert.notEqual(result, []);
      console.log("Inserted Laundry Data");
    });
  });
}

function updateDB() {
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    getAllFeeds(db);
    //db.close(function (err) {
    //  if(err) throw err;
    //});
  });
}

exports.parser = parser;
