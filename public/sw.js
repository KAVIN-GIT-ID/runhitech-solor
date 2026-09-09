// Run Hi Tech Solar - Service Worker for PWA & Instant Lead Push Notifications
const CACHE_NAME = 'runhitech-solar-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/logo-icon.png',
  '/favicon.png',
  '/manifest.webmanifest'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Non-critical cache assets failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event with Network-first strategy for dynamic pages
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  // Bypass caching for live backend API requests and browser extension schemas
  if (url.pathname.startsWith('/api/') || url.protocol === 'chrome-extension:') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache clone if valid response
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// ─────────────────────────────────────────────────────────────
// PUSH & LOCAL NOTIFICATION HANDLER FOR ADMIN LEAD ALERTS
// ─────────────────────────────────────────────────────────────

// Listen for messages from client frontend to trigger local push notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_LEAD_NOTIFICATION') {
    const { title, body, data } = event.data;
    const options = {
      body: body || 'New customer requested a site survey on Run Hi Tech Solar.',
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      image: '/hero-house.jpg',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'lead-notification-' + Date.now(),
      renotify: true,
      requireInteraction: true,
      data: data || { url: '/' },
      actions: [
        { action: 'call', title: '📞 Call Lead' },
        { action: 'view', title: '👁️ Open App' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title || '☀️ New Solar Lead Received!', options)
    );
  }
});

// Push Event from Web Push server (if configured with VAPID/Firebase)
self.addEventListener('push', (event) => {
  let payload = { title: '☀️ Run Hi Tech Solar Alert', body: 'New customer lead received.' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/logo-icon.png',
    badge: '/logo-icon.png',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data: payload.data || { url: '/' },
    actions: [
      { action: 'call', title: '📞 Call Customer' },
      { action: 'view', title: '👁️ View Survey' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || '☀️ New Solar Lead!', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const leadPhone = data.phone;

  if (event.action === 'call' && leadPhone) {
    event.waitUntil(
      self.clients.openWindow(`tel:${leadPhone}`)
    );
    return;
  }

  // Open or focus application window
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(data.url || '/');
      }
    })
  );
});
