const CACHE_NAME = 'guide-madagascar-v1';
const urlsToCache = [
  './index.html',
  './guide-complet-madagascar-PWA.html',
  './manifest-guide.json'
];
// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Installation du Service Worker Guide...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});
// Activation
self.addEventListener('activate', event => {
  console.log('✅ Service Worker Guide activé');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
// Stratégie Network First (essaie internet d'abord, sinon cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la requête réussit, on met à jour le cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si pas de connexion, on utilise le cache
        return caches.match(event.request);
      })
  );
});
