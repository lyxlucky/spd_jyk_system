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

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  if (!fileName) return;
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  window.open(`${base}${subPath}${fileName}`);
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
