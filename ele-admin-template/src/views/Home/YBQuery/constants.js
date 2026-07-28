export const pageSize = 20;
export const pageSizes = [20, 50, 100, 200];
export const inventoryColumns = [
  {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    fixed: 'left'
  },
  {
    prop: 'his_id',
    label: '消耗记录ID',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'med_list_codg',
    label: '医保编码',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_id',
    label: '品种编码',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_name',
    label: '品种名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_bchno',
    label: '批次号',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_lotnum',
    label: '生产批号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_date',
    label: '生产日期',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'expy_end',
    label: '有效期至',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'invdate',
    label: '消耗日期',
    width: 120,
    showOverflowTooltip: true
  },
  { prop: 'udi', label: 'UDI码', width: 150, showOverflowTooltip: true },
  { prop: 'goods_qty', label: '数量', width: 80, showOverflowTooltip: true },
  {
    prop: 'finl_trns_pric',
    label: '供应价格',
    width: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'month_id',
    label: '月份标识',
    width: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'ybstate_cshpc',
    label: '状态',
    width: 80,
    showOverflowTooltip: true
  }
];
export const outboundColumns = [
  {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    fixed: 'left'
  },
  {
    prop: 'his_id',
    label: '消耗记录ID',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'med_list_codg',
    label: '医保编码',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_id',
    label: '品种编码',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_name',
    label: '品种名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_bchno',
    label: '批次号',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_lotnum',
    label: '生产批号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_date',
    label: '生产日期',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'expy_end',
    label: '有效期至',
    width: 120,
    showOverflowTooltip: true
  },
  { prop: 'invdate', label: '消耗日期', width: 120, showOverflowTooltip: true },
  { prop: 'udi', label: 'UDI码', width: 150, showOverflowTooltip: true },
  { prop: 'goods_qty', label: '数量', width: 80, showOverflowTooltip: true },
  {
    prop: 'finl_trns_pric',
    label: '供应价格',
    width: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'month_id',
    label: '月份标识',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'ybstate_bg', label: '状态', width: 80, showOverflowTooltip: true }
];
export const procurementColumns = [
  {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    fixed: 'left'
  },
  {
    prop: 'his_id',
    label: '消耗记录ID',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'med_list_codg',
    label: '医保编码',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_id',
    label: '品种编码',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_name',
    label: '品种名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_bchno',
    label: '批次号',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'spler_name',
    label: '供应商名称',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_lotnum',
    label: '生产批号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'prodentp_name',
    label: '生产企业名称',
    width: 150,
    showOverflowTooltip: true
  },
  { prop: 'aprvno', label: '批准文号', width: 150, showOverflowTooltip: true },
  {
    prop: 'manu_date',
    label: '生产日期',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'expy_end',
    label: '有效期至',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'finl_trns_pric',
    label: '供应价格',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'goods_qty', label: '数量', width: 80, showOverflowTooltip: true },
  {
    prop: 'purc_invo_no',
    label: '采购单号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'month_id',
    label: '月份标识',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'udi', label: 'UDI码', width: 150, showOverflowTooltip: true },
  {
    prop: 'ybbj_pc',
    label: '状态',
    width: 80,
    templet: '#YBQuery_stateTpl',
    showOverflowTooltip: true
  }
];
export const returnColumns = [
  {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    fixed: 'left'
  },
  {
    prop: 'his_id',
    label: '消耗记录ID',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'med_list_codg',
    label: '医保编码',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_id',
    label: '品种编码',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_name',
    label: '品种名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_bchno',
    label: '批次号',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'spler_name',
    label: '供应商名称',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_lotnum',
    label: '生产批号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'prodentp_name',
    label: '生产企业名称',
    width: 150,
    showOverflowTooltip: true
  },
  { prop: 'aprvno', label: '批准文号', width: 150, showOverflowTooltip: true },
  {
    prop: 'manu_date',
    label: '生产日期',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'expy_end',
    label: '有效期至',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'finl_trns_pric',
    label: '供应价格',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'goods_qty', label: '数量', width: 80, showOverflowTooltip: true },
  {
    prop: 'purc_invo_no',
    label: '采购单号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'month_id',
    label: '月份标识',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'udi', label: 'UDI码', width: 150, showOverflowTooltip: true },
  { prop: 'ybbj_pc', label: '状态', width: 80, showOverflowTooltip: true }
];
export const warehousingColumns = [
  {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    fixed: 'left'
  },
  {
    prop: 'his_id',
    label: '消耗记录ID',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'med_list_codg',
    label: '医保编码',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_id',
    label: '品种编码',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_hilist_name',
    label: '品种名称',
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    prop: 'fixmedins_bchno',
    label: '批次号',
    width: 150,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_lotnum',
    label: '生产批号',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'manu_date',
    label: '生产日期',
    width: 120,
    showOverflowTooltip: true
  },
  {
    prop: 'expy_end',
    label: '有效期至',
    width: 120,
    showOverflowTooltip: true
  },
  { prop: 'invdate', label: '消耗日期', width: 120, showOverflowTooltip: true },
  { prop: 'udi', label: 'UDI码', width: 150, showOverflowTooltip: true },
  { prop: 'goods_qty', label: '数量', width: 80, showOverflowTooltip: true },
  {
    prop: 'finl_trns_pric',
    label: '供应价格',
    width: 100,
    showOverflowTooltip: true
  },
  {
    prop: 'month_id',
    label: '月份标识',
    width: 100,
    showOverflowTooltip: true
  },
  { prop: 'ybstate_bg', label: '状态', width: 80, showOverflowTooltip: true }
];
