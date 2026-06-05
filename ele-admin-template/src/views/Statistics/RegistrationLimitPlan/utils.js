import { utils, writeFile } from 'xlsx';

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(String(value).replace(/-/g, '/'));
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(String(value).replace(/-/g, '/'));
  if (Number.isNaN(d.getTime())) return String(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

export function formatPercent(value) {
  const num = Number(value || 0);
  return `${num.toFixed(2)}%`;
}

export function planEnableText(isEnable) {
  return isEnable === '1' ? '启用' : '停用';
}

export function exportPlanExcel(rows) {
  const header = [
    '限制名称',
    '开始时间',
    '结束时间',
    '注册证明细数',
    '限制总数量',
    '累计备货数量',
    '备货已达限量%',
    '备货限量状态',
    '累计收货数量',
    '收货已达限量%',
    '收货限量状态',
    '状态',
    '创建人',
    '创建时间',
    '备注'
  ];
  const data = [header];
  (rows || []).forEach((row) => {
    data.push([
      row.LIMIT_PLAN_NAME || '',
      formatDate(row.LIMIT_PLAN_START_TIME),
      formatDate(row.LIMIT_PLAN_END_TIME),
      row.DETAIL_COUNT || 0,
      row.LIMIT_PLAN_NUM || 0,
      row.TOTAL_STOCK_UP_QTY || 0,
      formatPercent(row.STOCK_UP_LIMIT_PERCENT),
      row.STOCK_UP_LIMIT_STATUS || '',
      row.TOTAL_RECEIPTS || 0,
      formatPercent(row.RECEIPT_LIMIT_PERCENT),
      row.RECEIPT_LIMIT_STATUS || '',
      planEnableText(row.IS_ENBALE),
      row.CREATE_MAN || '',
      formatDateTime(row.CREATE_TIME),
      row.MARK || ''
    ]);
  });
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '注册证限量方案列表.xlsx');
}
