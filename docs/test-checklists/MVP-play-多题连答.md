# 功能名：L2 内多题连答主流程（M22）

> 覆盖范围：quiz.html 两屏（发现站点 + 答题）+ quiz-logic.js 基础答题逻辑

## 前置准备

- 游戏端已导入 JSON（含 ≥1 个探险、每个探险 ≥2 个点位、每个点位 ≥2 道题）
- 完整走到 scan.html 并扫码 / 手动输入正确码，进入 quiz.html
- 手头知道当前点位的 correctAnswer 索引（看编辑端题目详情）

---

## 桌面 Chrome 测试

### 屏 1：发现站点

- [ ] 进入 quiz.html → 显示顶部蓝色横幅「第 N 站 · 共 M 站」
- [ ] 显示发现卡片，内容为该点位的 `discoveryText`（空则显示「恭喜找到第 N 站！请回答这里的题目吧！」）
- [ ] 底部绿色「开始挑战！」按钮可见，点击不报错
- [ ] F12 Console 无红色报错

### 屏 1 → 屏 2 切换

- [ ] 点「开始挑战！」→ 按钮短暂变「⏳」，切换到屏 2
- [ ] 横幅变为「第 N 站  第 1/M 题  💡 求助 3」三段显示
- [ ] 屏 1 完全隐藏，屏 2 可见
- [ ] IndexedDB sessions 表里，pointRecords[currentPointIndex] 已创建（含 scannedAt）

### 屏 2：题目渲染

- [ ] 题目卡片显示：「学科 · ★☆☆」（或对应难度星）
- [ ] 题干文本正确显示
- [ ] 选项区显示 2×2 四个按钮，分别标注 A / B / C / D 及对应选项文字
- [ ] 选项按钮高度 ≥ 80px（手指能点到）
- [ ] 「再试试？🤔」文字不可见（占位，不占宽度）

### 答题：答对

- [ ] 点击正确选项 → 该按钮变绿色高亮，其余按钮灰掉（disabled）
- [ ] ~0.8s 后：若还有下一题 → 题目卡片内容更新，横幅变「第 2/M 题」
- [ ] 若已是最后一题 → 跳转到 photo.html（M24 前会 404，URL 正确即可）
- [ ] IndexedDB sessions 中，questionResults 追加了 `{ questionId, answerAttempts:1, usedHelp:false, score:10 }`
- [ ] currentQuestionIndex 在 DB 里递增（下一题）或保持不变（最后一题）

### 答题：答错

- [ ] 点击错误选项 → 该按钮变红色高亮
- [ ] 「再试试？🤔」文字出现
- [ ] ~0.6s 后：红色高亮消失，所有按钮恢复可点击
- [ ] IndexedDB sessions 中，questionResults **不变**（答错不记录）
- [ ] 可再次点选任意选项（包括原来点过的错误选项）

### 多题连续答对

- [ ] 设置点位含 3 题，全部答对 → 横幅依次显示「第 1/3 题」「第 2/3 题」「第 3/3 题」
- [ ] 第 3 题答对后跳转 photo.html（404）
- [ ] sessionId 参数跟随跳转（URL 可见）

### 防重复点击

- [ ] 快速连续点同一选项两次 → 只触发一次提交（按钮在第一次点击后立即 disabled）
- [ ] Console 无重复请求日志

### 求助按钮（M22 占位）

- [ ] 横幅右上角「💡 求助 3」按钮可见
- [ ] 点击 → Console 打印「[M23] 求助功能待实现」，页面无崩溃
- [ ] 数字显示 = maxHelpCount − helpUsedCount（初始为 3）

### 异常 URL

- [ ] quiz.html（无 sessionId）→ 自动跳转 select-level.html
- [ ] quiz.html?sessionId=不存在的ID → 显示「数据加载失败 😵」+ 返回链接

---

## iPad Safari 测试（有网）

- [ ] 从 scan.html 扫码成功进入 quiz.html → 屏 1 正常显示
- [ ] 点「开始挑战！」→ 切到屏 2，题目可读，字号够大（≥20px）
- [ ] 选项按钮触控区域够大（手指轻松点击，不会点错相邻按钮）
- [ ] 答对高亮、答错高亮在 iOS Safari 下颜色显示正确
- [ ] 求助按钮点击无崩溃

---

## iPad PWA 主屏幕图标 + 飞行模式

**准备阶段（有网）**
- [ ] 从主屏幕图标启动 App，走完整链路至 quiz.html（让 SW 缓存）

**飞行模式阶段**
- [ ] 切飞行模式 → 重新走链路至 quiz.html
- [ ] 屏 1/2 渲染正常，答题功能正常
- [ ] Eruda Console（?debug=1）无资源加载失败报错

---

## 备注

- 答对跳转 photo.html 目前 404（M24 实现）
- 求助按钮功能 M23 实现，点击只有 console.log
- 答错不记录（3 次容错 + 求助积分逻辑是 M23 的工作）
- scan-verify.js 的 goToChallenge 已从 challenge.html 改为 quiz.html
