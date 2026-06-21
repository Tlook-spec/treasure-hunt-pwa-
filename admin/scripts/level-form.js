/**
 * admin/scripts/level-form.js
 * L1 探险的列表渲染、新建/编辑弹窗、复制、删除
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';
import { generateSixDigitCode, isCodeUnique } from '../../shared/utils/code-generator.js';
import {
  initLevelDetail,
  showLevelDetail,
  hideLevelDetail,
} from './level-detail.js?v=V1-10';
import { initPointForm } from './point-form.js';

// ── 常量 ───────────────────────────────────────────────────

const THEME_COLORS = [
  '#4A90E2', // 蓝色（默认）
  '#7ED321', // 绿色
  '#F5A623', // 橙色
  '#E74C3C', // 红色
  '#9B59B6', // 紫色
  '#1ABC9C', // 青绿
];

// ── 模块状态 ────────────────────────────────────────────────

let currentColor     = THEME_COLORS[0]; // 表单当前选中的主题色
let editingLevelId   = null;             // null=新建，有值=编辑
let currentMapImage  = null;             // base64 压缩后的地图底图，null=未上传

// ── 入口 ────────────────────────────────────────────────────

/**
 * 初始化整个探险管理页面
 * 由 levels.html 的 <script type="module"> 调用
 */
export function initLevelsPage() {
  initLevelDetail();
  initPointForm();
  initColorSwatches();
  bindListButtons();
  bindFormButtons();
  bindDetailActionButtons();
  renderLevelList();
}

// ── 颜色色块初始化 ─────────────────────────────────────────

function initColorSwatches() {
  const container = document.getElementById('color-swatches');
  container.innerHTML = THEME_COLORS.map(c => `
    <button type="button" class="color-swatch ${c === currentColor ? 'selected' : ''}"
      style="background:${c}" data-color="${c}" title="${c}"></button>
  `).join('');

  container.addEventListener('click', e => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    currentColor = swatch.dataset.color;
    updateColorSwatches();
  });
}

function updateColorSwatches() {
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', s.dataset.color === currentColor);
  });
}

// ── 探险列表渲染 ───────────────────────────────────────────

/**
 * 从 DB 读取所有探险并渲染卡片列表
 */
export async function renderLevelList() {
  const container = document.getElementById('levels-container');
  container.innerHTML = '';

  const levels = await db.levels.orderBy('updatedAt').reverse().toArray();

  if (levels.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗺️</div>
        <h3>还没有探险</h3>
        <p>点击「新建探险」开始创建你的第一个户外探险活动！</p>
      </div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'levels-grid';

  for (const level of levels) {
    const pointCount = await db.points.where('levelId').equals(level.id).count();
    grid.appendChild(buildLevelCard(level, pointCount));
  }

  container.appendChild(grid);
}

/**
 * 构建单张探险卡片的 DOM 元素
 */
function buildLevelCard(level, pointCount) {
  const card = document.createElement('div');
  card.className = 'level-card';
  card.dataset.levelId = level.id;

  const updatedDate = new Date(level.updatedAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  card.innerHTML = `
    <div class="level-card-stripe" style="background:${level.themeColor || '#4A90E2'}"></div>
    <div class="level-card-body">
      <div class="level-card-name">${escapeHtml(level.name)}</div>
      <div class="level-card-desc">${escapeHtml(level.description || '（无简介）')}</div>
      <div class="level-card-meta">
        <span>📍 ${pointCount} 个点位</span>
        <span>👥 ${level.recommendedPlayerCount || 1} 人</span>
        <span>🎂 ${level.recommendedAge || '7-9'} 岁</span>
        <span>📅 ${updatedDate}</span>
      </div>
    </div>
    <div class="level-card-actions">
      <button class="btn btn-secondary btn-sm" data-action="view">👁️ 详情</button>
      <button class="btn btn-secondary btn-sm" data-action="edit">✏️ 编辑</button>
      <button class="btn btn-secondary btn-sm" data-action="copy">📋 复制</button>
      <button class="btn btn-danger btn-sm"    data-action="delete">🗑️ 删除</button>
    </div>`;

  card.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = card.dataset.levelId;
    const action = btn.dataset.action;
    if (action === 'view')   showLevelDetail(id);
    if (action === 'edit')   openEditForm(id);
    if (action === 'copy')   handleCopyLevel(id);
    if (action === 'delete') handleDeleteLevel(id);
  });

  return card;
}

// ── 按钮绑定 ──────────────────────────────────────────────

function bindListButtons() {
  document.getElementById('btn-create-level')
    .addEventListener('click', openCreateForm);
}

function bindFormButtons() {
  document.getElementById('btn-modal-close').addEventListener('click', closeForm);
  document.getElementById('btn-form-cancel').addEventListener('click', closeForm);
  document.getElementById('btn-form-save').addEventListener('click', saveForm);
  document.getElementById('btn-confirm-close').addEventListener('click', closeConfirm);
  document.getElementById('btn-confirm-cancel').addEventListener('click', closeConfirm);
  // 点击遮罩关闭弹窗
  document.getElementById('level-form-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closeForm(); });
  document.getElementById('confirm-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closeConfirm(); });

  // 地图图片：选图后压缩（长边 ≤1600px，JPEG 0.8）并显示预览
  document.getElementById('input-map-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentMapImage = await compressMapImage(file);
    showMapPreview(currentMapImage);
  });

  // 移除地图按钮
  document.getElementById('btn-remove-map').addEventListener('click', () => {
    currentMapImage = null;
    document.getElementById('input-map-image').value = '';
    hideMapPreview();
  });
}

/**
 * 绑定详情面板内的编辑/复制/删除按钮
 * 从 panel.dataset.levelId 读取当前展示的 ID
 */
function bindDetailActionButtons() {
  const getDetailId = () =>
    document.getElementById('levels-detail-panel').dataset.levelId;

  document.getElementById('detail-btn-edit')
    .addEventListener('click', () => openEditForm(getDetailId()));
  document.getElementById('detail-btn-copy')
    .addEventListener('click', () => handleCopyLevel(getDetailId()));
  document.getElementById('detail-btn-delete')
    .addEventListener('click', () => handleDeleteLevel(getDetailId()));
}

// ── 表单：新建/编辑 ────────────────────────────────────────

function openCreateForm() {
  editingLevelId = null;
  document.getElementById('modal-form-title').textContent = '新建探险';
  document.getElementById('input-level-name').value = '';
  document.getElementById('input-level-desc').value = '';
  document.getElementById('select-player-count').value = '1';
  document.getElementById('select-age-group').value   = '7-9';
  currentColor = THEME_COLORS[0];
  updateColorSwatches();
  resetMapSection(); // 清空地图字段，恢复默认值
  openModal('level-form-modal');
  document.getElementById('input-level-name').focus();
}

async function openEditForm(levelId) {
  if (!levelId) return;
  const level = await db.levels.get(levelId);
  if (!level) return;

  editingLevelId = levelId;
  document.getElementById('modal-form-title').textContent = '编辑探险';
  document.getElementById('input-level-name').value = level.name;
  document.getElementById('input-level-desc').value = level.description || '';
  document.getElementById('select-player-count').value = String(level.recommendedPlayerCount || 1);
  document.getElementById('select-age-group').value   = level.recommendedAge || '7-9';
  currentColor = level.themeColor || THEME_COLORS[0];
  updateColorSwatches();
  loadMapSection(level); // 把地图字段填入表单
  openModal('level-form-modal');
}

async function saveForm() {
  const name = document.getElementById('input-level-name').value.trim();
  if (!name) {
    alert('探险名称不能为空！');
    document.getElementById('input-level-name').focus();
    return;
  }

  const now     = Date.now();
  const levelId = editingLevelId; // 保存快照，await 后仍可读

  const formData = {
    name,
    description:              document.getElementById('input-level-desc').value.trim(),
    recommendedPlayerCount:   parseInt(document.getElementById('select-player-count').value),
    recommendedAge:           document.getElementById('select-age-group').value,
    themeColor:               currentColor,
    // 探险地图字段（新建和编辑共用，从表单读取）
    mapImage:                 currentMapImage,
    mapFontSize:              document.querySelector('input[name="map-font-size"]:checked')?.value || 'medium',
    mapNameColor:             document.getElementById('input-map-name-color').value || '#2C3E50',
    mapNameColorCompleted:    document.getElementById('input-map-name-color-completed').value || '#F5A623',
    updatedAt:                now,
  };

  if (levelId) {
    // 编辑：只更新可变字段，保留 id/createdAt 等
    await db.levels.update(levelId, formData);
  } else {
    // 新建：创建完整 Level 对象，V1 预留字段由 formData 携带
    await db.levels.add({
      id: generateId('lvl'),
      ...formData,
      createdAt:    now,
      openingStory: '',
      endingStory:  '',
      customAwards: [],
    });
  }

  // 如果当前正在看被编辑探险的详情，刷新详情内容
  const detailPanel = document.getElementById('levels-detail-panel');
  const needsDetailRefresh =
    levelId &&
    detailPanel.style.display !== 'none' &&
    detailPanel.dataset.levelId === levelId;

  closeForm();
  renderLevelList();
  if (needsDetailRefresh) showLevelDetail(levelId);
}

function closeForm() {
  document.getElementById('level-form-modal').classList.add('hidden');
}

// ── 复制 L1 ───────────────────────────────────────────────

async function handleCopyLevel(levelId) {
  if (!levelId) return;
  const level  = await db.levels.get(levelId);
  const points = await db.points.where('levelId').equals(levelId).toArray();
  if (!level) return;

  const now         = Date.now();
  const newLevelId  = generateId('lvl');

  // 收集全库已有的点位码，用于查重
  const existingCodes = await db.points.orderBy('code').keys();
  const usedCodes = [...existingCodes];

  // 新 L1
  const newLevel = { ...level, id: newLevelId, name: level.name + '（副本）', createdAt: now, updatedAt: now };

  // 新 Points：新 ID + 新 levelId + 新 6 位码，questionIds 保持不变
  const newPoints = points.map(pt => {
    let code;
    do { code = generateSixDigitCode(); }
    while (!isCodeUnique(code, usedCodes));
    usedCodes.push(code); // 防止本批次内重复
    return { ...pt, id: generateId('pt'), levelId: newLevelId, code };
  });

  await db.transaction('rw', db.levels, db.points, async () => {
    await db.levels.add(newLevel);
    if (newPoints.length) await db.points.bulkAdd(newPoints);
  });

  // 如果是从详情页发起的复制，返回列表
  const detailPanel = document.getElementById('levels-detail-panel');
  if (detailPanel.style.display !== 'none') hideLevelDetail();

  renderLevelList();
}

// ── 删除 L1 ───────────────────────────────────────────────

async function handleDeleteLevel(levelId) {
  if (!levelId) return;
  const level      = await db.levels.get(levelId);
  const pointCount = await db.points.where('levelId').equals(levelId).count();
  if (!level) return;

  const msg = pointCount > 0
    ? `确定删除「${level.name}」吗？这会同时删除其中的 ${pointCount} 个点位，此操作无法撤销。`
    : `确定删除「${level.name}」吗？此操作无法撤销。`;

  showConfirm(msg, async () => {
    await db.transaction('rw', db.levels, db.points, async () => {
      await db.points.where('levelId').equals(levelId).delete();
      await db.levels.delete(levelId);
    });
    hideLevelDetail(); // 如果正在查看详情则返回列表（不在详情时无副作用）
    renderLevelList();
  });
}

// ── 确认对话框 ─────────────────────────────────────────────

/**
 * 显示删除确认弹窗
 * @param {string}   message  - 确认文本
 * @param {Function} onOk     - 用户点「确认删除」时的回调
 */
function showConfirm(message, onOk) {
  document.getElementById('confirm-message').textContent = message;
  openModal('confirm-modal');

  // 用 cloneNode 替换按钮，清除上次绑定的旧 handler
  const oldBtn = document.getElementById('btn-confirm-ok');
  const newBtn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(newBtn);
  newBtn.addEventListener('click', () => {
    closeConfirm();
    onOk();
  });
}

function closeConfirm() {
  document.getElementById('confirm-modal').classList.add('hidden');
}

// ── 工具函数 ───────────────────────────────────────────────

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

/** 防止 XSS：把用户文本安全地转为 HTML 字符串 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── 地图区域辅助函数 ───────────────────────────────────────

/** 新建表单时重置地图区域到默认值 */
function resetMapSection() {
  currentMapImage = null;
  document.getElementById('input-map-image').value = '';
  const radio = document.querySelector('input[name="map-font-size"][value="medium"]');
  if (radio) radio.checked = true;
  document.getElementById('input-map-name-color').value = '#2C3E50';
  document.getElementById('input-map-name-color-completed').value = '#F5A623';
  hideMapPreview();
}

/** 编辑表单时把 Level 的地图字段填入 UI */
function loadMapSection(level) {
  currentMapImage = level.mapImage || null;
  // 字号单选：有值用已有值，否则默认 medium
  const fontSize = level.mapFontSize || 'medium';
  const radio = document.querySelector(`input[name="map-font-size"][value="${fontSize}"]`);
  if (radio) radio.checked = true;
  // 颜色（老数据可能没有这两个字段，回退默认色）
  document.getElementById('input-map-name-color').value = level.mapNameColor || '#2C3E50';
  document.getElementById('input-map-name-color-completed').value = level.mapNameColorCompleted || '#F5A623';
  // 有底图则显示预览
  if (currentMapImage) showMapPreview(currentMapImage);
  else hideMapPreview();
}

/** 显示地图缩略图预览 + 「移除」按钮 */
function showMapPreview(base64) {
  document.getElementById('map-preview-img').src = base64;
  document.getElementById('map-preview-container').style.display = 'block';
  document.getElementById('btn-remove-map').style.display = 'inline-flex';
}

/** 隐藏地图预览并清空 src */
function hideMapPreview() {
  document.getElementById('map-preview-img').src = '';
  document.getElementById('map-preview-container').style.display = 'none';
  document.getElementById('btn-remove-map').style.display = 'none';
}

/**
 * 用 Canvas 把图片文件压缩为 base64（长边 ≤1600px，JPEG quality 0.8）
 * @param {File} file - 用户选择的图片文件
 * @returns {Promise<string>} base64 字符串
 */
function compressMapImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1600;
      let w = img.width, h = img.height;
      // 只在超出限制时等比缩放
      if (w > MAX || h > MAX) {
        if (w >= h) { h = Math.round(h * MAX / w); w = MAX; }
        else        { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null); // 读图失败 → 不存底图
    };
    img.src = url;
  });
}
