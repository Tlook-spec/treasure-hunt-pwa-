# 功能名：游戏端 PWA 框架（M16）

## 桌面 Chrome 测试

- [ ] 访问 `https://tlook-spec.github.io/treasure-hunt/play/`，页面显示「寻宝游戏」标题 + 🗺️ 图标
- [ ] F12 → Application → Manifest：name 显示「寻宝游戏」，theme_color 为 `#4A90E2`，icons 3 个图标路径均正常
- [ ] F12 → Application → Service Workers：状态显示 **activated and running**，source 为 `service-worker.js`
- [ ] F12 → Application → Cache Storage：找到 `treasure-hunt-runtime-v1`，里面有已缓存的条目
- [ ] F12 → Console：无红色报错；可看到 `[SW] 注册成功` 和 `[App] play-db 初始化成功`
- [ ] 在网址末尾加 `?debug=1`，页面右下角出现 Eruda 调试面板齿轮按钮
- [ ] 不加 `?debug=1`，Eruda 面板不出现（不加载 eruda 脚本）

## iPad Safari 测试（有网）

- [ ] Safari 访问 `https://tlook-spec.github.io/treasure-hunt/play/`，页面正常显示，无白屏
- [ ] F12 → Console（或 Eruda）：无红色报错
- [ ] 点击 Safari 分享按钮 → 「添加到主屏幕」→ 图标名称显示「寻宝游戏」
- [ ] 从主屏幕图标启动：以全屏 standalone 模式打开，无 Safari 地址栏

## iPad PWA 飞行模式测试（关键）

- [ ] **前置步骤**：先在 Safari **有网**状态下完整打开 `play/` 页面，等待约 3 秒让 SW 缓存资源
- [ ] 切换 iPad 到「飞行模式」
- [ ] 从主屏幕图标重新启动 App → 页面正常显示「寻宝游戏」（证明 SW 缓存生效）
- [ ] Eruda Console（`?debug=1`）确认无 Dexie 加载失败报错（CDN 库已被 SW 缓存）
- [ ] 关掉飞行模式，确认 App 恢复正常

## 注意事项

- 如果 iPad 上旧 PWA 图标还是 T07 时代的版本，需手动处理：
  1. 长按旧图标 → 删除 App
  2. Safari 重新访问 `https://tlook-spec.github.io/treasure-hunt/play/`
  3. 分享 → 「添加到主屏幕」重新安装
- SW 注册需要 HTTPS，本地 `file://` 打开不会生效（GitHub Pages 是 HTTPS，没问题）
