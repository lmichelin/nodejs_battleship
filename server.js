var express = require('express');
var port = 8080;

var app = express();


app.get('/battleship', function(req, res) {
  var row = req.param('row');
  var column = req.param('column');

  res.send('Ligne: ' + row + ' ' + 'Colonne: ' + column);
});
 
app.get('/', function (req, res) {
  res.send('Hello World');
});
 
app.listen(port);