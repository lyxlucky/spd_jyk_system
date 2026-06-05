import { utils, writeFile } from 'xlsx';

export const SOURCE_OPTIONS = [
  { value: '', label: '全部' },
  { value: '备选目录', label: '备选目录' },
  { value: '2020省集采目录(试剂)', label: '2020省集采目录(试剂)' },
  { value: '2020国家集采目录', label: '2020国家集采目录' },
  { value: '定价目录', label: '定价目录' },
  { value: '限价目录', label: '限价目录' },
  { value: '2020省集采目录(球囊)', label: '2020省集采目录(球囊)' }
];

export const ISDMYZ_OPTIONS = [
  { value: '', label: '全部' },
  { value: '1', label: '医保编码20位一致' },
  { value: '2', label: '医保编码20位不一致' },
  { value: '3', label: '医保编码27位一致' },
  { value: '4', label: '医保编码27位不一致' },
  { value: '5', label: 'UDI码一致' },
  { value: '6', label: 'UDI码不一致' }
];

export function defaultFilters() {
  return {
    varName: '',
    varGgxh: '',
    supplier: '',
    reg: '',
    mea: '',
    ly: '',
    isDm: '',
    isSend: '',
    isPrice: '',
    isEnbale: '',
    isHtSx: '1',
    isMark: '',
    isDmYz: ''
  };
}

export function formatYgSendTime(value) {
  if (!value || value === '0001-01-01T00:00:00') return '';
  return String(value).slice(0, 10);
}

export function formatSpecType(row) {
  const gg = row.OUTLOOKC || '';
  const xh = row.GOODSTYPE || '';
  return `${xh}/${gg}`;
}

export function isMedicalCodeMismatch(row) {
  return row.MEDICAL_CODE != row.PRODUCTCODE;
}

export function isMedicalCode27Mismatch(row) {
  const platform27 = `${row.PRODUCTCODE || ''}${row.NUMBERCODE || ''}`;
  return row.MEDICAL_CODE27 != platform27;
}

export function isUdiMismatch(row) {
  if (row.UDI_TOP == null) return false;
  return row.UDI_TOP != row.UDICODE;
}

export function formatYgCanSend(value) {
  return value === '1' ? '是' : '否';
}

const EXPORT_HEADER = [
  '来源',
  '是否发送',
  '阳光合同',
  '采购类别',
  '配送商编码',
  '配送商',
  '产品码',
  '规格型号码',
  '医保编码(平台)',
  '医保编码后7位(平台)',
  '医保编码27位(平台)',
  'udi(平台)',
  '产品名',
  '规格/型号',
  '采购价格',
  '单位',
  '注册证',
  '分类',
  '一级目录',
  '二级目录',
  '三级目录',
  '品牌',
  '投标企业',
  'SPD供应商名称',
  'SPD启用合同供应商名称',
  'SPD供应商阳光平台',
  'SPD品种编码',
  'SPD品种名称',
  'SPD规格型号',
  'SPD中标价格',
  'SPD合同结算价格',
  'SPD单位',
  'SPD注册证',
  'SPD生产企业',
  'SPD合同名称',
  '添加时间',
  '发送起始时间',
  '转换比基础资料',
  '推荐转换比',
  '医保编码(SPD)',
  '医保编码是否一致',
  '医保编码27位(SPD)',
  '医保编码27位是否一致',
  'UDI(SPD)',
  'UDI是否一致'
];

export function buildExportRow(row) {
  const platform27 =
    row.NUMBERCODE != null ? `${row.PRODUCTCODE || ''}${row.NUMBERCODE || ''}` : '';
  return [
    row.source,
    row.YG_IS_CAN_SEND === '1' ? '是' : '否',
    row.CONTRACTSTATUS,
    row.purchaseType,
    row.COMPANYIDPS,
    row.companyNamePs,
    row.GOODSID,
    row.SUBCODEID,
    row.PRODUCTCODE,
    row.NUMBERCODE,
    platform27,
    row.UDICODE,
    row.goodsName,
    `${row.GOODSTYPE || ''}/${row.OUTLOOKC || ''}`,
    row.purchasePrice,
    row.MINUNITSALE,
    row.regcodeName,
    row.sortName,
    row.productNameFirst,
    row.productNameSecond,
    row.productNameThree,
    row.brand,
    row.companyNameTb,
    row.SUPPLIER_NAME,
    row.CON_SUPPLIER_NAME,
    row.YG_SUP_CODE,
    row.VARIETIE_CODE_NEW,
    row.VARIETIE_NAME,
    row.SPECIFICATION_OR_TYPE,
    row.PRICE,
    row.CON_SUPPLY_PRICE,
    row.UNIT,
    row.APPROVAL_NUMBER,
    row.MANUFACTURING_ENT_NAME,
    row.CON_CONTRACT_NAME,
    row.addTime,
    formatYgSendTime(row.YG_SEND_BEGIN_TIME),
    row.YG_ZH_COUNT,
    row.TJ_YG_ZH_COUNT,
    row.MEDICAL_CODE,
    row.MEDICAL_CODE === row.PRODUCTCODE ? '是' : '否',
    row.MEDICAL_CODE27,
    row.MEDICAL_CODE27 === platform27 ? '是' : '否',
    row.UDI_TOP,
    row.UDI_TOP === row.UDICODE ? '是' : '否'
  ];
}

export function exportYgVarInfoPage(rows, page) {
  const data = [EXPORT_HEADER, ...(rows || []).map(buildExportRow)];
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, `页码${page}阳光本院目录.xlsx`);
}
