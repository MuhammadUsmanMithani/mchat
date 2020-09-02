// Finding files
var express = require("express");
if (express)
{
    console.log("Express.JS found.");
}
var socket = require("socket.io");
if (socket)
{
    console.log("Socket.IO found.");
}
// Files found

// http server
var http = require("http");
var app = express();
var server = http.Server(app);
var users = [];
var io = require("socket.io")(server);
var count = 0;
server.listen(80, function () {
    console.log("Server running at port 80.")
});
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})
io.on("connection", function(socketio) {
    var name = "";
    socketio.on("has connected", function (username) {
        name = username;
        users.push(username);
        io.emit("has connected", {username: username, usersList: users});
        count = count+1;
        console.log(count+": <SERVER-THREAD-INFO>: "+name + " has connected. Online Users: " + users);
    });
    socketio.on("disconnect", function() {
        users.splice(users.indexOf(name), 1);
        io.emit("has disconnected", {username: name, usersList: users});
        count = count+1;
        console.log(count+": <SERVER-THREAD-INFO>: "+name + " has disconnected. Online Users: " + users);
    });
    socketio.on("new message", function(message) {
        io.emit("new message", message);
        count = count+1;
        console.log(count+": <SERVER-USER-MESSAGE>: "+name+": "+message.message);
    });
    process.stdin.on('data',
    (command) => {
        //output comes as many times as clients for some reason
        var msg = command.toString();
        // if (msg.startsWith("say") == true || msg.startsWith("/say") == true)
        // {
            socketio.emit("server message", msg);
        // }
        // else if (msg.startsWith("users") == true || msg.startsWith("/users") == true)
        // {
        //     process.stdout.write("Online Users: "+users+". User Count: "+ users.length);
        // }
        // else if (msg.startsWith("help") == true || msg.startsWith("/help") == true)
        // {
        //     console.log("MCHAT HELP:\nsay **** or /say **** = Send message to clients from the console.\nhelp or /help = Get help about the server.\nusers or /users = Get info about all users online.");
        // }
        // else
        // {
        //     console.log("Unknown command. Type /help for help")
        // }
    });
});
