var fs = require("fs");

function start(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    var output = fs.readFileSync("./index.html", "utf-8");
    response.end(output);
}

exports.start = start;