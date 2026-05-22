# 🗺️ 寻宝游戏

一个轻量级的儿童户外解谜游戏。家长出题贴二维码，孩子按顺序找点、扫码、答题、拍照纪念。

---

## 网站地址

| 页面 | 网址 |
|------|------|
| 主入口 | https://Tlook-spec.github.io/treasure-hunt-pwa-/ |
| 🎮 游戏端（孩子用，PWA） | https://Tlook-spec.github.io/treasure-hunt-pwa-/play/ |
| 📝 编辑端（家长用）| https://Tlook-spec.github.io/treasure-hunt-pwa-/admin/ |

---

## 项目结构（v1.3 双站点架构）

```
treasure-hunt/
├── index.html              # 根入口页（跳转到 admin/ 或 play/）
│
├── admin/                  # 编辑端（普通网页，不做 PWA）
│   └── index.html          # 家长用：关卡管理、题库、生成二维码（开发中）
│
├── play/                   # 游戏端（完整 PWA，可安装到 iPad 主屏幕）
│   ├── index.html          # 孩子用：扫码、答题、离线运行
│   ├── manifest.json       # PWA 配置（图标、名称、主题色）
│   ├── service-worker.js   # 离线缓存
│   ├── test-scan.html      # 开发测试：扫码功能验证页
│   ├── assets/icons/       # App 图标
│   ├── styles/             # 样式文件（待添加）
│   └── scripts/            # JS 脚本（待添加）
│
├── shared/                 # 两端共享代码
│   ├── models/             # 数据模型定义（待添加）
│   ├── db/                 # IndexedDB 封装（待添加）
│   ├── utils/              # 工具函数：ID 生成、JSON 导入导出等（待添加）
│   └── libs/               # 第三方库本地化（待添加）
│
├── docs/                   # 项目文档
│   ├── PRD.md              # 产品需求文档 v1.3
│   ├── PROGRESS.md         # 开发进度记录
│   └── 任务清单_阶段0-1_Windows版.md
│
├── CLAUDE.md               # 给 Claude Code 看的项目说明（不要删）
└── .gitignore
```

---

## 双站点说明

| | 编辑端（admin/）| 游戏端（play/）|
|---|---|---|
| **谁用** | 家长 | 孩子 |
| **设备** | 电脑 / iPad 浏览器 | iPad Safari 安装到主屏幕 |
| **是否 PWA** | ❌ 普通网页 | ✅ 完整 PWA |
| **是否离线** | 不需要 | 必须（户外无网络）|

**数据同步方式**：家长在编辑端导出 JSON → AirDrop / 邮件传到 iPad → 游戏端导入

---

## 本地预览方法

> **注意**：PWA 需要本地服务器（`file://` 不支持 Service Worker），推荐用 Python。

在项目根目录运行：

```
python -m http.server 8000
```

然后在浏览器访问：

| 页面 | 地址 |
|------|------|
| 主入口 | http://localhost:8000/ |
| 游戏端 | http://localhost:8000/play/ |
| 编辑端 | http://localhost:8000/admin/ |
| 扫码测试 | http://localhost:8000/play/test-scan.html |

---

## 技术栈

- **纯 HTML + CSS + JavaScript**（不使用任何框架）
- **Dexie.js**（IndexedDB 本地存储）
- **html5-qrcode**（扫码）
- **qrcode.js**（生成二维码）
- **Service Worker**（游戏端 PWA 离线支持）
- **部署**：GitHub Pages

---

## 开发进度

详见 [docs/PROGRESS.md](docs/PROGRESS.md)
