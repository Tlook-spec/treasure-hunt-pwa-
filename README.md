# 🗺️ 寻宝游戏 PWA

iPad 上离线运行的儿童户外解谜游戏——家长出题贴二维码，孩子按顺序找点、扫码、答题。

---

## 本地预览方法

PWA 不能直接双击 HTML 文件打开（`file://` 协议不支持 Service Worker），需要启动一个本地服务器。

### 方法一：用 Python（推荐，Windows/Mac 通用）

先检查是否已安装 Python：

```
python --version
```

如果有输出版本号，在项目根目录运行：

```
python -m http.server 8080
```

然后在浏览器打开：[http://localhost:8080](http://localhost:8080)

### 方法二：用 Node.js

先安装 `serve` 工具（只需安装一次）：

```
npm install -g serve
```

在项目根目录运行：

```
serve .
```

浏览器打开提示的地址（通常是 [http://localhost:3000](http://localhost:3000)）

### 验证 PWA 功能

1. 打开浏览器开发者工具（F12）
2. 切到 **Application** 标签页
3. 左侧点 **Service Workers**，确认状态是 "activated and is running"
4. 左侧点 **Manifest**，确认应用信息正确读取

---

## 项目结构

```
treasure-hunt/
├── index.html              # 入口页面（当前是 Hello World）
├── manifest.json           # PWA 配置（图标、名称、主题色）
├── service-worker.js       # 离线缓存支持
├── README.md               # 本文件
├── CLAUDE.md               # 给 Claude Code 看的项目说明（不要删）
├── assets/
│   ├── icons/              # App 图标（当前是 SVG 占位符）
│   ├── sounds/             # 音效（待添加）
│   └── images/             # 插画背景（待添加）
├── styles/
│   └── pages/              # 各页面样式（待添加）
├── scripts/                # JavaScript 脚本（待添加）
└── docs/
    ├── PRD.md              # 产品需求文档
    ├── PROGRESS.md         # 开发进度记录
    └── 任务清单_阶段0-1_Windows版.md
```

---

## 技术栈

- **纯 HTML + CSS + JavaScript**（不使用任何框架）
- **Service Worker**（PWA 离线支持）
- **部署**：GitHub Pages

---

## 开发进度

详见 [docs/PROGRESS.md](docs/PROGRESS.md)
