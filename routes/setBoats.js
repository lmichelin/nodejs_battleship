/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var battleship1 = require('../gamejs/battleship.js').battleship;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/
var battleship = new battleship1();
router.get('/', function(req, res) {

	res.render('setBoats', {battleship: battleship});
	// // If player already has a username theen we are good to send him the page
	// if (req.session.username) {  
	// 	if (gameServer.players[username].game) {
	// 		if (!gameServer.players[username].game.isAvailable) {
	// 			res.render('setBoats');
	// 		}
	// 	}
	// }
	// // If player does not yet have a username redirect to homepage
	// res.redirect('/');
});

// Get request to give the client the battleship object with all the boats inside
router.get('/getBoats', function(req, res) {
	console.log('request get');
	res.send({battleship: battleship})
	// // Check if player has a username and is in a vaild game
	// if (req.session.username) {  
	// 	if (gameServer.players[username].game) {
	// 		if (!gameServer.players[username].game.isAvailable) {
	// 			// Retrieve the battleship object of the player
	// 			var battleship = gameServer.players[username].battleship;
	// 			res.send({battleship: battleship})
	// 		}
	// 	}
	// }
	// // If player does not yet have a username redirect to homepage
	// res.redirect('/');
});


router.post('/sendBoat', function(req, res) {
	// Get all the form elements
	var username = req.body.username;
	var boat = req.body.boat;

	//Get the player battleship object
	var battleship = gameServer.players[username].battleship;

	if (battleship.positionIsNotValid(boat)) {
		var errors = battleship.positionIsNotValid(boat);
		console.log('Error on boat post');
		res.status(400).send({errors: errors});
	}
	battleship.setBoat(boat);

	var flag = false;
	for (boat in battleship.boats) {
		if (!boat.isSet) {
			flag = true;
		}
	}

	if (flag) {
		res.send({boatsSet: false});
	}

	res.send({
		redirect:'/game',
		boatsSet:true
	});
});



module.exports = router;