const cacheName = 'taj-calc-v34';
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

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      console.log('Taj-System: Force Syncing Assets...');
      // Har file ko manually fetch karke store karna taake size pura save ho
      const stack = assets.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'reload' }); // Force fresh download
          if (response.ok) return await cache.put(url, response);
        } catch (err) {
          console.error('Failed to cache:', url);
        }
      });
      return Promise.all(stack);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== cacheName).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(networkRes => {
        if(networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(cacheName).then(cache => cache.put(e.request, clone));
        }
        return networkRes;
      });
    }).catch(() => caches.match('./index.html'))
  );
});

