/************************************* Require dependencies **********************************************/

var express = require('express');
var player = require('../gamejs/battleship.js').player;
var io = require('../server.js').io;

var router = express.Router(); //Create router object

/************************************* createGame routes *********************************************************/

router.get('/', function(req, res) {
	res.render('createGame');
});

// Post the information about the user and the game that the user wants to create
router.post('/', function(req, res) {
	// Get all the form elements
	var username = req.body.username;
	var gameName = req.body.gameName;


	req.session.player = new player(username); //Save player object in his session
	req.session.player.createMultiplayerGame(gameName); // Create new game
	req.session.save();



	res.redirect('/initialization'); //Redirect to waiting area for another player to join the game !
});

module.exports = router;