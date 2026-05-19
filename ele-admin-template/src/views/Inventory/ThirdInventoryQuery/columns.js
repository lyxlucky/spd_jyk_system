import { fmtDate10, fmtUnitPrice } from './utils';

export function getThirdInventoryQueryColumns() {
  return [
    { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', label: '序号', width: 60, align: 'center' },
    { prop: 'DEPT_TWO_NAME', label: '库存科室', minWidth: 120, showOverflowTooltip: true },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 150, showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 150, showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 150, showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 80 },
    {
      prop: 'PRICE',
      label: '单价',
      width: 90,
      align: 'right',
      formatter: (row) => fmtUnitPrice(row)
    },
    { prop: 'COUNT', label: '申领数量', width: 90, align: 'right' },
    { prop: 'USE_COUNT', label: '计费数量', width: 90, align: 'right' },
    { prop: 'TF_COUNT', label: '退费数量', width: 90, align: 'right' },
    { prop: 'KC_COUNT', label: '库存数量', width: 90, align: 'right' },
    { prop: 'JS_COUNT', label: '结算数量', width: 90, align: 'right' },
    { prop: 'BATCH', label: '批号', width: 150, showOverflowTooltip: true },
    {
      prop: 'BATCH_VALIDITY_PERIOD',
      label: '有效期',
      width: 150,
      formatter: (row) => fmtDate10(row.BATCH_VALIDITY_PERIOD)
    },
    { prop: 'DELIVERY_NUMBER', label: '申领单号', width: 150, showOverflowTooltip: true },
    {
      prop: 'RECORD_TIME',
      label: '入库时间',
      width: 150,
      formatter: (row) => fmtDate10(row.RECORD_TIME)
    },
    { prop: 'APPROVAL_NUMBER', label: '批准文号', width: 150, showOverflowTooltip: true },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 150, showOverflowTooltip: true },
    { prop: 'SUPPLIER_NAME', label: '供应商', width: 150, showOverflowTooltip: true }
  ];
}
