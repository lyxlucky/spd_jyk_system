import { fmtDate10, fmtFpQsState, fmtOrderJsType, calcAmount } from './utils';

export function getVwHptxColumns() {
  return [
    { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { prop: 'ID', label: 'ID', width: 80, hidden: true },
    { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 190, showOverflowTooltip: true },
    { prop: 'DELIVERY_NOTE_NUMBER', label: '收货单号', width: 120, showOverflowTooltip: true },
    {
      prop: 'PIC_URL',
      label: '发票图片',
      width: 100,
      align: 'center',
      slot: 'pic'
    },
    { prop: 'DELIVERY_TIME', label: '收货时间', width: 120, showOverflowTooltip: true },
    { prop: 'HPTX_MONTH', label: '结算月份', width: 80, showOverflowTooltip: true },
    { prop: 'INVOICES', label: '发票号', width: 120, showOverflowTooltip: true },
    {
      prop: 'ORDER_JS_TYPE',
      label: '入库类型',
      width: 180,
      showOverflowTooltip: true,
      formatter: (row) => fmtOrderJsType(row.ORDER_JS_TYPE)
    },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 120, showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 250, showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 250, showOverflowTooltip: true },
    { prop: 'NETRECEIPTS', label: '数量', width: 100, align: 'right' },
    { prop: 'SUPPLY_PRICE', label: '价格', width: 100, align: 'right' },
    {
      prop: 'SUM_SUPPLY_PRICE',
      label: '金额',
      width: 100,
      align: 'right',
      formatter: (row) => calcAmount(row)
    },
    { prop: 'UNIT', label: '单位', width: 100, showOverflowTooltip: true },
    { prop: 'APPROVAL_NUMBER', label: '注册证', minWidth: 190, showOverflowTooltip: true },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 190, showOverflowTooltip: true },
    { prop: 'BATCH', label: '批号', width: 100, showOverflowTooltip: true },
    {
      prop: 'BATCH_VALIDITY_PERIOD',
      label: '效期',
      width: 100,
      formatter: (row) => fmtDate10(row.BATCH_VALIDITY_PERIOD)
    },
    {
      prop: 'FP_QS_STATE',
      label: '是否签收',
      width: 100,
      align: 'center',
      formatter: (row) => fmtFpQsState(row.FP_QS_STATE)
    }
  ];
}
