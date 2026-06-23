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
  fun:     '趣味',
};

// ── 模块状态（表单会话期间保持）──────────────────────────

let currentLevelId     = null;
let currentPointId     = null;  // null = 新建
let currentQuestionIds = [];    // 表单内当前题目 ID 列表（实时变化）
let pickerAllQuestions = [];    // 选题面板加载的全部题目
let pickerSearch       = '';    // 选题面板当前关键字搜索词
let pickerSelectedIds  = new Set(); // 已选题目 ID，独立于筛选条件，换筛选不清空
let pickerOccupiedIds  = new Set(); // 同探险内其他点位已占用的题目 ID（按 levelId 过滤）

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

  // 随机抽取按钮
  document.getElementById('btn-picker-random')
    .addEventListener('click', drawRandomQuestions);

  // 点击遮罩关闭选题面板
  document.getElementById('question-picker-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closePicker(); });

  // QR 预览弹窗
  document.getElementById('btn-preview-qr').addEventListener('click', openQrPreview);
  document.getElementById('btn-qr-close').addEventListener('click', closeQrModal);
  document.getElementById('btn-qr-close2').addEventListener('click', closeQrModal);
  document.getElementById('qr-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closeQrModal(); });

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
    document.getElementById('input-point-name').value             = pt.name;
    document.getElementById('input-point-parent-note').value      = pt.parentNote || '';
    document.getElementById('input-discovery-text').value         = pt.discoveryText || '';
    document.getElementById('input-question-intro-text').value    = pt.questionIntroText || '';
    document.getElementById('input-completion-text').value        = pt.completionText || '';
    document.getElementById('input-location-hint').value          = pt.locationHint || '';
    currentQuestionIds = [...(pt.questionIds || [])];
  } else {
    // 新建：计算序号 = 当前 L1 内最大 order + 1
    const existing = await db.points.where('levelId').equals(levelId).sortBy('order');
    const nextOrder = existing.length > 0 ? existing[existing.length - 1].order + 1 : 1;
    document.getElementById('point-panel-title').textContent   = `第 ${nextOrder} 站（新建）`;
    document.getElementById('point-order-display').value       = nextOrder;
    document.getElementById('input-point-name').value             = '';
    document.getElementById('input-point-parent-note').value      = '';
    document.getElementById('input-discovery-text').value         = '';
    document.getElementById('input-question-intro-text').value    = '';
    document.getElementById('input-completion-text').value        = '';
    document.getElementById('input-location-hint').value          = '';
    currentQuestionIds = [];
  }

  await renderQuestionList();

  // 新建点位尚无 code，禁用预览二维码按钮
  document.getElementById('btn-preview-qr').disabled = !pointId;

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
    parentNote:         document.getElementById('input-point-parent-note').value.trim(),
    discoveryText:      document.getElementById('input-discovery-text').value.trim(),
    questionIntroText:  document.getElementById('input-question-intro-text').value.trim(),
    completionText:     document.getElementById('input-completion-text').value.trim(),
    locationHint:       document.getElementById('input-location-hint').value.trim(),
    questionIds:        [...currentQuestionIds],
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
      mapX:    null,  // V1 地图坐标，默认 null
      mapY:    null,
      ...fields,      // questionIntroText / completionText 已在 fields 里
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

  // 复位随机抽题控件
  document.getElementById('picker-random-count').value = '3';
  document.getElementById('picker-random-hint').textContent = '';

  // 并行加载：题库全量 + 同探险内所有点位（用于计算占用集合）
  const [questions, siblingPoints] = await Promise.all([
    db.questions.orderBy('usedCount').toArray(),
    db.points.where('levelId').equals(currentLevelId).toArray(),
  ]);
  pickerAllQuestions = questions;

  // 收集同探险内「其他」点位已占用的题目 ID（当前点位自己的不算占用）
  // 复用 findQuestionReferences 的同等逻辑，但加 levelId 过滤，避免全局去重
  pickerOccupiedIds = new Set(
    siblingPoints
      .filter(pt => pt.id !== currentPointId)
      .flatMap(pt => pt.questionIds || [])
  );

  renderPickerList();
  document.getElementById('question-picker-modal').classList.remove('hidden');
}

function closePicker() {
  document.getElementById('question-picker-modal').classList.add('hidden');
}

/**
 * 按当前筛选条件（学科/难度/搜索）+ 排除已绑定，算出选题面板要显示的题目。
 * 注意：占用题（pickerOccupiedIds）仍会包含在内（列表里显示为禁用项）。
 * 随机抽题时需另外排除占用题和已选题。
 */
function getFilteredPickerQuestions() {
  const subject    = document.getElementById('picker-filter-subject').value;
  const difficulty = document.getElementById('picker-filter-difficulty').value;
  const bound      = new Set(currentQuestionIds); // 已绑定的不重复显示
  return pickerAllQuestions.filter(q => {
    if (bound.has(q.id)) return false;
    return matchesQuestionFilter(q, { subject, difficulty, search: pickerSearch });
  });
}

function renderPickerList() {
  const filtered  = getFilteredPickerQuestions();
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
    const row        = document.createElement('label');
    const isOccupied = pickerOccupiedIds.has(q.id); // 同探险内其他点位已用
    row.className    = isOccupied ? 'picker-row picker-row-occupied' : 'picker-row';

    const stars    = '★'.repeat(q.difficulty || 1) + '☆'.repeat(3 - (q.difficulty || 1));
    const label    = SUBJECT_LABELS[q.subject] || q.subject || '其他';
    const text50   = q.text.length > 50 ? q.text.slice(0, 50) + '…' : q.text;
    const usedTag  = q.usedCount > 0
      ? `<span class="tag tag-used">已用 ${q.usedCount} 次</span>`
      : '';
    // 占用提示：让家长一眼看懂为何不可勾选（只在同探险内有占用时显示）
    const occupiedHint = isOccupied
      ? `<div class="picker-occupied-hint">已被本探险其他点位使用</div>`
      : '';

    row.innerHTML = `
      <input type="checkbox" class="picker-checkbox" value="${q.id}"${isOccupied ? ' disabled' : ''}>
      <div class="picker-question-info">
        <div class="picker-tags">
          <span class="tag">${label}</span>
          <span class="tag-stars">${stars}</span>
          ${usedTag}
        </div>
        <div class="picker-text">${escapeHtml(text50)}</div>
        ${occupiedHint}
      </div>`;
    // 恢复已选状态：筛选条件变化重渲时，之前勾选的题目保持选中（占用项不恢复）
    if (!isOccupied) {
      row.querySelector('.picker-checkbox').checked = pickerSelectedIds.has(q.id);
    }
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

// ── 随机抽题 ─────────────────────────────────────────────

/**
 * 按当前筛选条件随机抽 N 道题加入勾选。
 * 优先抽 usedCount < 2 的「少用题」，不够再补 ≥2 次的（软避让，不硬排除）。
 * 抽到的只加进 pickerSelectedIds（自动勾选），家长仍需点「确认添加」。
 */
function drawRandomQuestions() {
  const hintEl = document.getElementById('picker-random-hint');

  // 读取数量，clamp 到 1-10
  const raw = parseInt(document.getElementById('picker-random-count').value, 10);
  const n   = Math.max(1, Math.min(10, isNaN(raw) ? 3 : raw));

  // 候选池：符合筛选 + 排除占用题 + 排除已勾选的（避免重复抽到）
  const pool = getFilteredPickerQuestions().filter(q =>
    !pickerOccupiedIds.has(q.id) && !pickerSelectedIds.has(q.id)
  );

  if (pool.length === 0) {
    hintEl.textContent = '没有可抽的题（调整筛选，或先清空已选）';
    return;
  }

  // 分两组：少用题优先，已用多的兜底
  const preferred = shuffle(pool.filter(q => (q.usedCount || 0) < 2));
  const fallback  = shuffle(pool.filter(q => (q.usedCount || 0) >= 2));
  const picked    = preferred.concat(fallback).slice(0, n);

  // 加入勾选集合并重渲（renderPickerList 会自动恢复勾选状态）
  picked.forEach(q => pickerSelectedIds.add(q.id));
  renderPickerList();
  updatePickerCount();

  // 结果提示：数量不足 / 用到了高频题都要说明
  const heavyCount = picked.filter(q => (q.usedCount || 0) >= 2).length;
  let msg = `已随机选中 ${picked.length} 道（已加入勾选，可再手动调整）`;
  if (picked.length < n) {
    msg = `只抽到 ${picked.length} 道（符合条件的题不够 ${n} 道）`;
  }
  if (heavyCount > 0) {
    msg += `；其中 ${heavyCount} 道是已用较多的题`;
  }
  hintEl.textContent = msg;
}

/** Fisher-Yates 洗牌，返回新数组（不改原数组）*/
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── 二维码预览 ────────────────────────────────────────────

async function openQrPreview() {
  if (!currentPointId) return;
  const pt    = await db.points.get(currentPointId);
  if (!pt) return;
  const level = await db.levels.get(pt.levelId);

  // 用全局 qrcode 函数生成二维码（GIF 格式）
  const qr = qrcode(0, 'M');
  qr.addData(pt.code);
  qr.make();

  const display = document.getElementById('qr-code-display');
  display.innerHTML = qr.createImgTag(5, 8);

  document.getElementById('qr-point-name').textContent =
    `第 ${pt.order} 站 · ${pt.name}`;
  document.getElementById('qr-code-number').textContent = pt.code;

  // 设置下载链接，文件名含探险名、站次、点位名、数字码
  const imgEl      = display.querySelector('img');
  const levelName  = level ? level.name : '探险';
  const fileName   = `${levelName}_第${pt.order}站_${pt.name}_码${pt.code}.gif`;
  const dlBtn      = document.getElementById('btn-qr-download');
  dlBtn.href       = imgEl.src;   // data:image/gif;base64,...
  dlBtn.download   = fileName;

  document.getElementById('qr-modal').classList.remove('hidden');
}

function closeQrModal() {
  document.getElementById('qr-modal').classList.add('hidden');
}

// ── 工具函数 ─────────────────────────────────────────────

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
