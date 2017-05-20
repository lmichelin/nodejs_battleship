/************************************* Require dependencies **********************************************/

var express = require('express');
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('join');
	for (key in io.sockets.connected) {
		console.log(io.sockets.connected[key].handshake.session);	
	}

	io.sockets.on('connection', function(socket) {
		// console.log(socket.handshake.session.player);
		// if (socket.handshake.session.player.game.player_two == null) {
		// 	status_message = "Waiting for other player to join the game ...";
		// } else {
		// 	status_message = socket.handshake.session.player.game.player_two.username + " is connected !";
		// }
		// socket.emit('status', status_message);

		// Join game when asked to
		socket.on('join', function(gameName) {
			socket.handshake.session.player.joinGame(gameName);
		});
	});
});

module.exports = router;