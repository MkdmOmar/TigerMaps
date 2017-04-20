/*
BEFORE USING THIS:

Make sure you allow requests to any site with ajax from any source.

Use this Chrome extension:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
It adds to response 'Allow-Control-Allow-Origin: *' header

This is just for development purposes only.
*/

// This function retrieves an XML string from url
function getXML(webFeedURL, returnResult) {
  console.log("loading parser!")
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
        console.log("parser success!");

        var toType = function(obj) {
          return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
        }
        console.log(toType(xmlReq.responseXML));

        //var json = toJson.xml2json(xmlReq.responseXML);
        //returnResult(json);
      }
    }
    else {
      console.log("parser failure!");
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

getXML(publicEventsURL, function(publicEventsXML){
  console.log("Retrieved Public Events Data!");
  console.log(publicEventsXML);
});

/*
getXML(compPrintURL, function(compPrintXML){
  console.log("Retrieved Computing and Printing Data!")
  //console.log(compPrintXML);
});

getXML(diningURL, function(diningXML){
  console.log("Retrieved Dining Data!")
  // console.log(diningXML);
});

getXML(locationsURL, function(locationsXML){
  console.log("Retrieved Locations Data!")
  // console.log(locationsXML);
});

getXML(placesURL, function(placesXML){
  console.log("Retrieved Places Data!")
  // console.log(placesXML);
});

getXML(USGEventsURL, function(USGEventsXML){
  console.log("Retrieved USG Events Data!")
  // console.log(USGEventsXML);
});
*/
