# 项目进度记录

> 每完成一个任务后更新这里。新对话开始时先读本文件。
>
> **当前版本**：v1.7（对应 CLAUDE.md v1.7）

---

## 当前状态

**阶段**：MVP 开发阶段 A（共享层）进行中

**下一个任务**：M06 — 编辑端项目骨架 + 路由 + 导航

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

- [ ] M06 编辑端骨架 + 路由 + 导航
- [ ] M07 L1 探险 CRUD
- [ ] M08 L2 点位 CRUD + 题目绑定
- [ ] M09 L3 题库 CRUD + 筛选
- [ ] M10 CSV 批量导入题目
- [ ] M11 单张二维码生成 + 打印
- [ ] M12 应急小抄打印
- [ ] M13 JSON 整库导入导出
- [ ] M14 删除引用保护
- [ ] M15 编辑端联调测试

### 阶段 C：游戏端

- [ ] M16 游戏端 PWA 框架（动态缓存 SW）
- [ ] M17 启动页 + 探险选择页 + 设置页
- [ ] M18 JSON 整库导入（游戏端）
- [ ] M19 游戏主流程框架
- [ ] M20 扫码功能集成
- [ ] M21 数字码输入 + 「找不到?」按钮
- [ ] M22 L2 内多题连答主流程
- [ ] M23 答题反馈 + 3 次容错 + 求助按钮
- [ ] M24 L2 通关拍合影 + 「继续扫码」按钮
- [ ] M25 极简通关页
- [ ] M26 自动保存 + 续玩

### 阶段 D：联调 + 真实测试

- [ ] M27 端到端联调
- [ ] M28 第一次真实户外测试 + 修 bug
- [ ] M29 第二次真实户外测试 + 收尾
- [ ] M30 MVP 完成里程碑

---

## 注意事项

- **Service Worker**：`play/service-worker.js` 目前仍是静态 FILES_TO_CACHE 策略（T07 遗留），M16 时替换为动态缓存策略
- **admin/ index.html**：占位页，M06 时开始正式开发
- **shared/**：目录骨架已建好，M02/M03 时填充代码
