const CACHE_NAME = 'smartkisan-v1';
const OFFLINE_URLS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ── Only handle http/https — skip chrome-extension, data:, blob: etc.
  if (!request.url.startsWith('http')) return;

  // ── Skip Vite dev server internal requests (HMR, module graph, etc.)
  if (request.url.includes('/@vite') ||
      request.url.includes('/@fs') ||
      request.url.includes('/node_modules/.vite') ||
      request.url.includes('__vite') ||
      request.url.includes('localhost:5173')) return;

  // ── Skip non-GET requests (POST/PUT/DELETE should never be cached)
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache valid same-origin or CORS responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            try { cache.put(request, clone); } catch (_) { /* skip uncacheable */ }
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
