/*
BEFORE USING THIS:

Make sure you allow requests to any site with ajax from any source.

Use this Chrome extension:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en
It adds to response 'Allow-Control-Allow-Origin: *' header

This is just for development purposes only.
*/


console.log("loading parser!")

publicEventsURL = "https://etcweb.princeton.edu/webfeeds/events/"
var pubEventsReq = new XMLHttpRequest();
pubEventsReq.open("GET", publicEventsURL, true);
pubEventsReq.onreadystatechange = function () {
  // If request was a success
  if (pubEventsReq.readyState == 4 && pubEventsReq.status == 200)
  {
    // Parse XML as string
    var pubEvents = new XMLSerializer().serializeToString(pubEventsReq.responseXML)
    console.log("parser success!")
    console.log(pubEvents);

  }
  else {
    console.log("parser failure!")
  }
};
pubEventsReq.send(null);
