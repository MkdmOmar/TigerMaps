// Pre-made Node.js modules
var express = require('express');
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require('path');
var ObjectID = mongodb.ObjectID;
var CAS = require('cas')
var session = require('cookie-session')

// Our own Node.js modules
var scheduler = require('./scheduler');

// The app
var app = express();
app.use(bodyParser.json());

// Database variable to use outside of callback
var db;

// URI for connections
var uri = 'mongodb://heroku_745dvgs9:7pfvvi77khfh3qfor2qt0rf090@ds159330.mlab.com:59330/heroku_745dvgs9'

// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;

// start the scheduler
scheduler.start();

mongodb.MongoClient.connect(uri, function(err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    db = database;
    console.log("Connected successfully to database");

    app.listen(port, function() {
        console.log('app listening on port ' + port);
    });

});

// Serve static content in /public directory
app.use(express.static(__dirname + '/public'));


// Configure the app to save a cookie with two attributes (for netid and status)
app.use(session({ keys: ['key1', 'key2'] }))

// The domain and port on which the app is running
var host = process.env.HOST || 'http://localhost:8080'
console.log("host:", host);

// CAS service URL
var casServiceURL = host + "/verify";

// Configure CAS authentication
var casURL = 'https://fed.princeton.edu/cas/'
var cas = new CAS({
    base_url: casURL,
    service: casServiceURL
})


// https://fed.princeton.edu/cas/login?service=http://localhost:8080/verify
app.get('/login', function(req, res) {
    console.log("logging in");
    // Redirect the user to the CAS server
    res.redirect(casURL + 'login?service=' + casServiceURL);
});

app.get('/verify', function(req, res) {
    var ticket = req.query.ticket;
    // console.log("request is: ", req);
    // console.log("request.query is: ", req.query);
    // console.log("ticket is: ", ticket);

    console.log("verifying");

    // If the user already has a valid CAS session then send them to their destination
    if (req.session.cas) {
        console.log("user already logged in, redirecting to /map");
        res.redirect('/map');
        return;
    }

    console.log('validating ticket');
    // Check if ticket-granting-ticket is valid
    if (ticket) {
        cas.validate(ticket, function(err, status, username) {
            if (err) {
                console.log('invalid ticket!');
                // Handle the error
                res.send({ error: err });
            } else {
                // Log the user in
                console.log("ticket valid\nstatus:", status, "username:", username);
                // Save the user's session data
                req.session.cas = {
                    status: status,
                    netID: username
                };
                console.log("redirecting to /map");
                res.redirect('/map');
            }
        });
    } else {
        console.log('no ticket found!');
        res.end('no ticket!');
        //res.redirect('/');
    }
});

// Log the user out
app.get('/logout', function(req, res) {

    // For now, I'm just clearing the session cookie, which should be fine.
    req.session = null;
    res.redirect('/map');

    // But perhaps we should just logout of CAS entirely? nah just clear cookie like above
    //res.redirect('https://fed.princeton.edu/cas/logout');
})


// Serve the main landing page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/pages/index.html'));
})


// Configure the EJS templating system (http://www.embeddedjs.com)
app.set('view engine', 'ejs')

// Serve the map page
app.get('/map', function(req, res) {

    // If user already logged in
    if (typeof(req.session.cas) !== 'undefined') {
        console.log("user already logged in. Serving map.html with loggedIn = true");

        // Render map page with netID
        res.render('pages/map', {
            loggedIn: true,
            netID: req.session.cas.netID
        });
    } else {
        console.log("user not logged in! Serving map.html with loggedIn = false");

        // Render not-logged-in version of map page
        res.render('pages/map', {
            loggedIn: false,
            netID: null
        });
    }


    // res.sendFile(path.join(__dirname + '/views/pages/map.html'));
})

//HTTP REQUEST FUNCTIONS
//require('./public/js/http.js');

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

app.get("/fetch/dining", function(req, res) {
    db.collection("dining").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/laundry", function(req, res) {
    db.collection("laundry").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/locations", function(req, res) {
    db.collection("locations").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/places", function(req, res) {
    db.collection("places").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/printers", function(req, res) {
    db.collection("printers").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/puEvents", function(req, res) {
    db.collection("puEvents").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get("/fetch/usgEvents", function(req, res) {
    db.collection("usgEvents").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get dining information.");
        } else {
            res.status(200).json(docs);
        }
    });
});

// Ferch ALL info for a building specified by the URL query
app.get("/fetch/buildingInfo", function(req, res) {
    var queryBuildingName = req.query.buildingName;
    console.log("buildingName: " + queryBuildingName);
    var collections = ["printers", "dining", "laundry", "locations", "places", "puEvents", "usgEvents"]
    var ignoreCollections = [ "system.indexes" ];
    var completedDBQueries = 0;
    var numDBQueries = collections.length;
    var response = {};

    db.collections(function(err, collections) {
        if (err) {
            console.log("ERROR: Failed to get database collections.");
        }
        else {
            var totalDBQueries = 0;
            for (var i = 0; i < collections.length; i++) {
                if (ignoreCollections.indexOf(collections[i].collectionName) == -1) {
                    totalDBQueries += 1;
                }
            }
            for (var i = 0; i < collections.length; i++) {
                var collectionName = collections[i].collectionName;
                if (ignoreCollections.indexOf(collectionName) == -1) {
                    var processCollection = function(name) {
                        // Wrapper for avoiding closure madness.
                        return function(err, docs) {
                            if (err) {
                                console.log("ERROR: Failed to get " + collection + " information.");
                            }
                            else {
                                response[name] = docs;
                            }
                            completedDBQueries += 1;
                            if (completedDBQueries == totalDBQueries) {
                                res.status(200).json(response);
                            }
                        };
                    };
                    collections[i].find({ building_name: queryBuildingName }).toArray(processCollection(collectionName));
                }
            }
        }
    });

    /*db.collection("printers").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get printing information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.printers = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("dining").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get dining information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.dining = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("laundry").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get laundry information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.laundry = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("locations").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get locations information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.locations = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("places").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get places information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.places = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("puEvents").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get puEvents information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.puEvents = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });

    db.collection("usgEvents").find({ building_name: queryBuildingName }).toArray(function(err, docs) {
        if (err) {
            console.log("ERROR: Failed to get usgEvents information.");
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        } else {
            response.usgEvents = docs;
            completedDBQueries += 1;
            if (completedDBQueries == numDBQueries) {
                res.status(200).json(response);
            }
        }
    });*/

});