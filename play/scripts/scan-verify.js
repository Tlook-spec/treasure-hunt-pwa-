/**
 * play/scripts/scan-verify.js
 * 扫码结果验证：查码 → 判断是否当前应扫的站
 */
import db from '../../shared/db/play-db.js';

/**
 * 验证扫到的码是否是当前该找的点位
 *
 * @param {string} code       扫到的字符串（已 trim）
 * @param {string} sessionId  当前游戏会话 ID
 * @returns {Promise<{
 *   result: 'correct' | 'wrong_station' | 'invalid' | 'error',
 *   stationNum?: number,   // result=wrong_station 时：现在应该找的是第几站（1-based）
 *   message?:   string     // result=error 时的说明
 * }>}
 */
export async function verifyCode(code, sessionId) {
  // ── 第一步：按码查点位 ──
  const scannedPoint = await db.points.where('code').equals(code).first();
  if (!scannedPoint) {
    // 码在 points 表里查不到，不是本游戏的码（或扫到了无关二维码）
    return { result: 'invalid' };
  }

  // ── 第二步：读取当前会话 ──
  const session = await db.sessions.get(sessionId);
  if (!session) {
    return { result: 'error', message: '游戏会话不存在，请重新开始游戏' };
  }

  const { levelId, currentPointIndex } = session;

  // 扫到的码属于其他探险，同样视为无效
  if (scannedPoint.levelId !== levelId) {
    return { result: 'invalid' };
  }

  // ── 第三步：取本探险所有点位（按 order 升序），找到当前应扫的那个 ──
  // 注意：不直接用 order === currentPointIndex，因为 order 可能从 1 开始
  const allPoints = await db.points
    .where('levelId').equals(levelId)
    .sortBy('order');

  const currentPoint = allPoints[currentPointIndex];
  if (!currentPoint) {
    return { result: 'error', message: '点位数据异常，请重新导入探险数据' };
  }

  // ── 第四步：比对 ID ──
  if (scannedPoint.id === currentPoint.id) {
    return { result: 'correct' };
  }

  // 扫到的是本探险其他站的码（顺序不对）
  return {
    result: 'wrong_station',
    stationNum: currentPointIndex + 1, // 现在应该找的是第几站（1-based）
  };
}
