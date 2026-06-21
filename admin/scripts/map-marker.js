/**
 * admin/scripts/map-marker.js
 * 探险地图标记编辑器
 * 功能：在手绘地图上点击放置 L2 坐标、拖动调整、点击删除、预览游戏效果、保存到 DB
 */

import db from '../../shared/db/admin-db.js';

// ── 模块状态 ────────────────────────────────────────────────
let levelId     = null;   // 当前探险 ID
let level       = null;   // Level 对象（含 mapImage / mapNameColor 等）
let points      = [];     // Point 数组（按 order 升序）
let markerPos   = {};     // { pointId: {x, y} | null }，工作副本，保存前不写 DB
let previewMode = false;  // false=编辑视图，true=游戏预览
let dragState   = null;   // 拖拽状态（见下方 handleMarkerMousedown）
let dragMoved   = false;  // 本次鼠标按下是否发生了拖拽位移
let ctxPointId  = null;   // 当前上下文菜单对应的点位 ID

// ── 入口 ────────────────────────────────────────────────────

async function init() {
  // 读取 URL 参数
  const params = new URLSearchParams(location.search);
  levelId = params.get('levelId');
  if (!levelId) { alert('缺少 levelId 参数'); window.close(); return; }

  // 加载探险数据
  level = await db.levels.get(levelId);
  if (!level || !level.mapImage) {
    alert('找不到该探险或尚未上传地图，请先在编辑端上传底图。');
    window.close();
    return;
  }

  // 触摸设备检测（iPad/手机）：显示提示横幅，禁用编辑交互
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.getElementById('touch-banner').style.display = 'block';
    document.querySelector('.map-panel').style.pointerEvents = 'none';
    document.getElementById('btn-save').disabled = true;
    document.getElementById('btn-clear-all').disabled = true;
  }

  // 加载点位（按 order 升序）
  points = await db.points.where('levelId').equals(levelId).sortBy('order');

  // 从 DB 初始化工作副本（保留已有坐标）
  markerPos = {};
  for (const pt of points) {
    markerPos[pt.id] = (pt.mapX !== null && pt.mapY !== null)
      ? { x: pt.mapX, y: pt.mapY }
      : null;
  }

  // 更新页面标题
  document.getElementById('page-title').textContent = `📍 地图标记 · ${level.name}`;

  // 加载地图图片
  document.getElementById('map-img').src = level.mapImage;

  bindEvents();
  renderMarkers();
  renderSidebar();
}

// ── 事件绑定 ────────────────────────────────────────────────

function bindEvents() {
  // 返回：优先关闭此标签，否则跳回编辑端首页
  document.getElementById('btn-back').addEventListener('click', () => {
    if (window.opener) window.close();
    else window.location.href = '../index.html#/levels';
  });

  // 预览模式切换
  document.getElementById('toggle-preview').addEventListener('change', (e) => {
    previewMode = e.target.checked;
    renderMarkers();
  });

  // 清空所有标记（二次确认）
  document.getElementById('btn-clear-all').addEventListener('click', handleClearAll);

  // 保存到 DB
  document.getElementById('btn-save').addEventListener('click', handleSave);

  // 地图点击：在空白处放置下一个未标注点位的标记
  document.getElementById('map-wrapper').addEventListener('click', handleMapClick);

  // 全局：拖拽移动
  document.addEventListener('mousemove', handleGlobalMousemove);

  // 全局：拖拽结束 或 判定为点击（弹上下文菜单）
  document.addEventListener('mouseup', handleGlobalMouseup);

  // 上下文菜单按钮
  document.getElementById('ctx-delete').addEventListener('click', handleCtxDelete);
  document.getElementById('ctx-cancel').addEventListener('click', closeContextMenu);

  // 点击菜单外部：关闭上下文菜单
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('context-menu');
    if (menu.style.display === 'block' && !menu.contains(e.target)) {
      closeContextMenu();
    }
  });
}

// ── 地图点击：放置下一个未标注点位 ─────────────────────────

function handleMapClick(e) {
  // 如果刚拖拽结束，这次 click 是 mouseup 后的冒泡，忽略
  if (dragMoved) { dragMoved = false; return; }
  // 点在已有标记上 → 由标记自己处理（mouseup 阶段）
  if (e.target.closest('.marker-dot')) return;

  // 找下一个还没有坐标的点位（order 最小）
  const next = points.find(pt => markerPos[pt.id] === null);
  if (!next) return; // 全部已标注，无需放置

  const wrapper = document.getElementById('map-wrapper');
  const rect    = wrapper.getBoundingClientRect();
  markerPos[next.id] = {
    x: clamp01((e.clientX - rect.left) / rect.width),
    y: clamp01((e.clientY - rect.top)  / rect.height),
  };

  renderMarkers();
  renderSidebar();
}

// ── 渲染标记圆点 ─────────────────────────────────────────────

function renderMarkers() {
  const wrapper = document.getElementById('map-wrapper');
  // 清除旧标记（保留 img）
  wrapper.querySelectorAll('.marker-dot').forEach(el => el.remove());

  for (const pt of points) {
    const pos = markerPos[pt.id];
    if (!pos) continue;
    wrapper.appendChild(buildMarkerDot(pt, pos));
  }
}

/**
 * 构建单个标记圆点 div
 * 编辑模式：蓝色实心圆 + 序号
 * 预览模式：空心圆 + 下方名字（颜色用 mapNameColor）
 */
function buildMarkerDot(pt, pos) {
  const dot = document.createElement('div');
  dot.className   = `marker-dot ${previewMode ? 'preview-mode' : 'edit-mode'}`;
  dot.dataset.pid = pt.id;
  dot.style.left  = `${pos.x * 100}%`;
  dot.style.top   = `${pos.y * 100}%`;

  if (previewMode) {
    // 空心圆：用 mapNameColor 上色
    const color = level.mapNameColor || '#2C3E50';
    dot.style.color       = color;
    dot.style.borderColor = color;
    // 点位名字标签（显示在圆下方）
    const label = document.createElement('span');
    label.className   = 'marker-label';
    label.textContent = pt.name;
    label.style.color = color;
    dot.appendChild(label);
  } else {
    // 实心圆：显示 order 序号
    dot.textContent = String(pt.order);
    // 非触摸设备绑定拖拽
    if (!window.matchMedia('(pointer: coarse)').matches) {
      dot.addEventListener('mousedown', (e) => handleMarkerMousedown(e, pt.id));
    }
  }

  return dot;
}

// ── 拖拽逻辑 ─────────────────────────────────────────────────

function handleMarkerMousedown(e, pointId) {
  if (previewMode) return;
  if (e.button !== 0) return;  // 只响应左键，忽略右键/中键
  e.preventDefault();  // 阻止文字选中
  e.stopPropagation(); // 阻止触发 wrapper click

  const pos = markerPos[pointId];
  dragState = {
    pointId,
    startX: e.clientX,
    startY: e.clientY,
    origX:  pos.x,
    origY:  pos.y,
  };
  dragMoved = false;
}

function handleGlobalMousemove(e) {
  if (!dragState) return;
  const dx = e.clientX - dragState.startX;
  const dy = e.clientY - dragState.startY;
  if (!dragMoved && Math.hypot(dx, dy) < 4) return; // 小于 4px 不算移动

  dragMoved = true;
  const wrapper = document.getElementById('map-wrapper');
  const rect    = wrapper.getBoundingClientRect();
  const newX    = clamp01(dragState.origX + dx / rect.width);
  const newY    = clamp01(dragState.origY + dy / rect.height);

  markerPos[dragState.pointId] = { x: newX, y: newY };

  // 只移动被拖拽的那一个圆点，不全量重渲
  const dot = wrapper.querySelector(`.marker-dot[data-pid="${dragState.pointId}"]`);
  if (dot) { dot.style.left = `${newX * 100}%`; dot.style.top = `${newY * 100}%`; }
}

function handleGlobalMouseup(e) {
  if (!dragState) return;
  const wasClick = !dragMoved; // 没有发生移动 → 这是一次"点击"
  const pid      = dragState.pointId;
  dragState      = null;

  if (wasClick) {
    // 判定为点击标记：显示上下文菜单（删除/取消）
    showContextMenu(e.clientX, e.clientY, pid);
    dragMoved = false; // 让后续 wrapper click 不被吞掉（对点击菜单无影响）
  } else {
    // 拖拽结束：刷新 sidebar（坐标已在 mousemove 中实时更新）
    renderSidebar();
    // dragMoved 保持 true，wrapper click 会吞掉本次冒泡
  }
}

// ── 上下文菜单 ───────────────────────────────────────────────

function showContextMenu(clientX, clientY, pointId) {
  ctxPointId = pointId;
  const menu = document.getElementById('context-menu');
  menu.style.left    = `${clientX + 4}px`;
  menu.style.top     = `${clientY + 4}px`;
  menu.style.display = 'block';
}

function closeContextMenu() {
  document.getElementById('context-menu').style.display = 'none';
  ctxPointId = null;
}

function handleCtxDelete() {
  if (!ctxPointId) return;
  markerPos[ctxPointId] = null; // 清除坐标
  closeContextMenu();
  renderMarkers();
  renderSidebar();
}

// ── 清空所有 ─────────────────────────────────────────────────

function handleClearAll() {
  const ok = confirm(`确定清空「${level.name}」的所有标记？\n（保存前仍可重新标注）`);
  if (!ok) return;
  for (const pt of points) markerPos[pt.id] = null;
  renderMarkers();
  renderSidebar();
}

// ── 保存到 DB ─────────────────────────────────────────────────

async function handleSave() {
  // 必须所有点位都已标注才能保存
  const unmarked = points.filter(pt => !markerPos[pt.id]);
  if (unmarked.length > 0) {
    const names = unmarked.map(p => `「${p.name}」`).join('、');
    alert(`还有 ${unmarked.length} 个点位没有标坐标，无法保存。\n未标：${names}`);
    return;
  }

  // 把工作副本写回 DB
  await db.transaction('rw', db.points, async () => {
    for (const pt of points) {
      const pos = markerPos[pt.id];
      await db.points.update(pt.id, { mapX: pos.x, mapY: pos.y });
    }
  });

  alert('✅ 坐标已保存！可以关闭此页面了。');
}

// ── 右侧状态面板 ─────────────────────────────────────────────

function renderSidebar() {
  const list         = document.getElementById('point-status-list');
  const markedCount  = points.filter(pt => markerPos[pt.id] !== null).length;
  const remaining    = points.length - markedCount;

  list.innerHTML = '';
  for (const pt of points) {
    const marked = markerPos[pt.id] !== null;
    const item = document.createElement('div');
    item.className = `status-item${marked ? ' marked' : ''}`;
    item.innerHTML = `
      <div class="status-badge">${pt.order}</div>
      <span class="status-name">${escHtml(pt.name)}</span>
      <span class="status-icon">${marked ? '✅' : '⬜'}</span>`;
    list.appendChild(item);
  }

  // 更新提示文字
  const hint = document.getElementById('click-hint');
  if (remaining === 0) {
    hint.textContent = `✅ 所有 ${points.length} 个点位已标注，可以点「保存」了！`;
  } else {
    const next = points.find(pt => !markerPos[pt.id]);
    hint.textContent =
      `点击地图空白处放置第 ${next?.order} 站「${next?.name}」的标记，还差 ${remaining} 个`;
  }
}

// ── 工具函数 ─────────────────────────────────────────────────

/** 把值限制在 [0, 1] 范围内 */
function clamp01(v) { return Math.max(0, Math.min(1, v)); }

/** 防 XSS：文本转义为 HTML 安全字符串 */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── 启动 ────────────────────────────────────────────────────
init();
