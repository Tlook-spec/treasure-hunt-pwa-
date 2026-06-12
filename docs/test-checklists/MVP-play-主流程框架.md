# 功能名：游戏端主流程框架（M19）

> 覆盖范围：开始冒险页（start-level.html）+ 提示展示页（hint.html）+ select-level.html 链接修正

## 前置准备

- 已通过设置页导入含至少 1 个探险（含 ≥2 个点位）的 JSON 文件
- 各点位在编辑端已填写 locationHint；另有 1 个点位故意留空（测试兜底文案）

---

## 桌面 Chrome 测试

### 探险选择页（select-level.html）
- [ ] 有数据时，「开始 ▶」链接指向 `start-level.html?levelId=xxx`（不再是 404）
- [ ] 点「开始 ▶」→ 正确跳转到 start-level.html，URL 含对应 levelId
- [ ] F12 Console 无红色报错

### 开始冒险页（start-level.html?levelId=xxx）
- [ ] 页面显示正确探险图标（emoji）、探险名称、探险简介
- [ ] 同一探险每次显示的 emoji 相同（哈希稳定）
- [ ] 探险无简介时显示「（暂无简介）」斜体灰字
- [ ] 「← 返回」→ 回到 select-level.html
- [ ] 点「🚀 开始冒险！」：
  - [ ] 按钮变为「⏳ 出发中…」+禁用（防止双击）
  - [ ] 跳转到 hint.html，URL 含 sessionId（格式 `sn_xxx_xxx`）
  - [ ] F12 → Application → IndexedDB → treasure-hunt-play-db → sessions：能看到新建的记录，字段含 levelId、status=in_progress、currentPointIndex=0、maxHelpCount=3、pointRecords=[]
- [ ] 手动传不存在的 levelId（如 ?levelId=FAKE）→ 自动跳回 select-level.html
- [ ] F12 Console 无红色报错

### 提示展示页（hint.html?sessionId=xxx）
- [ ] 顶部蓝色横幅显示「第 1 站 · N 站中的第 1 站」（N = 探险点位总数）
- [ ] 提示卡片显示当前第 1 个点位的 locationHint 文本
- [ ] locationHint 为空的点位：提示卡片显示「仔细看二维码贴在哪里」
- [ ] 「📷 我找到了！扫码！」按钮为绿色，显示在底部
- [ ] 点击绿色按钮 → 跳转到 scan.html?sessionId=xxx（404 正常，M20 实现）
- [ ] 手动传不存在的 sessionId（?sessionId=FAKE）→ 自动跳回 select-level.html
- [ ] F12 Console 无红色报错

### 完整链路连跳测试
- [ ] 选择探险 → 开始 ▶ → 开始冒险页 → 🚀 开始冒险！→ 提示页，全程无报错
- [ ] 连续新建两局（不同探险），IndexedDB sessions 表中两条记录各自的 levelId 对应正确

---

## iPad Safari 测试（有网）

- [ ] select-level.html「开始 ▶」链接可点击，跳转正常
- [ ] start-level.html：探险信息显示，「🚀 开始冒险！」按钮大小适合手指点击（≥60px 高）
- [ ] 点击后跳转到 hint.html，提示文字清晰可读（≥20px）
- [ ] hint.html 底部绿色按钮适合手指点击，不被系统底部 bar 遮挡

---

## iPad PWA 主屏幕图标 + 飞行模式

**准备阶段（有网）**
- [ ] 从主屏幕图标启动 App
- [ ] 依次访问：首页 → 探险选择页 → start-level.html → hint.html → 返回选择页
- [ ] 等约 3 秒让 SW 缓存新页面资源

**飞行模式阶段**
- [ ] 切飞行模式 → 完整链路连跳（选探险 → 开始 → 提示），全程无白屏/404
- [ ] Eruda Console（?debug=1）无资源加载失败报错

---

## 备注

- hint.html「📷 我找到了！扫码！」按钮跳转的 scan.html 在 M20 实现，现在点击会 404，属正常
- select-level.html M17 测试清单中「开始 ▶ 会 404」那条备注在 M19 之后已不再成立
- M26 实现自动保存后，重启 App 时 sessions 表中 in_progress 记录会触发续玩检查
