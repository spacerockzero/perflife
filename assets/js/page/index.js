'use strict';

window.Promise = window.Promise || require('es6-promise').Promise;
require('whatwg-fetch');

var photos = require('./photos');
var photosTemplate = require('./views/photos.hbs');
var utils = require('./utils');

var photosEl = document.querySelector('.photos');
var searchTerm = 'photos'; // TODO: change functions to take more types od data
var msgEl = document.querySelector('.msg-container');
var msgContentEl = document.querySelector('.msg');
var photoIDsDisplayed = null;

// force https
if ((!location.port || location.port == "80") && location.protocol != 'https:') {
  location.protocol = 'https:';
}

// register serviceworker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
        console.log('◕‿◕ ServiceWorker registration success!', reg);
      })
      .catch(function(err) {
        console.log('ಠ_ಠ ServiceWorker registration failed: ', err);
      });
}

function updatePage(data) {
  var scrollHeight;

  if (photoIDsDisplayed) {
    scrollHeight = photosEl.scrollHeight;

    data = data.filter(function(photo) {
      if (photoIDsDisplayed.indexOf(photo.id) == -1) {
        photoIDsDisplayed.push(photo.id);
        return true;
      }
      return false;
    });

    photosEl.insertBefore(utils.strToEls(photosTemplate(data)), photosEl.firstChild);
    photosEl.scrollTop += photosEl.scrollHeight - scrollHeight;
  }
  else {
    photoIDsDisplayed = data.map(function(p) { return p.id; });
    photosEl.insertBefore(utils.strToEls(photosTemplate(data)), photosEl.firstChild);
  }
}

function getFakeData() {
  return photos.search(searchTerm).catch(function(err) {
    console.error('ERR: getFakeData', err);
    return null;
  });
}

function getCachedFakeData() {
  if ('serviceWorker' in navigator) {
    return photos.search(searchTerm, {
        headers: {'x-use-cache-only': '1'}
      })
      .catch(function(err) {
        console.error('ERR: getCachedFakeData',err);
        return null;
      });
  }
  else {
    return Promise.resolve(null);
  }
}

function showMessage(msg, duration) {
  msgContentEl.textContent = msg;
  msgEl.style.display = 'block';
  msgEl.offsetWidth; // repaint hack
  msgEl.classList.add('show');
  setTimeout(function() {
    msgEl.classList.remove('show');
  }, duration);
}

function showConnectionError() {
  showMessage('Currently offline!', 5000);
}

var liveDataFetched = getFakeData().then(function(data) {
  if (!data) { return false; }

  var alreadyRendered = !!photoIDsDisplayed;
  var oldLen = photoIDsDisplayed && photoIDsDisplayed.length;
  updatePage(data);
  if (alreadyRendered && oldLen != photoIDsDisplayed.length) {
    showMessage("▲ New photos ▲", 3000);
  }
  return true;
});

var cachedDataFetched = getCachedFakeData().then(function(data) {
  if (!data) { return false; }
  if (!photoIDsDisplayed) {
    updatePage(data);
  }
  return true;
});

liveDataFetched.then(function(fetched) {
  return fetched || cachedDataFetched;
}).then(function(dataFetched) {
  if (!dataFetched) {
    showConnectionError();
  }
  // hideSpinner();
});

// Add classes to fade-in images
document.addEventListener('load', function(event) {
  if (event.target.classList.contains('main-photo-img')) {
    event.target.parentNode.classList.add('loaded');
  }
}, true);
