/**
 * shared/utils/json-io.js
 * JSON 导入导出工具（对应 PRD v1.9 §6.7）
 *
 * 支持两种 exportType：
 *   "full"         — 整库导出/覆盖导入（MVP 起）
 *   "single-level" — 单 L1 子树导出/追加导入（V1-23 新增）
 */

const SCHEMA_VERSION = '1.1';

// ============================================================
// exportFull(db) — 整库导出为 JSON 字符串
// ============================================================

/**
 * 从 Dexie db 读取所有数据，序列化为 PRD §6.7 Envelope 格式的 JSON 字符串。
 * @param {import('dexie').Dexie} db
 * @returns {Promise<string>} JSON 字符串
 */
export async function exportFull(db) {
  const [levels, points, questions] = await Promise.all([
    db.levels.toArray(),
    db.points.toArray(),
    db.questions.toArray(),
  ]);

  const envelope = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    exportType: 'full',
    data: { levels, points, questions },
  };

  return JSON.stringify(envelope, null, 2);
}

// ============================================================
// exportSingleLevel(db, levelId) — 单 L1 子树导出（V1-23 新增）
// ============================================================

/**
 * 导出指定 L1 及其关联点位、题目为 JSON 字符串。
 * @param {import('dexie').Dexie} db
 * @param {string} levelId
 * @returns {Promise<string>} JSON 字符串（exportType = 'single-level'）
 */
export async function exportSingleLevel(db, levelId) {
  const level = await db.levels.get(levelId);
  if (!level) throw new Error('探险不存在：' + levelId);

  const points = await db.points.where('levelId').equals(levelId).toArray();

  // 收集所有点位引用的题目 ID（去重）
  const questionIdSet = new Set();
  for (const pt of points) {
    if (Array.isArray(pt.questionIds)) {
      pt.questionIds.forEach(id => questionIdSet.add(id));
    }
  }

  const questions = questionIdSet.size > 0
    ? await db.questions.where('id').anyOf([...questionIdSet]).toArray()
    : [];

  const envelope = {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    exportType: 'single-level',
    data: { levels: [level], points, questions },
  };

  return JSON.stringify(envelope, null, 2);
}

// ============================================================
// validateJson(jsonString) — 验证 JSON 字符串是否合法
// ============================================================

/**
 * 解析并验证 JSON 字符串是否符合 PRD §6.7 格式要求。
 * 接受 exportType = 'full' 或 'single-level'。
 * @param {string} jsonString
 * @returns {{ ok: true, data: object, exportType: string } | { ok: false, error: string }}
 */
export function validateJson(jsonString) {
  // 1. 解析 JSON
  let envelope;
  try {
    envelope = JSON.parse(jsonString);
  } catch {
    return { ok: false, error: '这不是有效的 JSON 文件，无法解析' };
  }

  // 2. 检查 schemaVersion 字段存在
  if (!('schemaVersion' in envelope)) {
    return { ok: false, error: '这不是有效的寻宝游戏数据文件（缺少 schemaVersion）' };
  }

  // 3. 主版本号为 1 即放行（1.0 和 1.1 都接受；主版本 ≠ 1 拒绝）
  const majorVer = String(envelope.schemaVersion).split('.')[0];
  if (majorVer !== '1') {
    return {
      ok: false,
      error: `该文件由不兼容的 App 版本创建（版本 ${envelope.schemaVersion}），请升级 App`,
    };
  }

  // 4. 检查 exportType（接受 full 和 single-level）
  if (envelope.exportType !== 'full' && envelope.exportType !== 'single-level') {
    return { ok: false, error: `不支持的导出类型 "${envelope.exportType}"` };
  }

  // 5. 检查 data 及三张表字段存在
  const { data } = envelope;
  if (!data || !Array.isArray(data.levels) || !Array.isArray(data.points) || !Array.isArray(data.questions)) {
    return { ok: false, error: '文件格式不完整（data.levels / points / questions 缺失或不是数组）' };
  }

  // 返回值新增 exportType + exportedAt，老调用方只读 .ok/.data 不受影响。
  // exportedAt 是 admin 导出/发布时的时间戳，云同步时显示给用户核对「拉到的是不是刚发布那次」。
  return { ok: true, data, exportType: envelope.exportType, exportedAt: envelope.exportedAt };
}

// ============================================================
// importFull(db, validatedData) — 整库覆盖导入
// ============================================================

/**
 * 清空 db 的 levels / points / questions 表，批量写入 validatedData。
 * 调用前必须先用 validateJson() 验证，直接传 result.data。
 * @param {import('dexie').Dexie} db
 * @param {{ levels: object[], points: object[], questions: object[] }} validatedData
 * @returns {Promise<{ levels: number, points: number, questions: number }>} 各表插入条数
 */
export async function importFull(db, validatedData) {
  const { levels, points, questions } = validatedData;

  // 在事务里完成「清空 + 批量插入」，保证原子性——要么全成功，要么全回滚
  await db.transaction('rw', db.levels, db.points, db.questions, async () => {
    await db.levels.clear();
    await db.points.clear();
    await db.questions.clear();

    if (levels.length > 0)    await db.levels.bulkPut(levels);
    if (points.length > 0)    await db.points.bulkPut(points);
    if (questions.length > 0) await db.questions.bulkPut(questions);
  });

  return {
    levels:    levels.length,
    points:    points.length,
    questions: questions.length,
  };
}

// ============================================================
// importSingleLevel(db, data) — 单 L1 追加导入（V1-23 新增）
// ============================================================

/**
 * 把一个 L1 子树（level + 点位 + 引用题目）upsert 写入 db，不清空其他数据。
 * 旧的同 levelId 点位先全部删除（保证删掉的点位不残留），题目只 upsert。
 * @param {import('dexie').Dexie} db
 * @param {{ levels: object[], points: object[], questions: object[] }} data
 * @returns {Promise<{ levels: number, points: number, questions: number }>}
 */
export async function importSingleLevel(db, data) {
  const level = data.levels[0];
  const { points, questions } = data;

  await db.transaction('rw', db.levels, db.points, db.questions, async () => {
    // 先删除该 L1 下原有点位（替换整棵子树，避免已删点位残留）
    await db.points.where('levelId').equals(level.id).delete();

    // upsert 探险本体（有则覆盖、无则新增）
    await db.levels.put(level);

    // 写入新点位
    if (points.length > 0) await db.points.bulkPut(points);

    // 题目 upsert（共享题目不能删，只覆盖导入版本）
    if (questions.length > 0) await db.questions.bulkPut(questions);
  });

  return { levels: 1, points: points.length, questions: questions.length };
}
