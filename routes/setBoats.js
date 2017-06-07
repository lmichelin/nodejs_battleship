/************************************* Require dependencies **********************************************/

var express = require('express');
var gameServer = require('../server.js').gameServer;
var io = require('../server.js').io;
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/
router.get('/', function(req, res) {
	// If player already has a username then we are good to send him the page
	if (req.session.username) { 
		var username = req.session.username;
		// check if player is in a game 
		if (gameServer.players[username].game) {
			// Check if another player has joined the game
			if (!gameServer.players[username].game.isAvailable()) {
				res.render('setBoats');
			}
			// If no player has joined the game redirect to initialize page
			else {
				res.redirect('/initialize');
			}
		}
	}
	else {
		// If player does not yet have a username redirect to homepage
		res.redirect('/');
	}

});

// Get request to give the client the battleship object with all the boats inside
router.get('/getBoats', function(req, res) {
	// Check if player has a username and is in a vaild game
	if (req.session.username) {  
		var username = req.session.username;
		if (gameServer.players[username].game) {
			if (!gameServer.players[username].game.isAvailable()) {
				// Retrieve the battleship object of the player
				var battleship = gameServer.players[username].battleship;
				res.send({battleship: battleship});
			}
		}
	}
	else {
		// If player does not yet have a username redirect to homepage
		res.status(400).send({errors: 'there was an error'});
	}
});


router.post('/sendBoats', function(req, res) {
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
		// Parse the integers strings in integers
		sentBoats[sentBoat].coordinates = sentBoats[sentBoat].coordinates.map(Number);

		boats[sentBoat].setPosition(sentBoats[sentBoat].coordinates, sentBoats[sentBoat].direction);

		// If the boat has not been set by the user (normally impossible), add error
		if (!sentBoats[sentBoat].isSet) {
			errors.push(sentBoats[sentBoat].name + ' has not been set !');
		}

		// Set coordinates list of the boat:
		boats[sentBoat].setCoordinatesList();

		// Get all the errors on boat position if there are any 
		var error = battleship.positionIsNotValid(sentBoat);
		// If there is an error, add it to the errors list
		if (error) {
			errors.push(error);
		}
		// If there are no errors, set the boat on the grid
		else {
			battleship.setBoat(sentBoat);
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
		// Tell gameServer that the boats have all been set !
		battleship.areBoatsSet = true;
		res.send({
			redirect:'/game',
		});
	}
});



module.exports = router;