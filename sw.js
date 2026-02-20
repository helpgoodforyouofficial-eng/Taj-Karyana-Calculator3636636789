const cacheName = 'taj-calc-v20'; 
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './ramadan.js', // Isay lazmi shamil karein warna offline nahi chalega
  './manifest.json',
  './logo.png'
];

// 1. Install Event
self.addEventListener('install', e => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
});

// 3. Fetch Event
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

// 4. Notification Click Fix: Sab se important fix yahan hai
self.addEventListener('notificationclick', e => {
  e.notification.close(); 
  
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// 5. Push Notification Fix: Icons ke path check karein
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || "Taj Calculator Alert";
  const options = {
    body: data.body || "Time is Completed Now!",
    icon: './ramadan-icon.png', // Aapka ramadan icon
    badge: './ramadan-icon.png',
    tag: 'ramadan-live-alert', // Same tag taake notifications dher na hon
    renotify: false
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

