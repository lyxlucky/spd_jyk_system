import {
  fmtDate10,
  fmtMainUpShelfState,
  fmtDetailUpShelfState,
  fmtReceiveProperty,
  fmtSupplyPrice,
  fmtContractEnd,
  fmtType,
  fmtDetailCreateType,
  fmtSettleState,
  isStHospital,
  isHptxHospital,
  isStzxHospital,
  isSkuHospital,
  isSptHospital
} from './utils';

export function buildMainColumns(opts = {}) {
  const { hideStorageTwo = false, hidePdaCount = false } = opts;
  const cols = [
    { type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { prop: 'Source_Name', label: '库存院区', minWidth: 90, showOverflowTooltip: true },
    { prop: 'Source_Name2', label: '库房位置', minWidth: 90, showOverflowTooltip: true, formatter: (r) => r.Source_Name },
    {
      prop: 'STORAGE_TWO_NAME',
      label: '仓库',
      minWidth: 80,
      showOverflowTooltip: true,
      hide: hideStorageTwo
    },
    {
      prop: 'Up_Shelf_State',
      label: '所属区域',
      minWidth: 100,
      showOverflowTooltip: true,
      slot: 'upShelfState'
    },
    {
      prop: 'Receive_Property',
      label: '收货类型',
      minWidth: 80,
      formatter: (r) => fmtReceiveProperty(r.Receive_Property)
    },
    { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 100, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'SKU_NAME',
      label: '品种SKU',
      minWidth: 90,
      showOverflowTooltip: true,
      hide: !isSkuHospital()
    },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 100, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 55, align: 'center' },
    { prop: 'Goods_Qty', label: '库存散货', width: 80, align: 'center', sortable: 'custom' },
    { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 100, showOverflowTooltip: true },
    {
      prop: 'PROVINCE_PLATFORM_CODE',
      label: '药交ID',
      minWidth: 90,
      showOverflowTooltip: true,
      hide: !isSptHospital()
    },
    {
      prop: 'PT_HTNUM',
      label: '平台合同编码',
      minWidth: 100,
      showOverflowTooltip: true,
      hide: !isStHospital()
    },
    { prop: 'YG_CODE', label: '阳光产品码', minWidth: 90, showOverflowTooltip: true },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Batch', label: '生产批号', minWidth: 90, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      width: 100,
      formatter: (r) => fmtDate10(r.Batch_Production_Date)
    },
    {
      prop: 'Batch_Validity_Period',
      label: '有效到期',
      width: 100,
      slot: 'batchValidity'
    },
    { prop: 'Coefficient', label: '系数', width: 55, align: 'center' },
    {
      prop: 'Supply_Price',
      label: '结算价',
      width: 80,
      align: 'right',
      sortable: 'custom',
      formatter: (r) => fmtSupplyPrice(r)
    },
    { prop: 'Def_Qty', label: '库存定数包数', width: 95, align: 'center', sortable: 'custom' },
    {
      prop: 'Def_Qty_Scatter',
      label: '库存定数包数转散',
      width: 110,
      align: 'center',
      hide: !isStzxHospital(),
      formatter: (r) => (Number(r.Def_Qty) || 0) * (Number(r.Coefficient) || 0)
    },
    { prop: 'Storaged_Days', label: '在库天数', width: 80, align: 'center', sortable: 'custom' },
    { prop: 'Def_Down_Shelf_Qty', label: '定数包未上架', width: 95, align: 'center' },
    { prop: 'Goods_Down_Shelf_Qty', label: '散货未上架', width: 90, align: 'center' },
    { prop: 'Goods_Look_Qty', label: '散货锁定', width: 80, align: 'center' },
    { prop: 'Def_Locking_Qty', label: '定数包锁定', width: 90, align: 'center' },
    { prop: 'Pre_Lock_Sum', label: '定数包预锁', width: 90, align: 'center' },
    { prop: 'APPROVAL_NUMBER2', label: '批准文号', minWidth: 90, formatter: (r) => r.APPROVAL_NUMBER },
    { prop: 'MEDICAL_CODE', label: '医保码', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Position', label: '货位号', width: 75, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 90, showOverflowTooltip: true },
    { prop: 'CONTRACT_CODE', label: '合同编码', minWidth: 110, showOverflowTooltip: true },
    {
      prop: 'CONTRACT_END_TIME',
      label: '合同到期',
      minWidth: 120,
      slot: 'contractEnd'
    },
    {
      prop: 'DET_CONTRACT_END',
      label: '合同明细到期',
      minWidth: 120,
      slot: 'detContractEnd'
    },
    { prop: 'INVOICES', label: '发票', width: 80, hide: !isHptxHospital(), showOverflowTooltip: true },
    {
      prop: 'TYPE',
      label: '库别',
      width: 80,
      hide: !isHptxHospital(),
      formatter: (r) => fmtType(r.TYPE)
    },
    { prop: 'NOTE_DESCRIPTION', label: '备注', width: 60, showOverflowTooltip: true },
    {
      prop: 'NO_CONSUME_NUM',
      label: '科室未结算',
      width: 85,
      align: 'center',
      hide: hidePdaCount,
      formatter: (r) => (r.NO_CONSUME_NUM == null ? 0 : r.NO_CONSUME_NUM)
    },
    { prop: 'AVG7', label: '周日均用量', width: 85, align: 'center', sortable: 'custom' },
    { prop: 'AVG30', label: '月日均用量', width: 85, align: 'center', sortable: 'custom' },
    { prop: 'Batch_Id', label: '批次号ID', width: 75, showOverflowTooltip: true },
    { prop: 'MGMT_CAT_NAME', label: '管理类别', width: 80, showOverflowTooltip: true },
    { prop: 'DELIVERY_NOTE_NUMBER', label: 'SPD入库单号', minWidth: 100, showOverflowTooltip: true },
    {
      prop: 'DETAIL_CREATE_TYPE',
      label: '是否跟台',
      width: 75,
      formatter: (r) => fmtDetailCreateType(r.DETAIL_CREATE_TYPE)
    },
    { prop: 'DELIVERY_TIME', label: '入库时间', minWidth: 90, showOverflowTooltip: true },
    { prop: 'UDI_TOP', label: 'UDI', minWidth: 100, showOverflowTooltip: true }
  ];
  return cols.filter((c) => !c.hide);
}

export function buildDetailColumns(opts = {}) {
  const { hidePdaCount = false } = opts;
  const cols = [
    { type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { prop: 'Source_Name', label: '库房位置', minWidth: 90, showOverflowTooltip: true },
    {
      prop: 'Up_Shelf_State',
      label: '所属区域',
      minWidth: 90,
      formatter: (r) => fmtDetailUpShelfState(r)
    },
    { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 55, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Batch', label: '生产批号', minWidth: 90, showOverflowTooltip: true },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      width: 100,
      formatter: (r) => fmtDate10(r.Batch_Production_Date)
    },
    {
      prop: 'Batch_Validity_Period',
      label: '有效到期',
      width: 100,
      slot: 'batchValidity'
    },
    { prop: 'Coefficient', label: '系数', width: 55, align: 'center' },
    { prop: 'Def_No_Pkg_Code', label: '定数码', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'STOCK_OUT_DISTRIBUTE_NUMBER', label: '出库单号', minWidth: 100, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Position', label: '货位号', width: 75, showOverflowTooltip: true },
    { prop: 'Storaged_Days', label: '在库天数', width: 80, align: 'center', sortable: 'custom' },
    { prop: 'Brand', label: '品牌', width: 70, showOverflowTooltip: true },
    {
      prop: 'USE_DEF_NO_PKG_CODE',
      label: '是否结算',
      width: 80,
      align: 'center',
      hide: hidePdaCount,
      formatter: (r) => fmtSettleState(r)
    }
  ];
  return cols.filter((c) => !c.hide);
}

export const summaryColumns = [
  { prop: 'Hosp_Class_Common_Name', label: '品种名称', minWidth: 200, showOverflowTooltip: true },
  { prop: 'Qty', label: '数量', width: 100, align: 'center' }
];

export const supplierSummaryColumns = [
  { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 100, showOverflowTooltip: true },
  { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 150, showOverflowTooltip: true },
  { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 100, showOverflowTooltip: true },
  { prop: 'QTY', label: '数量', width: 80, align: 'center' },
  { prop: 'UNIT', label: '单位', width: 55, align: 'center' },
  { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 120, showOverflowTooltip: true },
  { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 120, showOverflowTooltip: true }
];
