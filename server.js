//pre-made Node.js modules
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

//our own Node.js modules
var scheduler = require('./scheduler');
var CASAuthentication = require('cas-authentication');
var parser = require('./public/js/parser');
var dbFuncs = require('./public/js/dbFuncs');

//the app
var app = express();
app.use(bodyParser.json());

//database variable to use outside of callback
var db;

//uri for connections
var uri = 'mongodb://heroku_745dvgs9:7pfvvi77khfh3qfor2qt0rf090@ds159330.mlab.com:59330/heroku_745dvgs9'

mongodb.MongoClient.connect(uri, function(err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Connected successfully to database");

  app.use(
    function(req, res, next) {
      scheduler.onConnection();
      next();
    },
    express.static(__dirname + '/public')
  );

  // Bind port to process.env.PORT or, if none available, port 8080
  var port = process.env.PORT || 8080;
  var server = app.listen(port, function() {
      console.log('app listening on port ' + port);
  });


});
        //CAS AUTHENTICATION FUNCTIONS

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url     : 'https://fed.princeton.edu/cas/',
    service_url : 'https://tigermaps.herokuapp.com/'
});

// This route will de-authenticate the client with the Express app and then
// redirect the client to the CAS logout page.
app.get( '/logout', cas.logout );

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get( '/login', cas.bounce, function ( req, res ) {
    res.send( '<html><body>Hello!</body></html>' );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get( '/authenticate', cas.bounce_redirect );

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get( '/api', cas.block, function ( req, res ) {
    res.json( { success: true } );
});

        //HTTP REQUEST FUNCTIONS
        //require('./public/js/http.js');

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/fetch/dining", function(req, res) {
  db.collection("diningPU").find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dining information.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/fetch/dining", function(req, res) {
  db.collection("diningPU").find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get dining information.");
    } else {
      res.status(200).json(docs);
    }
  });
});

