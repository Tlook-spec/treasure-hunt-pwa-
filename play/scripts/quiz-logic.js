/**
 * play/scripts/quiz-logic.js
 * 答题页业务逻辑：加载题目数据 + 答题判定 + session 写入
 * M23 正式版（替换 M22 placeholder submitAnswer）
 */
import db from '../../shared/db/play-db.js';

// ── 加载数据 ───────────────────────────────────────────────────────────────

/**
 * 加载当前站/题目的所有渲染数据，供答题页使用。
 */
export async function loadCurrentQuizData(sessionId) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在，请重新开始游戏');

  const { levelId, currentPointIndex, currentQuestionIndex } = session;
  const allPoints = await db.points.where('levelId').equals(levelId).sortBy('order');
  const totalStations = allPoints.length;
  const currentPoint = allPoints[currentPointIndex];
  if (!currentPoint) throw new Error('点位数据异常，请重新导入探险数据');

  const questionIds = currentPoint.questionIds || [];
  const totalQuestions = questionIds.length;
  if (totalQuestions === 0) throw new Error('这个点位没有题目，请检查探险数据');

  const questionId = questionIds[currentQuestionIndex];
  if (!questionId) throw new Error('题目索引超出范围，数据可能有误');

  const question = await db.questions.get(questionId);
  if (!question) throw new Error('题目数据不存在，请重新导入探险数据');

  return {
    session,
    point: currentPoint,
    question,
    questionId,
    stationNumber: currentPointIndex + 1,
    totalStations,
    questionNumber: currentQuestionIndex + 1,
    totalQuestions,
  };
}

/**
 * 进入答题前调用：在 session.pointRecords 中创建本站记录。
 * 已有记录（续玩场景）则直接跳过，不覆盖。
 */
export async function startChallenge(sessionId) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');

  const { levelId, currentPointIndex } = session;
  const records = session.pointRecords || [];
  if (records[currentPointIndex]) return;

  const allPoints = await db.points.where('levelId').equals(levelId).sortBy('order');
  const currentPoint = allPoints[currentPointIndex];

  const newRecords = [...records];
  newRecords[currentPointIndex] = {
    pointId: currentPoint.id,
    scannedAt: Date.now(),
    questionResults: [],
    completionPhotoId: null,
  };
  await db.sessions.update(sessionId, { pointRecords: newRecords });
}

// ── 答题判定（纯函数，不写 DB）────────────────────────────────────────────

/**
 * 判断用户选的索引是否正确。
 * correctAnswer 存的是字母 'A'/'B'/'C'/'D'（见 admin/question-form.js）。
 */
export function checkAnswer(question, selectedIndex) {
  const correctIndex = 'ABCD'.indexOf(String(question.correctAnswer).trim().toUpperCase());
  return selectedIndex === correctIndex;
}

/**
 * 根据答题历史计算得分（CLAUDE.md §7 规则 7）。
 * 求助优先级最高：只要曾用求助，无论错几次都得 3 分。
 *
 * @param {number}  attemptCount  答错次数（不含本次答对）
 * @param {boolean} usedHelp      本题是否用过求助
 */
export function computeScore(attemptCount, usedHelp) {
  if (usedHelp) return 3;         // 曾用求助 → 3 分
  if (attemptCount === 0) return 10; // 一次答对 → 10 分
  return 5;                       // 错 1-2 次后答对 → 5 分
}

// ── session 写入 ──────────────────────────────────────────────────────────

/**
 * 往 session.pointRecords[currentPointIndex].questionResults 追加一条答题记录。
 * 每道题只在「答对」或「第 3 次错保底」时调用一次。
 */
export async function recordQuestionResult(sessionId, questionId, answerAttempts, usedHelp, score, wrongChoices = []) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');

  const records = [...(session.pointRecords || [])];
  const pr = { ...(records[session.currentPointIndex] || {}) };
  pr.questionResults = [
    ...(pr.questionResults || []),
    { questionId, answerAttempts, usedHelp, score, wrongChoices },
  ];
  records[session.currentPointIndex] = pr;
  await db.sessions.update(sessionId, { pointRecords: records });
}

/**
 * 推进到下一道题（currentQuestionIndex + 1）。
 */
export async function advanceQuestionIndex(sessionId) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');
  await db.sessions.update(sessionId, {
    currentQuestionIndex: session.currentQuestionIndex + 1,
  });
}

/**
 * 计算各站得分汇总（纯函数，不写 DB）。
 * 供通关页（V1-02）和海报（V1-18）复用。
 *
 * @param {object[]} pointRecords  session.pointRecords
 * @param {object}   questionsMap  { [questionId]: Question }
 * @param {object}   pointsMap     { [pointId]: Point }
 * @returns {object[]} 每站 { stationNumber, pointName, totalScore, totalQuestions, firstTryCorrect, wrongItems }
 */
export function computeStationSummaries(pointRecords, questionsMap, pointsMap) {
  return pointRecords.map((pr, i) => {
    const results = pr.questionResults || [];
    const point = pointsMap[pr.pointId];
    const totalScore = results.reduce((s, qr) => s + (qr.score || 0), 0);
    // 答对 = 最终得了分（score>0）；错题 = 没答出来、保底 0 分（与顶部总成绩卡口径一致）
    const correctCount = results.filter(qr => (qr.score || 0) > 0).length;
    const wrongItems = results
      .filter(qr => (qr.score || 0) === 0)
      .map(qr => ({ qr, question: questionsMap[qr.questionId] }));
    return {
      stationNumber: i + 1,
      pointName: point ? point.name : `第 ${i + 1} 站`,
      totalScore,
      totalQuestions: results.length,
      correctCount,
      wrongItems,
    };
  });
}

/**
 * 扣除一次求助次数，返回剩余次数。
 */
export async function consumeHelp(sessionId) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');
  const newUsed = session.helpUsedCount + 1;
  await db.sessions.update(sessionId, { helpUsedCount: newUsed });
  return session.maxHelpCount - newUsed; // 剩余次数
}
