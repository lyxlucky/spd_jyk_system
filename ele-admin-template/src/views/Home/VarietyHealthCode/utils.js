import {
  formatApprovalState,
  formatContractType,
  formatDeptState,
  formatEnable,
  formatHighOrLowTwo,
  formatStorageId,
  formatStseHisState,
  formatSyz,
  formatYesNo,
  isStseLikeHp,
  showVarCommitApproval,
  showVarietyPicColumn
} from '@/views/Home/VarietyDataLzhAudit/utils';
import { HOME_HP } from '@/config/setting';

export {
  formatApprovalState,
  formatContractType,
  formatDeptState,
  formatEnable,
  formatHighOrLowTwo,
  formatStorageId,
  formatStseHisState,
  formatSyz,
  formatYesNo,
  isStseLikeHp,
  showVarCommitApproval,
  showVarietyPicColumn
};

/** 医保码与医保目录码不一致（对码标红） */
export function isMedicalCodeMismatch(row) {
  if (row == null) return false;
  const code = row.MEDICAL_CODE;
  if (code == null || code === '') return false;
  return String(code) !== String(row.MEDICAL_INSURANCE_CODE ?? '');
}

/** stse / stzx / csyy 显示编辑、图片列；默认医院与老页一致不展示 */
export function showHealthCodeActionEdit(hp = HOME_HP) {
  return isStseLikeHp(hp) || hp === 'stzx' || hp === 'csyy';
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
    IS_YBDM: '',
    priceChangeTimeStart: '',
    priceChangeTimeEnd: '',
    APPROVAL_STATE: '',
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

export function formatDateTime(val) {
  if (!val || val === '0001-01-01T00:00:00') return '无';
  return String(val).replace('T', ' ').substring(0, 19);
}
