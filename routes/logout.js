/************************************* Require dependencies **********************************************/

var express = require('express');

var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* createGame routes *********************************************************/

router.get('/', function(req, res) {
	var username = req.session.username;
	if (username) {
		io.sockets.to(game.name).emit('logout', {});
		if (gameServer.players[username].game) {
			gameServer.removeGame(gameServer.players[username].game.name);
		}
		gameServer.removePlayer(username);
	}

	req.session.destroy();

	res.redirect('/');
});

module.exports = router;