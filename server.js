/* Require Dependencies */
var express = require('express');
var handlebars = require('express-handlebars');
var path = require('path');

/* Define Port 8080 by default */
var port = 8080;

/* Initialize express for easy server-client relationship */
var app = express();

/* set view engine as handlebars */
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars());

/* Game route */
app.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  res.send('Ligne: ' + row + ' ' + 'Colonne: ' + column);
});

/* Main route */
app.get('/', function (req, res) {
  res.render('index');
});

/* Initialize server */
app.listen(port);
 