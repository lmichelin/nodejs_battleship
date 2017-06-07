/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	// If player already has a username and a game then we are good to send him the page
	if (req.session.username) {
		// check if player is registered to a  game
		if (gameServer.players[req.session.username].game) {
			res.render('initialize');
		}
	}
	else {
		// If player does not yet have a username redirect to homepage
		res.redirect('/');
	}
});


module.exports = router;

/*********************************** Socket io ************************************************************/

// This code will execute when the user refreshes the page ...
io.sockets.on('connection', function(socket) {

	var username = socket.handshake.session.username;
	var game = gameServer.players[username].game;

	var status = {
		status: 'waiting',
		message: '',
		gameRoom: '',
	}

	// If the user has created or joined a game ...
	if (game) {
		var player_one = game.player_one;
		var player_two = game.player_two;

		// If the user is the player who created the game ...
		if (username == player_one.username) {
			status.message = "Waiting for players to join the game ...";
			socket.join(game.name)
			status.gameRoom = game.name;
			socket.emit('status', status);
		}
		// If the user is the player who joined the game ...
		else {


			// Send message to player one !
			status.message = "Player " + player_two.username + " is connected ! You are ready to start the game !";
			status.status = 'connected';
			socket.to(game.name).emit('status', status);

			// Join specific game room
			status.message = "You are  connected with " + player_one.username + " !";
			socket.emit('status', status);
			socket.join(game.name);

		}
	}

	socket.on('startGame', function() {
		var response = {redirect: '/setBoats'};
		io.sockets.in(game.name).emit('setBoats', response)
	})
});
