import { BACK_BASE_URL, API_BASE_URL, HOME_HP } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
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

export function openApiPdf(path) {
  const base = (BACK_BASE_URL || API_BASE_URL || '').replace(/\/$/, '');
  const token = sessionStorage.getItem(TOKEN_STORE_NAME) || '';
  const sep = path.includes('?') ? '&' : '?';
  window.open(`${base}${path}${sep}Token=${encodeURIComponent(token)}`);
}

export function fmtEnable(v) {
  return v === '1' || v === 1 ? '启用' : '停用';
}

export function fmtDelete(v) {
  return v === '1' || v === 1 ? '正常' : '已删';
}

export function fmtDate(v) {
  if (!v) return '—';
  return String(v).substring(0, 10);
}

/** 与旧系统 main_1.js toDecimal 一致：强制保留 2 位小数 */
export function fmtPrice(x) {
  const f = parseFloat(x);
  if (Number.isNaN(f)) return '—';
  const rounded = Math.round(Number(x) * 100) / 100;
  let s = rounded.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

export function operatorName(vm) {
  const info = vm?.$store?.state?.user?.info;
  return info?.nickname || info?.NickName || info?.username || '';
}
