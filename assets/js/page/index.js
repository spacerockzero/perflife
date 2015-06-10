'use strict';

window.Promise = window.Promise || require('es6-promise').Promise;
require('whatwg-fetch');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
        console.log('◕‿◕ ServiceWorker registration success!', reg);
      })
      .catch(function(err) {
        console.log('ಠ_ಠ ServiceWorker registration failed: ', err);
      });

  // Warm up the cache on that very first use
  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', function changeListener() {
      // We only care about this once.
      navigator.serviceWorker.removeEventListener('controllerchange', changeListener);
    });
  }
}
