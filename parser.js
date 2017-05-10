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
var jsdom = require('node-jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);
var toJson = require("./xml2json");

// TODO unused
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
      //console.log("parser failure. Error: %d", xmlReq.status);
      if (!returnResult) return null
    }
  };
}*/

// --------- String Helper Functions ---------
function trim(str) {
    return str.replace(/^\s+|\s+$/g,'');
}

function ReplaceAll(Source,stringToFind,stringToReplace){
  var temp = Source;
    var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// --------- End String Helper Functions ---------


// Retrieves a JSON object from a URL containing an XML feed.
function getFeed(webFeedURL, convert ,callback) {
  const req = https.request(webFeedURL, function(response) {
    let str = ""
    response.on("data", function(data) {
      str += data;
    });
    response.on("end", function(data) {
      if (convert) {
        var json = toJson.xml2json(str, "");
        if (callback) callback(json);
        return json;
      } else {
        if (callback) callback(str);
        return str;
      }
    });
  });

  req.on("error", function(error) {
    //console.error(error);
  });

  req.end();
}

// Uodate all DB collections
function getAllFeeds(db) {
  var puEvents, dining, printers, locations, places, usgEvents, laundry

  // Public events collection
  getFeed(publicEventsURL, true, function(json) {
    //console.log("Retrieved Public Events Data");
    puEvents = json["events"]["event"];
    for (var i = 0; i < puEvents.length; i++){
      var doc = puEvents[i];
      db.collection('puEvents').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Public Events");
  });

  // Dining collection
  getFeed(diningURL, true, function(json) {
    //console.log("Retrieved Dining Data");
    dining = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < dining.length; i++){
      var doc = dining[i];
      db.collection('dining').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Dining Info");
  });

  // Printer collection
  getFeed(compPrintURL, true, function(json) {
    //console.log("Retrieved Computing and Printing Data");
    printers = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < printers.length; i++){
      var doc = printers[i];
      db.collection('printers').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Printers Info");
  });

  // Locations collection
  getFeed(locationsURL, true, function(json) {
    //console.log("Retrieved Locations Data");
    locations = json["locations"]["location"];
    for (var i = 0; i < locations.length; i++){
      var doc = locations[i];
      db.collection('locations').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Locations Info");
  });

  // Places collection
  getFeed(placesURL, true, function(json) {
    //console.log("Retrieved Places Data")
    places = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < places.length; i++){
      var doc = places[i];
      db.collection('places').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Places Info");
  });


  // USG events collection
  getFeed(USGEventsURL, true, function(json) {
    //console.log("Retrieved USG Events Data");
    usgEvents = json["events"]["event"];
    for (var i = 0; i < usgEvents.length; i++){
      var doc = usgEvents[i];
      db.collection('usgEvents').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted USG Events ");
  });

  // Laundry collection
  getFeed(laundryURL, true, function(json) {
    //console.log("Retrieved Laundry Data");
    laundry = json["places"]["places"]["PLPlace"];
    for (var i = 0; i < laundry.length; i++){
      var doc = laundry[i];
      db.collection('laundry').update(doc, doc, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });
    }
    //console.log("Inserted Laundry Info");
  });
}

function getMenus(db, meal, callback) {
  var key = ""
  var url = "https://tigermenus.herokuapp.com/" + meal + "0"
  getFeed(url, false, function(food) {
    // parse the HTML response to get menu items
    var elements = $("<div>").html(food)[0].getElementsByClassName("container")[0].getElementsByClassName("row")[0].getElementsByClassName("col-sm-2");
    for (var i = 0; i < elements.length; i++)
    {
      // all the elements with a <p> tag
      paragraphs = elements[i].getElementsByTagName("p");
      hall = elements[i].getElementsByTagName("h3")[0].firstChild.nodeValue
      if (hall == "Ro / Ma") hall = "Rocky / Mathey"
      else if (hall == "CJL" || hall == "Grad") continue;

      // populate menu object
      var menu = new Object();
      menu['name'] = hall;
      menu['meal'] = meal;
      for (var j = 0; j < paragraphs.length; j++) {
        var text = paragraphs[j].firstChild.nodeValue;
        if (text.toLowerCase() == meal) {}
        else if (text.includes("--")) {
          key = trim(ReplaceAll(text, "--", ""));
          menu[key] = new Array()
        }
        else if (key != "")
          menu[key].push(text);
      }

      // updates menus in DB
      db.collection('menus').update(menu, menu, { upsert: true }, function(err, result) {
        if (err) throw err
        assert.notEqual(result, null);
        assert.notEqual(result, []);
      });

      if (callback) callback(menu)
    }
    //console.log("Updated " + capitalize(meal) + " Menus");
  });
}

function updateDB() {
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    //console.log("Connected successfully to server");

    getAllFeeds(db);
    getMenus(db, "lunch");
    getMenus(db, "dinner");
    //db.close(function (err) {
    //  if (err) throw err;
    //});
  });
}

function clearDB() {
  MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    //console.log("Connected successfully to server");

    db.collection('puEvents').remove({});
    db.collection('dining').remove({});
    db.collection('printers').remove({});
    db.collection('locations').remove({});
    db.collection('places').remove({});
    db.collection('usgEvents').remove({});
    db.collection('laundry').remove({});
    //console.log("Database Cleared");
  });
}

module.exports = {
  updateDB: updateDB,
  clearDB: clearDB
};

updateDB();
