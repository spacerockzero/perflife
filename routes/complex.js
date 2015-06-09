'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var file = path.join(process.cwd(), '/data/people.json');

// for generating and stashing test data
var faker = require('faker');
var jf = require('jsonfile');
jf.spaces = 4;

/* GET complex test page. */
router.get('/', function(req, res) {
  var data = require(file);
  res.render('complex',
    {
      title: 'Complex',
      data: data
    }
  );
});


/* GET large set of data for testing */
router.get('/new', function(req, res){
  console.time('getData');
  var newData = [];
  var i = 0;
  var limit = 10000;
  while(i < limit){
    newData.push({
      name: faker.name.findName(),
      avatar: faker.image.avatar(),
      image: faker.image.image(),
      animal: faker.image.animals(),
      catchPhrase: faker.company.catchPhrase(),
      company: faker.company.companyName()
    });
    i++;
  }
  console.timeEnd('getData');
  // console.log('newData', newData); // only use this when limit < 20-ish, or you will be verrrrry sorrrrrry...
  jf.writeFile(path.resolve(file), newData, function(err){
    if(err){
      res.status(500);
      res.send(err);
    }
    else {
      res.status(200);
      res.send();
      // res.send(newData); // only use this when limit < 20-ish, or you will be verrrrry sorrrrrry...
    }
  });
});


module.exports = router;
