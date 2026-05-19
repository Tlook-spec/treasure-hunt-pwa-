# 寻宝游戏 PWA - 开发进度记录

> Claude Code：每次完成任务后在这里更新进度。新对话开始时先读这个文件。

---

## 当前状态

**阶段**：阶段 0 - 环境搭建与基础试水
**最后更新**：2026-05-19

**线上地址**：https://Tlook-spec.github.io/treasure-hunt-pwa-/
**GitHub 仓库**：https://github.com/Tlook-spec/treasure-hunt-pwa-

---

## 已完成任务

### ✅ T01 - 注册 GitHub 账号
完成。

### ✅ T02 - 安装 VS Code 和 Claude Code
完成。

### ✅ T03 - 创建项目文件夹和初始化
完成。已有 CLAUDE.md、docs/PRD.md、docs/任务清单_阶段0-1_Windows版.md。

### ✅ T04 - 创建第一个 Hello World PWA
**完成时间**：2026-05-18

**创建的文件**：
- `index.html` — 首页，蓝色背景，显示标题和"开始游戏"按钮
- `manifest.json` — PWA 配置（名称、主题色、图标）
- `service-worker.js` — 离线缓存（Cache First 策略）
- `README.md` — 项目简介和本地预览说明
- `assets/icons/icon-192.svg` — 192×192 图标（宝箱设计）
- `assets/icons/icon-512.svg` — 512×512 图标（同上）
- `assets/icons/icon-maskable-192.svg` — Maskable 图标（用于系统圆形裁切场景）

**本地预览命令**：
```
python -m http.server 8080
```
打开 http://localhost:8080

**验证清单**：
- [x] 页面正常显示标题和按钮
- [x] 蓝色背景，竖屏居中
- [x] 横屏不错乱
- [x] 开发者工具 → Application → Service Workers 状态正常
- [x] 开发者工具 → Application → Manifest 信息正确
- [ ] 在 iPad 上打开并"添加到主屏幕"（T06 完成后验证）

---

### ✅ T05 补充 - iPad 离线验证
**完成时间**：2026-05-19
问题：主屏幕 PWA 首次从图标打开需联网，让 Service Worker 在该上下文安装缓存，之后才能离线使用。已验证通过。

---

## 进行中任务

### 🔄 T07 - 扫码功能试水
**当前状态**：test-scan.html 已创建，等待本地 + iPad 验证

**新增文件**：
- `test-scan.html` — 独立扫码测试页，使用 html5-qrcode CDN
- `index.html` 底部增加"🔧 测试扫码"临时入口

**待验证**：
- [ ] Windows 本地摄像头测试
- [ ] iPad Safari 权限请求正常
- [ ] iPad 扫码识别成功
- [ ] 扫码后"再扫一个"流程正常

---

### ✅ T05 - 部署到 GitHub Pages
**完成时间**：2026-05-19

**完成内容**：
- 创建 `.gitignore`（忽略 .DS_Store、node_modules、.claude/ 等）
- 初始化本地 git 仓库，分支名 `main`
- 创建 GitHub 仓库：`Tlook-spec/treasure-hunt-pwa-`
- 推送代码到 GitHub，开启 GitHub Pages

**线上地址**：https://Tlook-spec.github.io/treasure-hunt-pwa-/

**以后更新部署的命令**（改完代码后在终端运行）：
```
git add .
git commit -m "描述这次改了什么"
git push
```

---

## 待完成任务

- [x] T05 - 部署到 GitHub Pages
- [x] T06 - 在 iPad 上"添加到主屏幕"试用（离线问题已解决）
- [ ] T07 - 扫码功能试水（test-scan.html 已创建，待 iPad 验证）
- [ ] T08-T12 - 阶段 1：产品设计

---

## 已知问题

- SVG 图标在 iOS 设备上作为主屏幕图标可能显示不佳（iOS 对 SVG 图标支持有限）
  - **解决方案**：T05 部署后在 iPad 上实际测试，若有问题则改为 PNG 格式图标
- Service Worker 注册路径使用相对路径（`./service-worker.js`），部署到 GitHub Pages 子目录后需验证

---

## 项目当前文件结构

```
treasure-hunt/
├── index.html              ✅ 已创建
├── manifest.json           ✅ 已创建
├── service-worker.js       ✅ 已创建
├── README.md               ✅ 已创建
├── CLAUDE.md               ✅ 已有
├── assets/
│   ├── icons/
│   │   ├── icon-192.svg         ✅ 已创建
│   │   ├── icon-512.svg         ✅ 已创建
│   │   └── icon-maskable-192.svg ✅ 已创建
│   ├── sounds/             📁 空目录，待添加音效
│   └── images/             📁 空目录，待添加图片
├── styles/
│   └── pages/              📁 空目录，待添加样式
├── scripts/                📁 空目录，待添加脚本
└── docs/
    ├── PRD.md              ✅ 已有
    ├── PROGRESS.md         ✅ 本文件
    ├── Windows开发备忘.md  ✅ 已有
    └── 任务清单_阶段0-1_Windows版.md ✅ 已有
```
