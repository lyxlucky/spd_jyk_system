/**
 * 菜单图标统一解析与兜底（侧边主/子菜单栏 + 主页九宫格 + 最近使用）
 *
 * 图标值来自 Oracle PRIMARY_ROUT.ICON / PERMISSION.ICON，经 /Commons/login 返回
 * result.permission_group[].icon。历史数据里既有 el-icon-* 类名，也有
 * src/assets/svg 下的 svg 文件名，而 ele-admin 的 ProMenus 默认只把它塞进
 * <i class>，svg 名会渲染成空白。
 *
 * 关键：补齐必须发生在「数据入口」，即 fetchUserInfo 拿到 permission_group 之后、
 * commit 之前。主页读 state.info.permission_group，侧栏读格式化后的 menus，
 * 两者同源，入口规范化一次即可全端生效，不必逐个页面打补丁。
 */
const svgContext = require.context('../assets/svg', false, /\.svg$/);
const svgNames = new Set(
  svgContext.keys().map((key) => key.replace(/^\.\//, '').replace(/\.svg$/, ''))
);

/** 是否为本地 svg 图标名（渲染时走 <svg-icon>） */
export function isSvgIcon(name) {
  return typeof name === 'string' && svgNames.has(name);
}

/** 图标值能否被渲染：el-icon-* 类名或本地 svg 名 */
export function isValidIcon(name) {
  return (
    typeof name === 'string' && (/^el-icon[-_]/.test(name) || isSvgIcon(name))
  );
}

/** 标题稳定散列：同一菜单每次都拿到同一图标，不会因刷新而跳变 */
function stableIndex(text, size) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % size;
}

/**
 * 解析单个菜单图标。
 * 优先级：数据库 ICON > 精确映射(map) > 标题语义图标池(rules + pools) > 层级默认。
 * 返回 source 便于统计：db / map / pool / fallback。
 */
export function resolveMenuIcon(raw, { title = '', path = '', level = 0, config = {} }) {
  const {
    map = {},
    rules = [],
    pools = {},
    topIcon = 'el-icon-menu',
    subIcon = 'el-icon-document'
  } = config;

  const value = String(raw || '').trim();
  if (isValidIcon(value)) {
    return { icon: value, source: 'db' };
  }

  const exact = map[path] || map[title];
  if (isValidIcon(exact)) {
    return { icon: exact, source: 'map' };
  }

  const matched = rules.find((rule) => rule.test.test(title));
  const pool = (matched && pools[matched.pool]) || pools.common;
  if (Array.isArray(pool) && pool.length) {
    const picked = pool[stableIndex(title || path, pool.length)];
    if (isValidIcon(picked)) {
      return { icon: picked, source: 'pool' };
    }
  }

  const fallback = level === 0 ? topIcon : subIcon;
  return {
    icon: isValidIcon(fallback) ? fallback : 'el-icon-menu',
    source: 'fallback'
  };
}

/**
 * 扁平 permission_group：登录入口调用一次，覆盖 state.info / 主页 / 侧栏 / 最近使用。
 * 返回由前端补齐的菜单清单（source 非 db），供开发环境审阅与按需转精确映射。
 */
export function normalizePermissionIcons(list, config = {}) {
  const filled = [];
  (list || []).forEach((item) => {
    if (!item) {
      return;
    }
    const title = item.title || item.PERMISSION_NAME || '';
    const path = item.component || item.path || item.PRIMARY_ROUT_URL || '';
    const level = item.PID == null || item.PID === '' ? 0 : 1;
    const result = resolveMenuIcon(item.icon, { title, path, level, config });
    item.icon = result.icon;
    if (result.source !== 'db') {
      filled.push({ title, path, level, icon: result.icon, source: result.source });
    }
  });
  return filled;
}

/**
 * 树形 menus：二级防御，覆盖 USER_MENUS 静态菜单等其它入口。
 * 主菜单栏与子菜单栏共用同一份 menus，补齐一次两侧同时生效。
 */
export function ensureMenuIcons(list, config = {}) {
  const filled = [];
  const walk = (nodes, level) => {
    (nodes || []).forEach((item) => {
      if (!item) {
        return;
      }
      item.meta = item.meta || {};
      const title = item.meta.title || '';
      const path = item.path || '';
      const result = resolveMenuIcon(item.meta.icon, { title, path, level, config });
      item.meta.icon = result.icon;
      if (result.source !== 'db') {
        filled.push({ title, path, level, icon: result.icon, source: result.source });
      }
      walk(item.children, level + 1);
    });
  };
  walk(list, 0);
  return filled;
}
