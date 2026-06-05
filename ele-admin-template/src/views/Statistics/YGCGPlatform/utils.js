import { utils, writeFile } from 'xlsx';

export const CONFIG_OPTIONS = [
  { value: '-1', label: '关闭' },
  { value: '1', label: '最低价' },
  { value: '2', label: '平均价' },
  { value: '3', label: '最高价' },
  { value: '4', label: '议价价格' },
  { value: '5', label: '预警价' }
];

export function defaultWhere() {
  return {
    code: '',
    supplierCode: '',
    statu: '',
    varietieStatu: '1',
    minPricePk: '',
    avgPricePk: '',
    examplePricePk: '',
    inventoryStatu: ''
  };
}

export function formatDateOnly(value) {
  if (!value) return '';
  const text = String(value).replace('T', ' ');
  return text.split(' ')[0];
}

export function formatCreateTime(value) {
  if (!value) return '';
  return String(value).replace('T', ' ').split('.')[0];
}

export function formatInventoryQty(row) {
  const qty = Number(row?.QTY) || 0;
  const deptQty = Number(row?.DEPT_TWO_QTY) || 0;
  const total = qty + deptQty;
  if (!total) return '无库存';
  return String(total);
}

export function formatEnable(value) {
  return value == '1' ? '启用' : '停用';
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
      prop: 'YG_CODE',
      label: '阳光平台编码',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'MIN_PRICE',
      label: '最低价格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'AVG_PRICE',
      label: '平均价格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'MAX_PRICE',
      label: '最高价格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'PACKAGE_SPEC',
      label: '包装规格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 160
    },
    {
      prop: 'DISCUSS_STATU',
      label: '议价状态',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'DISCUSS_PRICE',
      label: '议价价格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'EXAMPLE_PRICE_UNIT',
      label: '预警价格单位',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'EXAMPLE_PRICE',
      label: '预警价格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 100
    },
    {
      prop: 'VARIETIE_CODE_NEW',
      label: '品种编码',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 120
    },
    {
      prop: 'VARIETIE_NAME',
      label: '品种名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140
    },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: '品种包装规格',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140
    },
    {
      prop: 'PRICE',
      label: '中标价',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'UNIT',
      label: '中标单位',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      prop: 'YG_ZH_COUNT',
      label: '阳光转换比',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 100
    },
    {
      prop: 'INVENTORY_QTY',
      label: '库存数量（中心库&二级库）',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 180,
      slot: 'INVENTORY_QTY'
    },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140
    },
    {
      prop: 'APPROVAL_NUMBER',
      label: '批准文号',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 200
    },
    {
      prop: 'CONTRACT_CODE',
      label: '合同编码',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      prop: 'DET_CONTRACT_CODE',
      label: '明细合同编码',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      prop: 'CONTRACT_START_TIME',
      label: '合同开始时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 120,
      slot: 'CONTRACT_START_TIME'
    },
    {
      prop: 'CONTRACT_END_TIME',
      label: '合同结束时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 120,
      slot: 'CONTRACT_END_TIME'
    },
    {
      prop: 'DET_CONTRACT_START',
      label: '合同明细开始时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140,
      slot: 'DET_CONTRACT_START'
    },
    {
      prop: 'DET_CONTRACT_END',
      label: '合同明细结束时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 140,
      slot: 'DET_CONTRACT_END'
    },
    {
      prop: 'SUPPLIER_NAME',
      label: '供应商名称',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 200
    },
    {
      prop: 'CONTACT_PERSON',
      label: '业务联系人',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 110
    },
    {
      prop: 'CONTACT_PHONE',
      label: '业务联系人电话',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      prop: 'CREATE_TIME',
      label: '创建时间',
      align: 'center',
      showOverflowTooltip: true,
      minWidth: 150,
      slot: 'CREATE_TIME'
    }
  ];
}

const EXPORT_HEADER = [
  '阳光平台编码',
  '最低价格',
  '平均价格',
  '最高价格',
  '包装规格',
  '议价状态',
  '议价价格',
  '预警价格单位',
  '预警价格',
  '品种编码',
  '品种名称',
  '品种包装规格',
  '中标价',
  '中标单位',
  '阳光转换比',
  '库存数量',
  '生产企业',
  '批准文号',
  '合同编码',
  '明细合同编码',
  '合同开始时间',
  '合同结束时间',
  '合同明细开始时间',
  '合同明细结束时间',
  '供应商名称',
  '业务联系人',
  '业务联系人电话',
  '创建时间',
  '品种状态'
];

function buildExportRow(row) {
  const qty = Number(row?.QTY) || 0;
  const deptQty = Number(row?.DEPT_TWO_QTY) || 0;
  return [
    row.YG_CODE,
    row.MIN_PRICE,
    row.AVG_PRICE,
    row.MAX_PRICE,
    row.PACKAGE_SPEC,
    row.DISCUSS_STATU,
    row.DISCUSS_PRICE,
    row.EXAMPLE_PRICE_UNIT,
    row.EXAMPLE_PRICE,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.PRICE,
    row.UNIT,
    row.YG_ZH_COUNT,
    qty + deptQty,
    row.MANUFACTURING_ENT_NAME,
    row.APPROVAL_NUMBER,
    row.CONTRACT_CODE,
    row.DET_CONTRACT_CODE,
    formatDateOnly(row.CONTRACT_START_TIME),
    formatDateOnly(row.CONTRACT_END_TIME),
    formatDateOnly(row.DET_CONTRACT_START),
    formatDateOnly(row.DET_CONTRACT_END),
    row.SUPPLIER_NAME,
    row.CONTACT_PERSON,
    row.CONTACT_PHONE,
    formatCreateTime(row.CREATE_TIME),
    formatEnable(row.ENABLE)
  ];
}

export function exportYGCGExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '阳光平台采购比价.xlsx');
}
