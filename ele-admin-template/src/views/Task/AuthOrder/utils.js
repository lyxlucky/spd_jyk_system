export function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

export function fmtDefPkg(d) {
  const n = d.DEF_NUM ?? 0;
  const c = d.COEFFICIENT ?? 0;
  return `${n}/${n * c}`;
}

export function fmtJsDefPkg(d) {
  const n = d.JS_DEF_NUM ?? 0;
  const c = d.COEFFICIENT ?? 0;
  return `${n}/${n * c}`;
}

export function fmtDefState(v) {
  if (v == 0 || v === '0') return '未收货';
  if (v == 1 || v === '1') return '已收货';
  if (v == 2 || v === '2') return '已拒收';
  return v ?? '';
}
