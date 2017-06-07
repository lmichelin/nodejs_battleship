/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/
router.get('/', function(req, res) {
	// Check if player has a username
	if (req.session.username) { 
		var username = req.session.username;
		// check if player is in a game 
		if (gameServer.players[username].game) {
			// Check if another player has joined the game
			if (!gameServer.players[username].game.isAvailable()) {
				// Check if boats are set
				if (gameServer.players[username].battleship.areBoatsSet) {
					res.render('game')
				}
				else {
					res.redirect('/setBoats');
				}
			}
			// If no player has joined the game redirect to initialize page
			else {
				res.redirect('/initialize');
			}
		}
	}
	else {
		// If player does not yet have a username redirect to homepage
		res.redirect('/');
	}
});

// Get request to give the client the battleship object with all the boats inside
router.get('/getBattleship', function(req, res) {
	// Check if player has a username and is in a valid game
	if (req.session.username) {  
		var username = req.session.username;
		if (gameServer.players[username].game) {
			if (!gameServer.players[username].game.isAvailable()) {
				// Retrieve the battleship object of the player
				var battleship = gameServer.players[username].battleship;
				res.send({battleship: battleship})
			}
		}
	}
	else {
		res.status(400).send({errors: 'You are not connected !!'});
	}
});


/***************************** Socket io ***********************************/
io.sockets.on('connection', function(socket) {


	// Get username, battleship and game of the connected user 
	var username = socket.handshake.session.username;
	var game = gameServer.players[username].game;

	if (game) {

		var battleship = gameServer.players[username].battleship;

		// Both users have to be in the game
		if (!game.isAvailable()) {

			// Get enemy player
			var enemyPlayer;
			if (game.player_one.username == username) {
				enemyPlayer = game.player_two;
			}
			else {
				enemyPlayer = game.player_one;
			}

			// Initialize the response message for the users
			var response = {
				message:'',
				battleship:{}
			};

			// If the other player has not set the boats yet, send the message to the user
			if (!enemyPlayer.battleship.areBoatsSet) {
				response.message = 'Waiting for ' + enemyPlayer.username + " to set his boats"
				socket.emit('wait', response);

				// Give this player the priviledge to begin the game since he is the first one to have his boats set
				gameServer.players[username].isTurn = true;
			}

			if (gameServer.players[username].isTurn) {
				socket.on('attack', function(attackCoordinates) {
					// Get attack coordinates
					coordinates = [attackCoordinates.row, attackCoordinates.col];

					// Execute attack function
					battleship.attackEnemy(coordinates, enemyPlayer);

					// Check if the user has won
					if (enemyPlayer.battleship.isFleetDestroyed()) {
						var response = {message: 'You have lost ! Better luck next time !'};
						socket.broadcast.to(enemyPlayer.socketId).emit('finish', response);
						response = {message: 'You won !'};
						socket.emit('finish', response);
					}

					//  If there is no victory ...
					else {
						// Change user's turn:
						gameServer.players[username].isTurn = false;
						enemyPlayer.isTurn = true;

						// Send the response to both users
						response = {message: 'It is your turn to play', battleship: enemyPlayer.battleship};
						socket.broadcast.to(enemyPlayer.socketId).emit('attack', response);

						response = {message: "It is " + enemyPlayer.username + "'s turn to play", battleship: battleship}
						socket.emit('attack', response);
					}
				});
			}

		}
	}

});


module.exports = router;
