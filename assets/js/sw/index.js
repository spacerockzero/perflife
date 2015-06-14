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
