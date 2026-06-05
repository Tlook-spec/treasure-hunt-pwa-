/**
 * shared/utils/json-io.js
 * JSON 整库导入导出工具（对应 PRD v1.7 §6.7）
 *
 * MVP 只支持 exportType = "full"（整库覆盖）。
 * 单 L1 导入/导出推到 V1。
 */

const SCHEMA_VERSION = '1.0';

// ============================================================
// exportFull(db) — 整库导出为 JSON 字符串
// ============================================================

/**
 * 从 Dexie db 读取所有数据，序列化为 PRD §6.7 Envelope 格式的 JSON 字符串。
 * @param {import('dexie').Dexie} db - admin-db 或同结构的 Dexie 实例
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
// validateJson(jsonString) — 验证 JSON 字符串是否合法
// ============================================================

/**
 * 解析并验证 JSON 字符串是否符合 PRD §6.7 格式要求。
 * @param {string} jsonString
 * @returns {{ ok: true, data: object } | { ok: false, error: string }}
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

  // 3. 检查 schemaVersion === "1.0"（MVP 只认 1.0）
  if (envelope.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `该文件由不兼容的 App 版本创建（版本 ${envelope.schemaVersion}），请升级 App`,
    };
  }

  // 4. 检查 exportType === "full"（MVP 只支持整库）
  if (envelope.exportType !== 'full') {
    return { ok: false, error: `不支持的导出类型 "${envelope.exportType}"，MVP 只支持整库导入` };
  }

  // 5. 检查 data 及三张表字段存在
  const { data } = envelope;
  if (!data || !Array.isArray(data.levels) || !Array.isArray(data.points) || !Array.isArray(data.questions)) {
    return { ok: false, error: '文件格式不完整（data.levels / points / questions 缺失或不是数组）' };
  }

  return { ok: true, data };
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
