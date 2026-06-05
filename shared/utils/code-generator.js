/**
 * shared/utils/code-generator.js
 * L2 点位 6 位数字码工具（对应 PRD v1.7 §7.1）
 *
 * 数字码特性：
 * - 6 位数字字符串，可能有前导 0（如 "048293"）
 * - 扫码和手动输入都用同一个码
 * - 生成时需检查全表唯一性（PRD §7.1：二维码数字码冲突则重新生成）
 */

/**
 * 生成一个 6 位随机数字字符串
 * 可能有前导 0，如 "048293"、"001234"
 * @returns {string} 6 位数字字符串
 */
export function generateSixDigitCode() {
  // 生成 0–999999 的随机数，再补齐到 6 位
  const num = Math.floor(Math.random() * 1000000);
  return String(num).padStart(6, '0');
}

/**
 * 检查数字码是否在现有码列表中唯一
 * @param {string} code          - 待检查的 6 位数字码
 * @param {string[]} existingCodes - 已存在的码列表
 * @returns {boolean} true = 唯一（可以用），false = 已存在（需重新生成）
 */
export function isCodeUnique(code, existingCodes) {
  return !existingCodes.includes(code);
}
