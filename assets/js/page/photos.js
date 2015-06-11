'use strict';

var root = '/api';

function search(text) {
  // get first 30 items
  return fetch(root + '/' + text).then(function(response) {
    return response.json();
  }).then(function(response) {
    // flickr-specific json status field, change to equivalent in new api
    if (response.stat === 'fail') {
      throw Error(response.err.msg);
    }
    return response;
  });

}


module.exports.search = search;
