/**
 * shared/db/admin-db.js
 * 编辑端 IndexedDB 实例（对应 PRD v1.7 §6.0 admin 端表结构）
 *
 * 使用方式（在 admin/ 页面中）：
 *   <script src="dexie CDN"></script>       ← 先加载 Dexie 全局变量
 *   <script type="module">
 *     import db from '../../shared/db/admin-db.js';
 *     const levels = await db.levels.toArray();
 *   </script>
 *
 * ⚠️ 只能在 admin/ 路径下使用，否则 assertDbContext 会立即抛错。
 */

import { ADMIN_DB_NAME, assertDbContext } from './db-config.js';

// 运行时拦截：非 admin/ 路径导入此模块即报错
assertDbContext(ADMIN_DB_NAME);

// Dexie 由页面的 CDN <script> 标签加载，模块加载时全局已可用
const db = new window.Dexie(ADMIN_DB_NAME);

db.version(1).stores({
  levels:    'id, name, updatedAt',
  points:    'id, levelId, order, code',
  questions: 'id, subject, difficulty, usedCount',
});

export default db;
