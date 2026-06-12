/**
 * play/scripts/scan-verify.js
 * 码验证（纯判断，不碰界面）+ 成功跳转（扫码/手动输码共用）
 */
import db from '../../shared/db/play-db.js';

/**
 * 解析输入的码是否为当前应扫的站
 * 不做任何 UI 操作，只返回判断结果。
 *
 * @param {string} code       待验证的码（已 trim）
 * @param {string} sessionId  当前游戏会话 ID
 * @returns {Promise<{
 *   status: 'correct' | 'wrong-point' | 'not-found',
 *   currentStationNumber: number  // 三种状态都返回；现在应找的是第几站（1-based）
 * }>}
 * @throws {Error} session 不存在或点位数据异常时
 */
export async function resolveCode(code, sessionId) {
  // 先读会话，取得 levelId + currentPointIndex
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在，请重新开始游戏');

  const { levelId, currentPointIndex } = session;
  const currentStationNumber = currentPointIndex + 1; // 1-based

  // 按码查点位
  const scannedPoint = await db.points.where('code').equals(code).first();
  if (!scannedPoint || scannedPoint.levelId !== levelId) {
    // 码查不到，或属于其他探险
    return { status: 'not-found', currentStationNumber };
  }

  // 取本探险所有点位（order 升序），找到当前应扫的那个
  // ⚠️ 不用 order === currentPointIndex：order 可能从 1 开始，直接比会差一位
  const allPoints = await db.points
    .where('levelId').equals(levelId)
    .sortBy('order');

  const currentPoint = allPoints[currentPointIndex];
  if (!currentPoint) throw new Error('点位数据异常，请重新导入探险数据');

  if (scannedPoint.id === currentPoint.id) {
    return { status: 'correct', currentStationNumber };
  }

  // 本探险其他站的码（顺序不对）
  return { status: 'wrong-point', currentStationNumber };
}

/**
 * 跳转到本站「开始挑战」页（M22 实现）
 * 扫码成功和手动输码成功都调这个，避免两处硬编码 URL。
 */
export function goToChallenge(sessionId) {
  location.href = `challenge.html?sessionId=${encodeURIComponent(sessionId)}`;
}
