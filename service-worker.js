self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('carnetpro-v1').then(cache=>cache.addAll([
    '/', '/index.html', '/style.css',
    '/identite.html','/seance.html','/calendar.html','/analyses.html','/export.html','/aide.html',
    '/assets/js/app.js','/assets/js/storage.js','/assets/js/schema.js','/assets/js/ui.js','/assets/js/csv.js','/assets/js/qr.js','/assets/js/charts.js'
  ])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
