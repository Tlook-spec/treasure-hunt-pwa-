# 功能名：M16 增强 — 预缓存 + 设置页离线状态

## 前置条件
GitHub Pages 已部署最新版（含 CACHE_VERSION v2 的 SW）。

---

## 桌面 Chrome 测试

### 预缓存是否生效

- [ ] F12 → Application → Storage → 点「Clear site data」清空旧 SW 和缓存
- [ ] 打开 `https://tlook-spec.github.io/treasure-hunt/play/`（首页，联网状态）
- [ ] F12 → Application → Service Workers：看到 SW 状态为「activated and running」
- [ ] F12 → Application → Cache Storage → `treasure-hunt-runtime-v2`：
  - 应出现至少 18 个条目（含所有 HTML 页面 + JS + CSS + manifest）
  - 确认以下 URL 都在缓存里：`/play/`、`/play/index.html`、`/play/pages/quiz.html`、`/play/pages/photo.html`、`/play/styles/main.css`、`/play/scripts/quiz-logic.js`、`/shared/db/play-db.js` 等
  - 确认**不存在** `victory.html`（该页面尚未实现）

### 设置页离线状态显示

- [ ] 打开设置页 → 底部显示绿色「✅ 离线准备已完成，飞行模式下也能正常玩」
- [ ] F12 → Network → 勾选「Offline」→ 刷新设置页 → 离线状态仍显示绿色
- [ ] 新隐身窗口（SW 没接管）→ 打开设置页 → 显示灰色「请联网打开一次首页…」

### 旧缓存清理

- [ ] 改 CACHE_VERSION 后重新部署 → 联网打开首页 → F12 Cache Storage 只剩新版缓存桶，旧 v1.1 已被删除

---

## iPad Safari 测试

- [ ] 联网打开首页 → 等约 5 秒（SW 预缓存下载） → 打开设置页 → 显示绿色「✅ 离线准备已完成」

## iPad PWA 主屏幕图标测试（重点：飞行模式）

- [ ] 联网状态从主屏幕图标打开，进设置页确认「✅ 已完成」
- [ ] **开飞行模式** → 从主屏幕图标重新启动 App
  - [ ] 首页正常加载（不报「returned response is null」）
  - [ ] 导航到 `pages/quiz.html`（手动改 URL 或从游戏流程进入）→ 正常加载，不报网络错误
  - [ ] 导航到 `pages/photo.html` → 正常加载
  - [ ] 导航到 `pages/hint.html` → 正常加载
  - [ ] 导航到 `pages/scan.html` → 正常加载（扫码功能需摄像头，这里只验页面能打开）
  - [ ] 飞行模式下点设置页 → 离线状态显示绿色（SW 仍正常接管）

### 更新验证

- [ ] 有网情况下联网打开首页（不需要进每个子页面）→ SW 后台拉取新文件
- [ ] 进设置页看 BUILD_TAG 是否已更新到最新版本号

---

## 备注

- CDN 库（dexie、html5-qrcode）未进预缓存清单，由 fetch 动态缓存，需联网时至少访问过相应页面一次才会进缓存
- `victory.html` 待 M25 实现后需加入 PRECACHE_URLS 并再次递增 CACHE_VERSION
