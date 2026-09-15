/* CellarMentor service worker — netwerk eerst voor de app zelf (updates), cache als offline-vangnet.
   Verhoog het versienummer bij elke wijziging aan de app. */
const CACHE = 'cellarmentor-v77';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './fonts/cormorantsc-600-latin-ext.woff2', './fonts/cormorantsc-600-latin.woff2', './fonts/playfair-500-latin-ext.woff2', './fonts/playfair-500-latin.woff2', './fonts/playfair-500i-latin-ext.woff2', './fonts/playfair-500i-latin.woff2', './fonts/playfair-600-latin-ext.woff2', './fonts/playfair-600-latin.woff2', './fonts/playfair-600i-latin-ext.woff2', './fonts/playfair-600i-latin.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // API-verkeer (Anthropic) nooit onderscheppen
  if (e.request.mode === 'navigate' || u.pathname.endsWith('/index.html')) {
    /* no-cache: GitHub Pages zet max-age=600, anders komt een nieuwe versie tot tien minuten later.
       Alleen een geslaagd antwoord bewaren, nooit een foutpagina als offline-vangnet. */
    e.respondWith(fetch(e.request, {cache:'no-cache'}).then(r => {
      if(r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); }
      return r;
    }).catch(() => caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => {
      if(r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return r;
    })));
  }
});
