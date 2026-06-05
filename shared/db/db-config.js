/**
 * shared/db/db-config.js
 * 数据库名称常量 + 运行时拦截（对应 PRD v1.7 §6.0 + CLAUDE.md §4.1）
 *
 * ⚠️ 核心安全约定：
 *   admin 和 play 部署在同一域名（GitHub Pages），同名数据库会共享数据。
 *   两端必须用不同数据库名，并在打开数据库前调用 assertDbContext() 检查路径。
 */

// 编辑端数据库名
export const ADMIN_DB_NAME = 'treasure-hunt-admin-db';

// 游戏端数据库名
export const PLAY_DB_NAME = 'treasure-hunt-play-db';

/**
 * 运行时拦截：确保当前路径与数据库名匹配，防止跨端数据污染。
 * 在每次打开 Dexie 实例之前调用。
 *
 * @param {string} dbName       - 要打开的数据库名
 * @param {string|null} _pathOverride - 仅用于测试，传入模拟路径；生产代码不传此参数
 * @throws {Error} 路径与数据库名不匹配时抛出
 */
export function assertDbContext(dbName, _pathOverride = null) {
  const path = _pathOverride !== null ? _pathOverride : location.pathname;

  const isAdminPath = path.includes('/admin/');
  const isPlayPath  = path.includes('/play/');

  if (isAdminPath && dbName !== ADMIN_DB_NAME) {
    throw new Error(`[违反物理隔离] admin 路径不允许访问 ${dbName}`);
  }
  if (isPlayPath && dbName !== PLAY_DB_NAME) {
    throw new Error(`[违反物理隔离] play 路径不允许访问 ${dbName}`);
  }
}
