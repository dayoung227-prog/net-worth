// 오프라인에서도 앱이 열리도록 기본 파일을 캐시합니다. 파일을 고치면 CACHE 이름의 숫자를 올려 주세요.
var CACHE = 'networth-v3';
var FILES = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// 네트워크를 먼저 쓰고, 안 되면 캐시로 엽니다 (업데이트가 바로 반영되도록).
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (res) {
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  }).catch(function () { return caches.match(e.request); }));
});
