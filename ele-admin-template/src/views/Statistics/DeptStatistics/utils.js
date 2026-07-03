export const MONTH_LABELS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
];

export function parseMonthValues(str) {
  if (!str) return Array(12).fill(0);
  return String(str)
    .replace(/,$/, '')
    .split(',')
    .map((v) => parseFloat(v) || 0);
}

export function fmtMoney2(v) {
  const n = Number(v);
  return Number.isNaN(n) ? '0.00' : n.toFixed(2);
}

/** 处理科室列表：占比、排序 */
export function processDeptRows(list) {
  const rows = (list || []).map((row) => {
    const money = parseFloat(row.VarietieMoney) || 0;
    const qty = parseFloat(row.VarietieQty) || 0;
    const hospitalMoney = parseFloat(row.HospitalMoney) || 0;
    const hospitalQty = parseFloat(row.HospitalQty) || 0;
    return {
      ...row,
      VarietieMoney: money,
      VarietieMoney2: money.toFixed(2),
      VarietieQty: qty,
      YLZB: hospitalQty > 0 ? `${((qty / hospitalQty) * 100).toFixed(2)}%` : '0%',
      JEZB: hospitalMoney > 0 ? `${((money / hospitalMoney) * 100).toFixed(2)}%` : '0%'
    };
  });
  return rows.sort((a, b) => b.VarietieMoney - a.VarietieMoney);
}

/** 处理品种列表：金额格式化、排序 */
export function processVarietyRows(list) {
  const rows = (list || []).map((row) => {
    const money = Math.round(parseFloat(row.VarietieMoney) * 100) / 100;
    return {
      ...row,
      VarietieMoney: money,
      VarietieMoney2: money.toFixed(2),
      VarietieQty: parseFloat(row.VarietieQty) || 0
    };
  });
  return rows.sort((a, b) => b.VarietieMoney - a.VarietieMoney);
}

export function buildDeptCodeParam(deptCode, deptName) {
  return `${deptCode}:${deptName}`;
}

export function buildMultiDeptCodeParam(depts) {
  return (depts || [])
    .filter((d) => d.DeptCode && d.DeptCode !== '0')
    .map((d) => buildDeptCodeParam(d.DeptCode, d.DeptName))
    .join(',');
}

/** 科室耗材使用饼图 */
export function buildDeptPieOption(selectedDepts, hospitalMoney, date) {
  const dataName = [];
  const dataSeries = [];
  let otherMoney = parseFloat(hospitalMoney) || 0;

  (selectedDepts || []).forEach((dept) => {
    const money = parseFloat(dept.VarietieMoney) || 0;
    dataName.push(dept.DeptName);
    dataSeries.push({
      value: money,
      name: dept.DeptName,
      code: dept.DeptCode
    });
    otherMoney -= money;
  });

  dataName.push('其他科室');
  dataSeries.push({
    value: Number(otherMoney.toFixed(2)),
    name: '其他科室',
    code: '0'
  });

  return {
    title: { text: '科室耗材使用', subtext: date || '', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: dataName },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '消耗总量',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: dataSeries,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}

/** 科室耗材使用趋势折线图 */
export function buildDeptTrendOption(monthResults) {
  const dataName = [];
  const dataSeries = [];

  (monthResults || []).forEach((item) => {
    dataName.push(item.DeptName);
    dataSeries.push({
      name: item.DeptName,
      type: 'line',
      data: parseMonthValues(item.AllManthMoney)
    });
  });

  return {
    title: { text: '科室耗材使用趋势图' },
    tooltip: { trigger: 'axis' },
    legend: { data: dataName },
    toolbox: { feature: { saveAsImage: {} } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{ type: 'category', boundaryGap: false, data: MONTH_LABELS }],
    yAxis: [{ type: 'value' }],
    series: dataSeries
  };
}

/** 科室消耗金额品种饼图 */
export function buildVarietyPieOption(deptName, date, varietyRows, checkedVarieties) {
  const sorted = [...(varietyRows || [])];
  const legendData = [];
  const seriesData = [];
  let otherMoney = sorted.reduce((sum, r) => sum + (parseFloat(r.VarietieMoney) || 0), 0);

  const pickRows = () => {
    if (checkedVarieties?.length) {
      return sorted.filter((r) =>
        checkedVarieties.some((c) => c.VarietieName === r.VarietieName)
      );
    }
    return sorted.slice(0, 5);
  };

  pickRows().forEach((row) => {
    const money = parseFloat(row.VarietieMoney) || 0;
    legendData.push(row.VarietieName);
    seriesData.push({ value: money, name: row.VarietieName });
    otherMoney -= money;
  });

  legendData.push('其他耗材');
  seriesData.push({ value: Number(otherMoney.toFixed(2)), name: '其他耗材' });

  return {
    title: {
      text: `${deptName || ''}消耗金额统计`,
      subtext: date || '',
      left: 'center'
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: legendData },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '消耗金额',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
}

/** 科室/品种年度对比柱状图 */
export function buildYearCompareOption(title, prevYear, currentYear, prevData, currentData) {
  return {
    title: { text: title || '', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: [String(prevYear), String(currentYear)] },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    calculable: true,
    xAxis: [{ type: 'category', data: MONTH_LABELS }],
    yAxis: [{ type: 'value' }],
    series: [
      { name: String(prevYear), type: 'bar', data: prevData },
      { name: String(currentYear), type: 'bar', data: currentData }
    ]
  };
}

/** 导出图表 PNG */
export function downloadChartImage(chartRef, filename) {
  if (!chartRef?.getDataURL) return false;
  const url = chartRef.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename || 'chart'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return true;
}

/** 打印图表 */
export function printChartImage(chartRef, title) {
  if (!chartRef?.getDataURL) return false;
  const url = chartRef.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.write(`
    <html><head><title>${title || '图表'}</title></head>
    <body style="margin:0;text-align:center">
      <h3>${title || ''}</h3>
      <img src="${url}" style="max-width:100%" onload="window.print();window.close()" />
    </body></html>
  `);
  win.document.close();
  return true;
}

/** 打印 HTML 表格 */
export function printHtmlTable(title, columns, rows) {
  const cols = columns.filter((c) => c.prop && c.type !== 'selection');
  const win = window.open('', '_blank');
  if (!win) return false;
  let html = `<html><head><title>${title}</title>
    <style>table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:4px 8px;font-size:12px;text-align:center}</style>
    </head><body><h3>${title}</h3><table><thead><tr>`;
  cols.forEach((c) => {
    html += `<th>${c.label}</th>`;
  });
  html += '</tr></thead><tbody>';
  (rows || []).forEach((row) => {
    html += '<tr>';
    cols.forEach((c) => {
      let val = row[c.prop];
      if (c.formatter) val = c.formatter(row, { property: c.prop }, val);
      html += `<td>${val ?? ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></body></html>';
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  return true;
}

export const DEPT_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'DeptCode', label: '科室编码', minWidth: 90, sortable: true },
  { prop: 'DeptName', label: '科室名称', minWidth: 110, sortable: true },
  { prop: 'VarietieQty', label: '用量', width: 80, align: 'right', sortable: true },
  { prop: 'YLZB', label: '用量占比', width: 90, align: 'right' },
  { prop: 'VarietieMoney2', label: '消耗金额', width: 100, align: 'right', sortable: true },
  { prop: 'JEZB', label: '金额占比', width: 90, align: 'right' }
];

export const VARIETY_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'VarietieName', label: '品种名称', minWidth: 160, sortable: true, showOverflowTooltip: true },
  { prop: 'VarietieQty', label: '用量', width: 80, align: 'right', sortable: true },
  { prop: 'VarietieMoney2', label: '消耗金额', width: 100, align: 'right', sortable: true }
];
