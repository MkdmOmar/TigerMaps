var express = require('express');

var server = express();
 server.use(express.static(__dirname + '/public'));
//server.use(express.static(__dirname + '/bootstrap-3.3.7/docs/examples/carousel'));


// Bind port to process.env.PORT or, if none available, port 8080
var port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});
