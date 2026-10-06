const CACHE_NAME = 'koda-golf-20261006-install-v4';
const APP_SHELL = ['./','./index.html','./manifest.json','./koda-logo-re.png','./koda-arp-splash-2026.jpg','./koda-icon-192-reference.png','./koda-icon-512-reference.png','./koda-apple-touch-reference.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 구글시트 등 외부 요청은 서비스워커가 건드리지 않음 (캐시 누적 / 오프라인 시 엉뚱한 응답 방지)
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      }
      return response;
    }).catch(() =>
      caches.match(req).then(cached => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    )
  );
});
