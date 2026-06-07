/**
 * admin/scripts/router.js
 * 极简 hash 路由：监听 URL hash 变化，把对应页面内容加载到主区域
 *
 * 路由表：
 *   #/levels          → pages/levels.html
 *   #/questions       → pages/questions.html
 *   #/import-export   → pages/import-export.html
 *
 * 默认：跳转到 #/levels
 */

// 路由配置：hash 路径 → 页面文件路径（相对 admin/）
const ROUTES = {
  '/levels':        'pages/levels.html',
  '/questions':     'pages/questions.html',
  '/import-export': 'pages/import-export.html',
};

const DEFAULT_ROUTE = '#/levels';

// ── 核心函数 ───────────────────────────────────────────────

/**
 * 根据当前 hash 加载对应页面内容到 #main-content
 */
async function navigate() {
  // 取 hash，去掉开头的 '#'，如 '#/levels' → '/levels'
  const hash = location.hash.replace('#', '') || '/levels';
  const pagePath = ROUTES[hash];

  const mainContent = document.getElementById('main-content');

  if (!pagePath) {
    mainContent.innerHTML = `
      <div class="placeholder-page">
        <div class="placeholder-icon">🔍</div>
        <h2>页面不存在</h2>
        <p>路径 ${hash} 未找到，<a href="#/levels" style="color:var(--color-primary)">返回探险管理</a></p>
      </div>`;
    updateActiveNav(hash);
    return;
  }

  // 显示加载状态
  mainContent.innerHTML = `<div class="placeholder-page"><div class="placeholder-icon">⏳</div><p>加载中...</p></div>`;

  try {
    const response = await fetch(pagePath, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    mainContent.innerHTML = html;
    // innerHTML 注入的 <script> 不会自动执行，需要手动替换触发
    executeFragmentScripts(mainContent);
  } catch (err) {
    mainContent.innerHTML = `
      <div class="placeholder-page">
        <div class="placeholder-icon">⚠️</div>
        <h2>页面加载失败</h2>
        <p>${err.message}</p>
      </div>`;
  }

  updateActiveNav(hash);
  closeSidebar();
}

/**
 * 更新左侧导航的高亮状态
 */
function updateActiveNav(currentHash) {
  document.querySelectorAll('.nav-item a').forEach(link => {
    const linkHash = new URL(link.href, location.href).hash.replace('#', '');
    link.classList.toggle('active', linkHash === currentHash);
  });
}

// ── Fragment 脚本重新执行 ─────────────────────────────────

/**
 * innerHTML 设置后，里面的 <script> 不会自动执行。
 * 这里把每个 <script> 换成新节点，触发浏览器执行。
 */
function executeFragmentScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.type) newScript.type = oldScript.type;
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });
}

// ── 汉堡菜单逻辑 ───────────────────────────────────────────

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ── 初始化 ─────────────────────────────────────────────────

export function initRouter() {
  // 监听 hash 变化
  window.addEventListener('hashchange', navigate);

  // 汉堡菜单按钮
  document.getElementById('hamburger-btn').addEventListener('click', openSidebar);

  // 点击遮罩关闭菜单
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

  // 初次加载：若没有 hash 则跳转到默认路由
  if (!location.hash || location.hash === '#') {
    location.hash = DEFAULT_ROUTE;
  } else {
    navigate();
  }
}
