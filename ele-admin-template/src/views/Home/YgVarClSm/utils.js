import { utils, writeFile } from 'xlsx';

export function defaultFilters() {
  return {
    VARIETIE_CODE_NEW: '',
    APPROVAL_NUMBER: '',
    APPROVAL_NAME: '',
    VARIETIE_NAME: '',
    GGXH: '',
    SOURCE_FROM: '',
    ISDM: '',
    IS_CHARGE: '',
    YBBIAOJI: '0',
    TYPE: '',
    SUPPLIER_NAME: '',
    YGVARCL_END_START: '',
    YGVARCL_END_END: '',
    ygCode: '',
    REMARK: '',
    SENDYB_STATE: ''
  };
}

export function formatSendYbState(value) {
  const map = {
    '1': '',
    '2': '已初筛',
    '3': '初筛已确认',
    '4': '耗材组采购审核',
    '5': '耗材组库管审核',
    '6': '物价已准入',
    '11': '已推送至HIS',
    '12': '计费编码已同步',
    '-1': '忽略'
  };
  return map[value] ?? value ?? '';
}

export function formatSendYbType(value) {
  const map = {
    '0': '新增',
    '1': '修改',
    '2': '调价',
    '3': '停用/启用'
  };
  return map[value] ?? value ?? '';
}

export function formatIsCharge(value) {
  if (value === 'FF' || value == '0' || value == null || value === '') return '';
  if (value == '1') return '是';
  return '未维护';
}

export function formatYbbiaoji(value) {
  if (value == '0') return '否';
  if (value == '1') return '是';
  return '未维护';
}

export function formatLogTime(value) {
  if (!value || value === '0001-01-01T00:00:00') return '';
  return String(value).replace('T', ' ');
}

export function formatDateOnly(value) {
  if (!value || value === '0001-01-01T00:00:00') return '';
  return String(value).substring(0, 10);
}

export function isMedicalCodeMismatch(row) {
  if (row.MEDICAL_CODE == null) return false;
  return row.MEDICAL_CODE !== row.MEDICAL_INSURANCE_CODE;
}

export function isTerminationExpired(value) {
  if (!value || value === '0001-01-01T00:00:00') return false;
  const date = new Date(formatDateOnly(value)).getTime();
  return !Number.isNaN(date) && date <= Date.now();
}

export function buildCommitRow(row) {
  return {
    ID: row.ID,
    VARIETIE_CODE_NEW: row.VARIETIE_CODE_NEW,
    SP_REMARK: row.SP_REMARK,
    IS_CHARGE: row.IS_CHARGE,
    YBBIAOJI: row.YBBIAOJI,
    CHARGING_CODE: row.CHARGING_CODE,
    SUPPLIER_NAME: row.SUPPLIER_NAME,
    MEDICAL_CODE: row.MEDICAL_CODE,
    MEDICAL_CODE27: row.MEDICAL_CODE27,
    APPROVAL_NUMBER: row.APPROVAL_NUMBER,
    PROD_REGISTRATION_NAME: row.PROD_REGISTRATION_NAME,
    VARIETIE_NAME: row.VARIETIE_NAME,
    SPECIFICATION_OR_TYPE: row.SPECIFICATION_OR_TYPE,
    PRICE: row.PRICE,
    UNIT: row.UNIT,
    MANUFACTURING_ENT_NAME: row.MANUFACTURING_ENT_NAME,
    BRAND: row.BRAND,
    NAME_OF_MEDICAL_INSURANCE_CATA: row.NAME_OF_MEDICAL_INSURANCE_CATA,
    THE_PRIMARY_CLASSIFICATION: row.THE_PRIMARY_CLASSIFICATION,
    SECONDARY_CLASSIFICATION: row.SECONDARY_CLASSIFICATION,
    RECLASSIFY: row.RECLASSIFY,
    SIGN_OF_CHARGE_TO_AN_ACCOUNT: row.SIGN_OF_CHARGE_TO_AN_ACCOUNT,
    MEDICARE_PAYMENT_CAP: row.MEDICARE_PAYMENT_CAP,
    TYPE_OF_PRODUCTION_PLACE: row.TYPE_OF_PRODUCTION_PLACE,
    YBCLASS: row.YBCLASS,
    BASIC_MEDICAL_INSURANCE_START: row.BASIC_MEDICAL_INSURANCE_START,
    LAUNCH_DATE_OF_BASIC_MEDICAL: row.LAUNCH_DATE_OF_BASIC_MEDICAL,
    TERMINATION_DATE_OF_BASIC_HEAL: row.TERMINATION_DATE_OF_BASIC_HEAL,
    YG_CODE: row.YG_CODE,
    YG_SPE_TYPE: row.YG_SPE_TYPE,
    SOURCE_FROM: row.SOURCE_FROM,
    IN_MATERIAL: row.IN_MATERIAL,
    RESTRICTIVE_SPECIFICATION: row.RESTRICTIVE_SPECIFICATION
  };
}

export function buildSimpleCommitRow(row) {
  return {
    ID: row.ID,
    VARIETIE_CODE_NEW: row.VARIETIE_CODE_NEW
  };
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
      prop: 'SENDYB_STATE',
      label: '状态',
      width: 120,
      align: 'center',
      slot: 'SENDYB_STATE'
    },
    {
      prop: 'LOG_TIME',
      label: '审批时间',
      width: 140,
      showOverflowTooltip: true,
      slot: 'LOG_TIME'
    },
    {
      prop: 'SENDYB_TYPE',
      label: '提交类型',
      width: 120,
      align: 'center',
      slot: 'SENDYB_TYPE'
    },
    { prop: 'SP_REMARK', label: '备注', width: 100, showOverflowTooltip: true },
    {
      prop: 'IS_CHARGE',
      label: '是否收费',
      width: 120,
      align: 'center',
      slot: 'IS_CHARGE'
    },
    {
      prop: 'YBBIAOJI',
      label: '暂挂',
      width: 60,
      align: 'center',
      slot: 'YBBIAOJI'
    },
    {
      prop: 'VARIETIE_CODE_NEW',
      label: '耗材物品编码',
      width: 140,
      showOverflowTooltip: true
    },
    { prop: 'CHARGING_CODE', label: '计费编码', width: 120, showOverflowTooltip: true },
    { prop: 'SUPPLIER_NAME', label: '供应商', width: 140, showOverflowTooltip: true },
    {
      prop: 'MEDICAL_CODE',
      label: '医保编码',
      width: 160,
      showOverflowTooltip: true,
      slot: 'MEDICAL_CODE'
    },
    {
      prop: 'MEDICAL_CODE27',
      label: '医保27位编码',
      width: 160,
      showOverflowTooltip: true
    },
    { prop: 'APPROVAL_NUMBER', label: '注册证号', width: 140, showOverflowTooltip: true },
    {
      prop: 'PROD_REGISTRATION_NAME',
      label: '注册证名称',
      width: 180,
      showOverflowTooltip: true
    },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 180, showOverflowTooltip: true },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: '规格型号',
      width: 180,
      showOverflowTooltip: true
    },
    { prop: 'PRICE', label: '中标价', width: 100, align: 'right' },
    { prop: 'UNIT', label: '单位', width: 60, align: 'center' },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业',
      width: 180,
      showOverflowTooltip: true
    },
    { prop: 'BRAND', label: '品牌', width: 100, showOverflowTooltip: true },
    {
      prop: 'NAME_OF_MEDICAL_INSURANCE_CATA',
      label: '医保码目录名称',
      width: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'THE_PRIMARY_CLASSIFICATION',
      label: '一级分类',
      width: 110,
      showOverflowTooltip: true
    },
    {
      prop: 'SECONDARY_CLASSIFICATION',
      label: '二级分类',
      width: 110,
      showOverflowTooltip: true
    },
    { prop: 'RECLASSIFY', label: '三级分类', width: 110, showOverflowTooltip: true },
    {
      prop: 'SIGN_OF_CHARGE_TO_AN_ACCOUNT',
      label: '记账标志',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'MEDICARE_PAYMENT_CAP',
      label: '医保支付上限',
      width: 140,
      align: 'right',
      showOverflowTooltip: true
    },
    {
      prop: 'TYPE_OF_PRODUCTION_PLACE',
      label: '进口/国产',
      width: 120,
      showOverflowTooltip: true
    },
    { prop: 'YBCLASS', label: '材料分类', width: 110, showOverflowTooltip: true },
    {
      prop: 'BASIC_MEDICAL_INSURANCE_START',
      label: '基本医保启用标志',
      width: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'LAUNCH_DATE_OF_BASIC_MEDICAL',
      label: '启用日期(基本医保)',
      width: 160,
      slot: 'LAUNCH_DATE_OF_BASIC_MEDICAL'
    },
    {
      prop: 'TERMINATION_DATE_OF_BASIC_HEAL',
      label: '终止日期(基本医保)',
      width: 160,
      slot: 'TERMINATION_DATE_OF_BASIC_HEAL'
    },
    { prop: 'YG_CODE', label: '阳光产品码', width: 120, showOverflowTooltip: true },
    { prop: 'YG_SPE_TYPE', label: '阳光规格型号码', width: 140, showOverflowTooltip: true },
    { prop: 'SOURCE_FROM', label: '来源', width: 100, showOverflowTooltip: true },
    { prop: 'IN_MATERIAL', label: '集采耗材', width: 120, showOverflowTooltip: true },
    {
      prop: 'RESTRICTIVE_SPECIFICATION',
      label: '项目说明',
      width: 120,
      showOverflowTooltip: true
    }
  ];
}

const EXPORT_HEADER = [
  '状态',
  '类型',
  '审核时间',
  '是否收费',
  '耗材物品编码',
  '计费编码',
  '供应商',
  '医保编码',
  '医保27位编码',
  '注册证号',
  '注册证名称',
  '品种名称',
  '规格型号',
  '生产企业',
  '品牌',
  '医保码目录名称',
  '一级分类',
  '二级分类',
  '三级分类',
  '中标价',
  '单位',
  '记账标志',
  '医保支付上限',
  '进口/国产',
  '材料分类',
  '基本医保启用标志',
  '启用日期(基本医保)',
  '终止日期(基本医保)',
  '阳光产品码',
  '阳光规格型号码',
  '来源',
  '集采耗材',
  '项目说明',
  '备注'
];

function buildExportRow(row) {
  return [
    formatSendYbState(row.SENDYB_STATE),
    formatSendYbType(row.SENDYB_TYPE),
    formatLogTime(row.LOG_TIME),
    formatIsCharge(row.IS_CHARGE),
    row.VARIETIE_CODE_NEW,
    row.CHARGING_CODE,
    row.SUPPLIER_NAME,
    row.MEDICAL_CODE,
    row.MEDICAL_CODE27,
    row.APPROVAL_NUMBER,
    row.PROD_REGISTRATION_NAME,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.MANUFACTURING_ENT_NAME,
    row.BRAND,
    row.NAME_OF_MEDICAL_INSURANCE_CATA,
    row.THE_PRIMARY_CLASSIFICATION,
    row.SECONDARY_CLASSIFICATION,
    row.RECLASSIFY,
    row.PRICE,
    row.UNIT,
    row.SIGN_OF_CHARGE_TO_AN_ACCOUNT,
    row.MEDICARE_PAYMENT_CAP,
    row.TYPE_OF_PRODUCTION_PLACE,
    row.YBCLASS,
    row.BASIC_MEDICAL_INSURANCE_START,
    formatDateOnly(row.LAUNCH_DATE_OF_BASIC_MEDICAL),
    formatDateOnly(row.TERMINATION_DATE_OF_BASIC_HEAL),
    row.YG_CODE,
    row.YG_SPE_TYPE,
    row.SOURCE_FROM,
    row.IN_MATERIAL,
    row.RESTRICTIVE_SPECIFICATION,
    row.SP_REMARK
  ];
}

export function exportYgVarClSmExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '物价审核目录.xlsx');
}
