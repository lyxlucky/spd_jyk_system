/** 查看页固定 WJ_AUTH，与旧页 YGVARCLLOOK_SM.cshtml 一致 */
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

export const LOOK_SENDYB_STATE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '初筛已确认', value: '3' },
  { label: '耗材组采购已审核', value: '4' },
  { label: '耗材组库管已审核', value: '5' },
  { label: '物价已准入', value: '6' },
  { label: '已同步推送his', value: '12' }
];

/** 查看页状态列文案（与旧页 table templet 一致） */
export function formatLookSendYbState(value) {
  const map = {
    '1': '',
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
