import moment from 'moment';
import store from '@/store';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const CONTRACT_EXPIRE_DAYS_CONFIG_KEY = 'APPLY_PLAN_CONTRACT_EXPIRE_DAYS';

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

/**
 * 解析 CONFIG 表中合同近效期提醒天数：
 * 0、空值、负数或非法值均视为 0（不判断）。
 */
export function parseContractExpireDays(rawValue) {
  if (rawValue === null || rawValue === undefined) return 0;
  const text = String(rawValue).trim();
  if (!text) return 0;
  const days = Number(text);
  if (!Number.isFinite(days) || days <= 0) return 0;
  return Math.floor(days);
}

/**
 * 按近效期天数筛选合同已过期或即将到期的申领明细。
 * warnDays <= 0 时不判断，直接返回空数组。
 */
export function collectContractExpireWarnLines(list, warnDays, now) {
  const days = parseContractExpireDays(warnDays);
  if (days <= 0) return [];
  const today = moment(now).startOf('day');
  const expiredItems = [];
  (list || []).forEach((element) => {
    if (!element) return;
    if (element.DTL_IS_DELETE == '0' || element.DTL_IS_DELETE == 0) return;
    const qty = parseFloat(element.PlanQty);
    if (!(qty > 0)) return;
    const contractEnd = element.DET_CONTRACT_END || element.CONTRACT_END_TIME;
    if (!contractEnd) return;
    const end = moment(contractEnd).startOf('day');
    if (!end.isValid()) return;
    const diff = end.diff(today, 'days');
    if (diff > days) return;
    expiredItems.push({
      VarName: element.VarName,
      VarID: element.VarCode,
      GG: element.GG,
      Manufacturing: element.Manufacturing,
      DET_CONTRACT_END: contractEnd,
      expired: diff < 0,
      remainText:
        diff < 0
          ? '已过期'
          : diff === 0
            ? '今日到期'
            : '快到期(剩' + diff + '天)'
    });
  });
  return expiredItems;
}
