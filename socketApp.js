var PORT = 8008;
 
var options = {
//    'log level': 0
};
 
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, options);
server.listen(PORT);

 
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (client) {console.log(client)

    client.on('message', function (msg) {

        client.broadcast.emit('message', msg);

       
    });
});