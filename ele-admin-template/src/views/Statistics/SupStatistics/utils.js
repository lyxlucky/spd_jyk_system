import {
  MONTH_LABELS,
  parseMonthValues,
  downloadChartImage,
  printChartImage,
  printHtmlTable,
  buildYearCompareOption,
  processVarietyRows
} from '../DeptStatistics/utils';

export {
  MONTH_LABELS,
  parseMonthValues,
  downloadChartImage,
  printChartImage,
  printHtmlTable,
  buildYearCompareOption,
  processVarietyRows
};

export function buildSupplierCodeParam(supplierCode, supplierName) {
  return `${supplierCode}:${supplierName}`;
}

export function buildMultiSupplierCodeParam(suppliers) {
  return (suppliers || [])
    .filter((s) => s.SupplierCode && s.SupplierCode !== '0')
    .map((s) => buildSupplierCodeParam(s.SupplierCode, s.SupplierName))
    .join(',');
}

/** 处理供应商列表：占比、排序 */
export function processSupplierRows(list) {
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

/** 供应商耗材金额饼图 */
export function buildSupplierPieOption(selectedSuppliers, hospitalMoney, date) {
  const dataName = [];
  const dataSeries = [];
  let otherMoney = parseFloat(hospitalMoney) || 0;

  (selectedSuppliers || []).forEach((sup) => {
    const money = parseFloat(sup.VarietieMoney) || 0;
    dataName.push(sup.SupplierName);
    dataSeries.push({
      value: money,
      name: sup.SupplierName,
      code: sup.SupplierCode
    });
    otherMoney -= money;
  });

  dataName.push('其他供应商');
  dataSeries.push({
    value: Number(otherMoney.toFixed(2)),
    name: '其他供应商',
    code: '0'
  });

  return {
    title: { text: '供应商耗材金额', subtext: date || '', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left', data: dataName },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    series: [
      {
        name: '消耗总金额',
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

/** 供应趋势折线图 */
export function buildSupplierTrendOption(monthResults) {
  const dataName = [];
  const dataSeries = [];

  (monthResults || []).forEach((item) => {
    dataName.push(item.SupplierName);
    dataSeries.push({
      name: item.SupplierName,
      type: 'line',
      data: parseMonthValues(item.AllManthMoney)
    });
  });

  return {
    title: { text: '供应趋势图' },
    tooltip: { trigger: 'axis' },
    legend: { data: dataName },
    toolbox: { feature: { saveAsImage: { title: '保存图片' } } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{ type: 'category', boundaryGap: false, data: MONTH_LABELS }],
    yAxis: [{ type: 'value' }],
    series: dataSeries
  };
}

/** 供应商消耗金额品种饼图 */
export function buildSupplierVarietyPieOption(supplierName, date, varietyRows, checkedVarieties) {
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
      text: `${supplierName || ''}消耗金额统计`,
      subtext: date || '',
      left: 'center'
    },
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
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

export const SUPPLIER_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'SupplierCode', label: '供应商编码', minWidth: 100, sortable: true },
  { prop: 'SupplierName', label: '供应商名称', minWidth: 120, sortable: true },
  { prop: 'VarietieQty', label: '用量', width: 80, align: 'right', sortable: true },
  { prop: 'YLZB', label: '用量占比', width: 90, align: 'right' },
  { prop: 'VarietieMoney2', label: '消耗金额', width: 100, align: 'right', sortable: true },
  { prop: 'JEZB', label: '金额占比', width: 90, align: 'right' }
];

export const SUP_VARIETY_TABLE_COLUMNS = [
  { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
  { columnKey: 'index', type: 'index', label: '序号', width: 50, align: 'center' },
  { prop: 'VarietieName', label: '品种名称', minWidth: 160, sortable: true, showOverflowTooltip: true },
  { prop: 'VarietieQty', label: '用量', width: 80, align: 'right', sortable: true },
  { prop: 'VarietieMoney2', label: '消耗金额', width: 100, align: 'right', sortable: true }
];
