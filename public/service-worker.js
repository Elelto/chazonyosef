const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/hero-bg.jpeg',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  static: [
    /\.js$/,
    /\.css$/,
    /\.woff2?$/,
    /\.ttf$/,
    /\.eot$/,
    /\.svg$/
  ],
  networkFirst: [
    /\/api\//,
    /firestore\.googleapis\.com/,
    /firebasestorage\.googleapis\.com/,
    /identitytoolkit\.googleapis\.com/,
    /securetoken\.googleapis\.com/
  ],
  cacheFirst: [
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.gif$/,
    /\.webp$/,
    /\.ico$/
  ]
};

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      // Don't auto-skip waiting - let user decide when to update
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith('static-') || 
                     cacheName.startsWith('dynamic-') || 
                     cacheName.startsWith('images-');
            })
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map(cacheName => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

function shouldCache(url) {
  const urlObj = new URL(url);
  
  if (urlObj.origin !== location.origin && 
      !url.includes('googleapis.com') && 
      !url.includes('gstatic.com') &&
      !url.includes('firebaseapp.com')) {
    return false;
  }
  
  if (url.includes('netlify-identity')) {
    return false;
  }
  
  return true;
}

function getCacheStrategy(url) {
  for (const pattern of CACHE_STRATEGIES.static) {
    if (pattern.test(url)) return 'cacheFirst';
  }
  
  for (const pattern of CACHE_STRATEGIES.networkFirst) {
    if (pattern.test(url)) return 'networkFirst';
  }
  
  for (const pattern of CACHE_STRATEGIES.cacheFirst) {
    if (pattern.test(url)) return 'cacheFirst';
  }
  
  return 'networkFirst';
}

async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Fetch failed for:', request.url);
    throw error;
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache for:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (request.destination === 'document') {
      const offlinePage = await caches.match('/index.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  if (request.method !== 'GET') {
    return;
  }
  
  if (url.includes('chrome-extension://')) {
    return;
  }
  
  const strategy = getCacheStrategy(url);
  
  let cacheName = DYNAMIC_CACHE;
  if (CACHE_STRATEGIES.cacheFirst.some(pattern => pattern.test(url))) {
    cacheName = IMAGE_CACHE;
  }
  
  if (strategy === 'cacheFirst') {
    event.respondWith(cacheFirstStrategy(request, cacheName));
  } else if (strategy === 'networkFirst') {
    event.respondWith(networkFirstStrategy(request, cacheName));
  } else {
    event.respondWith(staleWhileRevalidate(request, cacheName));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'CACHE_CLEARED' });
        });
      })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[Service Worker] Syncing data...');
}

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'עדכון חדש מחזון יוסף',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    dir: 'rtl',
    lang: 'he'
  };
  
  event.waitUntil(
    self.registration.showNotification('חזון יוסף', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
  );
});

console.log('[Service Worker] Loaded successfully');
