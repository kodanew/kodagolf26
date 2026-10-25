const CACHE_NAME = 'koda-golf-20261025-install-v5';
const APP_SHELL = ['./','./index.html','./manifest.json','./koda-logo-re.png','./koda-arp-splash-2026.jpg','./koda-icon-192-reference.png','./koda-icon-512-reference.png','./koda-apple-touch-reference.png'];

self.addEventListener('install', event => {
  // 파일 하나가 없어도 서비스워커 설치가 통째로 실패하지 않도록 하나씩 담는다
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(APP_SHELL.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 구글시트 등 외부 요청은 서비스워커가 건드리지 않음
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      }
      return response;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(cached => cached || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    )
  );
});
