(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw/index.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3cvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2VydmljZXdvcmtlci1jYWNoZS1wb2x5ZmlsbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBjYWNoZXMsIGNsaWVudHMqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJ3NlcnZpY2V3b3JrZXItY2FjaGUtcG9seWZpbGwnKTtcblxuXG52YXIgdmVyc2lvbiA9ICd2MTgnO1xuY29uc29sZS5sb2coJ3ZlcnNpb246JywgdmVyc2lvbik7XG52YXIgc3RhdGljQ2FjaGVOYW1lID0gJ3Blb3BsZS1zdGF0aWMtJyArIHZlcnNpb247XG5cblxuc2VsZi5vbmluc3RhbGwgPSBmdW5jdGlvbihldmVudCkge1xuICAvLyBkZWJ1Z2dlcjtcbiAgc2VsZi5za2lwV2FpdGluZygpO1xuXG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMub3BlbihzdGF0aWNDYWNoZU5hbWUpLnRoZW4oZnVuY3Rpb24oY2FjaGUpe1xuICAgICAgcmV0dXJuIGNhY2hlLmFkZEFsbChbXG4gICAgICAgIC8vICcuLycsXG4gICAgICAgICcuL19kaXN0L2Nzcy9hbGwuY3NzJyxcbiAgICAgICAgJy4vX2Rpc3QvanMvcGFnZS5qcycsXG4gICAgICAgICcuL19kaXN0L2ltZy9hcHBsZS10b3VjaC1pY29uLnBuZydcbiAgICAgICAgLy8gJy4vX2Rpc3QvaW1nL2ljb24ucG5nJ1xuICAgICAgXSk7XG4gICAgfSlcbiAgKTtcbn07XG5cblxudmFyIGV4cGVjdGVkQ2FjaGVzID0gW1xuICBzdGF0aWNDYWNoZU5hbWUsXG4gICdwZW9wbGUtaW1ncycsXG4gICdwZW9wbGUtZGF0YSdcbl07XG5cblxuc2VsZi5vbmFjdGl2YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgLy8gZGVidWdnZXI7XG4gIGlmIChzZWxmLmNsaWVudHMgJiYgY2xpZW50cy5jbGFpbSkge1xuICAgIGNsaWVudHMuY2xhaW0oKTtcbiAgfVxuXG4gIC8vIHJlbW92ZSBjYWNoZXMgYmVnaW5uaW5nIFwicGVvcGxlLVwiIHRoYXQgYXJlbid0IGluIGV4cGVjdGVkQ2FjaGVzXG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMua2V5cygpLnRoZW4oZnVuY3Rpb24oY2FjaGVOYW1lcykge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBjYWNoZU5hbWVzLm1hcChmdW5jdGlvbihjYWNoZU5hbWUpIHtcbiAgICAgICAgICBpZiAoL15wZW9wbGUtLy50ZXN0KGNhY2hlTmFtZSkgJiYgZXhwZWN0ZWRDYWNoZXMuaW5kZXhPZihjYWNoZU5hbWUpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlcy5kZWxldGUoY2FjaGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pXG4gICk7XG59O1xuXG5cbnNlbGYub25mZXRjaCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIGRlYnVnZ2VyO1xuICBldmVudC5yZXNwb25kV2l0aChcbiAgICBjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGZldGNoKGV2ZW50LnJlcXVlc3QpO1xuICAgIH0pXG4gICk7XG59O1xuIiwiaWYgKCFDYWNoZS5wcm90b3R5cGUuYWRkKSB7XG4gIENhY2hlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLmFkZEFsbChbcmVxdWVzdF0pO1xuICB9O1xufVxuXG5pZiAoIUNhY2hlLnByb3RvdHlwZS5hZGRBbGwpIHtcbiAgQ2FjaGUucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uIGFkZEFsbChyZXF1ZXN0cykge1xuICAgIHZhciBjYWNoZSA9IHRoaXM7XG5cbiAgICAvLyBTaW5jZSBET01FeGNlcHRpb25zIGFyZSBub3QgY29uc3RydWN0YWJsZTpcbiAgICBmdW5jdGlvbiBOZXR3b3JrRXJyb3IobWVzc2FnZSkge1xuICAgICAgdGhpcy5uYW1lID0gJ05ldHdvcmtFcnJvcic7XG4gICAgICB0aGlzLmNvZGUgPSAxOTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIE5ldHdvcmtFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgXG4gICAgICAvLyBTaW11bGF0ZSBzZXF1ZW5jZTwoUmVxdWVzdCBvciBVU1ZTdHJpbmcpPiBiaW5kaW5nOlxuICAgICAgdmFyIHNlcXVlbmNlID0gW107XG5cbiAgICAgIHJlcXVlc3RzID0gcmVxdWVzdHMubWFwKGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhyZXF1ZXN0KTsgLy8gbWF5IHRocm93IFR5cGVFcnJvclxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICByZXF1ZXN0cy5tYXAoZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2NoZW1lID0gbmV3IFVSTChyZXF1ZXN0LnVybCkucHJvdG9jb2w7XG5cbiAgICAgICAgICBpZiAoc2NoZW1lICE9PSAnaHR0cDonICYmIHNjaGVtZSAhPT0gJ2h0dHBzOicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoXCJJbnZhbGlkIHNjaGVtZVwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdC5jbG9uZSgpKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZXMpIHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIHRoYXQgcmVxdWVzdHMgZG9uJ3Qgb3ZlcndyaXRlIG9uZSBhbm90aGVyXG4gICAgICAvLyAoZG9uJ3QgdGhpbmsgdGhpcyBpcyBwb3NzaWJsZSB0byBwb2x5ZmlsbCBkdWUgdG8gb3BhcXVlIHJlc3BvbnNlcylcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgcmVzcG9uc2VzLm1hcChmdW5jdGlvbihyZXNwb25zZSwgaSkge1xuICAgICAgICAgIHJldHVybiBjYWNoZS5wdXQocmVxdWVzdHNbaV0sIHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH07XG59XG4iXX0=
