/**
 * shared/db/play-db.js
 * 游戏端 IndexedDB 实例（对应 PRD v1.7 §6.0 play 端表结构）
 *
 * 使用方式（在 play/ 页面中）：
 *   <script src="dexie CDN"></script>       ← 先加载 Dexie 全局变量
 *   <script type="module">
 *     import db from '../../shared/db/play-db.js';
 *     const sessions = await db.sessions.toArray();
 *   </script>
 *
 * ⚠️ 只能在 play/ 路径下使用，否则 assertDbContext 会立即抛错。
 */

import { PLAY_DB_NAME, assertDbContext } from './db-config.js';

// 运行时拦截：非 play/ 路径导入此模块即报错
assertDbContext(PLAY_DB_NAME);

// Dexie 由页面的 CDN <script> 标签加载，模块加载时全局已可用
const db = new window.Dexie(PLAY_DB_NAME);

db.version(1).stores({
  levels:    'id, name',
  points:    'id, levelId, code',
  questions: 'id',
  sessions:  'id, levelId, status, startedAt',
  photos:    'id, type, ownerId',
});

export default db;
