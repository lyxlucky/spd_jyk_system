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

export function hasExportPermission(permissionUrl) {
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) => p.Permission_Url === permissionUrl);
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
