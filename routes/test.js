//Require express and other dependencies
var express = require('express');

//Create router object
var router = express.Router();


// Main route
router.get('/', function (req, res) {
  var sess = req.session;
  console.log(sess);
  res.render('index', {'battleship':battleship_1});
});

module.exports = router;