
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('carnetpro-v2').then(cache=>cache.addAll([
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
self.addEventListener('fetch',(e)=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
