var cacheName = 'magic-tree';
var cached_urls = [
  '/magictree/instalador/',
  '/magictree/instalador/index.html',
  '/magictree/instalador/cadastro.html',
  '/magictree/instalador/esqueci-minha-senha.html',
  '/magictree/instalador/serial.html',
  '/magictree/instalador/welcome.html',
  '/magictree/instalador/welcome-professor.html',
  '/magictree/instalador/css/style.css',
  '/magictree/instalador/css/bootstrap.css',
  //'/instalador/css/',
  //'/instalador/js/',
  '/magictree/instalador/js/scripts.js',
  //'/instalador/images/',
  //'/instalador/sounds/',
  //'/instalador/arquivos/'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(cached_urls);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});