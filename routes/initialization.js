//Require express and other dependencies
var express = require('express');

//Create router object
var router = express.Router();

// Battleship game dependencies
var battleship = require('../gamejs/battleship').battleship;
var boat = require('../gamejs/battleship').boat;

var battleship_1 = new battleship('player_one');
var battleship_2 = new battleship('player_two');


//Initialize game route: We need a grid setup with all the boats in place
router.get('/', function(req, res) {

	//Send all boat objects
	context = {
		'carrier': battleship_1.boats.carrier,
		'battleship': battleship_1.boats.battleship,
		'submarine': battleship_1.boats.submarine,
		'cruiser': battleship_1.boats.cruiser,
		'destroyer': battleship_1.boats.destroyer
	};
	res.render('initialize', context);
});


// Receive boat positions
router.post('initialize/post', function(req, res) {

	battleship_1.boats.carrier = req.body.carrier;
	battleship_1.boats.battleship = req.body.battleship;
	battleship_1.boats.submarine = req.body.submarine;
	battleship_1.boats.cruise = req.body.cruise;
	battleship_1.boats.destroyer = req.body.destroyer;



});

module.exports = {
	'router': router,
	'battleship_1': battleship_1,
	'battleship_2': battleship_2
};