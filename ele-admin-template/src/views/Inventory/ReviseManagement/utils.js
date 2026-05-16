import { BACK_BASE_URL, API_BASE_URL } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';

export function openExportResult(resultPath) {
  if (!resultPath) return;
  const base = (BACK_BASE_URL || API_BASE_URL || '').replace(/\/$/, '');
  const path = String(resultPath).replace(/^\//, '');
  window.open(`${base}/${path}`);
}

export function openConsumePrintPdf(defCodes) {
  const base = (BACK_BASE_URL || API_BASE_URL || '').replace(/\/$/, '');
  const token = sessionStorage.getItem(TOKEN_STORE_NAME) || '';
  const json = encodeURIComponent(defCodes);
  window.open(
    `${base}/api/Commons/GetReportById_BXH?id=11&format=pdf&inline=true&json=${json}&Token=${encodeURIComponent(token)}`
  );
}

export function fmtDateTime(v) {
  if (v == null || v === '') return '';
  const s = String(v).replace('T', ' ');
  if (s.startsWith('0001-01-01')) return '';
  return s.slice(0, 19);
}

export function fmtDate(v) {
  if (v == null || v === '') return '';
  return String(v).replace('T', ' ').slice(0, 10);
}

export function fmtPdState(v) {
  const n = Number(v);
  if (n === 0) return '缺失';
  if (n === 1) return '一致';
  if (n === 2) return '溢出';
  return '未知';
}

export function fmtCanZj(stockState) {
  return String(stockState) === '1' ? '可补' : '不可补';
}

export function fmtStockState(v) {
  const s = String(v);
  if (s === '1') return '上架';
  if (s === '2') return '暂借';
  if (s === '3') return '已出库';
  if (s === '0') return '已退货';
  return s ? `异常状态:${s}` : '';
}

export function fmtConsumptionType(v) {
  const n = Number(v);
  if (n === 0) return '条码扫码即消耗';
  if (n === 1) return 'RFID读码消耗';
  if (n === 2) return 'HIS计费消耗';
  if (n === 3) return '散货申领消耗';
  if (n === 5) return '超时默认消耗';
  return '';
}

export function fmtDeptSpState(v) {
  return String(v) === '1' ? '已审批' : '未审批';
}

/** 表格列本地排序（与 layui sort:true 一致，仅当前页/当前数据集） */
export function sortStr(a, b, prop) {
  const va = a[prop] == null ? '' : String(a[prop]);
  const vb = b[prop] == null ? '' : String(b[prop]);
  return va.localeCompare(vb, 'zh-CN');
}

export function sortNum(a, b, prop) {
  return (Number(a[prop]) || 0) - (Number(b[prop]) || 0);
}

export function sortDate(a, b, prop) {
  const va = a[prop] == null ? '' : String(a[prop]);
  const vb = b[prop] == null ? '' : String(b[prop]);
  return va.localeCompare(vb);
}
