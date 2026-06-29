const CACHE = 'booguels-tap-os-v7';
const ASSETS = [
  './',
  './index.html',
  './style.css?v=7',
  './app.js?v=7',
  './master-v7.png?v=7',
  './manifest.webmanifest',
  './beers.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
