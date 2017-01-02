var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var three = require("three");

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static(__dirname + '/public'));

//var userHash = {};

io.on("connection", function(socket) {
    socket.on("connected", function(position, rotation) {
        //userHash[socket.id] = 
        io.emit("publish", socket.id, position, rotation);
    });

    socket.on("publish", function(position, rotation) {
        io.emit("publish", socket.id, position, rotation);
    });

    socket.on("disconnect", function() {
        io.emit("disconnect", socket.id);
    });
});

http.listen(process.env.PORT || 8000, function() {

});
