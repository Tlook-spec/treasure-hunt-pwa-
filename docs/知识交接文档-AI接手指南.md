# 知识交接文档 —— AI 工具接手开发指南

> **写给谁**：任何接手本项目继续开发的 AI 编程助手（或人类开发者）。
> **写作时间**：2026-07-14，当时项目处于 V1 D 区收官阶段（V1-31 联调中）。
> **怎么用**：先通读本文档建立全貌，再按 §2 的顺序读其他文档，然后才动代码。
> **最重要的一句话**：这是一位**零基础家长**为自己孩子做的真实生活工具，不是技术练习。一切决策以「简单、能用、别把孩子玩的版本搞坏」为最高原则。

---

## 1. 项目是什么

**寻宝游戏 PWA**：一个双站点的儿童户外解谜游戏。

- 家长在电脑浏览器上用**编辑端（admin）**设计探险：若干个物理打卡点（贴二维码），每个点绑几道题
- 孩子拿 iPad 在户外玩**游戏端（play）**：看提示找站 → 扫码 → 答题 → 拍合影 → 下一站 → 全部通关后看成绩/领奖/生成海报
- 数据通过 **JSON 文件**或 **GitHub Secret Gist 云同步**从编辑端传到游戏端，游戏端是完整离线 PWA（户外没网也能玩）

**用户画像**：
- 开发者/维护者：孩子的家长，**完全零基础**，每天 1-2 小时，Windows 11 + VS Code + AI 助手
- 玩家：4-12 岁儿童，单人或多人组队（合作式，共享总分）

**项目状态**（截至本文档写作时）：MVP 已完成并真实户外验证通过；V1 的 A/B/C 区全部完成，D 区（轻量多人）功能完成、待 V1-31 真机联调验收；之后是 E 区真机验收（V1-32~35）。实时状态**永远以 `docs/PROGRESS.md` 为准**。

---

## 2. 文档地图（按阅读顺序）

| 顺序 | 文档 | 作用 | 什么时候读 |
|------|------|------|-----------|
| ① | `CLAUDE.md`（仓库根目录） | **最高优先级**。项目约定、技术栈锁定、禁止事项、业务规则 22 条、协作风格 | 每次开始工作前，必读 |
| ② | `docs/PROGRESS.md` | 当前进度、已发版记录、每个 CACHE_VERSION 对应改了什么 | 每次开始工作前，必读 |
| ③ | `docs/PRD.md` | 完整产品需求（数据模型 §6、视觉规范 §5.2、业务规则细节） | 做功能前查对应章节 |
| ④ | `docs/任务清单_V1.md` | V1 阶段任务分解（V1-01~35，含每个任务的验收标准） | 做 V1 编号任务时 |
| ⑤ | `docs/双分支发布说明.md` | dev/release 双分支部署原理和操作命令 | 推送发版前 |
| ⑥ | `docs/外观微调操作文档.md` | 零基础向的 UI 微调手册（哪个文件哪一行改什么），含「孩子会看到的页面一览」 | 用户要求调外观时 |
| ⑦ | `docs/test-checklists/*.md` | 每个功能块的手动测试清单（项目不写自动化测试，这就是测试资产） | 改到对应功能时参照回归 |
| ⑧ | `docs/存储&清理说明.md` | IndexedDB 照片存储与清理逻辑 | 动照片/存储相关代码时 |
| — | `docs/archived/`、`docs/MVP docs/` | 历史归档，一般不用读 | 考古时 |

**约定**：每完成一个任务要更新 `PROGRESS.md`；每完成一个功能块要在 `docs/test-checklists/` 写一份手动测试清单（模板见 CLAUDE.md §5.7）。

---

## 3. 技术方案（已锁定，不要动摇）

### 3.1 技术栈

- **纯 HTML + CSS + JavaScript（ES Module）**，没有任何框架、没有打包工具、没有 TypeScript、没有 npm 依赖
- 第三方库全部走 **CDN + 固定版本号**（jsdelivr），由 Service Worker 动态缓存实现离线：
  - Dexie 3.2.4（IndexedDB 封装）、html5-qrcode 2.3.8（扫码）、qrcode-generator 2.0.4（生成二维码）、PapaParse 5.4.1（CSV）、pinyin-pro 3.18.2（拼音标注）、Eruda 3.0.1（`?debug=1` 时加载的移动端调试台）
- CDN 库用普通 `<script>` 加载挂在全局（`Dexie`、`Papa`、`qrcode`……），自己的 ES Module 里**直接用全局名**，绝不写 `import Dexie from 'dexie'`（没有打包器，会直接报错）。HTML 里库的 `<script>` 必须放在 `<script type="module">` 之前
- 部署：GitHub Pages + GitHub Actions（见 §5）

### 3.2 明确禁止（CLAUDE.md §11 的浓缩，改代码前过一遍）

- ❌ React/Vue/Svelte、Tailwind/Bootstrap、TypeScript、任何付费服务
- ❌ CDN 版本号写 `@latest`（会导致离线缓存漂移失效）
- ❌ jsPDF（用 `window.print`）、HMAC、UUID v4（用短 ID）、JSZip（图片 base64 直接进 JSON）、jschardet
- ❌ 手写 Service Worker 的 FILES_TO_CACHE 全量清单（预缓存列表 + 动态缓存混合策略已定型）
- ❌ admin 读写 play 的数据库、play 读写 admin 的数据库、任何两端直接传数据的代码（必须 JSON 中转）
- ❌ 一次写 500+ 行新代码、主动重构、动非当前任务范围的代码
- ❌ 已明确永不做的功能：朗读（拼音标注≠朗读，拼音允许）、PDF 批量打印、JSON 智能合并、回收站、admin 端密码保护、拖拽排序、CSV 编码自动检测

### 3.3 代码风格

- 简单直白，多写**中文注释**；变量名宁长勿短；函数尽量 20-30 行、单一职责
- 文件名小写短横线；函数驼峰；类大驼峰；常量全大写下划线
- git commit **单行英文**（PowerShell 下多行中文 commit 会乱码）
- **和用户沟通永远用中文**，打比方解释，不堆术语；报错时给「按 F12 → 截图给我」这类可操作指引；大改动先讨论、多方案先列选项

---

## 4. 站点架构与数据模型

### 4.1 仓库结构

```
treasure-hunt/
├── admin/            # 编辑端（普通网页，非 PWA）：hash 路由单页，pages/ 下是 fragment
│   ├── index.html    # 骨架 + 路由（scripts/router.js 动态 fetch pages/*.html 注入）
│   ├── pages/        # levels.html(L1/L2管理) questions.html(题库) import-export.html(导入导出+云发布) print-qr.html print-cheatsheet.html map-marker.html
│   └── scripts/      # 每个页面对应一个 js 模块
├── play/             # 游戏端（完整 PWA）：每个页面是独立 HTML（非 SPA）
│   ├── index.html    # 启动页；manifest.json；service-worker.js（预缓存清单+动态缓存）
│   ├── pages/        # select-level → start-level → hint → scan → quiz → photo →（循环）→ victory；settings（家长用，有密码锁）
│   └── scripts/      # scan-verify.js quiz-logic.js map-overlay.js
├── shared/           # 两端共享：db/（db-config.js 隔离拦截 + admin-db.js + play-db.js）、utils/（id.js code-generator.js json-io.js reference-check.js）、models/types.js（JSDoc 类型）、version.js（BUILD_TAG）
├── docs/             # 全部文档（见 §2）
└── .github/workflows/deploy-pages.yml   # 双分支部署流水线
```

### 4.2 三层数据结构

```
L1 探险(Level) → L2 点位(Point，1个二维码+多道题，外键 levelId) → L3 题目(Question，被 Point.questionIds 数组引用)
另有：GameSession(游戏会话，含 pointRecords/players/teamName)、PhotoBlob(头像+合影)、JSON Envelope(导出外层)
```

字段定义看 `shared/models/types.js`（JSDoc，和 PRD §6 对应）。关键点：

- **短 ID**：`lvl_xxx_yyy` 格式（时间戳 base36 + 4 位随机，见 `shared/utils/id.js`），一旦生成永不变，是跨设备 JSON 同步判重的基础
- **6 位数字码**（Point.code）：扫码和手动输入共用一个码；**唯一性范围是「同一探险内」**（2026-07-09 起，为了让打印好的二维码可以跨探险复用）；play 端 `scan-verify.js` 的 `resolveCode` 是「先取本探险所有点位，再在其中按码匹配」——**千万别改回全库按码查**，会撞码
- **usedCount 字段已遗留**：题目使用次数一律实时扫描所有 Point.questionIds 计算，不读不写该字段
- **删除引用保护**：被点位引用的题目不能删；删 L1 级联删其 L2（不动题库）
- **地图坐标 mapX/mapY 存 0~1 小数**，渲染时 ×100 转百分比，锚点是图标中心（`translate(-50%,-50%)`）。admin 标记器和 play 渲染必须一致——曾经踩过 play 直接当百分比用把标记钉到角落的坑
- **schemaVersion**：当前 "1.1"，校验规则是「主版本号为 1 即接受」（`shared/utils/json-io.js` 的 `validateJson`）
- **不做 snapshot**：session 直接引用当前 L1 数据；导入前检查未完成游戏并二次确认

### 4.3 两端数据库物理隔离（红线）

- admin 用 `treasure-hunt-admin-db`，play 用 `treasure-hunt-play-db`（两端同源部署，同名会串数据）
- `shared/db/db-config.js` 的 `assertDbContext()` 在模块加载时按 URL 路径拦截：admin 路径开 play 库直接抛错，反之亦然
- 新增任何 IndexedDB 访问都必须经由 `shared/db/admin-db.js` 或 `play-db.js` 的现成实例

### 4.4 核心业务规则速记（完整版在 CLAUDE.md §7）

- 顺序解锁，按 L2 顺序扫码；扫错站提示「这不是你现在要找的点」
- 答错容错：每题最多 3 次，第 3 次错保底通过（0 分）；计分 10（一次对）/ 5（错过再对）/ 3（用过求助，覆盖一切）/ 0（保底）
- 求助 3 次/局，按钮在答题页右上角
- 每 L2 通关拍一张合影（可选不阻塞）；拍完点按钮回扫码，**不用自动倒计时**
- 多人（V1）是合作式：开局建玩家+队名，答题流程与单人完全相同，全队共享总分，通关给整队颁一枚奖（Level.groupAwardName/Image，空走默认）；**单人也显示同一枚奖**
- 「找不到？」按钮 = 家长帮忙输码，行为与输码相同；MVP/V1 没有真跳过（裁判模式在 V2）

---

## 5. 部署与发版（最容易出事的环节，仔细读）

### 5.1 双分支双部署

| 分支 | 部署到 | 谁用 | 网址 |
|------|--------|------|------|
| `main` | `/dev/` 子目录 | 开发测试（PWA 名「寻宝-DEV」橙图标，部署时 sed 注入，不进源码） | `https://tlook-spec.github.io/treasure-hunt-pwa-/dev/play/` |
| `release` | 网站根目录 | **孩子玩的稳定版** | `https://tlook-spec.github.io/treasure-hunt-pwa-/play/` |

工作流 `.github/workflows/deploy-pages.yml`：任一分支推送都会**重新组装整站**（checkout 两个分支，release 放根、main 放 /dev）。concurrency 设置为 `cancel-in-progress: true`。

### 5.2 标准发版节奏

1. 在 `main` 上开发，改动涉及 `play/` 任何文件 → `play/service-worker.js` 的 `CACHE_VERSION` 小数 +0.01（当前已到 v2.40，实时以文件为准）
2. 每次推送前更新 `shared/version.js` 的 `BUILD_TAG`（格式「改动描述 · 日期」，用户在 iPad 设置页靠它确认跑的是新版）
3. `git push` main → dev 网站更新 → 用户/自己在 dev 验收
4. 发给孩子：`git checkout release && git reset --hard main && git push --force-with-lease && git checkout main`（release 是纯发布镜像，没有独立提交，reset --hard 是约定做法）
5. 用户说「帮我推 GitHub」= 只推 main；「帮我发版给孩子」= main + release 都推

### 5.3 部署踩过的坑（真实发生过）

- **双推竞态**（2026-07-10）：main 和 release 前后脚推送，第一条流水线开跑时 release 还是旧代码，把「根目录=旧 / dev=新」部署了上去，且后续本应覆盖的流水线没有生效——结果 git 记录和 Actions 全是绿的，但 release 网站内容是旧的。**核实部署是否真正生效，不要只看 Actions 状态，要 curl 线上文件对版本号**：
  ```
  curl -s https://tlook-spec.github.io/treasure-hunt-pwa-/play/service-worker.js | grep CACHE_VERSION
  ```
  修复办法：等两分支一致后推一个空提交触发干净的单次部署
- **GitHub Pages CDN**：`Cache-Control: max-age=600`，部署成功后线上最多再滞后 10 分钟
- **iPad 拿新版的完整条件**：CACHE_VERSION 升过 + 联网打开一次 App + 从后台彻底划掉重开。只在飞行模式开 App 永远收不到更新
- Actions 列表里 main 的 run 显示 `cancelled` 是正常现象（被 release 的 run 通过 concurrency 顶掉了，最终部署以成功的那条为准）

---

## 6. 重点功能的实现位置与注意事项

### 6.1 云同步（Secret Gist，2026-07-09 上线）

- **admin 发布**：`admin/pages/import-export.html` 区块 D。用户的 GitHub Fine-grained token（只勾 Gists 读写权限）+ Gist ID 存 localStorage（`th-admin-gist-token` / `th-admin-gist-id`）；首次发布 POST 创建 Secret Gist，之后 PATCH 更新同一个；文件名固定 `treasure-hunt-data.json`
- **play 拉取**：`play/pages/settings.html` 区块 B2。只需 Gist ID（读 Secret Gist 不要 token），走现有 `validateJson + importFull`
- **已修过的 bug，别改回去**：① 含图片的整库 JSON 常超 1MB，GitHub API 的 `content` 字段会被**截断**——所以 play 端**一律从 `raw_url` fetch 完整内容**（gist.githubusercontent.com 支持 CORS）；② Gist 里可能混有用户手建的占位文件——按文件名优先选 `treasure-hunt-data.json`，不能盲取第一个
- Secret Gist 的安全模型 =「凭链接访问」：不公开列出，但拿到 ID/链接就能读。对本项目的数据敏感级别（题目+地图图）可接受；合影和头像存 PhotoBlob **不进** JSON，不会上云

### 6.2 游戏端设置页密码锁（2026-07-09 上线）

- `play/pages/settings.html`：密码的 djb2 哈希存 localStorage（`play-settings-pwd`），设过密码则进页先弹全屏锁
- 忘记密码 → 「家长算术验证」：两位数×两位数乘法题答对即可免旧密码重设（纯离线，无后端）
- 定位是「挡孩子误入」不是安全防护；**localStorage 按 PWA/浏览器上下文隔离**——要在孩子实际用的那个入口（主屏图标）里设置才有效
- 注意：CLAUDE.md 禁的是「**编辑端**密码保护」，游戏端设置锁是用户明确要求的另一件事，不冲突

### 6.3 Service Worker（`play/service-worker.js`）

- 预缓存清单（PRECACHE_URLS，列自己的页面/JS）+ fetch 动态缓存（stale-while-revalidate，CDN 库靠它）双层策略
- **新增/重命名 play 下的页面或 JS 文件时**：加进 PRECACHE_URLS + 升 CACHE_VERSION
- 本地调试时 SW 缓存经常捣乱：改了代码浏览器看不到 → 先 unregister SW + 清 caches 再刷新（写自动化测试脚本时尤其注意）

### 6.4 二维码 / 数字码

- 生成：`shared/utils/code-generator.js`；admin 点位表单可手填（复用旧打印件场景），校验 6 位数字 + 同探险内唯一（`admin/scripts/point-form.js`）
- 复制点位/复制探险也会生成新码（`point-list.js` / `level-form.js`）——这两处目前仍是全库查重（偏保守，无害），改动时知道即可
- 打印：`admin/pages/print-qr.html`（SVG 二维码，@media print 每页 4 张）、应急小抄 `print-cheatsheet.html`

### 6.5 图片处理约定

- 全部走 Canvas 压缩为 JPEG base64 直接进数据（封面/提示图/奖图长边 ≤800、地图 ≤1600、拍照 ≤1280 quality 0.7），**没有也不要引入 zip/独立文件方案**
- admin 封面裁剪滑块存 `Level.coverPosition`（object-position 字符串）；**预览框比例必须贴近孩子端真实横幅**（曾因预览框太方导致纵向滑块看似失灵，2026-07-09 修为 200×56）
- 海报合影裁剪偏顶部（`victory.html` 里 `TOP_BIAS = 0.2`），因为合影人脸在画面上半部分，纯居中会切头

### 6.6 测试策略

- **零自动化测试**，唯一标准 = 手动清单 + 真机三态：iPad Safari（有网）/ PWA 主屏图标（有网）/ PWA 飞行模式。三态任一失败就不算过
- 「local 草稿 / iPad 验收」分档表见 CLAUDE.md §5.7：纯 UI 逻辑可以电脑迭代，扫码/拍照/离线/续玩必须真机
- 开发时可用浏览器自动化（本地起静态服务器 + 操作 IndexedDB 造数据）做冒烟验证，但**不能替代真机三态**，报告里要如实区分「已自动化验证」和「待真机验收」

---

## 7. 协作注意事项（和这位用户合作的经验）

1. **永远用中文回复**。用户偶尔切模型后 AI 飘成英文，会被提醒
2. **改完必须真的推送**。曾发生「改完说了推送但实际没推」导致用户在网站上看不到改动——commit + push + 必要时 curl 线上核实，闭环再汇报
3. **每次推送 = CACHE_VERSION + BUILD_TAG 双更新**（play 有改动时）。用户靠设置页 BUILD_TAG 判断版本，漏了会造成「更新失败」的误会
4. 用户会拿 iPad 实测并回报体验问题（例如「孩子对故事无感、更爱找站扫码」「题目太简单」）——这类反馈很宝贵，回应时优先给**零代码的内容层方案**（改提示文案写法、出观察题），其次才是开发新功能
5. 汇报风格：先说结论，再讲原因；给用户的操作指引要具体到「点哪里、看什么字段」；多方案让用户选，别自作主张做大改动
6. 遇到用户说「我快疯了/完全不懂/想放弃」或连续报错 3 条：停下技术工作，温和引导，必要时建议今天到此为止（CLAUDE.md §12）
7. Windows 环境：终端命令给 PowerShell 语法；git commit 单行英文；文件路径注意中文文件名（docs 下大量中文名文档是正常的）

---

## 8. 当前待办与后续路线

- **进行中**：V1-31 D 区联调 + 真机三态验收（多人流程全链路）
- **之后**：E 区 V1-32~35（真机验收收尾）；V1-22 题目插图暂缓
- **云同步成功路径**尚未用真实 token 完整走通过（用户配置过程中，报错路径已验证）——如果用户反馈云同步问题，先看 `docs/test-checklists/云同步-SecretGist.md`
- **V2 池子**（都不要提前做）：应急通关裁判模式、答题归属/个人积分/答题之星/投票颁奖、碎片收集玩法正式化等
- 游戏体验优化建议（2026-07-14 讨论，用户尚未逐一拍板）：故事留空、谜语式找站提示、现场观察题、每站多题/高难度题、破纪录计时对比等——动手前和用户确认

---

## 9. 快速自检清单（接手后第一天）

- [ ] 读完 CLAUDE.md 全文 + PROGRESS.md 当前状态
- [ ] 本地起静态服务器（如 `python -m http.server 8080`），打开 `/admin/index.html` 和 `/play/index.html` 走一遍主流程
- [ ] 确认理解双分支发版流程（§5.2），知道「孩子玩的是 release」
- [ ] 确认理解「改 play → 升 CACHE_VERSION + BUILD_TAG」的铁律
- [ ] 翻一遍 `docs/test-checklists/` 目录，知道每个功能块的回归清单在哪
- [ ] 记住三条红线：两端数据库隔离、不引框架/打包器、不做已明确砍掉的功能
