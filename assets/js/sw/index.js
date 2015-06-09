'use strict';

require('serviceworker-cache-polyfill');


var version = 'v1';
var staticCacheName = 'people-static-' + version;


self.oninstall = function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        './',
        '_dist/css/all.js',
        '_dist/js/page.js',
        '_dist/img/apple-touch-icon.png',
        '_dist/img/icon.png'
      ]);
    });
  );
};


var expectedCaches = [
  staticCacheName,
  'people-imgs',
  'people-data'
];


self.onactivate = function(event) {
  if (self.clients && clients.claim) {
    clients.claim();
  }

  // remove caches beginning "people-" that aren't in expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (/^people-/.test(cacheName) && expectedCaches.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        });
      );
    });
  );
};


self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);
}
