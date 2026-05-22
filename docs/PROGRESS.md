# 寻宝游戏 PWA - 开发进度记录

> Claude Code：每次完成任务后在这里更新进度。新对话开始时先读这个文件。

---

## 当前状态

**阶段**：阶段 0 末 - 架构调整完成，准备进入阶段 1
**最后更新**：2026-05-22

**线上地址（旧，待架构调整后更新 GitHub Pages 路径）**：
- 主入口：https://Tlook-spec.github.io/treasure-hunt-pwa-/
- 游戏端：https://Tlook-spec.github.io/treasure-hunt-pwa-/play/
- 编辑端：https://Tlook-spec.github.io/treasure-hunt-pwa-/admin/

**GitHub 仓库**：https://github.com/Tlook-spec/treasure-hunt-pwa-

---

## 当前项目文件结构

```
treasure-hunt/
├── index.html              ✅ 根入口页（主页跳转按钮）
│
├── admin/
│   └── index.html          ✅ 编辑端占位页（"开发中"）
│
├── play/
│   ├── index.html          ✅ 游戏端首页（蓝色背景 + 开始游戏按钮）
│   ├── manifest.json       ✅ PWA 配置
│   ├── service-worker.js   ✅ 离线缓存（v1.2）
│   ├── test-scan.html      ✅ 扫码测试页
│   ├── assets/icons/       ✅ icon-192.svg / icon-512.svg / icon-maskable-192.svg
│   ├── styles/             📁 空目录，待添加样式
│   └── scripts/            📁 空目录，待添加脚本
│
├── shared/
│   ├── models/             📁 空目录，待添加数据模型
│   ├── db/                 📁 空目录，待添加 IndexedDB 封装
│   ├── utils/              📁 空目录，待添加工具函数
│   └── libs/               📁 空目录，待添加第三方库
│
├── docs/                   ✅ 项目文档目录
├── CLAUDE.md               ✅ Claude Code 项目说明 v1.3
├── README.md               ✅ 项目说明（已更新为双站点结构）
└── .gitignore
```

---

## 已完成任务

### ✅ T01 - 注册 GitHub 账号
完成。

### ✅ T02 - 安装 VS Code 和 Claude Code
完成。

### ✅ T03 - 创建项目文件夹和初始化
完成。已有 CLAUDE.md、docs/PRD.md、docs/任务清单。

### ✅ T04 - 创建第一个 Hello World PWA
**完成时间**：2026-05-18

**创建的文件**（已迁移至 play/）：
- `play/index.html` — 首页，蓝色背景，显示标题和"开始游戏"按钮
- `play/manifest.json` — PWA 配置（名称、主题色、图标）
- `play/service-worker.js` — 离线缓存（Cache First 策略）
- `play/assets/icons/icon-192.svg` — 192×192 图标
- `play/assets/icons/icon-512.svg` — 512×512 图标
- `play/assets/icons/icon-maskable-192.svg` — Maskable 图标

**本地预览命令**：
```
python -m http.server 8000
```
打开 http://localhost:8000/play/

**验证清单**：
- [x] 页面正常显示标题和按钮
- [x] 蓝色背景，竖屏居中
- [x] 横屏不错乱
- [x] 开发者工具 → Application → Service Workers 状态正常
- [x] 开发者工具 → Application → Manifest 信息正确
- [ ] 在 iPad 上重新以新路径 /play/ 添加到主屏幕（T08 架构调整后需重新验证）

---

### ✅ T05 - 部署到 GitHub Pages
**完成时间**：2026-05-19

**完成内容**：
- 创建 `.gitignore`
- 初始化本地 git 仓库，分支名 `main`
- 创建 GitHub 仓库：`Tlook-spec/treasure-hunt-pwa-`
- 推送代码到 GitHub，开启 GitHub Pages

**线上地址**：https://Tlook-spec.github.io/treasure-hunt-pwa-/
（架构调整后游戏端地址变为 /play/，编辑端 /admin/）

**以后更新部署的命令**：
```
git add .
git commit -m "描述这次改了什么"
git push
```

---

### ✅ T06 - iPad 离线验证
**完成时间**：2026-05-19
问题：主屏幕 PWA 首次从图标打开需联网，让 Service Worker 在该上下文安装缓存，之后才能离线使用。已验证通过。

---

### ✅ T07 - 扫码功能试水
**完成时间**：2026-05-19

**文件**（已迁移至 play/）：
- `play/test-scan.html` — 独立扫码测试页

**验证结果**：
- [x] Windows 本地摄像头测试通过
- [x] iPad Safari 权限请求正常
- [x] iPad 扫码识别成功
- [x] 扫码后"再扫一个"流程正常
- [x] iPad PWA 模式下验证通过

**结论**：html5-qrcode 在 iPad Safari PWA 模式下稳定可用，可用于正式功能开发。

---

### ✅ T08 - 架构调整（双站点结构）
**完成时间**：2026-05-22

**改动内容**：
1. **文件迁移**：根目录的 `index.html`、`manifest.json`、`service-worker.js`、`test-scan.html`、`assets/` 全部迁移到 `play/` 子目录
2. **新建目录**：`admin/`、`play/`、`shared/`（含 models/db/utils/libs 子目录）
3. **新建根入口页**：`index.html`（主页，含两个大按钮跳转到 admin/ 和 play/）
4. **新建 admin/ 占位页**：`admin/index.html`（"编辑端开发中"占位）
5. **Service Worker 版本升级**：v1.1 → v1.2（路径调整后强制缓存更新）
6. **README.md 更新**：改为双站点结构说明
7. **清理旧空目录**：根目录的 `scripts/` 和 `styles/` 已删除

**现在的访问路径**：
- http://localhost:8000/ → 主入口
- http://localhost:8000/play/ → 游戏端
- http://localhost:8000/admin/ → 编辑端占位
- http://localhost:8000/play/test-scan.html → 扫码测试

---

## 待完成任务

- [ ] T09 - 阅读 PRD v1.3，理解全功能清单
- [ ] iPad 上重新以新路径添加游戏端到主屏幕（路径改为 /play/）
- [ ] 阶段 1 开始：编辑端基础页面搭建

---

## 已知问题

- SVG 图标在 iOS 设备上作为主屏幕图标可能显示不佳（iOS 对 SVG 支持有限）
  - **解决方案**：在 iPad 重新测试新路径，若有问题则改为 PNG 格式
- `test-scan.html` 使用 CDN 引入 html5-qrcode（CDN 地址是 jsdelivr）
  - **现状**：仅作为开发测试页，离线不可用，后续正式功能会本地化
- iPad 上旧的主屏幕图标（指向根路径）需要删除后重新用新路径 `/play/` 添加
