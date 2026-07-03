import { utils, writeFile } from 'xlsx';
import {
  formatIsCharge,
  formatYbbiaoji,
  formatLogTime,
  formatDateOnly,
  isMedicalCodeMismatch,
  isTerminationExpired
} from '@/views/Home/YgVarClSm/utils';

export {
  formatIsCharge,
  formatYbbiaoji,
  formatLogTime,
  formatDateOnly,
  isMedicalCodeMismatch,
  isTerminationExpired
};

export function defaultFilters() {
  return {
    VARIETIE_CODE_NEW: '',
    APPROVAL_NUMBER: '',
    VARIETIE_NAME: '',
    GGXH: '',
    ISDM: '',
    IS_CHARGE: '',
    YBBIAOJI: '0',
    SUPPLIER_NAME: '',
    YGVARCL_END_START: '',
    YGVARCL_END_END: '',
    ygCode: '',
    REMARK: '',
    SENDYB_STATE: ''
  };
}

export const SENDYB_STATE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未初筛', value: '1' },
  { label: '已初筛', value: '2' },
  { label: '初筛已确认', value: '3' },
  { label: '采购已审核', value: '4' },
  { label: '组长已审核', value: '5' },
  { label: '医装部负责人已审核', value: '6' },
  { label: '物价已初审', value: '7' },
  { label: '物价已准入', value: '10' },
  { label: 'his已获取', value: '11' },
  { label: '计费编码已同步', value: '12' }
];

/** 表格「审核节点」列 */
export function formatAuditNode(value) {
  const map = {
    '1': '',
    '2': '已初筛',
    '3': '初筛已确认',
    '4': '采购已审核',
    '5': '组长已审核',
    '6': '医装部负责人已审核',
    '7': '物价已初审',
    '10': '物价已准入',
    '11': 'his已获取',
    '12': '计费编码已同步',
    '-1': '忽略'
  };
  return map[value] ?? value ?? '';
}

/** 表格「审核意见」列 */
export function formatAuditOpinion(row) {
  const state = String(row.SENDYB_STATE ?? '');
  if (['1', '11', '12', '-1'].includes(state)) return '';
  if (['2', '3', '4', '5', '6', '7', '10'].includes(state)) {
    return row.YB_SP_MARK ?? '';
  }
  return '';
}

function formatExportAuditNode(value) {
  const map = {
    '1': '',
    '2': '已初筛',
    '3': '初筛已确认',
    '4': '采购审核',
    '5': '组长审核',
    '6': '部门负责人审核',
    '7': '物价初审',
    '10': '物价审核',
    '11': 'his已获取',
    '12': '计费编码已同步',
    '-1': '忽略'
  };
  return map[value] ?? value ?? '';
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
      label: '审核节点',
      width: 120,
      align: 'center',
      slot: 'SENDYB_STATE'
    },
    {
      prop: 'YB_SP_MARK',
      label: '审核意见',
      width: 120,
      showOverflowTooltip: true,
      slot: 'YB_SP_MARK'
    },
    {
      prop: 'LOG_TIME',
      label: '审批时间',
      width: 140,
      showOverflowTooltip: true,
      slot: 'LOG_TIME'
    },
    { prop: 'SP_REMARK', label: '备注', width: 100, showOverflowTooltip: true },
    {
      prop: 'IS_CHARGE',
      label: '是否收费',
      width: 90,
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
      width: 120,
      showOverflowTooltip: true
    },
    { prop: 'CHARGING_CODE', label: '计费编码', width: 100, showOverflowTooltip: true },
    { prop: 'CONTRACT_CODE', label: '合同号', width: 120, showOverflowTooltip: true },
    { prop: 'CONTRACT_START_TIME', label: '合同起始时间', width: 160, showOverflowTooltip: true },
    { prop: 'CONTRACT_END_TIME', label: '合同结束时间', width: 160, showOverflowTooltip: true },
    { prop: 'SUPPLIER_NAME', label: '供应商', width: 140, showOverflowTooltip: true },
    {
      prop: 'MEDICAL_CODE',
      label: '医保编码',
      width: 160,
      showOverflowTooltip: true,
      slot: 'MEDICAL_CODE'
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
    { prop: 'PRICE', label: '中标价', width: 90, align: 'right' },
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
      width: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'MEDICARE_PAYMENT_CAP',
      label: '医保支付上限',
      width: 120,
      align: 'right',
      showOverflowTooltip: true
    },
    {
      prop: 'TYPE_OF_PRODUCTION_PLACE',
      label: '进口/国产',
      width: 100,
      showOverflowTooltip: true
    },
    { prop: 'YBCLASS', label: '材料分类', width: 110, showOverflowTooltip: true },
    {
      prop: 'BASIC_MEDICAL_INSURANCE_START',
      label: '基本医保启用标志',
      width: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'LAUNCH_DATE_OF_BASIC_MEDICAL',
      label: '启用日期(基本医保)',
      width: 150,
      slot: 'LAUNCH_DATE_OF_BASIC_MEDICAL'
    },
    {
      prop: 'TERMINATION_DATE_OF_BASIC_HEAL',
      label: '终止日期(基本医保)',
      width: 150,
      slot: 'TERMINATION_DATE_OF_BASIC_HEAL'
    },
    { prop: 'YG_CODE', label: '阳光产品码', width: 100, showOverflowTooltip: true },
    { prop: 'YG_SPE_TYPE', label: '阳光规格型号码', width: 120, showOverflowTooltip: true },
    { prop: 'SOURCE_FROM', label: '来源', width: 100, showOverflowTooltip: true },
    { prop: 'IN_MATERIAL', label: '集采耗材', width: 80, showOverflowTooltip: true },
    {
      prop: 'RESTRICTIVE_SPECIFICATION',
      label: '项目说明',
      width: 120,
      showOverflowTooltip: true
    }
  ];
}

const EXPORT_HEADER = [
  '审核节点',
  '审核时间',
  '是否收费',
  '耗材物品编码',
  '计费编码',
  '合同号',
  '合同起始时间',
  '合同结束时间',
  '供应商',
  '医保编码',
  '注册证号',
  '注册证名称',
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
  '备注',
  '审核意见'
];

function buildExportRow(row) {
  return [
    formatExportAuditNode(row.SENDYB_STATE),
    formatLogTime(row.LOG_TIME),
    formatIsCharge(row.IS_CHARGE),
    row.VARIETIE_CODE_NEW,
    row.CHARGING_CODE,
    row.CONTRACT_CODE,
    row.CONTRACT_START_TIME,
    row.CONTRACT_END_TIME,
    row.SUPPLIER_NAME,
    row.MEDICAL_CODE,
    row.APPROVAL_NUMBER,
    row.PROD_REGISTRATION_NAME,
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
    row.SP_REMARK,
    row.YB_SP_MARK
  ];
}

export function exportYgVarClExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '物价审核目录.xlsx');
}
