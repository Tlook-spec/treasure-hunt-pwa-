/**
 * admin/scripts/question-form.js
 * 题目新建/编辑表单：题型切换、动态选项行、正确答案选择、保存
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ── 表单状态（模块级变量）────────────────────────────────
let editingId        = null;          // null = 新建；string = 编辑中的题目 ID
let currentType      = 'single_choice';
let currentOptions   = ['', ''];      // 选项文本数组
let currentAnswer    = '';            // 'A' / 'B' / 'C' / 'D'

// ── 初始化（只绑一次静态按钮）───────────────────────────
export function initQuestionForm() {
  document.getElementById('btn-question-back')
    .addEventListener('click', goBackToList);
  document.getElementById('btn-question-cancel')
    .addEventListener('click', goBackToList);
  document.getElementById('btn-question-save')
    .addEventListener('click', saveQuestion);

  // 题型切换按钮（delegated）
  document.querySelectorAll('.q-type-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => switchType(btn.dataset.type));
  });

  // 添加选项按钮
  document.getElementById('btn-add-option')
    .addEventListener('click', () => {
      if (currentType === 'single_choice' && currentOptions.length < 4) {
        currentOptions.push('');
        renderOptions();
        renderAnswerBtns();
        updateAddOptionBtn();
      }
    });
}

// ── 打开表单（外部调用）─────────────────────────────────
export async function showQuestionForm(questionId) {
  editingId      = questionId;
  currentType    = 'single_choice';
  currentOptions = ['', ''];
  currentAnswer  = '';

  // 切换面板
  document.getElementById('questions-list-panel').style.display = 'none';
  document.getElementById('questions-form-panel').style.display = '';
  document.getElementById('question-form-title').textContent =
    questionId ? '编辑题目' : '新建题目';

  // 重置所有字段
  document.getElementById('input-question-text').value        = '';
  document.getElementById('select-question-subject').value    = '';
  document.getElementById('select-question-difficulty').value = '';
  document.getElementById('select-question-age').value        = '';
  document.getElementById('input-question-hint').value        = '';
  document.getElementById('input-question-explanation').value = '';
  resetTypeBtns('single_choice');

  if (questionId) {
    const q = await db.questions.get(questionId);
    if (!q) { alert('找不到该题目'); goBackToList(); return; }

    currentType    = q.type    || 'single_choice';
    currentOptions = q.options ? [...q.options] : ['', ''];
    currentAnswer  = q.correctAnswer || '';

    document.getElementById('input-question-text').value        = q.text        || '';
    document.getElementById('select-question-subject').value    = q.subject      || '';
    document.getElementById('select-question-difficulty').value = q.difficulty
      ? String(q.difficulty) : '';
    document.getElementById('select-question-age').value        = q.ageGroup    || '';
    document.getElementById('input-question-hint').value        = q.hint        || '';
    document.getElementById('input-question-explanation').value = q.explanation || '';
    resetTypeBtns(currentType);
  }

  renderOptions();
  renderAnswerBtns();
  updateAddOptionBtn();
}

// ── 题型切换 ─────────────────────────────────────────────
function switchType(type) {
  currentType = type;
  resetTypeBtns(type);

  if (type === 'true_false') {
    currentOptions = ['对', '错'];
    // 非 A/B 的答案在判断题里无效，清空
    if (currentAnswer !== 'A' && currentAnswer !== 'B') currentAnswer = '';
  } else {
    // 切回单选题：选项已有值则保留，否则至少 2 个空
    if (currentOptions.length < 2) currentOptions = ['', ''];
  }

  renderOptions();
  renderAnswerBtns();
  updateAddOptionBtn();
}

function resetTypeBtns(activeType) {
  document.querySelectorAll('.q-type-btn[data-type]').forEach(b =>
    b.classList.toggle('active', b.dataset.type === activeType));
}

// ── 渲染选项行 ───────────────────────────────────────────
function renderOptions() {
  const container   = document.getElementById('options-container');
  const isTrueFalse = currentType === 'true_false';
  container.innerHTML = '';

  currentOptions.forEach((text, idx) => {
    const letter = OPTION_LETTERS[idx];
    const canDelete = !isTrueFalse && currentOptions.length > 2;

    const row = document.createElement('div');
    row.className = 'q-option-row';
    row.innerHTML = `
      <span class="q-option-letter">${letter}</span>
      <input class="form-input q-option-input" type="text"
             value="${escapeAttr(text)}"
             placeholder="选项 ${letter} 的内容"
             ${isTrueFalse ? 'readonly style="color:var(--color-text-muted)"' : ''}
             data-idx="${idx}">
      ${canDelete
        ? `<button class="btn-q-remove-option" data-idx="${idx}" title="删除此选项">✕</button>`
        : ''}`;

    if (!isTrueFalse) {
      row.querySelector('.q-option-input').addEventListener('input', e => {
        currentOptions[parseInt(e.target.dataset.idx)] = e.target.value;
      });
    }

    const delBtn = row.querySelector('.btn-q-remove-option');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        const i       = parseInt(delBtn.dataset.idx);
        const removed = OPTION_LETTERS[i];
        currentOptions.splice(i, 1);
        if (currentAnswer === removed) currentAnswer = '';
        renderOptions();
        renderAnswerBtns();
        updateAddOptionBtn();
      });
    }

    container.appendChild(row);
  });
}

// ── 渲染正确答案按钮 ─────────────────────────────────────
function renderAnswerBtns() {
  const group = document.getElementById('correct-answer-group');
  group.innerHTML = '';

  currentOptions.forEach((_, idx) => {
    const letter = OPTION_LETTERS[idx];
    const btn    = document.createElement('button');
    btn.className   = 'q-answer-btn' + (currentAnswer === letter ? ' selected' : '');
    btn.textContent = letter;
    btn.addEventListener('click', () => {
      currentAnswer = letter;
      group.querySelectorAll('.q-answer-btn').forEach(b =>
        b.classList.toggle('selected', b.textContent === letter));
    });
    group.appendChild(btn);
  });
}

// ── 控制「添加选项」按钮是否可见 ────────────────────────
function updateAddOptionBtn() {
  const btn = document.getElementById('btn-add-option');
  btn.style.display =
    (currentType === 'single_choice' && currentOptions.length < 4) ? '' : 'none';
}

// ── 保存 ─────────────────────────────────────────────────
async function saveQuestion() {
  const text = document.getElementById('input-question-text').value.trim();
  if (!text) { alert('请填写题目内容'); return; }

  const subject = document.getElementById('select-question-subject').value;
  if (!subject) { alert('请选择学科'); return; }

  const filledOptions = currentOptions.map(o => o.trim());
  if (filledOptions.some(o => !o)) { alert('请填写所有选项内容'); return; }
  if (!currentAnswer) { alert('请选择正确答案'); return; }

  const difficultyRaw = document.getElementById('select-question-difficulty').value;
  const ageGroup      = document.getElementById('select-question-age').value;
  const hint          = document.getElementById('input-question-hint').value.trim();
  const explanation   = document.getElementById('input-question-explanation').value.trim();

  const data = {
    subject,
    difficulty:    difficultyRaw ? parseInt(difficultyRaw) : null,
    ageGroup:      ageGroup || '',
    type:          currentType,
    text,
    options:       filledOptions,
    correctAnswer: currentAnswer,
    hint,
    explanation,
    textImagePath: null,
    imagePath:     null,
  };

  if (editingId) {
    await db.questions.update(editingId, data);
  } else {
    await db.questions.add({
      ...data,
      id:        generateId('q'),
      usedCount: 0,
    });
  }

  document.dispatchEvent(new CustomEvent('question-saved'));
  goBackToList();
}

// ── 返回列表面板 ─────────────────────────────────────────
function goBackToList() {
  document.getElementById('questions-form-panel').style.display = 'none';
  document.getElementById('questions-list-panel').style.display = '';
}

// ── 工具 ─────────────────────────────────────────────────
function escapeAttr(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
