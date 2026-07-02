import {
  MONTH_LABELS,
  parseMonthValues,
  buildYearCompareOption,
  downloadChartImage,
  printChartImage,
  printHtmlTable,
  fmtMoney2
} from '../DeptStatistics/utils';

export {
  MONTH_LABELS,
  parseMonthValues,
  buildYearCompareOption,
  downloadChartImage,
  printChartImage,
  printHtmlTable,
  fmtMoney2
};

/** 处理全院品种列表 */
export function processHospitalVarietyRows(list) {
  return (list || []).map((row) => {
    const money = parseFloat(row.VarietieMoney) || 0;
    const qty = parseFloat(row.VarietieQty) || 0;
    const hospitalMoney = parseFloat(row.HospitalMoney) || 0;
    const hospitalQty = parseFloat(row.HospitalQty) || 0;
    return {
      ...row,
      VarietieMoney: money,
      VarietieMoney2: money.toFixed(2),
      VarietieQty: qty,
      VarietieQtys:
        row.VarietieQtys ||
        (hospitalQty > 0 ? `${((qty / hospitalQty) * 100).toFixed(4)}%` : '0%'),
      VarietieMoneys:
        row.VarietieMoneys ||
        (hospitalMoney > 0 ? `${((money / hospitalMoney) * 100).toFixed(4)}%` : '0%')
    };
  });
}

export function processLinkRows(list) {
  return (list || []).map((row) => ({
    ...row,
    DeptCodeMoney2: (parseFloat(row.DeptCodeMoney) || 0).toFixed(2)
  }));
}

export function buildCodeNameParam(code, name) {
  return `${code}:${name}`;
}

/** 全院品种占比饼图 */
export function buildHospitalVarietyPieOption(selectedVarieties, hospitalMoney, date) {
  const legend = [];
  const series = [];
  let otherMoney = parseFloat(hospitalMoney) || 0;

  (selectedVarieties || []).forEach((row) => {
    const money = parseFloat(row.VarietieMoney) || 0;
    legend.push(row.VarietieName);
    series.push({
      value: money,
      name: row.VarietieName,
      code: row.VarietieName
    });
    otherMoney -= money;
  });

  legend.push('其他品种');
  series.push({
    value: Number(Math.max(otherMoney, 0).toFixed(2)),
    name: '其他品种',
    code: '0'
  });

  return {
    title: {
      text: '全院耗材使用占比(金额)',
      subtext: date || '',
      left: 'center'
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: legend },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '消耗金额',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: series,
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

/** 全院用量同比增长柱状图 */
export function buildConsumptionYearOption(results) {
  const legend = [];
  const series = [];

  (results || []).forEach((item) => {
    const label = `${item.Year}年`;
    legend.push(label);
    series.push({
      name: label,
      type: 'bar',
      data: parseMonthValues(item.AllManthMoney)
    });
  });

  return {
    title: { text: '全院用量同比增长情况(金额)', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: legend },
    toolbox: {
      feature: {
        saveAsImage: { title: '保存图片' },
        magicType: { type: ['line', 'bar'] },
        restore: { title: '还原' }
      }
    },
    calculable: true,
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{ type: 'category', data: MONTH_LABELS }],
    yAxis: [{ type: 'value' }],
    series
  };
}

/** 品种科室占比饼图 */
export function buildVarietyDeptPieOption(varietyName, date, rows) {
  const legend = [];
  const series = [];

  (rows || []).forEach((row) => {
    legend.push(row.DeptName);
    series.push({
      value: parseFloat(row.DeptCodeMoney) || 0,
      name: row.DeptName,
      code: row.DeptCode
    });
  });

  return {
    title: {
      text: `(${varietyName || ''})科室使用占比(金额)`,
      subtext: date || '',
      left: 'center'
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: legend },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '科室金额',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: series,
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

/** 品种供应商占比饼图 */
export function buildVarietySupplierPieOption(varietyName, date, rows) {
  const legend = [];
  const series = [];

  (rows || []).forEach((row) => {
    legend.push(row.SupplierName);
    series.push({
      value: parseFloat(row.DeptCodeMoney) || 0,
      name: row.SupplierName,
      code: row.SupplierCode
    });
  });

  return {
    title: {
      text: `(${varietyName || ''})供应商供应占比(金额)`,
      subtext: date || '',
      left: 'center'
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: legend },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '供应金额',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: series,
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

export const VARIETY_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'VarietieName', label: '品种名称', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
  { prop: 'BRAND', label: '品牌', minWidth: 90, sortable: 'custom', showOverflowTooltip: true },
  { prop: 'VarietieQty', label: '用量', width: 80, align: 'right', sortable: 'custom' },
  { prop: 'VarietieQtys', label: '用量占比', width: 90, align: 'right' },
  {
    prop: 'VarietieMoney2',
    label: '金额',
    width: 100,
    align: 'right',
    sortable: 'custom',
    sortBy: 'VarietieMoney'
  },
  { prop: 'VarietieMoneys', label: '金额占比', width: 90, align: 'right' }
];

export const DEPT_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'DeptCode', label: '科室编码', minWidth: 90 },
  { prop: 'DeptName', label: '科室名称', minWidth: 120, showOverflowTooltip: true },
  { prop: 'Qty', label: '用量', width: 80, align: 'right' },
  { prop: 'DeptCodeMoney2', label: '金额', width: 100, align: 'right' }
];

export const SUPPLIER_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'SupplierCode', label: '供应商编码', minWidth: 100 },
  { prop: 'SupplierName', label: '供应商名称', minWidth: 140, showOverflowTooltip: true },
  { prop: 'Qty', label: '用量', width: 80, align: 'right' },
  { prop: 'DeptCodeMoney2', label: '金额', width: 100, align: 'right' }
];
