/**
 * 表格列 / 导出列定义
 * 逐列对齐老系统 Views/KSInventory/DepaStorageQuery.cshtml:394-501
 * 与 Views/KSInventory/DepaStorageHZShow.cshtml:131-194（查看汇总）
 */

const toNumber = (value) => {
  const n = Number(value || 0);
  return Number.isNaN(n) ? 0 : n;
};

const fixed = (value, digits) => toNumber(value).toFixed(digits);

export const contractType = (v) =>
  v === '1' || v === 1 ? '中标' : v === '2' || v === 2 ? '临采' : '';

export const storageName = (v) =>
  v === 1 || v === '1'
    ? '院内库区'
    : v === 2 || v === '2'
    ? '院外库区'
    : '-';

export const classTwoName = (v) =>
  v === '1' || v === 1
    ? '重点治理'
    : v === '2' || v === 2
    ? '非重点治理'
    : '未设置';

export const biddingName = (v) => (v === '1' || v === 1 ? '是' : '否');

/** 老系统 hide:!isFszxy 的三列，仅佛山三水院区显示 */
const FSZXY_ONLY = ['GROUP_NAME', 'JYK_YQM', 'SING_TIME'];

/**
 * 明细表格列（31 列，含 3 列院区专属）
 * @param {Object} options
 * @param {boolean} options.showFszxy 是否显示院区专属列
 */
export function buildColumns({ showFszxy = false } = {}) {
  const columns = [
    {
      prop: 'Contract_Type',
      label: '合同类型',
      minWidth: 90,
      align: 'center',
      sortable: 'custom',
      showOverflowTooltip: true,
      formatter: (row, column, value) => contractType(value)
    },
    {
      prop: 'Storage_ID',
      label: '业务发起库区',
      minWidth: 100,
      align: 'center',
      sortable: 'custom',
      showOverflowTooltip: true,
      formatter: (row, column, value) => storageName(value)
    },
    {
      prop: 'SUPPLIER_NAME',
      label: '科室/供应商名称',
      minWidth: 110,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'GROUP_NAME',
      label: '组别',
      minWidth: 90,
      showOverflowTooltip: true
    },
    {
      prop: 'JYK_YQM',
      label: '仪器名',
      minWidth: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'RECEIVING_TIME',
      label: '入库时间',
      minWidth: 130,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'SING_TIME',
      label: '标记时间',
      minWidth: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'Operator',
      label: '操作人',
      minWidth: 90,
      align: 'center',
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'VARIETIE_CODE_NEW',
      label: '品种(材料)编码',
      minWidth: 110,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'SPH_ERP_VARIETIE_CODE',
      label: '上药HERP编码',
      minWidth: 110,
      showOverflowTooltip: true
    },
    {
      // 老页面把「计费编码」也绑到了 SPH_ERP_VARIETIE_CODE（笔误），
      // 后端模型里其实有 CHARGING_CODE，这里优先取它
      prop: 'CHARGING_CODE',
      label: '计费编码',
      minWidth: 100,
      showOverflowTooltip: true,
      formatter: (row) => row.CHARGING_CODE || row.SPH_ERP_VARIETIE_CODE || ''
    },
    {
      prop: 'VARIETIE_NAME',
      label: '品种全称',
      minWidth: 200,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'SPECIFICATION_OR_TYPE',
      label: '型号/规格',
      minWidth: 180,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    { prop: 'UNIT', label: '单位', minWidth: 70, align: 'center', showOverflowTooltip: true },
    {
      prop: 'MANUFACTURING_ENT_NAME',
      label: '生产企业名称',
      minWidth: 160,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    { prop: 'MEDICAL_CODE', label: '医保码', minWidth: 90, showOverflowTooltip: true },
    { prop: 'Brand', label: '品牌', minWidth: 70, showOverflowTooltip: true },
    { prop: 'BATCH', label: '生产批号', minWidth: 90, showOverflowTooltip: true },
    { prop: 'BATCH_PRODUCTION_DATE', label: '生产时间', minWidth: 100, showOverflowTooltip: true },
    { prop: 'BATCH_VALIDITY_PERIOD', label: '有效到期', minWidth: 100, showOverflowTooltip: true },
    { prop: 'DISINFECTION_BATCH', label: '灭菌批号', minWidth: 90, showOverflowTooltip: true },
    { prop: 'COEFFICIENT', label: '系数', minWidth: 70, align: 'center', showOverflowTooltip: true },
    { prop: 'RECEIVING_QUANTITY', label: '入库数量', minWidth: 90, align: 'center', showOverflowTooltip: true },
    {
      prop: 'SUPPLY_PRICE',
      label: '消耗价',
      minWidth: 90,
      align: 'right',
      showOverflowTooltip: true,
      formatter: (row, column, value) => fixed(value, 2)
    },
    {
      prop: 'PURCHASE_PRICE',
      label: '采购价',
      minWidth: 90,
      align: 'right',
      showOverflowTooltip: true,
      formatter: (row, column, value) => fixed(value, 4)
    },
    { prop: 'GOODS_QTY', label: '散货数量', minWidth: 90, align: 'center', showOverflowTooltip: true },
    { prop: 'BUSINESS_BILL', label: '入库单号', minWidth: 110, showOverflowTooltip: true },
    { prop: 'MARK', label: '入库备注', minWidth: 110, showOverflowTooltip: true },
    { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 120, showOverflowTooltip: true },
    {
      prop: 'HIGH_OR_LOW_CLASS_TWO',
      label: '高低值分类下级属性',
      minWidth: 130,
      align: 'center',
      showOverflowTooltip: true,
      formatter: (row, column, value) => classTwoName(value)
    },
    {
      prop: 'IS_BIDDING',
      label: '是否中标',
      minWidth: 90,
      align: 'center',
      showOverflowTooltip: true,
      formatter: (row, column, value) => biddingName(value)
    }
  ];

  return showFszxy
    ? columns
    : columns.filter((col) => !FSZXY_ONLY.includes(col.prop));
}

const g = (label, get) => ({ label, get });

/**
 * 两套导出列，对应老页面 Excel_StorageSingle（legacy）与
 * Excel_StorageSingleNew（current）。老页面两个按钮默认由权限控制显示。
 */
export const EXPORT_COLUMNS = {
  legacy: [
    g('合同类型', (r) => contractType(r.Contract_Type)),
    g('业务发起库区', (r) => storageName(r.Storage_ID)),
    g('科室/供应商名称', (r) => r.SUPPLIER_NAME),
    g('入库时间', (r) => r.RECEIVING_TIME),
    g('品种(材料)编码', (r) => r.VARIETIE_CODE_NEW),
    g('上药HERP编码', (r) => r.SPH_ERP_VARIETIE_CODE),
    g('品种全称', (r) => r.VARIETIE_NAME),
    g('型号/规格', (r) => r.SPECIFICATION_OR_TYPE),
    g('单位', (r) => r.UNIT),
    g('生产企业名称', (r) => r.MANUFACTURING_ENT_NAME),
    g('医保码', (r) => r.MEDICAL_CODE),
    g('品牌', (r) => r.Brand),
    g('生产批号', (r) => r.BATCH),
    g('生产时间', (r) => r.BATCH_PRODUCTION_DATE),
    g('有效到期', (r) => r.BATCH_VALIDITY_PERIOD),
    g('灭菌批号', (r) => r.DISINFECTION_BATCH),
    g('系数', (r) => r.COEFFICIENT),
    g('入库数量', (r) => r.RECEIVING_QUANTITY),
    g('消耗价', (r) => r.SUPPLY_PRICE),
    g('采购价', (r) => r.PURCHASE_PRICE),
    g('散货数量', (r) => r.GOODS_QTY),
    g('入库单号', (r) => r.BUSINESS_BILL),
    g('入库备注', (r) => r.MARK),
    g('注册证号', (r) => r.APPROVAL_NUMBER),
    g('高低值分类下级属性', (r) => classTwoName(r.HIGH_OR_LOW_CLASS_TWO)),
    g('是否中标', (r) => biddingName(r.IS_BIDDING)),
    g('操作人', (r) => r.Operator)
  ],
  current: [
    g('合同类型', (r) => contractType(r.Contract_Type)),
    g('科室/供应商名称', (r) => r.SUPPLIER_NAME),
    g('供应商名称', (r) => r.From_Supplier_Name),
    g('入库时间', (r) => r.RECEIVING_TIME),
    g('品种(材料)编码', (r) => r.VARIETIE_CODE_NEW),
    g('上药HERP编码', (r) => r.SPH_ERP_VARIETIE_CODE),
    g('计费编码', (r) => r.CHARGING_CODE || r.SPH_ERP_VARIETIE_CODE),
    g('品种全称', (r) => r.VARIETIE_NAME),
    g('型号/规格', (r) => r.SPECIFICATION_OR_TYPE),
    g('单位', (r) => r.UNIT),
    g('生产企业名称', (r) => r.MANUFACTURING_ENT_NAME),
    g('医保码', (r) => r.MEDICAL_CODE),
    g('品牌', (r) => r.Brand),
    g('生产批号', (r) => r.BATCH),
    g('生产时间', (r) => r.BATCH_PRODUCTION_DATE),
    g('有效到期', (r) => r.BATCH_VALIDITY_PERIOD),
    g('灭菌批号', (r) => r.DISINFECTION_BATCH),
    g('系数', (r) => r.COEFFICIENT),
    g('入库数量', (r) => r.RECEIVING_QUANTITY),
    g('消耗价', (r) => fixed(r.SUPPLY_PRICE, 4)),
    g('采购价', (r) => r.PURCHASE_PRICE),
    g('散货数量', (r) => r.GOODS_QTY),
    g('入库单号', (r) => r.BUSINESS_BILL),
    g('入库备注', (r) => r.MARK),
    g('注册证号', (r) => r.APPROVAL_NUMBER),
    g('高低值分类下级属性', (r) => classTwoName(r.HIGH_OR_LOW_CLASS_TWO)),
    g('是否中标', (r) => biddingName(r.IS_BIDDING)),
    g('操作人', (r) => r.Operator),
    g('组别', (r) => r.GROUP_NAME),
    g('仪器名', (r) => r.JYK_YQM)
  ]
};

/** 查看汇总：DepaStorageHZShow.cshtml:131-194 的 11 列 */
export const SUMMARY_COLUMNS = [
  { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 90 },
  { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 110 },
  { prop: 'VARIETIE_NAME', label: '品种全称', minWidth: 200 },
  { prop: 'SPECIFICATION_OR_TYPE', label: '型号规格', minWidth: 160 },
  { prop: 'UNIT', label: '单位', minWidth: 60 },
  { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业名称', minWidth: 180 },
  { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 160 },
  { prop: 'APPROVAL_NUMBER', label: '批准文号', minWidth: 120 },
  {
    prop: 'SUPPLY_PRICE',
    label: '价格',
    minWidth: 90,
    formatter: (row) => fixed(row.SUPPLY_PRICE, 2)
  },
  { prop: 'GOODS_QTY', label: '数量', minWidth: 90 },
  {
    prop: 'Cost',
    label: '金额',
    minWidth: 100,
    formatter: (row) =>
      (toNumber(row.SUPPLY_PRICE) * toNumber(row.GOODS_QTY)).toFixed(2)
  }
];
