/*
BEFORE USING THIS:

Make sure you allow requests to any site with ajax from any source.

Use this Chrome extension:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
It adds to response 'Allow-Control-Allow-Origin: *' header

This is just for development purposes only.
*/

// This function retrieves an XML string from url
function getFeed(webFeedURL, returnResult) {
  var toJson = require("./xml2json");
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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

// Public Events: Provides near-real-time XML and JSON streams of event data
// from the R25 public events scheduling system.
var publicEventsURL = "https://etcweb.princeton.edu/webfeeds/events/"

// Computing and Printing: Provides XML streams of data about computer and
// printing public clusters on campus
var compPrintURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=5"

// Dining: Provides XML streams of data about dining facilities on campus.
var diningURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=20"

// Locations: Provides XML and JSON streams of location data for buildings,
// parking lots and other constructed elements of the Princeton University campus.
var locationsURL = "https://etcweb.princeton.edu/webfeeds/map/"

// Places: Provides XML streams of data about "places" on campus
// (e.g. dining, printing, parking, etc.)
var placesURL = "https://etcweb.princeton.edu/webfeeds/places/"

// USG Events: Provides iCal and XML streams of event data from the USG Student
// Events Calendar.
var USGEventsURL = "https://etcweb.princeton.edu/webfeeds/events/usg/"



getFeed(publicEventsURL, function(publicEventsXML){
  console.log("Retrieved Public Events Data!");
  //console.log(publicEventsXML);
});

getFeed(compPrintURL, function(compPrintXML){
  console.log("Retrieved Computing and Printing Data!")
  //console.log(compPrintXML);
});

getFeed(diningURL, function(diningXML){
  console.log("Retrieved Dining Data!")
  // console.log(diningXML);
});

getFeed(locationsURL, function(locationsXML){
  console.log("Retrieved Locations Data!")
  // console.log(locationsXML);
});

getFeed(placesURL, function(placesXML){
  console.log("Retrieved Places Data!")
  // console.log(placesXML);
});

getFeed(USGEventsURL, function(USGEventsXML){
  console.log("Retrieved USG Events Data!")
  // console.log(USGEventsXML);
});
