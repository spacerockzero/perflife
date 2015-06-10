/* global caches, clients*/

'use strict';

require('serviceworker-cache-polyfill');


var version = 'v18';
console.log('version:', version);
var staticCacheName = 'people-static-' + version;


self.oninstall = function(event) {
  // debugger;
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        // './',
        './_dist/css/all.css',
        './_dist/js/page.js',
        './_dist/img/apple-touch-icon.png'
        // './_dist/img/icon.png'
      ]);
    })
  );
};


var expectedCaches = [
  staticCacheName,
  'people-imgs',
  'people-data'
];


self.onactivate = function(event) {
  // debugger;
  if (self.clients && clients.claim) {
    clients.claim();
  }

  // remove caches beginning "people-" that aren't in expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (/^people-/.test(cacheName) && expectedCaches.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};


self.onfetch = function(event) {
  // debugger;
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
};
