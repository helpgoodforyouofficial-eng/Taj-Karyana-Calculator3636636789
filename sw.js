const cacheName = 'taj-calc-v26'; // Version updated for fresh sync
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ramadan-calender.js',
  './manifest.json',
  './logo.png',   // Logo download list mein shamil
  './icon.png'    // Icon download list mein shamil
];

// 1. Install Event: Sab kuch download karlo
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Taj-System: Caching Images & Files...');
      return Promise.all(
        assets.map(url => {
          return fetch(url).then(response => {
            if (!response.ok) throw new Error('File not found: ' + url);
            return cache.put(url, response);
          }).catch(err => console.log('Offline Alert: ', err.message));
        })
      );
    })
  );
});

// 2. Activate: Purana cache clear
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

// 3. Fetch: Instant Offline Access
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Agar cache mein file mil gayi (logo/icon/html), to internet ki zarurat nahi
      if (cachedResponse) return cachedResponse;

      return fetch(e.request).then(networkResponse => {
        if(networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(cacheName).then(cache => cache.put(e.request, responseClone));
        }
        return networkResponse;
      });
    }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
    })
  );
});
