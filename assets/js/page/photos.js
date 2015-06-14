'use strict';

var root = '/api';

function search(text, options) {
  // get first 30 items
  return fetch(root + '/' + text, options).then(function(response) {
    // get promise object
    return response.json();
  }).then(function(response) {
    // get actual data back
    console.log('photos response', response);
    if (!response.length) {
      throw Error(response.err.msg);
    }
    return response;
  });

}


module.exports.search = search;
