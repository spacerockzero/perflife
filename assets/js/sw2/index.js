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
