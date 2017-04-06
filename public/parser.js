/*
BEFORE USING THIS:

Make sure you allow requests to any site with ajax from any source.

Use this Chrome extension:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
It adds to response 'Allow-Control-Allow-Origin: *' header

This is just for development purposes only.
*/

// This function retrieves an XML string from url
function parse(webFeedURL, returnResult) {
  console.log("loading parser!")
  var xmlReq = new XMLHttpRequest();
  xmlReq.open("GET", webFeedURL, true);
  xmlReq.onreadystatechange = function () {
    // If request was a success
    if (xmlReq.readyState == 4 && xmlReq.status == 200)
    {
      // Parse XML as string
      var xmlString = new XMLSerializer().serializeToString(xmlReq.responseXML)
      console.log("parser success!")

      // Pass result to callback function
      returnResult(xmlString);

    }
    else {
      console.log("parser failure!")
    }
  };
  xmlReq.send(null);
}


// Computing and Printing: Provides XML streams of data about computer and
// printing public clusters on campus
compPrintURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=5"

// Dining: Provides XML streams of data about dining facilities on campus.
diningURL = "https://etcweb.princeton.edu/webfeeds/places/?categoryID=20"

// Locations: Provides XML and JSON streams of location data for buildings,
// parking lots and other constructed elements of the Princeton University campus.
locationsURL = "https://etcweb.princeton.edu/webfeeds/map/"

// Places: Provides XML streams of data about "places" on campus
// (e.g. dining, printing, parking, etc.)
placesURL = "https://etcweb.princeton.edu/webfeeds/places/"

// Public Events: Provides near-real-time XML and JSON streams of event data
// from the R25 public events scheduling system.
publicEventsURL = "https://etcweb.princeton.edu/webfeeds/events/"

// USG Events: Provides iCal and XML streams of event data from the USG Student
// Events Calendar.
USGEventsURL = "https://etcweb.princeton.edu/webfeeds/events/usg/"

parse(compPrintURL, function(compPrintXML){
  console.log("Retrieved Computing and Printing Data!")
  // console.log(compPrintXML);
});

parse(diningURL, function(diningXML){
  console.log("Retrieved Dining Data!")
  // console.log(diningXML);
});

parse(locationsURL, function(locationsXML){
  console.log("Retrieved Locations Data!")
  // console.log(locationsXML);
});

parse(placesURL, function(placesXML){
  console.log("Retrieved Places Data!")
  // console.log(placesXML);
});

parse(publicEventsURL, function(publicEventsXML){
  console.log("Retrieved Public Events Data!")
  // console.log(publicEventsXML);
});

parse(USGEventsURL, function(USGEventsXML){
  console.log("Retrieved USG Events Data!")
  // console.log(USGEventsXML);
});
