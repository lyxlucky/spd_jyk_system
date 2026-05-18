import {
  formatDate10,
  formatDateWithExpiry,
  upShelfStateName,
  receivePropertyName,
  formatSupplyPrice
} from './format';

export function createInventoryColumns({ hideStorageTwo, hidePdaCoun, showAction }) {
  const cols = [];
  if (showAction) {
    cols.push({
      columnKey: 'action',
      label: '操作',
      width: 100,
      align: 'center',
      slot: 'inventoryAction'
    });
  }
  cols.push(
    { prop: 'Source_Name', label: '库房位置', width: 80, sortable: 'custom' },
    {
      prop: 'STORAGE_TWO_NAME',
      label: '仓库',
      width: 80,
      sortable: 'custom',
      show: !hideStorageTwo
    },
    {
      columnKey: 'area',
      label: '所属区域',
      width: 70,
      formatter: (row) => upShelfStateName(row.Up_Shelf_State, row.Source_Name)
    },
    {
      prop: 'Receive_Property',
      label: '收货类型',
      width: 60,
      align: 'center',
      formatter: (row) => receivePropertyName(row.Receive_Property)
    },
    { prop: 'Varietie_Code_New', label: '品种编码', width: 80, sortable: 'custom' },
    { prop: 'Varietie_Name', label: '品种全称', width: 220 },
    { prop: 'Specification_Or_Type', label: '型号/规格', width: 120 },
    { prop: 'Unit', label: '单位', width: 45, align: 'center' },
    { prop: 'Goods_Qty', label: '库存散货', width: 80, sortable: 'custom', align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', width: 160 },
    { prop: 'Supplier_Name', label: '供应商', width: 160 },
    { prop: 'Batch', label: '生产批号', width: 100, sortable: 'custom' },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      width: 90,
      sortable: 'custom',
      formatter: (row) => formatDate10(row.Batch_Production_Date)
    },
    {
      prop: 'Batch_Validity_Period',
      label: '有效到期',
      width: 90,
      sortable: 'custom',
      slot: 'batchValidity'
    },
    {
      prop: 'CONTRACT_END_TIME',
      label: '合同到期',
      width: 90,
      sortable: 'custom',
      slot: 'contractEnd'
    },
    { prop: 'Coefficient', label: '系数', width: 45, align: 'center' },
    {
      prop: 'Supply_Price',
      label: '结算价',
      width: 80,
      align: 'right',
      formatter: (row) => formatSupplyPrice(row)
    },
    { prop: 'Def_Qty', label: '库存定数包数', width: 90, sortable: 'custom', align: 'center' },
    { prop: 'Storaged_Days', label: '在库天数', width: 80, sortable: 'custom', align: 'center' },
    { prop: 'Def_Down_Shelf_Qty', label: '定数包未上架', width: 90, align: 'center' },
    { prop: 'Goods_Down_Shelf_Qty', label: '散货未上架', width: 80, align: 'center' },
    { prop: 'Goods_Look_Qty', label: '散货锁定', width: 80, align: 'center' },
    { prop: 'Def_Locking_Qty', label: '定数包锁定', width: 80, align: 'center' },
    { prop: 'Pre_Lock_Sum', label: '定数包预锁', width: 80, align: 'center' },
    { prop: 'Batch_Id', label: '批次号ID', width: 60 },
    { prop: 'Brand', label: '品牌', width: 55 },
    { prop: 'Position', label: '货位号', width: 55 },
    { prop: 'CONTRACT_NAME', label: '合同名称', width: 80 },
    { prop: 'NOTE_DESCRIPTION', label: '备注', width: 55 },
    {
      prop: 'NO_CONSUME_NUM',
      label: '科室未结算',
      width: 85,
      show: !hidePdaCoun,
      formatter: (row) => (row.NO_CONSUME_NUM == null ? 0 : row.NO_CONSUME_NUM)
    }
  );
  return cols;
}
