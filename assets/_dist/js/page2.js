(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/jakob/dev/projects/sabbat/perflife/assets/js/page2/index.js":[function(require,module,exports){
console.log('page2 js');

// force https
if ((!location.port || location.port == "80") && location.protocol != 'https:') {
  location.protocol = 'https:';
}

// register serviceworker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw2.js')
    .then(function(reg) {
        console.log('◕‿◕ ServiceWorker2 registration success!', reg);
      })
      .catch(function(err) {
        console.log('ಠ_ಠ ServiceWorker2 registration failed: ', err);
      });
}

},{}]},{},["/Users/jakob/dev/projects/sabbat/perflife/assets/js/page2/index.js"])


//# sourceMappingURL=page2.js.map