# 功能名：M24 L2 通关拍合影 + 继续扫码找下一站

## 前置条件
已导入含多站点（≥2 站）的探险 JSON，答完某站全部题目后自动跳转到 photo.html。

---

## 桌面浏览器测试（Windows + Chrome）

### 拍照路径

- [ ] 进入页面 → 横幅显示「第 N/M 站 完成」，屏幕显示「第 N 站完成！」+ 「拍一张通关合影作纪念吧！」
- [ ] 「📸 拍照」大按钮（绿色）+ 「跳过这一站合影」灰色小文字按钮 均可见
- [ ] 点「📸 拍照」→ 弹出系统文件选择器（桌面浏览器上是文件选择窗口，iPad 上是相机）
- [ ] 选一张图片后：
  - 按钮变「⏳ 处理中…」短暂禁用
  - 切换到预览屏，图片显示正常
  - 「💡 长按图片可保存到系统相册」提示出现
  - F12 → Application → IndexedDB → `treasure-hunt-play-db` → `photos` 表：新增一条记录
    - `type` = `completion_photo`
    - `ownerId` = 当前点位 id（与 `points` 表对应）
    - `format` = `jpeg`
    - `sizeBytes` 约 100-300 KB 量级（压缩生效）
  - F12 → `sessions` 表 → `pointRecords[N].completionPhotoId` 有值（非 null）
- [ ] 「📷 继续扫码找下一站」大按钮（橙色）可见且可点
- [ ] 点「继续扫码找下一站」→ F12 确认 `session.currentPointIndex` 加了 1、`currentQuestionIndex` 变回 0
- [ ] 页面跳转到 `hint.html`，显示的是**下一站**的 locationHint（不是刚通关那站）

### 跳过路径

- [ ] 点「跳过这一站合影」→ 切换到完成屏，显示「已跳过合影，继续加油！」
- [ ] F12 → `photos` 表：**不新增**任何记录
- [ ] F12 → `sessions` 表 → `pointRecords[N].completionPhotoId` 保持 `null`
- [ ] 「📷 继续扫码找下一站」按钮可见，点击后同样推进站号跳转 hint.html

### 最后一站

- [ ] 走到最后一站答完题进入 photo.html
  - 横幅显示「第 N/N 站 完成」
  - 继续按钮文案变为「🏆 查看通关成绩！」
- [ ] 点「查看通关成绩」→ 跳转 victory.html（M25 完成前 404 属正常，确认「判定为最后一站并跳转」即可）
- [ ] 点击后 F12 确认 `session.currentPointIndex` **未**被推进（最后一站不加）

### 取消拍照

- [ ] 点「📸 拍照」→ 在文件选择器里取消 → 页面回到状态 1，按钮恢复可用，无任何报错

### F12 Console

- [ ] 无红色错误
- [ ] 图片处理成功日志无异常

---

## iPad Safari 测试

- [ ] 答完题自动跳到 photo.html，页面正常加载
- [ ] 点「📸 拍照」→ 系统询问相机权限 → 允许后拍照 → 图片出现在预览区
- [ ] iOS 上长按预览图片 → 弹出系统菜单含「存储到"照片"」选项
- [ ] 跳过路径在 Safari 上正常
- [ ] 点「继续扫码」跳转 hint.html 后显示**下一站**提示（页面内容正确）

## iPad PWA 主屏幕图标测试

- [ ] 主屏幕图标启动后，完整走一遍「答完题 → 拍照 → 继续」流程
- [ ] 设置页显示「更新到 · M24 · 2026-06-13」（确认 PWA 加载了最新版本）
- [ ] **飞行模式**下重启 PWA → 进入 photo.html → 拍照并保存（IndexedDB 和 Canvas 均无网络依赖）
- [ ] 飞行模式下点「继续扫码」→ 跳转 hint.html 正常（纯本地跳转）

---

## 压缩验证

- [ ] F12 → `photos` 表 → `sizeBytes` 字段：拍摄正常照片后约 100-300 KB（1280px 长边 + JPEG 0.7 压缩目标）
- [ ] `width` / `height` 字段 ≤ 1280（长边未超限）
