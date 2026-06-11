/**
 * shared/utils/reference-check.js
 * 删除前引用保护工具：查找某道题目被哪些点位引用
 */

/**
 * 扫描所有点位，找出引用了指定题目的点位列表
 * @param {import('dexie').Dexie} db
 * @param {string} questionId
 * @returns {Promise<Array<{ levelId: string, levelName: string, pointName: string, pointOrder: number }>>}
 */
export async function findQuestionReferences(db, questionId) {
  const [allPoints, allLevels] = await Promise.all([
    db.points.toArray(),
    db.levels.toArray(),
  ]);

  // 建立 levelId → levelName 映射，避免对每个点位单独查数据库
  const levelMap = Object.fromEntries(allLevels.map(l => [l.id, l.name]));

  return allPoints
    .filter(pt => (pt.questionIds || []).includes(questionId))
    .map(pt => ({
      levelId:    pt.levelId,
      levelName:  levelMap[pt.levelId] || '未知探险',
      pointName:  pt.name,
      pointOrder: pt.order,
    }));
}
