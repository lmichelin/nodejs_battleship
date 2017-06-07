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

		if (!game.isAvailable()) {

			// Get enemy player
			var enemyPlayer;
			if (game.player_one.username == username) {
				enemyPlayer = game.player_two;
			}
			else {
				enemyPlayer = game.player_one;
			}

			socket.on('attack', function(attackCoordinates) {
				// Get attack coordinates
				coordinates = [attackCoordinates.row, attackCoordinates.col];
				console.log(username);
				console.log(enemyPlayer.username);

				battleship.attackEnemy(coordinates, enemyPlayer);
				console.log(enemyPlayer.battleship.grid);
				var response = {battleship: enemyPlayer.battleship};
				socket.broadcast.to(enemyPlayer.socketId).emit('attack', response);

				console.log(battleship.attack_grid);

				response = {battleship: battleship}
				socket.emit('attack', response);
			});

		}
	}

});


module.exports = router;
