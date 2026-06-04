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
  return String(v).substr(0, 10);
}

export function fmtPrice(v) {
  if (v == null || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toFixed(2);
}

export function fmtStorageId(v) {
  if (v == '1' || v === 1) return '院内中心库';
  if (v == '2' || v === 2) return '院外中心库';
  return '未知';
}

/** 所属区域（与旧 layui templet 一致） */
export function fmtUpShelfState(row) {
  const s = row.UP_SHELF_STATE;
  if (s == 1 || s === '1') return '合格区';
  if (s == 6 || s === '6') return '隔离区';
  if (s == 7 || s === '7') return '不合格区';
  if (s == 9 || s === '9') return '应急库';
  if (s == 8 || s === '8') return '盘损隔离区';
  if (s == 0 || s === '0') return '院内中心库';
  if (row.Position == 2 && (s == 2 || s === '2')) return '暂借';
  if (row.Position == 1 && (s == 2 || s === '2')) return '锁定';
  return s != null && s !== '' ? String(s) : '';
}

export function isBatchExpired(v) {
  if (!v) return false;
  const d = new Date(String(v).substr(0, 10)).getTime();
  return !Number.isNaN(d) && d < Date.now();
}

/** 提交前格式化日期（旧系统 replace T） */
export function normalizeRowForPost(row) {
  const copy = { ...row };
  if (copy.BATCH_VALIDITY_PERIOD) {
    copy.BATCH_VALIDITY_PERIOD = String(copy.BATCH_VALIDITY_PERIOD).replace('T', ' ');
  }
  return copy;
}
