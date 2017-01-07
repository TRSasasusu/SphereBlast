var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var three = require("three");

var castleBirdPositionNow = new THREE.Vector3(1033, 69, -26);
var castleBirdTargetNow = null;
var castleBirdTargetPositions = [
    new THREE.Vector3(1033, 69, -26),
    new THREE.Vector3(1033, 35, 37.5),
    new THREE.Vector3(961, 35, 33),
    new THREE.Vector3(968.5, 66, -25),
    new THREE.Vector3(999, 3.5, -2.5)
];
var castleBirdStartTime = 0;
var castleBirdCountTime = 3000;

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
        var castleBirdDiffTime = Date.now() - castleBirdStartTime;
        if(castleBirdDiffTime < castleBirdCountTime) {
            castleBirdPositionNow.lerp(castleBirdTargetNow, castleBirdDiffTime / castleBirdCountTime);
        }
        if(castleBirdPositionNow.distanceTo(position) < 3) {
            castleBirdTargetNow = castleBirdTargetPositions[Math.floor(Math.random() * castleBirdTargetPositions.length)];
            io.emit("castleBirdMove", castleBirdPositionNow, castleBirdTargetNow);
        }
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
