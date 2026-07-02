import { utils, writeFile } from 'xlsx';
import { buildColumns, formatIsCharge, formatLogTime, formatDateOnly } from '@/views/Home/YgVarClSm/utils';

/** 与旧 YGVARCLLOOK.cshtml 一致 */
export const LOOK_WJ_AUTH_JSON = JSON.stringify([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '10',
  '11',
  '12'
]);

export function defaultLookFilters() {
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
    SENDYB_STATE: ''
  };
}

/** 审核状态下拉（与旧页 ybLOOK-SENDYB_STATE 一致） */
export const LOOK_SENDYB_STATE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未初筛', value: '1' },
  { label: '已初筛', value: '2' },
  { label: '初筛已确认', value: '3' },
  { label: '采购已审核', value: '4' },
  { label: '组长审核', value: '5' },
  { label: '医装部负责人已审核', value: '6' },
  { label: '物价已初审', value: '7' },
  { label: '物价已准入', value: '10' },
  { label: 'his已获取', value: '11' },
  { label: '计费编码已同步', value: '12' }
];

/** 表格状态列 */
export function formatLookSendYbState(value) {
  const map = {
    '1': '',
    '2': '已初筛',
    '3': '初筛已确认',
    '4': '采购已审核',
    '5': '组长审核',
    '6': '医装部负责人已审核',
    '7': '物价已初审',
    '10': '物价已准入',
    '11': 'his已获取',
    '12': '计费编码已同步',
    '-1': '忽略'
  };
  return map[value] ?? value ?? '';
}

/** 导出用状态文案（与旧 exportybLOOK 一致） */
function formatExportSendYbState(value) {
  const map = {
    '1': '',
    '2': '提交',
    '3': '确认提交',
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

export function buildLookColumns() {
  return buildColumns().filter(
    (col) => col.prop !== 'SENDYB_TYPE' && col.prop !== 'MEDICAL_CODE27'
  );
}

const EXPORT_HEADER = [
  '状态',
  '审核时间',
  '是否收费',
  '耗材物品编码',
  '计费编码',
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
  '备注'
];

function buildExportRow(row) {
  return [
    formatExportSendYbState(row.SENDYB_STATE),
    formatLogTime(row.LOG_TIME),
    formatIsCharge(row.IS_CHARGE),
    row.VARIETIE_CODE_NEW,
    row.CHARGING_CODE,
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
    row.SP_REMARK
  ];
}

export function exportYgVarClLookExcel(rows) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '物价审核目录.xlsx');
}
