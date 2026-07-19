# 项目进度记录

> 每完成一个任务后更新这里。新对话开始时先读本文件。
>
>  **当前版本**：v1.9.4（对应 CLAUDE.md v1.9.4）

---

## 当前状态

**阶段**：🟥 **V1 D 区 进行中**（C 区 V1-21~26 全 ✅；D 区 V1-27 多人队伍创建 ✅、V1-28 编辑端 L1 小组奖配置 ✅、V1-29 多人庆典+小组颁奖 ✅、V1-30 多人字段兼容收口 ✅；UI/暖色配色改版 ✅）。下一步 V1-31 D 区联调 + 真机三态验收（D 区收官）。

**部署**：**双分支双部署**（2026-06-22）——`release`→网站根目录（孩子玩的稳定版），`main`→`/dev/`（开发版「寻宝-DEV」+ 橙图标）。GitHub Actions 自动部署。详见 [双分支发布说明.md](双分支发布说明.md)。
**已发版**（均 main/release 双推，孩子联网开一次 App 即更新缓存）：
- 2026-06-25：V1-27 多人创建 + UI/暖色配色全套改版（v2.28）→ V1-29 多人庆典+小组颁奖（v2.29）
- 2026-06-25：UI 微调（提示图限高 / 列表图标调大 / 海报绿勾，v2.30）；V1-28 编辑端小组奖配置（纯编辑端不升 SW）；V1-30 兼容收口（纯注释不升 SW）
- 2026-06-27：**play 设置页「🧹 清理游玩垃圾」按钮**（删孤儿头像+合影，保留探险/未完成存档/在用合影）+ 当前数据加「📷 张照片」统计（CACHE_VERSION **v2.31**）。详见 `docs/存储&清理说明.md`
- 2026-06-27：**封面图裁剪位置**（V1-31 联调反馈）——admin 封面区加横向/纵向滑块 + 双预览（横幅/方块），存 `Level.coverPosition`（object-position），play 列表缩略图/开始页横幅套用，避免人脸被裁掉（CACHE_VERSION **v2.32**，level-form.js?v=V1-31）
- 2026-06-27：**单人通关也颁奖**（V1-31 联调反馈）——之前小组奖仅多人显示，现单人通关也显示同一枚奖「🎉 你 获得【奖名】！」（无队名/头像排），多人维持队名+头像；victory.html prepareAwardSection 单人/多人共用（CACHE_VERSION **v2.33**）
- 2026-06-27：**通关页布局调整**（V1-31 联调反馈）——① 去掉「通关啦」上方的 🏆 ② 删掉颁奖卡上方重复的队名+队员展示区 ③ 结局故事文案移进颁奖卡（奖图下方、获奖文字上方）（CACHE_VERSION **v2.34**）
- 2026-07-09：**二维码跨探险复用 + 云同步 + 三处 UI 修复**（commit `1c570fe`，main/release 已同步推送）：二维码方案 A（v2.36）、Secret Gist 云同步（v2.37）、admin 封面纵向滑块 + 海报合影顶部偏向裁剪 + 队名输入框样式（v2.38）
- 2026-07-09：**云同步 JSON 解析 bug 修复 + 游戏端设置密码锁**（v2.39，commit `fa7fdf4`，main/release 已同步推送）：修复大文件/多文件导致的「不是有效 JSON」；设置页加访问密码锁（防孩子误入）
- 2026-07-19：**云同步防缓存 + 显示导出时间 + 首页文案微调**（v2.44）：修复「在线更新显示成功但拉到上一次旧 JSON」——根因是 GitHub 的 gist API 和 raw_url 都有 CDN 缓存，play 端拉取时没绕过；现给两个请求都加 `?_cb=时间戳` + `cache:'no-store'`（`settings.html`）。同时 `validateJson` 返回值加 `exportedAt`（`json-io.js`），在线更新的确认弹窗和成功提示里显示「云端数据导出于 YYYY-MM-DD HH:mm」，让家长核对拉到的是不是刚发布那次。另：首页副标题改「和小伙伴们一起去探险吧」。**双分支发布说明补了「改完必须先 commit」的血泪教训**（用户 2026-07-19 因跳过 commit + reset --hard 丢过一轮改动，靠 VS Code 本地历史找回）。
- 2026-07-17：**首页藏宝图换成插画图片 + 两份文档更新**（v2.42）：首屏原 CSS 画的圆徽章（`.emblem`）换成真实藏宝图插画 `play/assets/images/treasure-map.jpg`（Gemini 生成图，PIL 压到 640px/~100KB，加进 SW 预缓存），`index.html` 用 `<img class="treasure-map-img">`；同步更新 `docs/外观微调操作文档.md`（顶部记录补 v2.41 换肤 + v2.42 首页图、声明配色已换羊皮纸方案A旧色值过时、§0.5 首屏行、新增 §1.6 换首页图指引）和 `docs/知识交接文档-AI接手指南.md`（顶部视觉现状、§6.5 两类图区分、版本号）。测试清单沿用换肤那份。
- 2026-07-15：**方案A「羊皮纸藏宝图」全站换肤**（v2.41）：参考 claude.ai/design「儿童寻宝探险游戏」方案A，游戏端全面换肤——`main.css` `:root` 换羊皮纸调色板（底 #FCF4DC/深褐字 #3A2E22/米金边框 #EADBB5），按钮全改「渐变+3D底阴影+药丸圆角」（橙 EC9646→DA7530/绿/金三色系）；首屏重做（字标+藏宝图圆徽章+航线红X）；探险列表改两列封面卡网格；答题页白卡包题干+ABCD米金方块；扫码页深蓝底+青绿取景四角；通关页橙色放射庆典横幅+CONGRATULATIONS。偏差：不引 Google Fonts（守系统字体约定）、不实现设计稿中数据模型没有的难度星/锁定关卡、地图图钉沿用现有三态。全页面已用浏览器计算样式断言验证（截图通道当时故障，视觉走查待 dev 网址人工确认）。测试清单：`docs/test-checklists/羊皮纸换肤-方案A.md`
- 2026-07-10：**找站体验优化 + 多人卡片紧凑化**（v2.40）：hint 提示文字加大/加深色 + 提示图点击放大 + 步进条藏宝图化（💎/📍）；scan 扫码成功加全屏闪光+星星迸发；start-level 多人队员卡两列并排、色块/输入框更紧凑。详见下方「本次会话新增（第三批）」
- （更早 2026-06-24：v2.26 含 V1-21~25）

**本次（2026-06-25）随 V1-27 一起发版的「非编号」UI 改动**：
- L1 封面图（`coverImage`）+ L2 提示图（`hintImage`）：admin 上传、孩子端列表/开始页/提示页展示
- 游戏端全局换 **V0 暖色系**（橙 `#E0772F` 主 / 青绿 `#3FAEB8` / 金 `#E8B43C` / 暖米底 `#F4EAD5` / 近白米卡片）；admin 未改
- 地图三态图标重做：未到=灰圆编号（不显站名）/ 已发现=红图钉 / 已完成=绿勾
- start-level 单屏化 + 队员卡片重设计（编号不重复校验）；hint 站点步进条 + 「前往第 X 站」+ 取消顶进度条
- 答题进度+总分条、过关「本站得分」、通关 3 格 + 海报暖白化
- 修复：未到标记不显示站名、手动输码绿勾完整覆盖、地图 FAB 暖白底

**本次会话新增（非编号，已提交并双推 main/release，commit `1c570fe`，2026-07-09）**：
- **二维码跨探险复用**（方案 A）：admin 点位表单数字码从「全库自动生成不可改」改为「可编辑，默认自动生成」，唯一性检查收窄到「同一探险内」；play 端 `resolveCode` 改为「先定位本探险点位，再按码匹配」，修掉了旧逻辑潜在的跨探险撞码 bug。家长可把打印好的二维码在新探险里手填复用，环保不用重印。CACHE_VERSION **v2.36**。测试清单：`docs/test-checklists/二维码跨探险复用.md`
- **云同步（Secret Gist，替代 AirDrop）**：admin 端「导入导出」页新增「☁️ 发布到云端」，用 GitHub Personal Access Token 把整库 JSON 发布/更新到一个 Secret Gist；play 端「设置」页新增「☁️ 在线更新」，粘贴 Gist ID（无需 token）即可拉取最新数据并走现有 validateJson+importFull 流程。CACHE_VERSION **v2.37**。⚠️ 成功路径需真实 GitHub token 才能完整验证，本次只验证了报错路径，**首次使用请务必按测试清单走一遍成功路径**。测试清单：`docs/test-checklists/云同步-SecretGist.md`
- 同时修正两处过期文档：CLAUDE.md §8 状态同步到 V1-30 已完成；`shared/models/types.js` 里 mapX/mapY 注释（百分比→0~1 小数）、usedCount 注释（只增不减→实时计算已遗留）
- **admin 封面裁剪「纵向」滑块修复**：`levels.html` 的「开始页横幅」预览框原来是 200×112（1.786:1，比较方），和孩子端真实横幅（`calc(100% - 32px)` 宽 × 170px 高，iPad 上约 3.5:1，很扁很宽）比例差太多，导致大多数照片在预览框里几乎没有纵向裁剪空间可调——纵向滑块看着像"没反应"，实际是预览形状不对。改成 200×56（约 3.57:1，贴近真实横幅）后纵向滑块生效明显。
- **成就海报合影裁剪偏向顶部**：`victory.html` 海报里的合影原来强制按 16:9 纯居中裁剪，人是站着拍的、脸多半在画面上半部分，纯居中容易把头顶切掉；改成纵向裁剪时只从顶部切 20%、从底部切 80%（`TOP_BIAS = 0.2`），大幅降低切到脸的概率。（同样用居中裁剪的 `.photo-thumb-img` 合影缩略图墙未改，如有需要可另提。）
- **队名输入框样式**：`start-level.html` 的队名输入框原来是纯浏览器默认样式（细高、贴卡片全宽），改成 180px 定宽 + 加高内边距 + 暖色主题圆角边框，同时字号设为 16px 避免 iOS 聚焦自动放大。
- CACHE_VERSION 已推进到 **v2.38**

**本次会话新增（第二批，2026-07-09，含 bug 修复 + 密码锁）**：
- **云同步「不是有效 JSON」bug 修复**（v2.39）：根因有二——① 含图片的整库 JSON 常 >1MB，GitHub API 的 `content` 字段被截断成半截字符串导致解析失败；② play 端旧代码 `Object.values(gist.files)[0]` 盲取第一个文件，家长若曾手动建占位 Gist 会混进别的文件被选错。修复：一律从 `raw_url` 取完整内容（已验证 gist.githubusercontent.com 支持跨域 fetch，不受 1MB 截断限制），并优先选 `treasure-hunt-data.json` 文件；顺带去 BOM + 解析失败时 console 打印前 200 字符便于诊断。`play/pages/settings.html`。
- **游戏端设置页访问密码锁**（v2.39）：设置页有整库导入/清理照片等危险操作，加一道锁防孩子误入。设过密码后进设置页要先输密码（`localStorage` 存 djb2 轻量哈希，非加密级，只挡小孩）；锁屏有「← 返回游戏」让误入的孩子能退出；页内可用旧密码「修改密码」或「取消密码保护」；**忘记密码**用「家长算术验证」（两位数×两位数）答对后重设，无需后端/邮箱、纯离线。全部流程已用浏览器自动化验证。⚠️ 注意 localStorage 按 App 上下文隔离，家长要在孩子实际用的 PWA 图标里设密码。测试清单：`docs/test-checklists/设置密码锁.md`。（注：CLAUDE.md §11.3「不做编辑端密码保护」指的是 admin 端，本功能是 play 游戏端设置锁，属不同诉求，用户本次明确要求。）
- CACHE_VERSION 已推进到 **v2.39**

**本次会话新增（第三批，2026-07-10，游戏体验/UI 微调）**：
- **hint 页找站体验优化**（v2.40）：① `.hint-card-text` 字号 20→23px、`.hint-card-label` 颜色由低对比度的金色强调色改深褐正文色，暖米底+户外强光下更好认 ② 提示图片支持点击全屏放大（复用 victory.html 的 lightbox 写法，方便孩子看清局部细节找站）③ 站点步进条改「藏宝图」风格：已找到的站显示 💎、当前要去的站显示 📍，还没到的站仍显示数字方便数数（原来全是纯数字圆点）。`play/pages/hint.html`。
- **scan 页扫码成功加强反馈**（v2.40）：原来只有取景框绿光圈+✅弹出（0.85s），新增全屏径向闪光（0.5s）+ 10 颗星星⭐✨🌟从屏幕中心向外迸发（0.6s），纯 CSS+DOM 动画自动清理，不影响原有 850ms 后跳转答题页的节奏。`play/pages/scan.html`。
- **多人队员卡片紧凑化 + 两列并排**（v2.40）：`.player-cards-container` 由纵向堆叠改 `display:grid; grid-template-columns:1fr 1fr`，两个队员信息现在并排一行；配合把头像 76→52px、色块 32→22px（间距 10→5px）、输入框内边距/字号相应缩小，卡片整体更紧凑不显空旷。`play/pages/start-level.html`。全部改动已用浏览器自动化验证（点击色块/填名字/两列渲染/lightbox 打开关闭/步进条三态图标）。
- CACHE_VERSION 已推进到 **v2.40**

**下一个任务**：V1-31 D 区联调 + 真机三态验收（D 区收官），之后 E 区真机验收 V1-32~35。V1-22 题目插图【暂缓】。

详见：[任务清单_V1.md](../任务清单_V1.md)

---

## 已完成任务

### 阶段 0：环境搭建 + 技术验证（T01–T08）✅

- **T01** ✅ GitHub 账号注册 + 仓库 `treasure-hunt` 创建
- **T02** ✅ VS Code + Claude Code 安装配置（Windows 11）
- **T03** ✅ 项目初始化（Git 仓库 + .gitignore + README）
- **T04** ✅ Hello World PWA（manifest.json + Service Worker + 图标）
- **T05** ✅ 部署到 GitHub Pages，`https://tlook-spec.github.io/treasure-hunt/` 可访问
- **T06** ✅ iPad 添加到主屏幕，PWA 图标安装验证通过
- **T07** ✅ 扫码功能（html5-qrcode + Eruda 调试）— **iPad Safari PWA 模式真机验证通过**
- **T08** ✅ 架构调整：拆分为 `admin/` + `play/` + `shared/` 双站点结构

### 阶段 1：产品设计（T09–T13）✅

- **T09** ✅ 阅读并确认 PRD v1.7（`docs/PRD.md`）
- **T10** ✅ Excalidraw 线框图（`docs/wireframes/`）— admin 7 页 + play 10 页 + flow 图，共 17 张
- **T11** ✅ 页面数据字段清单（`docs/pages-data.md`）
- **T12** ✅ 视觉设计令牌（`docs/design-tokens.md`）— 主色 `#4A90E2`，字体/圆角/按钮尺寸全部定稿
- **T13** ✅ 阶段 0-1 总结里程碑（`docs/MILESTONE_0-1.md`）

---

## MVP 开发进度（M01–M30，待开始）

### 阶段 A：共享层

- **M01** ✅ CDN 链接验证（浏览器加载 5 个库全部通过；二维码库由 qrcode 换为 qrcode-generator@2.0.4）
- **M02** ✅ 数据模型（JSDoc types.js）+ 短 ID 生成（id.js）+ 6 位数字码工具（code-generator.js）
- **M03** ✅ IndexedDB 封装（db-config.js 常量+运行时拦截 / admin-db.js / play-db.js）
- **M04** ✅ JSON 导入导出工具（exportFull / validateJson / importFull，含事务原子性）
- **M05** ✅ 6 位数字码工具（已并入 M02，code-generator.js）

### 阶段 B：编辑端

- **M06** ✅ 编辑端骨架（index.html + hash 路由 + 左侧导航 + 响应式 + 3 个占位页）
- **M07** ✅ L1 探险 CRUD（卡片列表、新建/编辑弹窗、复制、级联删除、详情页）
- **M08** ✅ L2 点位 CRUD + 题目绑定（点位列表、编辑表单、上移/下移、选题面板、usedCount 递增）
- **M09** ✅ L3 题库 CRUD + 筛选（题目列表、新建/编辑表单、引用保护删除、复制、CSV 导出、筛选条；使用次数改为实时引用数计算）
- **M10** ✅ CSV 批量导入题目（模板下载、PapaParse 解析、预览前5行、从严逐行校验写入、失败详情显示；点位列表题目数改为实时计算排除已删题目；选题面板新增题干关键字搜索，与学科/难度叠加生效，复用 matchesQuestionFilter 共用函数；选题面板已选状态独立于筛选条件，换筛选不清空已选，「确认添加」按集合内所有 ID 添加）
- **M11** ✅ 单张二维码预览 + 下载（GIF）+ 全部二维码打印预览页（SVG，@media print，iPad 警告）
- **M12** ✅ 应急小抄打印（表格含序号/点位名/数字码/家长备忘，@media print A4 一页，iPad 警告）
- **M13** ✅ JSON 整库导入导出（导出下载、文件校验预览、二次确认弹窗、覆盖写入、成功/错误提示）
- **M14** ✅ 删除引用保护（findQuestionReferences 工具函数、有引用→拒绝弹窗带 bullet list、无引用→二次确认，按钮文字随场景切换）
- **M14+** ✅ 选题面板同探险去重：同 levelId 下其他点位已占用的题目灰掉+标注「已被本探险其他点位使用」；当前点位自己已选的题和跨探险引用均不受影响；复用 openPicker 中 db.points 查询逻辑，不另起一套平行扫描
- **M15** ✅ 编辑端联调测试

### 阶段 C：游戏端

- **M16** ✅ 游戏端 PWA 框架（动态缓存 SW）
- **M17** ✅ 启动页 + 探险选择页 + 设置页（play/index.html、play/pages/select-level.html、play/pages/settings.html）
- **M18** ✅ JSON 整库导入（游戏端）：validateJson + importFull + sessions 清空 + localStorage 时间戳
- **M19** ✅ 游戏主流程框架：start-level.html（创建 GameSession）+ hint.html（提示展示页）+ select-level.html 链接修正
- **M20** ✅ 扫码功能集成：scan.html（深色摄像头界面，点击启动）+ scan-verify.js（3 步验证逻辑）+ index.html 预加载 html5-qrcode CDN
- **M21** ✅ 数字码输入弹窗：resolveCode/goToChallenge 重构；孩子（蓝）+ 家长（橙）两种模式共用大键盘组件；输错停在弹窗重输，不回摄像头
- **M22** ✅ L2 内多题连答主流程：quiz.html 两屏（发现站点+答题）+ quiz-logic.js（startChallenge/submitAnswer placeholder：答对得10分，答错不记录）+ scan-verify 跳转改为 quiz.html
- **M23** ✅ 答题反馈 + 3 次容错 + 求助按钮：quiz-logic.js 正式版（checkAnswer/computeScore/recordQuestionResult/advanceQuestionIndex/consumeHelp）+ quiz.html 完整答题逻辑（抖动动画/保底通关绿色高亮/答对橙色卡/求助确认蓝色卡）+ iOS 音频解锁 + main.css 反馈区样式
- **M24** ✅ L2 通关拍合影 + 继续扫码：photo.html 三状态（拍照选择/图片预览/跳过提示）+ Canvas 压缩（长边1280px JPEG 0.7）+ photos 表写入 + pointRecord.completionPhotoId 回写 + 站号推进 currentPointIndex+1/currentQuestionIndex 归零 → hint.html；最后一站 → victory.html
- **M25** ✅ 极简通关庆典页：victory.html + 结算幂等（status=completed/endedAt 只写一次）+ 总分/用时/战绩计算 + 合影横向滚动 + 全屏查看 + CSS emoji 撒花 + SW 预缓存 victory.html（v2.3）
- **M26** ✅ 自动保存 + 续玩横幅：select-level.html 顶部查 in_progress 存档 → 横幅显示探险名/已到第N站 → 「继续」按 session 状态跳 hint/quiz/photo + 「放弃」二次确认删存档；main.css 续玩横幅样式

### 阶段 D：联调 + 真实测试 ✅

- ✅ M27 端到端联调
- ✅ M28 第一次真实户外测试 + 修 bug（5 站 × 6 题，孩子全程完成！）
- ✅ M29 第二次真实户外测试 + 收尾
- ✅ M30 MVP 完成里程碑（2026-06-19）

---

## V1 开发进度（V1-01 ~ V1-38，连续流水码）

> 详细任务见 `任务清单_V1.md`。串行推进，每个任务做完真机过三态再下一个。

### 🟦 A 区 单人打磨（V1-01 ~ V1-08）进行中
- [x] V1-01 ✅ 游戏端展示解析（保底通过时显示正确答案 + 可选解析）
- [x] V1-02 ✅ 通关成绩单 + 错题本（按站汇总，按站算分抽成可复用纯函数）
- [x] V1-03 ✅扫码成功音效（补缺失的 ding.mp3）+ 动画 ← 下一个
- [x] V1-04 ✅通关音效
- [x] V1-05 ✅ 拼音标注（pinyin-pro@3.18.2，设置开关，题干+选项，SW v2.8）
- [x] V1-06 ✅ 修 bug：B01 矮屏选项截断（媒体查询 820px + scrollIntoView）+ B02 飞行模式首启提示（index.html 离线 tip）
- [x] V1-07 ✅出题用字指南（文档）
- [x] V1-08 ✅A 区联调 + 真机三态验收

### 🟨 B 区 地图 + 故事 + 海报（V1-09 ~ V1-20）✅ 已完成
- [x] V1-09 ✅ 编辑端 L1 表单解锁地图字段 UI（上传底图压缩 1600px + 字号/颜色配置）
- [x] V1-10 ✅ 编辑端地图标记编辑器（新标签页独立页，点击放置/拖动调整/删除/预览/保存）
- [x] V1-11 ✅ 编辑端 L2 三段文案（答题引导 questionIntroText + 通关庆祝 completionText）
- [x] V1-12 ✅ 编辑端 L1 开场/结局故事字段（openingStory + endingStory）
- [x] V1-13 ✅ 游戏端故事页（开场故事两阶段点击 + 结局故事区块，SW v2.13）
- [x] V1-14 ✅ 发现文案弹窗 + 地图浮现动画（新建 map-overlay.js 共享渲染模块，quiz.html 三阶段过渡流程，SW v2.14）+ 五处调整：地图容器高度自适应/无黑边、discovered 标记可见性、答题引导合并到发现页、开场故事加地图全览、版本号 V1，SW v2.15；修 bug：坐标单位 0~1→×100 转百分比 + img.onload 时序修复，SW v2.16
- [x] V1-15 ✅ 拍照页内嵌地图盖章动画（photo.html 完成区加 completionText 内嵌 + 地图容器，复用 map-overlay.js stamp 动画 0.8s 落点震动，stateMap 当前站=completed，SW v2.16）；V1-15b 地图一屏适配（max-height 55vh + 容器 fit-content 贴合图片，任何尺寸地图整图一屏可见、标记不错位，SW v2.17）；V1-15c 坐标锚点对齐（标记改 translate(-50%,-50%) 图标中心对齐坐标点、名字 absolute 挂下方，与 admin 一致，修复 play 圆圈比 admin 偏上，SW v2.18）
- [x] V1-16 ✅ 浮动地图按钮（hint.html + quiz.html 答题屏右下角 🗺️ 圆按钮，有 mapImage 才显示；点击 → 全屏黑色覆盖层 + naturalHeight 地图纯查看，无动画；右上 ✕ 关闭；发现屏已内嵌不显示 FAB；hint 的 stateMap=前站 completed/其余 undiscovered；quiz 复用 buildStateMap；SW v2.19）
- [x] V1-17 ✅ 地图三态统一（map-overlay.js 新增 buildPointStateMap 共用函数，依据 pointRecords 推三态，消除各页自写 index 绕道；quiz.html 提前调 startChallenge 使 discover 屏能正确显示 discovered；photo.html 去掉 i<=current 绕道改走共用函数；hint.html 同；SW v2.20）
- [x] V1-18 ✅ 成就海报（victory.html Canvas 生成 1080px 竖版海报：蓝色渐变头部/站点列表/16:9 合影网格/全亮地图红星盖章；按钮触发，长按保存；无地图/无照片向下兼容；SW v2.21）
- [x] V1-19 ✅ schemaVersion 升 1.1 + 放宽校验（导出改写 "1.1"；validateJson 改为主版本号 === '1' 即接受，1.0/1.1 均通过，2.0 拒绝，无字段拒绝；exportFull/importFull 整对象倒出/写入，地图故事字段自然包含，无需补字段）
- [x] V1-20 ✅ B 区联调 + iPad 三态验收（V1-09~19 地图/故事/海报/导入全流程真机走通）
- [x] UI 微调（非编号）✅ 答题引导页地图 +20%(66vh)；photo「第N站完成」🎉+标题调小并整块上移；victory 庆祝🏆+概况调小、间距收紧；select/start 探险图标规则统一为 pickIcon(id)；新增 `docs/外观微调操作文档.md`（图标/地图/文案自助调整 + 推 GitHub 详细步骤）；SW v2.22
- [x] 双分支双部署（基建·非编号）✅ release→根目录（孩子玩）/ main→/dev（开发版「寻宝-DEV」橙图标，DEV 标记部署时注入不进源码）；GitHub Actions 工作流 `.github/workflows/deploy-pages.yml`；github-pages 环境放开 main+release 两分支；新增 `docs/双分支发布说明.md`

### 🟩 C 区 收尾杂项 + 题型（V1-21 ~ V1-26）✅ 已完成
- [x] V1-21 ✅ 主动暂停按钮（quiz 答题屏 + hint 找站屏 顶部条最左端 ⏸；点击 → 全屏遮罩盖住题目 + 「继续游戏」；pauseStartedAt/pausedMs 存 session 不进导出；继续时累加 pausedMs；暂停着关 App 重开续玩仍是暂停态；victory 用时扣掉 pausedMs；老存档容错；main.css 共享样式；SW v2.23）
- [⏸] V1-22 题目插图【暂缓】（AI 集中出题不需截图，跳过；任务保留）
- [x] V1-23 ✅ 单 L1 导出 + 追加导入（exportSingleLevel/importSingleLevel/validateJson 放宽接受 single-level；编辑端 L1 详情页「📤 导出」按钮；admin import-export + play settings 双端追加导入流程；撞 ID 走覆盖确认；有未完成存档多一步提示；共享题目副作用小字说明；SW v2.24）
- [x] V1-24 ✅ 填空题（type='fill'，fillAnswers[]，编辑端新建+游戏端文本框答题；去空格不区分大小写匹配；3 次容错/求助/计分与选择题一致；不升 schema；SW v2.25）
- [x] V1-25 ✅ 题库随机抽题（选题面板加「🎲 随机抽 N 道」，按学科/难度/年龄/使用次数+搜索筛选当范围，优先抽实时引用数<2 软避让，加入勾选待人工确认；顺手给选题面板补「年龄」「使用次数」筛选 + 把使用次数/已用标签改成实时引用数，修正 usedCount 永远是 0 的遗留问题；纯编辑端不升 SW）
- [x] V1-26 ✅ C 区联调 + 真机三态验收（手动真机，已通过）
### 🟥 D 区 多人（合作式轻量版，V1-27 ~ V1-31）进行中（在 main 开发不影响孩子 release）
> 2026-06-24 大幅简化：个人积分/归属/连对/答题之星/投票颁奖/保底奖全推 V2；V1 只做「开局创建玩家+队名 → 答题流程不变(共享总分) → 通关给整队颁一枚奖(每个 L1 自配奖名奖图)」。新增 Level.groupAwardName/groupAwardImage，启用 GameSession.players/teamName。
- [x] V1-27 ✅ 游戏端开局多人创建（人数 1-6 + 头像可选/名字/数字编号/6 色选一，无头像用「颜色块+编号」方块实时更新；单屏内嵌队伍详情、编号不重复校验；头像进 photos 表 type:'avatar'；单人零改动）**已 2026-06-25 main/release 双推（v2.28），随发暖色 UI 改版**
- [x] V1-28 ✅ 编辑端 L1 通关小组奖配置（L1 表单「探险地图」下方新增「🏆 通关小组奖（可选）」分组：奖名 groupAwardName 单行文本 + 奖图 groupAwardImage 压 ≤800 base64，预览/移除；保存写回 Level，空=""/null；新建/编辑/复制都带；不动 schema、不动导出逻辑，随 exportFull 自然进出；纯编辑端不升 SW，level-form.js?v=V1-28）
- [x] V1-29 ✅ 游戏端多人版通关庆典 + 小组颁奖（仅 session.players 非空：队名 + 全体头像小圆；撒花后小组奖 scale+渐显揭晓「🎉 队名 获得【奖名】！」+ 头像呼应人人有份；读 level.groupAwardName/groupAwardImage，没配走默认「通关纪念奖」+🏆；头像取法同合影；单人/老存档零改动；不动结算幂等/撒花/成绩单/海报；SW v2.29）**先于 V1-28 做，用内置默认奖兜底**
- [x] V1-30 ✅ 多人字段兼容性收口（回归 + 容错核查，无新功能）：核查全局只有 victory.html 读 players/teamName 且已容错；续玩不读 players、随 session 持久；exportFull/exportSingleLevel 不导 photos（头像不进 admin 导出）、含 groupAward*；importFull 不动 photos，游戏端导入清 sessions 走 M18 确认；types.js 补 Level.coverImage/groupAward*、Point.hintImage、GameSession.players/teamName 注释（仅注释，未改 play 页 → 不升 SW）← 待真机三态走一遍
- [ ] V1-31 D 区联调 + 真机三态验收 ← **下一个**
### 🟪 E 区 真机测试 + 修 bug（V1-32 ~ V1-35）待开始

---

## 注意事项

- **Service Worker**：~~`play/service-worker.js` 目前仍是静态 FILES_TO_CACHE 策略（T07 遗留），M16 时替换为动态缓存策略~~ → ✅ M16 已替换为动态缓存（stale-while-revalidate）
- **admin/ index.html**：占位页，M06 时开始正式开发
- **shared/**：目录骨架已建好，M02/M03 时填充代码
