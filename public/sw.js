// Service Worker for Tuhfat Al-Ilm Academy PWA
// Provides offline capability, asset caching, and satisfies Chromium & Safari PWA installability criteria

const CACHE_NAME = 'tuhfat-ilm-pwa-v6';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest?v=3',
  '/manifest.json?v=3',
  '/favicon.ico?v=3',
  '/favicon-192x192.png?v=3',
  '/favicon-512x512.png?v=3',
  '/apple-touch-icon.png?v=3'
];

// Install: precache critical shell assets resiliently and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[PWA Service Worker] Precache warning for:', url, err);
          })
        )
      );
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Handle SKIP_WAITING message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate: purge older caches and immediately claim all active clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA Service Worker] Purging stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      return self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'SW_ACTIVATED', version: CACHE_NAME });
        });
      });
    })
  );
});

// Fetch: Network-first for navigation & API, Cache-first for images & static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests and browser extensions
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API calls: Network only
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Navigation requests (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            return response;
          }
          // If server returns 404 (e.g. directly opened SPA subpage before .htaccess or on static hosts),
          // fallback to index.html so the client router loads smoothly instead of blank/404!
          return caches.match('/index.html').then((cached) => {
            return cached || response;
          });
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            return cached || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets (images, scripts, styles, fonts)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate cache
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkResponse;
      }).catch((err) => {
        if (req.headers.get('accept')?.includes('image')) {
          return caches.match('/favicon-192x192.png');
        }
        return caches.match(req) || Promise.reject(err);
      });
    })
  );
});
