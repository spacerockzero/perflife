'use strict';

window.Promise = window.Promise || require('es6-promise').Promise;
require('whatwg-fetch');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/_dist/sw.js');

  // Warm up the cache on that very first use
  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', function changeListener() {
      // We only care about this once.
      navigator.serviceWorker.removeEventListener('controllerchange', changeListener);
    });
  }
}
