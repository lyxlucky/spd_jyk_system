export function fmtCreateTime(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

export function fmtDeliveryTime(v) {
  if (!v || String(v).startsWith('0001-01-01')) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

export function fmtState(v) {
  return v == 1 || v === '1' ? '已处理' : '未处理';
}

export function fmtPrice(v) {
  if (v == null || v === '') return '';
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : String(n);
}

export const EXPORT_HEADERS = [
  '处理状态',
  '记录时间',
  '品种编码',
  '计费编码',
  '品种名称',
  '规格型号',
  '生产企业',
  '注册证号',
  '单位',
  '旧价格',
  '新价格',
  '收货价格',
  '收货单号',
  '价格变动第一次收货时间',
  '合同供应商'
];

export function rowToExportArray(row) {
  return [
    fmtState(row.STATE),
    fmtCreateTime(row.CREATE_TIME),
    row.VARIETIE_CODE_NEW ?? '',
    row.CHARGING_CODE ?? '',
    row.VARIETIE_NAME ?? '',
    row.SPECIFICATION_OR_TYPE ?? '',
    row.MANUFACTURING_ENT_NAME ?? '',
    row.APPROVAL_NUMBER ?? '',
    row.UNIT ?? '',
    fmtPrice(row.OLD_PRICE),
    fmtPrice(row.NEW_PRICE),
    fmtPrice(row.UP_PRICE),
    row.DELIVERY_NOTE_NUMBER ?? '',
    fmtDeliveryTime(row.DELIVERY_TIME) || String(row.DELIVERY_TIME || '').replace('T', ' '),
    row.SUPPLIER_NAME ?? ''
  ];
}
