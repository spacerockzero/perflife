(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw2/index.js":[function(require,module,exports){
/*global importScripts, toolbox*/

importScripts('_dist/js/sw-toolbox.js');

var version = 'v3';

console.log('sw2, version:', version);

console.log('toolbox', toolbox);

// try out toolbox
// You can provide a list of resources which will be cached at service worker install time
toolbox.precache([
  './toolbox',
  './_dist/css/all.css',
  './_dist/js/page.js',
  './_dist/img/apple-touch-icon.png',
  './_dist/img/icon.png'
]);

// For some common cases Service Worker Toolbox provides a built-in handler
// toolbox.router.get('/', toolbox.networkFirst);
toolbox.router.get('/_dist/*', toolbox.cacheFirst);

},{}]},{},["/Users/jakob/dev/projects/sabbat/perflife/assets/js/sw2/index.js"])


//# sourceMappingURL=sw2.js.map