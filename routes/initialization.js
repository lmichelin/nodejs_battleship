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