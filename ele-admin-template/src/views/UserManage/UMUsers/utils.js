import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';

export const showBdrmEmployeeSearch = HOME_HP === 'bdrm';

const WEAK_PWD_SKIP_HP = [
  'stzx',
  'stzl',
  'stse',
  'csyy',
  'stzyyy',
  'chrmyy',
  'fszxy'
];

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function formatNickname(row) {
  const name = row.Nickname || '';
  if (String(row.Is_Delete) === '0') {
    return `${name}(冻结)`;
  }
  return name;
}

export function formatUserStatus(isDelete) {
  return String(isDelete) === '1' ? '启用' : '冻结';
}

export function formatDeptNames(userDept) {
  if (!userDept || !userDept.length) return '';
  return userDept.map((d) => d.Dept_Two_Name).join(',');
}

export function formatDeptEnable(enable) {
  if (String(enable) === '1') return '启用';
  if (String(enable) === '0') return '停用';
  return enable ?? '';
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

export function checkPasswordStrength(password, hp = HOME_HP) {
  if (WEAK_PWD_SKIP_HP.includes(hp)) {
    return true;
  }
  return getPwdStrength(password) >= 9;
}

export function normalizePriority(val, fallback = 1) {
  const n = parseInt(val, 10);
  if (Number.isNaN(n) || n < 1) return fallback;
  return n;
}

const EXPORT_HEADERS = [
  '用户账号',
  '姓名',
  '所属供应商',
  '权限组',
  '所属科室',
  '职位',
  '备注',
  '最近登录时间',
  '最近登录IP',
  '状态'
];

export function exportUserExcel(rows) {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    data.push([
      row.UserName,
      row.Nickname,
      row.Supplier_Name,
      row.Group_Name,
      formatDeptNames(row.userDept),
      row.POSITION,
      row.MARK,
      row.UPDATE_TIME,
      row.CREATE_IP,
      formatUserStatus(row.Is_Delete)
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['用户信息'], Sheets: { 用户信息: sheet } }, '用户信息.xlsx');
}
