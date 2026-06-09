import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const B2B_HOSPITAL_MAP = {
  bd: 'BH00001',
  bdrm: 'BH00261',
  lg: 'BH00002',
  stzl: 'BH00003',
  nyd: 'BH00004',
  szlh: 'BH00005',
  zq: 'BH00006',
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

export const buyBackHpFlags = {
  useB2bFlow: ['lg', 'stzl', 'stzx', 'stse', 'bdrm'].includes(HOME_HP),
  enableLossRegion: false
};

export function initBuyBackHpFlags(permissions = []) {
  buyBackHpFlags.enableLossRegion = permissions.some(
    (p) => p.Permission_Url === 'BuyBack_盘损区'
  );
}

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function formatShelfRegion(state) {
  if (String(state) === '1') return '合格区';
  if (String(state) === '8') return '盘损隔离区';
  return '未知';
}

export function formatReturnRegion(region) {
  if (String(region) === '1') return '普通退购';
  if (String(region) === '8') return '盘损退购';
  return '未知';
}

export function formatReturnState(state) {
  const map = {
    '0': '待确认',
    '1': '已退购',
    '2': '已发送',
    '3': '已查看'
  };
  return map[String(state)] || state || '';
}

export function isNearExpiry(validityDate) {
  if (!validityDate) return false;
  const expiry = new Date(formatDate10(validityDate)).getTime();
  return expiry - 30 * 24 * 3600 * 1000 < Date.now();
}

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  window.open(`${base}/Excel/files/${encodeURIComponent(fileName)}`);
}

export function getOrderActionFlags(stateText) {
  const b2b = buyBackHpFlags.useB2bFlow;
  return {
    canConfirm: !b2b && stateText === '待确认',
    canSend: b2b && stateText === '待确认',
    canGetGoods: (b2b && stateText === '已发送') || stateText === '已查看',
    canAdd: stateText === '待确认',
    canDeleteDetail: stateText === '待确认',
    canPrint: !!stateText
  };
}

export function regionSelectToApi(regionSelect) {
  return String(regionSelect) === '1' ? 8 : 1;
}

export function matchRegionForAdd(regionSelect, orderRegionText) {
  if (String(regionSelect) === '1') {
    return orderRegionText === '盘损退购';
  }
  return orderRegionText === '普通退购';
}

export function buildCreateItems(rows) {
  return rows.map((row) => ({
    ID: row.ID,
    ReturnCount: Number(row._returnQty ?? 0),
    SUPPLIER_CODE: row.SUPPLIER_CODE,
    STORAGE_ID: row.STORAGE_ID
  }));
}

export function validateCreateItems(rows) {
  for (const row of rows) {
    const qty = Number(row._returnQty ?? 0);
    if (qty <= 0) {
      return `品种${row.VARIETIE_CODE}${row.VARIETIE_NAME}的退购数量不能为0`;
    }
    if (qty > Number(row.UP_SHELF_QUANTITY)) {
      return `退购数量不能大于可退购数量${row.UP_SHELF_QUANTITY}`;
    }
  }
  return '';
}
