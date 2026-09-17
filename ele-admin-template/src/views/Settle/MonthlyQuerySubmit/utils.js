import { getStaticBaseUrl } from '@/config/setting';

export function formatDecimal(val) {
  if (val == null || val === '') return '';
  const num = parseFloat(val);
  return Number.isNaN(num) ? val : num.toFixed(2);
}

export function formatMonth(val) {
  if (!val) return '';
  if (typeof val === 'string') return val.length >= 7 ? val.substr(0, 7) : val;
  return '';
}

export function formatQsState(val) {
  return String(val || '0') === '1' ? '已签收' : '未签收';
}

export function formatConsumptionType(val) {
  return String(val || '') === '3' ? '一出' : '二消';
}

export function formatIsGt(val) {
  return String(val || '0') === '1' ? '是' : '否';
}

export function formatOrderJsType(val) {
  switch (String(val || '0')) {
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
    case '0':
    default:
      return '普通';
  }
}

export function formatOrderType(val) {
  const value = val == null ? '0' : String(val);
  if (value === '1') return '其他退货';
  if (value === '-1') return '跨月退中心库';
  if (value === '-2') return '跨月退供应商';
  if (value === '0' || value === '') return '普通申领';
  return value;
}

export function formatYesNo(val) {
  return String(val || '0') === '1' ? '是' : '否';
}

export function formatHighOrLowClass(val) {
  switch (String(val == null ? '' : val).trim()) {
    case '1':
      return '高值';
    case '0':
      return '低值';
    case '2':
      return '试剂';
    default:
      return val || '';
  }
}

export function formatType(val) {
  return String(val) === '1' ? '退货' : '领用';
}

export function formatJc(val) {
  if (val == '1' || val === '1') return '是';
  if (val == '0' || val === '0') return '否';
  return val || '';
}

export function formatYg(val) {
  return String(val) === '1' ? '线上' : '线下';
}

export function formatLc(val) {
  return String(val) === '1' ? '是' : '否';
}

export function formatUseAppState(val) {
  return String(val) === '1' ? '已确认' : '未确认';
}

export function formatSureMonthState(val) {
  return String(val) === '1' ? '已提交' : '未提交';
}

export function formatReturnRemark(row) {
  if (!row) return '';
  return String(row.OPERATE_TYPE || '') === '1' ? row.ORDER_TYPE_MARK || '' : '';
}

export function isValidAttachmentFile(fileName) {
  if (!fileName) return false;
  return /\.(jpg|jpeg|png|bmp|gif|pdf)$/i.test(fileName);
}

export function buildAttachmentUrl(path) {
  const value = String(path || '').replace(/\\/g, '/');
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const base = (getStaticBaseUrl() || '').replace(/\/+$/, '');
  return `${base}/${value.replace(/^\/+/, '')}`;
}

/** 从 blob 响应头解析文件名 */
export function parseDispositionFileName(disposition, fallback = '月结查询与提交.xlsx') {
  if (!disposition) return fallback;
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch (e) {
      /* ignore */
    }
  }
  const match = disposition.match(/filename[^;=\n]*=(['"]?)([^'";\n]*)\1/i);
  if (match && match[2]) {
    try {
      return decodeURIComponent(match[2]);
    } catch (e) {
      return match[2];
    }
  }
  return fallback;
}

export function downloadBlob(blob, fileName) {
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(a.href);
}

export function emptyQuery() {
  return {
    MONTHLY_TIME_START: '',
    MONTHLY_TIME_END: '',
    JSDH: '',
    QSSTATE: '',
    MONTHBILLNUM: '',
    SUPPLIER_NAME: '',
    CHARGING_DEPT: '',
    DEPT_NAME: '',
    CONSUMPTION_TYPE: '',
    IS_GT: '',
    USE_DEPT: '',
    VARIETIE_CODE_NEW: '',
    VARIETIE_NAME: '',
    SPECIFICATION_OR_TYPE: '',
    BATCH: '',
    UNIT: '',
    CLASS_ONE: '',
    CLASS_TWO: '',
    CLASS_THREE: '',
    DELIVERY_NOTE_NUMBER: '',
    YG_ORDER_ID: '',
    YG_ORDER_DETAIL_ID: '',
    YG_CODE: '',
    YG_SPE_TYPE: '',
    OPERATE_MAIN_NUMBER: '',
    DEF_NO_PKG_CODE: '',
    TH_OPERATE_MAIN_NUMBER: '',
    SUPPLY_PRICE: '',
    GOODS_QTY: '',
    JE: '',
    TYPE: '',
    ORDER_TYPE: '',
    ORDER_JS_TYPE: '',
    HIGH_OR_LOW_CLASS: '',
    CLASSIFIC_PROPERTIES: '',
    IS_EMBEDDED: '',
    IS_JC: '',
    IS_YG: '',
    IS_LC: '',
    USE_APP_STATE: '',
    USE_APP_MAN: '',
    CREATE_TIME_START: '',
    CREATE_TIME_END: '',
    OPEARTION_CHARGING_TIME_START: '',
    OPEARTION_CHARGING_TIME_END: '',
    USE_APP_TIME_START: '',
    USE_APP_TIME_END: '',
    IS_MONTHLY: '',
    SURE_MONTH_STATE: '',
    SURE_MONTH_MAN: '',
    SURE_MONTH_TIME_START: '',
    SURE_MONTH_TIME_END: ''
  };
}
