var express = require('express');
var ejs = require('ejs');
var path = require('path');
var port = 8080;

var app = express();

app.use(express.static('static'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  res.send('Ligne: ' + row + ' ' + 'Colonne: ' + column);
});

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(port);
