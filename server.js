// Finding files
var express = require("express");
if (express)
{
    console.log("Express.JS found.");
}
else
{
    console.log("Express.JS not found. Please install Express.JS. npm install express --save.")
}
var socket = require("socket.io");
if (socket)
{
    console.log("Socket.IO found.");
}
else
{
    console.log("Socket.IO not found. Please install Socket.IO. npm install express --save.")
}
// Files found

// http server
var http = require("http");
var app = express();
var server = http.Server(app);
var users = [];
var io = require("socket.io")(server);
server.listen(4444, function () {
    console.log("Server running at port 4444.")
});
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
    res.sendFile(__dirname + "/favicon.png");
})
io.on("connection", function(socketio) {
    var name = "";
    socketio.on("has connected", function (username) {
        name = username;
        users.push(username);
        io.emit("has connected", {username: username, usersList: users});
    });
    socketio.on("disconnect", function() {
        users.splice(users.indexOf(name), 1);
        io.emit("has disconnected", {username: name, usersList: users})
    });
    socketio.on("new message", function(message) {
        io.emit("new message", message);
    })
    socketio.on("cleardata", function(){
        socketio.emit("clearall");
    })
});
