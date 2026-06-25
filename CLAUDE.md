# 寻宝游戏 PWA 项目说明

> 这个文件是给 Claude Code 看的「项目说明书」。每次启动新对话时 Claude Code 会自动读取这个文件,了解项目背景和约定。**不要删除这个文件**。
>
> > **当前版本:v1.9.4**(详见文末更新记录)

---

## 1. 项目背景

这是一个**双站点的儿童户外解谜游戏项目**:

- **编辑端(admin)**:普通网页,家长在电脑/iPad/手机浏览器里设计探险和题库
- **游戏端(play)**:iPad 上的离线 PWA,孩子户外扫码答题

**核心理念**:编辑和游戏完全分离的两个独立网站,简化复杂度、避免误操作。

**目标用户**:
- **家长**(编辑者):自己孩子的爸妈,4-12 岁孩子家长
- **孩子**(玩家):4-12 岁儿童,**MVP 单人**,V1 多人

**数据流**:
- 编辑端浏览器 IndexedDB → 导出 JSON → AirDrop/邮件传到 iPad → 游戏端 PWA 导入
- **JSON 文件就是数据库**,浏览器只是工作台

**核心约定**:
- 两端 IndexedDB **物理隔离 + 运行时拦截**:admin 用 `treasure-hunt-admin-db`,play 用 `treasure-hunt-play-db`
- **删除引用保护**:有引用的题目不能直接删,必须先在引用方解除
- **MVP 串行推进**:严禁多线并行,按"共享层 → 编辑端 → 游戏端 → 联调 → 测试"顺序
- **MVP CDN 优先**(v1.7 新增):第三方库通过 CDN 引入(带固定版本号),Service Worker 动态缓存

---

## 2. 三层数据结构

```
L1 探险(Level)              一次完整的户外活动
  ├── L2 点位(Point)        一个物理打卡点,1 个二维码 + 多道题
  │     ├── L3 题目 1(Question)
  │     ├── L3 题目 2
  │     └── L3 题目 N
  └── L2 × 3-5
```

**重要业务规则**:

- 一个 L2 包含**多道**题目(家长配置)
- 孩子扫码后**依次答完一个 L2 的所有题**才能进下一站
- 每个 L2 通关时**拍一张合影**(可选,跳过不阻塞)
- 整个 L1 通关后看总分 + 用时 + 所有已拍 L2 合影
- 合影数量等于 L2 数量(不写死 5 张)

---

## 3. 技术栈(已锁定,请遵守)

**前端**:纯 HTML + CSS + JavaScript,**不使用任何前端框架**

**核心依赖库**(**v1.7 修订:MVP 阶段通过 CDN 引入,带固定版本号**):

| 用途 | 库 | CDN URL 示例 |
|------|---|------------|
| 本地存储 | Dexie.js | `https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.min.js` |
| 扫码 | html5-qrcode | `https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js` |
| 二维码生成 | qrcode-generator | `https://cdn.jsdelivr.net/npm/qrcode-generator@2.0.4/dist/qrcode.js` |
| CSV 解析 | PapaParse | `https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js` |
| 调试 | Eruda | `https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js`(?debug=1 时加载) |
| 拼音标注 | pinyin-pro | `https://cdn.jsdelivr.net/npm/pinyin-pro@3.18.2/dist/index.js`（全局名 `pinyinPro`，V1-A 起） |

**CDN + Service Worker 离线工作原理**:
- 第一次访问游戏端(有网):浏览器从 CDN 下载库 → SW 自动缓存
- 之后所有访问(包括飞行模式):SW 从缓存读 → 完全离线工作 ✅

**版本号固定**:必须用 `@3.2.4` 这种固定版本号,不要用 `@latest`,避免版本漂移导致离线缓存失效。
**ES 模块怎么用这些 CDN 库**:这 5 个库都用普通 <script> 加载,名字挂在全局上
(Dexie、Papa、Html5Qrcode、qrcode、eruda)。我们自己写的 .js 是 ES 模块(import/export),
里面要【直接用这些全局名】(如 new Dexie(...)、qrcode(0,'M')),
【不要写 import Dexie from 'dexie' 这种】——项目没有打包工具,这样写会直接报错。
HTML 里务必把库的 <script> 放在自己的 <script type="module"> 之前。

**编辑端**:普通网页,**不做 PWA**,浏览器直接打开使用
**游戏端**:完整 PWA + Service Worker(动态缓存策略),iPad Safari 安装到主屏幕

**禁止使用**:React/Vue/Svelte、TypeScript、jsPDF(用 window.print 代替)、HMAC、UUID v4(用短 ID)、jschardet(CSV 编码用文案提示)、JSZip(V1 图片用 base64 直接进 JSON)

**部署**:GitHub Pages,两个端在同一仓库不同子目录。**v1.9.1 起改为双分支双部署**(GitHub Actions):`release` 分支→网站根目录(孩子玩的稳定版),`main` 分支→根目录下 `/dev/`(开发版,PWA 名字「寻宝-DEV」+橙色图标,DEV 标记仅部署时注入不进源码)。改 `main` 不影响孩子已装的 App。完整发布/同步流程见 `docs/双分支发布说明.md`。

---

## 4. 项目结构

```
treasure-hunt/
├── admin/                      # 编辑端(普通网页,不做 PWA)
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   ├── pages/
│   │   ├── levels.html         # L1 管理
│   │   ├── questions.html      # 题库管理
│   │   ├── import-export.html
│   │   └── ...
│   └── assets/
│
├── play/                       # 游戏端(PWA)
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js       # 动态缓存策略,不手写 FILES_TO_CACHE 列表
│   ├── styles/
│   ├── scripts/
│   └── assets/
│
├── shared/                     # 两端共享的代码
│   ├── models/                 # 数据模型定义
│   ├── db/
│   │   └── db-config.js        # ⚠️ 两端数据库名常量 + 运行时拦截(见下方约定)
│   ├── utils/                  # 工具函数(ID 生成、JSON 导入导出等)
│   └── libs/                   # (v1.7 暂时空,MVP 用 CDN;后续视需要本地化)
│
├── docs/                       # 项目文档
│   ├── PRD.md
│   ├── PROGRESS.md
│   ├── 版本路线图.md
│   ├── 任务清单_V1.md  
│   └── test-checklists/        # 真机测试检查清单(v1.7 新增,见 §5.7)
│
├── README.md
└── .gitignore
```

**访问网址**(仓库 `Tlook-spec/treasure-hunt-pwa-`,双分支双部署):

| 分支 | 用途 | 游戏端网址 | 编辑端网址 |
|------|------|-----------|-----------|
| `release` | 🧒 孩子玩(稳定版) | `https://tlook-spec.github.io/treasure-hunt-pwa-/play/` | `.../treasure-hunt-pwa-/admin/` |
| `main` | 🛠️ 开发测试(寻宝-DEV) | `https://tlook-spec.github.io/treasure-hunt-pwa-/dev/play/` | `.../treasure-hunt-pwa-/dev/admin/` |

**命名约定**:
- 文件名:小写 + 短横线,如 `quiz-page.js`
- 函数名:驼峰,如 `getCurrentPoint()`
- 类名:大驼峰,如 `GameSession`
- 常量:全大写下划线,如 `MAX_HELP_COUNT`
- **实体 ID**:短 ID 格式 `lvl_xxx_yyy`、`pt_xxx_yyy`、`q_xxx_yyy`、`sn_xxx_yyy`、`ph_xxx_yyy`、`p_xxx_yyy`

**短 ID 生成方式**(v1.7 明确):

```javascript
// shared/utils/id.js
export function generateId(prefix) {
  const timestamp = Date.now().toString(36);      // 时间戳 base36
  const random = Math.random().toString(36).substr(2, 4);  // 4 位随机
  return `${prefix}_${timestamp}_${random}`;
}

// 用法:
generateId("lvl");  // → "lvl_lq2nx8j2_a3kf"
generateId("pt");   // → "pt_lq2nxa1f_b5kc"
```

时间戳每毫秒变一次,**不需要写 IndexedDB 查重循环**。

### 4.1 IndexedDB 数据库约定(v1.7 强化)

⚠️ **必须严格遵守**:admin 和 play 同源(GitHub Pages 同一域名),如果用同名数据库会**共享数据**导致污染。

**两端必须用不同的数据库名**:

| 端 | 数据库名 |
|---|---------|
| 编辑端 admin/ | `treasure-hunt-admin-db` |
| 游戏端 play/ | `treasure-hunt-play-db` |

**统一存放数据库名常量 + 运行时拦截**(v1.7 新增):在 `shared/db/db-config.js` 定义:

```javascript
// shared/db/db-config.js
export const ADMIN_DB_NAME = "treasure-hunt-admin-db";
export const PLAY_DB_NAME  = "treasure-hunt-play-db";

/**
 * 运行时拦截:防止 admin 代码意外访问 play 数据库,或反之
 * 在任何 IndexedDB 操作之前调用
 */
export function assertDbContext(dbName) {
  const isAdminPath = location.pathname.includes('/admin/');
  const isPlayPath = location.pathname.includes('/play/');
  
  if (isAdminPath && dbName !== ADMIN_DB_NAME) {
    throw new Error(`[违反物理隔离] admin 路径不允许访问 ${dbName}`);
  }
  if (isPlayPath && dbName !== PLAY_DB_NAME) {
    throw new Error(`[违反物理隔离] play 路径不允许访问 ${dbName}`);
  }
}
```

admin 端引用 `ADMIN_DB_NAME`,play 端引用 `PLAY_DB_NAME`,**在每次打开 Dexie 实例前调用 `assertDbContext()`**。

**严禁**:
- ❌ admin 端读 / 写 `treasure-hunt-play-db`
- ❌ play 端读 / 写 `treasure-hunt-admin-db`
- ❌ 任何"跨端直接传数据"的代码(必须通过 JSON 文件中转)

---

## 5. 开发者画像与协作约定

**开发者**:完全零基础,每天 1-2 小时,每周 5-8 小时,Windows 11 + VS Code + Claude Code

**协作原则**:

### 5.1 代码风格

- 写最简单的代码(不用复杂设计模式)
- 多写中文注释
- 变量名清晰(宁可长不要短缩)
- 函数 20-30 行内
- 一个函数只做一件事
- **ES Module 全局约定**(v1.7 新增):admin/play 入口 HTML 用 `<script type="module">`;Service Worker 单独处理(用 `importScripts` 或 `self.onfetch` 内联)

### 5.2 沟通风格

- 打比方解释,不堆术语
- 报错时给操作指引
- 每次回答控制长度
- 多种方案先列选项让用户选
- Windows 环境用 PowerShell 语法
- git commit 消息用单行英文（PowerShell 下多行中文 commit message 会乱码）
- **始终用中文回复**（含解释、报错指引、注释；偶尔飘到其他语言时用户会提醒，请立即切回中文）

### 5.3 范围控制

- 一次只做一件事
- 不主动重构
- 加新功能不破坏旧功能
- 大改动先讨论

### 5.4 错误处理

- 先收集完整错误信息
- 不确定时直说,别瞎编
- 修复后清楚说明改了什么

### 5.5 Service Worker 维护(v1.7 重大修订)

**MVP 阶段直接采用「动态缓存策略」**,不手写 FILES_TO_CACHE 列表:

```javascript
// play/service-worker.js 核心逻辑
const CACHE_VERSION = "treasure-hunt-runtime-v1";

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(event.request).then(cached => {
        // 优先用缓存,后台更新
        const networkFetch = fetch(event.request).then(response => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
```

**好处**:
- 不需要每次新增/重命名文件后改 SW
- CDN 资源(Dexie、html5-qrcode 等)自动缓存
- 第一次访问需有网,之后完全离线

**版本升级**:改 `CACHE_VERSION = "treasure-hunt-runtime-v2"` 强制清除旧缓存。

### 5.6 MVP 串行推进原则

**严禁多线并行开发**。MVP 范围对零基础开发者较紧凑,必须严格按顺序:

1. **共享层**(数据模型 + IndexedDB 封装 + 工具函数)
2. **编辑端**(L1 CRUD → L2 CRUD → 题库 CRUD → CSV 导入 → 二维码 → JSON 导出)
3. **游戏端**(基础 PWA → 扫码 → 单题答题 → 多题连答 → 求助 → 通关合影 → 通关页)
4. **联调**(JSON 同步、续玩、「找不到?」按钮)
5. **真实测试 + 修 bug**

每完成一个功能块 → 真机测试 → 通过后才进入下一个。

### 5.7 测试策略(v1.7 新增章节)

**自用 App,不写自动化测试**(zero unit tests, zero integration tests)。**真机测试 + 浏览器测试是唯一标准**。

**每个功能块完成后必须做的**:

1. 写一份「手动测试 checklist」并归档到 `docs/test-checklists/`
2. 文件命名:`MVP-编辑端-L1CRUD.md`、`MVP-游戏端-扫码.md` 等
3. 模板内容:
   ```markdown
   # 功能名:[XX]
   
   ## 桌面浏览器测试(Windows + Chrome)
   - [ ] 操作 1 → 期望结果 1
   - [ ] 操作 2 → 期望结果 2
   - [ ] F12 Console 无红色错误
   
   ## iPad Safari 测试
   - [ ] 同上
   
   ## iPad PWA 主屏幕图标测试(仅游戏端)
   - [ ] 同上
   - [ ] 飞行模式下重启 App 仍正常
   ```

**iPad 测试三态覆盖**(游戏端必查):
1. Safari 浏览器直接访问(有网)
2. PWA 主屏幕图标启动(有网)
3. PWA 主屏幕图标启动(飞行模式,验证 Service Worker 离线缓存)

任何一个状态出问题都不算「测试通过」。
**游戏端：local 草稿 / iPad 验收（MVP 阶段 C 适用）**

> 大前提：不管哪个任务，最终「算不算做完」一律以 iPad 三态为准。下表只说「写代码、调逻辑」阶段在哪测最快。**local 当草稿纸，iPad 当验收。**

| 档 | 任务 | 草稿阶段在哪测 | 原因 |
|---|------|------------|------|
| 🔴 只能 iPad | M16 PWA框架+离线 | 直接推 GitHub 上 iPad | 核心是「飞行模式能开 App」，电脑无等价测试 |
| 🔴 部分只能 iPad | M26 续玩 | 逻辑 local；「Home退出/锁屏/切后台」必须 iPad | iPad 退出/后台行为与电脑差异大 |
| 🟡 local测功能、iPad验真实 | M18 JSON导入 | 导入逻辑 local；真实 AirDrop 传文件 iPad | 文件传输是 iPad 专属 |
| 🟡 同上 | M20 扫码 | 电脑摄像头验功能；真实握持/距离/打印码 iPad | 孩子举 iPad 找纸上的码 |
| 🟡 同上 | M24 拍照合影 | 电脑摄像头验功能；真实拍照体验 iPad | 同上 |
| 🟢 local基本搞定 | M17/M19/M21/M22/M23/M25 | 大胆 local 迭代，iPad 走一遍三态确认 | 纯 UI+逻辑，电脑可测全 |

一句话：**M16 一上来就上 iPad；扫码/拍照(M20/M24)电脑能调但 iPad 才算数；其余在电脑上迭代，最后 iPad 过三态。** 推送节奏对齐「真机验收」（一个 M 任务推一次），不对齐「每次代码改动」。
---

## 6. 核心数据模型(简要)

详见 `docs/PRD.md` §6,这里只列概念:

- **Level (L1)**:探险,**v1.5 起无 password 字段**,points 通过外键 levelId 关联;V1 增 coverImage(封面图)、groupAwardName/groupAwardImage(小组奖)、openingStory/endingStory、地图字段
- **Point (L2)**:点位,包含 questionIds 数组(多题)、code(6 位数字);V1 增 hintImage(找站提示页图片)、questionIntroText/completionText、mapX/mapY
- **Question (L3)**:题目(usedCount 字段已遗留,使用次数改为实时引用数计算)
- **Player**:玩家(V1 多人)
- **GameSession**:游戏会话,含 pointRecords(每 L2 内多 questionResults)
- **PhotoBlob**:照片存储(仅头像 + L2 通关合影两类)
- **JSON Envelope**:导出文件外层 schema,含 `schemaVersion` + `exportedAt` + `exportType` + `data`(v1.7 删除 `exportedBy` 字段)

**关键架构原则**:

- 短 ID(不用 UUID v4,生成方式见 §4)
- 每 L2 一张通关合影(不是每题都拍)
- 使用次数实时计算(扫描所有 Point.questionIds),不存储,不随导入更新
- **不做 snapshot 机制**——session 直接引用当前 L1 数据
- **导入数据保护**:导入前检查未完成游戏并二次确认
- **JSON 版本检查**:MVP / V1-A 严格检查 schemaVersion === "1.0";V1-B(任务 V1-19)加地图字段升 1.1 时,放宽为「主版本号为 1 即接受」(详见 PRD §7.5)。注:explanation 自 MVP 起就在 1.0 文件里,**非** 1.1 新增字段

---

## 7. 重要业务规则

1. **顺序解锁**:按 L2 顺序扫码
2. **二维码内容**:纯 6 位数字短码(同时用于扫码 + 手动输入)
3. **6 位数字码 fallback**:扫不出时手动输入,**输码 → 进入答题**(与扫码成功一样)
4. **「找不到?」按钮**(v1.7 澄清语义):二维码丢失/损坏时家长帮忙输码,**输码 → 进入答题**(与「输入数字码」最终行为一致,只是入口语义不同)。数字码从家长手机/iPad 联网查编辑端,或翻打印的「应急小抄」清单。**MVP 不做「真跳过」功能**(应急通关裁判模式推到 V2)
5. **求助机制**:3 次/局,标记 `usedHelp=true`,按钮位于答题页**右上角**
6. **答错容错**:每道题最多 3 次,第 3 次错保底通过(0 分)
7. **计分规则**:
   - 一次答对 = 10 分
   - 错 1 次后答对 = 5 分
   - **曾用求助** = 3 分(覆盖所有用过求助的情况)
   - 保底 = 0 分
8. **L2 多题**:一个 L2 含多道题,依次答完才能进下一站
9. **拍照**:每 L2 通关一张合影,可选不阻塞;拍照后回扫码**不用自动倒计时,显示「📷 继续扫码找下一站」按钮让用户点击触发**(v1.7 修订)
10. **多人(V1 D 区 = 合作式轻量版,2026-06-24 简化)**:开局创建玩家(头像可选+名字+数字编号+6 色选一,无头像用「颜色块+编号」)+ 队名(可选);**单人玩法零改动**。详见 `docs/任务清单_V1.md` D 区(V1-27~V1-31)
11. **多人答题/计分(V1)**:**答题流程和单人完全一样**——全队共享一个总分,**不选「谁答对」、不算个人分**(归属选择/个人积分推 V2)
12. **小组颁奖(V1)**:通关给**整队**颁一枚奖(奖名+奖图每个 L1 自配,见 Level.groupAwardName/groupAwardImage,可空走内置默认),人人有份故**无保底奖**
13. ⏭️ **推到 V2 的多人细节**:答题归属选择、个人积分(难度加成 ×1.2/×1.5)、连续答对计数(独占被选 +1)、答题之星揭晓、投票颁奖、保底奖、投票超时 30 秒。GameSession 的 voteRecords/awards、Level 的 customAwards 均为此预留
14. **题库使用次数**:实时计算当前被多少个点位引用,不存储,不随绑定/移除/导入维护
15. **删除引用保护**:删除题目时检查引用,有引用则拒绝并提示先解除引用;删除 L1 时连同其 L2 一起删(不影响题库)
16. **MVP 不做主动暂停按钮**:只做自动保存 + 启动时续玩检查,孩子要"暂停"就直接退出 App
17. **导入数据保护**:游戏端导入 JSON 前检查未完成游戏 + schemaVersion === "1.0"
18. **应急通关**:完整裁判模式 **v1.7 调整,从 V1 推迟到 V2**(长按 5 秒 + 数学题验证,无 L1 密码)。MVP 只有「找不到?」按钮
19. **ID 一致性**:所有短 ID(lvl_xxx_yyy 等)一旦生成永不变,是跨设备 JSON 同步判重的基础
20. **探险地图**(V1 新增,MVP 数据预留 UI 不显示):
    - 编辑端 MVP **完全不显示**地图相关 UI,数据字段默认 null
    - 手绘图只画风景 + 图标 + 路径,圆圈/名称/印章全部 App 动态渲染
    - 点位坐标用 **0~1 小数**存储(admin 端 clamp01),**渲染时 ×100 转成百分比**,两端必须一致(踩过坑:play 直接当 % 用会把标记钉到角落)
    - 标记锚点 = **图标中心对齐坐标点**(`translate(-50%,-50%)`),名字 absolute 挂图标下方,两端(admin 标记器 / play 渲染)必须一致
    - 3 段文案柔性可空;地图三态(未发现/已发现/已完成)
    - **三态图标(2026-06-25 改版)**:未到 = 灰圆 + 站点编号(**不显示站名**,避免剧透)/ 已发现 = 红圆 + 定位图钉 / 已完成 = 绿圆 + 白勾;盖章动画落点为绿圆白勾,名字变金(旧版红色五角星已替换)
    - **V1-A 落地为内嵌式**:发现页(发现文案 + 地图浮现 + 答题引导)、拍照页(通关庆祝 + 地图盖章)都在页内显示,**不用弹窗 / 全屏地图覆盖层**;地图与海报字体**先用系统字体**(不引字体文件)
21. **应急小抄打印**(v1.7 新增):编辑端 L1 详情页提供「📋 打印应急小抄」按钮,A4 一页含所有 L2 数字码,家长出门前打印或截图存手机
22. **v1.7 删除的功能(永远不做)**:朗读、完整 PDF 批量打印、JSON 智能合并、退出玩家重新加入、头像贴纸滤镜、最近删除回收站、编辑端密码保护、拖拽排序、L1 zip 包导出、CSV 编码自动检测

---

## 8. 当前项目状态

> 每完成一个任务后,请更新 `docs/PROGRESS.md`。新对话开始时先读 PROGRESS.md。

**当前阶段**：🟥 V1 D 区 进行中（V1-27 多人队伍创建 ✅ + UI/暖色配色改版 ✅，已 main/release 双推发版 2026-06-25）→ 下一步 V1-28 编辑端 L1 小组奖配置

**已完成**：T01-T13（环境 + 设计）、M01-M30（MVP 全部）、V1-01~08（A 区单人打磨）、V1-09~20（B 区 地图+故事+海报）、V1-21~26（C 区:暂停/单 L1 导入导出/填空题/随机抽题/联调，已发版）、V1-27（D 区 游戏端多人队伍创建）、双分支双部署基建
**本次发版还含（非编号）**：L1 封面图 + L2 提示图上传；游戏端全局换 V0 暖色系（橙/青绿/金/米底，见 §9）；地图三态图标重做（灰编号/红图钉/绿勾）；hint 站点步进条、答题进度+总分条、过关本站得分、通关 3 格+海报暖白化；CACHE_VERSION v2.28
**待处理**：D 区 V1-28（L1 小组奖配置）→ V1-29（多人版庆典+小组颁奖）→ V1-30（数据/续玩/导入导出兼容）→ V1-31（联调）→ E 区 真机验收（V1-32~35）
**部署须知**：孩子玩的是 `release` 分支。日常在 `main` 开发不影响孩子;给孩子发版需同步到 `release` 并改 `CACHE_VERSION`,流程见 `docs/双分支发布说明.md`。
---

## 9. 视觉规范

详见 PRD §5.2（完整色表）。

- **游戏端主色:探险橙 `#E0772F`**(2026-06-25 起 V0 暖色系:次色海洋青 `#3FAEB8`、强调金 `#E8B43C`、暖米底 `#F4EAD5`、近白米卡片 `#FDF8EE`、深褐字 `#52402D`);全局变量集中在 `play/styles/main.css` 的 `:root`。**admin 编辑端仍用蓝色系,本次未改**
- 系统字体(微软雅黑 / 苹方)
- 圆角 12-16px
- 按钮最小 60×44px
- 重要文字最小 16px

**响应式断点(简化为 2 档)**:
- ≤ 768px:iPad 竖屏 / 手机 / 平板移动布局
- ≥ 769px:桌面横屏布局

---

## 10. 与 Claude Code 协作示例

**场景:创建新功能**

```
用户:"请帮我加一个求助按钮"

期望:
1. 确认需求:"理解你要的是:在答题页右上角加'求助 N'按钮,
   点击后求助次数 -1,标记本题 usedHelp=true,弹'快去问爸爸妈妈!',对吗?"
2. 等用户确认
3. 修改文件,加中文注释
4. 修改完告知如何测试
5. 更新 PROGRESS.md
6. 提醒用户加一份手动测试 checklist 到 docs/test-checklists/(v1.7 新增)
```

**场景:用户报错**

```
用户:"按了求助按钮没反应"

期望:
1. 收集信息:「请按 F12 打开 Console,再点一次按钮,截图发我」
2. 根据错误定位
3. 给修复方案 + 解释原因
```

**场景:iPad 调试**

```
用户在 iPad 上遇到问题。

期望:
1. 提示用调试网址打开:网址后加 ?debug=1
2. 引导打开 Eruda(点右下角齿轮)
3. 让用户截图 Console 错误
4. 根据错误诊断
```

**场景:删除题目时遇到引用**

```
用户:"为什么删不了这道题?"

期望:
1. 解释:「这道题被 X 个 L2 点位使用了,PRD 规定有引用的题目不能直接删,
   避免数据不一致」
2. 给指引:「你需要先去那些 L2 里把这道题移除,然后再来删」
3. 询问:「我可以帮你查这道题被哪些点位引用,要查吗?」
```

**场景:CDN 库引入**(v1.7 新增)

```
用户:"扫码功能怎么集成?"

期望:
1. 在 play/index.html 的 <head> 加:
   <script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
2. 提醒用户:"必须用固定版本号 @2.3.8,不要用 @latest,
   否则离线时缓存可能失效"
3. 第一次访问游戏端必须有网,让 Service Worker 把 CDN 资源缓存住
4. 之后飞行模式可用
```

---

## 11. 禁止事项

### 11.1 技术禁止

- ❌ React / Vue / Svelte 等框架
- ❌ 大型 UI 库(Bootstrap、Tailwind 完整版、Material UI)
- ❌ TypeScript
- ❌ 付费服务
- ❌ 复杂代码炫技
- ❌ 一次性写 500+ 行新代码
- ❌ **使用 CDN 引入的版本号写 @latest**(v1.7 强调:必须用固定版本号)
- ❌ 使用 jsPDF(用 window.print)
- ❌ 使用 HMAC(用 6 位数字短码 + 数据库查询)
- ❌ 使用 UUID v4(用短 ID)
- ❌ 使用 jschardet 等编码检测库(MVP CSV 用文案提示)
- ❌ 使用 JSZip(V1 图片直接 base64 进 JSON)
- ❌ 全量 snapshot 机制(直接引用即可)
- ❌ 手写 Service Worker FILES_TO_CACHE 列表(v1.7 改用动态缓存策略)

### 11.2 架构禁止

- ❌ **跨端访问 IndexedDB**:admin 端禁止读/写 `treasure-hunt-play-db`,play 端禁止读/写 `treasure-hunt-admin-db`。每次打开 Dexie 实例前必须调用 `assertDbContext()`
- ❌ **任何"两端直接传数据"的代码**(必须通过 JSON 文件中转)
- ❌ 编辑端做 PWA / 游戏端做编辑功能(双站点必须分离)
- ❌ 在 admin/ 目录写游戏代码 或 play/ 目录写编辑代码(除非是 shared/ 共用)

### 11.3 范围禁止

- ❌ MVP 实现 V1 / V2 功能
- ❌ MVP 实现完整应急通关裁判模式(v1.7 调整:推到 V2)
- ❌ MVP 实现主动暂停按钮(只做自动保存 + 续玩)
- ❌ MVP 实现 JSON 追加单 L1 导入(v1.7 调整:推到 V1)
- ❌ MVP 实现 L1 单导出(v1.7 新增:推到 V1)
- ❌ 删除或重命名用户文档
- ❌ 主动修改非当前任务范围的代码
- ❌ MVP 实现 V1 探险地图功能(数据字段可预留,但所有 UI / 交互 / 弹窗 / 动画一律推到 V1,**包括编辑端的「上传地图」表单字段也不要显示**)
- ❌ MVP 实现 V1 故事背景文本(数据字段可预留,但游戏端启动不读 openingStory)
- ❌ 实现 v1.7 已删除的功能:朗读、完整 PDF 批量打印、JSON 智能合并、退出玩家重新加入、头像贴纸滤镜、最近删除回收站、编辑端密码保护、拖拽排序、L1 zip 包导出、CSV 编码自动检测
- ✅ **拼音标注是纯显示**（<ruby> 标注），**不等于朗读**。朗读（Web Speech）仍永久不做；拼音功能允许。

### 11.4 流程禁止

- ❌ **多线并行开发** MVP 内功能(必须按 §5.6 顺序串行)
- ❌ **完成功能块后不写手动测试 checklist**(v1.7 新增要求)
- ❌ iPad 测试只测 Safari 浏览器,不测 PWA 主屏幕 + 飞行模式

---

## 12. 紧急情况

用户表达:「我快疯了」「完全不懂」「想放弃」 或连续 3 条都在报错,请:

1. 停止技术工作
2. 温和询问
3. 简化问题逐步引导
4. 必要时建议「今天先到这里,明天继续」

---

## 13. 文档更新记录

| 日期 | 版本 | 修改人 | 修改内容 |
|------|------|--------|---------|
| 初始 | v1.0 | 用户 + Claude | 基础说明 |
| 阶段 0 中 | v1.1 | 用户 + Claude | 双端体验、颁奖、投票等 |
| 阶段 0 末 | v1.2 | 用户 + 4 AI Reviewer + Claude | 基于 50 条 review 综合修订 |
| 阶段 0 末末 | v1.3 | 用户 + Claude | 双站点架构 + 三层结构 + 9 项简化 |
| 阶段 0 末末末 | v1.4 | 用户 + Claude Code Review + Claude | 12 项精细化修订 |
| 阶段 1 初 | v1.5 | 用户 + Claude | 砍掉 L1 密码、导入分两种模式、ID 一致性约定 |
| 阶段 1 中 | v1.6 | 用户 + Claude | V1 探险地图功能完整设计 |
| 阶段 1 末 | v1.7 | 用户 + 3 AI Reviewer + Claude | **基于多方 review 整合修订**:① MVP 阶段 CDN 引入第三方库 + 动态缓存 SW ② 删除手写 FILES_TO_CACHE 列表要求 ③ 短 ID 生成方式明确为时间戳+随机 ④ IndexedDB 物理隔离强化为「常量 + 运行时拦截」⑤ 拍照后回扫码改按钮触发 ⑥ usedCount 导入取较大值 ⑦ 应急通关裁判模式从 V1 推到 V2 ⑧ 应急小抄打印功能 ⑨ MVP 编辑端完全隐藏地图 UI ⑩ 删除 zip 包、JSON 智能合并、朗读、完整 PDF、退出玩家重加、头像贴纸、回收站、密码保护、拖拽排序、CSV 编码自动检测 ⑪ 添加测试策略章节(强制写手动测试 checklist + iPad 三态覆盖)⑫ ES Module 全局约定 ⑬ MVP 只做整库覆盖,L1 单导入/单导出推 V1 |
| MVP M01 中 | v1.7.1 | 用户 + Claude | 二维码库由 qrcode@1.5.3 换为 qrcode-generator@2.0.4，原 node-qrcode 浏览器构建无法作为普通脚本暴露全局变量 |
| MVP M09 后 | v1.7.2 | 用户 + Claude | usedCount 由存储累计值改为实时计算的当前引用数，消除列表与删除提示不一致；§6 和规则 14 同步更新 |
| MVP 阶段C前 | v1.7.3 | 用户 + Claude | §5.7 增加游戏端「local 草稿 / iPad 验收」分档表 + 始终用中文回复约定 |
| MVP 完成后 | v1.8 | 用户 + Claude | 进入 V1-A；新增 pinyin-pro CDN 库；澄清拼音≠朗读；当前状态更新为 V1 |
| V1-A 规划 | v1.9 | 用户 + 3 AI Reviewer + Claude | V1 改流水码 V1-01~38;海报并入 B 区一次到位;故事(开场/结局+三段文案)全归 B 区;多人+题型合并为 D 区并标待定;音效默认开取消开关;拼音加性能护栏;单 L1 导入走覆盖确认;放宽 validateJson 写入 V1-19 |
| B 区完成后 | v1.9.1 | 用户 + Claude | **双分支双部署上线**:`release`→根目录(孩子玩)/`main`→`/dev`(开发版「寻宝-DEV」橙图标);GitHub Actions 工作流自动部署,DEV 标记部署时注入不进源码;§3 部署、§4 访问网址同步更新;新增 `docs/双分支发布说明.md`(发布/同步/PWA 缓存流程) |
| C 区中 | v1.9.2 | 用户 + Claude | 题型工作并入 C 区:填空题(V1-24)+ 随机抽题(V1-25,复用现有筛选,修正 usedCount 遗留)前移到 C 区;D 区拆为纯多人;流水码重排 |
| C 区末 / D 区前 | v1.9.3 | 用户 + Claude | **D 区大幅简化为「合作式轻量多人」**(2026-06-24):个人积分归属/难度加成/连续答对/答题之星/投票颁奖/保底奖全推 V2;V1 多人只做「开局创建玩家(头像可选+名字+数字编号+6 色选一)+队名 → 答题流程零改动(共享总分)→ 通关给整队颁一枚奖(每个 L1 自配奖名奖图)」;新增 Level.groupAwardName/groupAwardImage,启用 GameSession.players/teamName;§7 规则 10-13 改写,D 区展开为 V1-27~31,E 区顺延 V1-32~35,全表收口 V1-01~35;单人零改动、不升 schema |
| C 区发版 / D 区初 | v1.9.4 | 用户 + Claude | **V1-27 多人队伍创建 + UI/暖色配色改版发版**(2026-06-25,main/release 双推):① 新增 `Level.coverImage`(封面图)、`Point.hintImage`(找站提示图),admin 上传、孩子端展示 ② 游戏端全局换 V0 暖色系(橙主 #E0772F / 青绿 #3FAEB8 / 金 #E8B43C / 暖米底 #F4EAD5 / 近白米卡片;§9、PRD §5.2 同步;admin 未改)③ 地图三态图标重做:灰圆编号(不显站名)/红图钉/绿勾,规则 20 同步 ④ start-level 单屏化 + 队员卡片重设计(编号不重复校验)⑤ hint 站点步进条 + 文案改「前往第 X 站」+ 取消顶进度条 ⑥ 答题进度+总分条、过关本站得分、通关 3 格 + 海报暖白化 ⑦ V1-26 联调收尾;`CACHE_VERSION` v2.28 |



---

> **最后**:这个项目对用户来说是「陪孩子户外玩」这个真实生活场景的工具,不是技术练习。请帮助用户聚焦在「做出能让孩子玩起来的东西」这个核心目标上,不要过度工程化。
