export function formatDate10(v) {
  if (!v || String(v).startsWith('0001-01-01')) return '';
  return String(v).substr(0, 10);
}

export function isExpiredDate(v) {
  const text = formatDate10(v);
  if (!text) return false;
  return new Date(text).getTime() <= Date.now();
}

export function formatDateWithExpiry(v) {
  const text = formatDate10(v);
  if (!text) return { text: '', expired: false };
  const expired = isExpiredDate(v);
  return { text, expired };
}

export function formatContractExpiryDays(v) {
  const text = formatDate10(v);
  if (!text) return { text: '', expired: false };
  const ts = new Date(text).getTime();
  const now = Date.now();
  if (Number.isNaN(ts)) return { text, expired: false };
  if (ts <= now) return { text, expired: true };
  const days = Math.floor((ts - now) / (86400000));
  return { text: `${text}|${days}天`, expired: false };
}

export function upShelfStateName(state, sourceName) {
  const s = Number(state);
  if (s === 1) return '合格区';
  if (s === 6) return '普通隔离区';
  if (s === 7) return '不合格区';
  if (s === 0) return sourceName || '';
  if (s === 8) return '盘损隔离区';
  if (s === 9) return '应急库';
  if (s === 2) return '拣配区';
  return '锁定区';
}

export function receivePropertyName(v) {
  if (v == 0) return '普通收货';
  if (v == 1) return '盘溢收货';
  return '无';
}

export function formatSupplyPrice(row) {
  const p = row.Supply_Price;
  const bl = row.price_bl != null ? row.price_bl : 2;
  if (p == null || p === '') return '';
  return Number(p).toFixed(bl);
}

export function formatStockPrice(row) {
  const p = row.supply_price;
  const bl = row.price_bl != null ? row.price_bl : 2;
  if (p == null || p === '') return '';
  return Number(p).toFixed(bl);
}

export function getMonthStartEnd() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  const fmt = (d) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };
  return { start: fmt(start), end: fmt(end) };
}

export function daysBetween(start, end) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.ceil(Math.abs(d2 - d1) / 86400000);
}
