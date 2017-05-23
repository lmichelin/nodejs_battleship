/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('initialize');
});

/*********************************** Socket io ************************************************************/

io.sockets.on('connection', function(socket) {
	
	// var username = socket.handshake.session.username;
	// var game = gameServer.players[username].game;

	// var player_one = game.player_one;
	// var player_two = game.player_two;

	// if (username == player_one.username) {
	// 	if (game.isAvailable()) {
	// 		status_message = "Waiting for other player to join the game ...";
	// 	} else {
	// 		status_message = game.player_two.username + " is connected !";
	// 		socket.join(game.name);
	// 	}
	// } 
	// else {
	// 	status_message = "You are  connected with" + player_one.username + " !";
	// 	socket.join(game.name);
	// }
	// socket.emit('status', status_message);
});

module.exports = router;