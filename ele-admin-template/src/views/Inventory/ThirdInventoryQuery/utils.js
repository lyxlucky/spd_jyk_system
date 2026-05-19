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

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

/** 与旧页 template: (d.MAIN_PRICE - d.HQ_PRICE).toFixed(2) */
export function fmtUnitPrice(row) {
  const main = Number(row.MAIN_PRICE);
  const hq = Number(row.HQ_PRICE);
  if (!Number.isNaN(main) && !Number.isNaN(hq)) {
    return (main - hq).toFixed(2);
  }
  const price = Number(row.PRICE);
  if (!Number.isNaN(price)) return price.toFixed(2);
  return '0.00';
}

/** 后端列表接口会补 KC_COUNT；导出接口未补时前端兜底 */
export function enrichRow(row) {
  const r = { ...row };
  if (r.KC_COUNT == null || r.KC_COUNT === '') {
    r.KC_COUNT =
      (Number(r.COUNT) || 0) - (Number(r.USE_COUNT) || 0) + (Number(r.TF_COUNT) || 0);
  }
  return r;
}
