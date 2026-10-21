/**
 * 最近使用菜单（按用户隔离，存 localStorage）
 */
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH, WHITE_LIST } from '@/config/setting';

export const RECENT_MENU_STORE_NAME = 'spd-recent-menus';
export const RECENT_MENU_MAX = 12;
/** 与 layout / 首页同步用的事件名 */
export const RECENT_MENUS_CHANGED = 'recent-menus-changed';

const EXCLUDE_PATHS = new Set([
  LAYOUT_PATH,
  HOME_PATH,
  REDIRECT_PATH,
  '/login',
  '/forget',
  '/404',
  '/403',
  '/__recent_menus__'
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

function saveUserList(userInfo, list) {
  const all = readAll();
  all[getUserKey(userInfo)] = list;
  writeAll(all);
  return list;
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
 * 展平叶子菜单（可选添加）
 */
export function flattenLeafMenus(menus, result = []) {
  if (!menus?.length) {
    return result;
  }
  menus.forEach((item) => {
    if (EXCLUDE_PATHS.has(item.path) || item.path?.startsWith('/__')) {
      return;
    }
    if (item.children?.length) {
      flattenLeafMenus(item.children, result);
      return;
    }
    const title = item.meta?.title || item.title;
    if (!title || !item.path) {
      return;
    }
    result.push({
      path: item.path,
      title,
      icon: item.meta?.icon || item.icon || ''
    });
  });
  return result;
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
 * 手动添加菜单到最近使用
 * @returns {{ list: Array, ok: boolean, message?: string }}
 */
export function addRecentMenu(item, userInfo) {
  if (!item?.path || !item?.title) {
    return { list: getRecentMenus(userInfo), ok: false, message: '菜单无效' };
  }
  if (EXCLUDE_PATHS.has(item.path)) {
    return {
      list: getRecentMenus(userInfo),
      ok: false,
      message: '该菜单不可添加'
    };
  }
  const prev = getRecentMenus(userInfo);
  if (prev.some((m) => m.path === item.path)) {
    return { list: prev, ok: false, message: '已在最近使用中' };
  }
  if (prev.length >= RECENT_MENU_MAX) {
    return {
      list: prev,
      ok: false,
      message: `最多保留 ${RECENT_MENU_MAX} 个，请先移除再添加`
    };
  }
  const next = [
    {
      path: item.path,
      title: item.title,
      icon: item.icon || '',
      time: Date.now(),
      pinned: true
    },
    ...prev
  ];
  return { list: saveUserList(userInfo, next), ok: true };
}

/**
 * 从最近使用中移除
 */
export function removeRecentMenu(path, userInfo) {
  const prev = getRecentMenus(userInfo);
  if (!path) {
    return prev;
  }
  const next = prev.filter((m) => m.path !== path);
  return saveUserList(userInfo, next);
}

/**
 * 访问页面时自动记录（已存在则提到最前；手动添加的 pinned 仍保留）
 * @returns {Array}
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
  const matched = findMenuByPath(path, menus);
  const title =
    route.meta?.title || matched?.meta?.title || matched?.title || '';
  if (!title || matched?.children?.length) {
    return getRecentMenus(userInfo);
  }
  const icon = route.meta?.icon || matched?.meta?.icon || matched?.icon || '';
  const prev = getRecentMenus(userInfo);
  const existed = prev.find((m) => m.path === path);
  const item = {
    path,
    title,
    icon,
    time: Date.now(),
    pinned: !!existed?.pinned
  };
  const next = [item, ...prev.filter((m) => m.path !== path)].slice(
    0,
    RECENT_MENU_MAX
  );
  return saveUserList(userInfo, next);
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
