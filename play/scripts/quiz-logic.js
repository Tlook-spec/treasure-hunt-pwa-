/**
 * play/scripts/quiz-logic.js
 * 答题页业务逻辑：加载题目数据 + 答题处理
 * M22 placeholder：答对得 10 分；答错返回错误状态，不记录（M23 补全 3 次容错 + 求助）
 */
import db from '../../shared/db/play-db.js';

/**
 * 加载当前站/题目的所有渲染数据，供答题页使用。
 *
 * @param {string} sessionId
 * @returns {Promise<{
 *   session: object,
 *   point: object,
 *   question: object,
 *   questionId: string,
 *   stationNumber: number,
 *   totalStations: number,
 *   questionNumber: number,
 *   totalQuestions: number,
 * }>}
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
 *
 * @param {string} sessionId
 */
export async function startChallenge(sessionId) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');

  const { levelId, currentPointIndex } = session;
  const records = session.pointRecords || [];

  // 续玩：记录已存在，直接返回
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

/**
 * M22 placeholder 答题处理：
 * - 答对：追加结果（answerAttempts=1, score=10）到 session，推进 currentQuestionIndex
 * - 答错：仅返回错误状态，不写 DB（M23 补全 3 次容错 + 求助逻辑）
 *
 * @param {string} sessionId
 * @param {number} selectedIndex  用户选的选项索引（0-3）
 * @returns {Promise<{ result: 'correct'|'wrong', hasMoreQuestions: boolean }>}
 */
export async function submitAnswer(sessionId, selectedIndex) {
  const session = await db.sessions.get(sessionId);
  if (!session) throw new Error('游戏会话不存在');

  const { levelId, currentPointIndex, currentQuestionIndex } = session;

  const allPoints = await db.points.where('levelId').equals(levelId).sortBy('order');
  const currentPoint = allPoints[currentPointIndex];
  const questionId = currentPoint.questionIds[currentQuestionIndex];
  const question = await db.questions.get(questionId);

  const isCorrect = (selectedIndex === question.correctAnswer);

  if (!isCorrect) {
    // M22 placeholder：答错只告知前端，不写入任何记录
    return { result: 'wrong', hasMoreQuestions: false };
  }

  // 答对：把题目结果追加到 pointRecords[currentPointIndex].questionResults
  const records = session.pointRecords ? [...session.pointRecords] : [];
  const pointRecord = { ...records[currentPointIndex] };
  pointRecord.questionResults = [
    ...(pointRecord.questionResults || []),
    {
      questionId,
      answerAttempts: 1,  // M22 placeholder：一次答对
      usedHelp: false,    // M22 placeholder：没用求助
      score: 10,          // M22 placeholder：满分
    },
  ];
  records[currentPointIndex] = pointRecord;

  const totalQuestions = currentPoint.questionIds.length;
  const hasMoreQuestions = currentQuestionIndex + 1 < totalQuestions;

  if (hasMoreQuestions) {
    // 推进到下一题
    await db.sessions.update(sessionId, {
      pointRecords: records,
      currentQuestionIndex: currentQuestionIndex + 1,
    });
  } else {
    // 本站所有题答完：保存结果，保持 currentQuestionIndex
    // M24 拍照页负责推进 currentPointIndex 并重置 currentQuestionIndex
    await db.sessions.update(sessionId, {
      pointRecords: records,
    });
  }

  return { result: 'correct', hasMoreQuestions };
}
