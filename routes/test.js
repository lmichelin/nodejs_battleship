//Require express and other dependencies
var express = require('express');

//Create router object
var router = express.Router();

//Get socket.io
var io = require('../server.js');

//Import battleship grids
var battleship_1 = require('./initialization').battleship_1;

// Main route
router.get('/', function (req, res) {
  res.render('index', {
    'battleship': battleship_1
  });

  io.sockets.on('connection', function(socket) {
    socket.on("login", function(pseudo, callback) {
      socket.handshake.session.test = "test";
      socket.handshake.session.pseudo = pseudo;
      socket.handshake.session.save();
      console.log(socket.handshake.session);
    });
    console.log('Un client est connecté !');
    socket.emit('message', 'Tu es biezn connecté');
    socket.broadcast.emit('message', 'un autre se connecte !');
    // Quand le serveur reçoit un signal de type "message" du client
    socket.on('message', function(message) {
      console.log(socket.handshake.session);
      //console.log(socket.handshake.session.pseudo + ' me parle ! Il me dit : ' + message);
    });
  });
});

module.exports = router;