import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const DEPT_REGION_OPTIONS = [
  { value: '2737-25', label: '门诊一楼DSA室' },
  { value: '2737-26', label: '外科楼2楼介入室' },
  { value: '2737-27', label: '外科楼7楼杂交手术' }
];

export const pickingHpFlags = {
  showKubao: HOME_HP === 'bd',
  showConsignmentPrint: HOME_HP === 'zq',
  hidePrintDetail2: HOME_HP === 'stse',
  isLhLike: HOME_HP === 'szlh' || HOME_HP === 'szlhfy',
  isSe2: HOME_HP === 'se2',
  showEpcSend: false,
  showProcessUp: false
};

export function initPickingHpFlags(permissions = []) {
  pickingHpFlags.showEpcSend = permissions.some(
    (p) => p.Permission_Url === '三瑞制标发送'
  );
  pickingHpFlags.showProcessUp = permissions.some(
    (p) => p.Permission_Url === '三瑞智能库上架'
  );
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 19);
}

export function formatPackState(state) {
  const map = {
    '0': '未拣配',
    '1': '已短拣',
    '2': '已全拣',
    '3': '已取消'
  };
  return map[String(state)] || '不明状态';
}

export function formatTransferState(state) {
  const map = { '0': '已转补货单', '1': '未转补货单' };
  return map[String(state)] || '不明状态';
}

export function formatReplenishState(state) {
  const map = { '0': '未补货', '1': '补货中', '2': '已收货' };
  return map[String(state)] || '不明状态';
}

export function formatDefPackageState(state) {
  if (String(state) === '0') return '未补货';
  if (String(state) === '1') return '已收货';
  return '';
}

export function getDefaultMonthRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const fmt = (d) =>
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0');
  return [fmt(start), fmt(end)];
}

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}${subPath}${encodeURIComponent(fileName)}`;
  if (pickingHpFlags.isLhLike || HOME_HP === 'szlh') {
    const form = document.createElement('form');
    form.method = 'get';
    form.action = url;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } else {
    window.open(url);
  }
}

export function canCompletePick(packState) {
  return String(packState) === '0';
}

export function canSendDelivery(replenishState) {
  return formatReplenishState(replenishState) === '未补货';
}

export function canConfirmReceipt(replenishState) {
  return formatReplenishState(replenishState) === '补货中';
}

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function needDeptRegionSelect(deptCode) {
  return String(deptCode) === '2737';
}
