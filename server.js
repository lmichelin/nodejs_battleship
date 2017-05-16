/* Require Dependencies */
var express = require('express');
/* Initialize express for easy server-client relationship */
var app = express();
var session = require('express-session');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var server  = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require("express-session")({
  secret: "ZEHIU5348TQG8VT4VUJEZYSY483YA",
  cookie: {httpOnly: true, secure: true},
  resave: true,
  saveUninitialized: true
});
var sharedsession = require("express-socket.io-session");

// Use express-session middleware for express
app.use(session);

// Use shared session middleware for socket.io
// setting autoSave:true
io.use(sharedsession(session, {
    autoSave:true
}));

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
  var sess = req.session;
  res.render('index', {'battleship':battleship_1});
});



io.sockets.on('connection', function (socket) {
  socket.on("login", function(pseudo, callback) {
    socket.handshake.session.test = "test";
    socket.handshake.session.pseudo = pseudo;
    // socket.handshake.session.save();
    console.log(session);
  });
  console.log('Un client est connecté !');
  socket.emit('message', 'Tu es biezn connecté');
  socket.broadcast.emit('message', 'un autre se connecte !');
  // Quand le serveur reçoit un signal de type "message" du client
  socket.on('message', function (message) {
    console.log(socket.handshake.session.pseudo + ' me parle ! Il me dit : ' + message);
  });
});



// Initialize server
server.listen(port);
