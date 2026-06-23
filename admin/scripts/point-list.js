/**
 * admin/scripts/point-list.js
 * L2 点位列表：在 L1 详情页内渲染和管理点位
 * 处理：添加点位导航、上移/下移、复制、删除、单张二维码预览下载
 */

import db from '../../shared/db/admin-db.js';
import { generateId } from '../../shared/utils/id.js';
import { generateSixDigitCode, isCodeUnique } from '../../shared/utils/code-generator.js';
import { showPointForm } from './point-form.js?v=V1-25';

/**
 * 初始化点位列表模块
 * 绑定「添加点位」按钮 + 二维码弹窗关闭按钮 + 监听保存事件
 */
export function initPointList() {
  document.getElementById('btn-add-point')
    .addEventListener('click', () => {
      const levelId = document.getElementById('levels-detail-panel').dataset.levelId;
      if (levelId) showPointForm(levelId, null);
    });

  // 二维码弹窗关闭
  document.getElementById('btn-qr-close')
    .addEventListener('click', closeQrModal);
  document.getElementById('btn-qr-close2')
    .addEventListener('click', closeQrModal);
  document.getElementById('qr-modal')
    .addEventListener('click', e => { if (e.target === e.currentTarget) closeQrModal(); });

  // point-form.js 保存后发出此事件，通知列表刷新
  document.addEventListener('point-saved', e => renderPointList(e.detail.levelId));
}

/**
 * 渲染指定 L1 的所有点位（按 order 升序）
 * @param {string} levelId
 */
export async function renderPointList(levelId) {
  const container = document.getElementById('point-list-container');
  if (!container) return;

  const points = await db.points.where('levelId').equals(levelId).sortBy('order');

  if (points.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="min-height:120px">
        <div class="empty-icon">📍</div>
        <p>还没有点位，点击「添加点位」创建第一站！</p>
      </div>`;
    return;
  }

  // 收集本关卡所有点位引用的题目 ID（去重），一次 bulkGet 判断哪些仍在题库
  const allQIds = [...new Set(points.flatMap(pt => pt.questionIds || []))];
  const fetched = await db.questions.bulkGet(allQIds);
  // bulkGet 返回的数组：存在的题目返回对象，已删的返回 undefined
  const existingQIds = new Set(allQIds.filter((_, i) => fetched[i] !== undefined));

  const list = document.createElement('div');
  list.className = 'point-list';
  points.forEach((pt, idx) => {
    list.appendChild(buildPointRow(pt, idx, points.length, levelId, existingQIds));
  });

  container.innerHTML = '';
  container.appendChild(list);
}

/**
 * 构建单条点位行（序号 · 名称 · 题目数 + 五个操作按钮）
 */
function buildPointRow(pt, idx, total, levelId, existingQIds) {
  const row = document.createElement('div');
  row.className = 'point-row';
  row.dataset.pointId = pt.id;

  // 只统计仍存在于题库的题目（删题后自动反映）
  const qCount = (pt.questionIds || []).filter(id => existingQIds.has(id)).length;
  const isFirst = idx === 0;
  const isLast  = idx === total - 1;

  row.innerHTML = `
    <div class="point-row-left">
      <span class="point-order-badge">${pt.order}</span>
      <div class="point-row-info">
        <div class="point-row-name">${escapeHtml(pt.name)}</div>
        <div class="point-row-meta">🎯 ${qCount} 道题 &nbsp;·&nbsp; 码：${pt.code}</div>
      </div>
    </div>
    <div class="point-row-actions">
      <button class="btn btn-secondary btn-sm" data-action="up"
              ${isFirst ? 'disabled' : ''} title="上移">↑</button>
      <button class="btn btn-secondary btn-sm" data-action="down"
              ${isLast ? 'disabled' : ''} title="下移">↓</button>
      <button class="btn btn-secondary btn-sm" data-action="edit"   title="编辑">✏️ 编辑</button>
      <button class="btn btn-secondary btn-sm" data-action="copy"   title="复制">📋 复制</button>
      <button class="btn btn-secondary btn-sm" data-action="qr"     title="查看二维码">🔲 二维码</button>
      <button class="btn btn-danger    btn-sm" data-action="delete" title="删除">🗑️</button>
    </div>`;

  row.addEventListener('click', async e => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    if (action === 'up')     await handleMovePoint(pt.id, levelId, -1);
    if (action === 'down')   await handleMovePoint(pt.id, levelId,  1);
    if (action === 'edit')   showPointForm(levelId, pt.id);
    if (action === 'copy')   await handleCopyPoint(pt, levelId);
    if (action === 'qr')     showQrModal(pt);
    if (action === 'delete') await handleDeletePoint(pt, levelId);
  });

  return row;
}

// ── 上移/下移 ────────────────────────────────────────────

async function handleMovePoint(pointId, levelId, direction) {
  const points = await db.points
    .where('levelId').equals(levelId)
    .sortBy('order');

  const idx     = points.findIndex(p => p.id === pointId);
  const swapIdx = idx + direction;
  if (swapIdx < 0 || swapIdx >= points.length) return;

  const a = points[idx];
  const b = points[swapIdx];

  await db.transaction('rw', db.points, async () => {
    await db.points.update(a.id, { order: b.order });
    await db.points.update(b.id, { order: a.order });
  });

  renderPointList(levelId);
}

// ── 复制点位 ─────────────────────────────────────────────

/**
 * 深拷贝一个点位：新 ID、新 6 位码、order 追加到末尾
 * questionIds 保留（不改 usedCount，复制操作不算新绑定）
 */
async function handleCopyPoint(pt, levelId) {
  const allCodes = await db.points.orderBy('code').keys();
  let code;
  do { code = generateSixDigitCode(); }
  while (!isCodeUnique(code, [...allCodes]));

  const existing = await db.points.where('levelId').equals(levelId).sortBy('order');
  const order    = existing.length > 0 ? existing[existing.length - 1].order + 1 : 1;

  await db.points.add({
    ...pt,
    id:    generateId('pt'),
    name:  pt.name + '（副本）',
    order,
    code,
  });

  renderPointList(levelId);
}

// ── 删除点位 ─────────────────────────────────────────────

async function handleDeletePoint(pt, levelId) {
  const ok = confirm(`确定删除点位「${pt.name}」吗？\n此操作无法撤销。`);
  if (!ok) return;
  await db.points.delete(pt.id);
  renderPointList(levelId);
}

// ── 二维码弹窗 ───────────────────────────────────────────

/**
 * 用 canvas 绘制二维码并显示在弹窗里，同时准备下载链接
 * 依赖 window.qrcode（qrcode-generator@2.0.4 CDN，在 admin/index.html 加载）
 */
function showQrModal(pt) {
  if (!window.qrcode) {
    alert('二维码库尚未加载，请检查网络连接后刷新页面。');
    return;
  }

  const dataUrl = generateQrDataUrl(pt.code);

  document.getElementById('qr-point-name').textContent = pt.name;
  document.getElementById('qr-code-number').textContent = pt.code;

  const display = document.getElementById('qr-code-display');
  display.innerHTML = '';
  const img = document.createElement('img');
  img.src    = dataUrl;
  img.alt    = `QR Code for ${pt.code}`;
  img.style.cssText = 'width:180px;height:180px;image-rendering:pixelated';
  display.appendChild(img);

  const dlBtn = document.getElementById('btn-qr-download');
  dlBtn.href     = dataUrl;
  dlBtn.download = `${pt.name}-${pt.code}.png`;

  document.getElementById('qr-modal').classList.remove('hidden');
}

function closeQrModal() {
  document.getElementById('qr-modal').classList.add('hidden');
}

/**
 * 用 canvas 把 6 位数字码渲染成 QR Code PNG 的 dataURL
 * @param {string} code - 6 位数字字符串
 * @returns {string} PNG data URL
 */
function generateQrDataUrl(code) {
  const qr = window.qrcode(0, 'M');
  qr.addData(code);
  qr.make();

  const cellSize    = 6;   // 每个模块的像素大小
  const margin      = 16;  // 四周留白
  const moduleCount = qr.getModuleCount();
  const canvasSize  = moduleCount * cellSize + margin * 2;

  const canvas = document.createElement('canvas');
  canvas.width  = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  // 白底
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // 黑色模块
  ctx.fillStyle = '#000000';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          margin + col * cellSize,
          margin + row * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  return canvas.toDataURL('image/png');
}

// ── 工具 ─────────────────────────────────────────────────

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
