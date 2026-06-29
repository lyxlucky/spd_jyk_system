/** PERMISSION.TYPE：0 菜单路由，1 按钮权限 */
export function isButtonPermission(item) {
  if (!item) return false;
  return item.TYPE === 1 || item.TYPE === '1';
}

/** 是否应参与菜单/路由树构建（按钮权限排除） */
export function isMenuRoutePermission(item) {
  return item && !isButtonPermission(item);
}
