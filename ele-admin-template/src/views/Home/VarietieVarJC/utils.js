import { utils, writeFile } from 'xlsx';

export function formatJcState(val) {
  if (val === '1' || val === 1) return '启用';
  if (val === '0' || val === 0) return '冻结';
  return val ?? '';
}

export function date10(val) {
  if (val == null || val === '') return '';
  return String(val).substring(0, 10);
}

const EXPORT_HEADERS = [
  '品种编码',
  '品种名称',
  '规格型号',
  '单位',
  '当前中标价格',
  '集采价格',
  '集采开始时间',
  '集采结束时间',
  '创建人',
  '创建时间',
  '备注',
  '状态',
  '注册证号',
  '生产企业'
];

export function exportJcVarietyExcel(rows, filename = '集采品种数据.xlsx') {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    data.push([
      row.VARIETIE_CODE_NEW,
      row.VARIETIE_NAME,
      row.SPECIFICATION_OR_TYPE,
      row.UNIT,
      row.PRICE,
      row.JC_PRICE,
      date10(row.JC_START_TIME),
      date10(row.JC_END_TIME),
      row.CREATE_MAN,
      row.CREATE_TIME,
      row.REMARK,
      formatJcState(row.STATE),
      row.APPROVAL_NUMBER,
      row.MANUFACTURING_ENT_NAME
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, filename);
}

/** 与旧页 ImportVarJCExcel 列顺序一致 */
export function downloadImportTemplate() {
  const headers = ['品种编码', '集采价格', '状态（0-冻结/1-启用）', '备注', '集采起始时间', '集采结束时间'];
  const sample = ['示例编码', '100.00', '1', '', '2024-01-01', '2024-12-31'];
  const sheet = utils.aoa_to_sheet([headers, sample]);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, '集采品种导入模板.xlsx');
}
