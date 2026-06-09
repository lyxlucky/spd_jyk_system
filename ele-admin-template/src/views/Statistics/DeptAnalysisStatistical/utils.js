import { utils, writeFile } from 'xlsx';

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

export function calcHospitalRatio(row) {
  const main = Number(row.MAIN_PRICE) || 0;
  const all = Number(row.All_PRICE) || 0;
  if (!all) return '0.00%';
  return `${((main / all) * 100).toFixed(2)}%`;
}

export function exportDeptAnalysisExcel(rows) {
  const header = [
    '科室名称',
    '金额(元)',
    '环期金额(元)',
    '增幅金额',
    '环比增幅%',
    '占全院比%'
  ];
  const data = [header];
  (rows || []).forEach((row) => {
    data.push([
      row.DEPT_TWO_NAME,
      row.MAIN_PRICE,
      row.HQ_PRICE,
      Number(calcIncreaseAmount(row)),
      formatHbZz(row),
      calcHospitalRatio(row)
    ]);
  });
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, '科室医用耗材支出情况.xlsx');
}
