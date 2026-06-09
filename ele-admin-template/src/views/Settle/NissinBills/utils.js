import { HOME_HP, BACK_BASE_URL } from '@/config/setting';

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

export function openMonthPdf(path) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  window.open(`${base}${path}`);
}

export function clearingStateLabel(state) {
  if (state == 0 || state === '0') return '新增';
  if (state == 1 || state === '1') return '已完成';
  return state ?? '';
}

export function dayApprovalStateLabel(state) {
  if (state == '0' || state === 0) return '未审核';
  if (state == '1' || state === 1) return '已审核';
  return 'NULL';
}

export function fmtClearingDate(value) {
  if (!value) return '';
  return String(value).substring(0, 10);
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

export function fmtPrice(row) {
  const price = parseFloat(row?.Price);
  if (Number.isNaN(price)) return '';
  const bl = row?.price_bl != null ? Number(row.price_bl) : 2;
  return price.toFixed(Number.isNaN(bl) ? 2 : bl);
}

export function operatorName(vm) {
  const info = vm?.$store?.state?.user?.info;
  return info?.nickname || info?.NickName || info?.username || '';
}

/** 打印日清账单 action（非南医大） */
export function getDailyBillPrintAction(hp = HOME_HP) {
  if (hp === 'fszxy' || hp === 'fsdwrmyy' || hp === 'ybyy') {
    return 'GetClearingGeneratedailybillsNPOI_FS';
  }
  return 'GetClearingGeneratedailybillsNPOI';
}

export function buildConfirmJson(bill, depts, operator) {
  const list = (depts || []).map((row) => ({
    Goods_Day_Clearing_Number: bill.Goods_Day_Clearing_Number || '',
    Dept_Two_Code: row.SPD_COST_DEPT_CODE || '',
    Dept_Two_Name: row.SPD_COST_DEPT_NAME || '',
    Clearing_Operator: operator || bill.Clearing_Operator || ''
  }));
  return JSON.stringify(list);
}

export function buildDayApprovalDeptCodes(depts) {
  const codes = (depts || [])
    .map((row) => `'${row.Dept_Two_Code || row.SPD_COST_DEPT_CODE || ''}'`)
    .filter((c) => c !== "''")
    .join(',');
  return codes ? `(${codes})` : '';
}
