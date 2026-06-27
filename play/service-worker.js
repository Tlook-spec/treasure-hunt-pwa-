// ====== 寻宝游戏 Service Worker：预缓存 + 动态缓存（stale-while-revalidate）======
//
// 两层缓存策略：
//   ① install 时预缓存所有自己的页面和 JS（只要联网打开一次首页，所有页面就绪）
//   ② fetch 时动态缓存（CDN 库 + 首次访问时自动加入）
//
// CACHE_VERSION 改变时旧缓存全部清除，强制重新缓存。

const CACHE_VERSION = 'treasure-hunt-runtime-v2.32';

// ── 预缓存清单（只列真实存在的文件；CDN 库不列，由 fetch 事件动态处理）──
// ⚠️ 每次增删页面或 JS 文件时更新这里，并递增 CACHE_VERSION
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './styles/main.css',
  './assets/sounds/correct.mp3',
  './assets/sounds/wrong.mp3',
  './assets/sounds/ding.mp3',
  './assets/sounds/victory.mp3',
  './pages/select-level.html',
  './pages/settings.html',
  './pages/start-level.html',
  './pages/hint.html',
  './pages/scan.html',
  './pages/quiz.html',
  './pages/photo.html',
  './pages/victory.html',
  './scripts/scan-verify.js',
  './scripts/quiz-logic.js',
  './scripts/map-overlay.js',
  '../shared/db/db-config.js',
  '../shared/db/play-db.js',
  '../shared/utils/id.js',
  '../shared/utils/json-io.js',
  '../shared/version.js',
];

// ====== 安装：预缓存清单里的所有文件 ======
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // 逐个缓存，单个失败不影响其余（比 addAll 全有或全无更稳健）
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            console.warn('[SW] 预缓存失败，跳过：', url, err.message);
          })
        )
      )
    )
  );
  // 安装后立刻接管，不等旧 SW 关闭
  self.skipWaiting();
});

// ====== 激活：清理旧版本缓存，立刻接管所有标签页 ======
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_VERSION)
            .map((k) => {
              console.log('[SW] 删除旧缓存：', k);
              return caches.delete(k);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ====== fetch：stale-while-revalidate 动态缓存策略 ======
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      // ignoreSearch: true → 让带参数的页面（如 start-level.html?levelId=xxx、
      // hint.html?sessionId=xxx）能命中预缓存的无参数版本。
      // 这些页面用 ? 后参数在页面间传 sessionId/levelId，HTML 文件本身内容相同，
      // 忽略参数匹配既安全又正确；否则飞行模式下每个新参数都会缓存未命中。
      cache.match(event.request, { ignoreSearch: true }).then((cached) => {
        // 后台更新缓存（成功则刷新；失败则回退已有缓存）
        const networkFetch = fetch(event.request)
          .then((response) => {
            // response.ok      → 同源或带 CORS 的跨域请求（200-299）
            // response.type=opaque → 无 CORS 的 CDN 脚本（jsdelivr 等）
            // 两种都缓存，确保 CDN 库飞行模式下可用
            if (response.ok || response.type === 'opaque') {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          // 网络失败时回退缓存；连缓存都没有就返回错误 Response，
          // 绝不返回 undefined/null（否则浏览器报 "returned response is null"）
          .catch(() => cached || Response.error());

        // 有缓存 → 立即返回（后台更新）；无缓存 → 等网络
        return cached || networkFetch;
      })
    )
  );
});

// ====== message：供设置页查询「离线准备是否完成」======
self.addEventListener('message', async (event) => {
  if (!event.data || event.data.type !== 'CHECK_CACHE') return;

  const cache   = await caches.open(CACHE_VERSION);
  const matches = await Promise.all(PRECACHE_URLS.map((url) => cache.match(url)));
  const cached  = matches.filter(Boolean).length;
  const total   = PRECACHE_URLS.length;
  const reply   = {
    type:   'CACHE_STATUS',
    ready:  cached === total,
    cached,
    total,
  };

  // 优先用 MessageChannel port（postMessage 第二个参数传入的专用通道）
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage(reply);
  } else if (event.source) {
    event.source.postMessage(reply);
  }
});
