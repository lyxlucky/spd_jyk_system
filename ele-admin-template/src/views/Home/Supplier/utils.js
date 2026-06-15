import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const LEGACY_BASE = (BACK_BASE_URL || '').replace(/\/$/, '');

export function createDefaultWhere() {
  return {
    keyword: '',
    enable: '1',
    state: ''
  };
}

/** 院区/权限开关（与旧页 Supplier.cshtml 一致） */
export function buildSupplierHpFlags(permissionGroup = []) {
  const hasPerm = (keys) =>
    (permissionGroup || []).some((p) =>
      keys.some(
        (k) =>
          p.component === k ||
          p.Permission_Url === k ||
          p.PERMISSION_URL === k ||
          p.permission_url === k
      )
    );
  return {
    isStzx: ['stzx', 'stse', 'csyy'].includes(HOME_HP),
    isShowCw: ['stzyyy', 'chrmyy'].includes(HOME_HP),
    isSzhn: HOME_HP === 'szhn',
    hasScope: hasPerm(['Supplier_经营范围']),
    showZongMl: hasPerm(['总目录', '/Home/ZongMl']),
    disableEdit: hasPerm(['禁用供应商编辑'])
  };
}

export function formatEnable(val) {
  if (val === '0' || val === 0) return '停用';
  if (val === '1' || val === 1) return '启用';
  return val ?? '';
}

export function formatStopSend(val) {
  if (val === '1' || val === 1) return '是';
  return '否';
}

export function formatSupplierNature(val) {
  if (val === '0' || val === 0) return '经营型';
  if (val === '1' || val === 1) return '生产型';
  return val ?? '';
}

export function formatColdChain(val) {
  if (val === '0' || val === 0) return '具备';
  if (val === '1' || val === 1) return '不具备';
  return val ?? '';
}

export function isLongTerm(dateStr) {
  if (!dateStr || dateStr === '0001-01-01T00:00:00') return false;
  const year = parseInt(String(dateStr).substring(0, 4), 10);
  return year >= 2080;
}

export function formatValidDate(val, picField, row) {
  if (!val || val === '0001-01-01T00:00:00') return { text: '', clickable: false };
  const raw = String(val);
  const text = isLongTerm(raw) ? '长期' : raw.substring(0, raw.indexOf(' ') > 0 ? raw.indexOf(' ') : 10);
  const pic = picField ? row?.[picField] : '';
  return { text, clickable: !!(pic && pic !== '') };
}

export function proPicUrl(name) {
  if (!name) return '';
  const raw = String(name).trim();
  if (raw.indexOf('http') === 0) return raw;
  return `${LEGACY_BASE}/Upload/ProPic/${raw}`;
}

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  if (!fileName) return;
  window.open(`${LEGACY_BASE}${subPath}${fileName}`);
}

export function buildColumns(flags) {
  const cols = [
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
    { slot: 'action', label: '操作', width: 360, align: 'center', fixed: 'left' }
  ];
  if (flags.isShowCw) {
    cols.push({ slot: 'cw', label: '财务属性', width: 90, align: 'center', fixed: 'left' });
  }
  cols.push(
    { slot: 'enable', prop: 'Enable', label: '启用状态', width: 80, align: 'center', sortable: 'custom' },
    { prop: 'Supplier_Code', label: '供应商编码', minWidth: 110, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'QXBZ', label: '缺项备注', minWidth: 110, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商名称', minWidth: 200, sortable: 'custom', showOverflowTooltip: true },
    { slot: 'stopSend', prop: 'STOP_SEND', label: '停止配送', width: 80, align: 'center', sortable: 'custom' },
    { prop: 'SOCIAL_CREDIT_CODE', label: '社会统一信用代码', minWidth: 180, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Licence_File_Full_Name', label: '企业地址', minWidth: 180, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Contact_Phone2', label: '企业电话', minWidth: 110, sortable: 'custom', showOverflowTooltip: true },
    { slot: 'sealPic', prop: 'OFFICIAL_SEAL_PICTURE', label: '送货章图片', width: 100, align: 'center' },
    { slot: 'busLic', prop: 'Business_License_Valid_Date', label: '营业执照效期', minWidth: 120, sortable: 'custom' },
    { slot: 'class1', prop: 'RODUCTION_CLASS_1_VALID_DATE', label: '一类许可证有效期', minWidth: 130, sortable: 'custom' },
    { slot: 'class2', prop: 'Roduction_class_2_Valid_Date', label: '二类许可证有效期', minWidth: 130, sortable: 'custom' },
    { slot: 'class3', prop: 'Roduction_class_3_Valid_Date', label: '三类许可证有效期', minWidth: 130, sortable: 'custom' },
    { prop: 'THIRD_LICENSE_NUMBER', label: '第三类经营许可证号', minWidth: 150, showOverflowTooltip: true },
    { slot: 'drDate', prop: 'DR_VALID_DATE', label: '体外诊断试剂经营许可证有效期', minWidth: 160, sortable: 'custom' },
    { slot: 'wtsDate', prop: 'WTS_VALID_DATE', label: '业务员委托书有效期', minWidth: 140, sortable: 'custom' },
    { slot: 'gxDate', prop: 'GX_VALIDITY_PERIOD', label: '购销合同有效期', minWidth: 120, sortable: 'custom' },
    { prop: 'Contact_Person', label: '业务员姓名', minWidth: 110, showOverflowTooltip: true },
    { prop: 'YWY_PEO_ID', label: '业务员身份证号', minWidth: 130, showOverflowTooltip: true },
    { prop: 'Contact_Phone', label: '业务员联系电话', minWidth: 120, showOverflowTooltip: true },
    { slot: 'nature', prop: 'Supplier_Nature', label: '供应商性质', minWidth: 100, sortable: 'custom' },
    { slot: 'coldChain', prop: 'Cold_Chain_Apparatus_Supply', label: '冷链器械供应条件', minWidth: 130, sortable: 'custom' }
  );
  if (flags.isStzx) {
    cols.push({
      prop: 'SUP_CODE_TWO',
      label: 'hrp供应商编码2',
      minWidth: 120,
      sortable: 'custom',
      showOverflowTooltip: true
    });
  }
  cols.push(
    { prop: 'Supplier_Code_Charging', label: '财务科供应商编码', minWidth: 130, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'File_Location', label: '档案位置', minWidth: 110, showOverflowTooltip: true },
    { prop: 'YG_SUP_CODE', label: '阳光平台编码', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Create_Time', label: '创建时间', minWidth: 110, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Last_Update_Time', label: '更新时间', minWidth: 110, sortable: 'custom', showOverflowTooltip: true },
    { slot: 'history', label: '历史图片', width: 90, align: 'center' }
  );
  return cols;
}
