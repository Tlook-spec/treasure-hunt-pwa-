/**
 * admin/scripts/question-filter.js
 * 题目筛选共用函数，供题库管理页和选题面板复用
 */

/**
 * 判断一道题是否满足学科、难度、题干关键字条件
 * @param {object} q - 题目对象
 * @param {{ subject?: string, difficulty?: string, search?: string }} opts
 * @returns {boolean}
 */
export function matchesQuestionFilter(q, { subject = '', difficulty = '', search = '' } = {}) {
  if (subject    && q.subject !== subject)                        return false;
  if (difficulty && String(q.difficulty) !== String(difficulty))  return false;
  if (search     && !(q.text || '').includes(search))             return false;
  return true;
}
