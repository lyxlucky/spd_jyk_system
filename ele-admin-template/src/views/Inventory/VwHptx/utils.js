import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

export function picUrl(name) {
  if (!name) return '';
  const file = String(name).replace(/:/g, '_');
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  return `${base}/Upload/InvoicePic/${file}`;
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

export function fmtOrderJsType(v) {
  switch (String(v ?? '0')) {
    case '1':
      return '临购';
    case '2':
      return '临购初始化（医院货主）';
    case '3':
      return '原HERP库存初始化（医院货主）';
    case '4':
      return '经费入库';
    case '5':
      return '初始化一出已结算';
    default:
      return '普通';
  }
}

export function fmtFpQsState(v) {
  return v == 1 || v === '1' ? '已签收' : '未签收';
}

export function calcAmount(row) {
  const qty = Number(row.NETRECEIPTS) || 0;
  const price = Number(row.SUPPLY_PRICE) || 0;
  return (qty * price).toFixed(2);
}

export const ORDER_JS_TYPE_OPTIONS = [
  { label: '全部入库类型', value: '' },
  { label: '普通', value: '0' },
  { label: '临购', value: '1' },
  { label: '临购初始化（医院货主）', value: '2' },
  { label: '原HERP库存初始化（医院货主）', value: '3' },
  { label: '经费入库', value: '4' },
  { label: '初始化一出已结算', value: '5' }
];

export const UP_ORDER_JS_TYPE_OPTIONS = ORDER_JS_TYPE_OPTIONS.filter((o) => o.value !== '');

export const EXPORT_HEADERS = [
  '供应商',
  '收货单号',
  '收货时间',
  '结算月份',
  '发票号',
  '入库类型',
  '品种编码',
  '品种名称',
  '规格型号',
  '数量',
  '价格',
  '金额',
  '单位',
  '注册证',
  '生产企业',
  '批号',
  '效期',
  '是否签收'
];

export function rowToExportArray(row) {
  return [
    row.SUPPLIER_NAME,
    row.DELIVERY_NOTE_NUMBER,
    row.DELIVERY_TIME,
    row.HPTX_MONTH,
    row.INVOICES,
    fmtOrderJsType(row.ORDER_JS_TYPE),
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.NETRECEIPTS,
    row.SUPPLY_PRICE,
    calcAmount(row),
    row.UNIT,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    row.BATCH,
    fmtDate10(row.BATCH_VALIDITY_PERIOD),
    fmtFpQsState(row.FP_QS_STATE)
  ];
}
