/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/
router.get('/', function(req, res) {
	req.session.username = req.sessionID;
	req.session.save();

	var UserID = req.sessionID;


	// Create new player object
	gameServer.newPlayer(UserID);

	// Create solo game with an AI
	gameServer.createSoloGame(gameServer.players[UserID]);


	res.redirect('/setBoats');
});

module.exports = router;