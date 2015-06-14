'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var peopleData = require(path.join(process.cwd(), '/data/people2.json'));
var puppyData = require(path.join(process.cwd(), '/data/puppies.json'));
var sealData = require(path.join(process.cwd(), '/data/seals.json'));
var slothData = require(path.join(process.cwd(), '/data/sloths.json'));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('toolbox/index', { title: 'people', data: peopleData });
});
router.get('/puppies', function(req, res) {
  res.render('toolbox/puppies', { title: 'puppies', data: puppyData });
});
router.get('/seals', function(req, res) {
  res.render('toolbox/seals', { title: 'seals', data: sealData });
});
router.get('/sloths', function(req, res) {
  res.render('toolbox/sloths', { title: 'sloths', data: slothData });
});

router.get('/:page', function(req, res){
  res.render( 'toolbox/' + req.params.page, {req: req} );
});

module.exports = router;
