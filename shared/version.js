/**
 * shared/version.js
 * 全局版本标识 —— 每次推送新版时手动更新 BUILD_TAG。
 *
 * 用途：设置页显示当前实际运行的代码版本。
 * 因为本文件会被 Service Worker 缓存，所以：
 *   - Safari 直接打开 → 通常显示最新 BUILD_TAG
 *   - PWA 主屏幕图标 → 可能显示上一次缓存的旧 BUILD_TAG
 * 两者对比即可判断「主屏幕图标是否还在跑旧版本」。
 */

export const APP_VERSION = 'V1';

// 推送标识：格式「任务号 · 日期」，每次推 GitHub 前更新这一行
export const BUILD_TAG = 'V1-15c-坐标锚点对齐 · 2026-06-22';
