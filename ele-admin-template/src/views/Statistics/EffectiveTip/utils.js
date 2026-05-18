export const MONTH_OPTIONS = [
  { label: '过期', value: '0' },
  { label: '1个月', value: '1' },
  { label: '2个月', value: '2' },
  { label: '3个月', value: '3' },
  { label: '4个月', value: '4' },
  { label: '5个月', value: '5' },
  { label: '6个月', value: '6' },
  { label: '7个月', value: '7' },
  { label: '8个月', value: '8' },
  { label: '9个月', value: '9' },
  { label: '10个月', value: '10' },
  { label: '11个月', value: '11' },
  { label: '12个月', value: '12' }
];

export function formatDate10(v) {
  if (!v) return '';
  return String(v).substr(0, 10);
}

/** 合同到期列：过期红色，未过期显示 日期|剩余天 */
export function formatContractExpiryDisplay(v) {
  if (!v) return { text: '', expired: false };
  const text = formatDate10(v);
  const ts = new Date(text).getTime();
  const now = Date.now();
  if (Number.isNaN(ts)) return { text, expired: false };
  if (ts <= now) return { text, expired: true };
  const days = Math.floor((ts - now) / (60 * 60 * 24 * 1000));
  return { text: `${text}|${days}天`, expired: false };
}
