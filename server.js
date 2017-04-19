var express = require('express');
var scheduler = require('./scheduler');

var server = express();

server.use(
  function(req, res, next) {
    scheduler.onConnection();
    next();
  },
  express.static(__dirname + '/public')
);

// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
