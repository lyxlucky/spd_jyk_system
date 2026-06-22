import { utils, writeFile } from 'xlsx';

export const SYNC_FIELD_OPTIONS = [
  { key: 'CITY_VAR_CODE', label: '市平台产品码' },
  { key: 'CITY_SPE_CODE', label: '市平台规格型号码' },
  { key: 'MEDICAL_CODE', label: '国家医保编码' },
  { key: 'VARIETIE_NAME', label: '品种名称' },
  { key: 'XH', label: '型号' },
  { key: 'PKG_GG', label: '包装规格' },
  { key: 'SUPPORTING_EQU', label: '配套设备' },
  { key: 'SUPPORTING_EQU_BRAND', label: '配套设备品牌' },
  { key: 'SUPPORTING_EQU_XH', label: '配套设备型号' },
  { key: 'HIGH_OR_LOW_CLASS', label: '是否高值' },
  { key: 'HIGH_CLASS_XH', label: '重点治理序号' },
  { key: 'PRICE', label: '价格' },
  { key: 'HT_PRICE', label: '启用合同价格' }
];

export function defaultFilters() {
  return {
    VARIETIE_CODE_NEW: '',
    PROD_REGISTRATION_NAME: '',
    GG: '',
    APPROVAL_NUMBER: '',
    SUP_NAME: '',
    USE_DEPT: '',
    MANUFACTURING_ENT_NAME: '',
    CONTRACT_CODE: '',
    CREATE_BATCH: '',
    CREATE_BATCH2: '',
    start_time: '',
    end_time: '',
    IS_USE: '1',
    IS_HAVE: '',
    IS_ENABLE: '',
    HIGH_OR_LOW_CLASS: '',
    IS_IN_COUNTRY_IMPORT: '',
    HIGH_CLASS_XH: '',
    IS_PRICE: '',
    KC: ''
  };
}

export function formatDateOnly(value) {
  if (!value) return '';
  return String(value).substring(0, 10);
}

export function formatIsNeedAdd(row) {
  if (row.SPD_VARIETIE_CODE_NEW != null && row.SPD_VARIETIE_CODE_NEW !== '') {
    return '启用';
  }
  if (row.IS_NEED_ADD == '1') {
    return `已申请/${row.SQ_DEPT_NAME || ''}/${row.SQ_DEPT_MAN || ''}`;
  }
  return '未使用';
}

export function formatIsUse(value) {
  if (value == '1') return '使用';
  if (value == '0') return '弃用';
  return '未知';
}

export function formatYesNo(value) {
  if (value == '1') return '是';
  if (value == '0') return '否';
  return '未知';
}

export function isPriceMismatch(actual, expected) {
  if (actual == null || actual === '') return false;
  return String(actual) !== String(expected);
}

export function buildColumns() {
  return [
    {
      columnKey: 'selection',
      type: 'selection',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'DETAIL',
      label: '详情',
      width: 90,
      align: 'center',
      fixed: 'left',
      slot: 'DETAIL'
    },
    {
      prop: 'REMARK',
      label: '备注',
      width: 90,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'REMARK'
    },
    {
      prop: 'CREATE_BATCH',
      label: '导入时间',
      width: 120,
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'IS_NEED_ADD',
      label: '在用状态',
      width: 120,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'IS_NEED_ADD'
    },
    {
      prop: 'SPD_PRICE',
      label: 'SPD中标价',
      width: 120,
      align: 'center',
      slot: 'SPD_PRICE'
    },
    { prop: 'QTY', label: 'SPD库存', width: 120, align: 'center' },
    {
      prop: 'SUPPLY_PRICE',
      label: 'SPD库存价',
      width: 120,
      align: 'center',
      slot: 'SUPPLY_PRICE'
    },
    {
      prop: 'SPD_UNIT',
      label: 'SPD单位',
      width: 120,
      align: 'center',
      slot: 'SPD_UNIT'
    },
    { prop: 'UNIT', label: '单位', width: 80, align: 'center' },
    { prop: 'PRICE', label: '单价', width: 80, align: 'center' },
    {
      prop: 'IS_USE',
      label: '状态',
      width: 70,
      align: 'center',
      slot: 'IS_USE'
    },
    {
      prop: 'CONTRACT_START',
      label: '合同生效日期',
      width: 140,
      align: 'center',
      slot: 'CONTRACT_START'
    },
    {
      prop: 'CONTRACT_END',
      label: '合同失效日期',
      width: 140,
      align: 'center',
      slot: 'CONTRACT_END'
    },
    {
      prop: 'VARIETIE_CODE_NEW',
      label: '品种编码',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'PROD_REGISTRATION_NAME',
      label: '注册证名称',
      width: 180,
      showOverflowTooltip: true
    },
    {
      prop: 'VARIETIE_NAME',
      label: '品种名称',
      width: 180,
      showOverflowTooltip: true
    },
    { prop: 'PKG_GG', label: '包装规格', width: 120, showOverflowTooltip: true },
    { prop: 'SUP_NAME', label: '供应商', width: 180, showOverflowTooltip: true },
    { prop: 'XH', label: '型号', width: 140, showOverflowTooltip: true },
    { prop: 'GG', label: '规格', width: 140, showOverflowTooltip: true },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产厂家',
      width: 180,
      showOverflowTooltip: true
    },
    { prop: 'APPROVAL_NUMBER', label: '注册证号', width: 180, showOverflowTooltip: true },
    { prop: 'CONTRACT_CODE', label: '合同编码', width: 130, showOverflowTooltip: true },
    { prop: 'MEDICAL_CODE', label: '国家医保编码', width: 150, showOverflowTooltip: true },
    {
      prop: 'MEDICAL_CODE27',
      label: '国家医保编码（27位）',
      width: 200,
      showOverflowTooltip: true
    },
    { prop: 'CITY_VAR_CODE', label: '市平台产品码', width: 140, showOverflowTooltip: true },
    { prop: 'CITY_SPE_CODE', label: '市平台规格型号码', width: 180, showOverflowTooltip: true },
    { prop: 'BRAND', label: '品牌', width: 120, showOverflowTooltip: true },
    { prop: 'USE_DEPT', label: '使用科室', width: 140, showOverflowTooltip: true },
    { prop: 'SUP_PEOPLE', label: '联系人', width: 100, showOverflowTooltip: true },
    { prop: 'SUP_PHONE', label: '联系方式', width: 130, showOverflowTooltip: true },
    { prop: 'LIMIT_SUM_PRICE', label: '合同限购金额', width: 140, showOverflowTooltip: true },
    { prop: 'SEND_TYPE', label: '送货方式（快递\\配送）', width: 200, showOverflowTooltip: true },
    { prop: 'SUPPORTING_EQU', label: '配套设备', width: 140, showOverflowTooltip: true },
    {
      prop: 'SUPPORTING_EQU_BRAND',
      label: '配套设备品牌',
      width: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'SUPPORTING_EQU_XH',
      label: '配套设备型号',
      width: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'HIGH_OR_LOW_CLASS',
      label: '是否高值',
      width: 120,
      align: 'center',
      slot: 'HIGH_OR_LOW_CLASS'
    },
    {
      prop: 'IS_IN_COUNTRY_IMPORT',
      label: '国家高值医用耗材重点治理',
      width: 240,
      align: 'center',
      slot: 'IS_IN_COUNTRY_IMPORT'
    },
    {
      prop: 'HIGH_CLASS_XH',
      label: '重点治理序号',
      width: 140,
      align: 'center',
      showOverflowTooltip: true
    },
    { prop: 'CREATE_TIME', label: '创建时间', width: 140, showOverflowTooltip: true }
  ];
}

const EXPORT_HEADER = [
  '合同编码',
  '品种编码',
  '国家医保编码',
  '市平台编码',
  '市平台规格型号码',
  '省平台编码',
  '商品名',
  '注册证名称',
  '注册证号',
  '品牌',
  '型号',
  '规格',
  '单位',
  '包装规格',
  '单价',
  '使用科室',
  '生产厂家',
  '供应商',
  '联系人',
  '联系方式',
  '送货方式（快递-配送）',
  '合同生效日期',
  '合同失效日期',
  '配套设备',
  '配套设备品牌',
  '配套设备型号',
  '是否高值（0-否，1-是）',
  '是否属于国家高值医用耗材重点治理清单内（0-否，1-是）',
  '属于国家高值医用耗材重点治理序号',
  '是否启用（0-否，1-是）',
  '备注',
  '导入时间',
  'SPD编码',
  'SPD中标价',
  'SPD库存',
  'SPD库存价',
  'SPD单位',
  '状态',
  '合同限购金额'
];

function normalizeExportRow(row) {
  const item = { ...row };
  if (item.IS_USE == null) item.IS_USE = '0';
  if (item.IS_ENABLE == null) item.IS_ENABLE = '0';
  if (item.HIGH_OR_LOW_CLASS == null) item.HIGH_OR_LOW_CLASS = '0';
  if (item.IS_IN_COUNTRY_IMPORT == null) item.IS_IN_COUNTRY_IMPORT = '0';
  return item;
}

function buildExportStatus(row) {
  if (row.SPD_VARIETIE_CODE_NEW != null && row.SPD_VARIETIE_CODE_NEW !== '') {
    return '启用';
  }
  if (row.IS_NEED_ADD == '1') return '已申请';
  return '未使用';
}

function buildExportRow(row) {
  const r = normalizeExportRow(row);
  const qty = Number(r.QTY) || 0;
  const deptQty = Number(r.DEPT_TWO_QTY) || 0;
  return [
    r.CONTRACT_CODE,
    r.VARIETIE_CODE_NEW,
    r.MEDICAL_CODE,
    r.CITY_VAR_CODE,
    r.CITY_SPE_CODE,
    '',
    r.VARIETIE_NAME,
    r.PROD_REGISTRATION_NAME,
    r.APPROVAL_NUMBER,
    r.BRAND,
    r.XH,
    r.GG,
    r.UNIT,
    r.PKG_GG,
    r.PRICE,
    r.USE_DEPT,
    r.MANUFACTURING_ENT_NAME,
    r.SUP_NAME,
    r.SUP_PEOPLE,
    r.SUP_PHONE,
    r.SEND_TYPE,
    formatDateOnly(r.CONTRACT_START),
    formatDateOnly(r.CONTRACT_END),
    r.SUPPORTING_EQU,
    r.SUPPORTING_EQU_BRAND,
    r.SUPPORTING_EQU_XH,
    String(r.HIGH_OR_LOW_CLASS).replace('1', '是').replace('0', '否'),
    String(r.IS_IN_COUNTRY_IMPORT).replace('1', '是').replace('0', '否'),
    r.HIGH_CLASS_XH,
    String(r.IS_USE).replace('1', '使用').replace('0', '弃用'),
    r.REMARK,
    r.CREATE_BATCH,
    r.SPD_VARIETIE_CODE_NEW,
    r.SPD_PRICE,
    qty + deptQty,
    r.SUPPLY_PRICE,
    r.SPD_UNIT,
    buildExportStatus(r),
    r.LIMIT_SUM_PRICE
  ];
}

export function exportBidVarPage(rows, pageIndex) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, `中标目录${pageIndex}.xlsx`);
}

export function emptySyncFields() {
  return SYNC_FIELD_OPTIONS.reduce((acc, item) => {
    acc[item.key] = false;
    return acc;
  }, {});
}
