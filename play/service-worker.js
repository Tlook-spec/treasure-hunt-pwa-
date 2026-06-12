// ====== 寻宝游戏 Service Worker：动态缓存策略（stale-while-revalidate）======
//
// MVP 阶段不手写 FILES_TO_CACHE 列表，改用「用了就缓存」策略：
//   第一次访问（有网）→ 所有资源自动被缓存（含 CDN 库）
//   之后（包括飞行模式）→ 优先读缓存，后台更新，网络失败时回退缓存
//
// 好处：无需每次新增/重命名文件后改 SW；CDN 资源自动缓存

const CACHE_VERSION = 'treasure-hunt-runtime-v1.1';

// ====== 安装：直接跳过等待，立刻激活 ======
self.addEventListener('install', event => {
  self.skipWaiting();
});

// ====== 激活：清理旧版本缓存，立刻接管所有标签页 ======
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_VERSION)
            .map(k => {
              console.log('[SW] 删除旧缓存：', k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ====== fetch：stale-while-revalidate 策略 ======
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(event.request).then(cached => {

        // 后台发起网络请求，成功后更新缓存
        const networkFetch = fetch(event.request).then(response => {
          // 缓存条件：
          //   response.ok       → 同源请求或带 CORS 的跨域请求（状态 200-299）
          //   response.type === 'opaque' → 无 CORS 的跨域响应（如 CDN <script>）
          //   两种都缓存，确保 jsdelivr CDN 库飞行模式下也能加载
          if (response.ok || response.type === 'opaque') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached); // 网络失败时回退到已有缓存

        // 有缓存 → 立即返回（同时后台更新）；无缓存 → 等网络
        return cached || networkFetch;
      })
    )
  );
});
