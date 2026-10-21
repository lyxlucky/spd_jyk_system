/**
 * 最近使用菜单（按用户隔离，存 localStorage）
 */
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH, WHITE_LIST } from '@/config/setting';

export const RECENT_MENU_STORE_NAME = 'spd-recent-menus';
export const RECENT_MENU_MAX = 8;

const EXCLUDE_PATHS = new Set([
  LAYOUT_PATH,
  HOME_PATH,
  REDIRECT_PATH,
  '/login',
  '/forget',
  '/404',
  '/403'
]);

function getUserKey(userInfo) {
  const id =
    userInfo?.User_Code ||
    userInfo?.user_code ||
    userInfo?.UserCode ||
    userInfo?.LoginName ||
    userInfo?.loginName ||
    'anonymous';
  return String(id);
}

function readAll() {
  try {
    const raw = localStorage.getItem(RECENT_MENU_STORE_NAME);
    if (!raw) {
      return {};
    }
    const data = JSON.parse(raw);
    return typeof data === 'object' && data !== null ? data : {};
  } catch (e) {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(RECENT_MENU_STORE_NAME, JSON.stringify(data));
}

/**
 * 从菜单树中按 path 查找菜单项
 */
export function findMenuByPath(path, menus) {
  if (!path || !menus?.length) {
    return null;
  }
  for (const item of menus) {
    if (item.path === path) {
      return item;
    }
    const child = findMenuByPath(path, item.children);
    if (child) {
      return child;
    }
  }
  return null;
}

/**
 * 读取当前用户最近使用菜单
 */
export function getRecentMenus(userInfo) {
  const all = readAll();
  const list = all[getUserKey(userInfo)];
  return Array.isArray(list) ? list : [];
}

/**
 * 记录一次菜单访问
 * @returns {Array} 更新后的列表
 */
export function pushRecentMenu(route, userInfo, menus) {
  if (!route?.path) {
    return getRecentMenus(userInfo);
  }
  const path = route.path;
  if (
    EXCLUDE_PATHS.has(path) ||
    WHITE_LIST.includes(path) ||
    path.includes(REDIRECT_PATH)
  ) {
    return getRecentMenus(userInfo);
  }
  // 仅记录真实叶子菜单，目录/无标题不记
  const matched = findMenuByPath(path, menus);
  const title =
    route.meta?.title || matched?.meta?.title || matched?.title || '';
  if (!title || matched?.children?.length) {
    return getRecentMenus(userInfo);
  }
  const icon = route.meta?.icon || matched?.meta?.icon || matched?.icon || '';
  const item = { path, title, icon, time: Date.now() };
  const key = getUserKey(userInfo);
  const all = readAll();
  const prev = Array.isArray(all[key]) ? all[key] : [];
  const next = [item, ...prev.filter((m) => m.path !== path)].slice(
    0,
    RECENT_MENU_MAX
  );
  all[key] = next;
  writeAll(all);
  return next;
}

/**
 * 组装侧栏顶部「最近使用」虚拟菜单组
 */
export function buildRecentMenuGroup(recentList) {
  if (!recentList?.length) {
    return null;
  }
  return {
    path: '/__recent_menus__',
    meta: {
      title: '最近使用',
      icon: 'el-icon-time',
      // 仅展示，不参与路由注册
      hide: false
    },
    children: recentList.map((m) => ({
      path: m.path,
      meta: {
        title: m.title,
        icon: m.icon || 'el-icon-document'
      }
    }))
  };
}
