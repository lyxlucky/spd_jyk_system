import { utils, writeFile } from 'xlsx';

export function defaultFilters() {
  return {
    Search: '',
    MATERIALS_CODE: '',
    PJ_NAME: '',
    VARIETIE_NAME: '',
    SPECIFICATION_OR_TYPE: '',
    GY_CS_IsPrice: '0',
    IS_ENABLE: '1',
    IS_CHARGE: '1',
    HIS_STATE: ''
  };
}

export function formatIsEnable(value) {
  if (value == '1') return '启用';
  if (value == '0') return '停用';
  return value ?? '';
}

export function formatIsCharge(value) {
  if (value == '1') return '是';
  if (value == '0') return '否';
  return value ?? '';
}

export function buildColumns() {
  return [
    { prop: 'HIS_CODE', label: 'HIS序号', width: 110, showOverflowTooltip: true },
    { prop: 'PJ_NAME', label: 'HIS名称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'CHARGE_CODE', label: 'HIS计费编码', width: 150, showOverflowTooltip: true },
    { prop: 'MATERIALS_CODE', label: 'HIS材料编码', width: 150, showOverflowTooltip: true },
    { prop: 'PRICE', label: 'HIS价格', width: 90, align: 'right' },
    { prop: 'SPD_PRICE_ZH', label: 'SPD转换价格', width: 140, align: 'right' },
    { prop: 'SPD_PRICE', label: 'SPD价格', width: 120, align: 'right' },
    { prop: 'UNIT', label: 'HIS单位', width: 120, align: 'center' },
    { prop: 'HIS_ZHB', label: '转换比', width: 100, align: 'center' },
    { prop: 'SPD_UNIT', label: 'SPD单位', width: 120, align: 'center' },
    {
      prop: 'VARIETIE_CODE_NEW',
      label: 'SPD品种编码',
      width: 130,
      showOverflowTooltip: true
    },
    { prop: 'VARIETIE_NAME', label: 'SPD品种名称', minWidth: 150, showOverflowTooltip: true },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: 'SPD规格/型号',
      minWidth: 180,
      showOverflowTooltip: true
    },
    { prop: 'APPROVAL_NUMBER', label: '注册证号', width: 140, showOverflowTooltip: true },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业',
      minWidth: 180,
      showOverflowTooltip: true
    },
    {
      prop: 'IS_ENABLE',
      label: 'SPD状态',
      width: 120,
      align: 'center',
      slot: 'IS_ENABLE'
    },
    { prop: 'HIS_STATE', label: 'HIS状态', width: 90, align: 'center' },
    {
      prop: 'IS_CHARGE',
      label: '是否收费',
      width: 120,
      align: 'center',
      slot: 'IS_CHARGE'
    }
  ];
}

const EXPORT_HEADER = [
  'HIS序号',
  'HIS名称',
  'HIS计费编码',
  'HIS材料编码',
  'HIS价格',
  'SPD转换价格',
  'SPD价格',
  'HIS单位',
  '转换比',
  'SPD单位',
  'SPD品种编码',
  'SPD品种名称',
  'SPD规格/型号',
  '注册证号',
  '生产企业',
  '是否收费',
  'SPD状态',
  'HIS状态'
];

function buildExportRow(row) {
  return [
    row.HIS_CODE,
    row.PJ_NAME,
    row.CHARGE_CODE,
    row.MATERIALS_CODE,
    row.PRICE,
    row.SPD_PRICE_ZH,
    row.SPD_PRICE,
    row.UNIT,
    row.HIS_ZHB,
    row.SPD_UNIT,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    formatIsCharge(row.IS_CHARGE),
    formatIsEnable(row.IS_ENABLE),
    row.HIS_STATE
  ];
}

export function exportGyClmlSpdExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, 'his计费目录.xlsx');
}
