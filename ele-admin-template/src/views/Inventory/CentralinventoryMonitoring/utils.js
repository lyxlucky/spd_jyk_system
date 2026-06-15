import { utils, writeFile } from 'xlsx';
import { API_BASE_URL, HOME_HP } from '@/config/setting';

export const monitorHpFlags = {
  isSpt: ['bd', 'bdrm'].includes(HOME_HP),
  isStzl: HOME_HP === 'stzl',
  isHnPagType: HOME_HP === 'szhn',
  isBd: HOME_HP === 'bd',
  isCg: HOME_HP === 'szlh'
};

export function monitorWarningRowClass({ row }) {
  const w = String(row.warning ?? '');
  if (w === '1') return 'monitor-warn-1';
  if (w === '2') return 'monitor-warn-2';
  if (w === '3') return 'monitor-warn-3';
  return '';
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
    '7': '全部收货（SPD）',
    '8': '强制关闭'
  };
  if (state === '' || state == null) return '全部';
  return map[String(state)] || '未知';
}

export function formatApproveState(state) {
  if (String(state) === '0') return '未审批';
  if (String(state) === '1') return '已成功审批';
  return '拒绝审批';
}

export function formatContractType(type) {
  if (String(type) === '1') return '中标';
  if (String(type) === '2') return '临采';
  return '';
}

export function formatConsumptionType(val) {
  const map = {
    '0': '条码扫码即消耗',
    '1': 'RFID读码消耗',
    '2': 'HIS计费消耗',
    '3': '散货申领消耗',
    '5': '超时默认消耗'
  };
  return map[String(val)] || '';
}

export function formatRelatedRfid(val) {
  if (String(val) === '0') return '否';
  if (String(val) === '1') return '是';
  return '';
}

export function formatIsKuBao(val) {
  if (String(val) === '0') return '否';
  if (String(val) === '1') return '是';
  return '未知';
}

export function formatOrderType(val) {
  if (String(val) === '0') return '主动补货';
  if (String(val) === '1') return '自主下单';
  return '';
}

export function formatApplyState(state) {
  const map = {
    '0': '新增',
    '1': '已申领',
    '2': '已配送',
    '3': '已收货'
  };
  return map[String(state)] || state || '';
}

export function formatOperateType(type) {
  const map = {
    '0': '普通申领',
    '1': 'PDA申领'
  };
  return map[String(type)] || type || '';
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 19);
}

export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function planGoodsQtyDisplay(row) {
  const plan = Number(row.PlanGoodsQty || 0);
  const net = Number(row.NETRECEIPTS || 0);
  return plan - net;
}

export function syncPkgFromGoods(goodsPlan, coefficient) {
  const coef = Number(coefficient) || 1;
  const goods = Number(goodsPlan) || 0;
  if (goods % coef !== 0) return null;
  return goods / coef;
}

export function syncGoodsFromPkg(pkgPlan, coefficient) {
  return (Number(pkgPlan) || 0) * (Number(coefficient) || 1);
}

export function buildMonitorPopupItems(rows, storageId) {
  return (rows || []).map((row) => ({
    Varietie_Code: row.Varietie_Code,
    Varietie_Code_New: row.Varietie_Code_New,
    Def_No_Pkg_Coefficient: row.Def_No_Pkg_Coefficient,
    Arg_Plan: row.Pkg_plan,
    Goods_Qty: row.Goods_plan,
    StorageID: storageId ?? row.StorageID ?? '1'
  }));
}

export function buildUpdateInfoPayload(rows, planNo) {
  return (rows || []).map(
    (row) =>
      `{${row.Varietie_Code},${row.Def_No_Pkg_Coefficient},${row.Pkg_plan},${row.Goods_plan},${planNo},${row.supplier_code},${row.supplier_name},${row.supply_price},${row.contract_code}}`
  );
}

export function selectionCol(fixed) {
  const col = {
    type: 'selection',
    columnKey: 'selection',
    width: 48,
    align: 'center',
    className: 'cim-checkbox-col'
  };
  if (fixed) col.fixed = fixed;
  return col;
}

export function buildCenterMonitorColumns(hp = monitorHpFlags) {
  const cols = [
    selectionCol('left'),
    { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 180, showOverflowTooltip: true },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 110, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '包装规格', prop: 'PAG_TYPE', minWidth: 90, showOverflowTooltip: true },
    { label: '启用合同供应商', prop: 'supplier_name', minWidth: 200, showOverflowTooltip: true },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 130, showOverflowTooltip: true },
    { label: '系数', prop: 'Def_No_Pkg_Coefficient', minWidth: 60, align: 'center' },
    { label: '合同类型', minWidth: 120, align: 'center', slot: 'contractType' },
    { label: '中标价格', prop: 'PRICE', minWidth: 120, align: 'right' },
    { label: '合同价格', prop: 'supply_price', minWidth: 120, align: 'right' },
    { label: '库存上限', prop: 'Storehouse_Uppper', minWidth: 120, align: 'right' },
    { label: '库存下限', prop: 'Storehouse_Lower', minWidth: 120, align: 'right' },
    { label: '定数包库存', prop: 'Defsum', minWidth: 120, align: 'right' },
    { label: '散货库存', prop: 'Goodssum', minWidth: 120, align: 'right' },
    { label: '备货数（包）', minWidth: 120, align: 'center', slot: 'pkgPlan' },
    { label: '备货数（散）', minWidth: 120, align: 'center', slot: 'goodsPlan' },
    { label: '中包装数量', prop: 'MIDDLE_PACKAGE_COUNT', minWidth: 120, align: 'right' },
    { label: '大包装数量', prop: 'BigBoxCount', minWidth: 120, align: 'right' },
    { label: '计划总量(散)', minWidth: 120, align: 'right', slot: 'planGoodsQty' }
  ];
  if (hp.isSpt) {
    cols.splice(1, 0, { label: '省平台编码', prop: 'PROVINCE_PLATFORM_CODE', minWidth: 120, showOverflowTooltip: true });
  }
  if (hp.isStzl) {
    return cols.filter((c) => c.prop !== 'BigBoxCount');
  }
  if (hp.isHnPagType) {
    return cols.filter((c) => !['MIDDLE_PACKAGE_COUNT', 'BigBoxCount'].includes(c.prop));
  }
  return cols;
}

export function buildCenterPickingColumns() {
  return [
    { label: '备货计划单号', prop: 'Stock_Up_Plan_No', minWidth: 140, showOverflowTooltip: true },
    { label: '创建人', prop: 'Creator', minWidth: 80, align: 'center' },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 130, showOverflowTooltip: true },
    { label: '收货院区', prop: 'NAME', minWidth: 90, align: 'center' },
    { label: '创建时间', minWidth: 155, slot: 'createTime' },
    { label: '备注', minWidth: 70, align: 'center', slot: 'planRemark' },
    { label: '审批状态', minWidth: 95, align: 'center', slot: 'approveState' },
    { label: '发送状态', minWidth: 130, align: 'center', slot: 'sendState' },
    { label: '操作', minWidth: 185, fixed: 'right', slot: 'planAction' }
  ];
}

export function buildCenterDetailColumns() {
  return [
    selectionCol(),
    { label: '备注', prop: 'REMARKS', minWidth: 90, showOverflowTooltip: true },
    { label: '品种编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 150, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '价格', prop: 'Supply_Price', minWidth: 75, align: 'right' },
    { label: '系数', prop: 'Coefficient', minWidth: 60, align: 'center' },
    { label: '备货/包', prop: 'Stock_Up_Plan_Def_Quantity', minWidth: 80, align: 'center' },
    { label: '备货/散', prop: 'Stock_Up_Plan_Goods_Quantity', minWidth: 80, align: 'center' },
    { label: '实收数量', prop: 'ReceiptQty', minWidth: 85, align: 'center' },
    { label: '备货时间', prop: 'Plan_Time', minWidth: 105 },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 130, showOverflowTooltip: true }
  ];
}

export function buildDeptMonitorColumns(options = '院内') {
  const storageLabel = typeof options === 'string' ? options : options.storageLabel || '院内';
  const cols = [
    selectionCol('left'),
    { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 160, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 160, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 160, showOverflowTooltip: true },
    { label: '系数', prop: 'Def_No_Pkg_Coefficient', minWidth: 60, align: 'center' },
    { label: '上限', prop: 'def_no_pkg_upper', minWidth: 70, align: 'center' },
    { label: '下限', prop: 'def_no_pkg_lower', minWidth: 70, align: 'center' },
    { label: '库存(上架)', prop: 'deptStockSum', minWidth: 120, align: 'center' },
    { label: '库存(暂借)', prop: 'deptStockSum2', minWidth: 120, align: 'center' },
    { label: '补货在途', prop: 'DeptOnwaySum', minWidth: 120, align: 'center' },
    { label: `散存(${storageLabel})`, prop: 'GoodsSum', minWidth: 180, align: 'center' },
    { label: `包存(${storageLabel})`, prop: 'defSum', minWidth: 10, align: 'center' },
    { label: '补货包数', minWidth: 120, align: 'center', slot: 'bhPackCount' },
    { label: '备货在途(散)', prop: 'onWay', minWidth: 120, align: 'center' },
    { label: '分组名称', prop: 'Group_Name', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { label: '中标价', prop: 'Price', minWidth: 120, align: 'center' },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 120, showOverflowTooltip: true },
    { label: '是否RFID', minWidth: 120, align: 'center', slot: 'relatedRfid' },
    { label: '消耗类型', minWidth: 120, align: 'center', slot: 'consumptionType' },
    { label: '下单类型', minWidth: 120, align: 'center', slot: 'orderType' },
    { label: '是否库宝', minWidth: 120, align: 'center', slot: 'isKuBao' }
  ];
  return cols;
}

export function buildDirectiveListColumns() {
  return [
    { label: '拣配单号', prop: 'Pack_Directive_Number', minWidth: 140, showOverflowTooltip: true },
    { label: '科室名称', prop: 'Dept_Two_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '创建人', prop: 'Creator', minWidth: 80, align: 'center' },
    { label: '创建时间', minWidth: 155, slot: 'createTime' },
    { label: '拣配状态', minWidth: 120, align: 'center', slot: 'packState' },
    { label: '操作', minWidth: 80, align: 'center', slot: 'action' }
  ];
}

export function buildDirectiveDetailColumns() {
  return [
    selectionCol(),
    { label: '品种编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 150, showOverflowTooltip: true },
    { label: '规格型号', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '系数', prop: 'Def_No_Pkg_Coefficient', minWidth: 60, align: 'center' },
    { label: '补货包数', prop: 'Pack_Quantity', minWidth: 120, align: 'center' },
    { label: '供应商', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true }
  ];
}

export function buildApplyDeptColumns() {
  return [
    { label: '配送科室', prop: 'Dept_Two_Name', minWidth: 120 },
    { label: '院区', prop: 'STORAGE_NAME', minWidth: 80 }
  ];
}

export function buildApplyVarietieColumns() {
  return [
    selectionCol(),
    { label: '院区', prop: 'NAME', minWidth: 75, align: 'center' },
    { label: '品种编码', prop: 'Varietie_Code_New', minWidth: 125, showOverflowTooltip: true },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '散货库存', prop: 'Goodsstock', minWidth: 120, align: 'right' },
    { label: '生产批号', prop: 'Batch', minWidth: 120, showOverflowTooltip: true },
    { label: '生产日期', prop: 'Batch_Production_Date', minWidth: 125 },
    { label: '失效日期', prop: 'Batch_Validity_Period', minWidth: 125 },
    { label: '申领数量', minWidth: 120, align: 'center', slot: 'applySum' },
    { label: '收货单号', prop: 'DELIVERY_NOTE_NUMBER', minWidth: 120, showOverflowTooltip: true }
  ];
}

export function buildApplyListColumns() {
  return [
    { label: '申领单号', prop: 'Operate_Number', minWidth: 140, showOverflowTooltip: true },
    { label: '申领状态', minWidth: 120, align: 'center', slot: 'operateState' },
    { label: '申领类型', minWidth: 120, align: 'center', slot: 'operateType' },
    { label: '创建时间', prop: 'Create_Time', minWidth: 155 },
    { label: '创建人', prop: 'Creator', minWidth: 100, align: 'center' },
    { label: '是否标记', prop: 'is_sign', minWidth: 120, align: 'center' },
    { label: '是否打印', prop: 'is_Print', minWidth: 120, align: 'center' }
  ];
}

export function buildApplyDetailColumns() {
  return [
    selectionCol(),
    { label: '品种编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 160, showOverflowTooltip: true },
    { label: '规格型号', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '批号', prop: 'Batch', minWidth: 90, showOverflowTooltip: true },
    { label: '申领数量', prop: 'quanity', minWidth: 85, align: 'center' },
    { label: '供应商', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '收货库区', minWidth: 120, align: 'center', slot: 'storageName' },
    { label: '价格', prop: 'supply_price', minWidth: 80, align: 'right' }
  ];
}

export function exportCentralMonitorExcel(rows) {
  const headers = [
    '品种材料编码',
    '品种全称',
    '型号规格',
    '单位',
    '生产企业名称',
    '系数',
    '库存上限',
    '库存下限',
    '定数包库存',
    '散货库存',
    '计划总量(散)',
    '中标价格',
    '合同价格'
  ];
  const data = [headers];
  (rows || []).forEach((row) => {
    data.push([
      row.Varietie_Code_New,
      row.Varietie_Name,
      row.Specification_Or_Type,
      row.Unit,
      row.Manufacturing_Ent_Name,
      row.Def_No_Pkg_Coefficient,
      row.Storehouse_Uppper,
      row.Storehouse_Lower,
      row.Defsum,
      row.Goodssum,
      planGoodsQtyDisplay(row),
      row.PRICE,
      row.supply_price
    ]);
  });
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, '中心库库存监控');
  writeFile(wb, '中心库库存监控.xlsx');
}

export function exportDeptMonitorExcel(rows, storageLabel = '院内', options = {}) {
  const fileName = options.fileName || '二级科室定数包库存监控.xlsx';
  const headers = [
    '品种编码',
    '品种全称',
    '型号/规格',
    '单位',
    '生产企业',
    '系数',
    '上限',
    '下限',
    '库存(上架)',
    '补货包数'
  ];
  const data = [headers];
  (rows || []).forEach((row) => {
    data.push([
      row.Varietie_Code_New,
      row.Varietie_Name,
      row.Specification_Or_Type,
      row.Unit,
      row.Manufacturing_Ent_Name,
      row.Def_No_Pkg_Coefficient,
      row.def_no_pkg_upper,
      row.def_no_pkg_lower,
      row.deptStockSum,
      row.Pkg_planHidden ?? row.bhPackCount
    ]);
  });
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, '科室定数包监控');
  writeFile(wb, fileName);
}

export function getAllocateSvcLabels(hp = HOME_HP) {
  if (hp === 'bdrm') {
    return {
      inToOut: '西直门院区至通州院区',
      outToIn: '通州院区至西直门院区',
      inStorage: '通州院区库房',
      outStorage: '西直门院区库房'
    };
  }
  return {
    inToOut: '院外至院内',
    outToIn: '院内至院外',
    inStorage: '院内库房',
    outStorage: '院外库房'
  };
}

export function getStorageAreaText(storageId, hp = HOME_HP) {
  if (String(storageId) === '1') {
    return hp === 'bdrm' ? '通州院区库存' : '院内库存';
  }
  if (String(storageId) === '2') {
    return hp === 'bdrm' ? '西直门院区库存' : '院外库存';
  }
  return storageId || '';
}

export function getStorageZoneText(storageId, hp = HOME_HP) {
  if (String(storageId) === '1') {
    return hp === 'bdrm' ? '通州院区库区' : '院内库区';
  }
  if (String(storageId) === '2') {
    return hp === 'bdrm' ? '西直门院区库区' : '院外库区';
  }
  return storageId || '';
}

export function getAllocateStrongId(svc) {
  return String(svc) === '0' ? '1' : '2';
}

export function getAllocateDirectionText(svc, hp = HOME_HP) {
  const labels = getAllocateSvcLabels(hp);
  return String(svc) === '0' ? labels.inToOut : labels.outToIn;
}

export function buildLcNumColumns() {
  return [
    { label: '品种编码', prop: 'VARIETIE_CODE_NEW', minWidth: 125, showOverflowTooltip: true },
    { label: '品种名称', prop: 'VARIETIE_NAME', minWidth: 120, showOverflowTooltip: true },
    { label: '规格型号', prop: 'SPECIFICATION_OR_TYPE', minWidth: 120, showOverflowTooltip: true },
    { label: '注册证', prop: 'APPROVAL_NUMBER', minWidth: 130, showOverflowTooltip: true },
    { label: '生产企业', prop: 'MANUFACTURING_ENT_NAME', minWidth: 160, showOverflowTooltip: true },
    { label: '中标价', prop: 'PRICE', minWidth: 100, align: 'right' },
    { label: '单位', prop: 'UNIT', minWidth: 60, align: 'center' },
    { label: '临采限量', prop: 'LC_NUM', minWidth: 125, align: 'right' },
    { label: '备货数量', prop: 'STOCK_UP_PLAN_GOODS_QUANTITY', minWidth: 125, align: 'right' },
    { label: '已采购数量', prop: 'NETRECEIPTS', minWidth: 140, align: 'right' },
    { label: '剩余可备货数量', minWidth: 200, align: 'right', slot: 'remainQty' },
    { label: '供应商名称', prop: 'SUPPLIER_NAME', minWidth: 160, showOverflowTooltip: true },
    { label: '合同名称', prop: 'CONTRACT_NAME', minWidth: 120, showOverflowTooltip: true },
    { label: '合同类型', minWidth: 120, align: 'center', slot: 'contractType' },
    { label: '合同起始时间', minWidth: 160, slot: 'contractStart' },
    { label: '合同结束时间', minWidth: 160, slot: 'contractEnd' }
  ];
}

export function lcRemainQty(row) {
  return Number(row.LC_NUM || 0) - Number(row.STOCK_UP_PLAN_GOODS_QUANTITY || 0);
}

export function getClaimExcelApiPath(homeHp) {
  const map = {
    szlh: 'CreatedeClaimExcelszlh',
    szhn: 'CreatedeClaimExcel_SZHN',
    fszxy: 'CreatedeClaimExcel_FSZXY',
    stzx: 'CreatedeClaimExcel',
    stzl: 'CreatedeClaimExcel',
    lg: 'CreatedeClaimExcel',
    bd: 'CreatedeClaimExcel',
    bdrm: 'CreatedeClaimExcel'
  };
  return map[homeHp] || 'CreatedeClaimExcel';
}

export function openExcelDownload(fileName) {
  if (!fileName) return;
  const url = `${API_BASE_URL}/Excel/files/${fileName}`;
  window.open(url, '_blank');
}

export function formatStorageName(val) {
  if (String(val) === '1' || val === '院内库区') return '院内库区';
  if (String(val) === '2' || val === '院外库区') return '院外库区';
  return val || '';
}

export function createCenterMonitorWhere() {
  return {
    IsCoefficient: '0',
    UseLevel: '-1',
    StorageID: '-1',
    EnableState: '1',
    SearchName: '',
    EnableLowUp: '0',
    Supplier: ''
  };
}

export function createCenterPickingWhere() {
  return {
    BHDate: '',
    SenState: '-1',
    PlanNum: '',
    VarietieCode: '',
    STORAGE_ID: ''
  };
}
