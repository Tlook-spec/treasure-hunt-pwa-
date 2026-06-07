/**
 * admin/scripts/csv-import.js
 * CSV 批量导入题目（M10）
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';

// ── 学科白名单（只接受中文，从严）────────────────────────
const SUBJECT_MAP = {
  '数学': 'math',
  '语文': 'chinese',
  '英语': 'english',
  '科学': 'science',
  '常识': 'common',
};

// ── 题型白名单（只接受 单选/判断）────────────────────────
const TYPE_MAP = {
  '单选': 'single_choice',
  '判断': 'true_false',
};

// ── 年龄段白名单（只接受带"岁"写法，存储时去掉"岁"）──────
const AGE_MAP = {
  '4-6岁':   '4-6',
  '7-9岁':   '7-9',
  '10-12岁': '10-12',
};

// ── 模块状态 ─────────────────────────────────────────────
let parsedData = []; // 解析出的原始行数组

// ── 初始化 ────────────────────────────────────────────────

export function initCsvImport() {
  document.getElementById('btn-csv-back')
    .addEventListener('click', hideCsvImportPanel);
  document.getElementById('btn-download-template')
    .addEventListener('click', downloadTemplate);
  document.getElementById('csv-file-input')
    .addEventListener('change', handleFileSelect);
  document.getElementById('btn-confirm-import')
    .addEventListener('click', confirmImport);
}

export function showCsvImportPanel() {
  resetState();
  document.getElementById('questions-list-panel').style.display = 'none';
  document.getElementById('csv-import-panel').style.display     = '';
}

function hideCsvImportPanel() {
  document.getElementById('csv-import-panel').style.display     = 'none';
  document.getElementById('questions-list-panel').style.display = '';
  // 触发列表刷新（导入可能新增了题目）
  document.dispatchEvent(new CustomEvent('question-saved'));
}

function resetState() {
  parsedData = [];
  document.getElementById('csv-file-name').textContent        = '未选择文件';
  document.getElementById('csv-preview-area').style.display  = 'none';
  document.getElementById('csv-import-result').style.display = 'none';
  document.getElementById('btn-confirm-import').disabled      = true;
  document.getElementById('csv-file-input').value             = '';
}

// ── 步骤 1：下载模板 ──────────────────────────────────────

function downloadTemplate() {
  const BOM = '﻿'; // UTF-8 BOM，让 Windows Excel 正确识别中文
  const lines = [
    '学科,难度,年龄段,题型,题干,选项A,选项B,选项C,选项D,正确答案,提示,解析',
    // 例子 1：单选题
    '数学,1,7-9岁,单选,1加1等于几？,1,2,3,4,B,数一数手指头,加法的基本运算',
    // 例子 2：判断题（选项C/D 留空，正确答案填 对/错）
    '语文,1,4-6岁,判断,太阳从东方升起。,,,,,对,想想早晨太阳在哪边,地球自西向东自转',
    // 注释行（导入时自动跳过）
    '# 提示(本行可删): 学科=数学/语文/英语/科学/常识; 难度=1/2/3; 年龄段=4-6岁/7-9岁/10-12岁; 题型=单选/判断; 单选答案=A/B/C/D; 判断答案=对/错',
  ];
  const csv  = BOM + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = '题目导入模板.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ── 步骤 2：上传文件 ──────────────────────────────────────

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('csv-file-name').textContent       = file.name;
  document.getElementById('csv-import-result').style.display = 'none';
  document.getElementById('btn-confirm-import').disabled     = true;

  if (!window.Papa) {
    alert('CSV 解析库未加载，请刷新页面后重试。');
    return;
  }

  window.Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: 'UTF-8',
    complete(results) {
      parsedData = results.data;
      renderPreview(results.data, results.meta.fields || []);
    },
    error(err) {
      alert('文件解析失败：' + err.message);
    },
  });
}

// ── 预览 ─────────────────────────────────────────────────

function renderPreview(data, fields) {
  const area      = document.getElementById('csv-preview-area');
  const tableWrap = document.getElementById('csv-preview-table');

  area.style.display = '';

  // 过滤注释行，取前 5 行预览
  const visible = data
    .filter(row => !isCommentRow(row))
    .slice(0, 5);

  if (visible.length === 0) {
    tableWrap.innerHTML = '<p style="color:var(--color-text-muted);font-size:14px;margin-top:8px">没有可预览的数据行（文件可能只有表头）</p>';
  } else {
    tableWrap.innerHTML = buildTable(visible, fields);
  }

  // 有数据行才允许确认导入（乱码/校验问题在导入时逐行报错）
  const dataRows = data.filter(row => !isCommentRow(row));
  document.getElementById('btn-confirm-import').disabled = dataRows.length === 0;
}

function buildTable(rows, fields) {
  const cols = fields.filter(f => !f.startsWith('#'));
  if (!cols.length) return '';

  const th  = cols.map(f => `<th>${escapeHtml(f)}</th>`).join('');
  const trs = rows.map(row => {
    const tds = cols.map(f => {
      const val = String(row[f] || '');
      const txt = val.length > 18 ? val.slice(0, 18) + '…' : val;
      return `<td>${escapeHtml(txt)}</td>`;
    }).join('');
    return `<tr>${tds}</tr>`;
  }).join('');

  return `<table class="csv-preview-tbl"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
}

// ── 确认导入 ──────────────────────────────────────────────

async function confirmImport() {
  const btn = document.getElementById('btn-confirm-import');
  btn.disabled    = true;
  btn.textContent = '导入中…';

  const errors  = [];
  let rowNum    = 1; // 数据行编号（跳过表头）
  let successCount = 0;

  for (const row of parsedData) {
    if (isCommentRow(row)) continue; // 跳过注释行

    rowNum++;
    const result = parseRow(row, rowNum);
    if (result.error) {
      errors.push(result.error);
    } else {
      try {
        await db.questions.add(result.question);
        successCount++;
      } catch (e) {
        errors.push(`第 ${rowNum} 行：写入失败（${e.message}）`);
      }
    }
  }

  btn.disabled    = false;
  btn.textContent = '✅ 确认导入';
  showResult(successCount, errors);
}

// ── 单行解析与校验（从严，每字段只接受标准写法）─────────

function parseRow(row, rowNum) {
  // 1. 题干（必填）
  const text = (row['题干'] || '').trim();
  if (!text) return { error: `第 ${rowNum} 行：题目内容不能为空` };

  // 2. 学科（必填，只接受中文白名单：数学/语文/英语/科学/常识）
  const subjectRaw = (row['学科'] || '').trim();
  const subject    = SUBJECT_MAP[subjectRaw];
  if (!subject) return { error: `第 ${rowNum} 行：未知学科：${subjectRaw || '（空）'}` };

  // 3. 题型（必填，只接受 单选/判断）
  const typeRaw = (row['题型'] || '').trim();
  const type    = TYPE_MAP[typeRaw];
  if (!type) return { error: `第 ${rowNum} 行：未知题型：${typeRaw || '（空）'}` };

  // 4. 难度（必填，只接受 1/2/3）
  const diffRaw = (row['难度'] || '').trim();
  if (!['1', '2', '3'].includes(diffRaw)) {
    return { error: `第 ${rowNum} 行：难度必须是 1/2/3，当前值「${diffRaw || '（空）'}」` };
  }
  const difficulty = parseInt(diffRaw, 10);

  // 5. 年龄段（必填，只接受 4-6岁/7-9岁/10-12岁，存储时去掉"岁"）
  const ageRaw   = (row['年龄段'] || '').trim();
  const ageGroup = AGE_MAP[ageRaw];
  if (!ageGroup) {
    return { error: `第 ${rowNum} 行：年龄段必须是 4-6岁/7-9岁/10-12岁，当前值「${ageRaw || '（空）'}」` };
  }

  // 6. 选项
  let options;
  if (type === 'true_false') {
    options = ['对', '错']; // 判断题固定选项，忽略 CSV 选项列
  } else {
    options = ['选项A', '选项B', '选项C', '选项D']
      .map(k => (row[k] || '').trim())
      .filter(v => v !== '');
    if (options.length < 2) {
      return { error: `第 ${rowNum} 行：单选题至少需要填写选项A 和选项B` };
    }
  }

  // 7. 正确答案（必填）
  const answerRaw = (row['正确答案'] || '').trim();
  let correctAnswer;

  if (type === 'true_false') {
    // 判断题：只接受 对/错
    if (answerRaw === '对')      correctAnswer = 'A';
    else if (answerRaw === '错') correctAnswer = 'B';
    else return { error: `第 ${rowNum} 行：判断题正确答案必须是「对」或「错」，当前值「${answerRaw || '（空）'}」` };
  } else {
    // 单选题：字母自动转大写，必须是 A-D 且对应有选项
    correctAnswer = answerRaw.toUpperCase();
    const valid   = ['A', 'B', 'C', 'D'].slice(0, options.length);
    if (!valid.includes(correctAnswer)) {
      return { error: `第 ${rowNum} 行：正确答案「${answerRaw || '（空）'}」无效（应为 ${valid.join('/')}）` };
    }
  }

  const now = Date.now();
  return {
    question: {
      id:            generateId('q'),
      subject,
      difficulty,
      ageGroup,
      type,
      text,
      textImagePath: null,
      options,
      correctAnswer, // 统一存字母（A/B/C/D），与题库表单格式一致
      hint:          (row['提示']  || '').trim(),
      explanation:   (row['解析']  || '').trim(),
      imagePath:     null,
      usedCount:     0,    // 遗留字段，引用数由系统实时计算
      createdAt:     now,
      updatedAt:     now,
    },
  };
}

// ── 显示导入结果 ──────────────────────────────────────────

function showResult(successCount, errors) {
  const area     = document.getElementById('csv-import-result');
  const textEl   = document.getElementById('csv-result-text');
  const errorsEl = document.getElementById('csv-error-list');

  area.style.display = '';

  const hasErrors  = errors.length > 0;
  textEl.className = 'csv-result-box ' + (hasErrors ? 'csv-result-warn' : 'csv-result-ok');
  textEl.textContent = hasErrors
    ? `✅ 成功 ${successCount} 道，⚠️ 失败 ${errors.length} 道（详见下方）`
    : `✅ 成功导入 ${successCount} 道题目！`;

  errorsEl.innerHTML = errors
    .map(e => `<div class="csv-error-row">• ${escapeHtml(e)}</div>`)
    .join('');
}

// ── 工具 ─────────────────────────────────────────────────

function isCommentRow(row) {
  const first = String(Object.values(row)[0] || '');
  return first.trim().startsWith('#');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
