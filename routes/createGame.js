/************************************* Require dependencies **********************************************/

var express = require('express');
var io = require('../server.js');
var router = express.Router(); //Create router object

/************************************* createGame routes *********************************************************/

router.get('/', function(req, res) {
	res.render('createGame');
});

module.exports = router;