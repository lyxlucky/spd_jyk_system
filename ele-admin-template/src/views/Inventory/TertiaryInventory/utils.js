export function fmtPrice(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return '0.00';
  return n.toFixed(2);
}

export function fmtDateTime(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

export const EXPORT_HEADERS = [
  '序号',
  '科室名称',
  '品种编码',
  '品种名称',
  '规格型号',
  '单位',
  '价格',
  '数量',
  '生产企业',
  '计费编码'
];

export function rowToExportArray(row, index) {
  return [
    index + 1,
    row.DEPT_TWO_NAME,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.UNIT,
    row.PRICE,
    row.COUNT,
    row.MANUFACTURING_ENT_NAME,
    row.CHARGING_CODE
  ];
}
