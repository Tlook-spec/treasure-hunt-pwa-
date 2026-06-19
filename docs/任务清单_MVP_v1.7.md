# 寻宝游戏 PWA - 任务清单(阶段 0 末 → MVP 结束,v1.7)

> 这份是你接下来 **3-4 个月** 的完整作战手册。
>
> **本版本基于 PRD v1.7 + Windows 11 + VS Code + Claude Code 优化**,涵盖从「阶段 0 收尾」到「MVP 完成」的全部任务。
>
> **使用方法**:
> 1. 按顺序执行任务,前置未完成不要跳
> 2. 每个任务的【操作指令】直接复制给 Claude Code(VS Code 扩展或 CLI 都行)
> 3. 完成后用【验证清单】检查
> 4. 在任务前的 `[ ]` 打钩 `[x]` 表示完成
> 5. 每完成 5-10 个任务后 commit + push 一次

---

## 📋 总览(从这里到 MVP 结束)

**阶段 0 收尾**(架构调整)
- ✅ T01-T07. 已完成(环境搭建 + Hello World + 扫码 PWA 试水)
- ✅ T08. 双站点架构调整

**阶段 1:产品设计**
- ✅ T09. 阅读 PRD v1.7
- ✅ T10. 用 Excalidraw 画线框图(按 v1.7 口径)
- ✅ T11. 整理每个页面的数据清单
- ✅ T12. 选定视觉风格
- ✅ T13. 阶段 0-1 总结里程碑

**MVP 开发(共 25 个任务,预估 5-6 周)**

**MVP 阶段 A:共享层(0.5-1 周)**
- ✅ M01. 安装第三方库的 CDN 链接 + 验证
- ✅ M02. 定义数据模型 + 短 ID 生成工具
- ✅ M03. IndexedDB 封装(Dexie + 运行时拦截)
- ✅ M04. JSON 导入导出工具(基础)
- ✅ M05. 6 位数字码工具（已并入 M02，code-generator.js）

**MVP 阶段 B:编辑端(2-2.5 周)**
- ✅ M06. 编辑端项目骨架 + 路由 + 导航
- [ ] M07. L1 探险 CRUD
- [ ] M08. L2 点位 CRUD + 上移下移 + 题目绑定
- [ ] M09. L3 题库 CRUD + 筛选(含 usedCount 维度)
- [ ] M10. CSV 批量导入题目
- [ ] M11. 单张二维码生成 + 打印
- [ ] M12. 应急小抄打印
- [ ] M13. JSON 整库导入导出
- [ ] M14. 删除引用保护
- [ ] M15. 编辑端联调测试

**MVP 阶段 C:游戏端(2-2.5 周)**
- [ ] M16. 游戏端 PWA 框架(动态缓存 SW)
- [ ] M17. 启动页 + 探险选择页 + 设置页
- [ ] M18. JSON 整库导入(游戏端)
- [ ] M19. 游戏主流程框架(开始 + 提示展示)
- [ ] M20. 扫码功能集成(html5-qrcode)
- [ ] M21. 数字码输入 + 「找不到?」按钮
- [ ] M22. L2 内多题连答主流程
- [ ] M23. 答题反馈 + 3 次容错 + 求助按钮
- [ ] M24. L2 通关拍合影 + 「继续扫码」按钮
- [ ] M25. 极简通关页
- [ ] M26. 自动保存 + 续玩

**MVP 阶段 D:联调 + 真实测试(0.5-1 周)**
- [ ] M27. 端到端联调(从家长建 L1 → iPad 玩通关)
- [ ] M28. 第一次真实户外测试 + 修 bug
- [ ] M29. 第二次真实户外测试 + 收尾
- [ ] M30. MVP 完成里程碑

---

## 💡 工作流约定

你接下来会同时用三个 Claude 相关工具,分工建议:

| 工具 | 主要用途 |
|------|---------|
| **claude.ai 网页版** | 讨论方案、问概念、调整计划(和我聊天的这个) |
| **VS Code 里的 Claude Code 扩展** | 主力开发——写代码、改代码、看文件 |
| **PowerShell 里的 Claude Code CLI** | 跑 git 命令、装包、长输出操作 |

**默认模型**:使用 **Sonnet 4.6** 处理日常开发;遇到难题或大型架构设计时切换到 **Opus 4.7**(输入 `/model` 切换)。

---

## ✅ 阶段 0 已完成回顾

### [x] T01-T08(已完成)

- T01-T03:GitHub 注册、VS Code+Claude Code 安装、项目初始化
- T04:Hello World PWA
- T05:部署到 GitHub Pages
- T06:iPad 添加到主屏幕
- T07:扫码功能 + Eruda 调试(iPad 真机验证)
- T08:双站点架构调整(admin/play/shared 三个子目录)

**T08 完成后的项目状态**:

```
treasure-hunt/
├── index.html              # 根入口页(两个端的链接)
├── README.md
├── .gitignore
├── CLAUDE.md               # v1.7
├── admin/                  # 编辑端(占位 index.html)
├── play/                   # 游戏端(T04-T07 的文件搬到这里)
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   ├── test-scan.html
│   └── ...
├── shared/                 # 共享代码(暂空)
└── docs/
    ├── PRD.md              # v1.7
    ├── PROGRESS.md
    ├── 版本路线图.md       # v1.7
    └── 任务清单_v1.7.md    # 本文档
```

---

## 🎯 阶段 1:产品设计

### [√] T09. 阅读 PRD v1.7

**前置**:T08 完成
**预计时间**:30-60 分钟阅读
**类型**:文档确认

**你要做的事**:

1. 在 VS Code 里打开 `docs/PRD.md`
2. 用 Markdown 预览模式完整读一遍(快捷键 `Ctrl + Shift + V`)
3. **重点关注 v1.7 相比 v1.6 的变化**(见 §10 文档更新记录的 v1.7 条目,共 16 项)
4. 划重点:
   - §1.3 + §1.4:双站点架构 + 设计哲学(CDN 优先新增)
   - §3.2:MVP 范围(已极度收敛)
   - §3.2 末尾:已确认永远不做的功能(11 项删除)
   - §4.1:编辑端详细(注意 MVP 不显示地图字段)
   - §4.2:游戏端详细(注意「输入数字码」和「找不到?」最终行为一致)
   - §6:数据模型(短 ID 生成方式 + 物理隔离运行时拦截)
   - §6.7:JSON Envelope(MVP schemaVersion = "1.0")

**【可选:让 Claude Code 帮你 review】**

```
请读一下 docs/PRD.md(v1.7)和 docs/CLAUDE.md(v1.7),告诉我:
1. 有没有逻辑矛盾或前后不一致的地方
2. v1.7 相比 v1.6 的 16 项变化是否清晰
3. MVP 范围划分是否合理
4. 还有哪些技术实现上的潜在坑

只指出问题,不要直接改文件。我们讨论后再决定是否修改。
```

**验证清单**:

- [ ] 完整读过 PRD v1.7
- [ ] 理解双站点(admin/play)的分工
- [ ] 理解三层结构(L1=探险,L2=点位多题,L3=题目)
- [ ] 知道 v1.7 永远不做的 11 项功能(不要在 MVP 里实现)
- [ ] 知道 MVP 阶段编辑端 UI 不显示地图字段
- [ ] 理解短 ID 生成方式(时间戳+随机)
- [ ] 记下了 1-3 个你最关注的功能或疑问

---

### [√] T10. 画核心页面线框图

**前置**:T09
**预计时间**:6-10 小时(分散到 4-5 天通勤完成)
**类型**:设计任务(你独立完成,不需要 Claude Code)

**你要做的事**:

1. iPad 上 App Store 搜 Excalidraw,免费安装(或者用网页版 excalidraw.com)
2. 创建新文件,命名「寻宝游戏线框图 v1.7」
3. 按下面的清单依次画

**v1.7 线框图清单(17+张,按双站点 + MVP 范围)**:

**【编辑端 admin/】**(7 张,MVP 范围)

1. 编辑端首页 / 导航(左侧菜单 + 右侧主区域)（不画了，直接嵌进每张图的左侧栏）
2. L1 探险列表(卡片列表 + 「新建探险」按钮)
3. 新建 / 编辑 L1 表单(探险名、简介、推荐人数、年龄段、主题色,**不含地图字段**，含 L2 点位列表 + 排序 + 「打印二维码」+ 「打印应急小抄」按钮)
4. 编辑 L2 表单(含题目绑定区 + 上移下移题目顺序 ,**不含地图坐标和文案**)
5. 题库管理主页(筛选条 + 题目列表 + usedCount 显示 + **usedCount 筛选维度**+删除引用保护拒绝弹窗)
6. 新建 / 编辑题目表单(题干、选项、答案、标签等)
7. CSV 批量导入流程页(上传 → 预览 → 确认 → 结果)+ **UTF-8 教学截图**
8. JSON 导入导出页(整库覆盖,**MVP 不显示「单 L1」选项**)


**【游戏端 play/】**(10 张,MVP 范围)

1. 启动页(开始游戏 + 设置入口)
2. 探险选择页(卡片列表，包括续玩横幅)
3. 开始冒险页(探险名+探险简介 + 大按钮,**MVP 跳过故事背景页**)
3a. L2 提示展示页(第 N 站 + 提示文本 + 扫码按钮)
4. 扫码界面(取景框 + 「输入数字码」+ 「找不到?」按钮)
5. 扫码报错弹窗合集(4个状态)
6. 扫码成功开始答题页面（L2本站扫码成功提示+ 开始答题按钮）
7. 答题页面(题目 + 选项 + 求助按钮 + 「第 N / M 题」进度,**右上角求助按钮**)
7a. 答题弹窗合集（答对、答错、求助、点求助按钮但已经没有求助测试四种状态）
8. L2完成（下一站衔接）L2 通关拍合影页(拍照按钮 + 跳过按钮)+ **拍完后的下一站衔接**
9. 极简通关页(撒花 + 总分 + 用时 + L2 合影集 + 返回首页)
10. 设置 / 导入数据页

**MVP 单人版不画的(推到 V1)**:

- 人数选择
- 玩家创建(头像)
- 队名设置
- 答题归属选择
- 投票环节
- 颁奖典礼
- 故事背景页
- 地图相关页面(标记编辑器、扫码后地图浮现、盖章动画、通关页全亮地图)

**画图要求**:

- 每张用一个大方框代表屏幕
- 编辑端用横向方框(桌面),游戏端用竖向方框(iPad 竖屏)
- 里面用小方框代表元素,标注文字
- 元素之间用箭头标注跳转关系
- 不要追求美观,「看得懂」就行

**画到一半或全部完成时**,可以截图发给 claude.ai 网页版让我帮你 review。

**验证清单**:

- [ ] 至少画完 17 张核心线框图
- [ ] 编辑端和游戏端**清晰分开**
- [ ] L2 内多题连答的流程清晰
- [ ] 每个 L2 通关合影的位置清楚
- [ ] 「输入数字码」和「找不到?」两个按钮区别清楚(语义不同但都进答题)
- [ ] 拍照后「继续扫码」按钮位置清楚
- [ ] 跳转关系(箭头)画清楚
- [ ] 导出为 PNG 或 PDF 保存到 `docs/wireframes/` 文件夹

---

### [√] T11. 整理每个页面的数据清单

**前置**:T10 至少完成 50%
**预计时间**:2-3 小时
**类型**:设计任务

**你要做的事**:

在 `docs/` 下创建一个新文件 `pages-data.md`,按页面列出每个页面需要的数据和操作。

**模板示例**:

```markdown
# 各页面数据清单(MVP)

## 编辑端 admin/

### 1. 编辑端首页
**显示**:
- App 名称、导航菜单(探险/题库/导入导出)

**操作**:
- 点击导航 → 跳到对应页

**需要的数据**:无(静态导航)

---

### 2. L1 探险列表
**显示**:
- 所有 L1 探险的卡片列表
  - 每张卡片:探险名、L2 点位数、上次编辑时间

**操作**:
- 点击卡片 → 进入 L1 详情页
- 「新建探险」按钮 → 弹出新建表单
- 长按卡片 → 删除选项(经引用保护检查)

**需要的数据**:
- 所有 Level 列表(从 IndexedDB 读取)
- 每个 Level 关联的 Point 数量(查 Point 表 where levelId)

---

## 游戏端 play/

### 13. 探险选择页
**显示**:
- 所有探险的卡片列表
  - 每张:探险名、L2 点位数、上次游玩

**操作**:
- 点击卡片 → 跳转开始冒险页(携带 levelId)

**需要的数据**:
- 所有 Level 列表(从 IndexedDB 读取)
- 当前游戏会话状态(判断是否有未完成游戏)

---

[继续每个页面...]
```

**【可选:让 Claude Code 帮你起草初稿】**

```
请基于 docs/PRD.md(v1.7)和 docs/wireframes/ 里的线框图,
帮我起草 docs/pages-data.md 的初版。

为每个页面(admin/ 和 play/ 都要)列出:
- 显示元素
- 操作和跳转
- 需要的数据(哪些字段、从哪里来)

不要太详细,每个页面 5-10 行就够。完成后我会自己 review 和补充。
注意:MVP 阶段编辑端 UI 不显示地图字段。
```

**验证清单**:

- [ ] 编辑端每个页面都有数据清单
- [ ] 游戏端每个页面都有数据清单
- [ ] 跨页面的数据传递清楚(如 levelId 怎么传递)
- [ ] 文件保存到 `docs/pages-data.md`

---

### [√] T12. 选定视觉风格

**前置**:T11
**预计时间**:1-2 小时
**类型**:设计决策

**你要做的事**:

在 `docs/` 下创建 `design-tokens.md`,记录所有视觉决策。

**做的决策**:

1. **配色方案**:
   - 去 https://coolors.co/ 或 https://colorhunt.co/ 找一组儿童友好的配色
   - 记录主色、辅助色、强调色、错误提示色、背景色的色号

2. **字体**:
   - 中文:系统默认无衬线(Windows 微软雅黑 / iOS 苹方)
   - 英文:系统默认

3. **字号层级**:
   - 大标题、副标题、正文、提示文字的 px 值

4. **圆角**:
   - 按钮、卡片、图片的圆角值

5. **间距**:
   - 内边距、元素间距的基础值

6. **整体风格关键词**(选 1-2 个):
   - 圆润 / 卡通 / 明亮 / 简约 / 清新 / 绘本风

**编辑端 vs 游戏端**:

- 编辑端可以稍微「专业」一些(毕竟家长用)
- 游戏端要「儿童友好」(孩子用,按钮大、色彩明亮、动画活泼)
- 两端共用相同的色系,但风格略有差异

**示例 design-tokens.md**:

```markdown
# 视觉设计规范

## 配色

### 主色
- 主色:#4A90E2(明亮蓝)
- 主色深:#3A7BC8
- 主色浅:#7BB0EE

### 辅助色
- 辅助色:#F5A623(暖橙)
- 强调色:#7ED321(鲜绿,用于"成功")
- 错误色:#FF9F89(柔和粉橙,不刺眼)

### 中性色
- 背景色:#FFFFFF
- 卡片背景:#F8F9FA
- 文字主色:#2C3E50
- 文字次色:#6C757D
- 边框色:#E9ECEF

## 字号
- 大标题:32px
- 标题:24px
- 副标题:18px
- 正文:16px
- 提示:14px
- 按钮:18px

## 圆角
- 按钮:12px
- 卡片:16px
- 图片:8px

## 间距
- 基础间距:8px
- 标准间距:16px
- 大间距:24px
- 超大间距:32px

## 阴影
- 卡片阴影:0 2px 8px rgba(0,0,0,0.1)
- 浮起阴影:0 4px 12px rgba(0,0,0,0.15)

## 风格关键词
- 编辑端:简约、清新、专业
- 游戏端:圆润、明亮、绘本风、有童趣
```

**完成后**:把这个文件的内容也补充到 `CLAUDE.md` 的 §9 章节。

**验证清单**:

- [ ] 配色组确定且写入 design-tokens.md
- [ ] 字号、圆角、间距规范明确
- [ ] 编辑端 vs 游戏端的风格差异说清楚
- [ ] CLAUDE.md §9 已更新

---

### [√] T13. 阶段 0-1 总结里程碑

**前置**:T12
**预计时间**:30 分钟
**类型**:里程碑确认

**【复制给 Claude Code 的指令】**

```
我们完成了阶段 0 和阶段 1 的所有任务(T01-T12),请帮我做一次完整检查和总结:

1. 检查项目结构是否完整:
   - 根目录:CLAUDE.md(v1.7)、README.md、index.html
   - admin/:占位 index.html
   - play/:完整的 PWA(T07 的扫码测试)
   - shared/:空(MVP 阶段填充)
   - docs/:PRD.md(v1.7)、PROGRESS.md、版本路线图.md(v1.7)、
            wireframes/ 目录（含 source.excalidraw + admin/ + play/ + flow/ 子目录）、pages-data.md、design-tokens.md、本任务清单

2. 验证 PWA 还能正常工作:
   - 提醒我去 GitHub Pages 网址打开测试
   - 提醒我在 iPad 上从主屏幕图标打开测试

3. 写一份阶段 0-1 完成报告,放在 docs/MILESTONE_0-1.md,包含:
   - 完成的任务清单(T01-T12)
   - 当前项目能做什么
   - 下一阶段(MVP 开发)即将开始
   - 给我一些鼓励的话 😊

4. 更新 docs/PROGRESS.md,标记阶段 0-1 完成

5. 帮我做一次完整 commit + push,commit message:
   "完成阶段 0-1:环境搭建 + 双站点架构 + 产品设计 v1.7"
```

**最后给自己**:

🎉 **庆祝时刻!**

走到这里你已经:

- ✅ 拥有完整的 Windows 开发环境
- ✅ 部署过 PWA 到 GitHub Pages
- ✅ 在真 iPad 上跑过自己做的东西
- ✅ 验证过扫码这个核心功能
- ✅ 学会用 Eruda 调试 iPad 网页
- ✅ 完成了双站点架构调整
- ✅ 完成了 v1.7 的产品全面设计
- ✅ 跨过了 70% 想做 App 的人会放弃的关卡

给自己买个奖励吧——一杯好咖啡、一顿好饭、或者只是和孩子说「爸爸/妈妈在做一个给你玩的游戏哦」。

---

# 🚀 MVP 开发(M01-M30,5-6 周)

> 从这里开始进入 MVP 开发。**严格遵守串行推进原则**:共享层 → 编辑端 → 游戏端 → 联调 → 测试。
>
> **MVP 总目标**:5-6 周内,孩子能玩通一个完整 L1 探险(3-5 个 L2,每个 L2 多题,通关合影,极简通关页)。

## 🟦 MVP 阶段 A:共享层(M01-M05,0.5-1 周)

> 共享层是 admin/ 和 play/ 都要用的基础设施。先把地基打好,后面才能稳。

---

### [√] M01. 安装第三方库的 CDN 链接 + 验证

**前置**:T13
**预计时间**:1-2 小时
**类型**:基础设施

**目的**:用 CDN 引入 PRD 选定的 5 个第三方库,验证浏览器能加载。

**【复制给 Claude Code 的指令】**

```
我们开始 MVP 开发。第一步是把 PRD v1.7 §3 + CLAUDE.md §3 选定的 5 个第三方库
通过 CDN 引入到项目里，先验证浏览器能加载。

请做以下事情：

1. 在 shared/libs/ 下创建一个 README.md，说明：
   - MVP 阶段不本地化库，统一通过 CDN 引入
   - 列出 5 个库 + 固定版本号 + CDN URL
   - 提醒「必须用固定版本号，不要用 @latest」

2. 创建一个临时验证页面 shared/test-libs.html，用 CDN 加载这 5 个库：
   - Dexie.js @3.2.4
   - html5-qrcode @2.3.8
   - qrcode-generator @2.0.4
   - PapaParse @5.4.1
   - Eruda @3.0.1（只在网址带 ?debug=1 时才加载）

   页面显示：
   - 前 4 个库各显示「名称 + 版本号 + 已加载 ✅ / 加载失败 ❌」
   - 简单调用每个库的 API 验证可用（如 new Dexie('test')、Papa.parse 等）
   - Eruda 单独处理：没带 ?debug=1 时显示「访问 ?debug=1 时才加载」（不是红叉），
     带 ?debug=1 时再检查是否加载成功 ✅

3. 启动本地服务器让我访问 http://localhost:8000/shared/test-libs.html。
   注意：我是 Windows 11，零基础，不确定电脑上装没装 Python。
   请你先检测我电脑上有什么（Python 或 Node 都行），用能跑的那个启动，
   并把具体的 PowerShell 启动命令直接告诉我，让我自己也会启动。

4. 我验证 5 个库都 OK 后，删除 shared/test-libs.html（临时验证用）。

5. 更新 docs/PROGRESS.md：M01 完成。
```

**验证清单**:

- [ ] shared/libs/README.md 创建,记录 5 个库 + CDN URL
- [ ] 本地访问验证页 → 5 个库都显示加载成功
- [ ] 临时验证页已删除
- [ ] PROGRESS.md 更新

---

### [√] M02. 定义数据模型 + 短 ID 生成工具

**前置**:M01
**预计时间**:2-3 小时
**类型**:核心代码

**目的**:在 `shared/` 下定义所有数据结构和短 ID 工具。

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §6,在 shared/ 下创建以下文件:

1. shared/models/types.js
   - 用 JSDoc 注释定义所有数据结构(Level、Point、Question、Player、GameSession、PhotoBlob)
   - 注意:MVP 数据模型预留地图字段(默认 null)和故事字段(默认空字符串)
   - 字段名严格遵守 PRD §6.1-6.6

2. shared/utils/id.js
   - 实现 generateId(prefix) 函数,见 PRD v1.7 §6.0
   - 用 `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2,4)}`
   - 导出 ES Module 格式

3. shared/utils/code-generator.js
   - 实现 generateSixDigitCode():返回 6 位随机数字字符串(可能 0 开头,如 "048293")
   - 实现 isCodeUnique(code, existingCodes):检查是否唯一

4. 写一个简单的测试页面 shared/test-utils.html,
   验证 generateId 和 generateSixDigitCode 跑起来正常,
   能在 Console 看到生成的 ID 和数字码。

5. 全部用 ES Module 语法(import/export),
   admin/play 入口 HTML 用 <script type="module">。

6. 验证通过后删除 shared/test-utils.html。

7. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] shared/models/types.js 创建,所有结构定义齐全
- [ ] shared/utils/id.js 创建,ID 生成正确(如 `lvl_lq2nx8j2_a3kf`)
- [ ] shared/utils/code-generator.js 创建,6 位数字码生成正确
- [ ] 测试通过,临时验证页删除
- [ ] PROGRESS.md 更新

---

### [√] M03. IndexedDB 封装(Dexie + 运行时拦截)

注意:admin-db.js / play-db.js 里直接用全局 Dexie(new Dexie(...)),不要 import dexie。
test-db.html 里 Dexie 用普通 <script> 标签加载。
**前置**:M02
**预计时间**:3-4 小时
**类型**:核心代码 + 安全机制

**目的**:封装 Dexie 数据库 + 实现物理隔离的运行时拦截。

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §6.0 + CLAUDE.md §4.1,在 shared/db/ 下创建以下文件:

1. shared/db/db-config.js
   - 定义 ADMIN_DB_NAME 和 PLAY_DB_NAME 常量
   - 实现 assertDbContext(dbName) 函数(运行时拦截)
   - 见 PRD v1.7 §6.0 的示例代码

2. shared/db/admin-db.js
   - 用 Dexie 打开 admin 数据库
   - 调用 assertDbContext(ADMIN_DB_NAME) 拦截非 admin 路径
   - 定义表结构(见 PRD §6.0):
     levels:    'id, name, updatedAt'
     points:    'id, levelId, order, code'
     questions: 'id, subject, difficulty, usedCount'
   - 导出 db 实例供 admin/ 使用

3. shared/db/play-db.js
   - 用 Dexie 打开 play 数据库
   - 调用 assertDbContext(PLAY_DB_NAME)
   - 定义表结构(见 PRD §6.0):
     levels:    'id, name'
     points:    'id, levelId, code'
     questions: 'id'
     sessions:  'id, levelId, status, startedAt'
     photos:    'id, type, ownerId'
   - 导出 db 实例供 play/ 使用

4. 写一个验证页面 shared/test-db.html:
   - 模拟在 admin/ 路径访问 admin-db → 应成功
   - 模拟在 play/ 路径访问 admin-db → 应抛错
   - 把验证结果显示在页面上

5. 验证通过后删除 shared/test-db.html。

6. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] shared/db/db-config.js 创建,包含拦截函数
- [ ] shared/db/admin-db.js 和 play-db.js 创建,表结构正确
- [ ] 拦截机制能阻止跨端访问(测试通过)
- [ ] 临时验证页删除
- [ ] PROGRESS.md 更新

---

### [√] M04. JSON 导入导出工具(基础)

**前置**:M03
**预计时间**:3-4 小时
**类型**:核心代码

**目的**:实现 JSON Envelope 的导入导出函数,两端通用。

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §6.7,在 shared/utils/ 下创建 json-io.js:

1. 实现 exportFull(db) 函数:
   - 从指定 db 读所有 levels、points、questions
   - 包装成 PRD §6.7 定义的 Envelope 格式:
     {
       "schemaVersion": "1.0",
       "exportedAt": Date.now(),
       "exportType": "full",
       "data": {
         "levels": [...],
         "points": [...],
         "questions": [...]
       }
     }
   - 返回 JSON 字符串

2. 实现 validateJson(jsonString) 函数:
   - 解析 JSON
   - 检查 schemaVersion 字段存在
   - 检查 schemaVersion === "1.0"(MVP)
   - 检查 exportType === "full"(MVP)
   - 检查 data.levels / points / questions 字段存在
   - 返回 { ok: true, data } 或 { ok: false, error: "..." }

3. 实现 importFull(db, validatedData) 函数:
   - 清空 db 的 levels、points、questions 表
   - 批量插入 validatedData 的内容
   - 返回插入的记录数

4. 写一个简单的 unit test 页面 shared/test-json.html:
   - 创建几条假数据
   - 调用 exportFull → 输出 JSON 字符串到页面
   - 把字符串 parse 回来 → validateJson → importFull 到新 db
   - 验证数据完整

5. 验证通过后删除测试页。

6. 更新 PROGRESS.md。

注意:不要在这里实现单 L1 导出/导入逻辑(那是 V1 的事)。
```

**验证清单**:

- [ ] shared/utils/json-io.js 创建
- [ ] exportFull / validateJson / importFull 三个函数完整
- [ ] schemaVersion 检查能拒绝无效文件
- [ ] 端到端导出 → 导入测试通过
- [ ] 临时验证页删除
- [ ] PROGRESS.md 更新

---

### [√] M05. 6 位数字码工具(已在 M02 一并完成)

> 此任务已合并入 M02。无需单独执行,跳过即可。

[ ] M05 跳过(并入 M02)。

---

## 🟩 MVP 阶段 B:编辑端(M06-M15,2-2.5 周)

> 编辑端是家长在电脑/iPad 浏览器里使用的网页(**不是 PWA**)。
>
> 完成顺序:骨架 → L1 → L2 → 题库 → CSV → 二维码 → 应急小抄 → JSON → 引用保护 → 联调测试。

---

### [√] M06. 编辑端项目骨架 + 路由 + 导航

**前置**:M04
**预计时间**:2-3 天
**类型**:UI 框架

**【复制给 Claude Code 的指令】**

```
开始 MVP 阶段 B:编辑端开发。第一步搭骨架。

请基于 PRD v1.7 §4.1.1 + design-tokens.md,在 admin/ 下创建:

1. admin/index.html
   - 加载 shared/ 的依赖(用 <script type="module">)
   - 加载 Dexie CDN(普通 <script> 标签,放在自己的 <script type="module"> 之前)
   - 顶部 logo + 标题「寻宝游戏 - 编辑端」
   - 左侧导航(桌面端固定):
     📝 探险管理
     📚 题库管理
     🔄 导入导出
   - 移动端 ≤ 768px:汉堡菜单
   - 主区域显示当前路由对应的页面

2. admin/scripts/router.js
   - 实现简单的 hash 路由(#/levels、#/questions、#/import-export)
   - 默认进入 #/levels

3. admin/styles/main.css
   - 用 design-tokens.md 的色值和字号
   - 响应式断点 768px

4. admin/pages/ 下创建占位文件:
   - levels.html(L1 探险管理,先放占位文字)
   - questions.html(题库管理,占位)
   - import-export.html(导入导出,占位)

5. 启动本地服务器让我访问 http://localhost:8000/admin/。
   用 M01 那次确认过、我电脑上能跑的那个命令(Python 或 Node),
   并把启动命令再贴给我一次。验证导航能跳转、布局正常。

6. F12 Console 看不到红色错误。

7. 写一份手动测试 checklist 到 docs/test-checklists/MVP-admin-骨架.md。

8. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] admin/index.html + 导航 + 路由跑起来
- [ ] 桌面端布局正常,移动端汉堡菜单工作
- [ ] 3 个页面能跳转
- [ ] F12 无报错
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M07. L1 探险 CRUD

**前置**:M06
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §4.1.2 实现 L1 探险的 CRUD(增删改查):

1. admin/pages/levels.html
   - 顶部「➕ 新建探险」按钮
   - 卡片列表显示所有 L1
     - 每张卡片:探险名、L2 点位数、上次编辑时间
     - 操作:进入详情、编辑、复制、删除
   - 空状态:显示「还没有探险,点击右上角新建」

2. admin/scripts/level-form.js
   - 新建 / 编辑 L1 表单(弹窗或新页面均可)
   - 字段(只这 5 个,**不显示地图字段、故事字段**):
     * 探险名称(必填)
     * 简介(选填)
     * 推荐人数(MVP 默认 1,V1 用)
     * 推荐年龄段(下拉:4-6 / 7-9 / 10-12)
     * 主题色(预设几个色块选择)
   - 提交时:
     - 新建:用 generateId("lvl") 生成 ID,createdAt = updatedAt = Date.now()
     - 编辑:保留原 id,只更新 updatedAt
     - 调用 adminDb.levels.put(level)
   - **数据模型中预留 openingStory、endingStory、mapImage 等字段(默认 null/空)**

3. admin/scripts/level-detail.js
   - L1 详情页:显示 L1 基本信息 + 该 L1 的 L2 点位列表占位(M08 实现)
   - 「打印二维码」「打印应急小抄」按钮占位(M11、M12 实现)

4. 删除:弹「确定删除『XX』吗?这会同时删除其中所有点位」二次确认,确认后级联删除 L1 + 关联 Point

5. 复制 L1:深拷贝 L1 + 所有 Point,规则:
   - L1 和每个 Point 都生成新 ID,Point 的 levelId 指向新 L1
   - 每个复制出来的 Point 必须用 generateSixDigitCode + isCodeUnique 重新生成
     新的 6 位码(不能和已有点位重复,否则扫码冲突)
   - Point 的 questionIds 保持指向原来的题目(题库是共享的,不要复制题目)
   - 新 L1 名字加「(副本)」

6. 写测试 checklist:docs/test-checklists/MVP-admin-L1CRUD.md

7. 真机测试(桌面)
   - 桌面 Chrome:建 → 编 → 删 → 复制 流程跑通

8. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] L1 列表显示正常
- [ ] 新建 L1 表单只有 5 个字段(不含地图)
- [ ] 编辑、复制、删除都工作
- [ ] 删除时级联删除关联 Point(后续 M08 验证)
- [ ] iPad Safari 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M08. L2 点位 CRUD + 上移下移 + 题目绑定

**前置**:M07
**预计时间**:4-5 天
**类型**:核心功能(MVP 最复杂的之一)

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/admin/03-l2-edit.png(L2编辑表单) + docs/wireframes/admin/02-l1-form-and-detail.png(点位列表区)
参考数据:docs/pages-data.md A3 小节(字段名和 Dexie 查询以此为准,包括 locationHint、discoveryText 的语义)

请基于 PRD v1.7 §4.1.3 实现 L2 点位的 CRUD + 题目绑定:

1. 在 L1 详情页(M07)显示 L2 点位列表:
   - 按 order 升序
   - 每行:序号、点位名称、题目数、上移/下移按钮、编辑、删除按钮
   - 顶部「➕ 添加点位」按钮

2. L2 编辑表单(弹窗或新页面):
   - 字段(只这 4 部分,**不显示地图坐标、3 段文案**):
     * 序号(自动)
     * 点位名称(必填,如「小区凉亭」)
     * 家长备忘(选填,如「贴在凉亭东侧第三根柱子上」)
     * 下一点提示(给孩子看,多行文本)
     * L2 包含的题目(题目绑定区,见下)
   - 数据模型预留 mapX、mapY、discoveryText、questionIntroText、completionText(默认 null/空)

3. 题目绑定区:
   - 显示已绑定的题目列表(题干前 30 字 + 移除按钮)
   - 「➕ 从题库添加题目」按钮 → 弹出题库选择面板
     - 面板含简单筛选:学科、难度
     - 列出所有题目,勾选要添加的
     - 确认后 questionIds 数组追加
   - 添加题目后,该题的 usedCount += 1(写入 questions 表)
   - 移除题目后,**usedCount 不减**(消耗式设计)
   - 题目顺序:上移/下移按钮调整(决定答题顺序)

4. 新建 L2 时:
   - generateId("pt") 生成 ID
   - 关联 levelId
   - generateSixDigitCode() 生成 6 位数字码,检查与 points 表所有 code 冲突,冲突重新生成
   - 默认 order = 当前 L1 内最大 order + 1

5. 上移/下移按钮:swap 当前和相邻 Point 的 order 字段

6. 删除 L2:
   - 弹「确定删除『XX』吗?」二次确认
   - 删除该 Point,**关联题目的 usedCount 不减**(消耗式)
   - 后续点位 order 自动收紧(可选优化)

7. 写测试 checklist:docs/test-checklists/MVP-admin-L2CRUD.md
   - 测试:建 L2 → 绑题 → 上移下移 → 删除 → 检查 usedCount 不减

8. 真机测试(桌面 + iPad Safari)。

9. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] L2 列表显示正常,按 order 排序
- [ ] L2 编辑表单不显示地图坐标和 3 段文案
- [ ] 题目绑定 → questions 表的 usedCount +1
- [ ] 题目移除 → usedCount 不减
- [ ] 上移/下移正确
- [ ] 删除 L1 时关联 L2 也被删(M07 联动)
- [ ] 6 位数字码生成无冲突
- [ ] iPad Safari 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M09. L3 题库 CRUD + 筛选(含 usedCount 维度)

**前置**:M08
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/admin/04-l3-list.png(题库主页) + docs/wireframes/admin/05-l3-form.png(题目表单)
参考数据:docs/pages-data.md A4、A5 小节(字段名和操作逻辑以此为准)

请基于 PRD v1.7 §4.1.4 实现题库 CRUD:

1. admin/pages/questions.html
   - 顶部筛选条:
     * 学科(下拉)
     * 难度(1/2/3 星)
     * 年龄段(下拉)
     * **使用次数(0次 / 1次 / 2+次)** ← v1.7 新增维度
     * 搜索框(搜题干)
   - 题目列表:
     * 每行:题干前 30 字、标签、难度、usedCount(用🔵🟡🟠区分)
     * 默认按 usedCount 升序(未用过的优先)
     * 操作:编辑、删除、复制
   - 顶部按钮:「➕ 新建题目」「📥 CSV 导入」「📤 CSV 导出」

2. 新建 / 编辑题目表单(只 MVP 题型:单选 + 判断):
   - 学科(下拉)
   - 难度(1-3 星)
   - 年龄段(下拉)
   - 题型(单选 / 判断,MVP 只这两种)
   - 题干(多行文本)
   - 选项:动态行(单选 2-4 个,判断只 2 个)
   - 正确答案:存字母('A'/'B'/'C'/'D',与 CSV 模板、答题页保持一致;
     判断题用 'A'/'B' 表示 对/错)。
     ⚠️ 必须与已有测试题的 correctAnswer 格式一致(我库里现有的题存的就是字母如 'C')
   - 提示(选填)
   - 解析(选填)
   - **MVP 不显示 imagePath / textImagePath 字段**(默认 null)

3. 删除:
   - 引用保护检查(此处先实现简单版:扫描所有 Point 的 questionIds)
   - 有引用 → 弹拒绝对话框(提示被哪些 L2 引用,先去解除)
   - 无引用 → 弹「确定删除吗?」→ 确认即删

4. CSV 导入按钮:**先做占位**(点击提示「CSV 导入功能将在 M10 实现」或按钮置灰),
     不要现在实现导入逻辑(那是 M10 的任务)。
   CSV 导出按钮:导出所有题目为 CSV(用 PapaParse.unparse,正常实现)。
   注意:PapaParse 直接用全局 Papa(Papa.unparse(...)),不要 import papaparse。

5. 复制题目:深拷贝,新 ID(generateId('q')),usedCount 重置为 0

6. 写测试 checklist:docs/test-checklists/MVP-admin-L3CRUD.md

7. 真机测试(桌面 Chrome 为主)。

8. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] 题库列表显示正常,筛选工作
- [ ] usedCount 筛选(0/1/2+)正确
- [ ] 默认按 usedCount 升序
- [ ] 表单不含 imagePath 字段
- [ ] 删除被引用的题目 → 拒绝
- [ ] CSV 导出工作
- [ ] iPad Safari 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M10. CSV 批量导入题目

**前置**:M09
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/admin/06-csv-import.png
参考数据:docs/pages-data.md A6 小节

请基于 PRD v1.7 §4.1.4「CSV 批量导入流程」实现:

1. CSV 模板下载按钮 → 触发下载一个 UTF-8 with BOM 的 CSV 模板文件
   - 表头:学科、难度、年龄段、题型、题干、选项A、选项B、选项C、选项D、正确答案、提示、解析
   - 1-2 行示例数据
   - 模板「正确答案」列填字母(A/B/C/D;判断题填 A/B 代表 对/错), 与 M09 题库的 correctAnswer 字母格式一致
  
   

2. CSV 导入页面(在题库页弹窗或新页面):
   - 大字提示框(显著位置):
     "⚠️ Windows Excel 默认保存的 CSV 是 GBK 编码,会导致中文乱码!
      正确做法:Excel → 另存为 → 选择「CSV UTF-8(逗号分隔)」
      Mac Numbers 默认就是 UTF-8,直接导出即可。"
   - **教学截图占位**(图文教学,你后续手动加截图):
     - Excel 截图 1:展开「另存为」对话框
     - Excel 截图 2:格式下拉选「CSV UTF-8」
   - 文件选择按钮(只接受 .csv)
   - 上传后用 PapaParse.parse 解析(按 UTF-8)
   注意:直接用全局 Papa(Papa.parse(...)),不要 import papaparse。
   - 预览前 5 行(表格显示)
   - 如果预览显示乱码(中文变 ??? 或锟斤拷):提示「文件不是 UTF-8 编码,请按上面教学重新保存」
   - 「确认导入」按钮:
     - 逐行解析为 Question 对象
     - generateId("q") 生成 ID(不用再写 usedCount,引用数由系统实时计算)
     - 写入 questions 表
     - 单行错误不影响其他行(catch 错误,记录失败原因)
     - 显示「成功 X 道,失败 Y 道(行号 + 原因)」
     - 导入解析时,正确答案按字母存,与现有题目格式统一

3. **不引入 jschardet 等编码检测库**(v1.7 明确禁止)

4. 写测试 checklist:docs/test-checklists/MVP-admin-CSV导入.md
   - 用 Excel 创建 UTF-8 CSV → 导入成功
   - 用 Excel 创建 GBK CSV → 预览显示乱码 → 提示重保存

5. 真机测试。

6. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] CSV 模板能下载,UTF-8 with BOM
- [ ] 导入页面有显著的 UTF-8 提示文案
- [ ] PapaParse 解析正常
- [ ] 预览前 5 行
- [ ] 乱码时提示重保存
- [ ] 成功/失败统计正确
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M11. 单张二维码生成 + 打印

**前置**:M10
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §4.1.5 实现二维码生成 + 打印:

1. 单张二维码生成:
   - L2 编辑页加「预览二维码」按钮
   - 点击 → 用 qrcode-generator 把 6 位数字码生成二维码图片。
     注意:全局名是小写的 qrcode(一个函数),用法:
       var qr = qrcode(0, 'M');        // 0=自动尺寸,'M'=容错级别
       qr.addData(code);
       qr.make();
       容器.innerHTML = qr.createImgTag(5, 8);   // 参数:格子大小、外边距
   - 弹窗显示二维码图片
   - 「保存图片」按钮 → 下载 GIF(文件名:L1名_第N站_点位名_码xxxxxx)。
     说明:qrcode-generator 原生输出 GIF,二维码黑白,扫码完全不受影响,不用转 PNG。

2. 全部二维码生成 + 打印:
   - L1 详情页加「🖨️ 打印二维码」按钮
   - 点击进入打印预览页 admin/pages/print-qr.html?levelId=xxx
   - 用 qrcode-generator 渲染所有 L2 的二维码(每页 2-4 个,CSS Grid 控制)。
     打印优先用 qr.createSvgTag(5, 8) 输出 SVG —— 放大打印最清晰,不会糊。
     若实测某浏览器打印 SVG 出现空白或模糊,退回用 createImgTag(GIF)也可接受,
     以实际打印效果为准。
   - 每个二维码下方显示:大字「第 X 站」、中字点位名称、大字 6 位短码、小字家长备忘
   - CSS @media print:隐藏导航和按钮、每 2-4 个一页(@page A4)、二维码黑白清晰
   - 「🖨️ 立即打印」按钮 → window.print()

3. iPad 打印提示(在打印预览页顶部显示警告):
   "⚠️ 建议在电脑浏览器上完成打印。iPad Safari 的打印对话框 CSS 支持有限,
    可能导致排版混乱。如果在 iPad 上,建议先「另存为 PDF」再打印。"

4. 写测试 checklist:docs/test-checklists/MVP-admin-二维码打印.md
   - 单张图片下载工作
   - 打印预览页布局正确
   - 桌面 Chrome 打印 → 排版正确
   - 桌面 Chrome「另存为 PDF」→ PDF 排版正确
   - iPad「另存为 PDF」→ 排版可接受

5. 真机测试。

6. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] 单张二维码 PNG 下载正常
- [ ] 打印预览页含所有 L2 二维码
- [ ] 桌面 Chrome 打印排版正确
- [ ] iPad 打印警告显示
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M12. 应急小抄打印(v1.7 新增功能)

**前置**:M11
**预计时间**:1 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
请基于 PRD v1.7 §4.1.5「应急小抄打印」实现:

1. L1 详情页加「📋 打印应急小抄」按钮(M07 占位的那个)。

2. 点击进入打印预览页 admin/pages/print-cheatsheet.html?levelId=xxx

3. 页面布局(A4 一页):
   - 顶部:L1 名称(大字)
   - 说明文字(中字):
     "出门前打印或截图存手机,户外二维码丢失/扫不出时备查"
   - 表格:
     | 序号 | 点位名称 | 6 位数字码 | 家长备忘 |
     | 1   | 凉亭    | 482931    | 东侧柱子 |
     | 2   | 滑梯    | 175823    | 滑梯入口 |
     ...
   - 表格样式:
     * 边框清晰,字号 14-16px(打印可读)
     * 数字码用 monospace 字体,加粗
   - 底部小字:打印日期 + 「寻宝游戏」字样

4. CSS @media print 样式:
   - 隐藏导航和打印按钮
   - 整个表格能塞进 A4 一页(假设 5-10 个 L2)

5. 「🖨️ 立即打印」按钮 → window.print()

6. 写测试 checklist:docs/test-checklists/MVP-admin-应急小抄.md
   - 含 5 个 L2 的 L1 → 应急小抄一页能塞下
   - 打印 → 数字码清晰可读
   - 「另存为 PDF」→ 排版正确

7. 真机测试。

8. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] 应急小抄页面正常显示
- [ ] 表格含所有 L2 的数字码
- [ ] 打印排版整齐,数字码清晰
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M13. JSON 整库导入导出

**前置**:M12
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/admin/07-json-io.png
参考数据:docs/pages-data.md A7 小节(包括校验逻辑和二次确认弹窗文案)

请基于 PRD v1.7 §4.1.6 + 已实现的 shared/utils/json-io.js,实现编辑端的 JSON 整库导入导出:

1. admin/pages/import-export.html
   - 顶部分两个大区块:

   【区块 A:导出】
   - 标题「📤 整库导出」
   - 说明:「下载所有探险 + 全部题库的备份文件,可用于备份、跨设备同步」
   - 「立即导出」按钮 → 调用 exportFull(adminDb) → 触发下载
     - 文件名:treasure-hunt-backup-YYYY-MM-DD.json
   - **MVP 不显示「单 L1 导出」按钮**(v1.7 推到 V1)
   - **MVP 不显示「仅题库 JSON 导出」**(题库走 CSV)

   【区块 B:导入】
   - 标题「📥 整库覆盖导入」
   - 警告色提示框:「⚠️ 这会替换当前所有数据!请先做好备份。」
   - 文件选择按钮(只接受 .json)
   - 上传后:
     a. 调用 validateJson 检查
     b. 不通过 → 显示错误信息(如「这不是有效的寻宝游戏数据文件」)
     c. 通过 → 弹「这将替换当前所有数据,确定吗?」二次确认
     d. 确认 → 调用 importFull(adminDb, validatedData)
     e. 完成后显示「成功导入 N 个探险、M 道题目」

   **MVP 不显示「追加单 L1 导入」按钮**(v1.7 推到 V1)

2. 写测试 checklist:docs/test-checklists/MVP-admin-JSON导入导出.md
   - 建几个 L1 → 导出 → 看 JSON 文件结构正确
   - 清空数据 → 导入 → 数据恢复
   - 上传无效文件(改了扩展名的 .txt)→ 拒绝并提示
   - 上传 schemaVersion 错的文件 → 拒绝

3. 真机测试。

4. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] 整库导出生成正确 JSON
- [ ] 整库导入能恢复数据
- [ ] 无效文件被拒绝
- [ ] 二次确认弹窗工作
- [ ] **MVP 不显示单 L1 导入/导出按钮**
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M14. 删除引用保护

**前置**:M13
**预计时间**:1-2 天
**类型**:核心功能(v1.7 用户明确要求 MVP 做)

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/admin/04-l3-list.png(拒绝弹窗在题库页)
参考数据:docs/pages-data.md A4 小节中「删除」操作说明

请基于 PRD v1.7 §4.1.7 完善删除引用保护:

1. shared/utils/reference-check.js
   - 实现 findQuestionReferences(db, questionId) 函数:
     - 扫描所有 Point 的 questionIds 数组
     - 返回引用该题的 [{ levelName, levelId, pointName, pointOrder }] 数组
     - 没引用返回空数组

2. 在 M09 的题库删除流程中接入:
   - 删除前调用 findQuestionReferences
   - 有引用(数组非空)→ 弹拒绝对话框:
     ```
     ❌ 不能删除「这道题」

     这道题正在被以下点位使用:
     - 周末小区探险 - 第 2 站凉亭
     - 公园探险 - 第 1 站门口

     请先去这些点位中移除引用,再来删除。

     [我知道了]
     ```
   - 无引用 → 弹普通确认:
     ```
     确定删除「这道题」吗?
     [取消] [确定]
     ```

3. 删除 L1 / L2 不需要引用保护(按 §4.1.7 规则,只需简单二次确认)

4. 写测试 checklist:docs/test-checklists/MVP-admin-引用保护.md
   - 建一个 L1 → 加 L2 → 绑题 → 去题库删那道题 → 应被拒绝 + 显示引用列表
   - 去 L2 解除引用 → 回题库删 → 成功

5. 真机测试。

6. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] findQuestionReferences 正确扫描
- [ ] 有引用时拒绝对话框显示
- [ ] 引用列表显示 L1 名 + L2 名 + 序号
- [ ] 解除引用后能删除
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M15. 编辑端联调测试

**前置**:M14
**预计时间**:1-2 天
**类型**:测试 + 修 bug

**目的**:把编辑端所有功能串起来跑一遍,修小 bug。

**【你要做的事】**

不需要 Claude Code,你自己跑下面的完整流程:

1. **建一个完整的 L1**:
   - 探险名「周末小区测试探险」
   - 简介、推荐人数、年龄段、主题色都填好

2. **用 CSV 导入 20 道题**:
   - 自己编 20 道适合孩子的题
   - 用 Excel 编辑 → 另存为 CSV UTF-8 → 导入
   - 验证导入成功 20 道,题库列表显示正常

3. **建 3 个 L2 点位**,每个 L2 绑 3 道题:
   - 第 1 站凉亭(3 道题)
   - 第 2 站滑梯(3 道题)
   - 第 3 站长椅(3 道题)
   - 题目顺序通过上移下移调整
   - 验证 questions 表的 usedCount 都变成 1

4. **打印一份二维码**:
   - 浏览器另存为 PDF 看排版
   - 数字码清晰可读

5. **打印一份应急小抄**:
   - 浏览器另存为 PDF
   - 三个数字码都有

6. **JSON 导出**:
   - 下载 JSON 文件
   - 用记事本打开,大致看格式对不对

7. **测试引用保护**:
   - 去题库随便删一道已绑定的题 → 应被拒绝

8. **测试 JSON 整库覆盖**:
   - 删除所有 L1 → 验证清空
   - 导入刚才的 JSON → 数据完整恢复

9. **iPad Safari 上重复**:
   - 至少跑通建 L1 + 看题库 + 导出 + 导入(打印部分可以不重复)

10. **commit + push**

**【出 bug 的话】**

```
我在 MVP 编辑端联调测试时发现 bug:
[详细描述操作步骤 + 期望结果 + 实际结果]
[F12 Console 错误截图]
请帮我定位和修复。
```

**验证清单**:

- [ ] 完整工作流跑通(建 → 导入 → 编辑 → 打印 → 导出 → 导入)
- [ ] 桌面 Chrome 全流程通过
- [ ] iPad Safari 部分流程通过
- [ ] 所有发现的 bug 都修复
- [ ] PROGRESS.md 更新「编辑端 MVP 完成」
- [ ] commit + push

🎉 **编辑端 MVP 完成!** 已经走过 MVP 一半,休息一下,接下来攻游戏端。

---

## 🟨 MVP 阶段 C:游戏端(M16-M26,2-2.5 周)

> 游戏端是孩子在 iPad 上玩的 PWA(完全离线)。
>
> 完成顺序:PWA 框架 → 启动设置页 → 导入 JSON → 主流程框架 → 扫码 → 数字码 → 多题连答 → 答题反馈 → 拍照 → 通关页 → 续玩。

---

### [√] M16. 游戏端 PWA 框架(动态缓存 SW)

**前置**:M15
**预计时间**:1-2 天
**类型**:基础设施

**【复制给 Claude Code 的指令】**

```
开始 MVP 阶段 C：游戏端开发。第一步搭 PWA 框架。

请基于 PRD v1.7 §7.6 + CLAUDE.md §5.5 重做 play/ 的 PWA 框架。
注意：本步骤只搭框架骨架，不写页面内容（M17 做）、不引入扫码库（M20 做）。

1. play/manifest.json
   - 路径统一用相对路径（不要绝对路径，免得仓库路径再变就崩）：
     * start_url: "./"
     * scope: "./"
   - icons：检查路径指向 play/ 下真实存在的图标文件（T08 改过目录，确认没失效）
   - name / short_name：「寻宝游戏」
   - display: "standalone"
   - background_color、theme_color 用 docs/design-tokens.md 的色值（主色 #4A90E2）

2. play/service-worker.js（替换掉 T07 遗留的静态 FILES_TO_CACHE 版本）
   - 完全改用动态缓存策略（stale-while-revalidate），删除 FILES_TO_CACHE 数组
   - 按 CLAUDE.md §5.5 伪代码实现：
     * install → self.skipWaiting()
     * activate → clients.claim()
     * fetch → 优先返回缓存，后台 fetch 更新，网络失败回退缓存
   - CACHE_VERSION = "treasure-hunt-runtime-v1"
   - 跳过非 GET 请求
   - 【重要】缓存 CDN 资源时，对跨域响应也要能存进缓存：不要因为 response 是
     opaque / response.ok 为 false 就跳过 jsdelivr 域名的资源，否则飞行模式下
     Dexie 会加载不出来导致白屏。请确保 CDN 库能被正常缓存。

3. play/index.html（只做启动页骨架，空内容，M17 再填）
   - 引用 manifest.json
   - 注册 service-worker.js
   - 设好移动端 viewport
   - 用普通 <script>（带固定版本号）加载：
     * Dexie@3.2.4
     * Eruda@3.0.1 —— 仅在 URL 带 ?debug=1 时加载
   - 加载 shared/ 依赖（我们自己写的 .js 用 <script type="module">，
     务必放在库的 <script> 之后）
   - 【本步骤不要引入 html5-qrcode 和 qrcode-generator】，扫码库等 M20 再加
   - 页面只显示「寻宝游戏」启动页骨架（标题占位即可，无功能按钮）

4. test-scan.html（T07 遗留）：移动到 play/test/test-scan.html 保留，
   不要删除（M20 重做扫码时当能跑的参照物）

5. iPad 旧图标处理：在回复里提醒我——T08 改路径 + manifest 更新后，
   iPad 上旧 PWA 图标可能失效。给我具体操作步骤：
   长按删除旧图标 → Safari 重新打开 GitHub Pages 的 play/ 网址 → 重新「添加到主屏幕」

6. 写测试 checklist：docs/test-checklists/MVP-play-PWA框架.md，至少包含：
   - 桌面 Chrome：F12 → Application 面板看 manifest 字段正确、SW 已注册
   - iPad Safari（有网）：访问 play/ → 添加到主屏幕 → 从图标启动
   - iPad 飞行模式（关键）：先联网完整打开一次 → 关飞行模式 →

     从主屏图标重启 → 页面正常打开（证明 SW 缓存生效）

7. 完成后用单行英文 git commit + push（避免中文多行 commit 在 PowerShell 乱码）。

8. 更新 PROGRESS.md：M16 标记完成，并把「注意事项」里 SW 那条遗留问题划掉。
```

**验证清单**:

- [ ] manifest.json 路径正确
- [ ] Service Worker 用动态缓存(没有 FILES_TO_CACHE 数组)
- [ ] iPad PWA 主屏幕图标启动正常
- [ ] **飞行模式下能打开**(关键)
- [ ] F12 应用面板看 SW 已注册
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新
- [ ] 在家联网完整打开一次游戏后,开飞行模式 → 进扫码页 → 摄像头能正常起来(证明扫码库已缓存)

---

### [√] M17. 启动页 + 探险选择页 + 设置页

**前置**:M16
**预计时间**:1-2 天
**类型**:UI 框架

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/01-launch.png（启动页）
         + docs/wireframes/play/02-select-level.png（探险选择页）
         + docs/wireframes/play/10-settings.png（设置页）
参考数据：docs/pages-data.md P1、P2、P10 小节（字段名和操作逻辑严格以此为准）
视觉规范：docs/design-tokens.md（按钮尺寸、颜色、圆角统一用这里的令牌，主色 #4A90E2）

请基于 PRD v1.7 §4.2.1 + §4.2.9 实现游戏端的前三个页面。

【本步骤重要前提】
JSON 导入是 M18 才做，所以现在 play 端数据库是空的（没有探险、没有题目）。
这三个页面必须能在「数据库为空」的情况下正常显示，不能假设有数据、不能报错。
本步骤只做页面 UI + 跳转 + 读取已有数据，导入逻辑（M18）和续玩逻辑（M26）都不做。

1. play/index.html（启动页）
   - 大字「寻宝游戏」+ App 图标
   - 大按钮「🎮 开始游戏」→ 跳转探险选择页
   - 右下角小字「⚙️ 设置」→ 跳转设置页
   - MVP 不读 openingStory，不做故事背景页

2. play/pages/select-level.html（探险选择页）
   - 顶部「← 返回」
   - 探险卡片列表（从 playDb.levels 读），每张卡片显示（字段对齐 pages-data P2）：
     * 图标 + 探险名（大字）
     * 简介（description）
     * 点位数（db.points.where('levelId').equals(levelId).count()）
     * 上次游玩时间 —— 查 sessions 表；【M17 阶段没有任何 session，所以一律显示「从未游玩」】
     * 「开始 ▶」按钮 → 进入开始游戏页（M19 实现），携带 levelId
   - 【空状态】数据库无探险时，不显示空白卡片列表，改显示提示文案：
     「还没有探险，请去电脑端编辑后导入」（指引去设置页导入）
   - 【续玩横幅：M26 再做，本步骤不实现】线框图上画了续玩横幅，但那是 M26 的范围，
     这一步不要做任何续玩相关逻辑，把版面位置留着即可

3. play/pages/settings.html（设置页）
   - 顶部「← 返回」
   - 区块 A：当前数据状态（只读卡片，字段对齐 pages-data P10）：
     * N 个探险（共 M 个点位）—— db.levels.count() / db.points.count()
     * X 道题目 —— db.questions.count()
     * 上次导入时间 —— 【M17 阶段还没有导入记录，显示「尚未导入」占位；
       真正的导入时间记录逻辑 M18 接入，本步骤不要自己造字段】
   - 区块 B：导入数据
     * 警示色按钮「📥 完整覆盖导入」
     * 说明文字「用 JSON 备份完整替换当前数据」
     * 文件选择器（仅放上去，导入逻辑 M18 实现，本步骤点击可以暂时无反应或提示「M18 实现」）
   - 【不显示】「导入单个 L1 探险」按钮（V1 才做）
   - 【不显示】「清除所有数据」按钮（V1 才做）

4. 路由：用多 HTML 文件方案（跟上面已命名的 select-level.html / settings.html 一致），
   不要用 hash 路由，保持简单统一。页面间用普通链接跳转。

5. 三个页面都按 M16 的方式加载依赖：
   - 普通 <script> 加载 Dexie@3.2.4（带固定版本号）
   - 我们自己写的 .js 用 <script type="module">，放在库的 <script> 之后
   - 不引入扫码库（M20 再加）

6. 写测试 checklist：docs/test-checklists/MVP-play-启动页.md
   按 CLAUDE.md §5.7 的模板格式写，至少包含：
   - 桌面 Chrome：三个页面互相跳转正常、空数据库下显示空状态文案、F12 无红色错误
   - iPad Safari（有网）：同上
   - iPad PWA 主屏幕图标 + 飞行模式（关键）：
     【测试顺序写死】先联网从图标启动 → 把首页、探险选择页、设置页都点一遍
     （让动态缓存把三个页面都缓存住）→ 再开飞行模式 → 从图标重启 →
     三个页面都能正常打开、互相跳转。
     ⚠️ 如果不先联网把每个页面都访问一遍，飞行模式下没缓存过的子页面会打不开。

7. 真机测试（三态覆盖：桌面 Chrome / iPad Safari / iPad PWA 含飞行模式）。

8. 完成后用单行英文 git commit + push。

9. 更新 PROGRESS.md：M17 标记完成。
```
**验证清单**:

- [ ] 启动页有「开始游戏」+「设置」入口
- [ ] 探险选择页能列出所有 L1
- [ ] 设置页显示数据统计
- [ ] **不显示「追加导入」按钮**
- [ ] iPad PWA 三态覆盖测试
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M18. JSON 整库导入(游戏端)

**前置**:M17
**预计时间**:1-2 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局:docs/wireframes/play/10-settings.png
参考数据:docs/pages-data.md P10 小节(导入流程和二次确认逻辑以此为准)

请基于 PRD v1.7 §4.1.6 + §4.2.9 + §7.4 实现游戏端的 JSON 导入:

1. 在设置页的「📥 完整覆盖导入」按钮接入逻辑:

   a. 文件选择 → 读取内容
   b. validateJson 检查 → 不通过显示错误
   c. **关键:检查未完成游戏**:
      - 查 sessions 表 where status === "in_progress"
      - 有 → 弹「检测到正在进行中的游戏,导入会清除进度,确定吗?」
      - 取消 → 终止;确定 → 继续
   d. 再弹「这将替换当前所有数据,确定吗?」二次确认
   e. 确认 → 清空 playDb 的 levels、points、questions 表
      - **同时清空 sessions 表**(in_progress 的也清)
      - **不清空 photos 表**(已拍的合影保留,只是失去关联)
   f. 调用 importFull(playDb, validatedData)
   g. 完成后显示「成功导入 N 个探险、M 道题目」+ 「返回首页」按钮

2. 显著的导入引导文案:
   - 「从电脑端导出 JSON → AirDrop / 邮件传到 iPad → 这里选择文件」
   - 简单 3 步说明图

3. 写测试 checklist:docs/test-checklists/MVP-play-导入.md
   - 准备一份测试 JSON(从编辑端导出的)
   - 用 AirDrop 传到 iPad
   - 在游戏端导入 → 数据正确
   - 制造一个未完成 session(后续 M22 后才能完整测,先标记此步待 M26 后补测)
   - 上传无效 JSON → 拒绝并提示

4. 真机测试(iPad PWA)。

5. 更新 PROGRESS.md。
```

**验证清单**:

- [ ] 文件选择 → 校验 → 导入流程完整
- [ ] 未完成游戏检查(待 M26 后完整测)
- [ ] 二次确认弹窗工作
- [ ] 数据导入后探险选择页能显示
- [ ] 无效文件被拒绝
- [ ] iPad PWA 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M19. 游戏主流程框架(开始 + 提示展示)

**前置**:M18
**预计时间**:1 天
**类型**:UI 框架

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/03-start-and-hint.png（含「开始冒险」和「提示」两屏）
参考数据：docs/pages-data.md P3 小节（字段名和取数逻辑严格以此为准）
注意：提示页显示的是当前 Point 的 locationHint 字段（历史名 nextHint 已弃用，不要用）

请基于 PRD v1.7 §4.2.2 + §4.2.3 实现游戏主流程的前两个页面：

1. play/pages/start-level.html?levelId=xxx（开始冒险页）
   - 顶部「← 返回选择」
   - 大字：L1 探险名
   - 简介（description）
   - 大按钮「🚀 开始冒险！」
     - 点击 → 创建一个新 GameSession（字段对齐 PRD §6.5）：
       * id = generateId("sn")
       * levelId
       * startedAt = Date.now()
       * endedAt = null（结束时再填）
       * status = "in_progress"
       * currentPointIndex = 0
       * currentQuestionIndex = 0
       * helpUsedCount = 0
       * maxHelpCount = 3   ← 求助上限，M23 求助按钮靠它算剩余次数，必须设
       * pointRecords = []
     - 写入 playDb.sessions
   - 跳转到提示页，只携带 sessionId（不要传 pointIndex，站号由 session 决定）

2. play/pages/hint.html?sessionId=xxx（提示展示页）
   - 取当前点位（以 session 为唯一真相，不要用 URL 传站号）：
     * 读 playDb.sessions.get(sessionId) → 拿到 levelId 和 currentPointIndex
     * 查该 L1 的所有点位：playDb.points.where('levelId').equals(levelId)，按 order 升序排
     * 当前点位 = 排序后的第 currentPointIndex 个（从 0 数）
     * 总站数 M = 这批点位的数量
   - 顶部进度条：第 (currentPointIndex+1) / M 站
   - 大字：第 N 站
   - 点位提示文本：当前点位的 locationHint 字段
     （语义＝去找本站的提示，含第 1 站；可空，空时显示「仔细看二维码贴在哪里」）
   - 大按钮「📷 我找到了！扫码！」→ 跳转扫码页（M20 实现），携带 sessionId

3. MVP 不显示 openingStory（即使数据里有也跳过故事背景页）

4. 写测试 checklist：docs/test-checklists/MVP-play-主流程框架.md
   按 CLAUDE.md §5.7 模板，至少含：
   - 从探险选择页点「开始▶」→ 开始冒险页显示探险名+简介
   - 点「开始冒险」→ 成功创建 session（F12 看 playDb.sessions 里有一条，
     且 maxHelpCount=3、currentPointIndex=0）
   - 自动进提示页 → 显示「第 1 / M 站」+ 第 1 站的 locationHint
   - 不出现故事背景页
   - iPad PWA 三态（飞行模式前记得先联网把新页面缓存过，同 M17）

5. 真机测试（iPad PWA）。

6. 完成后用单行英文 git commit + push。

7. 更新 PROGRESS.md：M19 标记完成。
```

**验证清单**:

- [ ] 开始游戏能创建 session
- [ ] 提示展示页显示当前 L2 提示
- [ ] **不显示故事背景页**
- [ ] 进度条正确
- [ ] iPad PWA 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M20. 扫码功能集成(html5-qrcode)

**前置**:M19
**预计时间**:3-4 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/04-scan.png（扫码主界面）
         + docs/wireframes/play/05-code-input.png（状态C/D=扫到错码的toast）
参考数据：docs/pages-data.md P4、P5 小节

请基于 PRD v1.7 §4.2.3 实现扫码。
重要：游戏端决策 #4 规定 P4 扫码「摄像头不自动启动」，必须等用户点按钮才调摄像头
（iPad Safari 自动启动易黑屏）。本步骤严格遵守。

1. 在 play/index.html 加载 html5-qrcode CDN（M16 没加扫码库，现在才加）：
   <script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
   注意：直接用全局 Html5Qrcode（new Html5Qrcode(...)），不要 import。

2. play/pages/scan.html?sessionId=xxx（扫码界面）
   - 顶部：第 N 站（进度，N 由 session.currentPointIndex 推算）+「← 返回提示」
   - 中间：一个大按钮「📷 点击开始扫码」
     * 摄像头默认不启动，用户点这个按钮才调 html5Qr.start()
     * 启动后显示摄像头预览 + 取景框（html5-qrcode 自带 UI）
   - 底部两个按钮：
     * 「⌨️ 输入数字码」（扫不出时用）
     * 「❌ 找不到?」（二维码丢失时用）
     * （这两个按钮的弹窗 M21 实现，这里先放占位）

3. 扫码成功（html5-qrcode 回调拿到 decodedText）后：
   - 立即停止摄像头（html5Qr.stop()）
   - 取扫到的内容并 trim（应是 6 位数字字符串）
   - 调用 verifyCode(扫到的内容)（本步骤 step 4 实现）

4. verifyCode(code) 函数（放 play/scripts/scan-verify.js）：
   - 第一步：scannedPoint = playDb.points.where('code').equals(code).first()
   - 没查到 → toast「这不是寻宝游戏的码哦，可能扫到别的二维码了」
     → 重新显示「📷 点击开始扫码」按钮（不自动重启摄像头）
   - 查到了 → 判断是不是当前该扫的点位（防跳站，方法与 M19 一致）：
     * 读 session（sessionId 从 URL 取）→ 拿 levelId、currentPointIndex
     * 该 L1 所有点位：playDb.points.where('levelId').equals(levelId)，按 order 升序排
     * 当前该扫的点 currentPoint = 排序后第 currentPointIndex 个（从 0 数）
     * 比对 scannedPoint.id === currentPoint.id：
       - 相等（正确）→ 播放「叮咚」音效（音效文件 M23 才放，这里先占位/try 包住，
         没文件也不能报错）→ 跳转本站「开始挑战页」（P6，M22 实现，携带 sessionId）
       - 不相等（扫到本探险别的站）→ toast「这不是你现在要找的点哦！现在要找第 N 站，
         再看看提示~」→ 重新显示「点击开始扫码」按钮
     ⚠️ 不要用「order == currentPointIndex」直接比：order 可能从 1 开始，
        currentPointIndex 从 0 开始，直接比会差一位、把正确的码也判成错。

5. 摄像头权限处理：
   - 用户点「开始扫码」时若被拒 → 提示「需要摄像头才能扫码，请到 iPad『设置』里允许」
     + 引导用底部「输入数字码」作为备选
   - getUserMedia 报错也要 catch，给出上面这句友好提示，不能白屏

6. iOS Safari 切后台黑屏处理：
   - 监听 visibilitychange，切回前台时不自动重启摄像头，
     而是恢复显示「📷 点击开始扫码」按钮，由用户点击重新启动（同样为避免黑屏）

7. 写测试 checklist：docs/test-checklists/MVP-play-扫码.md，按 CLAUDE.md §5.7 模板，至少含：
   - 桌面 Chrome：点「开始扫码」→ 摄像头起来 → 扫纸面二维码 → 识别 6 位码
   - 扫当前站的码 → 进开始挑战页（M22 前先验证「判定为正确、尝试跳转」即可）
   - 扫本探险其他站的码 → 橙色提示「不是现在要找的点」
   - 扫一个乱七八糟的码 → 粉色提示「不是寻宝游戏的码」
   - iPad Safari + iPad PWA 各测一次：确认是「点按钮才开摄像头」、不黑屏
   - 切后台再回来 → 显示「点击开始扫码」按钮、点了能重新扫
   - （飞行模式前先联网把 scan.html 缓存过，同 M17）

8. 真机测试（iPad PWA 为主）。

9. 完成后用单行英文 git commit + push。

10. 更新 PROGRESS.md：M20 标记完成。
```

**验证清单**:

- [ ] 扫码成功能识别 6 位数字码
- [ ] 当前点位码 → 进入答题(M22 实现后联调)
- [ ] 错位点的码 → 友好提示
- [ ] 无效码 → 友好提示
- [ ] iPad PWA 模式扫码正常
- [ ] 切后台再回来摄像头能重启
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M21. 数字码输入 + 「找不到?」按钮

**前置**:M20
**预计时间**:1 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/05-code-input.png 状态A（输数字码弹窗）+ 状态B（找不到?家长语境弹窗）
参考数据：docs/pages-data.md P5 小节（A/B 两状态的文案和行为严格以此为准）

请基于 PRD v1.7 §4.2.3 实现两个数字码输入按钮。

【前提：先把 M20 的 verifyCode 拆成「只判断 + 共享跳转」，因为手动输码的失败处理和扫码不同】
M20 的 verifyCode 现在把「失败后重启摄像头」这种扫码专属界面动作写死在里面了，
手动输码失败时却要停在输入框让家长重输，两者不能共用同一套失败 UI。请重构为：
- resolveCode(code) → 纯判断、不碰界面，返回 { status, currentStationNumber }
  * status：'correct'（当前站正确码）/ 'wrong-point'（本探险别的站）/ 'not-found'（查无此码）
  * 内部逻辑＝M20 原有：sessionId 从 URL 取 → 查 points → 按 order 升序取第
    currentPointIndex 个 → 比 id（这套逻辑不变）
- goToChallenge(sessionId) → 共享成功跳转：跳本站开始挑战页（P6，M22 实现）
- 改 M20 扫码回调改用 resolveCode：'correct'→goToChallenge；
  'wrong-point'/'not-found'→ 原来的 toast + 重新显示「点击开始扫码」按钮
（这是为本步骤复用而做的必要调整，不另起炉灶。）

1. 「⌨️ 输入数字码」按钮（扫不出时，孩子语境）：
   - 弹窗标题「输入这一站的 6 位数字码」
   - 6 格数字输入：用大号自定义数字键盘（首选），或 input inputmode="numeric"；
     ⚠️ 不要用 input type="number"（iOS 会混入小数点/e 等杂字符）
   - 底部「取消」「确定」两个按钮
   - 点「确定」（或 6 位输满自动判定）→ 调 resolveCode(code)：
     * 'correct' → goToChallenge(sessionId)
     * 'wrong-point' 或 'not-found' → 不关弹窗、不回摄像头、不算答错，
       提示「码不对哦，再看看二维码下面的数字」+ 清空让重输
   - 「取消」→ 关弹窗，回到扫码页

2. 「❌ 找不到?」按钮（二维码丢失，家长语境）：
   - 弹窗用橙色（家长语境），标题「请家长输入」
     正文「二维码找不到了？请爸爸妈妈输入这一站的 6 位数字码」
     小字「在打印的应急小抄、或电脑端 L1 详情页可以查到」
   - 同样的 6 格数字输入 + 「取消」「确定」
   - 行为与按钮 1 完全一致（输对 → goToChallenge），唯一差别是三处：
     橙色 + 标题措辞 + 验错文案改成「家长再仔细看下数字」
   - 【v1.7 重要】最终行为和「输入数字码」一样，输对就进入本站挑战；
     不做「真跳过」逻辑（应急通关裁判模式推到 V2）

3. 两个弹窗除了上面「颜色 / 标题 / 验错文案」三处不同，其余逻辑完全共用
   （建议同一个弹窗组件传参区分孩子/家长两种模式，别复制两套代码）。

4. UX 细节：输入框字号大、间距大；数字按钮 ≥ 60×60px（适合家长户外操作）。

5. 写测试 checklist：docs/test-checklists/MVP-play-数字码输入.md，按 CLAUDE.md §5.7 模板，至少含：
   - 「输入数字码」+ 当前站正确码 → 进开始挑战页
   - 「找不到?」+ 当前站正确码 → 同样进开始挑战页
   - 输入本探险其他站的码 → 停在弹窗提示「码不对」、可重输（不回摄像头、不算错）
   - 输入查无此码的乱码 → 同样停在弹窗提示、可重输
   - 两个弹窗的「取消」都能关掉、回扫码页
   - iPad PWA 测一次（数字键盘好按、不出杂字符）

6. 真机测试（iPad PWA）。

7. 完成后用单行英文 git commit + push。

8. 更新 PROGRESS.md：M21 标记完成。
```

**验证清单**:

- [ ] 两个按钮都能弹数字码输入框
- [ ] 两个按钮最终行为一致(都进答题)
- [ ] 错误码友好提示
- [ ] 输入框大按钮适合户外操作
- [ ] iPad PWA 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M22. L2 内多题连答主流程

**前置**:M21
**预计时间**:3-4 天
**类型**:核心功能(MVP 最复杂的之一)

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/06-question.png（含「开始挑战」屏1 和「答题」屏2，两屏都要做）
参考数据：docs/pages-data.md P6 小节（session 字段读写严格以此为准）

请基于 PRD v1.7 §4.2.3 step 4-5 实现「进站 → 多题连答」主流程。
注意：M22 只做主流程框架，真正的对错动画/提示/保底/计分在 M23；本步骤的
onAnswerCorrect/onAnswerWrong 先放临时占位版，保证 M22 能单独跑通、可验收。

页面：play/pages/quiz.html?sessionId=xxx（只传 sessionId，站号题号都从 session 读，
不要用 URL 传 pointIndex/questionIndex）。一个文件含两个视图（屏1 → 屏2）。

【进页面先解析当前位置（与 M19/M20 同一套，单一真相）】
- 读 session（sessionId 从 URL）→ levelId、currentPointIndex、currentQuestionIndex
- 该 L1 所有点位按 order 升序排 → currentPoint = 第 currentPointIndex 个；M = 点位总数
- currentPoint.questionIds → Y = 本站题目数

1. 屏1「开始挑战页」（扫码/输码成功后落地在这里）：
   - 进度条：第 (currentPointIndex+1) / M 站
   - 提示卡片：currentPoint.discoveryText（本站扫码成功提示，可空）
   - 大按钮「开始挑战！」
   - 点「开始挑战」时：
     * 若 session.pointRecords[currentPointIndex] 还不存在 → 新建一条：
       { pointId: currentPoint.id, scannedAt: Date.now(), questionResults: [], completionPhotoId: null }
       （若已存在——续玩回到本站——则保留不覆盖）
     * saveSession 写回 IndexedDB
     * 切换到屏2

2. 屏2「答题页」：
   - 顶部进度条：第 (currentPointIndex+1) / M 站 · 第 (currentQuestionIndex+1) / Y 题
   - 右上角「💡 求助 X」按钮，X = session.maxHelpCount − helpUsedCount
     （这里只负责显示数字；点击的求助逻辑 M23 实现，先放占位）
   - 当前题：currentQuestion = playDb.questions.get(currentPoint.questionIds[currentQuestionIndex])
   - 题干（大字，户外强光也清楚）
   - 选项按钮：currentQuestion.options 每项一个大按钮（≥60×60，2×2 布局）
   - 点选项 → submitAnswer(选项索引)

3. submitAnswer(selectedIndex)（放 play/scripts/quiz-logic.js）：
   - 判断对错：selectedIndex === currentQuestion.correctAnswer
     * 对 → onAnswerCorrect()
     * 错 → onAnswerWrong()
   - 【M22 临时占位版，M23 替换为真实计分/容错/保底】：
     * onAnswerCorrect()：往 pointRecords[currentPointIndex].questionResults 追加
       { questionId, answerAttempts: 1, usedHelp: false, score: 10 } → saveSession → 进入「下一题判定」
     * onAnswerWrong()：仅提示「再试试？」、允许重选，不追加记录、不进下一题
       （真正的 3 次容错和保底由 M23 做）

4. 一题答完 → 下一步（在 onAnswerCorrect 末尾走这段判定）：
   - currentQuestionIndex < Y − 1：
     * session.currentQuestionIndex += 1 → saveSession → 刷新屏2 显示下一题
   - 否则（本站最后一题答完）：
     * 跳到本站通关拍照流程（P8，M24 实现，携带 sessionId）——M24 前先占位跳转/提示

5. 自动保存：上面每个「关键节点」（建 pointRecord、答完一题、切题）都调 saveSession
   写回 IndexedDB，保证随时中断都能续玩（M26 依赖这些字段）。

6. 写测试 checklist：docs/test-checklists/MVP-play-多题连答.md，按 CLAUDE.md §5.7 模板，至少含：
   - 从扫码成功落地 → 屏1 显示 discoveryText → 点「开始挑战」进屏2
   - F12 看 session.pointRecords 多了一条、scannedAt 有值、questionResults 为空数组
   - 屏2 进度显示「第 1 / Y 题」，求助按钮显示剩余次数（=3）
   - 答对 → 进下一题，进度变「第 2 / Y 题」，questionResults 多一条 score=10
   - 答错（占位版）→ 提示「再试试」、停在本题
   - 答完最后一题 → 尝试跳 M24 拍照（M24 前验证「判定为本站结束并尝试跳转」即可）
   - iPad PWA 测一次（飞行模式前先联网缓存 quiz.html，同 M17）

7. 真机测试（iPad PWA）。

8. 完成后用单行英文 git commit + push。

9. 更新 PROGRESS.md：M22 标记完成。
```

**验证清单**:

- [ ] 答题页 UI 正常显示
- [ ] 进度条显示「第 X / Y 题」
- [ ] 答完一题进下一题
- [ ] 答完所有题进入拍照流程(M24 联动)
- [ ] session 状态正确保存
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M23. 答题反馈 + 3 次容错 + 求助按钮

**前置**:M22
**预计时间**:3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/07-answer-feedback.png（4 状态：答对/答错/求助确认/求助用完）
参考数据：docs/pages-data.md P7 小节（计分规则和 session 写入严格以此为准）

请基于 PRD v1.7 §4.2.3 step 5 + §4.2.4 + §4.2.5 实现答题反馈，替换 M22 里的占位版
onAnswerCorrect/onAnswerWrong。计分和 session 写入逻辑都在 play/scripts/quiz-logic.js。

【核心：一道题的临时状态 + 只在结束时写一次成绩】
- 用页面级临时变量记录当前题进度（不进 session，续玩按题级重来，丢了没关系）：
  * attemptCount = 0           // 本题已答错次数
  * usedHelpThisQuestion = false
- 每加载一道新题（M22 切题时）就把这两个变量清零。
- questionResult 只在「答对」或「第 3 次错保底」这一刻，往
  session.pointRecords[currentPointIndex].questionResults 追加 **一次**，然后 saveSession。
  ⚠️ 删除 M22 占位版里那次追加，避免一道题写两条。

1. submitAnswer(selectedIndex)（M22 已有，这里接上真实判定）：
   - 对（=== currentQuestion.correctAnswer）→ onAnswerCorrect()
   - 错 → onAnswerWrong()

   onAnswerCorrect()：
   - 计分（先判求助，求助优先级最高）：
     * usedHelpThisQuestion === true → 3 分
     * 否则 attemptCount === 0 → 10 分（一次答对）
     * 否则（错过 1 或 2 次后答对）→ 5 分
   - 「叮咚」音效（correct.mp3）+ 选项变绿 + 对勾动画（CSS）
   - 追加 questionResult：{ questionId, answerAttempts: attemptCount + 1,
     usedHelp: usedHelpThisQuestion, score } → saveSession
   - 1 秒后 → 复用 M22 的「进入下一题判定」（下一题 / 本站结束跳 M24）

   onAnswerWrong()：
   - attemptCount += 1
   - 若 attemptCount >= 3（第 3 次错，保底通过）：
     * 「哎呀」音效 + 选项抖动红框 + 正确答案金色高亮 + 文案「没关系，下次记住啦！」
     * 追加 questionResult：{ questionId, answerAttempts: 3,
       usedHelp: usedHelpThisQuestion, score: 0 } → saveSession
     * 1 秒后 → 复用 M22 的「进入下一题判定」
   - 否则（第 1 次或第 2 次错）：
     * 「哎呀」音效（温和不刺耳）+ 选项抖动红框 + 温和提示「再想想？」
     * 若 currentQuestion.hint 存在 → 显示 hint（pages-data：第 1 次错后即可显示）
     * 允许重选，不追加记录、不进下一题

2. 右上角「💡 求助 X」按钮（X = session.maxHelpCount − session.helpUsedCount）：
   - 点击时若 X > 0 → 先弹「求助确认」弹窗（屏3，蓝色）：
     标题「确定求助爸爸妈妈吗？」+ 两个按钮：
       「确定！扣掉一次求助次数」/「不用了，我再自己想想」
     * 点「确定」→ session.helpUsedCount += 1 → saveSession；
       usedHelpThisQuestion = true；弹「快去问爸爸妈妈！」（2 秒自动关）；
       刷新按钮上的剩余次数。注意：求助不增加 attemptCount（不算答错）。
     * 点「不用了」→ 关弹窗，什么都不改
   - 点击时若 X === 0 → 弹「求助用完」提示（屏4）：「已经没有求助次数咯，
     自己再思考一下吧！」（也可把按钮置灰，二选一即可）

3. 答题音效（详见下方说明）：
   - correct.mp3（对）、wrong.mp3（错，温和）
   - 放 play/assets/sounds/，用 HTML5 Audio，preload 预加载
   - iOS 解锁：在 M22 屏1「开始挑战」点击那一刻，静默触发一次音频播放（音量 0），
     解锁 iOS 的音频播放权限，否则后续答题时声音可能不响
   - 没有音效文件时不能报错（try 包住 play()）

4. 视觉（简单 CSS，别引动画库）：
   - 答对：选项变绿 + 对勾
   - 答错：选项轻微抖动 + 红色边框
   - 保底通过：正确答案金色高亮

5. 写测试 checklist：docs/test-checklists/MVP-play-答题反馈.md，按 CLAUDE.md §5.7 模板，至少含：
   - 一次答对 → 10 分（F12 看 questionResults 该条 score=10、answerAttempts=1）
   - 错 1 次再答对 → 5 分（answerAttempts=2）
   - 错 2 次再答对 → 5 分（answerAttempts=3、score=5）
   - 连错 3 次 → 保底，score=0、answerAttempts=3、显示正确答案、自动进下一题
   - 第 1 次错就显示 hint（用一道带 hint 的题验）
   - 点求助 → 先弹确认；确认后剩余次数 −1、本题答对记 3 分
   - 求助点「不用了」→ 次数不变
   - 求助 3 次用完 → 再点提示「没有求助次数了」（或按钮置灰）
   - 同一道题里多次点选项，questionResults 只新增一条（不重复写）
   - iPad PWA 测一次：音效能响（先联网播一次进缓存）、动画正常

6. 真机测试（iPad PWA）。

7. 完成后用单行英文 git commit + push。

8. 更新 PROGRESS.md：M23 标记完成。
```

**验证清单**:

- [ ] 答对/错动画正常
- [ ] 3 次容错 + 保底通过工作
- [ ] 求助按钮在右上角 + 次数递减 + 标记 usedHelp
- [ ] 计分规则正确(10/5/3/0)
- [ ] 音效播放(可选,占位也行)
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M24. L2 通关拍合影 +「继续扫码」按钮

**前置**:M23
**预计时间**:2-3 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/08-photo-capture.png（3 状态：拍照选择/拍后预览/继续扫码）
参考数据：docs/pages-data.md P8 小节（photos 表写入和站号推进逻辑严格以此为准）

请基于 PRD v1.7 §4.2.3 step 6-7 实现「本站通关拍合影 + 继续扫码找下一站」。

页面：play/pages/photo.html?sessionId=xxx（只传 sessionId，站号从 session 读，
不要用 URL 传 pointIndex）。

【进页面先解析当前位置（与前面各页同一套，单一真相）】
- 读 session（sessionId 从 URL）→ levelId、currentPointIndex
- 该 L1 所有点位按 order 升序排 → currentPoint = 第 currentPointIndex 个；
  totalStations = 点位总数；stationNumber = currentPointIndex + 1
- isLastStation = (currentPointIndex === totalStations - 1)

1. 页面初始显示（状态1）：
   - 大字「🎉 第 ${stationNumber} 站完成！」
   - 文字「拍一张通关合影作纪念吧！」
   - 大按钮「📸 拍照」 + 小按钮「跳过这一站合影」

2. 「📸 拍照」按钮：
   - 用 <input type="file" accept="image/*" capture="environment"> 调系统相机
     （这种方式点了才开相机、天然不自动启动，避免 getUserMedia 黑屏，不要改用 getUserMedia）
   - 选到照片后：
     a. 用 Canvas 压缩：长边缩到 1280px、JPEG quality 0.7 → 导出 Blob
     b. 写入 playDb.photos 一条：
        { id: generateId("ph"), blob, type: "completion_photo",
          ownerId: currentPoint.id, createdAt: Date.now(),
          width: 压缩后实际宽, height: 压缩后实际高,
          sizeBytes: blob.size, format: "jpeg" }
     c. 把这张照片 id 写到本站已存在的 pointRecord 上（M22「开始挑战」时已建好该记录，
        不要新建）：读出 session → records[currentPointIndex].completionPhotoId = 照片id
        → 整条写回（用与 recordQuestionResult 相同的「读-改-写回」安全写法）
     d. 切到拍后预览（状态2）：
        - 用 URL.createObjectURL(blob) 作为 <img> 的 src 显示预览（这样 iOS 能长按保存）
        - 小字提示「💡 长按图片可保存到系统相册」
        - 显示大按钮「📷 继续扫码找下一站」（见 step 4）

3. 「跳过这一站合影」按钮：
   - 不写 photos、不改 completionPhotoId（保持 M22 建好时的 null）
   - 直接显示「📷 继续扫码找下一站」大按钮（与拍照路径统一交互，只是没有照片预览）

4. 「📷 继续扫码找下一站」按钮（拍照/跳过两条路都用它，⭐ v1.7 关键）：
   - 点击时先推进站号，再跳转：
     * 若 isLastStation 为 false（还有下一站）：
       - session.currentPointIndex += 1
       - session.currentQuestionIndex = 0    ← 新站从第 1 题开始，必须归零
       - 写回 IndexedDB
       - 跳转 hint.html?sessionId=xxx（hint.html 会按新的 currentPointIndex 显示下一站提示，
         其「我找到了!扫码!」按钮再去扫码页）
     * 若 isLastStation 为 true（最后一站已完成）：
       - 不推进站号，直接跳转通关页 victory.html?sessionId=xxx（M25 实现，现在 404 正常；
         通关页负责标记 status="completed" 和 endedAt，本步骤不碰这两个字段）
   - 这个按钮本身不开任何摄像头（开相机的事在下一站的扫码页里，由用户在那边点按钮触发）

5. 相机权限被拒/取消拍照：
   - 不阻塞流程，用户仍可点「跳过」或重新点「拍照」
   - input 没选到文件（取消）时静默返回状态1，不报错

6. 写测试 checklist：docs/test-checklists/MVP-play-拍照.md，按 CLAUDE.md §5.7 模板，至少含：
   - 拍照 → 预览显示 + 长按提示；F12 看 photos 表多一条（type=completion_photo、
     ownerId=当前点位id），且本站 pointRecord.completionPhotoId 有值
   - 跳过 → photos 表不新增、completionPhotoId 保持 null
   - 点「继续扫码」后，F12 确认 session.currentPointIndex 加了 1、currentQuestionIndex 变回 0
   - 跳到 hint.html 显示的是「下一站」的提示（不是刚通关那站）
   - 走到最后一站完成 → 点「继续扫码」跳通关页（M25 前验证「判定为最后一站并尝试跳转」即可）
   - iPad PWA 专门测一次（拍照权限、长按保存）；飞行模式前先联网缓存 photo.html
   - 压缩后单张约 200KB 量级（F12 看 sizeBytes）

7. 真机测试（iPad PWA）。

8. 完成后用单行英文 git commit + push。

9. 更新 PROGRESS.md：M24 标记完成。
```

**验证清单**:

- [ ] 拍照按钮调起系统相机
- [ ] 照片压缩到 1280px + JPEG q0.7
- [ ] 写入 IndexedDB photos 表
- [ ] 「长按保存到相册」提示显示
- [ ] **「继续扫码」按钮触发摄像头**(不自动启动)
- [ ] 跳过照片路径也工作
- [ ] iPad PWA 模式下拍照成功
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M25. 极简通关页

**前置**:M24
**预计时间**:1-2 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参考布局：docs/wireframes/play/09-victory.png
参考数据：docs/pages-data.md P9 小节（总分计算和合影读取严格以此为准）

请基于 PRD v1.7 §4.2.6 实现极简通关庆典页。

页面：play/pages/victory.html?sessionId=xxx
（文件名用 victory.html，与 M24 跳转一致；只传 sessionId）

【进页面顺序很重要：先结算写库，再用写完的值显示】
1. 读 session（sessionId 从 URL）。
2. 结算（只在尚未结算时做，避免刷新/重进把用时越算越长）：
   - 若 session.status !== "completed"：
     * status = "completed"
     * endedAt = Date.now()
     * 写回 IndexedDB
   - 若已经是 completed：保留原有 endedAt，不要覆盖
3. 之后所有显示都用「结算后的 session」（endedAt 已是有效时间戳，不是 null）。

页面内容：

1. 顶部：撒花动画 + 大字「🎉 通关啦！」+ 探险名（playDb.levels.get(session.levelId).name）

2. 成绩卡：
   - 总分：遍历 session.pointRecords 里所有 questionResults，累加每条 score（是全部站、
     全部题的总和，不是只算最后一站）→ 显示「X 分」
   - 用时：endedAt − startedAt，换算成「Y 分 Z 秒」
     ⚠️ 用上面第 2 步刚写入的 endedAt 来算，不要用刚读进来那份（那份可能还是 null）
   - 战绩（可选，pages-data P9 有）：答对题数 / 总题数（answerAttempts===1 且 score>0 视情况，
     简单点就统计 score>0 的题数 / questionResults 总数）

3. 通关合影横向滚动（用 overflow-x:scroll，不要引滑动库）：
   - 取法顺着 session 走，保证站号/点位名对得上：
     * 遍历 session.pointRecords，挑出 completionPhotoId 不为 null 的
     * 用这些 id 一次性 playDb.photos.bulkGet([...ids]) 取回 Blob
     * 实际拍了几张就显示几张；跳过的站（completionPhotoId 为 null）不显示
   - 每张：URL.createObjectURL(blob) 作 <img> src（iOS 可长按保存）
     下方小字「第 X 站 · 点位名」（X = 该 pointRecord 在数组里的下标+1，
     点位名 = playDb.points.get(pointId).name）
   - 点击放大全屏 + 提示「💡 长按图片保存到相册」
   - 一张都没拍时：整块隐藏或显示「这次没有拍合影哦」

4. 大按钮「🏠 返回首页」→ 跳启动页（../index.html 或 play 根，按现有路由）。
   注意：pages-data P9 指明返回首页而非探险选择页。

5. 撒花：用 canvas-confetti（CDN 固定版本 canvas-confetti@1.9.3）或自写 CSS keyframes，
   二选一，简单即可，3-5 秒后停止。没有库时不报错。

6. MVP 不实现「全亮地图 Canvas 合成保存」（V1 地图功能才有）。

7. 写测试 checklist：docs/test-checklists/MVP-play-通关页.md，按 CLAUDE.md §5.7 模板，至少含：
   - 完整打一关 → 通关页显示总分（手算几道题分数核对）、用时为正常的几分钟（不是 0/负数/NaN）、合影
   - 故意跳过部分站拍照 → 只显示拍了的那几张、站号点位名对得上
   - F12 确认 session.status=completed、endedAt 有值
   - 刷新通关页 → 用时不变（没有被重新结算拉长）
   - 长按合影 → 出现系统保存菜单
   - 「返回首页」→ 回启动页
   - iPad PWA 测一次；飞行模式前先联网缓存 victory.html

8. 真机测试（iPad PWA）。

9. 完成后用单行英文 git commit + push。

10. 更新 PROGRESS.md：M25 标记完成。
```

**验证清单**:

- [ ] 总分计算正确
- [ ] 用时显示正确
- [ ] 合影横向滚动展示
- [ ] 没拍照的 L2 不显示
- [ ] 长按合影能保存到相册
- [ ] session 标记 completed
- [ ] 撒花动画显示
- [ ] iPad PWA 测试通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

### [√] M26. 自动保存 + 续玩

**前置**:M25
**预计时间**:2 天
**类型**:核心功能

**【复制给 Claude Code 的指令】**

```
参参考布局：docs/wireframes/play/02-select-level.png（续玩横幅）
参考数据：docs/pages-data.md P2 小节「续玩横幅」+ 游戏端备注第 1 条（续玩恢复粒度=题级）

请基于 PRD v1.7 §4.2.7 实现自动保存 + 续玩。

【续玩 UI 放在探险选择页的横幅，不是启动页弹窗】
线框图与 pages-data P2 指明续玩是 select-level.html 顶部的横幅，M17 已在该页预留位置。
本步骤填上它，不要在 index.html 另做弹窗。

1. 自动保存自审（M19-M25 应已实现，这里只核对，不重写）：
   - 创建 session（start-level）→ 写入
   - 开始挑战 → 创建本站 pointRecord（含 scannedAt）写入
   - 每道题答完 → 追加 questionResult + 推进 currentQuestionIndex 写入
   - 拍照完成 → 更新 completionPhotoId 写入
   - 继续扫码（M24）→ currentPointIndex+1、currentQuestionIndex=0 写入
   - 通关 → status="completed" 写入
   若发现哪个节点没存，补上 saveSession。

2. 在 play/pages/select-level.html 顶部实现续玩横幅：
   - 页面加载时查 playDb.sessions：status==='in_progress'，按 startedAt 倒序，取最近一条
     （可能不止一条，只用最近的；其余忽略）
   - 没有 → 不显示横幅，正常显示探险列表
   - 有 → 顶部显示横幅：「⏯ 继续上次的『${探险名}』？已到第 N 站」
     + 「继续」按钮 +「放弃」按钮（探险名 = levels.get(session.levelId).name；
     N = session.currentPointIndex + 1）

3. 「继续」按钮 —— 按存档状态跳到正确页面（都带 ?sessionId=该存档id）：
   - 取该 session → levelId、currentPointIndex
   - 该 L1 所有点位按 order 升序 → cp = 第 currentPointIndex 个
   - pr = (session.pointRecords || [])[currentPointIndex]
   - 判断（务必用下面这套，不要用 currentQuestionIndex 比大小）：
     * cp 不存在（数据异常）→ 提示并留在选择页
     * pr 不存在（还没扫码进站）→ 跳 hint.html?sessionId=xxx
     * pr 存在 且 pr.questionResults.length < cp.questionIds.length（还在答题）
       → 跳 quiz.html?sessionId=xxx（quiz.html 会按 currentQuestionIndex 续到那道题）
     * pr 存在 且 pr.questionResults.length === cp.questionIds.length（题答完、卡在拍照前）
       → 跳 photo.html?sessionId=xxx

4. 「放弃」按钮：
   - 二次确认「确定放弃上次进度吗？放弃后不能找回」
   - 确认 → playDb.sessions.delete(该存档id) → 隐藏横幅、留在选择页

5. （可选，按需）切后台保护：因为每个关键节点已即时保存，这条属冗余。
   如要加保险，仅在 quiz.html 监听 visibilitychange，切后台时确保当前进度已 saveSession 即可；
   不要为此在每个页面铺一套，避免过度复杂。MVP 不做主动暂停按钮。

6. 写测试 checklist：docs/test-checklists/MVP-play-续玩.md，按 CLAUDE.md §5.7 模板，至少含：
   - 答题答到一半 → 退出 App → 进选择页 → 出现续玩横幅，站号正确
   - 点「继续」→ 回到答题页且正是中断的那道题（不是重答、不是从头）
   - 答完某站全部题、停在拍照页 → 退出 → 继续 → 回到的是【拍照页】而不是重答最后一题
   - 还没扫码（停在提示页）→ 退出 → 继续 → 回到提示页
   - 点「放弃」→ 二次确认 → 横幅消失，sessions 表里那条没了
   - 通关后（status=completed）→ 选择页不再出现续玩横幅
   - iPad PWA：玩到一半锁屏/Home 退出 → 重开 → 续玩正常

7. 本任务完成后，补测 M18「未完成游戏导入保护」：
   - 玩到一半（留一条 in_progress，不退出）→ 去设置页导入新 JSON
   - 应弹「检测到正在进行中的游戏…」；取消 → 数据不变；
     确认 → 该 session 被清、新数据加载、选择页不再有续玩横幅

8. 真机测试（iPad PWA）。

9. 完成后用单行英文 git commit + push。

10. 更新 PROGRESS.md：M26 标记完成（游戏端核心流程到此打通）。
```

**验证清单**:

- [ ] 所有关键节点都自动保存
- [ ] 续玩弹窗正常显示
- [ ] 续玩跳转到正确状态
- [ ] 放弃续玩留在启动页
- [ ] M18 未完成游戏导入保护补测通过
- [ ] 测试 checklist 归档
- [ ] PROGRESS.md 更新

---

🎉 **游戏端 MVP 完成!** 接下来联调 + 真实测试。

---

## 🟥 MVP 阶段 D:联调 + 真实测试(M27-M30,0.5-1 周)

> 把编辑端和游戏端串起来跑一遍,然后带孩子去户外真测。

---

### [ ] M27. 端到端联调(从家长建 L1 → iPad 玩通关)

**前置**:M26
**预计时间**:1-2 天
**类型**:综合测试

**【你要做的事】**

**1. 准备阶段(在电脑上)**:
- 打开编辑端
- 建一个 L1「第一次真实测试探险」
- CSV 导入 30 道适合自家孩子年龄的题
- 建 3 个 L2,每个 L2 绑 3 道题
- 打印 1 份二维码(裁剪好)
- 打印 1 份应急小抄(可以截图存手机)
- JSON 导出

**2. iPad 同步**:
- AirDrop / 邮件 / 微信发 JSON 到 iPad
- iPad 游戏端 → 设置 → 整库覆盖导入 → 选文件
- 验证导入成功

**3. 室内模拟测试**:
- 把 3 个二维码贴在家里 3 个地方(假装是户外打卡点)
- 自己拿 iPad 走完整流程:
  - 启动 → 选探险 → 开始
  - 走到第 1 站 → 扫码 → 答 3 道题 → 拍照
  - 走到第 2 站 → 扫码 → 答题 → 拍照
  - 走到第 3 站 → 扫码 → 答题 → 拍照
  - 看通关页

**4. 故意测各种边界**:
- [ ] 扫错码(扫第 2 站时扫第 3 站的二维码)→ 应提示
- [ ] 输错数字码 → 应提示
- [ ] 答错 3 次 → 保底通过
- [ ] 用一次求助 → 该题得 3 分
- [ ] 跳过一次拍照 → 通关页该 L2 没合影
- [ ] 玩到一半 Home 键退出 → 重启 → 续玩弹窗
- [ ] 续玩成功
- [ ] **关键:iPad 飞行模式下整局玩通**(验证完全离线)

**5. 如果发现 bug**:

```
联调测试发现 bug:
[详细步骤 + 期望 + 实际 + F12 截图]
请帮我定位修复。
```

**6. 全部通过后 commit + push**

**验证清单**:

- [ ] 完整工作流跑通(电脑建 → iPad 玩通关)
- [ ] 所有边界场景都正确处理
- [ ] iPad PWA 飞行模式下完整可玩
- [ ] 所有 bug 修复
- [ ] PROGRESS.md 更新「联调完成」
- [ ] commit + push

---

### [√] M28. 第一次真实户外测试 + 修 bug

**前置**:M27
**预计时间**:测试半天 + 修 bug 1-2 天
**类型**:真实场景验证

**【你要做的事】**

**1. 准备**:
- 选个晴天周末
- 准备一个适合的场地(小区、公园、商场内部都行)
- 设计 3-4 个 L2(为孩子量身定制)
- 出门前:
  - [ ] 二维码打印好,裁剪好
  - [ ] 胶带或便利贴(贴二维码用)
  - [ ] 应急小抄打印或截图存手机
  - [ ] iPad 电量满
  - [ ] iPad 关 wifi 进飞行模式(故意测离线)
  - [ ] 自己手机带着(应急上网查码)

**2. 现场**:
- 提前到场,贴二维码
- 把 iPad 给孩子,告诉规则
- 在旁边观察,不要干预
- 拍视频/记笔记记录:
  - 孩子的真实反应
  - 卡在哪里
  - 哪里很顺畅
  - 哪里 UI/操作不直观

**3. 回来后**:
- 列出所有发现的问题
- 优先级排序
- 找 Claude Code 修关键 bug
- 不重要的小问题先记下来,等 M29 一起改

**【常见户外问题预判】**:

| 问题 | 应对 |
|------|------|
| 阳光下屏幕看不清 | 调亮度,或找树荫,记下来 V1 优化 |
| 二维码被风吹走 | 用「找不到?」按钮 + 应急小抄 |
| 扫码扫不出(光线/抖动)| 用「输入数字码」 |
| 孩子答错很受挫 | 看是题太难还是文案问题 |
| iPad 没电 | 改进:每次出门前必充电 |

**验证清单**:

- [ ] 至少完成 1 个完整 L1 的户外测试
- [ ] 记录孩子真实反应
- [ ] 关键 bug 修复
- [ ] 小问题清单整理(等 M29 处理)
- [ ] PROGRESS.md 更新
- [ ] commit + push

---

### [√] M29. 第二次真实户外测试 + 收尾

**前置**:M28
**预计时间**:测试半天 + 收尾 1-2 天
**类型**:验证修复 + 体验打磨

**【你要做的事】**

**1. 这次的目标**:
- 验证 M28 修复的 bug 真的解决了
- 把 M28 记下的小问题修一遍
- 让孩子玩一个**新的** L1(不是上次玩过的)

**2. 准备**:
- 设计一个新 L1(题目和上次完全不一样)
- 选不同的场地(看场地适应性)
- 同样出门前清单 + iPad 飞行模式

**3. 这次特别留意**:
- 孩子是不是还有兴趣(关键!)
- 玩完后愿不愿意立刻玩第二局
- 通关合影孩子喜不喜欢看
- 整体节奏是不是合适(太长 / 太短)

**4. 回来后**:
- 修剩下的小问题
- 写一份 MVP 总结到 docs/MVP_summary.md:
  - 哪些设计经得起真实测试
  - 哪些地方需要 V1 改进
  - 孩子的反馈摘录
  - 你自己的反思

**5. 收尾工作**:
- 把所有测试 checklist 整理到 docs/test-checklists/
- 写 docs/known-issues.md 记录已知的非关键问题(留 V1 处理)
- 整理代码:删除调试用的 console.log(保留关键日志)、删除注释掉的旧代码

**验证清单**:

- [ ] 第二次户外测试完成
- [ ] M28 的 bug 都验证修复
- [ ] M28 的小问题清单处理完
- [ ] docs/MVP_summary.md 写完
- [ ] docs/known-issues.md 整理
- [ ] 代码 cleanup
- [ ] PROGRESS.md 更新
- [ ] commit + push

---

### [ ] M30. MVP 完成里程碑

**前置**:M29
**预计时间**:1 小时
**类型**:里程碑

**【复制给 Claude Code 的指令】**

```
MVP 全部完成!请帮我做一次完整检查和总结:

1. 验证项目结构完整:
   - 根目录:CLAUDE.md(v1.7)、README.md、index.html、.gitignore
   - admin/:完整的编辑端
   - play/:完整的游戏端 PWA
   - shared/:数据模型 + IndexedDB 封装 + 工具函数
   - docs/:全部文档完整,含 test-checklists/、MVP_summary.md、known-issues.md

2. 写一份 MVP 完成报告 docs/MILESTONE_MVP.md,包含:
   - M01-M30 任务清单(已完成)
   - MVP 实际花了多少周(算实际时间)
   - 当前 App 能做什么(具体功能列表)
   - 已知问题(从 known-issues.md 引用)
   - 下一步:V1 即将开始(多人 + 完整庆典 + 探险地图 + 单 L1 追加导入)
   - 给我一些鼓励的话 🎉

3. 更新 docs/PROGRESS.md,标记 MVP 完成

4. 帮我做一次完整 commit + push:
   "🎉 MVP 完成:v1.7,孩子能玩通一个完整 L1 探险"

5. 在 README.md 顶部加一个 badge / 文字「MVP 已完成 ✅」
```

**最后给自己**:

🎉 **MVP 完成!**

你刚刚做到了:

- ✅ 从零基础学了 3-4 个月,做出一个真正能用的 PWA App
- ✅ 跨过了 90% 想做 App 的人都会卡住的关卡
- ✅ 让自己的孩子真的玩到了你做的东西
- ✅ 验证了产品方向

**重要的小总结**:

- 如果孩子还想玩 → 准备进入 V1,继续 4-5 周做多人 + 地图
- 如果孩子兴趣一般 → 想想是产品方向问题还是题目设计问题
- 如果你自己累了 → 给自己一个长假,什么时候想继续什么时候继续

**给自己买个真正的大奖励**——一次小旅行、一顿好饭、或者一个新键盘。你值得!

---

## 📌 完成 MVP 后,下一步

完成本任务清单后,告诉 claude.ai 网页版:「我完成了 MVP,需要 V1 的任务清单」。

**V1 大致路径**(预告,详见后续任务清单):

- V1 阶段 1:多人模式(玩家创建、答题归属、积分难度加成)
- V1 阶段 2:完整通关庆典(投票、颁奖、保底奖)
- V1 阶段 3:探险地图(上传、标记编辑器、扫码后动画、盖章动画、通关页全亮图)
- V1 阶段 4:单 L1 追加导入 + 故事背景 + 主动暂停按钮 + 题目插图
- V1 阶段 5:真实测试 + 修 bug

---

## 💡 一些跨任务的提醒

### 关于 git commit 节奏

每完成一个 M0X 任务(或一个功能小块),让 Claude Code 帮你 commit + push 一次:

```
请帮我用 git commit + push 当前修改,
commit message 写:完成 M0X:[任务名]
```

### 关于「卡住超过 30 分钟」

如果某个任务卡了 30 分钟还没解决,**不要硬扛**:

1. 把当前情况写清楚发给 claude.ai 网页版(我)
2. 包括:你想做什么、你做了什么、Claude Code 说了什么、报了什么错
3. 网页版 Claude 视角更全面,能从更高维度帮你诊断

### 关于切换模型

- **默认 Sonnet 4.6**:日常写代码、改 bug
- **遇到难题切 Opus 4.7**:在 Claude Code 里输入 `/model` 切换
- 解决后切回 Sonnet 节省额度

### 关于 MVP 阶段的约束

**严格遵守 v1.7 的边界**:

- ❌ MVP 不做多人、地图、投票、颁奖、应急通关裁判模式、主动暂停、单 L1 追加导入、故事背景页
- ❌ MVP 不实现「永远不做」清单中的任何功能(朗读、zip 包、密码保护等)
- ✅ MVP 只做整库覆盖导入
- ✅ MVP 编辑端 UI 完全不显示地图字段

如果开发中觉得「这个功能加上去也不难」,**先停下来,问 claude.ai 网页版**,不要随意扩范围。范围扩散是 MVP 失败最常见的原因。

### 关于真机测试的纪律

**每个功能块完成后都要真机测试**,而且游戏端必测 3 态:
1. iPad Safari 浏览器
2. iPad PWA 主屏幕图标(有网)
3. iPad PWA 主屏幕图标(飞行模式)

漏测 = 户外发现问题 = 浪费整个家庭的时间。

---

## 🔗 相关文档

- `CLAUDE.md`(v1.7) - 项目说明书,Claude Code 自动读取
- `docs/PRD.md`(v1.7) - 完整产品需求
- `docs/版本路线图.md`(v1.7) - MVP / V1 / V2 时间估算
- `docs/PROGRESS.md` - 实时进度记录(Claude Code 自动维护)
- `docs/test-checklists/` - 各功能块的手动测试 checklist
- `docs/pages-data.md` - 各页面数据清单
- `docs/design-tokens.md` - 视觉设计规范
- `docs/MVP_summary.md`(M29 后)- MVP 完成总结
- `docs/known-issues.md`(M29 后)- 已知问题清单

---

**祝你 MVP 顺利!我们 V1 见。** 🚀
