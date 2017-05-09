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

/* Game route */
app.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  res.send('Ligne: ' + row + ' ' + 'Colonne: ' + column);
});

// include battleship.js
var battleship = require('./battleship');

// Main route
app.get('/', function (req, res) {
  res.render('index', {'battleship':battleship});
});

// Initialize server
app.listen(port);
