/**
 * admin/scripts/question-list.js
 * 题库主页：渲染列表、前端筛选、删除（引用保护）、复制、CSV 导出
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';
import { showQuestionForm, initQuestionForm } from './question-form.js';
import { showCsvImportPanel } from './csv-import.js';
import { matchesQuestionFilter } from './question-filter.js';
import { findQuestionReferences } from '../../shared/utils/reference-check.js';

// ── 学科显示名映射 ────────────────────────────────────────
const SUBJECT_LABELS = {
  math: '数学', chinese: '语文', english: '英语',
  science: '自然/科学', common: '常识', fun: '趣味',
};

// ── 筛选状态（模块级变量）────────────────────────────────
let filterSubject    = '';
let filterDifficulty = '';  // '' | '1' | '2' | '3'
let filterAge        = '';
let filterUsed       = '';  // '' | '0' | '1' | '2'
let filterSearch     = '';
let allQuestions     = [];  // 从 DB 一次性加载的全量数据
let refCountMap      = new Map();  // questionId → 被多少个点位引用（实时计算）

// 待删除的题目 ID（弹窗确认后使用）
let pendingDeleteId  = null;

// ── 初始化入口 ───────────────────────────────────────────
export function initQuestionsPage() {
  initQuestionForm();
  bindActionButtons();
  bindFilterEvents();
  bindDeleteModal();
  renderQuestionList();

  // question-form 保存后触发列表刷新
  document.addEventListener('question-saved', () => renderQuestionList());
}

// ── 顶部操作按钮 ─────────────────────────────────────────
function bindActionButtons() {
  document.getElementById('btn-create-question')
    .addEventListener('click', () => showQuestionForm(null));

  document.getElementById('btn-csv-import')
    .addEventListener('click', showCsvImportPanel);

  document.getElementById('btn-csv-export')
    .addEventListener('click', exportCsv);
}

// ── 筛选事件绑定 ─────────────────────────────────────────
function bindFilterEvents() {
  document.getElementById('filter-subject')
    .addEventListener('change', e => { filterSubject = e.target.value; applyFilter(); });

  document.getElementById('filter-age')
    .addEventListener('change', e => { filterAge = e.target.value; applyFilter(); });

  document.getElementById('filter-search')
    .addEventListener('input', e => { filterSearch = e.target.value.trim(); applyFilter(); });

  // 难度切换按钮（再次点击同一个则取消）
  document.getElementById('filter-difficulty-group')
    .addEventListener('click', e => {
      const btn = e.target.closest('[data-difficulty]');
      if (!btn) return;
      const val = btn.dataset.difficulty;
      filterDifficulty = (filterDifficulty === val) ? '' : val;
      document.querySelectorAll('[data-difficulty]').forEach(b =>
        b.classList.toggle('active', b.dataset.difficulty === filterDifficulty));
      applyFilter();
    });

  // 使用次数切换按钮
  document.getElementById('filter-used-group')
    .addEventListener('click', e => {
      const btn = e.target.closest('[data-used]');
      if (!btn) return;
      const val = btn.dataset.used;
      filterUsed = (filterUsed === val) ? '' : val;
      document.querySelectorAll('[data-used]').forEach(b =>
        b.classList.toggle('active', b.dataset.used === filterUsed));
      applyFilter();
    });
}

// ── 删除弹窗 ─────────────────────────────────────────────
function bindDeleteModal() {
  const closeModal = () => {
    document.getElementById('question-delete-modal').classList.add('hidden');
    pendingDeleteId = null;
  };

  document.getElementById('btn-q-delete-close')
    .addEventListener('click', closeModal);
  document.getElementById('btn-q-delete-cancel')
    .addEventListener('click', closeModal);
  document.getElementById('question-delete-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  document.getElementById('btn-q-delete-confirm')
    .addEventListener('click', async () => {
      if (!pendingDeleteId) return;
      await db.questions.delete(pendingDeleteId);
      closeModal();
      renderQuestionList();
    });
}

// ── 从 DB 加载题目 + 实时计算每题的引用数 ──────────────
export async function renderQuestionList() {
  const [questions, allPoints] = await Promise.all([
    db.questions.toArray(),
    db.points.toArray(),
  ]);

  // 一次遍历所有点位，建立 questionId → 引用数 映射
  refCountMap = new Map();
  for (const pt of allPoints) {
    for (const qId of (pt.questionIds || [])) {
      refCountMap.set(qId, (refCountMap.get(qId) || 0) + 1);
    }
  }

  // 按实时引用数升序（未被用过的排最前）
  questions.sort((a, b) => (refCountMap.get(a.id) || 0) - (refCountMap.get(b.id) || 0));

  allQuestions = questions;
  applyFilter();
}

// ── 前端过滤 + 渲染 ──────────────────────────────────────
function applyFilter() {
  const filtered = allQuestions.filter(q => {
    if (!matchesQuestionFilter(q, {
      subject:    filterSubject,
      difficulty: filterDifficulty,
      search:     filterSearch,
    })) return false;
    if (filterAge && q.ageGroup !== filterAge) return false;
    if (filterUsed) {
      const rc = refCountMap.get(q.id) || 0;
      if (filterUsed === '0' && rc !== 0) return false;
      if (filterUsed === '1' && rc !== 1) return false;
      if (filterUsed === '2' && rc < 2)   return false;
    }
    return true;
  });

  // 更新计数
  const countEl = document.getElementById('questions-count');
  if (countEl) {
    const isFiltering = filterSubject || filterDifficulty || filterAge || filterUsed || filterSearch;
    countEl.textContent = isFiltering
      ? `筛选结果：${filtered.length} 道（共 ${allQuestions.length} 道）`
      : `共 ${allQuestions.length} 道题目`;
  }

  const container = document.getElementById('questions-container');
  if (!container) return;

  if (filtered.length === 0) {
    const isEmpty = allQuestions.length === 0;
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${isEmpty ? '📝' : '🔍'}</div>
        <p>${isEmpty
          ? '题库还没有题目，点击「新建题目」添加第一道！'
          : '没有符合筛选条件的题目，调整筛选条件试试'}</p>
      </div>`;
    return;
  }

  const list = document.createElement('div');
  list.className = 'question-list';
  filtered.forEach(q => list.appendChild(buildQuestionRow(q)));

  container.innerHTML = '';
  container.appendChild(list);
}

// ── 构建单条题目行 ───────────────────────────────────────
function buildQuestionRow(q) {
  const row = document.createElement('div');
  row.className = 'q-row';
  row.dataset.questionId = q.id;

  const subjectLabel = SUBJECT_LABELS[q.subject] || q.subject || '未分类';
  const stars        = q.difficulty ? '★'.repeat(q.difficulty) : '—';
  const ageLabel     = q.ageGroup ? q.ageGroup + '岁' : '';
  const typeBadge    = q.type === 'true_false' ? '判断' : '选择';
  const textPreview  = escapeHtml((q.text || '').slice(0, 30))
                       + ((q.text || '').length > 30 ? '…' : '');

  row.innerHTML = `
    <div class="q-row-main">
      <div class="q-row-text">${textPreview}</div>
      <div class="q-row-tags">
        <span class="tag q-tag-type">${typeBadge}</span>
        <span class="tag">${subjectLabel}</span>
        <span class="tag q-tag-stars">${stars}</span>
        ${ageLabel ? `<span class="tag">${ageLabel}</span>` : ''}
        ${usedBadge(refCountMap.get(q.id) || 0)}
      </div>
    </div>
    <div class="q-row-actions">
      <button class="btn btn-secondary btn-sm" data-action="edit">✏️ 编辑</button>
      <button class="btn btn-danger    btn-sm" data-action="delete">🗑️ 删除</button>
      <button class="btn btn-secondary btn-sm" data-action="copy">📋 复制</button>
    </div>`;

  row.addEventListener('click', async e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'edit')   showQuestionForm(q.id);
    if (btn.dataset.action === 'delete') await handleDeleteQuestion(q);
    if (btn.dataset.action === 'copy')   await handleCopyQuestion(q);
  });

  return row;
}

// ── usedCount 颜色标记 ───────────────────────────────────
function usedBadge(count) {
  if (count === 0) return '<span class="q-used-badge q-used-0">🔵 0次</span>';
  if (count === 1) return '<span class="q-used-badge q-used-1">🟡 1次</span>';
  return `<span class="q-used-badge q-used-2">🟠 ${count}次</span>`;
}

// ── 删除（引用保护）───────────────────────────────────────
async function handleDeleteQuestion(q) {
  const refs = await findQuestionReferences(db, q.id);

  const modal      = document.getElementById('question-delete-modal');
  const titleEl    = document.getElementById('q-delete-modal-title');
  const msgEl      = document.getElementById('q-delete-message');
  const confirmBtn = document.getElementById('btn-q-delete-confirm');
  const cancelBtn  = document.getElementById('btn-q-delete-cancel');
  const shortText  = escapeHtml((q.text || '').slice(0, 20)) +
                     ((q.text || '').length > 20 ? '…' : '');

  if (refs.length > 0) {
    // 有引用 → 拒绝，仅显示「我知道了」
    const bullets = refs
      .map(r =>
        `<li>${escapeHtml(r.levelName)} · 第 ${r.pointOrder} 站「${escapeHtml(r.pointName)}」</li>`
      )
      .join('');

    titleEl.textContent  = '❌ 无法删除';
    msgEl.innerHTML      =
      `这道题正在被以下 <strong>${refs.length} 个点位</strong> 使用：
       <ul style="margin:10px 0 12px 18px;line-height:2.2">${bullets}</ul>
       请先去这些点位中移除引用，再回来删除。`;
    confirmBtn.style.display = 'none';
    cancelBtn.textContent    = '我知道了';
    pendingDeleteId = null;
  } else {
    // 无引用 → 二次确认
    titleEl.textContent      = '🗑️ 确认删除';
    msgEl.innerHTML          =
      `确定删除题目「<strong>${shortText}</strong>」吗？<br><br>此操作无法撤销。`;
    confirmBtn.style.display = '';
    cancelBtn.textContent    = '取消';
    pendingDeleteId = q.id;
  }

  modal.classList.remove('hidden');
}

// ── 复制题目 ─────────────────────────────────────────────
async function handleCopyQuestion(q) {
  await db.questions.add({
    ...q,
    id: generateId('q'),
  });
  renderQuestionList();
}

// ── CSV 导出（PapaParse + UTF-8 BOM）────────────────────
async function exportCsv() {
  if (!window.Papa) {
    alert('CSV 库尚未加载，请刷新页面后重试。');
    return;
  }

  const questions = await db.questions.toArray();
  if (questions.length === 0) {
    alert('题库里还没有题目，无法导出。');
    return;
  }

  const rows = questions.map(q => ({
    学科:    q.subject    || '',
    难度:    q.difficulty || '',
    年龄段:  q.ageGroup   || '',
    题型:    q.type === 'true_false' ? '判断' : '选择',
    题干:    q.text       || '',
    选项A:   (q.options || [])[0] || '',
    选项B:   (q.options || [])[1] || '',
    选项C:   (q.options || [])[2] || '',
    选项D:   (q.options || [])[3] || '',
    正确答案: q.correctAnswer || '',
    提示:    q.hint        || '',
    解析:    q.explanation  || '',
    使用次数: refCountMap.get(q.id) || 0,
  }));

  // UTF-8 BOM：避免 Windows Excel 打开中文乱码
  const csv  = '﻿' + window.Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `题库-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── 工具 ────────────────────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
