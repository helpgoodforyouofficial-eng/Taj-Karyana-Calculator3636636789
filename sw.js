// sw.js file ka code

const cacheName = 'taj-calc-v36';
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

// Install Event
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      console.log('Taj-System: Caching Core Assets...');
      const stack = assets.map(async (url) => {
        try {
          const response = await fetch(url, { cache: 'reload' });
          if (response.ok) return await cache.put(url, response);
        } catch (err) {
          console.error('Failed to cache:', url);
        }
      });
      return Promise.all(stack);
    })
  );
});

// Activate Event
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== cacheName).map(key => caches.delete(key))
    ))
  );
  return self.clients.claim();
});

// Fetch Event (Offline Logic)
self.addEventListener('fetch', e => {
  const req = e.request;
  
  // API calls ko bypass karo taake offline data localStorage se aaye
  if (req.url.includes('api.aladhan.com') || req.url.includes('nominatim.openstreetmap.org')) {
     e.respondWith(fetch(req).catch(() => new Response(JSON.stringify({ code: 400, data: [] }), { headers: { 'Content-Type': 'application/json' } })));
     return;
  }

  // Files ko cache se load karo
  e.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).then(networkRes => {
        if(networkRes && networkRes.status === 200) {
          const clone = networkRes.clone();
          caches.open(cacheName).then(cache => cache.put(req, clone));
        }
        return networkRes;
      });
    }).catch(() => {
      // Agar offline ho to index.html load karo
      if (req.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
