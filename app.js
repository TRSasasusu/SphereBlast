var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var THREE = require("three");

var castleBirdTargetNow = null;
var castleBirdTargetIndexNow = 0;
var castleBirdTargetPositions = [
    new THREE.Vector3(1038, 67.5, -22),
    new THREE.Vector3(1033, 36, 39.5),
    new THREE.Vector3(961, 36, 33),
    new THREE.Vector3(968.5, 67.5, -28),
    new THREE.Vector3(999, 5, -2.5)
];
var castleBirdPositionNow = castleBirdTargetPositions[0];
var castleBirdStartTime = 0;
var castleBirdCountTime = 6000;
var castleBirdRotation = [0, 0, 0];
var castleBirdDummy = new THREE.Object3D();

var starPositions = [
    new THREE.Vector3(-942, 34, -13),
    new THREE.Vector3(-925, 20.2, -5.5),
    new THREE.Vector3(-957.5, 26, 7),
    new THREE.Vector3(-955, 31, -20.5),
    new THREE.Vector3(-896, 13, 22),
    new THREE.Vector3(-900, 30.7, -20.5)
];
var usedStarPositions = [0, 1, 2];
var Star = function(positionId) {
    this.position = starPositions[positionId];
    this.id = -1;
    this.previousId = -1;
};
var stars = [
    new Star(0),
    new Star(1),
    new Star(2)
];
var localStarPosition = new THREE.Vector3(1, 2, -2);

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
        var isFlying = false;
        if(castleBirdDiffTime < castleBirdCountTime) {
            castleBirdPositionNow.lerp(castleBirdTargetNow, castleBirdDiffTime / castleBirdCountTime);
            isFlying = true;
        }
        
        //console.log(castleBirdPositionNow.x);
        else if(castleBirdPositionNow.distanceTo(position) < 12) {
            var tmpIndex;
            do {
                tmpIndex = Math.floor(Math.random() * castleBirdTargetPositions.length);
            } while(tmpIndex == castleBirdTargetIndexNow);
            castleBirdTargetIndexNow = tmpIndex;
            castleBirdTargetNow = castleBirdTargetPositions[castleBirdTargetIndexNow];

            var direction = castleBirdTargetNow.clone().sub(castleBirdPositionNow);
            castleBirdDummy.lookAt(direction);
            /*var xDirection = new THREE.Vector3(direction.x, 0, direction.z);
            var yDirection = new THREE.Vector3(0, direction.y, direction.z);
            castleBirdRotationY = (new THREE.Vector3(0, 0, -1)).angleTo(yDirection);
            castleBirdRotationX = (new THREE.Vector3(0, 0, -1)).angleTo(xDirection);*/
            castleBirdRotation[0] = castleBirdDummy.rotation.x;
            castleBirdRotation[1] = castleBirdDummy.rotation.y;
            castleBirdRotation[2] = castleBirdDummy.rotation.z;

            castleBirdDummy.lookAt(direction.sub(new THREE.Vector3(0, direction.y, 0)));
            castleBirdStartTime = Date.now();
        }
        else {
            castleBirdRotation[0] = castleBirdDummy.rotation.x;
            castleBirdRotation[1] = castleBirdDummy.rotation.y;
            castleBirdRotation[2] = castleBirdDummy.rotation.z;
        }
        io.emit("castleBirdMove", castleBirdPositionNow, castleBirdRotation[0], castleBirdRotation[1], castleBirdRotation[2], isFlying);

        var starPositions = [];
        for(var i = 0; i < stars.length; ++i) {
            starPositions.push(stars[i].position);
            if(stars[i].id == socket.id) {
                if(position.x > -500) {
                    starReset(i);
                }
                else {
                    stars[i].position = localStarPosition.clone().add(position);
                }
                continue;
            }

            if(stars[i].previousId == socket.id) {
                continue;
            }

            var isThisHavingAnotherStar = false;
            for(var j = 0; j < stars.length; ++j) {
                if(stars[j].id == socket.id) {
                    isThisHavingAnotherStar = true;
                    break;
                }
            }
            if(isThisHavingAnotherStar) {
                continue;
            }

            if(stars[i].position.distanceTo(position) < 8) {
                stars[i].previousId = stars[i].id;
                stars[i].id = socket.id;
                stars[i].position = localStarPosition.clone().add(position);
                starPositions[i].copy(stars[i].position);
                usedStarPositions[i] = -1;
            }
        }
        io.emit("starsMove", starPositions);
        //console.log("published by " + socket.id);
        //console.log("position: " + position.x + "," + position.y + "," + position.z);
        socket.broadcast.emit("publish", socket.id, position);
    });

    socket.on("disconnect", function() {
        for(var i = 0; i < stars.length; ++i) {
            if(stars[i].id == socket.id) {
                starReset(i);
            }
        }
        io.emit("disconnect", socket.id);
    });
});

function starReset(index) {
    stars[index].id = -1;
    stars[index].previousId = -1;
    var nextId;
    do {   
        nextId = Math.floor(Math.random() * starPositions.length);
    } while(isHavingTheNumber(usedStarPositions, nextId));
    stars[index].position = starPositions[nextId];
    usedStarPositions[index] = nextId;
}

function isHavingTheNumber(array, num) {
    for(var it in array) {
        if(it == num) {
            return true;
        }
    }
    return false;
}

http.listen(process.env.PORT || 8000, function() {

});
