import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';

export const IS_SEND_OPTIONS = [
  { value: '', label: '全部' },
  { value: '1', label: '已发送' },
  { value: '2', label: '已发送失败' },
  { value: '3', label: '已发送成功' },
  { value: '4', label: '未发送' }
];

export function defaultFilters() {
  return {
    varietyCodeNew: '',
    varietyName: '',
    supplierName: '',
    sourceFrom: '',
    manufacturingEntName: '',
    approvalNumber: '',
    month: '',
    month2: '',
    createStart: '',
    createEnd: '',
    ygOrderId: '',
    isSend: '',
    isAllFinish: ''
  };
}

export function validateMonthRange(filters) {
  const hasStart = !!filters.month;
  const hasEnd = !!filters.month2;
  if (hasStart !== hasEnd) {
    return '时间范围查询，起始时间及结束时间都需填写';
  }
  return '';
}

export function resolveMonthMeta(row) {
  if (row.MONTHLY_TIME == null) {
    return { monthId: '0', monthlyLabel: '未月结' };
  }
  return {
    monthId: row.MONTH_ID,
    monthlyLabel: row.MONTHLY_TIME
  };
}

export function getHospitalId() {
  const map = {
    bd: '1',
    zq: '81',
    lg: '2',
    szhn: '161',
    szlhfy: '221',
    szsmyl: '241'
  };
  return map[HOME_HP] || '0';
}

export function isZqHospital() {
  return HOME_HP === 'zq';
}

export function formatIsJc(value) {
  if (value === '1') return { text: '是', danger: false };
  if (value === '0') return { text: '否', danger: false };
  return { text: value, danger: true };
}

export function formatYgCanSend(value) {
  return value === '1' ? { text: '是', danger: false } : { text: '否', danger: true };
}

export function formatIsSendYg(value) {
  if (value === '1') return '是';
  if (value === '3') return '货票同行不发送';
  if (value === '4') return '异常数量不发送';
  return '否';
}

export function formatOrderCreateTime(value) {
  if (!value || value === '0001-01-01T00:00:00') return '';
  return String(value).replace('T', ' ');
}

export function isYgCodeMismatch(row) {
  if (row.GOODSID == null) return false;
  return row.YG_CODE != row.GOODSID;
}

export function isYgSpeTypeMismatch(row) {
  if (row.YG_SPE_TYPE == null) return false;
  return row.YG_SPE_TYPE != row.SUBCODEID;
}

export function isSupplierMismatch(row) {
  if (row.YG_SUPPLIER_CODE == null) return true;
  if (row.SUPPLIER_NAME == null) return false;
  return row.YG_SUPPLIER_CODE != row.SUPPLIER_CODE;
}

export function isSupplyPriceMismatch(row) {
  if (row.SUPPLY_PRICE == null) return false;
  return row.SUPPLY_PRICE != row.PURCHASEPRICE;
}

export function isZhCountMismatch(row) {
  return row.YG_ZH_COUNT != row.TJ_YG_ZH_COUNT;
}

export function isContractInvalid(status) {
  return status !== '已生效';
}

function formatIsJcText(value) {
  return value === '1' ? '是' : '否';
}

function formatYesNo(value) {
  return value === '1' ? '是' : '否';
}

function buildCommonExportRow(row) {
  return [
    row.MONTHLY_TIME,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.UNIT,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    row.MEDICAL_CODE27,
    row.YG_CODE,
    row.YG_SPE_TYPE,
    formatIsJcText(row.IS_JC),
    row.SOURCE_FROM,
    formatYesNo(row.YG_IS_CAN_SEND),
    row.YG_SEND_BEGIN_TIME,
    row.SUPPLIER_NAME,
    row.PRICE,
    row.SUPPLY_PRICE,
    row.PURCHASEPRICE,
    row.YG_ZH_COUNT,
    formatIsSendYg(row.IS_SEND_YG),
    row.YG_HOSPITAL_ID,
    row.YG_ORDER_ID,
    formatOrderCreateTime(row.ORDER_CREATE_TIME),
    row.CONTRACTSTATUS,
    row.TJ_YG_ZH_COUNT,
    row.PURCHASECOUNT,
    row.MONTH_ID
  ];
}

const EXPORT_HEADER = [
  '月结月份',
  '品种编码',
  '品种名称',
  '规格类型',
  '单位',
  '批准编号',
  '生产企业名称',
  '医保27位码',
  '产品码',
  '规格型号码',
  '是否集采',
  '品种来源',
  '是否允许发送',
  '发送起始时间',
  '供应商名称',
  'SPD中标价格',
  '消耗价格',
  '阳光平台采购价',
  '转换比例',
  '是否发送',
  '本院订单ID',
  '阳光平台订单',
  '订单创建时间',
  '平台合同状态',
  '推荐转换比',
  '采购数量',
  '月结ID'
];

const BACKFILL_HEADER = [
  '月结月份',
  '品种编码',
  '品种名称',
  '规格类型',
  '单位',
  '批准编号',
  '生产企业名称',
  '产品码',
  '规格型号码',
  '是否集采',
  '品种来源',
  '是否允许发送',
  '发送起始时间',
  '供应商名称',
  'SPD中标价格',
  '消耗价格(必填)',
  '阳光平台采购价',
  '转换比例',
  '是否发送',
  '本院订单ID',
  '阳光平台订单',
  '平台合同状态',
  '推荐转换比',
  '采购数量',
  '月结ID(必填)',
  '品种ID(必填)',
  '供应商编码(必填)',
  '回填订单号(必填)',
  '回填订单明细号(可不填)'
];

export function exportSendViewExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildCommonExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '阳光平台发送查看.xlsx');
}

function buildBackfillExportRow(row) {
  return [
    row.MONTHLY_TIME,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.UNIT,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    row.YG_CODE,
    row.YG_SPE_TYPE,
    formatIsJcText(row.IS_JC),
    row.SOURCE_FROM,
    formatYesNo(row.YG_IS_CAN_SEND),
    row.YG_SEND_BEGIN_TIME,
    row.SUPPLIER_NAME,
    row.PRICE,
    row.SUPPLY_PRICE,
    row.PURCHASEPRICE,
    row.YG_ZH_COUNT,
    formatIsSendYg(row.IS_SEND_YG),
    row.YG_HOSPITAL_ID,
    row.YG_ORDER_ID,
    row.CONTRACTSTATUS,
    row.TJ_YG_ZH_COUNT,
    row.PURCHASECOUNT,
    row.MONTH_ID,
    row.VARIETIE_CODE,
    row.SUPPLIER_CODE,
    '',
    ''
  ];
}

export function exportBackfillTemplateExcel(rows) {
  const data = [BACKFILL_HEADER, ...(rows || []).map(buildBackfillExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '回填订单表.xlsx');
}
