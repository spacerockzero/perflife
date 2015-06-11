'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var file = path.join(process.cwd(), '/data/people2.json');

/* GET complex test page. */
router.get('/photos', function(req, res) {
  var data = require(file);
  res.send(data);
});


module.exports = router;
