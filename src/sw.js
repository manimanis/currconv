const CACHE_NAME = 'mani-currency-converter';


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",
        "runtime.js",
        "polyfills.js",
        "styles.js",
        "vendor.js",
        "main.js",
        "favicon.png",
        "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Mono:300",
        "https://fonts.googleapis.com/icon?family=Material+Icons"
      ]);
    })
    .then(() => console.log('Data cached!'))
    .catch(error => console.error(error))
  )
});


self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});