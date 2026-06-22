/**
 * play/scripts/map-overlay.js
 * 纯渲染模块：在给定容器内绘制探险地图（底图 + 点位标记 + 可选动画）。
 * 不连数据库，不依赖特定页面，只操作传入的 DOM 元素。
 *
 * 导出：
 *   renderMapOverlay(container, level, points, stateMap, opts)  — 渲染地图
 *   injectMapAnimStyles()                                        — 注入动画 CSS（每页调一次）
 */

// 字号三档（对应 admin 端配置的 small / medium / large）
const FONT_SIZE_MAP = { small: 12, medium: 15, large: 19 };

/**
 * 清空 container 并渲染地图底图 + 有状态的点位标记。
 *
 * @param {HTMLElement} container  地图放置的容器（position:relative；naturalHeight 时高度由图片自决）
 * @param {object}      level      Level 对象（mapImage / mapFontSize / mapNameColor / mapNameColorCompleted）
 * @param {object[]}    points     所有点位数组（含 id / mapX / mapY / name）
 * @param {object}      stateMap   { [pointId]: 'undiscovered' | 'discovered' | 'completed' }
 * @param {object}      [opts]     可选：{ animatePointId, animateType: 'reveal'|'stamp', naturalHeight: bool }
 */
export function renderMapOverlay(container, level, points, stateMap, opts = {}) {
  container.innerHTML = '';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  // ── 底图 ──────────────────────────────────────────────────────
  const img = document.createElement('img');
  img.alt = '探险地图';
  // naturalHeight:true → 高度随图片真实比例（内嵌使用，无黑边）
  // 默认模式         → 撑满容器固定高度（全屏覆盖层使用）
  img.style.cssText = opts.naturalHeight
    ? 'width:100%;height:auto;display:block;'
    : 'width:100%;height:100%;object-fit:contain;display:block;';
  container.appendChild(img);

  const fontSize      = FONT_SIZE_MAP[level.mapFontSize] || 15;
  const nameColor     = level.mapNameColor || '#ffffff';
  const nameColorDone = level.mapNameColorCompleted || '#FFD700';

  // ── 放置点位标记 ──────────────────────────────────────────────
  // naturalHeight 模式下，容器高度由图片决定。图片未加载时 container.height=0，
  // 此时 top:N% 全部解析为 0px，标记叠在顶部被 overflow:hidden 裁掉。
  // 必须等 img.onload 之后再插入标记，才能拿到正确的容器高度。
  function placeMarkers() {
    points.forEach((pt) => {
      if (pt.mapX == null || pt.mapY == null) return; // 未设坐标，跳过

      const state = stateMap[pt.id] || 'undiscovered';
      if (state === 'undiscovered') return;

      const marker = buildMarker(pt, state, fontSize, nameColor, nameColorDone);

      // 是否需要播动画
      if (opts.animatePointId === pt.id) {
        if (opts.animateType === 'reveal') marker.classList.add('map-anim-reveal');
        else if (opts.animateType === 'stamp') marker.classList.add('map-anim-stamp');
      }

      container.appendChild(marker);
    });
  }

  if (opts.naturalHeight) {
    // 先注册 onload，再赋 src——避免 base64 图片同步触发 load 时回调还没挂上
    img.onload = placeMarkers;
    img.src = level.mapImage;
  } else {
    // 固定高度容器：同步放置即可（容器高度已由调用方写死）
    img.src = level.mapImage;
    placeMarkers();
  }
}

/**
 * 构造单个点位标记 div（图标 + 名字标签）。
 */
function buildMarker(pt, state, fontSize, nameColor, nameColorDone) {
  const marker = document.createElement('div');
  // transform: translate(-50%, -100%) 让标记的底部中心对齐坐标点
  // mapX/mapY 以 0~1 小数存储（admin 端 clamp01），渲染时转成百分比
  marker.style.cssText = [
    'position:absolute',
    `left:${pt.mapX * 100}%`,
    `top:${pt.mapY * 100}%`,
    'transform:translate(-50%,-100%)',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'gap:3px',
    'pointer-events:none',
  ].join(';');

  if (state === 'discovered') {
    // 实心白圆（深色描边）：在亮色地图和深色地图上都清晰可见
    const circle = document.createElement('div');
    circle.style.cssText = [
      'width:22px', 'height:22px',
      'border-radius:50%',
      'background:rgba(255,255,255,0.92)',
      'border:2.5px solid rgba(0,0,0,0.50)',
      'box-shadow:0 0 8px rgba(0,0,0,0.5)',
    ].join(';');
    marker.appendChild(circle);
    marker.appendChild(makeLabel(pt.name, fontSize, nameColor));

  } else if (state === 'completed') {
    // 红色五角星印章（SVG）+ 名字变金色
    marker.appendChild(makeStarSvg());
    marker.appendChild(makeLabel(pt.name, fontSize, nameColorDone));
  }

  return marker;
}

/**
 * 生成点位名字标签（黑色阴影确保在任何底图上都清晰）。
 */
function makeLabel(name, fontSize, color) {
  const label = document.createElement('span');
  label.textContent = name;
  label.style.cssText = [
    `font-size:${fontSize}px`,
    `color:${color}`,
    'font-weight:700',
    'text-shadow:0 1px 4px rgba(0,0,0,0.8)',
    'white-space:nowrap',
    'font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
  ].join(';');
  return label;
}

/**
 * 生成红色五角星 SVG（内联 SVG，旋转 -15° 模拟印章感）。
 */
function makeStarSvg() {
  const NS  = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width',   '28');
  svg.setAttribute('height',  '28');
  // 旋转挂在 SVG 本身（不影响父 marker div 的动画 transform）
  svg.style.cssText = [
    'transform:rotate(-15deg)',
    'filter:drop-shadow(0 1px 4px rgba(0,0,0,0.6))',
    'flex-shrink:0',
  ].join(';');

  const poly = document.createElementNS(NS, 'polygon');
  // 24×24 标准五角星顶点
  poly.setAttribute('points',
    '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26');
  poly.setAttribute('fill',         '#E74C3C');
  poly.setAttribute('stroke',       '#C0392B');
  poly.setAttribute('stroke-width', '0.5');
  svg.appendChild(poly);
  return svg;
}

/**
 * 注入动画 keyframes CSS（每页只注入一次，重复调用安全）。
 * 须在 renderMapOverlay 之前或同时调用。
 */
export function injectMapAnimStyles() {
  if (document.getElementById('map-overlay-styles')) return; // 防重复注入
  const style = document.createElement('style');
  style.id = 'map-overlay-styles';
  style.textContent = `
    /* 浮现：空心圆+名字从透明淡入并弹一下（约 0.5s）*/
    @keyframes mapReveal {
      0%   { opacity:0; transform:translate(-50%,-100%) scale(0.5); }
      65%  { opacity:1; transform:translate(-50%,-100%) scale(1.1); }
      100% { opacity:1; transform:translate(-50%,-100%) scale(1); }
    }
    /* 盖章：五角星从上方"咚"砸下 + 落点轻微震动（约 0.8s）*/
    @keyframes mapStamp {
      0%   { opacity:0; transform:translate(-50%,-100%) scale(0.1); }
      45%  { opacity:1; transform:translate(-50%,-100%) scale(1.3); }
      60%  {            transform:translate(-50%,-97%)  scale(0.88); }
      72%  {            transform:translate(-50%,-102%) scale(1.05); }
      84%  {            transform:translate(-50%,-99%)  scale(0.98); }
      100% { opacity:1; transform:translate(-50%,-100%) scale(1); }
    }
    .map-anim-reveal { animation: mapReveal 0.5s ease-out forwards; }
    .map-anim-stamp  { animation: mapStamp  0.8s ease-out forwards; }
  `;
  document.head.appendChild(style);
}
