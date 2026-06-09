/** 环比上月 */
export function fmtHbPrc(v) {
  if (v == null || v === '' || Number.isNaN(Number(v))) return '';
  return `${Number(v).toFixed(2)}%`;
}

export function fmtPrice2(v) {
  if (v == null || v === '') return '';
  const n = Number(v);
  return Number.isNaN(n) ? '' : n.toFixed(2);
}

/** 从月度列表构建折线图数据（与旧系统一致：reverse 后展示） */
export function buildLineChartOption(title, rows) {
  const list = [...(rows || [])].reverse();
  const xData = [];
  const priceData = [];
  const numData = [];
  list.forEach((r) => {
    xData.push(r.CONSUME_TIME || '');
    priceData.push(r.sumPrice == null || r.sumPrice === '' ? 0 : Number(r.sumPrice));
    numData.push(r.sumNum == null || r.sumNum === '' ? 0 : Number(r.sumNum));
  });
  return {
    title: { text: title || '', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['消耗金额', '消耗数量'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
    toolbox: { feature: { saveAsImage: {} } },
    xAxis: { type: 'category', boundaryGap: false, data: xData },
    yAxis: { type: 'value' },
    series: [
      { name: '消耗金额', type: 'line', stack: '总量', data: priceData },
      { name: '消耗数量', type: 'line', stack: '总量', data: numData }
    ]
  };
}
