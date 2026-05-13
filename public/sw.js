const CACHE_NAME = 'greeneat-v1'
const STATIC_ASSETS = [
  '/',
  '/products',
  '/subscription',
  '/cart',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API 요청은 항상 네트워크 우선
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(fetch(request).catch(() => new Response('offline', { status: 503 })))
    return
  }

  // 이미지: 캐시 우선, 없으면 네트워크
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return res
        }).catch(() => cached || new Response('', { status: 404 }))
      })
    )
    return
  }

  // 페이지 탐색: 네트워크 우선, 실패 시 캐시
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return res
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    )
    return
  }

  // 나머지: 캐시 우선
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  )
})
