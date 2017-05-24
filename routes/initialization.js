/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('initialize');
});


module.exports = router;

/*********************************** Socket io ************************************************************/

// This code will execute when the user refreshes the page ...
io.sockets.on('connection', function(socket) {
	
	var username = socket.handshake.session.username;
	var game = gameServer.players[username].game;

	// If the user has created or joined a game ...
	if (game) {
		var player_one = game.player_one;
		var player_two = game.player_two;

		// If the user is the player who created the game ...
		if (username == player_one.username) {
			status_message = "Waiting for players to join the game ...";
			socket.join(game.name)
			socket.emit('status', status_message);
		} 
		// If the user is the player who joined the game ...
		else {

			// Send message to player one !
			status_message = "Player " + player_two.username + " is connected ! You are ready to start the game !";
			socket.to(game.name).emit('status', status_message);

			// Join specific game room
			status_message = "You are  connected with" + player_one.username + " !";
			socket.emit('status', status_message);
			socket.join(game.name);

		}
	}
});
 


