(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw/index.js":[function(require,module,exports){
/* global caches, clients*/

'use strict';

/*serviceworker polyfill*/
require('serviceworker-cache-polyfill');

var version = 'v2';
console.log('version:', version);
var staticCacheName = 'photos-static-' + version;


self.oninstall = function(event) {
  // canary-only feature
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      // install these files as dependencies
      return cache.addAll([
        './',
        './_dist/css/all.css',
        './_dist/js/page.js',
        './_dist/img/apple-touch-icon.png',
        './_dist/img/icon.png'
      ]);
    })
  );
};


var expectedCaches = [
  staticCacheName,
  'photos-imgs',
  'photos-data'
];


self.onactivate = function(event) {
  // canary-only feature
  if (self.clients && clients.claim) {
    clients.claim();
  }

  // remove caches beginning "photos-" that aren't in expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (/^photos-/.test(cacheName) && expectedCaches.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};

self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);
  // // console.log('requestURL.pathname:', requestURL.pathname)
  // // debugger;
  if (/\api\/photos/.test(requestURL.pathname)) {
    console.log('match: api data');
    event.respondWith(apiResponse(event.request));
  }
  else if (/\img\/api/.test(requestURL.pathname)) {
    console.log('match: profile img');
    event.respondWith(imgResponse(event.request));
  }
  else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
};


function apiResponse(request) {
  if (request.headers.get('x-use-cache-only')) {
    return caches.match(request);
  }
  return fetch(request).then(function(response) {
    return caches.open('photos-data').then(function(cache) {
      // clean up the image cache
      Promise.all([
        response.clone().json(),
        caches.open('photos-imgs')
      ]).then(function(results) {
        var data = results[0];
        var imgCache = results[1];

        var imgURLs = data.map(function(photo){
          return photo.thumbnailUrl;
        });

        // if an item in the cache *isn't* in imgURLs, delete it
        imgCache.keys().then(function(requests) {
          requests.forEach(function(request) {
            if (imgURLs.indexOf(request.url) == -1) {
              imgCache.delete(request);
            }
          });
        });
      });

      cache.put(request, response.clone());

      return response;
    });
  });
}

function imgResponse(request) {
  return caches.match(request).then(function(response) {
    if (response) {
      return response;
    }

    return fetch(request).then(function(response) {
      caches.open('photos-imgs').then(function(cache) {
        cache.put(request, response);
      });

      return response.clone();
    });
  });
}

},{"serviceworker-cache-polyfill":"/Users/jakob/dev/projects/sabbat/perflife/node_modules/serviceworker-cache-polyfill/index.js"}],"/Users/jakob/dev/projects/sabbat/perflife/node_modules/serviceworker-cache-polyfill/index.js":[function(require,module,exports){
if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();
      
      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

},{}]},{},["/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw/index.js"])


//# sourceMappingURL=sw.js.map