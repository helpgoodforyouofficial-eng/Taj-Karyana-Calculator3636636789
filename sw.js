const cacheName = 'taj-calc-v21'; // Version update kar diya
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ramadan.js',
  './manifest.json',
  './logo.png'
];

// 1. Install Event
self.addEventListener('install', e => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Taj-System: Files Cached Successfully');
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event (Purana cache saaf karne ke liye)
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

// 3. Fetch Event (Sahi logic: Pehle Cache check karo)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Agar cache mein file hai to wahi se do (Fastest)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Agar cache mein nahi hai, tab network se mangwao
      return fetch(e.request);
    }).catch(() => {
      // Agar dono fail ho jayen (Offline & Not in cache), to index return karo
      if (e.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});

// 4. Notification Click (Same as your code)
self.addEventListener('notificationclick', e => {
  e.notification.close(); 
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// 5. Push Notification (Same as your code)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const options = {
    body: data.body || "Time is Completed Now!",
    icon: './logo.png', // Logo path check karein
    badge: './logo.png',
    tag: 'ramadan-live-alert'
  };
  e.waitUntil(self.registration.showNotification(data.title || "Taj Alert", options));
});
