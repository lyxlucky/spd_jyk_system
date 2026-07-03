export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 19);
}

export function formatSendState(state) {
  const map = {
    '0': '未发送（SPD）',
    '1': '已发送（SPD）',
    '2': '已查看（B2B）',
    '3': '处理中（B2B）',
    '4': '部分送货（B2B）',
    '5': '全部送货（B2B）',
    '6': '部分收货（SPD）',
    '7': '全部收货（SPD）'
  };
  if (state === '' || state == null) return '全部';
  return map[String(state)] || '未知';
}

export function formatApproveState(state) {
  if (String(state) === '0') return '未审批';
  if (String(state) === '1') return '已成功审批';
  return '拒绝审批';
}

export function formatStorageName(id) {
  const v = String(id ?? '');
  if (v === '1') return '院内';
  if (v === '2') return '院外';
  return v;
}

export function storageOptions(storageId) {
  const id = String(storageId ?? '1');
  if (id === '2') {
    return [
      { value: '2', label: '院外库区' },
      { value: '1', label: '院内库区' }
    ];
  }
  return [
    { value: '1', label: '院内库区' },
    { value: '2', label: '院外库区' }
  ];
}

export function initOosRow(row) {
  const qty = row.Plan_Qty ?? row.In_Absence_Qty ?? '';
  return {
    ...row,
    Plan_Qty: qty,
    _goodsPlan: qty,
    _storageId: String(row.Storage_Id ?? '1')
  };
}

export function buildDeptQhPopupItems(rows) {
  return (rows || []).map((row) => ({
    Varietie_Code: row.Varietie_Code,
    varietie_Code_New: row.Varietie_Code_New,
    Def_No_Pkg_Coefficient: '1',
    Arg_Plan: row._goodsPlan ?? row.Plan_Qty ?? row.In_Absence_Qty,
    Goods_Qty: row._goodsPlan ?? row.Plan_Qty ?? row.In_Absence_Qty,
    StorageID: row._storageId ?? row.Storage_Id
  }));
}

export function selectionCol() {
  return {
    type: 'selection',
    columnKey: 'selection',
    width: 48,
    align: 'center',
    className: 'spd-checkbox-col'
  };
}

export function buildOosColumns() {
  return [
    selectionCol(),
    { label: '品种编码', prop: 'Varietie_Code_New', minWidth: 100, showOverflowTooltip: true },
    { label: '申领单号', prop: 'Plan_Number', minWidth: 100, showOverflowTooltip: true },
    { label: '申领时间', minWidth: 155, slot: 'toexamineTime' },
    { label: '备注', prop: 'Note_Description', minWidth: 90, showOverflowTooltip: true },
    { label: '二级科室名称', prop: 'Dept_Two_Name', minWidth: 100, showOverflowTooltip: true },
    { label: '品种名称', prop: 'Varietie_Name', minWidth: 160, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 100, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', width: 55, align: 'center' },
    { label: '中心库下限', prop: 'Storehouse_Lower', minWidth: 90, align: 'center' },
    { label: '中心库上限', prop: 'Storehouse_Uppper', minWidth: 90, align: 'center' },
    { label: '大包装数量', prop: 'Big_Box_Count', minWidth: 90, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商名称', prop: 'Supplier_Name', minWidth: 140, showOverflowTooltip: true },
    { label: '散存（院内）', prop: 'In_Goods_Qty', minWidth: 90, align: 'center' },
    { label: '包存（院内）', prop: 'In_Defs_Qty', minWidth: 90, align: 'center' },
    { label: '散存（院外）', prop: 'Out_Goods_Qty', minWidth: 90, align: 'center' },
    { label: '包存（院外）', prop: 'Out_Defs_Qty', minWidth: 90, align: 'center' },
    { label: '备货在途数量', prop: 'Qty', minWidth: 100, align: 'center' },
    { label: '院内缺货数量（散货）', prop: 'In_Absence_Qty', minWidth: 130, align: 'center' },
    { label: '备货数（散）', minWidth: 100, align: 'center', slot: 'goodsPlan' },
    { label: '收货库区', minWidth: 110, align: 'center', slot: 'storageSelect' }
  ];
}

export function buildPickingColumns() {
  return [
    { label: '备货计划单号', prop: 'Stock_Up_Plan_No', minWidth: 150, showOverflowTooltip: true },
    { label: '创建人', prop: 'Creator', minWidth: 80, align: 'center' },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '收货库区', minWidth: 80, align: 'center', slot: 'storageId' },
    { label: '创建时间', minWidth: 150, slot: 'createTime' },
    { label: '备注', minWidth: 70, align: 'center', slot: 'planRemark' },
    { label: '审批状态', minWidth: 95, align: 'center', slot: 'approveState' },
    { label: '发送状态', minWidth: 120, align: 'center', slot: 'sendState' }
  ];
}

export function buildPickingDetailColumns() {
  return [
    selectionCol(),
    { label: '品种(材料)编码', prop: 'Varietie_Code_New', minWidth: 110, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 140, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 100, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', width: 55, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '采购价', minWidth: 80, align: 'right', slot: 'purchasePrice' },
    { label: '系数', prop: 'Coefficient', width: 55, align: 'center' },
    { label: '备货数（包）', prop: 'Stock_Up_Plan_Def_Quantity', minWidth: 95, align: 'center' },
    { label: '备货数（散）', prop: 'Stock_Up_Plan_Goods_Quantity', minWidth: 95, align: 'center' },
    { label: '实收数量', prop: 'ReceiptQty', minWidth: 85, align: 'center' },
    { label: '备货时间', prop: 'Plan_Time', minWidth: 100 }
  ];
}

export const extendPreviewColumns = [
  { label: '库房名称', prop: 'Name', minWidth: 90 },
  { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 110 },
  { label: '品种全称', prop: 'Varietie_Name', minWidth: 140 },
  { label: '批准文号', prop: 'Approval_Number', minWidth: 100 },
  { label: '发证日期', prop: 'Registration_Issuing_Date', minWidth: 100 },
  { label: '有效到期', prop: 'Registration_Valid_Date', minWidth: 100 },
  { label: '供应商名称', prop: 'Supplier_Name', minWidth: 120 },
  { label: '产品类型', prop: 'Prod_Big_Class_Name', minWidth: 90 },
  { label: '管理类别', prop: 'Mgmt_Cat_Name', minWidth: 90 },
  { label: '监管类别', prop: 'Regulatory_Cat_Name', minWidth: 90 }
];
