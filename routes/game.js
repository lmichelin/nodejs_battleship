//Require express and other dependencies
var express = require('express');

//Create router object
var router = express.Router();

// Battleship game dependencies
var battleship_1 = require('../routes/initialization').battleship_1;
var boat = require('../gamejs/battleship').boat;


/* Game route */
router.get('', function(req, res) {
	res.render('game', {'battleship': battleship_1})
});

router.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  battleship_1.attackCoordinates(row, column);

  res.render('game', {'battleship':battleship_1});
});

router.post('/post', function(req, res) {
	var boat = req.body.boat;
	battleship_1.setBoat(carrier);
});

module.exports = router;