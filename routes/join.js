/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	if (req.session.username) {  // If player already has a username
		res.render('join');
		console.log(req.session.username);
	}
	else { // If player does not yet have a username
		res.render('login');
	}
});

router.post('/', function(req, res) {
	// Get all the form elements
	var username = req.body.username;

	// Add new player
	req.session.username = username; //Save player username in his session
	req.session.save();
	gameServer.newPlayer(username);

	res.redirect('/join');
});

router.post('/game', function(req, res, callback) {
	// Get the game element
	var gameName = req.body.picked;

	//Find the game matching gameName
	var game = gameServer.games[gameName];

	// Get the username of the player
	var username = req.session.username;

	//Find the player matching username
	var player = gameServer.players[username];

	//Join game if possible
	if (game.isAvailable()) {
		gameServer.joinMultiplayerGame(gameName, player);
		res.send({redirect: '/initialization'});
		console.log('post successful game is not full');
	} else {
		isGameFull = true;
		res.send({redirect: '/join'});
		console.log('post successful game is full');
	}
});



/************************************** Socket io ************************************************************/

io.sockets.on('connection', function(socket) {
		var username = socket.handshake.session.username;
		var player = gameServer.players[username];
		var games = gameServer.games;

	    console.log(gameServer.availableGames);
		socket.emit('listGames', gameServer.availableGames);
		
	});

module.exports = router;