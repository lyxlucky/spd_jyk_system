import { HOME_HP, B2B_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';

export { HOME_HP };

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}${subPath}${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

export function fmtMoney(x) {
  const f = parseFloat(x);
  if (Number.isNaN(f)) return '0.00';
  const rounded = Math.round(f * 100) / 100;
  let s = rounded.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) s += '0';
  return s;
}

export function sendStateLabel(v) {
  return v == 0 || v === '0' ? '未发送' : '已发送';
}

export function approvalStateLabel(v) {
  if (v == 0 || v === '0') return '未审批';
  if (v == 1 || v === '1') return '已审批';
  return '未知状态';
}

export function deptStateLabel(v) {
  if (v == 0 || v === '0') return '存在';
  if (v == 1 || v === '1') return '不存在';
  return '未知状态';
}

export function stockStateLabel(v) {
  const map = { 0: '未审批', 1: '已审批' };
  return map[v] != null ? map[v] : v == 0 ? '未审批' : '已审批';
}

export function operatorName(vm) {
  const info = vm?.$store?.state?.user?.info;
  return info?.nickname || info?.NickName || info?.username || '';
}

/** 确认月结 API action */
export function getSureMonthAction(hp = HOME_HP) {
  const map = {
    bd: 'SureMonth',
    bdrm: 'SureMonthBdrm',
    lg: 'SureMonthLR',
    zq: 'SureMonthZQ',
    stzl: 'SureMonthZL',
    nyd: 'SureMonthNYD',
    szlh: 'SureMonthLH',
    stzx: 'SureMonthStzx',
    stse: 'SureMonthStzx',
    fszxy: 'SureMonth',
    fsdwrmyy: 'SureMonth',
    fsdl: 'SureMonth',
    szhn: 'SureMonth',
    szlhfy: 'SureMonth',
    szsmyl: 'SureMonthSm',
    stzyyy: 'SureMonth',
    chrmyy: 'SureMonth',
    csyy: 'SureMonth'
  };
  return map[hp] || 'SureMonth';
}

/** 需弹窗填写备注+日期的院区 */
export function needsSureMonthDialog(hp = HOME_HP) {
  return [
    'szsmyl', 'bd', 'bdrm', 'nyd', 'stzx', 'csyy', 'zq', 'stse', 'fszxy',
    'szhn', 'fsdwrmyy', 'fsdl', 'stzyyy', 'szlhfy', 'chrmyy'
  ].includes(hp);
}

/** 发送 B2B 默认 action */
export function getSendB2bAction(hp = HOME_HP) {
  const map = {
    bd: 'SendMonth',
    lg: 'SendMonthHERP',
    zq: 'SendMonthZQ_B2B',
    stzl: 'SendMonthZLHERP',
    nyd: 'SendMonthNYD_B2B',
    szlh: 'SendMonthLH',
    stzx: 'SendMonthStzx'
  };
  return map[hp] || '';
}

/** 发送望海 */
export function getSendWhAction(hp = HOME_HP) {
  const map = {
    bd: 'SendMonth',
    bdrm: 'SendMonth',
    lg: 'SendMonthHERP',
    zq: 'SendMonthZQ',
    stzl: 'SendMonthZLHERP',
    nyd: 'SendMonthNYD',
    szlh: 'SendMonthLH'
  };
  return map[hp] || '';
}

/** 打印报表 action */
export function getStorageExcelAction(hp = HOME_HP) {
  if (['stzl', 'stzx', 'stzyyy', 'chrmyy'].includes(hp)) return 'CreateStorageExcelST';
  if (['bd', 'bdrm', 'lg', 'zq', 'nyd'].includes(hp)) return 'CreateStorageExcel';
  return '';
}

/** B2B 月结推送 URL（按院区） */
export function getB2bMonthUrl(hp, monthId) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  const paths = {
    nyd: `GetNydMonth?MonthID=${monthId}`,
    stzx: `GetStzxMonthFy?MonthID=${monthId}`,
    stse: `GetStseMonth?MonthID=${monthId}`,
    fszxy: `GetFszxyMonth?MonthID=${monthId}`,
    fsdwrmyy: `GetFsdwrmyyMonth?MonthID=${monthId}`,
    fsdl: `GetFsdlMonth?MonthID=${monthId}`,
    csyy: `GetCsyyMonth?MonthID=${monthId}`,
    stzyyy: `GetStzyyyMonth?MonthID=${monthId}`,
    zq: `GetZQMonth?MonthID=${monthId}`,
    szhn: `GetSzhnMonth?MonthID=${monthId}`,
    szlhfy: `GetSzLhfyMonth?MonthID=${monthId}`,
    szsmyl: `GetSzsmylMonth?MonthID=${monthId}`,
    szse: `GetMonthSzse?MonthID=${monthId}`,
    szse_lh: `GetMonthSzseLh?MonthID=${monthId}`,
    szse_dp: `GetMonthSzseDp?MonthID=${monthId}`,
    bd: `GetBdMonth?MonthID=${monthId}`,
    bdrm: `GetBdrmMonth?MonthID=${monthId}`,
    lg: `GetLRdMonth?MonthID=${monthId}`,
    szlh: `GetLHMonth?MonthID=${monthId}&Token=111`,
    chrmyy: `GetStzyyyMonth?MonthID=${monthId}`
  };
  const path = paths[hp];
  if (!path) return '';
  return `${base}/api/MonthlyInvoic/${path}`;
}

export async function postB2bMonth(url) {
  const res = await fetch(url, { method: 'GET' });
  return res.json();
}

export function buildSureMonthJson(operator, deptRows) {
  return JSON.stringify(
    deptRows.map((r) => `{${operator},${r.ID}}`)
  );
}

export function buildApprovalJson(dayRows, deptTwoCode) {
  return JSON.stringify(
    dayRows.map((r) => `{${r.ID},${deptTwoCode}}`)
  );
}
