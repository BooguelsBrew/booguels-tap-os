const CACHE='booguels-tap-os-v1';
const ASSETS=['./','./index.html','./style.css','./app.js','./beers.json','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
