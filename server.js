/****************************   Require Dependencies ************************************/

var express = require('express'); // Express to handle client requests and server responses
var ejs = require('ejs'); // ejs for writing and generating templates
var bodyParser = require('body-parser'); // BodyParser for easy client-server communication
var cookieParser = require('cookie-parser');
var path = require('path'); // Path module for directory naviguation
var http = require('http'); // http needed for socket.io
var socket = require('socket.io'); // Socket.io is needed for synchronous communication between client and server
var sharedsession = require("express-socket.io-session"); // Shared session for socket.io
var session = require("express-session")({
  secret: "ZEHIU5348TQG8VT4VUJEZYSY483YA",
  resave: true,
  saveUninitialized: true
}); // Session that follows client IMPORTANT do not set secure to true
var gameServer = require('./gamejs/gameServer.js');


/********************* Initialize express, session, bodyparser and template engine *********************/

var app = express();

var server = http.createServer(app); // create server to listen to

app.use(session); // Use express-session middleware for express
app.use(cookieParser()); // Use cookie parser for easy access to cookies on response

var port = 8000; // Define Port 8080 by default 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('static'));
app.use('/node_modules', express.static(__dirname + '/node_modules')); // animate css
app.set('views', path.join(__dirname,'views')); //All ejs files are in the views folder
app.set('view engine', 'ejs'); // Use ejs as default template engine


/******************************************** Initialize gameServer ******************************************/

var gameServer = new gameServer();

/************************************************* Socket.io *************************************************/

var io = socket(server);

// Use shared session middleware for socket.io
io.use(sharedsession(session, {
    autoSave:true  // setting autoSave:true
}));

// Initialize a client server
var ClientServer = require('./gamejs/clientServer.js');
var clientServer = new ClientServer(gameServer, io);
clientServer.init();

/******************************************** Export relevant objects ***************************************/

//Export the server and io modules to use it in other js files
module.exports = {
	server: server,
	io: io,
	gameServer: gameServer,
	clientServer: clientServer,
};

/*************************************** include routes *****************************************************/

var initialization = require('./routes/initialization');
app.use('/initialization', initialization);
var join = require('./routes/join');
app.use('/join', join);
var createGame = require('./routes/createGame');
app.use('/createGame', createGame);
var game = require('./routes/game');
app.use('/game', game);
var setBoats = require('./routes/setBoats');
app.use('/setBoats', setBoats);
var solo = require('./routes/solo');
app.use('/solo', solo);
var logout = require('./routes/logout');
app.use('/logout', logout);


// Main route
app.get('/', function(req, res) {
	var correctRoute = gameServer.sendRoute(req.session.username);
	if (correctRoute == '/') {
	 	res.render('welcome');
	 }
	 else {
	 	res.redirect(correctRoute);
	 }
});


/**************************************** Listen server *******************************************************/
server.listen(port);

