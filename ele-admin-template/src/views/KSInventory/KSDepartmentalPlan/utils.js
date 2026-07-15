import store from '@/store';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

/**
 * 导出权限（对齐老系统 Home.cshtml）
 * - 非市二：export-* 默认可见
 * - 市二(szse*)：需有对应 Permission_Url
 * - 开发环境：始终可见
 */
export function hasExportPermission(permissionUrl) {
  if (!permissionUrl) return true;
  const isSzse = String(HOME_HP || '').startsWith('szse');
  if (!isSzse && String(permissionUrl).startsWith('export-')) {
    return true;
  }
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(permissionUrl)) return true;
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) =>
    [p.Permission_Url, p.PERMISSION_URL, p.component, p.path, p.title].some(
      (v) => v === permissionUrl
    )
  );
}

export function buildUserDeptCodes() {
  return (store?.state?.user?.info?.userDept || [])
    .map((d) => d.Dept_Two_Code)
    .join(',');
}

export function filterPlanDetailByVariety(list, varietyFilter) {
  if (!varietyFilter || varietyFilter === '-1') return list;
  if (varietyFilter === '0') {
    return (list || []).filter((row) => !Number(row.PlanQty));
  }
  if (varietyFilter === '1') {
    return (list || []).filter((row) => Number(row.PlanQty));
  }
  return list;
}
