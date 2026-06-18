import { fmtDateTime, fmtPrice } from './utils';

export function getTertiaryInventoryColumns() {
  return [
    { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', label: '序号', width: 60, align: 'center' },
    { prop: 'DEPT_TWO_NAME', label: '科室名称', width: 150, showOverflowTooltip: true },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 150, showOverflowTooltip: true },
    { prop: 'CHARGING_CODE', label: '计费编码', width: 150, showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 150, showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 150, showOverflowTooltip: true },
    { prop: 'COUNT', label: '数量', width: 150, align: 'right' },
    { prop: 'UNIT', label: '单位', width: 80, showOverflowTooltip: true },
    {
      prop: 'PRICE',
      label: '价格',
      width: 100,
      align: 'right',
      formatter: (row) => fmtPrice(row.PRICE)
    },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 150, showOverflowTooltip: true },
    { columnKey: 'action', label: '操作', width: 70, align: 'center', slot: 'action', className: 'action-col' }
  ];
}

export function getTertiaryDetailColumns() {
  return [
    { type: 'index', label: '序号', width: 60, align: 'center' },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 100, showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 150, showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 150, showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 100 },
    { prop: 'HIS_ZHB', label: '转换比', width: 100 },
    { prop: 'QTY', label: '数量', width: 100, align: 'right' },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 150, showOverflowTooltip: true },
    { prop: 'REMARK', label: '说明', width: 250, showOverflowTooltip: true },
    { prop: 'OPERATOR', label: '操作人', width: 100, showOverflowTooltip: true },
    {
      prop: 'CREATE_TIME',
      label: '操作时间',
      width: 200,
      formatter: (row) => fmtDateTime(row.CREATE_TIME)
    },
    { prop: 'PATIENT_NUMBER', label: '病患号', width: 100, showOverflowTooltip: true },
    { prop: 'HOSPITALIZATION_NUMBER', label: '住院号', width: 100, showOverflowTooltip: true }
  ];
}
