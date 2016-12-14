var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get('/', function(req, res) {
    res.sendFile("index.html");
});
app.use(express.static('public'));

io.on("connection", function(socket) {

});

http.listen(8000, function() {

});
