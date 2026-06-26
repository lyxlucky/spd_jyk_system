export const STOCK_STATUS_OPTIONS = [
  { label: '全部', value: '' },
  { label: '不为0', value: 'HAS' },
  { label: '为0', value: 'ZERO' },
  { label: '负库存', value: 'NEGATIVE' }
];

export const STOCK_DEDUCT_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '实际扣费', value: '1' },
  { label: '预扣', value: '2' }
];

export function fmtQty(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return value == null ? '0' : String(value);
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export function fmtDateTime(value) {
  if (!value) return '';
  return String(value).replace('T', ' ').substring(0, 19);
}

export function areaTypeName(value) {
  if (value === 'WAREHOUSE') return '库房';
  if (value === 'AREA') return '库区';
  return value || '';
}

export function flagName(value) {
  return value === '1' || value === 'Y' ? '是' : '否';
}

export function enabledName(value) {
  return value === '1' || value === 'Y' ? '启用' : '停用';
}

export function stockDeductTypeName(value) {
  if (value === '1') return '实际扣费';
  if (value === '2') return '预扣';
  return value || '';
}

export const WAREHOUSE_EXPORT_HEADERS = [
  '序号',
  '库房/库区编码',
  '库房/库区名称',
  '品种编码',
  '计费编码',
  '品种名称',
  '规格型号',
  '生产企业',
  '单位',
  '库存数量',
  '实际扣费数量',
  '预扣数量',
  '涉及SPD科室数',
  '最近使用时间'
];

export const DEPT_EXPORT_HEADERS = [
  '序号',
  '库房/库区编码',
  '库房/库区名称',
  'SPD科室编码',
  'SPD科室名称',
  '默认',
  '启用',
  '耗材种类数',
  '库存数量',
  '实际扣费数量',
  '预扣数量',
  '最近使用时间'
];

export const DEPT_MATERIAL_EXPORT_HEADERS = [
  '序号',
  '库房/库区编码',
  '库房/库区名称',
  'SPD科室编码',
  'SPD科室名称',
  '品种编码',
  '计费编码',
  '品种名称',
  '规格型号',
  '生产企业',
  '单位',
  '库存数量',
  '实际扣费数量',
  '预扣数量',
  '最近使用时间'
];

export function warehouseRowToExportArray(row, index) {
  return [
    index + 1,
    row.AREA_CODE,
    row.AREA_NAME,
    row.VARIETIE_CODE_NEW,
    row.CHARGE_CODE,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.MANUFACTURING_ENT_NAME,
    row.UNIT,
    row.STOCK_QTY,
    row.REAL_DEDUCT_QTY,
    row.PRE_DEDUCT_QTY,
    row.SPD_DEPT_COUNT,
    fmtDateTime(row.LAST_OPERATE_TIME)
  ];
}

export function deptRowToExportArray(row, index) {
  return [
    index + 1,
    row.AREA_CODE,
    row.AREA_NAME,
    row.DEPT_TWO_CODE,
    row.DEPT_TWO_NAME,
    flagName(row.DEFAULT_FLAG),
    enabledName(row.ENABLED_FLAG),
    row.MATERIAL_COUNT,
    row.STOCK_QTY,
    row.REAL_DEDUCT_QTY,
    row.PRE_DEDUCT_QTY,
    fmtDateTime(row.LAST_OPERATE_TIME)
  ];
}

export function deptMaterialRowToExportArray(row, index) {
  return [
    index + 1,
    row.AREA_CODE,
    row.AREA_NAME,
    row.DEPT_TWO_CODE,
    row.DEPT_TWO_NAME,
    row.VARIETIE_CODE_NEW,
    row.CHARGE_CODE,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.MANUFACTURING_ENT_NAME,
    row.UNIT,
    row.STOCK_QTY,
    row.REAL_DEDUCT_QTY,
    row.PRE_DEDUCT_QTY,
    fmtDateTime(row.LAST_OPERATE_TIME)
  ];
}
