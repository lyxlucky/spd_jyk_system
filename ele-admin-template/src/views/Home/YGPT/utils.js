import { utils, writeFile } from 'xlsx';

export function formatYesNo(val) {
  if (val === '1' || val === 1) return '是';
  if (val === '0' || val === 0) return '否';
  return val ?? '';
}

export function formatApprovalState(val) {
  if (val === '0' || val === 0) return '未审批';
  if (val === '1' || val === 1) return '已审批';
  if (val === '2' || val === 2) return '审批未通过';
  return val ?? '';
}

export function formatEnable(val) {
  if (val === '0' || val === 0) return '停用';
  if (val === '1' || val === 1) return '启用';
  return val ?? '';
}

export function isDiff(row, supKey, baseKey) {
  const sup = row[supKey];
  if (sup == null || sup === '') return false;
  return String(sup) !== String(row[baseKey] ?? '');
}

export function createDefaultWhere() {
  return {
    search: '',
    state: '0',
    is_yg_code: '',
    is_yg_spe_code: '',
    YGPTis_MEDICAL_CODE: '',
    YGPTis_MEDICAL_CODE27: '',
    YGPTis_pro: '',
    YGPTis_UDI: '',
    YGPTis_IS_CHARGE: '',
    YGPT_ISENABLE: '',
    YGPT_YLQX: ''
  };
}

const EXPORT_HEADERS = [
  '品种编码',
  '品种名称',
  '产品码',
  '规格型号码',
  '医保编码',
  '医保编码27位',
  '省平台编码',
  'UDI',
  '是否收费',
  '规格型号',
  '单位',
  '生产企业',
  '批准文号',
  '供应商名称',
  '合同名称',
  '阳光产品码(填写)',
  '阳光规格型号码(填写)',
  '医保编码(填写)',
  '医保编码27位(填写)',
  '省平台编码(填写)',
  'UDI(填写)',
  '是否收费(填写)',
  '审批状态',
  '启用',
  '阳光产品名称',
  '阳光规格',
  '阳光型号',
  '阳光批准文号',
  '阳光生产厂家'
];

export function exportYgptExcel(rows, filename = '品种资料审核.xlsx') {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    data.push([
      row.VARIETIE_CODE_NEW,
      row.VARIETIE_NAME,
      row.YG_CODE,
      row.YG_SPE_TYPE,
      row.MEDICAL_CODE,
      row.MEDICAL_CODE27,
      row.PROVINCE_PLATFORM_CODE,
      row.UDI_TOP,
      formatYesNo(row.IS_CHARGE),
      row.SPECIFICATION_OR_TYPE,
      row.UNIT,
      row.MANUFACTURING_ENT_NAME,
      row.APPROVAL_NUMBER,
      row.SUPPLIER_NAME,
      row.CONTRACT_NAME,
      row.SUP_YG_CODE,
      row.SUP_YG_SPE_TYPE,
      row.SUP_MEDICAL_CODE,
      row.SUP_MEDICAL_CODE27,
      row.SUP_PROVINCE_PLATFORM_CODE,
      row.SUP_UDI_TOP,
      row.SUP_IS_CHARGE,
      formatApprovalState(row.SUP_YG_STATE),
      formatEnable(row.ENABLE),
      row.CPMC,
      row.GG,
      row.XH,
      row.ZCZH,
      row.SCCS
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, filename);
}

/** 审批通过类型（对应 ApprovalYGPT 的 state 参数，与旧页 sp_ygpt 一致） */
export const APPROVAL_STATE_MAP = {
  1: '全部审批 — 一次性同步全部填写字段',
  2: '阳光码审批 — 产品码/规格型号码',
  3: '医保编码审批',
  4: '省平台编码审批',
  5: 'UDI审批'
};

/** 下拉：全部 / 已填写 / 未填写 */
export const fillOptions = [
  { label: '全部', value: '' },
  { label: '已填写', value: '1' },
  { label: '未填写', value: '0' }
];
