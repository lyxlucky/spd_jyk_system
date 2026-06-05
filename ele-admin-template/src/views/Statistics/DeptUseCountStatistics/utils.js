import { utils, writeFile } from 'xlsx';

export function defaultDateRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return {
    startDay: `${y}-01-01`,
    endDay: `${y}-${m}-${d}`
  };
}

export function fmtPriceWan(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return '0.00';
  return (n / 10000).toFixed(2);
}

export function fmtRatio(usePrice, sumPrice) {
  const u = Number(usePrice);
  const s = Number(sumPrice);
  if (!s || Number.isNaN(u)) return '0.00%';
  return `${((u / s) * 100).toFixed(2)}%`;
}

export function exportAoA(fileName, rows) {
  const ws = utils.aoa_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, fileName);
}

export function buildDeptPieOption(rows) {
  const data = (rows || [])
    .filter((r) => r.DEPT_TWO_NAME && r.USE_PRICE != null)
    .map((r) => ({ name: r.DEPT_TWO_NAME, value: Number(r.USE_PRICE) || 0 }));
  return {
    title: { text: '总科室使用金额', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
        label: { formatter: '{b}{d}%' }
      }
    ]
  };
}

export function buildDeptMonthBarOption(deptName, rows) {
  const xData = [];
  const yData = [];
  (rows || []).forEach((r) => {
    xData.push(r.MONTH_NUM || '');
    yData.push(fmtPriceWan(r.USE_PRICE));
  });
  return {
    title: { text: `${deptName || ''}消耗金额`, left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', axisLabel: { formatter: '{value} 万元' } },
    series: [
      {
        type: 'bar',
        data: yData,
        label: { show: true, position: 'top', fontSize: 10 }
      }
    ]
  };
}

export function buildVarietyPieOption(deptName, rows) {
  const data = (rows || [])
    .filter((r) => r.VARIETIE_NAME && r.USE_PRICE != null)
    .map((r) => ({ name: r.VARIETIE_NAME, value: Number(r.USE_PRICE) || 0 }));
  return {
    title: { text: `${deptName || ''}品种使用情况`, left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data,
        label: { formatter: '{b}{d}%' }
      }
    ]
  };
}

export function buildVarietyMonthBarOption(varietyName, rows) {
  const xData = [];
  const yData = [];
  (rows || []).forEach((r) => {
    xData.push(r.OPEARTION_CHARGING_TIME || '');
    yData.push(r.USE_COUNT == null ? 0 : Number(r.USE_COUNT));
  });
  return {
    title: { text: `${varietyName || ''}品种`, left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: yData,
        label: { show: true, position: 'top', fontSize: 10 }
      }
    ]
  };
}
