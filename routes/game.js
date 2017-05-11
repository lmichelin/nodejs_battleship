//Require express and other dependencies
var express = require('express');

//Create router object
var router = express.Router();

// Battleship game dependencies
var battleship_1 = require('../routes/initialization').battleship_1;
var battleship_2 = require('../routes/initialization').battleship_2;
var boat = require('../gamejs/battleship').boat;


/* Game route */
router.get('/', function(req, res) {
	res.render('game', {'battleship_1': battleship_1, 'battleship_2': battleship_2})
});

router.get('/battleship', function(req, res) {
	var row = req.param('row');
	var column = req.param('column');

	battleship_1.attackEnemy(row, column, battleship_2);

	res.render('game', {'battleship_1':battleship_1, 'battleship_2':battleship_2});
});

router.post('/post', function(req, res) {
	var coordinates = req.body.coordinates;
	console.log(coordinates);
	//battleship_1.attackEnemy(coordinates.row, coordinates.column, battleship_2);
	res.send(coordinates + ' ahwwwww !!!!');
	//res.render('game', {'battleship_1':battleship_1, 'battleship_2':battleship_2});
});

module.exports = router;
