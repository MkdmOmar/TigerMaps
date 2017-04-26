var express = require('express');
var app = express();
var path = require('path');
var CAS = require('cas')
var session = require('cookie-session')

// Configure the app to save a cookie with two attributes (for netid and status)
app.use(session({ keys: ['key1', 'key2'] }))

// Configure CAS authentication
var casURL = 'https://fed.princeton.edu/cas/'
var cas = new CAS({
        base_url: casURL,
        service: 'http://localhost:8080/verify'
    })
    // https://fed.princeton.edu/cas/login?service=http://localhost:8080/verify
app.get('/login', function(req, res) {
    console.log("logging in");
    // Redirect the user to the CAS server
    res.redirect(casURL + 'login?service=' + 'http://localhost:8080/verify');
});

app.get('/verify', function(req, res) {
    var ticket = req.query.ticket;
    // console.log("request is: ", req);
    // console.log("request.query is: ", req.query);
    // console.log("ticket is: ", ticket);

    console.log("verifying");


    // If the user already has a valid CAS session then send them to their destination
    if (req.session.cas) {
        console.log("user already logged in, redirecting to /");
        res.redirect('/');
        return;
    }

    console.log('validating ticket');

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
                    netid: username
                };
                console.log("redirecting to /");
                res.redirect('/');
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
    req.session = null;
    res.redirect('/');

    // Perhpas we should just logout of CAS entirely?
    res.redirect('https://fed.princeton.edu/cas/logout');
})


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    // res.redirect(casURL + 'login?service=' + 'http://localhost:8080/verify');

    if (typeof(req.session.cas) !== 'undefined') {
        console.log("user already logged in, serving index.html");
        res.sendFile(path.join(__dirname + '/index.html'));
    } else {
        console.log("user not logged in! redirecting to /login");
        res.redirect("/login");
    }

});

app.listen(8080, function() {
    console.log("listening on port ", 8080);
});