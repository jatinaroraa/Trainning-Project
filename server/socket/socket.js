const express = require("express");
const app = express();
var number = "123";

var connection = function (io) {
  io.on("connection", function (socket) {
    var id = socket.id;

    socket.on("order", function (data) {
      io.to(socket.id).emit("orderStatus", data);
      socket.broadcast.emit("orderStatus", data);
    });
    socket.on("newOrder", function (user) {
      socket.broadcast.emit("orderStatus", user);
    });
  });
};

module.exports = connection;
