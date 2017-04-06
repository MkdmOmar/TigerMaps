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



publicEventsURL = "https://etcweb.princeton.edu/webfeeds/events/"

parse(publicEventsURL, function(publicEventsXML){
  console.log(publicEventsXML);
});
