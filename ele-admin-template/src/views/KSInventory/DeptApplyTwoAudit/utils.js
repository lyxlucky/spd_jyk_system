export function defaultFilters() {
  return {
    PLAN_NUMBER: '',
    VARIETIE_NAME: '',
    DEPT_TWO_NAME: '',
    SENCOND_APP_STATE: '',
    StartTime: '',
    EndTime: ''
  };
}

export const APP_STATE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '未审核', value: '0' },
  { label: '审核通过', value: '1' },
  { label: '审核不通过', value: '2' }
];

export function formatSecondAppState(value) {
  const state = String(value ?? '');
  if (state === '1') return '已审批';
  if (state === '0') return '未审批';
  if (state === '2') return '审批未通过';
  return value ?? '';
}

export function buildColumns() {
  return [
    {
      columnKey: 'selection',
      type: 'selection',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    {
      type: 'index',
      label: '序号',
      width: 55,
      align: 'center'
    },
    { prop: 'DEPT_TWO_NAME', label: '科室名称', width: 120, showOverflowTooltip: true },
    { prop: 'PLAN_NUMBER', label: '申领单号', width: 110, showOverflowTooltip: true },
    { prop: 'PLAN_TIME', label: '下计划时间', width: 110, showOverflowTooltip: true },
    { prop: 'PLAN_SUBMITTER', label: '提交人', width: 100, showOverflowTooltip: true },
    { prop: 'SECOND_APP_MAN', label: '审批人', width: 100, showOverflowTooltip: true },
    {
      prop: 'SENCOND_APP_STATE',
      label: '审批状态',
      width: 100,
      align: 'center',
      slot: 'SENCOND_APP_STATE'
    },
    { prop: 'SECOND_APP_TIME', label: '审批时间', width: 110, showOverflowTooltip: true },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 110, showOverflowTooltip: true },
    { prop: 'CHARGING_CODE', label: '计费编码', width: 120, showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 160, showOverflowTooltip: true },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: '规格型号',
      width: 160,
      showOverflowTooltip: true
    },
    { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
    { prop: 'PAG_TYPE', label: '包装规格', width: 90, showOverflowTooltip: true },
    { prop: 'PRICE', label: '价格', width: 80, align: 'right' },
    { prop: 'APPLY_QTY', label: '数量', width: 70, align: 'right' },
    { prop: 'APPROVAL_NUMBER', label: '注册证', width: 110, showOverflowTooltip: true },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业',
      width: 160,
      showOverflowTooltip: true
    }
  ];
}
