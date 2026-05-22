// ====== Service Worker：寻宝游戏的离线缓存管理员 ======
//
// Service Worker 是一个在浏览器后台默默运行的脚本。
// 它就像一个"中间人"：每当网页需要加载文件时，
// 先问 Service Worker 手里有没有缓存版本，有的话直接给，没有再去网络拿。
// 这样即使没网也能正常使用 App。
//
// Service Worker 有三个关键事件：
//   install（安装）→ activate（激活）→ fetch（拦截请求）

// ====== 版本号 ======
// 每次修改代码后，改一下这个版本号（比如 v2、v3）
// 版本号变了，浏览器就知道要重新下载缓存
const CACHE_NAME = 'treasure-hunt-v1.2';

// ====== 需要缓存的文件列表 ======
// 这些文件在用户第一次打开 App 时会被下载并保存到本地
// 之后断网也能从本地读取
const FILES_TO_CACHE = [
    './',
    './index.html',
    './test-scan.html',
    './manifest.json',
    './assets/icons/icon-192.svg',
    './assets/icons/icon-512.svg',
    './assets/icons/icon-maskable-192.svg',
];

// ====== 安装事件：第一次注册 Service Worker 时触发 ======
// 在这里把所有文件提前下载存好，就像出门前把干粮装进背包
self.addEventListener('install', function (event) {
    console.log('[Service Worker] 安装中，开始缓存文件...');

    // event.waitUntil 的意思：等这件事做完再结束安装
    event.waitUntil(
        // caches.open 打开（或新建）一个缓存仓库
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('[Service Worker] 正在缓存文件列表...');
            // addAll 一次性下载并缓存所有文件
            // 只要有一个文件失败，整个缓存就会失败（保证完整性）
            return cache.addAll(FILES_TO_CACHE);
        }).then(function () {
            console.log('[Service Worker] 所有文件缓存完成！');
            // skipWaiting：安装完成后立刻激活，不等待旧版本退出
            return self.skipWaiting();
        })
    );
});

// ====== 激活事件：Service Worker 开始工作时触发 ======
// 在这里清理旧版本的缓存，释放存储空间
self.addEventListener('activate', function (event) {
    console.log('[Service Worker] 激活中，清理旧版本缓存...');

    event.waitUntil(
        // caches.keys() 获取所有缓存仓库的名字
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // 如果这个缓存不是当前版本，就删掉
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] 删除旧缓存：', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function () {
            console.log('[Service Worker] 旧缓存清理完成，开始接管页面');
            // clients.claim：让新 Service Worker 立刻接管所有已打开的页面
            return self.clients.claim();
        })
    );
});

// ====== fetch 事件：每次页面发起网络请求时触发 ======
// 在这里决定：用缓存里的文件，还是去网络下载
// 我们的策略：优先用缓存（Cache First），缓存没有再去网络
self.addEventListener('fetch', function (event) {

    // 只处理 GET 请求（读取文件），POST 等其他请求直接放行
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        // 在缓存里查找这个请求对应的文件
        caches.match(event.request).then(function (cachedResponse) {

            // 情况一：缓存命中，直接返回缓存中的文件（支持离线！）
            if (cachedResponse) {
                return cachedResponse;
            }

            // 情况二：缓存没有，去网络请求
            return fetch(event.request).then(function (networkResponse) {
                // 拿到网络响应后，顺便把它存入缓存（下次就能离线用了）
                // 注意：只缓存成功的响应（状态码 200）
                if (networkResponse && networkResponse.status === 200) {
                    // 必须克隆响应，因为响应只能被读取一次
                    var responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;

            }).catch(function () {
                // 情况三：缓存和网络都失败了（完全断网，且文件没被缓存过）
                // 如果请求的是一个页面（导航请求），退而求其次返回首页
                if (event.request.mode === 'navigate') {
                    console.log('[Service Worker] 网络不可用，返回离线首页');
                    return caches.match('./index.html');
                }
                // 如果是其他资源（图片、脚本等），就什么都不返回（让请求自然失败）
            });
        })
    );
});
