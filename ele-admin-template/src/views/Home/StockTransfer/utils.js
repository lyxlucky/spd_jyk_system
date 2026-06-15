/** 对称差：仅出现在其中一个数组中的元素（旧页 getArrDifference） */
export function arrSymmetricDifference(arr1, arr2) {
  const a = arr1 || [];
  const b = arr2 || [];
  return a.concat(b).filter((v, _i, arr) => arr.indexOf(v) === arr.lastIndexOf(v));
}

export function formatTransferState(val) {
  const map = {
    0: '新建',
    1: '审批',
    2: '退转中',
    3: '退转成功',
    4: '退转异常'
  };
  return map[String(val)] ?? val ?? '';
}

export function createTargetWhere() {
  return {
    targetSupplierName: '',
    targetContractName: '',
    targetVarietie: '',
    targetSpecType: ''
  };
}

export function createTransferWhere() {
  return {
    transferNumber: '',
    sourceSupplierName: '',
    targetSupplierName: '',
    varietie: '',
    specType: '',
    state: ''
  };
}

export function buildTargetColumns() {
  return [
    { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'Target_Supplier_Name', label: '供应商名称', minWidth: 160, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Contract_Name', label: '合同名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Supply_Price', label: '结算价', minWidth: 90, align: 'right', sortable: 'custom' },
    { prop: 'Target_Purchase_Price', label: '采购价', minWidth: 90, align: 'right', sortable: 'custom' },
    { prop: 'Target_Varietie_Code_New', label: '品种编码', minWidth: 130, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Spec_Type', label: '规格型号', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Unit', label: '单位', minWidth: 70, align: 'center', sortable: 'custom' }
  ];
}

export function buildTransferColumns() {
  return [
    { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'Transfer_Number', label: '退转单号', minWidth: 150, showOverflowTooltip: true, sortable: 'custom' },
    {
      slot: 'state',
      prop: 'State',
      label: '状态',
      minWidth: 88,
      align: 'center',
      sortable: 'custom'
    },
    { prop: 'Create_Time', label: '创建时间', minWidth: 150, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 120, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Varietie_Name', label: '品种名称', minWidth: 160, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 130, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Supply_Price', label: '源-结算价', minWidth: 100, align: 'right', sortable: 'custom' },
    { prop: 'Source_Supplier_Name', label: '源-供应商', minWidth: 130, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Supplier_Name', label: '目标-供应商名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Supply_Price', label: '目标-结算价', minWidth: 100, align: 'right', sortable: 'custom' }
  ];
}

export function buildSourceColumns() {
  return [
    { type: 'selection', columnKey: 'selection', width: 45, align: 'center', fixed: 'left' },
    { type: 'index', columnKey: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'Target_Supplier_Name', label: '目标-供应商名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Contract_Name', label: '目标-合同名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Target_Supply_Price', label: '目标-结算价', minWidth: 100, align: 'right', sortable: 'custom' },
    { prop: 'Target_Purchase_Price', label: '目标-采购价', minWidth: 100, align: 'right', sortable: 'custom' },
    { prop: 'Source_Varietie_Code_New', label: '源-品种编码', minWidth: 120, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Varietie_Name', label: '源-品种名称', minWidth: 140, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Spec_Type', label: '源-规格型号', minWidth: 120, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Unit', label: '源-单位', minWidth: 80, align: 'center', sortable: 'custom' },
    { prop: 'Source_Supplier_Name', label: '源-供应商', minWidth: 130, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Contract_Name', label: '源-合同名称', minWidth: 130, showOverflowTooltip: true, sortable: 'custom' },
    { prop: 'Source_Supply_Price', label: '源-结算价', minWidth: 100, align: 'right', sortable: 'custom' },
    { prop: 'Source_Purchase_Price', label: '源-采购价', minWidth: 100, align: 'right', sortable: 'custom' }
  ];
}
