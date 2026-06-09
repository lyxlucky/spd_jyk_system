import { HOME_HP } from '@/config/setting';

/** B2B 院区编码（剔除品种等） */
const B2B_HOSPITAL_MAP = {
  bd: 'BH00001',
  bdrm: 'BH00261',
  lg: 'BH00002',
  stzl: 'BH00003',
  nyd: 'BH00004',
  szlh: 'BH00005',
  zq: 'BH00006',
  spd: 'BH00041',
  stzx: 'BH00007',
  stse: 'BH00008',
  fszxy: 'BH00009',
  szhn: 'BH00010',
  csyy: 'BH00011',
  stzyyy: 'BH00012',
  fsdwrmyy: 'BH00013',
  szlhfy: 'BH00014',
  szlhyy: 'BH00014',
  szsmyl: 'BH00015',
  fsdl: 'BH00017',
  chrmyy: 'BH00018',
  szse: 'BH00019',
  szse_lh: 'BH00020',
  szse_dp: 'BH00021',
  xh: 'BH00022'
};

export function getB2bHospitalCode(hp = HOME_HP) {
  return B2B_HOSPITAL_MAP[hp] || '';
}

/** 部分院区提交 HRP 后禁止保存/增加明细 */
export function isSaveAddDisabledByHrp(sendHrp) {
  const hp = HOME_HP;
  const alwaysDisabled = [
    'szhn',
    'stzl',
    'csyy',
    'fsdwrmyy',
    'fsdl',
    'szlhfy',
    'szsmyl',
    'szse',
    'szse_lh',
    'szse_dp',
    'xh'
  ];
  if (alwaysDisabled.includes(hp)) {
    return true;
  }
  const disabledWhenHrp = ['lg', 'bd', 'bdrm', 'fszxy', 'zq'];
  if (disabledWhenHrp.includes(hp) && String(sendHrp) === '1') {
    return true;
  }
  return false;
}

export function canDeleteVariety(sendState) {
  return ['0', '1', '2', '3', '4'].includes(String(sendState));
}

export function getStorageName(storageId) {
  if (String(storageId) === '1') return '院内库房';
  if (String(storageId) === '2') return '院外库房';
  return '未知库房';
}

export function warningRowStyle(warning) {
  const w = String(warning);
  if (w === '1') return { backgroundColor: '#F9D5D5' };
  if (w === '2') return { backgroundColor: '#A6E4F7' };
  return {};
}
