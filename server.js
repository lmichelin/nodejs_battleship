/* Require Dependencies */
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');

/* Define Port 8080 by default */
var port = 8080;

/* Initialize express for easy server-client relationship */
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('static'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// include battleship.js
var battleship = require('./battleship').battleship;
var boat = require('./battleship').boat;
var battleship_1 = new battleship('player_one');
var carrier = new boat('carrier', 5);
var battleship = new boat('battleship', 4);
var submarine = new boat('submarine', 3);
var cruiser = new boat('cruiser', 3);
var destroyer = new boat('destroyer', 2);

//Initialize game route
app.get('/initialize', function(req, res) {
	context = {
		'carrier': carrier,
		'battleship': battleship,
		'submarine': submarine,
		'cruiser': cruiser,
		'destroyer': destroyer
	};
	res.render('initialize', context);
});

app.post('initialize/post', function(req, res) {
});

/* Game route */
app.get('/battleship', function(req, res) {
  var row = req.param('row');
  console.log(row);
  var column = req.param('column');

  battleship_1.attack(row, column);

  res.render('index', {'battleship':battleship_1});
});

app.post('/battleship/post', function(req, res) {
	var boat = req.body.boat;
	battleship_1.setBoat(carrier);
});

// Main route
app.get('/', function (req, res) {
  res.render('index', {'battleship':battleship_1});
});

// Initialize server
app.listen(port);
