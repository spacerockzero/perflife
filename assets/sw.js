(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw/index.js":[function(require,module,exports){
/* global caches, clients*/

'use strict';

/*serviceworker polyfill*/
require('serviceworker-cache-polyfill');

var version = 'v10';
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
  // var requestURL = new URL(event.request.url);
  //
  // if (requestURL.hostname === 'jsonplaceholder.typicode.com') {
  //   event.respondWith(placeholdAPIResponse(event.request));
  // }
  // else if (requestURL.hostname === 'placehold.it') {
  //   event.respondWith(placeholdImageResponse(event.request));
  // }
  // else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  // }
};


function placeholdAPIResponse(request) {
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

function placeholdImageResponse(request) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3cvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2VydmljZXdvcmtlci1jYWNoZS1wb2x5ZmlsbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgY2FjaGVzLCBjbGllbnRzKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKnNlcnZpY2V3b3JrZXIgcG9seWZpbGwqL1xucmVxdWlyZSgnc2VydmljZXdvcmtlci1jYWNoZS1wb2x5ZmlsbCcpO1xuXG52YXIgdmVyc2lvbiA9ICd2MTAnO1xuY29uc29sZS5sb2coJ3ZlcnNpb246JywgdmVyc2lvbik7XG52YXIgc3RhdGljQ2FjaGVOYW1lID0gJ3Bob3Rvcy1zdGF0aWMtJyArIHZlcnNpb247XG5cblxuc2VsZi5vbmluc3RhbGwgPSBmdW5jdGlvbihldmVudCkge1xuICAvLyBjYW5hcnktb25seSBmZWF0dXJlXG4gIHNlbGYuc2tpcFdhaXRpbmcoKTtcblxuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLm9wZW4oc3RhdGljQ2FjaGVOYW1lKS50aGVuKGZ1bmN0aW9uKGNhY2hlKXtcbiAgICAgIC8vIGluc3RhbGwgdGhlc2UgZmlsZXMgYXMgZGVwZW5kZW5jaWVzXG4gICAgICByZXR1cm4gY2FjaGUuYWRkQWxsKFtcbiAgICAgICAgJy4vJyxcbiAgICAgICAgJy4vX2Rpc3QvY3NzL2FsbC5jc3MnLFxuICAgICAgICAnLi9fZGlzdC9qcy9wYWdlLmpzJyxcbiAgICAgICAgJy4vX2Rpc3QvaW1nL2FwcGxlLXRvdWNoLWljb24ucG5nJyxcbiAgICAgICAgJy4vX2Rpc3QvaW1nL2ljb24ucG5nJ1xuICAgICAgXSk7XG4gICAgfSlcbiAgKTtcbn07XG5cblxudmFyIGV4cGVjdGVkQ2FjaGVzID0gW1xuICBzdGF0aWNDYWNoZU5hbWUsXG4gICdwaG90b3MtaW1ncycsXG4gICdwaG90b3MtZGF0YSdcbl07XG5cblxuc2VsZi5vbmFjdGl2YXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgLy8gY2FuYXJ5LW9ubHkgZmVhdHVyZVxuICBpZiAoc2VsZi5jbGllbnRzICYmIGNsaWVudHMuY2xhaW0pIHtcbiAgICBjbGllbnRzLmNsYWltKCk7XG4gIH1cblxuICAvLyByZW1vdmUgY2FjaGVzIGJlZ2lubmluZyBcInBob3Rvcy1cIiB0aGF0IGFyZW4ndCBpbiBleHBlY3RlZENhY2hlc1xuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKGZ1bmN0aW9uKGNhY2hlTmFtZXMpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgY2FjaGVOYW1lcy5tYXAoZnVuY3Rpb24oY2FjaGVOYW1lKSB7XG4gICAgICAgICAgaWYgKC9ecGhvdG9zLS8udGVzdChjYWNoZU5hbWUpICYmIGV4cGVjdGVkQ2FjaGVzLmluZGV4T2YoY2FjaGVOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KVxuICApO1xufTtcblxuXG5zZWxmLm9uZmV0Y2ggPSBmdW5jdGlvbihldmVudCkge1xuICAvLyB2YXIgcmVxdWVzdFVSTCA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xuICAvL1xuICAvLyBpZiAocmVxdWVzdFVSTC5ob3N0bmFtZSA9PT0gJ2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb20nKSB7XG4gIC8vICAgZXZlbnQucmVzcG9uZFdpdGgocGxhY2Vob2xkQVBJUmVzcG9uc2UoZXZlbnQucmVxdWVzdCkpO1xuICAvLyB9XG4gIC8vIGVsc2UgaWYgKHJlcXVlc3RVUkwuaG9zdG5hbWUgPT09ICdwbGFjZWhvbGQuaXQnKSB7XG4gIC8vICAgZXZlbnQucmVzcG9uZFdpdGgocGxhY2Vob2xkSW1hZ2VSZXNwb25zZShldmVudC5yZXF1ZXN0KSk7XG4gIC8vIH1cbiAgLy8gZWxzZSB7XG4gICAgZXZlbnQucmVzcG9uZFdpdGgoXG4gICAgICBjYWNoZXMubWF0Y2goZXZlbnQucmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgZmV0Y2goZXZlbnQucmVxdWVzdCk7XG4gICAgICB9KVxuICAgICk7XG4gIC8vIH1cbn07XG5cblxuZnVuY3Rpb24gcGxhY2Vob2xkQVBJUmVzcG9uc2UocmVxdWVzdCkge1xuICBpZiAocmVxdWVzdC5oZWFkZXJzLmdldCgneC11c2UtY2FjaGUtb25seScpKSB7XG4gICAgcmV0dXJuIGNhY2hlcy5tYXRjaChyZXF1ZXN0KTtcbiAgfVxuICByZXR1cm4gZmV0Y2gocmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIHJldHVybiBjYWNoZXMub3BlbigncGhvdG9zLWRhdGEnKS50aGVuKGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAvLyBjbGVhbiB1cCB0aGUgaW1hZ2UgY2FjaGVcbiAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgcmVzcG9uc2UuY2xvbmUoKS5qc29uKCksXG4gICAgICAgIGNhY2hlcy5vcGVuKCdwaG90b3MtaW1ncycpXG4gICAgICBdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSByZXN1bHRzWzBdO1xuICAgICAgICB2YXIgaW1nQ2FjaGUgPSByZXN1bHRzWzFdO1xuXG4gICAgICAgIHZhciBpbWdVUkxzID0gZGF0YS5tYXAoZnVuY3Rpb24ocGhvdG8pe1xuICAgICAgICAgIHJldHVybiBwaG90by50aHVtYm5haWxVcmw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIGFuIGl0ZW0gaW4gdGhlIGNhY2hlICppc24ndCogaW4gaW1nVVJMcywgZGVsZXRlIGl0XG4gICAgICAgIGltZ0NhY2hlLmtleXMoKS50aGVuKGZ1bmN0aW9uKHJlcXVlc3RzKSB7XG4gICAgICAgICAgcmVxdWVzdHMuZm9yRWFjaChmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgICAgICBpZiAoaW1nVVJMcy5pbmRleE9mKHJlcXVlc3QudXJsKSA9PSAtMSkge1xuICAgICAgICAgICAgICBpbWdDYWNoZS5kZWxldGUocmVxdWVzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNhY2hlLnB1dChyZXF1ZXN0LCByZXNwb25zZS5jbG9uZSgpKTtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGxhY2Vob2xkSW1hZ2VSZXNwb25zZShyZXF1ZXN0KSB7XG4gIHJldHVybiBjYWNoZXMubWF0Y2gocmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuICAgIHJldHVybiBmZXRjaChyZXF1ZXN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBjYWNoZXMub3BlbigncGhvdG9zLWltZ3MnKS50aGVuKGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAgIGNhY2hlLnB1dChyZXF1ZXN0LCByZXNwb25zZSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiaWYgKCFDYWNoZS5wcm90b3R5cGUuYWRkKSB7XG4gIENhY2hlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLmFkZEFsbChbcmVxdWVzdF0pO1xuICB9O1xufVxuXG5pZiAoIUNhY2hlLnByb3RvdHlwZS5hZGRBbGwpIHtcbiAgQ2FjaGUucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uIGFkZEFsbChyZXF1ZXN0cykge1xuICAgIHZhciBjYWNoZSA9IHRoaXM7XG5cbiAgICAvLyBTaW5jZSBET01FeGNlcHRpb25zIGFyZSBub3QgY29uc3RydWN0YWJsZTpcbiAgICBmdW5jdGlvbiBOZXR3b3JrRXJyb3IobWVzc2FnZSkge1xuICAgICAgdGhpcy5uYW1lID0gJ05ldHdvcmtFcnJvcic7XG4gICAgICB0aGlzLmNvZGUgPSAxOTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIE5ldHdvcmtFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgXG4gICAgICAvLyBTaW11bGF0ZSBzZXF1ZW5jZTwoUmVxdWVzdCBvciBVU1ZTdHJpbmcpPiBiaW5kaW5nOlxuICAgICAgdmFyIHNlcXVlbmNlID0gW107XG5cbiAgICAgIHJlcXVlc3RzID0gcmVxdWVzdHMubWFwKGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhyZXF1ZXN0KTsgLy8gbWF5IHRocm93IFR5cGVFcnJvclxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICByZXF1ZXN0cy5tYXAoZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2NoZW1lID0gbmV3IFVSTChyZXF1ZXN0LnVybCkucHJvdG9jb2w7XG5cbiAgICAgICAgICBpZiAoc2NoZW1lICE9PSAnaHR0cDonICYmIHNjaGVtZSAhPT0gJ2h0dHBzOicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoXCJJbnZhbGlkIHNjaGVtZVwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdC5jbG9uZSgpKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZXMpIHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIHRoYXQgcmVxdWVzdHMgZG9uJ3Qgb3ZlcndyaXRlIG9uZSBhbm90aGVyXG4gICAgICAvLyAoZG9uJ3QgdGhpbmsgdGhpcyBpcyBwb3NzaWJsZSB0byBwb2x5ZmlsbCBkdWUgdG8gb3BhcXVlIHJlc3BvbnNlcylcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgcmVzcG9uc2VzLm1hcChmdW5jdGlvbihyZXNwb25zZSwgaSkge1xuICAgICAgICAgIHJldHVybiBjYWNoZS5wdXQocmVxdWVzdHNbaV0sIHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH07XG59XG4iXX0=
