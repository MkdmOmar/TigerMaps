var express = require('express');

var server = express();

server.use(
  function(req, res, next) {
    // on connection
    next();
  },
  express.static(__dirname + '/public')
);

// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
