// service-worker.js — stratégie safe
const CACHE_STATIC = 'carnetpro-static-v2';
const STATIC_ASSETS = [
  // Seulement les assets "stables" (CSS/JS/images), pas les HTML !
  '/CarnetPro/style.css',
  '/CarnetPro/app.js',
  '/CarnetPro/storage.js',
  '/CarnetPro/schema.js',
  '/CarnetPro/ui.js',
  '/CarnetPro/csv.js',
  '/CarnetPro/qr.js',
  '/CarnetPro/charts.js',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1) Pour les pages HTML → NETWORK FIRST (toujours prendre la dernière version si possible)
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req, { cache: 'no-store' });
          return fresh;
        } catch (e) {
          const cached = await caches.match(req);
          return cached || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // 2) Pour les assets statiques précachés → CACHE FIRST
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const resp = await fetch(req);
        // Optionnel : mettre en cache ce qui n’est pas HTML et est même-origin
        if (req.method === 'GET' && resp.ok && !req.headers.get('accept')?.includes('text/html')) {
          const cache = await caches.open(CACHE_STATIC);
          cache.put(req, resp.clone());
        }
        return resp;
      } catch (e) {
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});
