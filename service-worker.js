self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open('carnetpro-clean-v1').then(cache=>cache.addAll([
    '/CarnetPro/index.html',
    '/CarnetPro/style.css',
    '/CarnetPro/identite.html',
    '/CarnetPro/seance.html',
    '/CarnetPro/calendar.html',
    '/CarnetPro/analyses.html',
    '/CarnetPro/export.html',
    '/CarnetPro/app.js',
    '/CarnetPro/storage.js',
    '/CarnetPro/schema.js',
    '/CarnetPro/ui.js',
    '/CarnetPro/csv.js',
    '/CarnetPro/qr.js',
    '/CarnetPro/charts.js'
  ])));
});
self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
