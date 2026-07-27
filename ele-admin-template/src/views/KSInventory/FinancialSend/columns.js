export function getSendColumns() {
  return [
    {
      columnKey: 'selection',
      type: 'selection',
      width: 48,
      align: 'center',
      fixed: 'left',
      className: 'spd-checkbox-col',
      labelClassName: 'spd-checkbox-col'
    },
    {
      prop: 'MONTHLY_BALANCE_NUMBER',
      label: '月结单号',
      minWidth: 110,
      align: 'center'
    },
    { prop: 'VARIETIE_CODE', label: '品种编码', minWidth: 100, align: 'center' },
    {
      prop: 'VARIETIE_NAME',
      label: '品种名称',
      minWidth: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: '规格型号',
      minWidth: 120,
      showOverflowTooltip: true
    },
    { prop: 'UNIT', label: '单位', width: 70, align: 'center' },
    { prop: 'PRICE', label: '价格', width: 90, align: 'center' },
    { prop: 'BATCH', label: '批号', minWidth: 100, align: 'center' },
    {
      prop: 'SUPPLIER_NAME',
      label: '供应商',
      minWidth: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业',
      minWidth: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'APPROVAL_NUMBER',
      label: '注册证号',
      minWidth: 120,
      showOverflowTooltip: true
    },
    { prop: 'MONTH', label: '月结月份', width: 100, align: 'center' },
    { prop: 'QTY', label: '数量', width: 80, align: 'center' },
    {
      prop: 'MAKEDATE',
      label: '月结发送日期',
      minWidth: 120,
      align: 'center',
      formatter: (row) =>
        row.MAKEDATE ? String(row.MAKEDATE).replace('T', ' ').substring(0, 19) : ''
    },
    { prop: 'SPD_DEL_ID', label: '明细ID', minWidth: 100, align: 'center' },
    {
      prop: 'MONTHBILLNUM',
      label: '发票号',
      minWidth: 120,
      align: 'center',
      showOverflowTooltip: true
    },
    {
      prop: 'FP_SEND',
      label: '是否发送',
      width: 90,
      align: 'center',
      formatter: (row) => (row.FP_SEND == 1 || row.FP_SEND === '1' ? '已发送' : '未发送')
    },
    {
      prop: 'EXAMINE_STATE',
      label: '审批状态',
      width: 90,
      align: 'center',
      formatter: (row) =>
        row.EXAMINE_STATE == 1 || row.EXAMINE_STATE === '1' ? '已审批' : '未审批'
    },
    {
      prop: 'IS_FPNULL',
      label: '是否包含发票',
      width: 110,
      align: 'center',
      formatter: (row) =>
        row.IS_FPNULL == 1 || row.IS_FPNULL === '1' ? '包含' : '不包含'
    }
  ];
}
