/**
 * shared/utils/id.js
 * 短 ID 生成工具（对应 PRD v1.7 §6.0）
 *
 * 格式：{prefix}_{时间戳 base36}_{4位随机}
 * 例如：lvl_lq2nx8j2_a3kf
 *
 * 时间戳每毫秒变一次，4 位随机进一步降低碰撞概率，
 * MVP 单用户场景下无需做 IndexedDB 查重循环。
 */

/**
 * 生成短 ID
 * @param {string} prefix - ID 前缀，如 "lvl"、"pt"、"q"、"sn"、"ph"、"p"
 * @returns {string} 格式为 prefix_时间戳base36_随机4位 的短 ID
 */
export function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4);
  return `${prefix}_${timestamp}_${random}`;
}
