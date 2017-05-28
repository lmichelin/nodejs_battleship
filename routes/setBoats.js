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


router.post('/sendBoats', function(req, res) {
	console.log('post request ok');
	// Get all the form elements
	var sentBoats = req.body.boats;
	var username = req.session.username;

	//Get the player battleship and boat objects
	var battleship = gameServer.players[username].battleship;
	var boats = battleship.boats;

	// Make an error array to store all error messages for the user
	var errors = [];

	// Get the initial coordinates and direction of all the boats and check if position is valid
	for (sentBoat in sentBoats) {
		boats[sentBoat.name].coordinates = sentBoat.coordinates; // Initial coordinates
		boats[sentBoat.name].direction = sentBoat.direction; // Direction of the boat 'right' or 'down'

		// If the boat has not been set by the user (normally impossible), add error
		if (!sentBoat.isSet) {
			errors.push(sentBoat.name + ' has not been set !');
		}

		// Get all the errors on boat position if there are any 
		var error = battleship.positionIsNotValid(boat);
		// If there is an error, add it to the errors list
		if (error) {
			errors.push(error);
		}
		// If there are no errors, set the boat on the grid
		else {
			battleship.setBoat(boat);
		}
	}

	// If errors have been found send an error status to the user (status 400)
	if (errors.length != 0) {
		console.log(errors);
		console.log('Error on boats post !');
		res.status(400).send({errors: errors});
	}

	// If there are no errors send a new link to the user to start the game !
	else {
		res.send({
			redirect:'/game',
			boatsSet:true
		});
	}
});



module.exports = router;