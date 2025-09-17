var CACHENAME = "cachestore";
var FILES = [
  "/",
  "index.html",
  "css/cetictactoe.css",
  "cetictactoe.js",
  "img/logocetictactoe.png",
  "favicon/favicon-32x32.png"
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(CACHENAME).then((cache) => {
          console.log('[Servicio Worker] Almacena todo en caché: contenido e intérprete de la aplicación');
      return cache.addAll(FILES);
    })
  );
});


self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Servicio Worker] Obteniendo recurso: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(CACHENAME).then((cache) => {
          console.log('[Servicio Worker] Almacena el nuevo recurso: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
