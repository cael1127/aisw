const CACHE_NAME = 'deepseek-chat-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New message from DeepSeek',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik05NiA0OEM3My45MDg2IDQ4IDU2IDY1LjkwODYgNTYgODhWMTQ0QzU2IDE2Ni4wOTEgNzMuOTA4NiAxODQgOTYgMTg0QzExOC4wOTEgMTg0IDEzNiAxNjYuMDkxIDEzNiAxNDRWODhDMTM2IDY1LjkwODYgMTE4LjA5MSA0OCA5NiA0OFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04OCA5NkM4OCA5MS41ODE3IDkxLjU4MTcgODggOTYgODhIMTA0QzEwOC40MTggODggMTEyIDkxLjU4MTcgMTEyIDk2VjEwNEMxMTIgMTA4LjQxOCAxMDguNDE4IDExMiAxMDQgMTEySDk2QzkxLjU4MTcgMTEyIDg4IDEwOC40MTggODggMTA0Vjk2WiIgZmlsbD0iIzY2N2VlYSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyIiB5Mj0iMTkyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM2NjdlZWEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNzY0YmEyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTIiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik00OCAzNkM0Mi40NzcgMzYgMzggNDAuNDc3IDM4IDQ2VjUwQzM4IDU1LjUyMyA0Mi40NzcgNjAgNDggNjBINjBDNjUuNTIzIDYwIDcwIDU1LjUyMyA3MCA1MFY0NkM3MCA0MC40NzcgNjUuNTIzIDM2IDYwIDM2SDQ4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTU2IDQ2QzU2IDQ0Ljg5NTQgNTYuODk1NCA0NCA1OCA0NEg2NkM2Ny4xMDQ2IDQ0IDY4IDQ0Ljg5NTQgNjggNDZWNTBDNjggNTEuMTA0NiA2Ny4xMDQ2IDUyIDY2IDUySDU4QzU2Ljg5NTQgNTIgNTYgNTEuMTA0NiA1NiA1MFY0NloiIGZpbGw9IiM2NjdlZWEiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9Ijk2IiB5Mj0iOTYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzY2N2VlYSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Chat',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwxMiA5LjA5TDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IiM2NjdlZWEiLz4KPHBhdGggZD0iTTE4LjUgMTJMMTcuNDEgMTEuNzRMMTcgMTJMMTcuNDEgMTIuMjZMMTguNSAxMloiIGZpbGw9IiM2NjdlZWEiLz4KPHBhdGggZD0iTTUuNSAxMkw2LjU5IDEyLjI2TDcgMTJMNi41OSAxMS43NEw1LjUgMTJaIiBmaWxsPSIjNjY3ZWVhIi8+CjxwYXRoIGQ9Ik0xMiAxOUwxMy4wOSAxNy43NEwxMiAxN0wxMC45MSAxNy43NEwxMiAxOVoiIGZpbGw9IiM2NjdlZWEiLz4KPC9zdmc+'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4IDZMMTYgNEg4TDYgNlY4SDVWMTBIMTZWMThIMTVWMjBIMTNWMThIMTFWMjBIMTBWMThIOFYxNkg3VjE0SDZWMjBIMVYxOEg2VjE2SDVWMTRIQzUgMTIuODk1NCA1Ljg5NTQzIDEyIDcgMTJIMTVDMTYuMTA0NiAxMiAxNyAxMi44OTU0IDE3IDE0VjE2SDE2VjE4SDE3VjIwSDE4VjE4SDE5VjE2SDE4VjE0QzE4IDEyLjg5NTQgMTcuMTA0NiAxMiAxNiAxMkg4VjEwSDdWOFY2SDhWNEgxMFY2SDEyVjRIMTRWNkgxNlY0SDE4VjZaIiBmaWxsPSIjNjY3ZWVhIi8+Cjwvc3ZnPg=='
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DeepSeek Chat', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
}); 