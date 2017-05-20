/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('initialize');

	console.log('waiting for players');
	io.sockets.on('connection', function(socket) {
		var username = socket.handshake.session.username;
		var game = gameServer.players[username].game;
		if (game.player_two == null) {
			status_message = "Waiting for other player to join the game ...";
		} else {
			status_message = game.player_two.username + " is connected !";
		}
		socket.emit('status', status_message);
	});
});

module.exports = router;