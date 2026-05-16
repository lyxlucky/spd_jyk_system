import { hpFlags } from './utils';
import {
  fmtClassific,
  fmtDate10,
  fmtDateTime,
  fmtExamineState,
  fmtHighOrLowClass,
  fmtMonth,
  fmtOrderJsType,
  fmtQsState
} from './utils';

const { isBd, isStzx, isHptx, isSzse } = hpFlags;

export function getAuditColumns() {
  return [
    { columnKey: 'selection', type: 'selection', width: 45, fixed: 'left' },
    { prop: 'MONTHLY_BALANCE_NUMBER', label: '月结单号', minWidth: 100, align: 'center' },
    {
      prop: 'MONTHLY_TIME',
      label: '月结月份',
      minWidth: 95,
      align: 'center',
      formatter: (row) => fmtMonth(row.MONTHLY_TIME)
    },
    {
      prop: 'SEND_WXT_MARK',
      label: '微讯通月份',
      minWidth: 95,
      hidden: !isBd,
      formatter: (row) => row.SEND_WXT_MARK ?? '-'
    },
    { columnKey: 'monthBill', label: '发票号', minWidth: 140, align: 'center', slot: 'monthBill', prop: 'MONTHBILLNUM' },
    {
      prop: 'FP_DATE',
      label: '开票日期',
      minWidth: 100,
      hidden: !isStzx,
      formatter: (row) => fmtDate10(row.FP_DATE)
    },
    { columnKey: 'pic', label: '发票图片', width: 90, align: 'center', slot: 'pic' },
    {
      columnKey: 'billfpStzx',
      prop: 'BILLFPNUM',
      label: '本院发票(收货自带)',
      minWidth: 120,
      hidden: !isStzx,
      align: 'center'
    },
    {
      columnKey: 'billfpHptx',
      prop: 'BILLFPNUM',
      label: '发票(货票同行)',
      minWidth: 110,
      hidden: !isHptx,
      align: 'center'
    },
    { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 140, showOverflowTooltip: true },
    {
      prop: 'CLASSIFIC_PROPERTIES',
      label: '财务类别',
      minWidth: 100,
      hidden: isBd,
      formatter: (row) => fmtClassific(row)
    },
    {
      prop: 'HIGH_OR_LOW_CLASS',
      label: '高低值分类',
      width: 90,
      formatter: (row) => fmtHighOrLowClass(row.HIGH_OR_LOW_CLASS)
    },
    {
      prop: 'ORDER_JS_TYPE',
      label: '入库类型',
      minWidth: 160,
      hidden: !isSzse,
      formatter: (row) => fmtOrderJsType(row.ORDER_JS_TYPE)
    },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 110 },
    { prop: 'SOURCE_FROM', label: '来源', minWidth: 90 },
    { prop: 'VARIETIE_NAME', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '型号/规格', minWidth: 100, showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 55, align: 'center' },
    { prop: 'PRICE', label: '单价', width: 70, align: 'right' },
    { prop: 'QTY', label: '数量', width: 70, align: 'center' },
    { prop: 'Money', label: '金额', width: 90, align: 'right' },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', minWidth: 130, showOverflowTooltip: true },
    { prop: 'BATCH', label: '批号', minWidth: 90 },
    { prop: 'BATCH_ID', label: '批次号', minWidth: 90 },
    {
      prop: 'BATCH_PRODUCTION_DATE',
      label: '生产日期',
      width: 95,
      formatter: (row) => fmtDate10(row.BATCH_PRODUCTION_DATE)
    },
    {
      prop: 'BATCH_VALIDITY_PERIOD',
      label: '有效期',
      width: 95,
      formatter: (row) => fmtDate10(row.BATCH_VALIDITY_PERIOD)
    },
    {
      prop: 'SIGNSTATUS',
      label: '医秒付签收状态',
      width: 110,
      hidden: !isBd,
      formatter: (row) => fmtQsState(row.SIGNSTATUS)
    },
    {
      prop: 'Examine_State',
      label: '审批状态',
      width: 90,
      formatter: (row) => fmtExamineState(row.Examine_State)
    },
    {
      prop: 'Examine_Time',
      label: '审批时间',
      minWidth: 150,
      formatter: (row) => fmtDateTime(row.Examine_Time)
    },
    { prop: 'YG_ORDER_ID', label: '阳光订单', minWidth: 110 },
    {
      prop: 'LS_IS_JC',
      label: '是否集采(时限)',
      width: 110,
      formatter: (row) => (row.LS_IS_JC == 1 ? '集采' : '非集采')
    },
    { prop: 'JC_REMARK', label: '集采备注', minWidth: 100, showOverflowTooltip: true },
    { prop: 'CHECKSTATUS', label: '医秒付发票状态', minWidth: 120, hidden: !isBd },
    {
      prop: 'QSSTATE',
      label: '中心库发票签收',
      width: 110,
      formatter: (row) => fmtQsState(row.QSSTATE)
    }
  ];
}
