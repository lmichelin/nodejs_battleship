/****************************   Require Dependencies ************************************/

var express = require('express'); // Express to handle client requests and server responses
var ejs = require('ejs'); // ejs for writing and generating templates
var bodyParser = require('body-parser'); // BodyParser for easy client-server communication
var path = require('path'); // Path module for directory naviguation
var http = require('http'); // http needed for socket.io
var socket = require('socket.io'); // Socket.io is needed for synchronous communication between client and server
var sharedsession = require("express-socket.io-session"); // Shared session for socket.io
var session = require("express-session")({
  secret: "ZEHIU5348TQG8VT4VUJEZYSY483YA",
  resave: true,
  saveUninitialized: true
}); // Session that follows client IMPORTANT do not set secure to true


/********************* Initialize express, session, bodyparser and template engine *********************/

var app = express();

var server = http.createServer(app); // create server to listen to

app.use(session); // Use express-session middleware for express

var port = 8080; // Define Port 8080 by default 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('static'));
app.set('views', path.join(__dirname,'views')); //All ejs files are in the views folder
app.set('view engine', 'ejs'); // Use ejs as default template engine


/************************************************* Socket.io *************************************************/

var io = socket(server);

// Use shared session middleware for socket.io
io.use(sharedsession(session, {
    autoSave:true  // setting autoSave:true
}));

//Export the io module to use it in other js files
module.exports = io;

/*************************************** include routes *****************************************************/

var initialization = require('./routes/initialization');
app.use('/initialization', initialization);
var createGame = require('./routes/createGame');
app.use('/createGame', createGame);
var game = require('./routes/game');
app.use('/game', game);
var test = require('./routes/test');
app.use('/test', test);

// Main route
app.get('/', function (req, res) {
  res.render('welcome');
});

/**************************************** Listen server *******************************************************/
server.listen(port);
