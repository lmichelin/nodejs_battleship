/* Require Dependencies */
var express = require('express');
/* Initialize express for easy server-client relationship */
var app = express();
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var sess = require('express-session');
var server  = require('http').createServer(app);
var io = require('socket.io')(server);

/* Define Port 8080 by default */
var port = 8080;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('static'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// include battleship.js
var battleship = require('./gamejs/battleship').battleship;
var boat = require('./gamejs/battleship').boat;

// include routes
var initialization = require('./routes/initialization').router;
app.use('/initialization', initialization);
var game = require('./routes/game');
app.use('/game', game);

//Import battleship grids
var battleship_1 = require('./routes/initialization').battleship_1;

// Main route
app.get('/', function (req, res) {
  res.render('index', {'battleship':battleship_1});
});


io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
    console.log('Client connected...');
  });

      socket.on('join', function(data) {
          console.log(data);
          socket.emit('messages', 'Hello from server');
        });
});

// Initialize server
server.listen(port);
