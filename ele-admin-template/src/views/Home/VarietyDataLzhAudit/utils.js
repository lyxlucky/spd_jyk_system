import { BACK_BASE_URL } from '@/config/setting';

export function formatEnable(val) {
  if (val === '0' || val === 0) return '冻结';
  if (val === '1' || val === 1) return '启用';
  return val ?? '';
}

export function formatApprovalState(val) {
  if (val === '1' || val === 1) return '通过';
  if (val === '0' || val === 0) return '待审批';
  if (val === '2' || val === 2) return '未通过';
  return '未知';
}

export function formatContractType(val) {
  if (val === '1' || val === 1) return '中标';
  if (val === '0' || val === 0) return '临采';
  return '未知';
}

export function formatHighOrLowTwo(val) {
  if (val === '1' || val === 1) return '重点治理';
  if (val === '2' || val === 2) return '非重点治理';
  return '未设置';
}

export function formatYesNo(val) {
  if (val === '1' || val === 1) return '是';
  if (val === '0' || val === 0) return '否';
  return '未知';
}

export function formatDeptState(val) {
  if (val === '0') return '维护中';
  if (val === '1') return '修改中';
  if (val === '2') return '已提交';
  return '未知';
}

export function formatStseHisState(val) {
  if (val === '0' || val === 0) return '未同步';
  if (val === '1' || val === 1) return '已同步';
  return '未知状态';
}

export function formatStorageId(val) {
  if (val === 1 || val === '1') return '院内库房';
  if (val === 2 || val === '2') return '院外库房';
  return '未知库房';
}

export function formatSyz(val) {
  if (val === '1' || val === 1) return '是';
  if (val === '0' || val === 0) return '否';
  return '未知';
}

/** 权限项可命中的字段（对齐旧系统 Permission_Url / picVarPerm） */
function permFields(p) {
  if (!p) return [];
  return [
    p.title,
    p.component,
    p.path,
    p.Permission_Url,
    p.PERMISSION_URL,
    p.permission_name,
    p.PERMISSION_NAME,
    p.Permission_Name
  ].filter((v) => v != null && String(v).trim() !== '');
}

/** 菜单/按钮权限（对齐旧系统 Home.cshtml：permission[i].Permission_Url） */
export function hasMenuPermission(store, ...keys) {
  if (!keys.length) return true;
  const authorities = store?.state?.user?.authorities || [];
  const pg = store?.state?.user?.info?.permission_group || [];
  return keys.some((key) => {
    if (authorities.includes(key)) return true;
    return pg.some((p) => permFields(p).some((v) => v === key));
  });
}

/** 品种需审批：显示「发送审批」 */
export function showVarCommitApproval(store) {
  return hasMenuPermission(store, '品种需审批');
}

/** 品种基础资料审批：显示「审批通过/未通过」 */
export function showVarHerpApproval(store) {
  return hasMenuPermission(store, '品种基础资料审批');
}

/** 未禁用品种资料编辑时显示「修改日志」 */
export function showVarUpLogButton(store) {
  return !hasMenuPermission(store, '禁用品种资料编辑');
}

export function isStseLikeHp(hp) {
  return hp === 'stse' || hp === 'se2';
}

/** 品种资料审批页操作列「图片」（旧页 VarietyDataLzhAudit 各院区表格均含 varbarDemo3） */
export function showVarietyPicColumn(_hp) {
  return true;
}

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  if (!fileName) return;
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  window.open(`${base}${subPath}${fileName}`);
}

/** 清理 el-dialog / v-loading 关闭后可能残留的遮罩，避免页面无法点击 */
export function cleanupDialogOverlays() {
  document.body.classList.remove('el-popup-parent--hidden');
  const hasVisibleDialog = Array.from(document.querySelectorAll('.el-dialog__wrapper')).some(
    (el) => el.style.display !== 'none'
  );
  if (!hasVisibleDialog) {
    document.querySelectorAll('body > .v-modal').forEach((el) => el.remove());
  }
  document.querySelectorAll('body > .el-loading-mask').forEach((el) => el.remove());
  document.querySelectorAll('body > .viewer-container.viewer-fixed').forEach((el) => el.remove());
}

export function createDefaultWhere() {
  return {
    varietieCode: '',
    enable: '',
    IS_CHARGE: '-1',
    IS_BIDDING: '-1',
    SPECIAL_PURCHASE: '-1',
    ONEOFF_STERILIZATION_PACKAGING: '-1',
    STORAGE_TYPE: '-1',
    IS_EMBEDDED: '-1',
    IS_SERIAL_NUMBER: '-1',
    IS_INTERVENED: '-1',
    IS_PROTECT: '-1',
    HIGH_OR_LOW_CLASS: '-1',
    HIGH_OR_LOW_CLASS_TWO: '-1',
    IS_EQUIPMENT_CHANGE: '-1',
    HIGH_CLASS_XH: '',
    priceChangeTimeStart: '',
    priceChangeTimeEnd: '',
    APPROVAL_STATE: '0',
    vdzh_sx: '0',
    SCQY: '',
    SUP: '',
    Specification_Or_Type: '',
    ZCZ: '',
    VARYB_STATE: '',
    VARSB_STATE: '',
    VARJF_STATE: '',
    VARSPD_STATE: '',
    Y_M_P_CODE: '',
    UDI_TOP: '',
    filterKubao: false
  };
}
