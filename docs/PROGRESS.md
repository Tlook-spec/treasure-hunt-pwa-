# 项目进度记录

> 每完成一个任务后更新这里。新对话开始时先读本文件。
>
>  **当前版本**：v1.9.4（对应 CLAUDE.md v1.9.4）

---

## 当前状态

**阶段**：🟥 **V1 D 区 进行中**（C 区 V1-21~26 全 ✅；D 区 V1-27 多人队伍创建 ✅、V1-28 编辑端 L1 小组奖配置 ✅、V1-29 多人庆典+小组颁奖 ✅；UI/暖色配色改版 ✅）。下一步 V1-30 数据落地 + 续玩/导入导出兼容回归。

**部署**：**双分支双部署**（2026-06-22）——`release`→网站根目录（孩子玩的稳定版），`main`→`/dev/`（开发版「寻宝-DEV」+ 橙图标）。GitHub Actions 自动部署。详见 [双分支发布说明.md](双分支发布说明.md)。
**已发版**：**2026-06-25**——① 提交 `e53ba19`：V1-27 多人创建 + UI/暖色配色全套改版（v2.28）② 后续 V1-29 多人庆典+小组颁奖（CACHE_VERSION **v2.29**、BUILD_TAG `V1-29-多人庆典颁奖 · 2026-06-25`）。main/release 双推，孩子联网开一次 App 即可更新缓存。（上一次发版 2026-06-24 v2.26 含 V1-21~25）

**本次（2026-06-25）随 V1-27 一起发版的「非编号」UI 改动**：
- L1 封面图（`coverImage`）+ L2 提示图（`hintImage`）：admin 上传、孩子端列表/开始页/提示页展示
- 游戏端全局换 **V0 暖色系**（橙 `#E0772F` 主 / 青绿 `#3FAEB8` / 金 `#E8B43C` / 暖米底 `#F4EAD5` / 近白米卡片）；admin 未改
- 地图三态图标重做：未到=灰圆编号（不显站名）/ 已发现=红图钉 / 已完成=绿勾
- start-level 单屏化 + 队员卡片重设计（编号不重复校验）；hint 站点步进条 + 「前往第 X 站」+ 取消顶进度条
- 答题进度+总分条、过关「本站得分」、通关 3 格 + 海报暖白化
- 修复：未到标记不显示站名、手动输码绿勾完整覆盖、地图 FAB 暖白底

**下一个任务**：V1-30 数据落地 + 续玩/导入导出兼容回归（players 容错、L1 奖随导出、头像不进 admin 导出），之后 V1-31 D 区联调。V1-22 题目插图【暂缓】。

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
- [ ] V1-30 数据落地 + 续玩/导入导出兼容回归（players 容错、L1 奖随导出、头像不进 admin 导出）← **下一个**
- [ ] V1-31 D 区联调 + 真机三态验收
### 🟪 E 区 真机测试 + 修 bug（V1-32 ~ V1-35）待开始

---

## 注意事项

- **Service Worker**：~~`play/service-worker.js` 目前仍是静态 FILES_TO_CACHE 策略（T07 遗留），M16 时替换为动态缓存策略~~ → ✅ M16 已替换为动态缓存（stale-while-revalidate）
- **admin/ index.html**：占位页，M06 时开始正式开发
- **shared/**：目录骨架已建好，M02/M03 时填充代码
