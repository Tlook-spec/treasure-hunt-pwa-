/**
 * shared/models/types.js
 * 数据模型定义（用 JSDoc @typedef 描述结构，供编辑器自动补全）
 * 对应 PRD v1.7 §6.1–6.6
 *
 * 使用方式：
 *   在其他 JS 文件顶部加一行注释：
 *   // @ts-check
 *   import {} from '../models/types.js';  // 只引入类型，运行时无副作用
 */

// ============================================================
// 6.1 Level（L1 探险）
// ============================================================

/**
 * @typedef {Object} Level
 * @property {string} id               - 短 ID，格式 lvl_xxx_yyy
 * @property {string} name             - 探险名称
 * @property {string} description      - 探险简介
 * @property {number} createdAt        - 创建时间戳（ms）
 * @property {number} updatedAt        - 最后修改时间戳（ms）
 *
 * @property {number} recommendedPlayerCount  - 推荐人数，MVP 默认 1
 * @property {string} recommendedAge          - 推荐年龄段，如 "7-9"
 * @property {string} themeColor             - 主题色，如 "#4A90E2"（仅 admin 端卡片色标，游戏端不读）
 * @property {string|null} coverImage  - 探险封面图 base64（V1，长边≤800）默认 null，空走默认 emoji 图标
 * @property {string} coverPosition  - 封面裁剪位置 object-position，如 "50% 30%"，默认 "50% 50%"（admin 滑块调，play 列表/开始页套用）
 *
 * --- 以下字段 MVP 预留，UI 不显示，V1 启用 ---
 * @property {string} openingStory     - 开场故事文本（V1）默认 ""
 * @property {string} endingStory      - 结尾故事文本（V1）默认 ""
 * @property {string|null} mapImage    - 地图底图 base64（V1）默认 null
 * @property {string} mapFontSize      - 地图字号 "small"|"medium"|"large"（V1）默认 "medium"
 * @property {string} mapNameColor     - 地图点位名称颜色（V1）默认 "#2C3E50"
 * @property {string} mapNameColorCompleted - 完成后高亮色（V1）默认 "#F5A623"
 *
 * --- 通关小组奖（V1-28，多人通关给整队颁一枚；游戏端读取一律容错走默认）---
 * @property {string}      groupAwardName  - 小组奖奖名（V1-28）默认 ""，空走内置默认「通关纪念奖」
 * @property {string|null} groupAwardImage - 小组奖奖图 base64（V1-28，长边≤800）默认 null，空走默认奖杯 🏆
 * @property {Array}       customAwards    - ⏭️ V2 投票颁奖预留，V1 不用，默认 []
 */

// ============================================================
// 6.2 Point（L2 点位）
// ============================================================

/**
 * @typedef {Object} Point
 * @property {string}   id             - 短 ID，格式 pt_xxx_yyy
 * @property {string}   levelId        - 所属 L1 的 ID
 * @property {number}   order          - 排列顺序（从 1 开始）
 *
 * @property {string}   name           - 点位名称（仅家长可见）
 * @property {string}   parentNote     - 家长备忘（如 "贴在东侧柱子"）
 * @property {string}   locationHint   - 给孩子看的寻找提示
 * @property {string}   discoveryText  - 本站扫码成功提示（孩子可见，可空字符串）
 *
 * @property {string[]} questionIds    - 绑定的题目 ID 列表（L3，按顺序）
 * @property {string}   code           - 6 位数字字符串，用于扫码和手动输入
 *
 * --- 以下字段 MVP 预留，UI 不显示，V1 启用 ---
 * @property {number|null} mapX              - 地图 X 坐标（百分比，V1）默认 null
 * @property {number|null} mapY              - 地图 Y 坐标（百分比，V1）默认 null
 * @property {string}      questionIntroText - 答题引导文案（V1）默认 ""
 * @property {string}      completionText    - L2 通关庆祝文案（V1）默认 ""
 * @property {string|null} hintImage         - 「找下一站」提示页图片 base64（V1，长边≤800）默认 null，空=不显示
 */

// ============================================================
// 6.3 Question（L3 题目）
// ============================================================

/**
 * @typedef {Object} Question
 * @property {string}      id             - 短 ID，格式 q_xxx_yyy
 * @property {string}      subject        - 学科，如 "math"、"chinese"
 * @property {number}      difficulty     - 难度 1–3 星
 * @property {string}      ageGroup       - 适合年龄段，如 "7-9"
 *
 * @property {string}      type           - 题型，MVP 只用 "single_choice"
 * @property {string}      text           - 题干文本
 * @property {string|null} textImagePath  - 题干截图路径（V1）默认 null
 * @property {string[]}    options        - 选项列表
 * @property {string}      correctAnswer  - 正确答案字母 "A"/"B"/"C"/"D"（A 对应 options[0]）
 *
 * @property {string}      hint           - 答错后提示，可为空字符串
 * @property {string}      explanation    - 答对后解析，可为空字符串
 * @property {string|null} imagePath      - 选项插图路径（V1）默认 null
 *
 * @property {number}      usedCount      - 被绑定到 L2 的次数（只增不减）
 */

// ============================================================
// 6.4 Player（玩家，V1-27 起启用；单人不产生 Player）
// ============================================================

/**
 * @typedef {Object} Player
 * @property {string}      id              - 短 ID，格式 p_xxx_yyy
 * @property {string}      name            - 玩家昵称（空时游戏端兜底「玩家N」）
 * @property {string|null} avatarPhotoId   - 头像照片 ID（引用 PhotoBlob），没拍头像则 null（显示颜色块+编号）
 * @property {string}      color           - 玩家颜色，如 "#FF6B6B"
 * @property {string}      playerNumber    - 编号字符串，如 "1"、"2"（V1-27 用纯数字，开局校验不重复）
 */

// ============================================================
// 6.5 GameSession（游戏会话）
// ============================================================

/**
 * @typedef {Object} QuestionResult
 * @property {string}  questionId      - 题目 ID
 * @property {number}  answerAttempts  - 作答次数（1=一次对，2=错一次再对，3=保底）
 * @property {boolean} usedHelp        - 是否用过求助
 * @property {number}  score           - 得分（10 / 5 / 3 / 0）
 */

/**
 * @typedef {Object} PointRecord
 * @property {string}          pointId           - 点位 ID
 * @property {number}          scannedAt         - 扫码时间戳（ms）
 * @property {QuestionResult[]} questionResults   - 该点位内每道题的结果
 * @property {boolean}         isSkipped         - 是否应急跳过（V2）默认 false
 * @property {string|null}     completionPhotoId - 通关合影 ID，无则 null
 */

/**
 * @typedef {Object} GameSession
 * @property {string} id                  - 短 ID，格式 sn_xxx_yyy
 * @property {string} levelId             - 对应的 L1 ID
 *
 * @property {number}      startedAt            - 开始时间戳（ms）
 * @property {number|null} endedAt              - 结束时间戳，未结束则 null
 * @property {number}      currentPointIndex    - 当前在第几个 L2（从 0 开始）
 * @property {number}      currentQuestionIndex - 当前 L2 内第几道题（从 0 开始）
 * @property {string}      status               - "in_progress" | "completed" | "abandoned"
 *
 * @property {number} helpUsedCount  - 已用求助次数
 * @property {number} maxHelpCount   - 最大求助次数（固定 3）
 *
 * @property {PointRecord[]} pointRecords  - 每个 L2 的答题记录
 *
 * --- 以下字段 V1-27 起多人启用；单人 / MVP 老存档【无此字段】，读取一律 (session.players || []) 容错 ---
 * @property {Player[]} players      - 玩家列表（V1-27），单人为 []；随 session 存 IndexedDB 自然持久（续玩不丢）
 * @property {string}   teamName     - 队名（V1-27），单人为 ""，空时通关页显示「我们队」
 * @property {Array}    voteRecords  - ⏭️ V2 投票预留，V1 不用，默认 []
 * @property {Array}    awards       - ⏭️ V2 颁奖结果预留，V1 不用（V1 小组奖直接读 Level.groupAward*，不写这里）默认 []
 */

// ============================================================
// 6.6 PhotoBlob（照片存储）
// ============================================================

/**
 * @typedef {Object} PhotoBlob
 * @property {string} id          - 短 ID，格式 ph_xxx_yyy
 * @property {Blob}   blob        - 图片 Blob 对象
 * @property {string} type        - "avatar" | "completion_photo"
 * @property {string} ownerId     - 所属对象的 ID（玩家 ID 或 PointRecord 的 pointId）
 * @property {number} createdAt   - 创建时间戳（ms）
 * @property {number} width       - 图片宽度（px）
 * @property {number} height      - 图片高度（px）
 * @property {number} sizeBytes   - 文件字节数
 * @property {string} format      - 图片格式，如 "jpeg"
 */

// ============================================================
// 6.7 JSON Envelope（导出文件外层结构）
// ============================================================

/**
 * @typedef {Object} JsonEnvelope
 * @property {string}   schemaVersion  - "1.0"（MVP 旧文件）或 "1.1"（V1-19 起新导出）；校验放宽为主版本号 === 1 即接受
 * @property {number}   exportedAt     - 导出时间戳（ms）
 * @property {string}   exportType     - 固定 "full"（MVP），V1 加 "single-level"
 * @property {Object}   data
 * @property {Level[]}    data.levels
 * @property {Point[]}    data.points
 * @property {Question[]} data.questions
 */

// 本文件只做类型声明，运行时不导出任何内容
export {};
