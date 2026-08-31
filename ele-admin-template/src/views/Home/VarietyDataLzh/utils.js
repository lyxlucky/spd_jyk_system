/**
 * 按钮/导出权限（对齐旧系统 Permission_Url）
 * 市二(szse*)：缺权限时隐藏导出；其他院始终显示导出类按钮的「是否有码」判定可放宽为 true
 */
import { HOME_HP } from '@/config/setting';

export function hasExportPermission(store, key) {
  if (!key) return true;
  const isSzse = String(HOME_HP || '').startsWith('szse');
  if (!isSzse) {
    // 非市二：与老系统一致，export-permission 默认可见
    if (String(key).startsWith('export-')) return true;
  }
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(key)) return true;
  const pg = store?.state?.user?.info?.permission_group || [];
  return pg.some((p) =>
    [p.component, p.path, p.title, p.Permission_Url, p.PERMISSION_URL].some((v) => v === key)
  );
}

/** 是否禁用品种资料编辑（隐藏启用/删除等需编辑权限的按钮） */
export function isVarietyEditDisabled(store) {
  const pg = store?.state?.user?.info?.permission_group || [];
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes('禁用品种资料编辑')) return true;
  return pg.some((p) =>
    [p.component, p.path, p.title, p.Permission_Url, p.PERMISSION_URL].some(
      (v) => v === '禁用品种资料编辑'
    )
  );
}

/** CONFIG_TYPE=VAR_EPPLUS_BATCH：存在且 CONFIG_VALUE 为正整数时，高性能导出按该条数分批；无配置则全量单次导出 */
export const VAR_EPPLUS_BATCH_CONFIG_KEY = 'VAR_EPPLUS_BATCH';

export function parseVarEpplusBatchSize(configValue) {
  if (configValue == null || configValue === '') return 0;
  const n = parseInt(String(configValue).trim(), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** 基础资料-品种启用权限 */
export function canEnableVariety(store) {
  const pg = store?.state?.user?.info?.permission_group || [];
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes('基础资料-品种启用')) return true;
  return pg.some((p) =>
    [p.component, p.path, p.title, p.Permission_Url, p.PERMISSION_URL].some(
      (v) => v === '基础资料-品种启用'
    )
  );
}
