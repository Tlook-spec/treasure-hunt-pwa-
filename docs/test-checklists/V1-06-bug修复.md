# 功能名：V1-06 Bug 修复 — B01 矮屏选项截断 + B02 首启离线提示

> 改动范围：`play/styles/main.css`（@media max-height:820px）、`play/pages/quiz.html`（scrollIntoView）、`play/index.html`（offline-tip + checkAndShowTip）、`play/service-worker.js`（v2.12）

---

## B01：矮屏选项截断修复

### 桌面浏览器测试（Windows + Chrome）

- [ ] 打开 DevTools → 把视口高度拖到 760px 以下（模拟矮屏）
- [ ] 进入答题页：4 个选项按钮全部可见，不被底部截断
- [ ] 选项区高度随内容弹性伸缩，超出时在选项区内滚动（而不是整页滚动）
- [ ] 答错 3 次触发「保底」反馈：确认按钮滚入可见区（scrollIntoView 生效）
- [ ] 视口高度 > 820px 时：恢复原来布局（margin-top clamp(100px,18vh,168px)），与之前一致

### iPad Safari 测试（横屏 iPad 10 / iPad Mini）

- [ ] 横屏进答题页：所有选项完整显示，无截断
- [ ] 拼音开启时选项高度增加，选项区仍可内滚，确认按钮可到达
- [ ] 答对/答错/保底逻辑不受影响

---

## B02：首启离线提示

### 桌面浏览器测试（Windows + Chrome）

- [ ] 清空 SW（DevTools Application → Service Worker → Unregister）→ 刷新启动页
  - 应看到橙色提示框：「⚠️ 第一次使用请先联网打开一遍...」
- [ ] 正常二次访问（SW controller 已就绪）：提示框不显示，界面干净
- [ ] SW 已注册但缓存未完成时（可在 DevTools Network 限速 Slow 3G 模拟）：
  - 应看到「⚠️ 离线资源下载中（X/Y）...」
- [ ] F12 Console 无红色错误

### iPad Safari 测试

- [ ] 首次访问游戏端：看到橙色提示，文字完整可读
- [ ] 保持联网、稍等片刻后刷新：提示消失（缓存就绪）
- [ ] Eruda Console（?debug=1）无红色错误

### iPad PWA 主屏幕三态测试

- [ ] Safari 浏览器直接访问（有网）：B01/B02 均表现正常
- [ ] PWA 主屏幕图标启动（有网）：设置页 BUILD_TAG 显示 `V1-06-bug修复`
- [ ] PWA 主屏幕图标启动（飞行模式）：SW v2.12 缓存生效，启动页正常加载，提示框不显示（已就绪）
