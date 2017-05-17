/************************************* Require dependencies **********************************************/

var express = require('express');
var io = require('../server.js');
var router = express.Router(); //Create router object

/************************************* Join routes *********************************************************/

router.get('/', function(req, res) {
	res.render('join');
});

module.exports = router;