# 各页面数据清单（MVP）

> 本文档按页面列出每个页面的显示元素、操作跳转、所需数据（字段 + 来源）。
> 字段名严格对齐 PRD v1.7 §6 数据模型。
> **MVP 阶段编辑端 UI 不显示任何地图字段和故事字段**（数据模型预留，默认 null/空）。

---

## 编辑端 admin/

> 编辑端是普通网页（非 PWA），数据库 `treasure-hunt-admin-db`。
> 所有页面共用左侧固定导航：探险管理 / 题库管理 / 导入导出 JSON。

---

### A1. L1 探险列表（01-l1-list.png）

**显示**：
- 顶部标题「L1 探险列表」+ 操作按钮区
- 探险卡片网格（3 列），每张卡片含：探险名、简介、点位数、最后编辑时间、操作链接（编辑/复制/删除/导出JSON）

**操作**：
- 点击卡片「编辑」→ 进入 A2 L1 编辑页（携带 levelId）
- 「新建探险」按钮 → 进入 A2 L1 编辑页（无 levelId，空表单）
- 「复制」→ 深拷贝该 L1 + 所有 Point，新 ID，名字加「(副本)」，刷新列表
- 「删除」→ 二次确认弹窗（级联删除 L1 + 关联 Point）
- 「导出JSON」「导入探险JSON」→ ⚠️ **MVP 不实现**（单 L1 导入/导出是 V1 功能，按钮不显示或置灰）

**需要的数据**：
- 所有 Level 列表 → `db.levels.orderBy('updatedAt').reverse().toArray()`
  - 用到字段：`id`、`name`、`description`、`updatedAt`
- 每个 Level 的点位数 → `db.points.where('levelId').equals(levelId).count()`

---

### A2. L1 探险 新建/编辑（02-l1-form-and-detail.png）

> 新建和编辑共用同一页面。含「基本信息」+「点位列表」两区。

**显示**：
- 面包屑：探险管理 > [探险名] > 编辑
- 基本信息区：探险名称、探险简介、推荐人数、推荐年龄
- 「保存应急小抄」按钮（= 打印应急小抄，window.print）
- 点位列表区：「保存所有点位二维码」按钮 + L2 点位行列表
  - 每行：序号、点位名称、家长备注、上移/下移、编辑、复制、移除、保存二维码
- 底部：取消 / 保存

**操作**：
- 填表 + 保存 → 写入/更新 levels 表，返回 A1 列表
- 「保存应急小抄」→ window.print 生成 A4 应急小抄（所有 L2 数字码清单）
- 「保存所有点位二维码」→ 批量生成/打印全部 L2 二维码（window.print）
- 点位行「编辑」→ 进入 A3 L2 编辑页（携带 pointId）
- 点位行「上移/下移」→ swap 相邻 Point 的 order，刷新
- 点位行「复制」→ 深拷贝该 Point，新 ID，新 6 位码
- 点位行「移除」→ 二次确认删除该 Point（关联题目 usedCount 不减）
- 点位行「保存二维码」→ 单张二维码生成 PNG
- （添加点位入口：通常在点位列表区顶部「➕ 添加点位」→ A3 空表单）

**需要的数据**：
- 单个 Level → `db.levels.get(levelId)`
  - 用到字段：`id`、`name`、`description`、`recommendedPlayerCount`、`recommendedAge`
  - ⚠️ **不显示**：`themeColor`（可选，看是否做主题色选择器）、`openingStory`、`endingStory`、`mapImage` 等地图字段
- 该 L1 的点位列表 → `db.points.where('levelId').equals(levelId).sortBy('order')`
  - 用到字段：`id`、`order`、`name`、`parentNote`、`code`
- 保存时：新建用 `generateId('lvl')`，写入 `createdAt`/`updatedAt`

---

### A3. L2 点位 新建/编辑（03-l2-edit.png）

> 新建和编辑共用同一页面。含基本信息 / 扫码成功提示 / 本站提示 / 题目绑定区。

**显示**：
- 面包屑：探险管理 > [探险名] > 第 N 站编辑
- 标题「L2 点位编辑：第 N 站」+「保存二维码」按钮
- 基本信息区（仅家长可见）：点位序号（自动）、点位名称、家长备注
- 「本站扫码成功提示」（孩子可见）多行文本（discoveryText）
- 「本站提示」（孩子可见）多行文本（locationHint）
- 题目绑定区：已绑定题目卡片列表（#序号、学科、难度星、题干 + 上移/下移/移除）
- 「➕ 从题库添加题目」按钮 + 「🎲 随机抽 N 道」按钮（⚠️ 灰边 = V1，不实现）
- 底部：取消 / 保存

**操作**：
- 填表 + 保存 → 写入/更新 points 表，返回 A2
- 新建 L2 时：`generateId('pt')` + 关联 levelId + `generateSixDigitCode()`（与 points 表所有 code 查重）+ 默认 order = 当前 L1 内 max+1
- 「保存二维码」→ 单张二维码 PNG
- 「从题库添加题目」→ 弹题库选择面板（含学科/难度筛选，勾选确认），追加到 questionIds，被选题目 `usedCount += 1`
- 题目「上移/下移」→ 调整 questionIds 数组顺序（决定答题顺序）
- 题目「移除」→ 从 questionIds 删除，`usedCount` **不减**（消耗式）

**需要的数据**：
- 单个 Point → `db.points.get(pointId)`
  - 用到字段：`id`、`levelId`、`order`、`name`、`parentNote`、`discoveryText`、`locationHint`、`questionIds`、`code`
  - 说明：`discoveryText` = 本站扫码成功提示（孩子可见，可空），MVP 启用
  - 说明：`locationHint` = 到达本点位的引导提示（孩子可见）。语义是「找到本站」，第 N 个 Point 的 locationHint 就是去找第 N 站的提示
  - **不显示**：`mapX`、`mapY`、`questionIntroText`、`completionText`（V1 预留，默认 null/空）
- 已绑定题目的详情（显示学科/难度/题干）→ 按 questionIds 批量 `db.questions.bulkGet(questionIds)`
  - 用到字段：`id`、`subject`、`difficulty`、`text`
- 题库选择面板的候选题目 → `db.questions` 全表 + 前端按 subject/difficulty 筛选

---

### A4. 题库管理主页（04-l3-list.png）

**显示**：
- 顶部按钮：「➕ 新建题目」「📥 CSV导入」「📤 题库CSV导出」
- 筛选条：学科 / 难度（★ ★★ ★★★）/ 年龄段（4-6 / 7-9 / 10-12）/ 使用次数（0 / 1 / 2+）
- 题目列表，每行：题干、[学科 难度星 年龄段]、usedCount 次、编辑/删除/复制

**操作**：
- 「新建题目」→ A5 题目表单（空）
- 「CSV导入」→ A6 CSV 导入页
- 「题库CSV导出」→ 全部题目导出为 CSV（PapaParse.unparse）
- 筛选条点击 → 前端过滤列表（含 usedCount 维度）
- 行「编辑」→ A5 题目表单（携带 questionId）
- 行「复制」→ 深拷贝，新 ID，`usedCount` 重置为 0
- 行「删除」→ 引用保护检查（扫描所有 Point 的 questionIds）
  - 有引用 → 弹拒绝对话框（提示被哪些 L2 引用，先去解除）
  - 无引用 → 二次确认 → 删除

**需要的数据**：
- 所有 Question → `db.questions.orderBy('usedCount').toArray()`（默认 usedCount 升序，未用过的优先）
  - 用到字段：`id`、`subject`、`difficulty`、`ageGroup`、`text`、`usedCount`
- 删除前引用检查 → 扫描 `db.points` 所有 questionIds 是否含该 id

---

### A5. 题目 新建/编辑（05-l3-form.png）

> 新建和编辑共用同一页面。MVP 题型只有「选择题」「判断题」。

**显示**：
- 面包屑：题库管理 > 录入题目
- 「✏️手工录入」「📷截图【V2再做】」切换（截图灰边 = V2，不实现）
- 题目（必输）多行文本
- 题型（必输）：选择题 / 判断题 / 填空题[V1]（填空灰边 = V1，不实现）
- 正确答案（必输）：A/B/C/D 选项圆圈
- 学科（必输）下拉
- 难度（可选）下拉：★ / ★★ / ★★★
- 推荐年龄（可选）
- 提示（可选，答错后出现）
- 解析（可选，答对后出现）
- 底部：取消 / 保存

**操作**：
- 保存 → 写入/更新 questions 表
- 新建用 `generateId('q')`，`usedCount` 初始 0

**需要的数据**：
- 单个 Question → `db.questions.get(questionId)`
  - 用到字段：`id`、`subject`、`difficulty`、`ageGroup`、`type`、`text`、`options`、`correctAnswer`、`hint`、`explanation`、`usedCount`
  - ⚠️ **不显示**：`imagePath`、`textImagePath`（V1，默认 null）
- 注意：截图里选项是固定 A/B/C/D 四圆圈；PRD §6.3 `options` 是动态数组（单选 2-4 个、判断题 2 个）。**开发时以 PRD 的动态行为准**，线框图仅示意（见文末「编辑端备注」）

---

### A6. CSV 批量导入题目（06-csv-import.png）

**显示**：
- 面包屑：题库管理 > 导入题目
- 步骤1：下载模板（带表头和例子）按钮
- 步骤2：上传 CSV 文件（选择文件）
- 预览区：前 5 行数据
- 「确认导入」按钮
- 结果区：成功 X 道，失败 Y 道（行号 + 原因）
- ⚠️ 应补充：UTF-8 编码教学截图（PRD §4.1.4 要求显著展示，避免 Windows Excel 中文乱码）

**操作**：
- 「下载模板」→ 生成模板 CSV（列：学科/难度/年龄段/题型/题干/选项A-D/正确答案/提示/解析，UTF-8 with BOM）
- 「选择文件」→ PapaParse 解析，显示前 5 行预览
- 「确认导入」→ 逐行校验写入 questions 表，每道新题 `generateId('q')` + `usedCount=0`，显示成功/失败统计
- 预览乱码 → 提示文件非 UTF-8，按教学重新保存

**需要的数据**：
- 输入：用户上传的 CSV 文件（PapaParse 解析为对象数组）
- 输出：批量写入 `db.questions`

---

### A7. 导入/导出 JSON（07-json-io.png）

> MVP 只做**整库**覆盖导入导出。

**显示**：
- 标题「导入 / 导出 JSON」
- 导出区：「导出全部数据」按钮 + 说明（所有探险 + 全部题库，完整备份）
- 导入区：警告条（导入会完整替换当前所有数据）、步骤1 选择文件、步骤2 自动检查文件信息（schemaVersion / 导出时间 / 探险数·点位数·题目数）、「确认导入」按钮
- 二次确认弹窗：列出将替换的探险数/点位数/题目数 + 「这个操作无法撤销」+ 取消/确定替换

**操作**：
- 「导出全部数据」→ 读取三张表打包成 JSON Envelope（schemaVersion "1.0"），下载文件
- 「选择文件」→ 读取并解析 JSON，自动校验 schemaVersion === "1.0"
  - 缺 schemaVersion → 拒绝「这不是有效的寻宝游戏数据文件」
  - schemaVersion ≠ "1.0" → 拒绝「该文件由不兼容的 App 版本创建」
- 「确认导入」→ 二次确认弹窗 → 确定后清空三张表 + 整库写入

**需要的数据**：
- 导出：`db.levels` + `db.points` + `db.questions` 全表
- 导入：解析 JSON Envelope `data.levels` / `data.points` / `data.questions`
- Envelope 字段：`schemaVersion`、`exportedAt`、`exportType`（MVP 固定 "full"）、`data`

---

## 编辑端备注（写代码前留意）

1. **L1 themeColor（主题色）MVP 是否做**：T10 线框图清单提到 L1 表单含「主题色」，但 02 图没画出选择器。MVP 可先用默认值，不做选择器；要做也只是一个颜色选择控件，成本低。
2. **题目选项的动态行**：05-l3-form.png 画成固定 A/B/C/D 四圆圈，PRD §6.3 是动态数组（单选 2-4 个、判断题只 2 个）。**以 PRD 为准（动态行）**，线框图仅示意。

---

## 游戏端 play/

> 游戏端是 iPad PWA（完全离线），数据库 `treasure-hunt-play-db`。
> 题库/探险数据从编辑端导出的 JSON 导入；游戏过程数据存在 `sessions` 表。
> 字段名严格对齐 PRD v1.7 §6（GameSession §6.5、PhotoBlob §6.6）。

---

### P1. 启动页（01-launch.png）

**显示**：
- 大 Logo + App 名「寻宝游戏」+ 副标题
- 「🎮 开始游戏」大按钮（户外大手指，按钮足够大）
- 右下角「⚙️ 设置」（不显眼）

**操作**：
- 「开始游戏」→ 进入 P2 探险选择页
- 「设置」→ 进入 P10 设置页

**需要的数据**：无（静态页）

---

### P2. 探险选择页（02-select-level.png）

**显示**：
- 标题「选择探险」+ 返回
- 续玩横幅（**仅当存在未完成 session 时显示**）：探险名 + 已通关 N/M 站 + 「继续玩」「放弃，重新开始」
- 「选择今天的探险吧！（N 个）」
- 探险卡片列表，每张：图标、探险名、简介、点位数、上次游玩时间（或「从未游玩」）、「开始 ▶」
- 无探险时：提示「还没有探险，请去电脑端编辑后导入」

**操作**：
- 「继续玩」→ 恢复上次 session 状态，跳到当时所在的 P3 提示页 / P6 答题页
- 「放弃，重新开始」→ 二次确认 → 清除该 session 存档
- 卡片「开始」→ 进入 P3 开始冒险页（携带 levelId，新建 session）

**需要的数据**：
- 所有 Level → `db.levels.toArray()`
  - 用到字段：`id`、`name`、`description`
- 每个 Level 点位数 → `db.points.where('levelId').equals(levelId).count()`
- 未完成 session → `db.sessions.where('status').equals('in_progress').toArray()`
  - 用到字段：`levelId`、`currentPointIndex`、`startedAt`/`endedAt`（推「上次游玩」）
- 续玩横幅的「已通关 N/M 站」：N = session.currentPointIndex，M = 该 L1 点位数

---

### P3. 开始冒险页 + L2 提示页（03-start-and-hint.png）

> 一个文件含两屏。屏 1「开始冒险」只在选完探险后显示一次（仪式感）；屏 2「提示」每到新点位都显示（含第 1 站）。

**屏 1 开始冒险**

显示：返回、探险名、简介、「🚀 开始冒险！」大按钮（蓝）
操作：「开始冒险」→ 新建 session（`generateId('sn')`，status="in_progress"，currentPointIndex=0），进入屏 2
需要数据：`db.levels.get(levelId)`（`name`、`description`）

**屏 2 L2 提示页**

显示：
- 顶部进度条「第 N 站 · M 站中的第 N 站」
- 「下一站在哪里？」+ 提示卡片（`locationHint` 文本 + 小字「仔细看二维码贴在哪里」）
- 「📷 我找到了！扫码！」大按钮（绿）

操作：「扫码」→ 进入 P4 扫码界面
需要数据：
- 当前 Point → 按 session.currentPointIndex 从该 L1 的 points（order 升序）取第 N 个
  - 用到字段：`order`、`locationHint`
- 说明：`locationHint` = 到达本点位的引导提示，第 N 个 Point 的 locationHint 就是去找第 N 站的提示（含第 1 站）

---

### P4. 扫码界面（04-scan.png）

**显示**：
- 深色背景 + 标题「对准二维码」+ 返回
- 绿色取景框 + 提示「把二维码放进框里就行啦～」
- 底部两按钮：「🔢 扫不出？可以输入数字码」「❓ 找不到二维码？」

**操作**：
- html5-qrcode 扫到内容 → 查 code → 触发 P5 的成功/C/D 状态
- 「扫不出？输入数字码」→ 弹 P5 状态 A
- 「找不到二维码？」→ 弹 P5 状态 B

**需要的数据**：
- 扫到 code 后查点位 → `db.points.where('code').equals(scannedCode).first()`
- 校验是否当前应找的点位（防跳站）：比对该点位 order 是否 == session.currentPointIndex

---

### P5. 扫码弹窗集合（05-code-input.png，4 状态）

> 全部叠在扫码界面上的弹窗/toast。

**状态 A：扫不出？输入数字码**
- 6 格数字输入 + 取消/确定
- 输对 → 进入 P6 本站答题；输错 → toast「码不对哦，再看看二维码下面的数字」（不算错误）
- 数据：输入码查 `db.points`，比对是否当前点位

**状态 B：找不到？请家长输入**（橙色，家长语境）
- 标题「请家长输入」「二维码找不到了？请爸爸妈妈输入这一站的 6 位数字码」（小字「在打印纸或电脑端可以查到」）
- 6 格数字输入 + 取消/「确定」按钮
- 输对 → **进入本站答题**（与状态 A 行为一致）；输错 → 提示「家长再仔细看下数字」重输
- 与状态 A 的唯一差别：标题措辞 + 橙色（家长语境）+ 验错文案
- 数据：输入码查 `db.points`，比对是否当前点位

**状态 C：扫到不对的站**（toast，橙）
- 「这不是你现在要找的点哦！现在要找的是「第 N 站」，再看看提示，找对的地方～」
- 触发：扫到的 code 属于本探险其他点位
- 1.5-2 秒自动消失

**状态 D：扫到完全无效的码**（toast，粉红）
- 「这不是寻宝游戏的码哦，可能是别的二维码不小心扫到了」
- 触发：扫到的 code 在 points 表查不到
- 1.5-2 秒自动消失

---

### P6. 本站开始挑战页 + 答题页（06-question.png）

> 两屏。屏 1 扫码成功提示页；屏 2 真正的答题页。

**屏 1 开始挑战**
- 进度条「第 N 站 · M 站中的第 N 站」
- 提示卡片：本站扫码成功提示文本（= `discoveryText`，如「恭喜你找到第一站！请回答本轮的题目吧！」）
- 「开始挑战！」大按钮（绿）
- 操作：「开始挑战」→ 进入屏 2，记录 scannedAt
- 数据：当前 Point 的 `discoveryText`

**屏 2 答题页**
- 顶部：第 N 站 / 第 X/M 题 / 右上角「💡 求助 N」按钮（颜色突出）
- 题目卡片：学科 · 难度星 + 题干（大字，户外强光）
- 「🔊 朗读题目【V1】」（⚠️ V1，MVP 不实现）
- 选项区：A/B/C/D（2×2 布局，按钮够大）

操作：
- 点选项 → 判定对错 → 进入 P7 反馈
- 点「求助」→ 进入 P7 屏 3（求助确认）

需要的数据：
- 当前 Point 的 questionIds → 按 currentQuestionIndex 取当前题
- 题目详情 → `db.questions.get(questionId)`
  - 用到字段：`subject`、`difficulty`、`text`、`options`、`correctAnswer`
  - ⚠️ **不读**：`hint`、`explanation` 的展示时机见 P7
- session：`currentQuestionIndex`、`helpUsedCount`、`maxHelpCount`（求助按钮显示剩余次数 = max - used）

---

### P7. 答题反馈（07-answer-feedback.png，4 状态）

**屏 1 答对**：橙色大卡「🎉 答对啦！」，3 秒后自动进入下一题；答完本站所有题 → P8 拍合影
- 记分写入 session.pointRecords[].questionResults[]：`answerAttempts`、`usedHelp`、`score`
- 计分（CLAUDE.md §7 规则 7）：一次对=10 / 错1次后对=5 / 曾用求助=3 / 保底=0

**屏 2 答错**：深色卡「答案不正确，再思考一下吧 🫤」
- 第 1 次错后可显示题目 `hint`（PRD §6.3 hint = 答错时提示）
- 每题最多 3 次，第 3 次错 → 保底通过（score=0，answerAttempts=3）

**屏 3 求助确认**：蓝卡「确定求助爸爸妈妈吗？」+「确定！扣掉一次求助次数」「不用了，我再自己想想」
- 确定 → `helpUsedCount += 1`，本题 `usedHelp=true`，弹「快去问爸爸妈妈！」

**屏 4 求助次数用完**：蓝卡「已经没有求助次数咯，自己再思考一下吧！」
- 触发：helpUsedCount >= maxHelpCount 时点求助

需要的数据：session 计数字段 + 当前题 `hint`/`correctAnswer`

---

### P8. L2 通关拍合影 + 继续扫码（08-photo-capture.png，3 状态）

**状态 1：拍合影选择**
- 「🎉 这一站答对啦！」+ 点位名 + 「拍张合影留个纪念吧？通关后能看到所有合影哦」
- 「📷 拍合影留念」大按钮（绿）+「跳过这一站合影」
- 操作：拍照 → 状态 2；跳过 → 直接到状态 3（completionPhotoId 留 null）

**状态 2：拍照后预览**
- 显示刚拍的合影 + 「💡 长按图片保存到系统相册吧」+「下一步 →」
- 操作：「下一步」→ 写入 photos 表 + 状态 3
- 数据：拍照 blob → `db.photos.add({type:"completion_photo", ownerId:pointId, ...})`，回写 pointRecords[].completionPhotoId

**状态 3：继续扫码触发页**（⭐ v1.7 关键修订）
- 「第 N/M 站 完成」+ 「准备好找下一站了吗？」+ 下一站提示卡片 + 「📷 继续扫码找下一站」大按钮（橙）
- ⚠️ **关键技术约束：不自动启动摄像头**，等用户点按钮才调 getUserMedia（iPad Safari 摄像头 API 不稳定，自动重启易黑屏）
- 操作：点按钮 → currentPointIndex+1 → 回 P4 扫码（若已是最后一站 → P9 通关页）
- 数据：下一站提示 = 下一个 Point 的 locationHint

---

### P9. 通关庆典页（09-victory.png）

> MVP 极简版（V1 扩展成多屏 + 投票 + 颁奖）。

**显示**：
- 撒花 + 「🎉 通关啦！」+ 探险名
- 成绩卡：总分 / 战绩（本次答对 X/Y 题）/ 用时 N 分钟
- 「📷 这次的合影（N 张）」横向滑动（N = 实际拍照的 L2 数，跳过的不算）
- 「🏠 返回首页」按钮

**操作**：
- 「返回首页」→ 回 P1 启动页（不回探险选择页）
- session 标记 `status="completed"`（下次启动不再显示续玩横幅）

**需要的数据**：
- session 汇总：遍历 pointRecords 算总分、答对题数、用时（endedAt - startedAt）
- 合影：pointRecords[].completionPhotoId 非 null 的 → `db.photos.bulkGet(...)`
- 探险名 → `db.levels.get(session.levelId).name`
- 注意：撒花用 CSS animation / emoji，别引粒子库；合影横滑用 overflow-x:scroll，别引复杂库

---

### P10. 设置 / 导入数据页（10-settings.png）

**显示**：
- 标题「设置」+ 返回
- 「当前数据」卡：N 个探险（共 M 个点位）、X 道题目、上次导入时间
- 「导入数据」区：「📁 导入并覆盖整个数据库」按钮 +「📁 导入单个 L1 探险」按钮（⚠️ 后者 V1，MVP 不实现）
- 整库导入二次确认弹窗：「导入会完全替换当前所有探险和题库，如果有正在进行的游戏，进度也会清除」+ 确定/取消
- 「怎么把电脑上的 JSON 文件传到 iPad？」教学（AirDrop / 邮件微信 / iCloud Drive，详见 docs/iPad同步说明.md）
- 「其他」：清除所有数据【V1，不实现】、关于 · 版本 1.0

**操作**：
- 「导入并覆盖整个数据库」→ 选文件 → 校验 schemaVersion==="1.0" → 二次确认 → 清空 levels/points/questions（+ 清未完成 session）→ 整库写入
- 「导入单个 L1」→ ⚠️ MVP 不实现（按钮不显示或置灰）

**需要的数据**：
- 当前数据统计 → `db.levels.count()` / `db.points.count()` / `db.questions.count()`
- 导入：解析 JSON Envelope（同编辑端 A7），写入 play 端三张表

---

## 游戏端已定决策（备注）

1. **续玩恢复粒度 = 题级**：续玩恢复到上次中断的那道题（用 session.`currentQuestionIndex`），不是只恢复到站级。
2. **locationHint 语义 = 找到本站**：第 N 个 Point 的 locationHint 就是去找第 N 站的提示（含第 1 站）。字段名已从历史的 nextHint 改为 locationHint，避免理解反。
3. **「找不到二维码」= 家长输码后进入本站答题**，不是跳过（MVP 不做真跳过，应急通关裁判模式在 V2）。线框图 05 状态 B 已修订一致。
4. **摄像头不自动启动**：所有需要开摄像头的场景（P4 扫码、P8 状态 3）都必须等用户点按钮才调 getUserMedia。
