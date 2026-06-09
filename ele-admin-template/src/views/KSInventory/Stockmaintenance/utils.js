export {
  openExcelFile,
  fmtDate10,
  fmtPrice,
  fmtStorageId,
  isBatchExpired,
  normalizeRowForPost
} from '../NoMoveSell/utils';

/** 所属区域（与旧 Stockmaintenance.cshtml templet 一致） */
export function fmtUpShelfStateMaintenance(row) {
  const s = row.UP_SHELF_STATE;
  if (s == 1 || s === '1') return '合格区';
  if (s == 9 || s === '9') return '应急库';
  if (s == 8 || s === '8') return '盘损隔离区';
  if (s == 6 || s === '6') return '普通隔离区';
  if (s == 7 || s === '7') return '不合格区';
  if (s == 0 || s === '0') return '院内中心库';
  if (row.Position == 2 && (s == 2 || s === '2')) return '暂借';
  if (row.Position == 1 && (s == 2 || s === '2')) return '锁定';
  return s != null && s !== '' ? String(s) : '';
}

/** 有效到期默认结束日：当前日期 + 约 2 个月（与旧 datetime() 一致） */
export function defaultEndDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1 + 3);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function defaultStartDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
