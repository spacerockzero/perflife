(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw/index.js":[function(require,module,exports){
/* global caches, clients*/

'use strict';

require('serviceworker-cache-polyfill');


var version = 'v2';
var staticCacheName = 'people-static-' + version;


self.oninstall = function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache){
      return cache.addAll([
        '../',
        './css/all.js',
        './js/page.js',
        './img/apple-touch-icon.png',
        './img/icon.png'
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
  var requestURL = new URL(event.request.url);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3cvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2VydmljZXdvcmtlci1jYWNoZS1wb2x5ZmlsbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogZ2xvYmFsIGNhY2hlcywgY2xpZW50cyovXG5cbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnc2VydmljZXdvcmtlci1jYWNoZS1wb2x5ZmlsbCcpO1xuXG5cbnZhciB2ZXJzaW9uID0gJ3YyJztcbnZhciBzdGF0aWNDYWNoZU5hbWUgPSAncGVvcGxlLXN0YXRpYy0nICsgdmVyc2lvbjtcblxuXG5zZWxmLm9uaW5zdGFsbCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIHNlbGYuc2tpcFdhaXRpbmcoKTtcblxuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLm9wZW4oc3RhdGljQ2FjaGVOYW1lKS50aGVuKGZ1bmN0aW9uKGNhY2hlKXtcbiAgICAgIHJldHVybiBjYWNoZS5hZGRBbGwoW1xuICAgICAgICAnLi4vJyxcbiAgICAgICAgJy4vY3NzL2FsbC5qcycsXG4gICAgICAgICcuL2pzL3BhZ2UuanMnLFxuICAgICAgICAnLi9pbWcvYXBwbGUtdG91Y2gtaWNvbi5wbmcnLFxuICAgICAgICAnLi9pbWcvaWNvbi5wbmcnXG4gICAgICBdKTtcbiAgICB9KVxuICApO1xufTtcblxuXG52YXIgZXhwZWN0ZWRDYWNoZXMgPSBbXG4gIHN0YXRpY0NhY2hlTmFtZSxcbiAgJ3Blb3BsZS1pbWdzJyxcbiAgJ3Blb3BsZS1kYXRhJ1xuXTtcblxuXG5zZWxmLm9uYWN0aXZhdGUgPSBmdW5jdGlvbihldmVudCkge1xuICBpZiAoc2VsZi5jbGllbnRzICYmIGNsaWVudHMuY2xhaW0pIHtcbiAgICBjbGllbnRzLmNsYWltKCk7XG4gIH1cblxuICAvLyByZW1vdmUgY2FjaGVzIGJlZ2lubmluZyBcInBlb3BsZS1cIiB0aGF0IGFyZW4ndCBpbiBleHBlY3RlZENhY2hlc1xuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLmtleXMoKS50aGVuKGZ1bmN0aW9uKGNhY2hlTmFtZXMpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgY2FjaGVOYW1lcy5tYXAoZnVuY3Rpb24oY2FjaGVOYW1lKSB7XG4gICAgICAgICAgaWYgKC9ecGVvcGxlLS8udGVzdChjYWNoZU5hbWUpICYmIGV4cGVjdGVkQ2FjaGVzLmluZGV4T2YoY2FjaGVOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KVxuICApO1xufTtcblxuXG5zZWxmLm9uZmV0Y2ggPSBmdW5jdGlvbihldmVudCkge1xuICB2YXIgcmVxdWVzdFVSTCA9IG5ldyBVUkwoZXZlbnQucmVxdWVzdC51cmwpO1xufVxuIiwiaWYgKCFDYWNoZS5wcm90b3R5cGUuYWRkKSB7XG4gIENhY2hlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQocmVxdWVzdCkge1xuICAgIHJldHVybiB0aGlzLmFkZEFsbChbcmVxdWVzdF0pO1xuICB9O1xufVxuXG5pZiAoIUNhY2hlLnByb3RvdHlwZS5hZGRBbGwpIHtcbiAgQ2FjaGUucHJvdG90eXBlLmFkZEFsbCA9IGZ1bmN0aW9uIGFkZEFsbChyZXF1ZXN0cykge1xuICAgIHZhciBjYWNoZSA9IHRoaXM7XG5cbiAgICAvLyBTaW5jZSBET01FeGNlcHRpb25zIGFyZSBub3QgY29uc3RydWN0YWJsZTpcbiAgICBmdW5jdGlvbiBOZXR3b3JrRXJyb3IobWVzc2FnZSkge1xuICAgICAgdGhpcy5uYW1lID0gJ05ldHdvcmtFcnJvcic7XG4gICAgICB0aGlzLmNvZGUgPSAxOTtcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIE5ldHdvcmtFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMSkgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgXG4gICAgICAvLyBTaW11bGF0ZSBzZXF1ZW5jZTwoUmVxdWVzdCBvciBVU1ZTdHJpbmcpPiBiaW5kaW5nOlxuICAgICAgdmFyIHNlcXVlbmNlID0gW107XG5cbiAgICAgIHJlcXVlc3RzID0gcmVxdWVzdHMubWFwKGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICAgICAgaWYgKHJlcXVlc3QgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhyZXF1ZXN0KTsgLy8gbWF5IHRocm93IFR5cGVFcnJvclxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICByZXF1ZXN0cy5tYXAoZnVuY3Rpb24ocmVxdWVzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcXVlc3QgPSBuZXcgUmVxdWVzdChyZXF1ZXN0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgc2NoZW1lID0gbmV3IFVSTChyZXF1ZXN0LnVybCkucHJvdG9jb2w7XG5cbiAgICAgICAgICBpZiAoc2NoZW1lICE9PSAnaHR0cDonICYmIHNjaGVtZSAhPT0gJ2h0dHBzOicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBOZXR3b3JrRXJyb3IoXCJJbnZhbGlkIHNjaGVtZVwiKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdC5jbG9uZSgpKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZXMpIHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIHRoYXQgcmVxdWVzdHMgZG9uJ3Qgb3ZlcndyaXRlIG9uZSBhbm90aGVyXG4gICAgICAvLyAoZG9uJ3QgdGhpbmsgdGhpcyBpcyBwb3NzaWJsZSB0byBwb2x5ZmlsbCBkdWUgdG8gb3BhcXVlIHJlc3BvbnNlcylcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgcmVzcG9uc2VzLm1hcChmdW5jdGlvbihyZXNwb25zZSwgaSkge1xuICAgICAgICAgIHJldHVybiBjYWNoZS5wdXQocmVxdWVzdHNbaV0sIHJlc3BvbnNlKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gIH07XG59XG4iXX0=
