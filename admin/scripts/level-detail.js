/**
 * admin/scripts/level-detail.js
 * L1 详情视图：显示探险基本信息 + L2 点位列表 + 占位打印工具
 * 只负责显示，编辑/复制/删除按钮由 level-form.js 绑定事件
 */

import db from '../../shared/db/admin-db.js';
import { initPointList, renderPointList } from './point-list.js';

/**
 * 初始化详情面板（绑定「返回」按钮 + 初始化点位列表）
 * 由 level-form.js 的 initLevelsPage() 调用
 */
export function initLevelDetail() {
  document.getElementById('btn-back-to-list')
    .addEventListener('click', hideLevelDetail);

  // 打印二维码：在新标签页打开打印预览页
  document.getElementById('btn-print-qr').addEventListener('click', () => {
    const levelId = document.getElementById('levels-detail-panel').dataset.levelId;
    if (levelId) window.open(`pages/print-qr.html?levelId=${levelId}`, '_blank');
  });

  // 打印应急小抄：在新标签页打开应急小抄页
  document.getElementById('btn-print-cheatsheet').addEventListener('click', () => {
    const levelId = document.getElementById('levels-detail-panel').dataset.levelId;
    if (levelId) window.open(`pages/print-cheatsheet.html?levelId=${levelId}`, '_blank');
  });

  initPointList();
}

/**
 * 显示指定探险的详情，隐藏列表
 * @param {string} levelId
 */
export async function showLevelDetail(levelId) {
  const level = await db.levels.get(levelId);
  if (!level) return;

  // 把 levelId 存在面板上，供 level-form.js 和 point-list.js 读取
  const panel = document.getElementById('levels-detail-panel');
  panel.dataset.levelId = levelId;

  document.getElementById('detail-level-name').textContent = level.name;

  await renderDetailInfo(level);
  await renderPointList(levelId);

  // 切换面板（point 面板也要隐藏，防止从 point 编辑保存后刷新详情时错乱）
  document.getElementById('levels-list-panel').style.display  = 'none';
  document.getElementById('levels-point-panel').style.display = 'none';
  panel.style.display = '';
}

/**
 * 隐藏详情，返回列表
 */
export function hideLevelDetail() {
  document.getElementById('levels-detail-panel').style.display = 'none';
  document.getElementById('levels-list-panel').style.display   = '';
}

/**
 * 填充基本信息网格
 * @param {import('../../shared/models/types.js').Level} level
 */
async function renderDetailInfo(level) {
  const pointCount = await db.points.where('levelId').equals(level.id).count();

  const fmt = ts => new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  document.getElementById('detail-desc-text').textContent =
    level.description || '（暂无简介）';

  document.getElementById('detail-info-grid').innerHTML = `
    <div class="detail-meta-item">
      <span class="detail-meta-label">📍 点位数</span>
      <span class="detail-meta-value">${pointCount} 个</span>
    </div>
    <div class="detail-meta-item">
      <span class="detail-meta-label">👥 推荐人数</span>
      <span class="detail-meta-value">${level.recommendedPlayerCount || 1} 人</span>
    </div>
    <div class="detail-meta-item">
      <span class="detail-meta-label">🎂 推荐年龄</span>
      <span class="detail-meta-value">${level.recommendedAge || '7-9'} 岁</span>
    </div>
    <div class="detail-meta-item">
      <span class="detail-meta-label">🎨 主题色</span>
      <span class="detail-meta-value" style="display:flex;align-items:center;gap:7px">
        <span style="width:18px;height:18px;border-radius:50%;display:inline-block;
                     background:${level.themeColor || '#4A90E2'};flex-shrink:0"></span>
        ${level.themeColor || '#4A90E2'}
      </span>
    </div>
    <div class="detail-meta-item">
      <span class="detail-meta-label">📅 创建时间</span>
      <span class="detail-meta-value">${fmt(level.createdAt)}</span>
    </div>
    <div class="detail-meta-item">
      <span class="detail-meta-label">✏️ 最近编辑</span>
      <span class="detail-meta-value">${fmt(level.updatedAt)}</span>
    </div>`;
}
