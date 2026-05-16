/** 是否对冲 */
export function fmtIsHedge(v) {
  const n = Number(v);
  if (n === 0) return '未对冲';
  if (n === 1) return '已对冲';
  if (n === 2) return '对冲失败';
  if (n === 3) return '重复扫码';
  if (n === 4) return '异常数据';
  return v != null && v !== '' ? String(v) : '—';
}

/** 完成标志 */
export function fmtIsComplete(v) {
  if (v == 1 || v === '1') return '手术完成';
  return '未完成';
}

/** 剔除状态 */
export function fmtIsDelete(v) {
  if (v == 0 || v === '0') return '剔除';
  if (v == 1 || v === '1') return '正常';
  return '异常数据';
}

/** 库存状态（替换/回补弹窗） */
export function fmtStockState(v) {
  const n = Number(v);
  if (n === 0) return '未上架';
  if (n === 1) return '已上架';
  if (n === 2) return '已锁定';
  if (n === 3) return '已出库';
  if (n === 4) return '已暂借';
  if (n === 5) return '已归还';
  return v != null && v !== '' ? String(v) : '—';
}
