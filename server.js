var express = require('express');
var scheduler = require('./scheduler');
var CASAuthentication = require('cas-authentication');

var server = express();

/* CAS documentation:
https://www.npmjs.com/package/cas-authentication
*/

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
    cas_url     : 'https://fed.princeton.edu/cas/',
    service_url : 'https://tigermaps.herokuapp.com/'
});

server.use(
  function(req, res, next) {
    scheduler.onConnection();
    next();
  },
  express.static(__dirname + '/public')
);

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
server.get( '/logout', cas.logout );

// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
server.get( '/login', cas.bounce, function ( req, res ) {
    res.send( '<html><body>Hello!</body></html>' );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
server.get( '/authenticate', cas.bounce_redirect );

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
server.get( '/api', cas.block, function ( req, res ) {
    res.json( { success: true } );
});

// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
