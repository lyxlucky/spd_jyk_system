export const HIGH_CLASS_XH_OPTIONS = [
  { value: '0', label: '全部' },
  { value: '1', label: '单/多部件金属骨固定器械及附件' },
  { value: '2', label: '导丝' },
  { value: '3', label: '耳内假体' },
  { value: '4', label: '颌面部赝复及修复重建 材料及制品' },
  { value: '5', label: '脊柱椎体间固定/置换系统' },
  { value: '6', label: '可吸收外科止血材料' },
  { value: '7', label: '髋关节假体' },
  { value: '8', label: '颅骨矫形器械' },
  { value: '9', label: '刨骨器' },
  { value: '10', label: '球囊扩张导管' },
  { value: '11', label: '托槽' },
  { value: '12', label: '吻合器（带钉）' },
  { value: '13', label: '血管支架' },
  { value: '14', label: '阴茎假体' },
  { value: '15', label: '植入式神经刺激器' },
  { value: '16', label: '植入式心律转复除颤器' },
  { value: '17', label: '植入式药物输注设备' },
  { value: '18', label: '椎体成形导引系统' }
];

export function defaultMonthRanges() {
  return {
    time1Range: ['2023-01', '2023-12'],
    time2Range: ['2022-01', '2022-12']
  };
}

export function calcIncreaseAmount(row) {
  const main = Number(row.MAIN_PRICE) || 0;
  const hq = Number(row.HQ_PRICE) || 0;
  return (main - hq).toFixed(2);
}

export function formatHbZz(row) {
  const v = row.HB_ZZ;
  if (v == null || v === '') return '';
  return `${v}%`;
}

export function formatHighClassXh(row) {
  const v = row.HIGH_CLASS_XH;
  if (!v || v === '0') return '';
  return v;
}

export function getDeptName(row, index) {
  const list = row.DeptList || [];
  if (list.length <= index) {
    return index === 0 ? '' : '无';
  }
  return list[index].DEPT_TWO_NAME || '';
}

export function getDeptProportion(row, index) {
  const list = row.DeptList || [];
  if (list.length <= index) return '0';
  const main = Number(row.MAIN_PRICE) || 0;
  const deptPrice = Number(list[index].DEPT_PRICE) || 0;
  if (!deptPrice || !main) return '0';
  return `${((deptPrice / main) * 100).toFixed(2)}%`;
}

export function buildDeptColumns() {
  const cols = [];
  for (let i = 0; i < 5; i += 1) {
    const n = i + 1;
    cols.push(
      {
        prop: `DEPT_NAME_${n}`,
        label: `使用科室${n}`,
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: (row) => getDeptName(row, i)
      },
      {
        prop: `DEPT_PROP_${n}`,
        label: '占比%',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
        formatter: (row) => getDeptProportion(row, i)
      }
    );
  }
  return cols;
}
