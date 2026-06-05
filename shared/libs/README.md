# shared/libs/ — 第三方库说明

## MVP 阶段策略

**MVP 阶段不在本地放库文件，统一通过 CDN 引入（带固定版本号）。**

工作原理：
- 第一次访问游戏端（有网）→ 浏览器从 CDN 下载库 → Service Worker 自动缓存
- 之后所有访问（包括飞行模式）→ SW 从缓存直接读 → 完全离线可用

## 5 个库 + 固定 CDN 地址

| 用途 | 库名 | 版本 | CDN URL |
|------|------|------|---------|
| 本地存储 | Dexie.js | 3.2.4 | `https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js` |
| 扫码 | html5-qrcode | 2.3.8 | `https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js` |
| 生成二维码 | qrcode-generator | 2.0.4 | `https://cdn.jsdelivr.net/npm/qrcode-generator@2.0.4/dist/qrcode.js` |
| CSV 解析 | PapaParse | 5.4.1 | `https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js` |
| 移动端调试 | Eruda | 3.0.1 | `https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js` |

## ⚠️ 重要：必须用固定版本号

```html
<!-- ✅ 正确：固定版本号 -->
<script src="https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js"></script>

<!-- ❌ 错误：@latest 会导致版本漂移，离线缓存可能失效 -->
<script src="https://cdn.jsdelivr.net/npm/dexie@latest/dist/dexie.min.js"></script>
```

原因：Service Worker 按 URL 做缓存 key。用 `@latest` 时，CDN 每次可能指向不同文件，
导致缓存的是旧版本而网络返回新版本，离线时出现版本不一致的奇怪 bug。

## Eruda 的特殊用法

Eruda 是移动端调试工具，**只在调试时加载**，正式使用不需要它：

```javascript
// 只有网址带 ?debug=1 时才加载 Eruda
if (new URLSearchParams(location.search).get('debug') === '1') {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js';
  script.onload = () => eruda.init();
  document.head.appendChild(script);
}
```

iPad 调试时在网址后加 `?debug=1`，右下角会出现调试面板。

## V1 阶段计划

V1 阶段如有需要，可以把库文件下载到 `shared/libs/` 本地，
彻底不依赖 CDN（适合完全无网环境的极端情况）。MVP 阶段暂不做。
