//pre-made Node.js modules
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require('path');
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

    // Bind port to process.env.PORT or, if none available, port 8080
    var port = process.env.PORT || 8080;
    app.listen(port, function() {
        console.log('app listening on port ' + port);
    });


});

app.use(
    function(req, res, next) {
        scheduler.onConnection();
        next();
    },
    express.static(__dirname + '/public')
);

// Serve the main landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/pages/index.html'));
})

// Serve the map page
app.get('/map', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/pages/map.html'));
})

//HTTP REQUEST FUNCTIONS
//require('./public/js/http.js');

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
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