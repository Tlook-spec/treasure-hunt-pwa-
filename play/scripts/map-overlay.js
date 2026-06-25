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
  container.appendChild(img);

  const fontSize      = FONT_SIZE_MAP[level.mapFontSize] || 15;
  const nameColor     = level.mapNameColor || '#ffffff';
  const nameColorDone = level.mapNameColorCompleted || '#FFD700';

  // ── 放置点位标记 ──────────────────────────────────────────────
  // naturalHeight 模式下，容器高度由图片决定。图片未加载时 container.height=0，
  // 此时 top:N% 全部解析为 0px，标记叠在顶部被 overflow:hidden 裁掉。
  // 必须等 img.onload 之后再插入标记，才能拿到正确的容器高度。
  function placeMarkers() {
    points.forEach((pt, i) => {
      if (pt.mapX == null || pt.mapY == null) return; // 未设坐标，跳过

      const state = stateMap[pt.id] || 'undiscovered';
      // 未到的站点也显示（灰色圆 + 站点编号），不再隐藏

      const marker = buildMarker(pt, i + 1, state, fontSize, nameColor, nameColorDone);

      // 是否需要播动画
      if (opts.animatePointId === pt.id) {
        if (opts.animateType === 'reveal') marker.classList.add('map-anim-reveal');
        else if (opts.animateType === 'stamp') marker.classList.add('map-anim-stamp');
      }

      container.appendChild(marker);
    });
  }

  if (opts.naturalHeight) {
    // 内嵌模式：整张图等比缩进一屏内（max-height），确保底部点位的动画也在视口里。
    // 图片用 width/height:auto + max 约束 → 不变形、无黑边；
    // 容器收缩贴合图片实际显示尺寸（fit-content）→ 标记按百分比定位永远对齐，不错位。
    const maxH = opts.maxHeight || '55vh';
    img.style.cssText =
      `display:block;width:auto;height:auto;max-width:100%;max-height:${maxH};`;
    container.style.width    = '-webkit-fit-content'; // iOS Safari 前缀兜底
    container.style.width    = 'fit-content';
    container.style.maxWidth = '100%';
    container.style.marginLeft  = 'auto';  // 水平居中，保留调用方的上下 margin
    container.style.marginRight = 'auto';

    // 先注册 onload，再赋 src——避免 base64 图片同步触发 load 时回调还没挂上
    img.onload = placeMarkers;
    img.src = level.mapImage;
  } else {
    // 全屏覆盖层模式：撑满容器固定高度
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block;';
    img.src = level.mapImage;
    placeMarkers();
  }
}

/**
 * 构造单个点位标记 div（图标 + 名字标签）。
 *
 * @param {object} pt            点位
 * @param {number} stationNumber 站点编号（1 起，未到状态显示在灰圈里）
 * @param {string} state         'undiscovered' | 'discovered' | 'completed'
 */
function buildMarker(pt, stationNumber, state, fontSize, nameColor, nameColorDone) {
  const marker = document.createElement('div');
  // transform: translate(-50%, -50%) 让【图标中心】对齐坐标点
  //   —— 必须和 admin 标记编辑器一致（admin 的 .marker-dot 也是 translate(-50%,-50%)
  //   圆心对齐，名字 absolute 挂圆下方不影响圆心定位）。否则两端同一坐标显示位置不同。
  // mapX/mapY 以 0~1 小数存储（admin 端 clamp01），渲染时转成百分比。
  marker.style.cssText = [
    'position:absolute',
    `left:${pt.mapX * 100}%`,
    `top:${pt.mapY * 100}%`,
    'transform:translate(-50%,-50%)',
    'pointer-events:none',
  ].join(';');

  if (state === 'completed') {
    // 已通关：绿色圆 + 白色对勾 + 名字变金色
    marker.appendChild(makeCheckCircle());
    marker.appendChild(makeLabel(pt.name, fontSize, nameColorDone));

  } else if (state === 'discovered') {
    // 答题中：红色圆 + 白色定位图钉 + 名字
    marker.appendChild(makePinCircle());
    marker.appendChild(makeLabel(pt.name, fontSize, nameColor));

  } else {
    // 未到：只显示灰色圆 + 站点编号（不显示站名，避免剧透下一站）
    marker.appendChild(makeNumberCircle(stationNumber));
  }

  return marker;
}

/** 圆形图标基础样式（三态共用，30px 圆 + 白描边 + 投影，居中放内容）。 */
function makeCircleBase(bgColor) {
  const circle = document.createElement('div');
  circle.style.cssText = [
    'width:30px', 'height:30px',
    'border-radius:50%',
    `background:${bgColor}`,
    'border:2.5px solid #fff',
    'box-shadow:0 1px 5px rgba(0,0,0,0.45)',
    'display:flex', 'align-items:center', 'justify-content:center',
    'box-sizing:border-box',
  ].join(';');
  return circle;
}

/** 未到：灰色圆 + 站点编号数字。 */
function makeNumberCircle(num) {
  const circle = makeCircleBase('rgba(150,150,150,0.85)');
  const span = document.createElement('span');
  span.textContent = String(num);
  span.style.cssText = 'color:#fff;font-size:15px;font-weight:700;line-height:1;';
  circle.appendChild(span);
  return circle;
}

/** 答题中：红色圆 + 白色定位图钉 SVG。 */
function makePinCircle() {
  const circle = makeCircleBase('#E74C3C');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '17');
  svg.setAttribute('height', '17');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#fff');
  svg.setAttribute('stroke-width', '2.4');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z');
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('cx', '12'); dot.setAttribute('cy', '10'); dot.setAttribute('r', '3');
  svg.appendChild(path); svg.appendChild(dot);
  circle.appendChild(svg);
  return circle;
}

/** 已通关：绿色圆 + 白色对勾 SVG。 */
function makeCheckCircle() {
  const circle = makeCircleBase('#27AE60');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#fff');
  svg.setAttribute('stroke-width', '3.2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', 'M20 6 9 17l-5-5');
  svg.appendChild(path);
  circle.appendChild(svg);
  return circle;
}

/**
 * 生成点位名字标签（黑色阴影确保在任何底图上都清晰）。
 * absolute 挂在图标正下方，不参与图标的中心定位（与 admin 的 .marker-label 一致）。
 */
function makeLabel(name, fontSize, color, opacity = 1) {
  const label = document.createElement('span');
  label.textContent = name;
  label.style.cssText = [
    'position:absolute',
    'top:calc(100% + 3px)',
    'left:50%',
    'transform:translateX(-50%)',
    `font-size:${fontSize}px`,
    `color:${color}`,
    `opacity:${opacity}`,
    'font-weight:700',
    'text-shadow:0 1px 4px rgba(0,0,0,0.8)',
    'white-space:nowrap',
    'font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
  ].join(';');
  return label;
}

/**
 * 根据 session.pointRecords 计算每个点位的三态（纯函数，不访问 DB）。
 *
 * 判断依据（不依赖 currentPointIndex，完全由记录数据驱动）：
 *   - undiscovered：该点位无 pointRecord（还没扫码）
 *   - discovered  ：pointRecord 存在，但 questionResults 数量 < 该点位题数（答题中）
 *   - completed   ：pointRecord 存在，且 questionResults 数量 ≥ 该点位题数（已答完）
 *
 * @param {object}   session  GameSession 对象（需含 pointRecords 数组）
 * @param {object[]} points   点位数组（按 order 升序；需含 questionIds 字段）
 * @returns {object} { [pointId]: 'undiscovered'|'discovered'|'completed' }
 */
export function buildPointStateMap(session, points) {
  const stateMap = {};
  const records  = session.pointRecords || [];
  points.forEach((pt, i) => {
    const record = records[i];
    if (!record) {
      stateMap[pt.id] = 'undiscovered';
    } else {
      const answered = (record.questionResults || []).length;
      const total    = (pt.questionIds || []).length;
      stateMap[pt.id] = answered >= total ? 'completed' : 'discovered';
    }
  });
  return stateMap;
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
    /* 浮现：空心圆+名字从透明淡入并弹一下（约 0.5s）。
       transform 基准与 buildMarker 一致：translate(-50%,-50%) 图标中心对齐坐标点 */
    @keyframes mapReveal {
      0%   { opacity:0; transform:translate(-50%,-50%) scale(0.5); }
      65%  { opacity:1; transform:translate(-50%,-50%) scale(1.1); }
      100% { opacity:1; transform:translate(-50%,-50%) scale(1); }
    }
    /* 盖章：五角星从上方"咚"砸下 + 落点轻微震动（约 0.8s），围绕 -50% 抖 */
    @keyframes mapStamp {
      0%   { opacity:0; transform:translate(-50%,-50%) scale(0.1); }
      45%  { opacity:1; transform:translate(-50%,-50%) scale(1.3); }
      60%  {            transform:translate(-50%,-47%) scale(0.88); }
      72%  {            transform:translate(-50%,-52%) scale(1.05); }
      84%  {            transform:translate(-50%,-49%) scale(0.98); }
      100% { opacity:1; transform:translate(-50%,-50%) scale(1); }
    }
    .map-anim-reveal { animation: mapReveal 0.5s ease-out forwards; }
    .map-anim-stamp  { animation: mapStamp  0.8s ease-out forwards; }
  `;
  document.head.appendChild(style);
}
