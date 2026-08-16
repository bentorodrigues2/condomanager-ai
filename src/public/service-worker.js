
self.addEventListener('install', () => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('cm-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        );
      });
    })
  );
});
