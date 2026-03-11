const cacheName = 'taj-calc-v33';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ramadan-calender.js',
  './manifest.json',
  './logo.png',
  './icon.png'
];

// 1. Install Event: Har file ko independent download karein
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Taj-System: Syncing Assets...');
      // Individually add files taake aik fail ho to baaqi ho jayen
      return Promise.allSettled(
        assets.map(url => cache.add(url))
      );
    })
  );
});

// 2. Activate: Purana kachra saaf
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. Fetch: Cache-First Strategy (Best for Offline)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // 1. Agar cache mein hai to wahin se uthao
      if (cachedResponse) return cachedResponse;

      // 2. Agar nahi hai to internet se fetch karo
      return fetch(e.request).then(networkResponse => {
        if(networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(cacheName).then(cache => cache.put(e.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // 3. Agar net bhi nahi aur cache bhi nahi, to main page dikhao
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
