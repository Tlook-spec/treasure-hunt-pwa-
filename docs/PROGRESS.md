# 项目进度记录

> 每完成一个任务后更新这里。新对话开始时先读本文件。
>
>  **当前版本**：v1.9（对应 CLAUDE.md v1.9）

---

## 当前状态

**阶段**：🟦 **V1-A 单人打磨（进行中）**

**下一个任务**：V1-15

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

### 🟨 B 区 地图 + 故事 + 海报（V1-09 ~ V1-20）进行中
- [x] V1-09 ✅ 编辑端 L1 表单解锁地图字段 UI（上传底图压缩 1600px + 字号/颜色配置）
- [x] V1-10 ✅ 编辑端地图标记编辑器（新标签页独立页，点击放置/拖动调整/删除/预览/保存）
- [x] V1-11 ✅ 编辑端 L2 三段文案（答题引导 questionIntroText + 通关庆祝 completionText）
- [x] V1-12 ✅ 编辑端 L1 开场/结局故事字段（openingStory + endingStory）
- [x] V1-13 ✅ 游戏端故事页（开场故事两阶段点击 + 结局故事区块，SW v2.13）
- [x] V1-14 ✅ 发现文案弹窗 + 地图浮现动画（新建 map-overlay.js 共享渲染模块，quiz.html 三阶段过渡流程，SW v2.14）
### 🟩 C 区 收尾杂项（V1-21 ~ V1-24）待开始
### 🟥 D 区 多人 + 题型增强（V1-25 ~ V1-34）待定（玩过 A/B/C 再确认）
### 🟪 E 区 真机测试 + 修 bug（V1-35 ~ V1-38）待开始

---

## 注意事项

- **Service Worker**：~~`play/service-worker.js` 目前仍是静态 FILES_TO_CACHE 策略（T07 遗留），M16 时替换为动态缓存策略~~ → ✅ M16 已替换为动态缓存（stale-while-revalidate）
- **admin/ index.html**：占位页，M06 时开始正式开发
- **shared/**：目录骨架已建好，M02/M03 时填充代码
