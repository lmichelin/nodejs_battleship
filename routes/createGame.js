/************************************* Require dependencies **********************************************/

var express = require('express');
var io = require('../server.js');
var router = express.Router(); //Create router object

/************************************* createGame routes *********************************************************/

router.get('/', function(req, res) {
	res.render('createGame');
});

// Post the information about the user and the game that the user wants to create
router.post('/', function(req, res) {
	var username = req.body.username;
	var gameName = req.body.gameName;

	console.log('username and gameName have been successfully posted');

	req.session.username = username;


	res.send("It works well: " + username + " " + gameName + " " + req.session.username);
});

module.exports = router;