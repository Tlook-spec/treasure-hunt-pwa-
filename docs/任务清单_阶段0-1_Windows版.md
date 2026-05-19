# 寻宝游戏 PWA - 阶段 0-1 任务清单（Windows 版）

> 这是你接下来 **2 周** 的"作战手册"。每个任务都是**可以直接复制粘贴**给 Claude Code 的指令。
> 
> **本版本针对 Windows 11 + VS Code（含官方 Anthropic Claude Code 扩展）+ Claude Code CLI 优化**。
>
> **使用方法**：
> 1. 按顺序执行任务（前置任务未完成不要跳）
> 2. 每个任务的【操作指令】部分直接复制给 Claude Code（VS Code 扩展或 CLI 都行）
> 3. 完成后用【验证清单】检查是否真的做完了
> 4. 在任务前的 `[ ]` 打钩 `[x]` 表示完成

---

## 📋 阶段 0-1 任务总览

**阶段 0：环境搭建与基础试水**（第 1 周）
- ✅ T01. 注册 GitHub 账号 *（已完成）*
- ✅ T02. 安装 VS Code 和 Claude Code *（已完成）*
- ✅ T03. 创建项目文件夹和初始化 *（已完成）*
- [ ] T04. 完成第一个 Hello World PWA
- [ ] T05. 部署到 GitHub Pages
- [ ] T06. 在 iPad 上"添加到主屏幕"试用
- [ ] T07. 扫码功能试水（含 Eruda 调试工具）

**阶段 1：产品设计**（第 2 周）
- [ ] T08. 阅读 PRD.md
- [ ] T09. 用 Excalidraw 画 15+ 张线框图
- [ ] T10. 整理每个页面的数据清单
- [ ] T11. 选定视觉风格（色彩、字体、圆角）
- [ ] T12. 完成阶段 1 总结

---

## 💡 工作流约定

你接下来会同时用三个 Claude 相关工具，分工建议：

| 工具 | 主要用途 |
|------|---------|
| **claude.ai 网页版** | 讨论方案、问概念、调整计划（和我聊天的这个） |
| **VS Code 里的 Claude Code 扩展** | 主力开发——写代码、改代码、看文件 |
| **PowerShell 里的 Claude Code CLI** | 跑 git 命令、装包、长输出操作 |

**默认模型**：使用 **Sonnet 4.6** 处理日常开发；只有在遇到难题或大型架构设计时切换到 **Opus 4.7**（在 Claude Code 里输入 `/model` 切换）。

---

## 🎯 阶段 0：环境搭建与基础试水

### [x] T01-T03（已完成）

你已经完成了 GitHub 注册、VS Code 和 Claude Code 安装、项目文件夹创建。

**确认项目当前结构**：
```
treasure-hunt\
├── CLAUDE.md
└── docs\
    ├── PRD.md
    └── 任务清单_阶段0-1.md（本文档）
```

如果结构正确，进入 T04。

---

### [ ] T04. 创建第一个 Hello World PWA

**前置**：T03
**预计时间**：1-2 小时
**类型**：开发任务

#### 准备工作

在开始之前，先在 VS Code 里打开项目：

1. 启动 VS Code
2. **File → Open Folder**（或快捷键 `Ctrl + K + O`）
3. 选择你的 `treasure-hunt` 文件夹
4. 左侧文件树应该能看到 CLAUDE.md 和 docs 文件夹

#### 启动 Claude Code

**方式 A（推荐）**：用 VS Code 的 Claude Code 扩展
- 点击 VS Code 左侧栏的 Claude Code 图标
- 在打开的对话面板里输入指令

**方式 B**：用 CLI
- VS Code 顶部菜单 **Terminal → New Terminal**（或快捷键 `Ctrl + ` `）
- 在终端输入 `claude`
- 进入 Claude Code CLI 后输入指令

无论哪种方式，Claude Code 都会读到当前打开的项目文件夹。

#### 【复制给 Claude Code 的指令 - 第 1 步：项目认知】

```
你好 Claude Code！我们正式开始寻宝游戏 PWA 项目。

请先做两件事：
1. 读一下项目根目录的 CLAUDE.md 和 docs/PRD.md，了解项目背景和约定
2. 读完后告诉我你的理解：这个项目要做什么、技术栈是什么、有哪些重要约定

注意：我用的是 Windows 11，开发环境是 VS Code + Claude Code 扩展 + PowerShell。
请在涉及命令时使用 Windows / PowerShell 的语法（而不是 Mac 的 bash）。
```

等 Claude Code 回答完，确认它理解正确后，发送第 2 步指令。

#### 【复制给 Claude Code 的指令 - 第 2 步：创建 PWA 骨架】

```
很好，开始第一个任务：创建 Hello World PWA 骨架。

请帮我创建以下文件：

1. index.html
   - 显示标题 "🗺️ Treasure Hunt"（大字、居中）
   - 副标题 "一起去探险吧！"
   - 一个大按钮 "开始游戏"（先不绑定任何功能）
   - 整体配色用蓝色系（具体色号你随意先选一组儿童友好的）
   - 竖屏优先布局，横屏也要能看
   - 用基本的 CSS 让它看起来不丑，不需要花哨

2. manifest.json
   - 应用名称：寻宝游戏
   - 短名称：寻宝
   - 主题色和背景色匹配上面的蓝色
   - display 模式设为 standalone（这样添加到主屏幕后没有浏览器栏）
   - 至少配置 192x192 和 512x512 两个图标（可以临时用一个简单的纯色方块加文字的 SVG，后面再换正式图标）

3. service-worker.js
   - 实现最基本的离线缓存
   - 缓存策略：首次访问时缓存 index.html、manifest.json、所有 CSS/JS
   - 离线时从缓存读取
   - 注释清楚每段代码的作用

4. README.md
   - 项目简介（一句话）
   - 怎么本地预览：请用 Windows / PowerShell 兼容的方式说明
   - 推荐使用 Python 3 自带的 http.server 模块（如果我电脑装了 Python）或者 Node.js 的 http-server 包
   - 给我具体的 PowerShell 命令

5. docs/PROGRESS.md
   - 记录已完成 T01-T04 任务
   - 列出当前项目结构
   - 列出下一步要做什么（T05 部署到 GitHub Pages）

要求：
- 所有代码加中文注释
- 文件结构清晰
- 不要引入任何 npm 包或框架
- 完成后告诉我怎么在 Windows 11 + PowerShell 下本地预览（包括具体命令）

补充：如果我电脑没装 Python 也没装 Node.js，请告诉我哪个安装更简单、怎么安装。
```

#### 你完成后要做的验证

**1. 启动本地服务器**

按 Claude Code 给的命令在 PowerShell 里启动本地服务器。常见命令：

**如果用 Python**：
```powershell
# 在项目文件夹下打开 PowerShell
cd C:\路径\treasure-hunt
python -m http.server 8000
```

**如果用 Node.js**：
```powershell
cd C:\路径\treasure-hunt
npx http-server -p 8000
```

**2. 浏览器访问**

打开浏览器（推荐 Chrome 或 Edge），访问：
```
http://localhost:8000
```

应该看到你的"寻宝游戏"主页。

**3. 检查 PWA 配置**

按 `F12` 打开开发者工具：
- 切到 **Application** 标签
- 左侧找 **Manifest** → 确认配置项都对
- 左侧找 **Service Workers** → 确认已注册

#### 验证清单
- [ ] 浏览器能打开 index.html
- [ ] 看到"寻宝游戏"标题和"开始游戏"按钮
- [ ] manifest.json 配置正确（F12 能看到）
- [ ] service-worker.js 已注册
- [ ] docs/PROGRESS.md 已更新

#### 常见问题

**Q：PowerShell 提示 `python` 不是命令？**
→ Windows 没装 Python。让 Claude Code 教你装。或者改用 Node.js 方式。

**Q：端口 8000 被占用？**
→ 换个端口，比如 8001、8888。

**Q：浏览器打开是空白页？**
→ 按 F12 看 Console 红色错误，截图发给 Claude Code。

**Q：执行命令时 PowerShell 报 "无法加载文件，因为在此系统上禁止运行脚本"？**
→ Windows 默认禁止脚本执行。在 PowerShell 里以管理员身份运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
然后输入 `Y` 确认。再试。

---

### [ ] T05. 部署到 GitHub Pages

**前置**：T04
**预计时间**：1-2 小时
**类型**：部署任务

#### 准备工作

为了让你 Git 操作更轻松，我**强烈推荐你装 GitHub Desktop**（图形化工具，比命令行直观 10 倍）。但 Claude Code 也会教你命令行方式作为备选。

下载 GitHub Desktop：https://desktop.github.com/

#### 【复制给 Claude Code 的指令】

```
T04 已经完成，PWA 在本地能正常跑。现在要部署到 GitHub Pages。

我从来没用过 GitHub 和 git，请一步步教我，每一步都解释为什么这么做。

我用的是 Windows 11。请优先教我用 GitHub Desktop（图形化工具）来操作 git，
因为我是零基础，图形化比命令行直观。命令行作为备选了解即可。

请按这个顺序教我：

1. 检查我电脑是否装了 Git（Windows 上需要装 Git for Windows）
   - 如果没装，告诉我下载地址和安装注意事项
   - 安装时哪些选项要选、哪些不要改默认

2. 安装 GitHub Desktop（如果还没装）
   - 下载地址：https://desktop.github.com/
   - 安装后登录我的 GitHub 账号

3. 把当前 treasure-hunt 文件夹变成 git 仓库
   - 用 GitHub Desktop：File → Add Local Repository → 选我的文件夹
   - 如果显示 "not a Git repository"，点 "create a repository here"

4. 创建 .gitignore 文件
   - 用 PowerShell 在项目根目录下创建
   - 内容包括：Thumbs.db、desktop.ini、node_modules/、*.log 等 Windows 常见忽略项

5. 第一次提交（commit）
   - 用 GitHub Desktop 操作：左侧勾选所有文件 → 底部 commit message 写"初始化项目" → Commit

6. 发布到 GitHub（push）
   - GitHub Desktop 上方 Publish repository
   - 仓库名建议：treasure-hunt-pwa
   - **取消勾选 "Keep this code private"**（GitHub Pages 免费版需要 Public 仓库）

7. 配置 GitHub Pages
   - 浏览器登录 GitHub
   - 进入仓库 → Settings → Pages
   - Source 选 main 分支、根目录、保存
   - 等 1-5 分钟，给我访问网址

完成后告诉我：
- GitHub Pages 的访问网址（应该形如 https://你的用户名.github.io/treasure-hunt-pwa/）
- 以后我改了代码，怎么更新部署（用 GitHub Desktop 的完整流程）
- 命令行方式作为参考（仅供了解）

最后更新 docs/PROGRESS.md 记录部署信息。
```

#### 你完成后要做的验证

1. 用浏览器打开 GitHub Pages 网址（类似 `https://你的用户名.github.io/treasure-hunt-pwa/`）
2. 确认显示的是你的 Hello World PWA
3. F12 检查 manifest.json 加载正常
4. **重要**：记下这个网址，T06 要用

#### 验证清单
- [ ] GitHub 仓库已创建并设为 Public
- [ ] 代码已 push 上去
- [ ] GitHub Pages 网址能访问到你的 PWA
- [ ] 知道下次怎么用 GitHub Desktop 更新部署
- [ ] PROGRESS.md 已更新

#### 常见问题

**Q：GitHub Pages 网址打开 404？**
→ 检查 Settings → Pages 里 Source 是否正确；部署需要 1-5 分钟，耐心等等。

**Q：HTTPS 证书警告？**
→ 等几分钟，GitHub Pages 会自动配置 HTTPS。

**Q：GitHub Desktop 提示需要登录？**
→ 用 T01 注册的 GitHub 账号登录。可能需要邮箱验证或者授权。

---

### [ ] T06. 在 iPad 上添加到主屏幕

**前置**：T05
**预计时间**：30 分钟
**类型**：测试任务

**这一步完全在 iPad 上操作，跟开发系统无关**。

#### 你要做的事

1. 拿出 iPad
2. 打开 **Safari**（注意：必须 Safari，其他浏览器不支持 PWA）
3. 访问 T05 拿到的 GitHub Pages 网址
4. 看到你的 Hello World 页面
5. 点击 Safari 底部（或顶部）的"分享"按钮（方框带向上箭头）
6. 在弹出的菜单里下滑找到"添加到主屏幕"
7. 确认添加
8. 回到主屏幕，找到刚添加的"寻宝游戏"图标
9. 点击图标打开（注意：现在打开时不应该有 Safari 的浏览器栏）
10. **关键测试**：iPad 切到飞行模式 → 关闭 Safari → 重新打开主屏幕图标 → 看是否还能正常显示

#### 验证清单
- [ ] iPad 主屏幕上有寻宝游戏图标
- [ ] 点击图标打开后没有 Safari 浏览器栏
- [ ] 飞行模式下也能打开（证明 Service Worker 工作了）
- [ ] 离线状态显示正常

#### 这一步的意义

你刚刚完成了 PWA 最关键的能力验证——**离线可用 + 看起来像 App**。后面所有开发都建立在这个基础上。

#### 常见问题

**Q："添加到主屏幕"选项找不到？**
→ 确认你用的是 Safari 不是 Chrome；如果开了"阅读器模式"也会看不到。

**Q：离线打不开？**
→ Service Worker 没注册成功。在 iPad Safari 看不到 F12，这就是为什么我们需要下一步的 Eruda 调试工具。

**Q：图标看起来很丑或没图标？**
→ 正常，目前用的是临时图标。后面会换正式的。

---

### [ ] T07. 扫码功能试水（含 Eruda 调试工具）

**前置**：T06
**预计时间**：3-4 小时
**类型**：技术验证

> 这是阶段 0 最重要的一步，**也是 Windows 用户专属的关键调整**：因为 Windows 不能像 Mac 那样直接调试 iPad 上的 Safari，我们要给项目集成一个嵌入式调试工具 **Eruda**。

#### 【复制给 Claude Code 的指令 - 第 1 步：集成 Eruda】

```
我用 Windows 开发，但要在 iPad 上测试 PWA。Windows 没有 Mac 那种"Safari 远程调试 iPad"的能力，
所以我需要在网页里嵌入一个调试控制台，方便我在 iPad 上看到 console.log 和错误信息。

请帮我集成 Eruda 调试工具：

1. 在 index.html 的 head 里通过 CDN 引入 Eruda
   推荐 CDN：https://cdn.jsdelivr.net/npm/eruda

2. 加一段初始化代码，要求：
   - 默认只在以下情况下加载并显示 Eruda：
     a) URL 带 ?debug=1 参数时
     b) 在 localhost / 127.0.0.1 下
   - 在正式环境（GitHub Pages 默认情况）不加载，避免孩子看到调试面板
   - 加载成功后，网页右下角会出现一个小齿轮按钮

3. 加完后告诉我怎么测试：
   - 本地访问：http://localhost:8000/?debug=1
   - GitHub Pages 访问：https://我的用户名.github.io/treasure-hunt-pwa/?debug=1
   - 验证右下角看到齿轮，点击展开能看到 Console 等标签

4. 更新 README.md，加一节"调试说明"，记录怎么开启 Eruda

5. 更新 PROGRESS.md
```

#### 验证 Eruda（在做扫码之前先验证调试工具能用）

1. 让 Claude Code 改完代码后，在本地用 `?debug=1` 访问，看右下角有没有齿轮
2. push 到 GitHub，等部署完成
3. iPad 上**直接用 Safari**（不要用之前添加到主屏幕的图标，因为带 ?debug=1 的参数不会被主屏幕图标记住）打开：
   `https://你的用户名.github.io/treasure-hunt-pwa/?debug=1`
4. 看到右下角齿轮 → 点击 → 看到 Console 等标签 → ✅ 调试工具就绪

#### 【复制给 Claude Code 的指令 - 第 2 步：扫码功能】

```
Eruda 调试工具已经集成，现在开始第一个真实功能：扫描二维码。

请帮我：

1. 创建一个新页面 test-scan.html（独立于主页面）
   - 顶部一个"返回首页"按钮
   - 中间一个大按钮"开始扫码"
   - 点击后调起摄像头，全屏扫码
   - 扫到任意二维码后：清晰显示扫到的内容文字
   - 提供"再扫一个"按钮

2. 使用 html5-qrcode 库（开源免费），用 CDN 方式引入（不要 npm，保持纯静态）
   推荐 CDN：https://unpkg.com/html5-qrcode

3. 处理权限相关的边界情况：
   - 第一次扫码请求摄像头权限
   - 权限被拒绝时友好提示"请允许相机权限才能扫码哦"
   - 不支持的浏览器友好提示

4. 在 index.html 的"开始游戏"按钮下方加一个小链接"测试扫码功能"，链接到 test-scan.html

5. 更新 service-worker.js 把 test-scan.html 也加入离线缓存

6. 在代码关键位置加 console.log，方便我用 Eruda 调试
   比如：扫码开始时、扫到内容时、出错时

7. 更新 PROGRESS.md 记录

要求：
- 代码尽量简单，多加中文注释
- 不要做复杂的样式，能用就行（后面会统一美化）
- 完成后告诉我怎么测试

补充说明：
- 我会先在 Windows 浏览器本地测试
- 然后 push 到 GitHub Pages 在 iPad 上真实测试
- iPad 真实测试通过才算这个任务完成
```

#### 你完成后要做的验证

**本地测试（Windows 浏览器）**：

1. PowerShell 启动本地服务器
2. 浏览器打开 `http://localhost:8000/test-scan.html`
3. 点击"开始扫码"，授权摄像头（如果你的 Windows 电脑有摄像头）
4. 用手机生成一个二维码（任何二维码生成网站都行）显示给摄像头看
5. 确认能扫到并显示内容

> **如果你的 Windows 电脑没有摄像头**：跳过本地测试，直接到 iPad 测试。

**iPad 真实测试（最重要）**：

1. 在 GitHub Desktop 里把代码 push 到 GitHub
2. 等 GitHub Pages 部署完成（1-5 分钟）
3. **iPad 上从主屏幕图标打开 PWA**（不是 Safari 直接打开）
4. 进入测试扫码页面
5. 用另一个手机（或者电脑）生成二维码
6. 让 iPad 扫码
7. 确认能正常扫到、显示内容

**如果遇到问题（关键调试技巧）**：

1. 在 iPad Safari 直接打开调试网址（带 ?debug=1）：
   `https://你的用户名.github.io/treasure-hunt-pwa/test-scan.html?debug=1`
2. 点右下角齿轮打开 Eruda
3. 切到 Console 标签，看红色错误信息
4. **截图发给 Claude Code**（VS Code 扩展里直接拖图，或 CLI 里描述错误）

#### 关键观察指标

- **扫码识别速度**：户外可接受范围 1-3 秒
- **强光下的识别率**：可以拿到窗边试试
- **摄像头权限提示**：是否友好

#### 验证清单
- [ ] Eruda 调试工具在 iPad 上能用
- [ ] 本地浏览器扫码测试通过（如果有摄像头）
- [ ] 部署到 GitHub Pages 成功
- [ ] iPad 上从主屏幕打开 PWA，扫码功能正常
- [ ] 扫码识别速度可接受
- [ ] PROGRESS.md 已更新

#### 这一步的意义

**这是整个项目的"技术可行性"验证**。如果这一步走通，说明 PWA 方案完全可行。如果走不通（比如 iPad Safari 死活扫不出码），我们需要重新讨论方案。

---

## 🎯 阶段 1：产品设计

### [ ] T08. 阅读 PRD.md

**前置**：T07
**预计时间**：30 分钟阅读
**类型**：文档确认

#### 你要做的事

1. 在 VS Code 里打开 `docs/PRD.md`
2. 完整读一遍（用 Markdown 预览模式更舒服，快捷键 `Ctrl + Shift + V`）
3. 你会发现这是把咱们前几轮对话沉淀下来的完整产品需求
4. **划重点**：把你觉得"特别重要"的部分标记一下（VS Code 可以加 TODO 注释）
5. 如果有任何想修改、补充的，直接在文件里改

#### 【可选：让 Claude Code 帮你 review】

```
请读一下 docs/PRD.md，告诉我：
1. 有没有逻辑矛盾的地方
2. 有没有遗漏的关键场景
3. 哪些功能在 MVP 阶段优先级最高
4. 有没有技术实现上的潜在坑

只指出问题，不要直接改文件，让我们讨论后再修改。
```

#### 验证清单
- [ ] 完整读过 PRD.md
- [ ] 对每个功能模块有大致印象
- [ ] 记下了 1-3 个你最关注的功能（可以单独跟我讨论）

---

### [ ] T09. 用 Excalidraw 画线框图

**前置**：T08
**预计时间**：6-10 小时（分散到 4-5 天通勤完成）
**类型**：设计任务（你独立完成，不需要 Claude Code）

#### 你要做的事

1. 在 iPad 上 App Store 搜 Excalidraw，免费安装（或者用网页版 excalidraw.com，Windows / iPad 都能用）
2. 创建一个新文件，命名"寻宝游戏线框图"
3. 按下面的清单依次画线框图

#### 必画的页面清单（按 PRD §3.1 整理）

**【启动 & 通用】**（3 张）
1. 启动页（首屏 logo + 开始按钮）
2. 关卡选择页（关卡卡片列表）
3. 家长入口（长按角落 + 密码框）

**【编辑模式】**（5 张）
4. 关卡管理列表
5. 新建/编辑关卡表单
6. 点位列表（带拖拽排序）
7. 点位编辑表单（含提示文本、题目绑定）
8. 题库管理界面

**【游戏开局】**（3 张）
9. 人数选择
10. 玩家创建（头像拍摄 + 名字）
11. 队名设置 + 开始按钮

**【游戏进行中】**（6 张）
12. 当前点位提示页（含朗读按钮）
13. 扫码界面
14. 扫错码的友好提示
15. 答题页面（含求助按钮）
16. 答错的温柔提示
17. 答对后归属选择（多人）

**【拍照与求助】**（2 张）
18. 拍照留念界面
19. 求助弹窗

**【通关流程】**（5 张）
20. 通关庆典屏 1（团队总分 + 撒花）
21. 答题之星揭晓
22. 投票环节（其中一个奖项）
23. 保底奖揭晓
24. 合影墙 + 海报导出

#### 画图要求

- 每张用一个大方框代表屏幕（竖屏比例，比如 600×800）
- 里面用小方框代表元素，标注文字（"按钮：开始游戏"、"图片：地图"等）
- 元素之间用箭头标注跳转关系
- 不要追求美观，"看得懂"就行
- 通勤路上每天画 3-5 张，4-5 天完成

#### 【可选：让 Claude 网页版 review 你的线框图】

画到一半或全部画完时，可以截图发给 claude.ai 网页版（不是 Claude Code），让它帮你 review：
- 有没有遗漏的页面
- 跳转关系是否清晰
- 元素摆放有没有问题
- 文案有没有改进空间

#### 验证清单
- [ ] 至少画完 24 张核心线框图
- [ ] 每张图都标注清楚元素和功能
- [ ] 跳转关系（箭头）画清楚
- [ ] 导出为 PNG 或 PDF 保存到项目 docs/wireframes/ 文件夹

---

### [ ] T10. 整理每个页面的数据清单

**前置**：T09 至少完成 50%
**预计时间**：2-3 小时
**类型**：设计任务

#### 你要做的事

在 `docs/` 下创建一个新文件 `pages-data.md`，按页面列出每个页面需要的数据和操作。

#### 模板示例

```markdown
# 各页面数据清单

## 1. 启动页
**显示**：
- App 名称、副标题、Logo

**操作**：
- 点"开始游戏"按钮 → 跳转关卡选择页
- 长按右上角 3 秒 → 弹出家长密码框

**需要的数据**：无（静态页面）

---

## 2. 关卡选择页
**显示**：
- 所有关卡的卡片列表
  - 每个卡片：关卡名、点位数、上次游玩时间、缩略图

**操作**：
- 点击卡片 → 跳转人数选择页（携带 levelId）
- 长按卡片 → 弹出删除菜单（仅家长模式可见）

**需要的数据**：
- 所有关卡列表（从 IndexedDB 读取）

---

[继续每个页面...]
```

#### 【可选：让 Claude Code 帮你起草初稿】

```
请基于 docs/PRD.md 和 docs/wireframes/ 里的线框图（如果你能读到），帮我起草 docs/pages-data.md 的初版。

为每个页面列出：
- 显示元素
- 操作和跳转
- 需要的数据（哪些字段、从哪里来）

不要太详细，每个页面 5-10 行就够。完成后我会自己 review 和补充。
```

#### 验证清单
- [ ] 每个核心页面都列出了数据和操作
- [ ] 跨页面的数据传递清晰（如 levelId 怎么从 A 页传到 B 页）
- [ ] 文件保存到 `docs/pages-data.md`

---

### [ ] T11. 选定视觉风格

**前置**：T10
**预计时间**：1-2 小时
**类型**：设计决策

#### 你要做的事

在 `docs/` 下创建 `design-tokens.md`，记录所有视觉决策。

#### 做的决策

1. **配色方案**：
   - 去 https://coolors.co/ 或 https://colorhunt.co/ 找一组儿童友好的配色
   - 记录主色、辅助色、强调色、错误提示色、背景色的具体色号

2. **字体**：
   - 中文：系统默认无衬线（Windows 上是微软雅黑，iOS 上是苹方，会自动适配）
   - 英文：系统默认

3. **字号层级**：
   - 大标题、副标题、正文、提示文字的具体 px 值

4. **圆角**：
   - 按钮、卡片、图片的圆角值

5. **间距**：
   - 内边距、元素间距的基础值

6. **整体风格关键词**（选 1-2 个）：
   - 圆润 / 卡通 / 明亮 / 简约 / 清新 / 绘本风

#### 示例 design-tokens.md

```markdown
# 视觉设计规范

## 配色

### 主色
- 主色：#4A90E2（明亮蓝）
- 主色深：#3A7BC8
- 主色浅：#7BB0EE

### 辅助色
- 辅助色：#F5A623（暖橙）
- 强调色：#7ED321（鲜绿，用于"成功"）
- 错误色：#FF9F89（柔和粉橙，不刺眼）

### 中性色
- 背景色：#FFFFFF
- 卡片背景：#F8F9FA
- 文字主色：#2C3E50
- 文字次色：#6C757D
- 边框色：#E9ECEF

## 字号
- 大标题：32px
- 标题：24px
- 副标题：18px
- 正文：16px
- 提示：14px
- 按钮：18px

## 圆角
- 按钮：12px
- 卡片：16px
- 图片：8px

## 间距
- 基础间距：8px
- 标准间距：16px
- 大间距：24px
- 超大间距：32px

## 阴影
- 卡片阴影：0 2px 8px rgba(0,0,0,0.1)
- 浮起阴影：0 4px 12px rgba(0,0,0,0.15)

## 风格关键词
- 圆润、明亮、绘本风
```

**完成后**：把这个文件的内容补充到 `CLAUDE.md` 的 §8 章节。

#### 验证清单
- [ ] 配色组确定且写入 design-tokens.md
- [ ] 字号、圆角、间距规范明确
- [ ] CLAUDE.md §8 已更新

---

### [ ] T12. 阶段 1 总结与里程碑

**前置**：T11
**预计时间**：30 分钟
**类型**：里程碑确认

#### 【复制给 Claude Code 的指令】

```
我们完成了阶段 0 和阶段 1 的所有任务。请帮我做一次完整的检查和总结：

1. 检查项目结构是否完整：
   - CLAUDE.md、PRD.md、本任务清单都在
   - docs/PROGRESS.md 已更新
   - docs/wireframes/ 有线框图
   - docs/pages-data.md 有数据清单
   - docs/design-tokens.md 有视觉规范
   - index.html、manifest.json、service-worker.js、test-scan.html 都在
   - Eruda 已集成

2. 验证 PWA 还能正常工作：
   - 提醒我去 GitHub Pages 网址打开测试
   - 提醒我在 iPad 上测试

3. 写一份阶段 0-1 完成报告，放在 docs/MILESTONE_1.md，包含：
   - 完成的任务清单
   - 当前能做什么
   - 下一阶段（阶段 2 - MVP 开发）即将开始
   - 给我一些鼓励的话 😊

4. 更新 PROGRESS.md，标记阶段 0-1 完成
5. 帮我用 GitHub Desktop 做一次完整 commit + push，commit message 写"完成阶段 0-1"
```

#### 最后给自己

🎉 **庆祝时刻！**

如果你走到这一步，说明你已经：
- ✅ 拥有了完整的 Windows 开发环境
- ✅ 部署过第一个 PWA
- ✅ 在真 iPad 上跑过自己做的东西
- ✅ 验证过扫码这个核心功能
- ✅ 学会了用 Eruda 调试 iPad 网页
- ✅ 完成了产品的全面设计
- ✅ 跨过了 70% 想做 App 的人会放弃的关卡

**给自己买个奖励吧**——一杯好咖啡、一顿好饭、或者只是和孩子说"爸爸/妈妈在做一个给你玩的游戏哦"。

---

## 📌 完成阶段 0-1 后，下一步

完成本任务清单后，告诉 claude.ai 网页版："我完成了阶段 0-1，需要阶段 2-3 的任务清单"，我会基于你的实际进度，给你下一份"作战手册"（MVP 核心开发 + 多人模式，约 4-5 周内容）。

**如果中途遇到困难**：
- 复制问题描述 + Claude Code 的报错 → 发到 Claude.ai 网页版找我
- 我会根据当前情况调整后续计划

---

## 💡 一些跨任务的提醒

### 关于 git commit 节奏

每完成一个任务（T04、T05……），就让 Claude Code 帮你 commit + push 一次：

```
请帮我在 GitHub Desktop 里 commit + push 当前修改，
commit message 写：完成 T0X：[任务名]
```

或者你自己打开 GitHub Desktop 操作：
1. 左侧勾选所有修改的文件
2. 底部填 commit message
3. 点 "Commit to main"
4. 上方点 "Push origin"

这样以后随时能回到任何一个任务完成时的状态。

### 关于"卡住超过 30 分钟"的处理

如果你某个任务卡了 30 分钟还没解决，**不要硬扛**：

1. 把当前情况写清楚发给 Claude.ai 网页版
2. 包括：你想做什么、你做了什么、Claude Code 说了什么、报了什么错
3. 网页版 Claude 视角更全面，能从更高维度帮你诊断

### 关于切换模型

- **默认 Sonnet 4.6**：日常写代码、改 bug
- **遇到难题切 Opus 4.7**：在 Claude Code 里输入 `/model` 切换
- 解决问题后切回 Sonnet 4.6 节省额度

### 关于"想跳过某个任务"

任务之间是有依赖的，但偶尔可以灵活调整：
- ✅ T09（画线框图）可以和 T07（扫码试水）并行
- ✅ T10、T11 可以同时推进
- ❌ T04（Hello World）不能跳过，是后面所有任务的基础
- ❌ T07（扫码试水）+ Eruda 不能跳过，是技术可行性验证和后续 iPad 调试的基础

---

**祝你接下来 2 周顺利！我们阶段 2 见。** 🚀

> 配套文档：CLAUDE.md（项目说明）、PRD.md（产品需求）、Windows开发备忘.md（环境技巧）
