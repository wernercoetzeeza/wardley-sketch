// Wardley Sketch service worker.
// Bump CACHE when you change any app file, otherwise returning
// visitors keep the old cached copy for an extra load.
const CACHE = 'wardley-sketch-v1.0.0';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())   // a missing asset must not block install
  );
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  if(e.request.method !== 'GET') return;

  let url;
  try{ url = new URL(e.request.url); }catch(_){ return; }

  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.includes(url.hostname);
  if(!sameOrigin && !isFont) return;   // anything else goes straight to network

  // Fonts: cache-first. They never change and this keeps the app
  // looking right with no connection.
  if(isFont){
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res=>{
        if(res && (res.ok || res.type === 'opaque')){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=> hit))
    );
    return;
  }

  // App files: stale-while-revalidate. Instant load from cache,
  // fresh copy fetched in the background for the next visit.
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if(res && res.ok){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=> cached);
      return cached || network;
    })
  );
});
