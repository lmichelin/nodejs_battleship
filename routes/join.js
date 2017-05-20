/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('join');


	io.sockets.on('connection', function(socket) {

		var username = socket.handshake.session.username;
		var player = gameServer.players[username];
		var games = gameServer.games;

	    var availableGames = gameServer.getAvailableGames();
	    console.log(availableGames);
		socket.emit('listGames', availableGames);
		// if (player.game.player_two == null) {
		// 	status_message = "Waiting for other player to join the game ...";
		// } else {
		// 	status_message = player.game.player_two.username + " is connected !";
		// }
		// socket.emit('status', status_message);

		// Join game when asked to
		socket.on('join', function(gameName) {
			socket.handshake.session.player.joinGame(gameName);
		});
	});
});

module.exports = router;