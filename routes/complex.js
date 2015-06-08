'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/complex', function(req, res) {
  res.render('complex',
    {
      title: 'Complex',
      data: []
    }
  );
});

module.exports = router;
