# Windows 开发备忘速查

> 这份备忘记录 Windows 11 开发 PWA 时常用的命令、工具和踩坑提醒。
> 遇到问题先来这里查，再去问 Claude Code。

---

## 1. 工具清单

### 必装工具

| 工具 | 用途 | 下载/安装 |
|------|------|----------|
| **VS Code** | 代码编辑器 | https://code.visualstudio.com/ |
| **Claude Code 扩展** | VS Code 内的 AI 助手 | VS Code 扩展商店搜 "Claude Code"（发布者：Anthropic） |
| **Claude Code CLI** | 命令行版 AI 助手 | https://docs.claude.com/en/docs/claude-code/quickstart |
| **Git for Windows** | 版本控制 | https://git-scm.com/download/win |
| **GitHub Desktop** | Git 图形化工具 | https://desktop.github.com/ |
| **Chrome / Edge** | 主测试浏览器 | 系统自带或下载 |

### 选装工具（按需）

| 工具 | 用途 |
|------|------|
| **Python 3** | 启动本地服务器最简单 | https://www.python.org/downloads/ |
| **Node.js** | 启动本地服务器备选 | https://nodejs.org/ |
| **Windows Terminal** | 比默认 PowerShell 更好用 | Microsoft Store 搜索 |
| **PowerToys** | 截图、文件管理增强 | Microsoft Store 搜索 |

---

## 2. PowerShell 常用命令对照表

如果你看过 Mac/Linux 教程，下面是命令对照：

| 操作 | PowerShell（Windows） | Bash（Mac/Linux） |
|------|---------------------|------------------|
| 进入文件夹 | `cd C:\路径\文件夹` | `cd /路径/文件夹` |
| 当前位置 | `pwd` | `pwd` |
| 列出文件 | `ls` 或 `dir` | `ls` |
| 创建文件夹 | `mkdir 文件夹名` | `mkdir 文件夹名` |
| 创建文件 | `New-Item 文件名` 或 `ni 文件名` | `touch 文件名` |
| 删除文件 | `Remove-Item 文件名` 或 `rm 文件名` | `rm 文件名` |
| 删除文件夹 | `Remove-Item -Recurse 文件夹` | `rm -r 文件夹` |
| 复制文件 | `Copy-Item 源 目标` 或 `cp 源 目标` | `cp 源 目标` |
| 查看文件内容 | `Get-Content 文件` 或 `cat 文件` | `cat 文件` |
| 清屏 | `cls` 或 `clear` | `clear` |
| 退出 | `exit` | `exit` |
| 路径分隔符 | `\` (反斜杠) | `/` (正斜杠) |

**重点**：Windows 用 `\` 做路径分隔符，但**很多工具也接受 `/`**。如果你看到 `/` 的路径不要慌，能用。

---

## 3. 启动本地服务器

PWA 必须通过 HTTP 协议访问（不能用 `file://` 直接打开 HTML），所以需要本地服务器。

### 方法 1：Python（推荐，最简单）

**先检查电脑是否有 Python**：

```powershell
python --version
```

如果显示版本号（如 `Python 3.11.0`），就有。如果显示 "无法识别"，需要装。

**装 Python**：

1. 去 https://www.python.org/downloads/
2. 下载最新版（点大按钮 "Download Python 3.x.x"）
3. 安装时**勾选 "Add python.exe to PATH"**（重要！）
4. 安装完成后重启 PowerShell

**启动服务器**：

```powershell
# 进入项目文件夹
cd C:\Users\你的用户名\Documents\Projects\treasure-hunt

# 启动服务器
python -m http.server 8000
```

浏览器访问：`http://localhost:8000`

**停止服务器**：按 `Ctrl + C`

### 方法 2：Node.js（备选）

**安装 Node.js**：

1. 去 https://nodejs.org/
2. 下载 LTS 版（左边那个绿色按钮）
3. 安装时默认选项即可
4. 重启 PowerShell

**启动服务器**：

```powershell
cd C:\Users\你的用户名\Documents\Projects\treasure-hunt

# 第一次用会自动下载 http-server，回车确认
npx http-server -p 8000
```

### 方法 3：VS Code 扩展（最方便）

装一个叫 **Live Server** 的 VS Code 扩展：

1. VS Code 按 `Ctrl + Shift + X` 打开扩展面板
2. 搜 "Live Server"（作者 Ritwick Dey）
3. 安装
4. 右键 `index.html` → "Open with Live Server"
5. 自动启动并打开浏览器

**这是最适合零基础的方式**，不用记命令。

---

## 4. PowerShell 常见报错

### 报错 1：脚本执行被禁止

```
无法加载文件 xxx.ps1，因为在此系统上禁止运行脚本。
```

**原因**：Windows 默认安全策略禁止脚本。

**解决**：以管理员身份打开 PowerShell（开始菜单搜 PowerShell → 右键"以管理员身份运行"），运行：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

输入 `Y` 确认。重启 PowerShell。

### 报错 2：命令不识别

```
xxx : 无法将"xxx"项识别为 cmdlet、函数...
```

**原因**：
- 命令拼写错误
- 工具没装
- PATH 环境变量没配好

**解决**：
- 检查拼写
- 让 Claude Code 帮你验证工具是否安装
- 重启 PowerShell（很多新装的工具需要重启才生效）

### 报错 3：端口被占用

```
[Errno 48] Address already in use
```

**原因**：端口（如 8000）已被其他程序占用。

**解决**：
- 换个端口：`python -m http.server 8001`
- 或找出占用进程：
  ```powershell
  netstat -ano | findstr :8000
  ```
  看到 PID 后用任务管理器结束这个进程。

---

## 5. 文件路径注意事项

### 路径分隔符

Windows 用 `\`（反斜杠），但有几个坑：

**在 PowerShell 命令里**：
```powershell
cd C:\Users\Tom\Documents     # ✅ 正常用 \
cd C:/Users/Tom/Documents     # ✅ / 也能用
```

**在代码里（JavaScript/JSON）**：
```javascript
// ❌ 错误：\ 在 JS 里是转义符
const path = "C:\Users\Tom"

// ✅ 正确：用 \\ 或 /
const path = "C:\\Users\\Tom"
const path = "C:/Users/Tom"
```

### 中文路径

**避免在路径里用中文**。比如：

- ❌ `C:\我的文档\寻宝游戏\` —— 偶尔会出兼容性问题
- ✅ `C:\Users\Tom\Documents\Projects\treasure-hunt\`

### 空格路径

如果路径里有空格，要用引号包起来：

```powershell
cd "C:\Program Files\Application"
```

---

## 6. GitHub Desktop 速查

### 第一次使用流程

1. **打开 GitHub Desktop**
2. **File → Add Local Repository**
3. 选你的 treasure-hunt 文件夹
4. 如果显示 "not a Git repository"，点 "create a repository here"
5. 完成后左侧看到你的项目

### 日常操作

**提交修改**（commit）：
1. 左侧看到改动文件列表，勾选要提交的
2. 底部填写 commit message（用中文描述改了什么）
3. 点 "Commit to main"

**上传到 GitHub**（push）：
1. commit 完成后，上方有 "Push origin" 按钮
2. 点击上传

**拉取最新代码**（pull）：
1. 上方点 "Fetch origin"
2. 如果有更新会变成 "Pull origin"
3. 点击拉取

**回到之前的状态**：
1. 左侧 "History" 标签看历史 commit
2. 右键某个 commit → "Revert this commit" 撤销这次修改
3. 或者 "Reset to this commit" 完全回到当时（**慎用**）

### 常用术语对照

| 术语 | 意思 |
|------|------|
| Repository（仓库） | 你的整个项目 |
| Commit（提交） | 一次"保存快照" |
| Push（推送） | 上传到 GitHub |
| Pull（拉取） | 从 GitHub 下载更新 |
| Branch（分支） | 平行宇宙，目前你只用 main 就够 |

---

## 7. 在 iPad 上调试（Windows 用户专属技巧）

Windows 没有 Mac 的 Safari 远程调试能力，但我们用 **Eruda** 嵌入式调试控制台代替。

### Eruda 使用

**在网址后加 `?debug=1` 开启调试**：

```
https://你的用户名.github.io/treasure-hunt-pwa/?debug=1
```

打开后：

1. 网页右下角出现齿轮按钮
2. 点击展开调试面板
3. 切到 **Console** 标签：看 console.log 和错误
4. 切到 **Elements** 标签：检查页面结构
5. 切到 **Network** 标签：看网络请求
6. 切到 **Resources** 标签：看本地存储、Service Worker 状态

### iPad 上看不到错误怎么办

如果 Eruda 也没出现，可能的原因：

1. **没加 `?debug=1` 参数**：从主屏幕图标打开不会带这个参数，需要直接在 Safari 里输入完整网址
2. **代码本身就有问题导致 Eruda 没加载**：用 PC/Mac 浏览器先在本地 `localhost:8000/?debug=1` 测试
3. **缓存问题**：iPad Safari 清缓存（设置 → Safari → 清除历史记录与网站数据）

### 备选方案：把日志写到页面上

如果 Eruda 出问题，让 Claude Code 帮你加一个临时的"日志显示框"，把 console.log 的内容显示在页面底部，这样肉眼就能看到错误。

---

## 8. VS Code 实用快捷键（Windows）

| 操作 | 快捷键 |
|------|--------|
| 打开文件 | `Ctrl + P` |
| 打开命令面板 | `Ctrl + Shift + P` |
| 打开终端 | `Ctrl + ` `（反引号） |
| 新建文件 | `Ctrl + N` |
| 保存 | `Ctrl + S` |
| 全部保存 | `Ctrl + K + S` |
| 查找 | `Ctrl + F` |
| 全局查找 | `Ctrl + Shift + F` |
| 替换 | `Ctrl + H` |
| 注释代码 | `Ctrl + /` |
| 格式化代码 | `Shift + Alt + F` |
| Markdown 预览 | `Ctrl + Shift + V` |
| 折叠所有代码 | `Ctrl + K + 0` |
| 展开所有代码 | `Ctrl + K + J` |

---

## 9. Windows 11 特有提醒

### 防病毒软件干扰

Windows Defender 或第三方杀毒软件**有时会误删 Node.js / Python 文件**。如果安装过程很慢或失败，临时关闭实时防护试试。

### 文件名大小写

Windows 文件名**不区分大小写**：`Index.html` 和 `index.html` 是同一个文件。

但**部署到 GitHub Pages 后服务器区分大小写**！如果你的 HTML 里写：

```html
<img src="Photo.jpg">
```

但实际文件名是 `photo.jpg`，本地能看到图片，部署后看不到——这是经典坑。

**预防**：**所有文件名都用小写**，养成习惯。

### 换行符问题

Windows 用 CRLF，Mac/Linux 用 LF。Git 默认会自动转换，但偶尔出问题。

**预防**：在项目根目录创建 `.gitattributes` 文件，让 Claude Code 帮你配置正确的换行符规则。

### 路径长度限制

Windows 默认路径长度限制 260 字符。如果你项目路径很深、名字很长，可能会出错。

**预防**：把项目放在浅一点的位置，比如：

- ✅ `C:\Projects\treasure-hunt\`
- ❌ `C:\Users\YourName\Documents\Personal Projects\AI Generated Apps\treasure-hunt\`

---

## 10. 求助升级路径

遇到问题时按这个顺序处理：

1. **看错误信息**：英文不懂复制到翻译器
2. **来这份备忘查**
3. **问 Claude Code（在 VS Code 里）**：附上完整错误信息
4. **切换模型**：Sonnet 不行试 Opus
5. **来 claude.ai 网页版找我**：发完整背景 + 错误截图
6. **搜索引擎**：百度、必应搜错误信息（中文/英文）
7. **GitHub Issues**：去出问题的工具的 GitHub 仓库 Issues 区看别人遇到过没

90% 的问题在前 3 步能解决。

---

## 11. 一个"健康检查"清单

每次开始工作前，花 30 秒确认环境正常：

- [ ] VS Code 能打开项目
- [ ] PowerShell 输入 `claude` 能启动 Claude Code CLI
- [ ] VS Code 左侧的 Claude Code 扩展图标在
- [ ] GitHub Desktop 能打开
- [ ] 浏览器能访问 `http://localhost:8000`（如果开了服务器）

如果某项出问题，**先解决环境问题再写代码**。

---

> 这份备忘是动态的，遇到新问题随时往里加。
