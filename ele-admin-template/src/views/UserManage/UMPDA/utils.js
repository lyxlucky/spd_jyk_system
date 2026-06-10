import { HOME_HP } from '@/config/setting';
import { EncryptMd5 } from '@/utils/md5-util';

export const AUTH_LEVEL_OPTIONS = [
  { value: '1', label: '科室' },
  { value: '0', label: '中心库' },
  { value: '2', label: '超级管理员' },
  { value: '3', label: '手术室' }
];

const WEAK_PWD_SKIP_HP_ADD = [
  'stzx',
  'stzl',
  'stse',
  'csyy',
  'stzyyy',
  'chrmyy'
];

const WEAK_PWD_SKIP_HP_EDIT = ['stzx', 'stzl', 'stse', 'csyy'];

export function formatAuthLevel(level) {
  const val = String(level);
  if (val === '0') return '中心库权限';
  if (val === '1') return '科室权限';
  if (val === '2') return '超级管理员';
  if (val === '3') return '手术室';
  return '未知';
}

export function getPwdStrength(pwd) {
  let level = 1;
  if (pwd && pwd.length >= 8) {
    level += 5;
  }
  const patterns = [/[a-z]/, /[A-Z]/, /[\d]/, /[^\da-zA-Z]/];
  patterns.forEach((re) => {
    if (pwd && re.test(pwd)) level += 1;
  });
  return level;
}

export function checkAddPasswordStrength(password, hp = HOME_HP) {
  if (WEAK_PWD_SKIP_HP_ADD.includes(hp)) {
    return true;
  }
  return getPwdStrength(password) >= 9;
}

export function checkEditPasswordStrength(password, hp = HOME_HP) {
  if (WEAK_PWD_SKIP_HP_EDIT.includes(hp)) {
    return true;
  }
  return getPwdStrength(password) >= 9;
}

/** 新增始终 md5；编辑时 stzl 不 md5，其余环境 md5 */
export function encryptPdaPassword(password, isEdit = false) {
  if (isEdit && HOME_HP === 'stzl') {
    return password;
  }
  return EncryptMd5(password + 'QW1A5S2');
}

export function isOkResult(data) {
  return data === 200 || data === '200';
}
