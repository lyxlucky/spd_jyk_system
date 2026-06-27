/** 分值类型（对齐旧页 SupplierScoreLast.cshtml） */
export const SCORE_TYPE_OPTIONS = [
  { value: 'SCORE_A', label: '送货及时性和准确性' },
  { value: 'SCORE_B', label: '供应产品质量稳定性' },
  { value: 'SCORE_C', label: '资料登记完整性' },
  { value: 'SCORE_D', label: '院内协商配合度' },
  { value: 'SCORE_E', label: '风险问题处理能力' },
  { value: 'SCORE_F', label: '不良事件的响应速度及处理能力' },
  { value: 'SCORE_G', label: '技术支持能力' }
];

export const SCORE_TYPE_LABEL = SCORE_TYPE_OPTIONS.reduce((map, item) => {
  map[item.value] = item.label;
  return map;
}, {});

export function displayScore(val) {
  const n = Number(val);
  if (Number.isNaN(n)) return val ?? '';
  return n < 0 ? 0 : n;
}

/** 总分（旧页各分项直接相加） */
export function calcTotalScore(row) {
  if (!row) return 0;
  const keys = ['SCORE_A', 'SCORE_B', 'SCORE_C', 'SCORE_D', 'SCORE_E', 'SCORE_F', 'SCORE_G'];
  return keys.reduce((sum, key) => sum + Number(row[key] || 0), 0);
}

export function formatScoreType(type) {
  return SCORE_TYPE_LABEL[type] || type || '';
}
