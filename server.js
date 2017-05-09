/* Require Dependencies */
var express = require('express');
var ejs = require('ejs');
var path = require('path');

/* Define Port 8080 by default */
var port = 8080;

/* Initialize express for easy server-client relationship */
var app = express();

app.use(express.static('static'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// include battleship.js
var battleship = require('./battleship');
var battleship_1 = new battleship('player_one');
var carrier = new boat('carrier', 5);

/* Game route */
app.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  battleship_1.attack(row, column);

  res.send({'battleship':battleship_1});
});

app.post('/battleship/post', function(req, res) {
	var boat = req.body.boat;
	battleship_1.setBoat(boat);
});

// Main route
app.get('/', function (req, res) {
  res.render('index', {'battleship':battleship_1});
});

// Initialize server
app.listen(port);
