import {
  areaTypeName,
  enabledName,
  flagName,
  fmtDateTime,
  fmtQty,
  stockDeductTypeName
} from './utils';

function cellValue(row, column, value, prop) {
  if (value !== undefined) return value;
  const key = prop || column?.property || column?.prop;
  return key ? row?.[key] : '';
}

// 数量列统一格式化，去掉多余小数位。
const qtyFormatter = (prop) => (row, column, value) =>
  fmtQty(cellValue(row, column, value, prop));
// 时间列统一截取到秒。
const timeFormatter = (prop) => (row, column, value) =>
  fmtDateTime(cellValue(row, column, value, prop));

// 库房/库区耗材汇总表格列。
export function getWarehouseMaterialColumns() {
  return [
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'AREA_CODE', label: '库房/库区编码', width: 130, align: 'center', showOverflowTooltip: true },
    { prop: 'AREA_NAME', label: '库房/库区名称', width: 150, align: 'center', showOverflowTooltip: true },
    { prop: 'AREA_TYPE', label: '类型', width: 80, align: 'center', formatter: (row) => areaTypeName(row.AREA_TYPE) },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'CHARGE_CODE', label: '计费编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 260, align: 'center', showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 220, align: 'center', showOverflowTooltip: true },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 240, align: 'center', showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 80, align: 'center', showOverflowTooltip: true },
    { prop: 'STOCK_QTY', label: '库存数量', width: 110, align: 'right', formatter: qtyFormatter('STOCK_QTY') },
    { prop: 'REAL_DEDUCT_QTY', label: '实际扣费数量', width: 130, align: 'right', formatter: qtyFormatter('REAL_DEDUCT_QTY') },
    { prop: 'PRE_DEDUCT_QTY', label: '预扣数量', width: 110, align: 'right', formatter: qtyFormatter('PRE_DEDUCT_QTY') },
    { prop: 'SPD_DEPT_COUNT', label: '涉及SPD科室数', width: 130, align: 'right' },
    { prop: 'LAST_OPERATE_TIME', label: '最近使用时间', width: 170, align: 'center', formatter: timeFormatter('LAST_OPERATE_TIME') },
    { columnKey: 'warehouseAction', label: '操作', width: 90, align: 'center', fixed: 'right', slot: 'warehouseAction', className: 'action-col' }
  ];
}

// SPD科室库存汇总表格列。
export function getWarehouseDeptColumns() {
  return [
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'DEPT_TWO_CODE', label: 'SPD科室编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'DEPT_TWO_NAME', label: 'SPD科室名称', width: 180, align: 'center', showOverflowTooltip: true },
    { prop: 'AREA_CODE', label: '库房/库区编码', width: 130, align: 'center', showOverflowTooltip: true },
    { prop: 'AREA_NAME', label: '库房/库区名称', width: 150, align: 'center', showOverflowTooltip: true },
    { columnKey: 'defaultFlag', label: '默认', width: 70, align: 'center', slot: 'defaultFlag' },
    { columnKey: 'enabledFlag', label: '启用', width: 70, align: 'center', slot: 'enabledFlag' },
    { prop: 'MATERIAL_COUNT', label: '耗材种类数', width: 110, align: 'right' },
    { prop: 'STOCK_QTY', label: '库存数量', width: 110, align: 'right', formatter: qtyFormatter('STOCK_QTY') },
    { prop: 'REAL_DEDUCT_QTY', label: '实际扣费数量', width: 130, align: 'right', formatter: qtyFormatter('REAL_DEDUCT_QTY') },
    { prop: 'PRE_DEDUCT_QTY', label: '预扣数量', width: 110, align: 'right', formatter: qtyFormatter('PRE_DEDUCT_QTY') },
    { prop: 'LAST_OPERATE_TIME', label: '最近使用时间', minWidth: 160, align: 'center', formatter: timeFormatter('LAST_OPERATE_TIME') }
  ];
}

// 选中SPD科室后的耗材汇总表格列。
export function getDeptMaterialColumns() {
  return [
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'DEPT_TWO_CODE', label: 'SPD科室编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'DEPT_TWO_NAME', label: 'SPD科室名称', width: 180, align: 'center', showOverflowTooltip: true },
    { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'CHARGE_CODE', label: '计费编码', width: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 260, align: 'center', showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 220, align: 'center', showOverflowTooltip: true },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 240, align: 'center', showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 80, align: 'center', showOverflowTooltip: true },
    { prop: 'STOCK_QTY', label: '库存数量', width: 110, align: 'right', formatter: qtyFormatter('STOCK_QTY') },
    { prop: 'REAL_DEDUCT_QTY', label: '实际扣费数量', width: 130, align: 'right', formatter: qtyFormatter('REAL_DEDUCT_QTY') },
    { prop: 'PRE_DEDUCT_QTY', label: '预扣数量', width: 110, align: 'right', formatter: qtyFormatter('PRE_DEDUCT_QTY') },
    { prop: 'LAST_OPERATE_TIME', label: '最近使用时间', width: 170, align: 'center', formatter: timeFormatter('LAST_OPERATE_TIME') },
    { columnKey: 'deptMaterialAction', label: '操作', width: 90, align: 'center', fixed: 'right', slot: 'deptMaterialAction', className: 'action-col' }
  ];
}

// 库存流水明细表格列。
export function getMaterialDetailColumns() {
  return [
    { type: 'index', label: '序号', width: 60, align: 'center', fixed: 'left' },
    { prop: 'AREA_NAME', label: '库房/库区', width: 150, align: 'center', showOverflowTooltip: true },
    { prop: 'DEPT_TWO_CODE', label: 'SPD科室编码', width: 130, align: 'center', showOverflowTooltip: true },
    { prop: 'DEPT_TWO_NAME', label: 'SPD科室名称', width: 160, align: 'center', showOverflowTooltip: true },
    { prop: 'CHARGE_CODE', label: '计费编码', width: 130, align: 'center', showOverflowTooltip: true },
    { prop: 'VARIETIE_NAME', label: '品种名称', width: 220, align: 'center', showOverflowTooltip: true },
    { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 180, align: 'center', showOverflowTooltip: true },
    { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', width: 220, align: 'center', showOverflowTooltip: true },
    { prop: 'UNIT', label: '单位', width: 80, align: 'center', showOverflowTooltip: true },
    { prop: 'QTY', label: '数量', width: 90, align: 'right', formatter: qtyFormatter('QTY') },
    { prop: 'PRE_DEDUCT_QTY', label: '预扣数量', width: 100, align: 'right', formatter: qtyFormatter('PRE_DEDUCT_QTY') },
    {
      prop: 'STOCK_DEDUCT_TYPE_NAME',
      label: '扣费类型',
      width: 100,
      align: 'center',
      formatter: (row) => row.STOCK_DEDUCT_TYPE_NAME || stockDeductTypeName(row.STOCK_DEDUCT_TYPE)
    },
    { prop: 'PATIENT_NUMBER', label: '病患号', width: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'HOSPITALIZATION_NUMBER', label: '住院号', width: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'MEDICAL_ORDER_ID', label: '医嘱ID', width: 150, align: 'center', showOverflowTooltip: true },
    { prop: 'CONSUMER', label: '操作人', width: 110, align: 'center', showOverflowTooltip: true },
    { prop: 'OPEARTION_CHARGING_TIME', label: '计费时间', width: 170, align: 'center', formatter: timeFormatter('OPEARTION_CHARGING_TIME') },
    { prop: 'CREATE_TIME', label: '创建时间', width: 170, align: 'center', formatter: timeFormatter('CREATE_TIME') }
  ];
}

export { enabledName, flagName };
