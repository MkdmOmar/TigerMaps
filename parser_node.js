const https = require("https");

function getXMLString(webFeedURL, callback) {
  const req = https.request(webFeedURL, function(response) {
    let str = ""
    response.on("data", function(data) {
      str += data;
    });
    response.on("end", function(data) {
      callback(str);
    });
  });

  req.on("error", function(error) {
    console.error(error);
  });

  req.end();
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

getXMLString(compPrintURL, function(compPrintXML) {
  console.log("Retrieved Computing and Printing Data!")
  // console.log(compPrintXML);
});

getXMLString(diningURL, function(diningXML) {
  console.log("Retrieved Dining Data!")
  // console.log(diningXML);
});

getXMLString(locationsURL, function(locationsXML) {
  console.log("Retrieved Locations Data!")
  // console.log(locationsXML);
});

getXMLString(placesURL, function(placesXML) {
  console.log("Retrieved Places Data!")
  // console.log(placesXML);
});

getXMLString(publicEventsURL, function(publicEventsXML) {
  console.log("Retrieved Public Events Data!")
  // console.log(publicEventsXML);
});

getXMLString(USGEventsURL, function(USGEventsXML) {
  console.log("Retrieved USG Events Data!")
  // console.log(USGEventsXML);
});
