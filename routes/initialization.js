/************************************* Require dependencies **********************************************/

var express = require('express');
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('initialize');

	console.log('waiting for players');
	io.sockets.on('connection', function(socket) {
		if (socket.handshake.session.player.game.player_two == null) {
			status_message = "Waiting for other player to join the game ...";
		} else {
			status_message = socket.handshake.session.player.game.player_two.username + " is connected !";
		}
		socket.emit('status', status_message);
	});
});

module.exports = router;