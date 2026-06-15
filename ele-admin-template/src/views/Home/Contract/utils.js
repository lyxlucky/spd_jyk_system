import { utils, writeFile } from 'xlsx';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const LEGACY_BASE = (BACK_BASE_URL || '').replace(/\/$/, '');

export function htPicUrl(name) {
  if (!name) return '';
  const raw = String(name).trim();
  if (raw.indexOf('http') === 0) return raw;
  return `${LEGACY_BASE}/Upload/Ht/${raw}`;
}

export function formatContractDate(val) {
  if (val == null || val === '') return '';
  const s = String(val).trim();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return s.substring(0, 10);
}

export function formatContractType(val) {
  if (val === '1' || val === 1) return '中标合同';
  if (val === '2' || val === 2) return '临采合同';
  return val ?? '';
}

export function formatEnableState(val) {
  if (val === 0 || val === '0') return '停用';
  if (val === 1 || val === '1') return '启用';
  return '未知状态';
}

export function formatYesNo(val) {
  if (val === '1' || val === 1) return '是';
  if (val === '0' || val === 0) return '否';
  return val ?? '';
}

/** 合同授权表「品种类型」：常规/平替（与旧页 getContractVarTypeText 一致） */
export function formatContractVarType(val) {
  if (val === '1' || val === 1) return '平替品种';
  if (val === '0' || val === 0) return '常规品种';
  return val ?? '';
}

export function formatVarType(val) {
  return formatContractVarType(val);
}

export function formatSupplyPrice(row) {
  const price = row?.supply_price;
  if (price == null || price === '') return '';
  const bl = row?.price_bl != null ? Number(row.price_bl) : 2;
  return Number(price).toFixed(bl);
}

export function formatLcNum(row) {
  if (row?.CONTRACT_TYPE === '2' || row?.CONTRACT_TYPE === 2) return row.LC_NUM ?? '';
  return '-';
}

export function buildContractHpFlags(permissionGroup = []) {
  const hasPerm = (keys) =>
    (permissionGroup || []).some((p) =>
      keys.some(
        (k) =>
          p.component === k ||
          p.Permission_Url === k ||
          p.PERMISSION_URL === k
      )
    );
  return {
    isCg: HOME_HP === 'szlh',
    isFsdwrmyy: HOME_HP === 'fsdwrmyy',
    isFszxy: HOME_HP === 'fszxy',
    isZq: HOME_HP === 'zq',
    showContactAll: hasPerm(['查看所有合同']) || HOME_HP !== 'lg'
  };
}

export function createAuthWhere() {
  return {
    varietie_code: '',
    varietie_name: '',
    specification_or_type: '',
    unit: '',
    manufacturing_ent_name: '',
    approval_number: '',
    TwoSupName: '',
    contract_code: ''
  };
}

export function buildAuthColumns(flags) {
  const cols = [
    { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
    {
      prop: 'Varietie_Code_New',
      label: '品种（材料）编码',
      minWidth: 180,
      sortable: 'custom',
      showOverflowTooltip: true
    }
  ];
  if (flags.isFsdwrmyy) {
    cols.push({
      prop: 'PROVINCE_PLATFORM_CODE',
      label: '省平台编码',
      minWidth: 120,
      sortable: 'custom',
      showOverflowTooltip: true
    });
  }
  cols.push(
    { prop: 'varietie_name', label: '品种全称', minWidth: 140, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'specification_or_type', label: '型号/规格', minWidth: 140, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'unit', label: '单位', minWidth: 80, sortable: 'custom', align: 'center' },
    {
      prop: 'manufacturing_ent_name',
      label: '生产企业名称',
      minWidth: 160,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      slot: 'supplyPrice',
      prop: 'supply_price',
      label: '结算价',
      minWidth: 100,
      align: 'right',
      sortable: 'custom'
    }
  );
  if (flags.isCg) {
    cols.push({
      prop: 'purchase_price',
      label: '采购价格',
      minWidth: 100,
      align: 'right',
      sortable: 'custom',
      formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(4) : '')
    });
  }
  cols.push(
    { prop: 'approval_number', label: '批准文号', minWidth: 180, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'registration_issuing_date',
      label: '发证日期',
      minWidth: 120,
      sortable: 'custom',
      formatter: (_r, _c, v) => formatContractDate(v)
    },
    {
      prop: 'registration_valid_date',
      label: '有效到期',
      minWidth: 120,
      sortable: 'custom',
      formatter: (_r, _c, v) => formatContractDate(v)
    },
    {
      slot: 'authValid',
      prop: 'Auth_Valid',
      label: '授权到期',
      minWidth: 120,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      slot: 'enable',
      prop: 'is_enable',
      label: '启用状态',
      minWidth: 120,
      align: 'center',
      sortable: 'custom'
    },
    { prop: 'prod_big_class_name', label: '产品类型', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'mgmt_cat_name', label: '管理类别', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'regulatory_cat_name', label: '监管类别', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'TwoSupCode', label: '二级供应商编码', minWidth: 180, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'TwoSupName', label: '二级供应商名称', minWidth: 180, sortable: 'custom', showOverflowTooltip: true },
    {
      slot: 'varType',
      prop: 'VAR_TYPE',
      label: '品种类型',
      minWidth: 120,
      sortable: 'custom'
    }
  );
  if (!flags.isFszxy) {
    cols.push(
      { prop: 'DET_CONTRACT_CODE', label: '明细合同编码', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
      {
        slot: 'detStart',
        prop: 'DET_CONTRACT_START',
        label: '合同明细起始',
        minWidth: 160,
        sortable: 'custom',
        showOverflowTooltip: true
      },
      {
        slot: 'detEnd',
        prop: 'DET_CONTRACT_END',
        label: '合同明细结束',
        minWidth: 160,
        sortable: 'custom',
        showOverflowTooltip: true
      }
    );
  }
  cols.push(
    {
      prop: 'ORIGINAL_DET_CONTRACT_END',
      label: '原合同明细结束',
      minWidth: 160,
      sortable: 'custom',
      formatter: (_r, _c, v) => formatContractDate(v)
    },
    { prop: 'AUDIT_TJ_MARK', label: '明细备注', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'AUDIT_MARK', label: '明细审核备注', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
    {
      slot: 'extended',
      prop: 'IS_EXTENDED',
      label: '是否延期合同',
      minWidth: 160,
      align: 'center',
      sortable: 'custom'
    },
    {
      slot: 'lcNum',
      prop: 'LC_NUM',
      label: '临采限量',
      minWidth: 120,
      align: 'center'
    }
  );
  return cols;
}

const EXPORT_HEADERS = [
  '品种（材料）编码',
  '省平台编码',
  '品种全称',
  '型号/规格',
  '单位',
  '生产企业名称',
  '结算价',
  '采购价格',
  '中标价',
  '批准文号',
  '发证日期',
  '有效到期',
  '授权到期',
  '启用状态',
  '产品类型',
  '管理类别',
  '监管类别',
  '二级供应商编码',
  '二级供应商名称',
  '合同编码',
  '明细合同编码',
  '合同明细起始',
  '合同明细结束',
  '原合同明细结束',
  '明细备注',
  '明细审核备注',
  '是否延期合同',
  '临采限量'
];

/** 与旧页 exportContractAuthTable 列顺序一致 */
export function exportContractAuthExcel(rows, filename = '合同授权品种.xlsx') {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    data.push([
      row.Varietie_Code_New,
      row.PROVINCE_PLATFORM_CODE || '',
      row.varietie_name,
      row.specification_or_type,
      row.unit,
      row.manufacturing_ent_name,
      row.supply_price,
      row.purchase_price || '',
      row.price || '',
      row.approval_number,
      formatContractDate(row.registration_issuing_date),
      formatContractDate(row.registration_valid_date),
      formatContractDate(row.Auth_Valid),
      formatEnableState(row.is_enable),
      row.prod_big_class_name,
      row.mgmt_cat_name,
      row.regulatory_cat_name,
      row.TwoSupCode,
      row.TwoSupName,
      row.contract_code || '',
      row.DET_CONTRACT_CODE || '',
      formatContractDate(row.DET_CONTRACT_START),
      formatContractDate(row.DET_CONTRACT_END),
      formatContractDate(row.ORIGINAL_DET_CONTRACT_END),
      row.AUDIT_TJ_MARK || '',
      row.AUDIT_MARK || '',
      row.IS_EXTENDED == '1' ? '是' : '否',
      formatLcNum(row)
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, filename);
}

export const CONTRACT_IMPORT_TEMPLATES = {
  contractMain: {
    fileName: '合同导入模板.xlsx',
    headers: ['供应商名称', '合同编码', '合同类型', '合同开始', '合同结束'],
    sample: ['', '', '', 'yyyy-MM-dd', 'yyyy-MM-dd']
  },
  contractDetail: {
    fileName: '合同明细导入模板.xlsx',
    headers: ['品种编码', '合同编码', '授权到期', '明细开始', '明细结束'],
    sample: ['', '', 'yyyy-MM-dd', 'yyyy-MM-dd', 'yyyy-MM-dd']
  },
  contractDetailWithoutAuth: {
    fileName: '合同明细导入模板_无授权到期.xlsx',
    headers: ['品种编码', '合同编码', '明细开始', '明细结束'],
    sample: ['', '', 'yyyy-MM-dd', 'yyyy-MM-dd']
  },
  contractExtend: {
    fileName: '合同原结束延期导入模板.xlsx',
    headers: ['合同编码', '品种编码', '原明细结束', '是否延期'],
    sample: ['', '', 'yyyy-MM-dd', '是/否']
  },
  contractAuditMark: {
    fileName: '合同明细备注导入模板.xlsx',
    headers: ['合同编码', '品种编码', '合同明细备注'],
    sample: ['', '', '']
  },
  twoSupplier: {
    fileName: '授权供应商导入模板.xlsx',
    headers: ['合同编码', '品种编码', '供应商编码', '供应商名称'],
    sample: ['', '', '', '']
  }
};

export function downloadContractImportTemplate(type) {
  const config = CONTRACT_IMPORT_TEMPLATES[type];
  if (!config) return;
  const data = [config.headers, config.sample];
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, config.fileName);
}

const AUTH_CONTRACT_EXPORT_HEADERS = [
  '合同名称',
  '阳光产品码',
  '阳光规格型号码',
  '合同起始日期',
  '合同有效期',
  '合同授权到期',
  '品种编码',
  '品种名称',
  '通用名称',
  '规格型号',
  '单位',
  '分类属性',
  '批准文号',
  '生产企业',
  '注册证发证日期',
  '注册证有效日期',
  '监管类别名称',
  '管理类别名称',
  '产品大类名称',
  '省平台编码',
  '计费编码',
  '品种是否删除',
  '品种是否启用',
  '整箱数量',
  '中包装数量',
  'Di',
  '高低值分类',
  '是否计费',
  '是否植入',
  '是否介入',
  '是否sn码',
  '一次性灭菌包装',
  '仓库名称',
  '库存下限',
  '库存上限',
  '储存条件',
  '是否中标',
  '使用级别',
  '合同是否启用',
  '合同是否删除',
  '中标价',
  '消耗价',
  '采购价',
  '临采数量',
  '供应商名称',
  '营业执照有效期',
  '经营或生产许可证有效期',
  '联系人',
  '联系电话',
  '供应商是否启用',
  '供应商是否删除',
  '明细合同编码',
  '合同明细起始时间',
  '合同明细结束时间',
  '临采限量'
];

function clipDate(v) {
  if (v == null || v === '') return '';
  return String(v).substring(0, 10);
}

export function exportAuthContractInfoExcel(rows, filename = '授权合同信息.xlsx') {
  const data = [AUTH_CONTRACT_EXPORT_HEADERS];
  (rows || []).forEach((r) => {
    data.push([
      r.Contract_Name,
      r.YG_CODE,
      r.YG_SPE_TYPE,
      clipDate(r.CONTRACT_START_TIME),
      clipDate(r.CONTRACT_END_TIME),
      clipDate(r.AUTH_VALID),
      r.Varietie_Code_New,
      r.Varietie_Name,
      r.Common_Name,
      r.Specification_Or_Type,
      r.Unit,
      r.Classific_Name,
      r.Approval_Number,
      r.Manufacturing_Ent_Name,
      clipDate(r.Registration_Issuing_Date),
      clipDate(r.Registration_Valid_Date),
      r.Regulatory_Cat_Name,
      r.Mgmt_Cat_Name,
      r.Prod_Big_Class_Name,
      r.Province_Platform_Code,
      r.Charging_Code,
      r.Var_Is_Del,
      r.Var_Enable,
      r.Big_Box_Count,
      r.Middle_Package_Count,
      r.Di,
      r.High_Or_Low_Class,
      r.Is_Charge,
      r.Is_Embedded,
      r.Is_Intervened,
      r.Is_Serial_Number,
      r.Oneoff_Sterilization_Packaging,
      r.Name,
      r.Storehouse_Lower,
      r.Storehouse_Uppper,
      r.Storage_Type,
      r.Is_Bidding,
      r.Use_Level,
      r.Con_Dtl_Is_Enable,
      r.Con_Dtl_Is_Del,
      r.Price,
      r.Supply_Price,
      r.Purchase_Price,
      r.LC_NUM,
      r.Supplier_Name,
      clipDate(r.Business_License_Valid_Date),
      clipDate(r.Roduction_License_Valid_Date),
      r.Contact_Person,
      r.Contact_Phone,
      r.Supplier_Enable,
      r.Supplier_Is_Del,
      r.DET_CONTRACT_CODE,
      clipDate(r.DET_CONTRACT_START),
      clipDate(r.DET_CONTRACT_END),
      r.LC_NUM
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, filename);
}

const CONTACT_ALL_VAR_HEADERS = [
  '品种编码',
  '品种名称',
  '规格型号',
  '价格',
  '单位',
  '合同名称',
  '合同编码',
  '供应商名称',
  '临购数量'
];

export function exportContactAllVarExcel(rows, filename = '合同品种列表.xlsx') {
  const data = [CONTACT_ALL_VAR_HEADERS];
  (rows || []).forEach((r) => {
    data.push([
      r.VARIETIE_CODE_NEW,
      r.VARIETIE_NAME,
      r.SPECIFICATION_OR_TYPE,
      r.PRICE,
      r.UNIT,
      r.CONTRACT_NAME,
      r.CONTRACT_CODE,
      r.SUPPLIER_NAME,
      r.LC_NUM
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['Sheet1'], Sheets: { Sheet1: sheet } }, filename);
}

export function buildAuthContractColumns() {
  return [
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
    { prop: 'Contract_Name', label: '合同名称', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商名称', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种编码', width: 110, showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种名称', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 70, align: 'center' },
    { prop: 'Price', label: '中标价', width: 90, align: 'right' },
    { prop: 'Supply_Price', label: '消耗价', width: 90, align: 'right' },
    { prop: 'Purchase_Price', label: '采购价', width: 90, align: 'right' },
    {
      prop: 'CONTRACT_START_TIME',
      label: '合同起始',
      width: 110,
      formatter: (_r, _c, v) => clipDate(v)
    },
    {
      prop: 'CONTRACT_END_TIME',
      label: '合同有效期',
      width: 110,
      formatter: (_r, _c, v) => clipDate(v)
    },
    {
      prop: 'AUTH_VALID',
      label: '授权到期',
      width: 110,
      formatter: (_r, _c, v) => clipDate(v)
    }
  ];
}

export function buildContactAllColumns() {
  return [
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 140, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'ENABLE',
      label: '供应商状态',
      width: 90,
      align: 'center',
      formatter: (_r, _c, v) => (v == 1 ? '启用' : '停用')
    },
    {
      prop: 'CONTRACT_STATE',
      label: '合同状态',
      width: 90,
      align: 'center',
      formatter: (_r, _c, v) => (v == 1 ? '启用' : '停用')
    },
    { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 140, showOverflowTooltip: true },
    { prop: 'CONTRACT_CODE', label: '合同编码', width: 120, showOverflowTooltip: true },
    {
      prop: 'CONTRACT_START_TIME',
      label: '合同启用时间',
      width: 120,
      sortable: 'custom',
      formatter: (_r, _c, v) => (v ? String(v).replace('0:00:00', '').trim() : '')
    },
    {
      prop: 'CONTRACT_END_TIME',
      label: '合同终止时间',
      width: 120,
      sortable: 'custom',
      formatter: (_r, _c, v) => (v ? String(v).replace('0:00:00', '').trim() : '')
    },
    { prop: 'VAR_QTY', label: '品规数', width: 80, align: 'center', sortable: 'custom' },
    { slot: 'limitPrice', prop: 'LIMIT_SUM_PRICE', label: '合同金额', width: 100, align: 'center', sortable: 'custom' },
    {
      prop: 'usePrice',
      label: '消耗金额',
      width: 100,
      align: 'right',
      sortable: 'custom',
      formatter: (_r, _c, v) => (v != null ? Number(v).toFixed(2) : '')
    },
    {
      prop: 'ProportionAmount',
      label: '消耗金额占比',
      width: 110,
      align: 'right',
      sortable: 'custom',
      formatter: (_r, _c, v) => (v != null ? `${Number(v).toFixed(2)}%` : '')
    },
    {
      prop: 'shPrice',
      label: '入库金额',
      width: 100,
      align: 'right',
      sortable: 'custom',
      formatter: (_r, _c, v) => (v != null ? Number(v).toFixed(2) : '')
    },
    {
      prop: 'shAmount',
      label: '入库金额占比',
      width: 110,
      align: 'right',
      sortable: 'custom',
      formatter: (_r, _c, v) => (v != null ? `${Number(v).toFixed(2)}%` : '')
    },
    { slot: 'actions', columnKey: 'actions', label: '操作', width: 100, align: 'center', fixed: 'right' }
  ];
}

export function mapContractDetail(raw) {
  if (!raw) return {};
  const item = { ...raw };
  [
    'contract_start_time',
    'contract_end_time',
    'roduction_license_valid_date',
    'business_license_valid_date',
    'qlty_assurance_prot_valid_date',
    'power_of_attorney_valid_date'
  ].forEach((k) => {
    item[k] = formatContractDate(item[k]);
  });
  ['create_time', 'last_update_time'].forEach((k) => {
    if (item[k]) item[k] = String(item[k]).replace('T', ' ').substring(0, 19);
  });
  if (item.contract_state != null) {
    item.contract_state_text =
      String(item.contract_state) === '1' ? '是' : String(item.contract_state) === '0' ? '否' : item.contract_state;
  }
  return item;
}
