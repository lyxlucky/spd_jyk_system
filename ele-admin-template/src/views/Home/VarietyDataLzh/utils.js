/**
 * 按钮/导出权限（对齐旧系统 Permission_Url，如 export-VarietyDataLzhDc）
 */
export function hasExportPermission(store, key) {
  if (!key) {
    return true;
  }
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(key)) {
    return true;
  }
  const pg = store?.state?.user?.info?.permission_group || [];
  return pg.some((p) =>
    [p.component, p.path, p.title, p.Permission_Url, p.PERMISSION_URL].some((v) => v === key)
  );
}
