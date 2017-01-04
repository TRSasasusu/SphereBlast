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
    /*socket.on("connected", function(position) {
        //userHash[socket.id] = 
        io.emit("publish", socket.id, position);
    });*/

    socket.on("publish", function(position) {
        //console.log("published by " + socket.id);
        //console.log("position: " + position.x + "," + position.y + "," + position.z);
        socket.broadcast.emit("publish", socket.id, position);
    });

    socket.on("disconnect", function() {
        //console.log("disconnect by " + socket.id);
        io.emit("disconnect", socket.id);
    });
});

http.listen(process.env.PORT || 8000, function() {

});
