const CACHE = 'booguels-v6-master-overlay';
const ASSETS = [
  './',
  './index.html',
  './style.css?v=6',
  './app.js?v=6',
  './master.jpg?v=6',
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
