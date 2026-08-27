// 최소 서비스워커: PWA 설치 조건(설치 가능 기준) 충족용
const CACHE_NAME = 'koda-golf-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// fetch 핸들러가 있어야 일부 브라우저에서 설치 가능(installable)으로 인식합니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
