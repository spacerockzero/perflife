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
