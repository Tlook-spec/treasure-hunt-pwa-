/**
 * admin/scripts/point-form.js
 * L2 点位新建/编辑表单 + 题目绑定区 + 题库选择面板
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';
import { generateSixDigitCode, isCodeUnique } from '../../shared/utils/code-generator.js';
import { matchesQuestionFilter } from './question-filter.js';

// ── 常量 ─────────────────────────────────────────────────

const SUBJECT_LABELS = {
  math:    '数学',
  chinese: '语文',
  english: '英语',
  science: '自然/科学',
  common:  '常识',
};

// ── 模块状态（表单会话期间保持）──────────────────────────

let currentLevelId     = null;
let currentPointId     = null;  // null = 新建
let currentQuestionIds = [];    // 表单内当前题目 ID 列表（实时变化）
let pickerAllQuestions = [];    // 选题面板加载的全部题目
let pickerSearch       = '';    // 选题面板当前关键字搜索词
let pickerSelectedIds  = new Set(); // 已选题目 ID，独立于筛选条件，换筛选不清空

// ── 入口 ────────────────────────────────────────────────

/**
 * 初始化点位表单模块（绑定所有静态按钮事件）
 * 由 point-list.js 的 initPointList() 通过 level-detail.js 间接调用，
 * 或直接在 initLevelsPage() 流程中调用
 */
export function initPointForm() {
  document.getElementById('btn-point-back').addEventListener('click', goBackToDetail);
  document.getElementById('btn-point-cancel').addEventListener('click', goBackToDetail);
  document.getElementById('btn-point-save').addEventListener('click', savePointForm);

  // 题库选择面板按钮
  document.getElementById('btn-add-question').addEventListener('click', openPicker);
  document.getElementById('btn-picker-close').addEventListener('click', closePicker);
  document.getElementById('btn-picker-cancel').addEventListener('click', closePicker);
  document.getElementById('btn-picker-confirm').addEventListener('click', confirmPickerSelection);

  // 筛选条变化时重渲列表
  document.getElementById('picker-filter-subject')
    .addEventListener('change', renderPickerList);
  document.getElementById('picker-filter-difficulty')
    .addEventListener('change', renderPickerList);
  document.getElementById('picker-filter-search')
    .addEventListener('input', e => { pickerSearch = e.target.value.trim(); renderPickerList(); });

  // 点击遮罩关闭选题面板
  document.getElementById('question-picker-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closePicker(); });

  // 复选框变化：同步更新 pickerSelectedIds + 实时计数
  document.getElementById('picker-question-list')
    .addEventListener('change', e => {
      const cb = e.target.closest('.picker-checkbox');
      if (!cb) return;
      if (cb.checked) pickerSelectedIds.add(cb.value);
      else            pickerSelectedIds.delete(cb.value);
      updatePickerCount();
    });
}

/**
 * 打开点位表单（新建：pointId=null，编辑：传入 pointId）
 * @param {string}      levelId
 * @param {string|null} pointId
 */
export async function showPointForm(levelId, pointId) {
  currentLevelId = levelId;
  currentPointId = pointId;

  if (pointId) {
    // 编辑：填入已有数据
    const pt = await db.points.get(pointId);
    if (!pt) return;
    document.getElementById('point-panel-title').textContent   = `第 ${pt.order} 站编辑`;
    document.getElementById('point-order-display').value       = pt.order;
    document.getElementById('input-point-name').value          = pt.name;
    document.getElementById('input-point-parent-note').value   = pt.parentNote || '';
    document.getElementById('input-discovery-text').value      = pt.discoveryText || '';
    document.getElementById('input-location-hint').value       = pt.locationHint || '';
    currentQuestionIds = [...(pt.questionIds || [])];
  } else {
    // 新建：计算序号 = 当前 L1 内最大 order + 1
    const existing = await db.points.where('levelId').equals(levelId).sortBy('order');
    const nextOrder = existing.length > 0 ? existing[existing.length - 1].order + 1 : 1;
    document.getElementById('point-panel-title').textContent   = `第 ${nextOrder} 站（新建）`;
    document.getElementById('point-order-display').value       = nextOrder;
    document.getElementById('input-point-name').value          = '';
    document.getElementById('input-point-parent-note').value   = '';
    document.getElementById('input-discovery-text').value      = '';
    document.getElementById('input-location-hint').value       = '';
    currentQuestionIds = [];
  }

  await renderQuestionList();

  // 切换面板
  document.getElementById('levels-detail-panel').style.display = 'none';
  document.getElementById('levels-point-panel').style.display  = '';
  document.getElementById('input-point-name').focus();
}

// ── 面板切换 ─────────────────────────────────────────────

function goBackToDetail() {
  document.getElementById('levels-point-panel').style.display  = 'none';
  document.getElementById('levels-detail-panel').style.display = '';
}

// ── 保存表单 ─────────────────────────────────────────────

async function savePointForm() {
  const name = document.getElementById('input-point-name').value.trim();
  if (!name) {
    alert('点位名称不能为空！');
    document.getElementById('input-point-name').focus();
    return;
  }

  const fields = {
    name,
    parentNote:    document.getElementById('input-point-parent-note').value.trim(),
    discoveryText: document.getElementById('input-discovery-text').value.trim(),
    locationHint:  document.getElementById('input-location-hint').value.trim(),
    questionIds:   [...currentQuestionIds],
  };

  if (currentPointId) {
    // 编辑：更新可变字段（order 和 code 不变）
    await db.points.update(currentPointId, fields);
  } else {
    // 新建：生成 ID + 不重复的 6 位码 + 计算 order
    const allCodes  = await db.points.orderBy('code').keys();
    let code;
    do { code = generateSixDigitCode(); }
    while (!isCodeUnique(code, [...allCodes]));

    const existing  = await db.points.where('levelId').equals(currentLevelId).sortBy('order');
    const order     = existing.length > 0 ? existing[existing.length - 1].order + 1 : 1;

    await db.points.add({
      id:      generateId('pt'),
      levelId: currentLevelId,
      order,
      code,
      ...fields,
      // V1 预留字段默认值
      mapX:              null,
      mapY:              null,
      questionIntroText: '',
      completionText:    '',
    });
  }

  // 点位内容变更 = 探险内容变更，同步更新父探险的最近编辑时间
  await db.levels.update(currentLevelId, { updatedAt: Date.now() });

  // 通知 point-list.js 刷新列表
  document.dispatchEvent(new CustomEvent('point-saved', { detail: { levelId: currentLevelId } }));
  goBackToDetail();
}

// ── 题目绑定列表 ─────────────────────────────────────────

async function renderQuestionList() {
  const container = document.getElementById('question-list-container');

  if (currentQuestionIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="min-height:80px">
        <p>暂无题目，点击「从题库添加题目」绑定</p>
      </div>`;
    return;
  }

  const questions = await db.questions.bulkGet(currentQuestionIds);
  const list = document.createElement('div');
  list.className = 'question-bind-list';

  questions.forEach((q, idx) => {
    if (!q) return; // 题目可能已被删除
    const item = document.createElement('div');
    item.className = 'question-bind-item';

    const isFirst = idx === 0;
    const isLast  = idx === currentQuestionIds.length - 1;
    const stars   = '★'.repeat(q.difficulty || 1) + '☆'.repeat(3 - (q.difficulty || 1));
    const label   = SUBJECT_LABELS[q.subject] || q.subject || '其他';
    const text40  = q.text.length > 40 ? q.text.slice(0, 40) + '…' : q.text;

    item.innerHTML = `
      <div class="question-bind-left">
        <span class="question-num">#${idx + 1}</span>
        <div class="question-bind-info">
          <div class="question-bind-tags">
            <span class="tag">${label}</span>
            <span class="tag-stars">${stars}</span>
          </div>
          <div class="question-bind-text">${escapeHtml(text40)}</div>
        </div>
      </div>
      <div class="question-bind-actions">
        <button class="btn btn-secondary btn-sm" data-action="up"
                ${isFirst ? 'disabled' : ''} title="上移">↑</button>
        <button class="btn btn-secondary btn-sm" data-action="down"
                ${isLast ? 'disabled' : ''} title="下移">↓</button>
        <button class="btn btn-danger btn-sm" data-action="remove">移除</button>
      </div>`;

    item.addEventListener('click', async e => {
      const btn = e.target.closest('[data-action]');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.action;
      if (action === 'up')     { moveQuestion(idx, -1); }
      if (action === 'down')   { moveQuestion(idx,  1); }
      if (action === 'remove') { removeQuestion(idx); }
    });

    list.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(list);
}

function moveQuestion(idx, direction) {
  const swapIdx = idx + direction;
  if (swapIdx < 0 || swapIdx >= currentQuestionIds.length) return;
  [currentQuestionIds[idx], currentQuestionIds[swapIdx]] =
    [currentQuestionIds[swapIdx], currentQuestionIds[idx]];
  renderQuestionList();
}

function removeQuestion(idx) {
  currentQuestionIds.splice(idx, 1);
  renderQuestionList();
}

// ── 题库选择面板 ─────────────────────────────────────────

async function openPicker() {
  pickerSelectedIds = new Set(); // 每次打开面板重置已选，不跨点位保留
  document.getElementById('picker-filter-subject').value    = '';
  document.getElementById('picker-filter-difficulty').value = '';
  document.getElementById('picker-filter-search').value    = '';
  pickerSearch = '';
  // 按 usedCount 升序加载（少用的题优先显示）
  pickerAllQuestions = await db.questions.orderBy('usedCount').toArray();
  renderPickerList();
  document.getElementById('question-picker-modal').classList.remove('hidden');
}

function closePicker() {
  document.getElementById('question-picker-modal').classList.add('hidden');
}

function renderPickerList() {
  const subject    = document.getElementById('picker-filter-subject').value;
  const difficulty = document.getElementById('picker-filter-difficulty').value;
  const bound      = new Set(currentQuestionIds); // 已绑定的不重复显示

  const filtered = pickerAllQuestions.filter(q => {
    if (bound.has(q.id)) return false;
    return matchesQuestionFilter(q, { subject, difficulty, search: pickerSearch });
  });

  const container = document.getElementById('picker-question-list');

  if (pickerAllQuestions.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="min-height:100px">
        <p>题库还没有题目，请先在「题库管理」里新建题目。</p>
      </div>`;
    updatePickerCount();
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="min-height:100px">
        <p>没有符合筛选条件的题目（或全部已绑定）。</p>
      </div>`;
    updatePickerCount();
    return;
  }

  const list = document.createElement('div');
  filtered.forEach(q => {
    const row = document.createElement('label');
    row.className = 'picker-row';
    const stars    = '★'.repeat(q.difficulty || 1) + '☆'.repeat(3 - (q.difficulty || 1));
    const label    = SUBJECT_LABELS[q.subject] || q.subject || '其他';
    const text50   = q.text.length > 50 ? q.text.slice(0, 50) + '…' : q.text;
    const usedTag  = q.usedCount > 0
      ? `<span class="tag tag-used">已用 ${q.usedCount} 次</span>`
      : '';

    row.innerHTML = `
      <input type="checkbox" class="picker-checkbox" value="${q.id}">
      <div class="picker-question-info">
        <div class="picker-tags">
          <span class="tag">${label}</span>
          <span class="tag-stars">${stars}</span>
          ${usedTag}
        </div>
        <div class="picker-text">${escapeHtml(text50)}</div>
      </div>`;
    // 恢复已选状态：筛选条件变化重渲时，之前勾选的题目保持选中
    row.querySelector('.picker-checkbox').checked = pickerSelectedIds.has(q.id);
    list.appendChild(row);
  });

  container.innerHTML = '';
  container.appendChild(list);
  updatePickerCount(); // 重渲后复选框清零
}

function updatePickerCount() {
  // 从 Set 读取数量，不依赖 DOM（DOM 重渲后数量仍准确）
  document.getElementById('picker-selected-count').textContent =
    `已选 ${pickerSelectedIds.size} 道题`;
}

function confirmPickerSelection() {
  // 从 Set 取全部已选 ID，包括当前筛选结果看不到的题目
  const newIds = [...pickerSelectedIds];
  if (newIds.length > 0) {
    currentQuestionIds.push(...newIds);
    renderQuestionList();
  }
  closePicker();
}

// ── 工具函数 ─────────────────────────────────────────────

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
