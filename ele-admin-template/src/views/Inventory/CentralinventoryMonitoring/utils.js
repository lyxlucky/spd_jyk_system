import { utils, writeFile } from 'xlsx';
import { getStaticBaseUrl, HOME_HP } from '@/config/setting';
import store from '@/store';

/** 与老系统 Home.cshtml HN_PAG_TYPE 医院集合对齐 */
const HN_PAG_TYPE_HPS = ['szhn', 'lg', 'bd', 'bdrm', 'zq', 'szlhfy', 'szsmyl', 'szse', 'szse_lh', 'szse_dp'];

export const monitorHpFlags = {
  isSpt: ['bd', 'bdrm'].includes(HOME_HP),
  isStzl: HOME_HP === 'stzl',
  isHnPagType: HN_PAG_TYPE_HPS.includes(HOME_HP),
  isBd: HOME_HP === 'bd',
  isCg: HOME_HP === 'szlh',
  showKubao: HOME_HP === 'bd',
  isSzlh: HOME_HP === 'szlh'
};

export function hasMonitorPermission(permissionUrl) {
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) => (p.Permission_Url || p.permission_url || p.component) === permissionUrl);
}

/** Tab1 中心库：warning 1红 2蓝；Tab2 科室：1红 2黄 3蓝 */
export function monitorWarningRowClass({ row }, tab = 'dept') {
  const w = String(row.warning ?? '');
  if (w === '1') return 'monitor-warn-1';
  if (tab === 'center') {
    if (w === '2') return 'monitor-warn-3';
    return '';
  }
  if (w === '2') return 'monitor-warn-2';
  if (w === '3') return 'monitor-warn-3';
  return '';
}

export function centerWarningRowClass({ row }) {
  return monitorWarningRowClass({ row }, 'center');
}

export function deptWarningRowClass({ row }) {
  return monitorWarningRowClass({ row }, 'dept');
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
  // 本页老逻辑仅区分新增/已申领
  if (String(state) === '0') return '新增';
  return '已申领';
}

export function formatOperateType(type) {
  const map = {
    '0': '(旧)科室申领',
    '1': '散货退货',
    '2': '（新）科室申领',
    '3': '科室PDA收货'
  };
  return map[String(type)] || type || '';
}

export function formatSendYsy(val) {
  if (String(val) === '0') return '未发送';
  if (String(val) === '1') return '已发送';
  return '未知';
}

export function formatSignState(row) {
  if (String(row.IS_SIGN) === '1') {
    const man = row.SIGN_MAN || '';
    const time = formatDateTime(row.SING_TIME);
    return `已标记${man ? '/' + man : ''}${time ? '/' + time : ''}`;
  }
  return '未标记';
}

export function formatApplyOrderType(val) {
  if (String(val) === '0') return '普通';
  if (String(val) === '1') return '经费';
  if (String(val) === '2') return '专项资金';
  return val ?? '';
}

export function formatSendHisState(val) {
  if (String(val) === '0') return '可推送';
  if (String(val) === '1') return '已推送';
  if (String(val) === '2') return '已禁止';
  return val ?? '';
}

export function formatXsxxJc(val) {
  if (String(val) === '1') return '线上';
  if (String(val) === '2') return '线下';
  if (String(val) === '3') return '集采';
  return '无';
}

export function formatIsBidding(val) {
  if (String(val) === '1') return '是';
  if (String(val) === '0') return '否';
  return val ?? '';
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

function withCenterMonitorSort(cols) {
  // 仅对后端 ORDER BY 白名单内字段开服务端排序（备货数输入列除外）
  const sortableProps = new Set([
    'Varietie_Code_New',
    'Varietie_Name',
    'Specification_Or_Type',
    'Unit',
    'Manufacturing_Ent_Name',
    'Def_No_Pkg_Coefficient',
    'Is_Bidding',
    'PRICE',
    'Storehouse_Uppper',
    'Storehouse_Lower',
    'Defsum',
    'OutdefSum',
    'Goodssum',
    'OutGoodsUp',
    'MIDDLE_PACKAGE_COUNT',
    'BigBoxCount',
    'PackQty',
    'OutPackQty',
    'QTY',
    'Name',
    'PAG_TYPE',
    'supplier_name',
    'supply_price',
    'PlanGoodsQty',
    'PROVINCE_PLATFORM_CODE'
  ]);
  return cols.map((col) => {
    if (!col.prop || col.type || !sortableProps.has(col.prop)) return col;
    if (col.slot === 'pkgPlan' || col.slot === 'goodsPlan') return col;
    return { ...col, sortable: 'custom' };
  });
}

export function buildCenterMonitorColumns(hp = monitorHpFlags) {
  if (hp.isCg || hp.isSzlh) {
    const cols = [
      selectionCol('left'),
      { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
      { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 100, showOverflowTooltip: true },
      { label: '品种全称', prop: 'Varietie_Name', minWidth: 120, showOverflowTooltip: true },
      { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 110, showOverflowTooltip: true },
      { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
      { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 130, showOverflowTooltip: true },
      { label: '系数', prop: 'Def_No_Pkg_Coefficient', minWidth: 60, align: 'center' },
      { label: '中标', prop: 'Is_Bidding', minWidth: 60, align: 'center', slot: 'isBidding' },
      { label: '价格', prop: 'PRICE', minWidth: 90, align: 'right' },
      { label: '库存上限', prop: 'Storehouse_Uppper', minWidth: 90, align: 'right' },
      { label: '库存下限', prop: 'Storehouse_Lower', minWidth: 90, align: 'right' },
      { label: '定数包库存（院内）', prop: 'Defsum', minWidth: 130, align: 'right' },
      { label: '定数包库存（院外）', prop: 'OutdefSum', minWidth: 130, align: 'right' },
      { label: '散货库（院内）', prop: 'Goodssum', minWidth: 120, align: 'right' },
      { label: '散货库（院外）', prop: 'OutGoodsUp', minWidth: 120, align: 'right' },
      { label: '备货数（包）', minWidth: 110, align: 'center', slot: 'pkgPlan' },
      { label: '备货数（散）', minWidth: 110, align: 'center', slot: 'goodsPlan' },
      { label: '中包装数量', prop: 'MIDDLE_PACKAGE_COUNT', minWidth: 100, align: 'right' },
      { label: '大包装数量', prop: 'BigBoxCount', minWidth: 100, align: 'right' },
      { label: '包预锁（院内）', prop: 'PackQty', minWidth: 110, align: 'right' },
      { label: '包预锁（院外）', prop: 'OutPackQty', minWidth: 110, align: 'right' },
      { label: '计划总量(90天内)', prop: 'QTY', minWidth: 130, align: 'right' },
      { label: '主控库区', prop: 'Name', minWidth: 90, showOverflowTooltip: true }
    ];
    if (hp.isSpt) {
      cols.splice(1, 0, {
        label: '省平台编码',
        prop: 'PROVINCE_PLATFORM_CODE',
        minWidth: 120,
        showOverflowTooltip: true
      });
    }
    if (hp.isHnPagType) {
      return withCenterMonitorSort(
        cols.filter((c) => !['MIDDLE_PACKAGE_COUNT', 'BigBoxCount'].includes(c.prop))
      );
    }
    return withCenterMonitorSort(cols);
  }

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
    { label: '合同类型', prop: 'CONTRACT_TYPE', minWidth: 120, align: 'center', slot: 'contractType' },
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
    { label: '计划总量(散)', prop: 'PlanGoodsQty', minWidth: 120, align: 'right', slot: 'planGoodsQty' }
  ];
  if (hp.isSpt) {
    cols.splice(1, 0, { label: '省平台编码', prop: 'PROVINCE_PLATFORM_CODE', minWidth: 120, showOverflowTooltip: true });
  }
  if (hp.isStzl) {
    return withCenterMonitorSort(cols.filter((c) => c.prop !== 'BigBoxCount'));
  }
  if (hp.isHnPagType) {
    return withCenterMonitorSort(
      cols.filter((c) => !['MIDDLE_PACKAGE_COUNT', 'BigBoxCount'].includes(c.prop))
    );
  }
  return withCenterMonitorSort(cols);
}

export function buildCenterPickingColumns() {
  // 后端 GetPickingList 无 field/order（固定 create_time DESC）；对齐老系统当前页本地排序
  const cols = [
    { label: '备货计划单号', prop: 'Stock_Up_Plan_No', minWidth: 140, showOverflowTooltip: true },
    { label: '创建人', prop: 'Creator', minWidth: 80, align: 'center' },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 130, showOverflowTooltip: true },
    { label: '收货院区', prop: 'NAME', minWidth: 90, align: 'center' },
    { label: '创建时间', prop: 'Create_Time', minWidth: 155, slot: 'createTime' },
    { label: '备注', minWidth: 70, align: 'center', slot: 'planRemark' },
    { label: '审批状态', prop: 'Approve_State', minWidth: 95, align: 'center', slot: 'approveState' },
    { label: '发送状态', prop: 'Send_State', minWidth: 130, align: 'center', slot: 'sendState' },
    { label: '操作', minWidth: 185, fixed: 'right', slot: 'planAction' }
  ];
  return cols.map((col) =>
    col.prop ? { ...col, sortable: true } : col
  );
}

export function buildCenterDetailColumns(options = {}) {
  // 后端 GetPickingInfo 无 field/order（固定 VARIETIE_CODE_NEW）；明细一次拉全量，用前端本地排序
  const showXsxx = options.showXsxx ?? hasMonitorPermission('备货新增线上线下');
  const isCg = options.isCg ?? monitorHpFlags.isCg;
  const cols = [
    selectionCol(),
    ...(showXsxx
      ? [{ label: '线上线下', prop: 'XSXX_JC', minWidth: 90, align: 'center', slot: 'xsxxJc' }]
      : []),
    { label: '品种(材料)编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 150, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 130, showOverflowTooltip: true },
    {
      label: '价格',
      minWidth: 80,
      align: 'right',
      prop: isCg ? 'Purchase_Price' : 'Supply_Price',
      slot: 'detailPrice'
    },
    { label: '系数', prop: 'Coefficient', minWidth: 60, align: 'center' },
    { label: '备货数（包）', prop: 'Stock_Up_Plan_Def_Quantity', minWidth: 90, align: 'center' },
    { label: '备货数（散）', prop: 'Stock_Up_Plan_Goods_Quantity', minWidth: 90, align: 'center' },
    { label: '实收数量', prop: 'ReceiptQty', minWidth: 85, align: 'center' },
    { label: '备货时间', prop: 'Plan_Time', minWidth: 105 }
  ];
  return cols.map((col) =>
    col.prop && !col.type ? { ...col, sortable: true } : col
  );
}

export function buildDeptMonitorColumns(options = {}) {
  const storageLabel =
    typeof options === 'string' ? options : options.storageLabel || '院内';
  const isYn = typeof options === 'object' ? options.isYn !== false : true;
  const hp = typeof options === 'object' ? options.hp || monitorHpFlags : monitorHpFlags;
  const goodsProp = isYn ? 'GoodsSum' : 'OutGoodsSum';
  const defProp = isYn ? 'defSum' : 'OutdefSum';
  const packProp = isYn ? 'PackQty' : 'OutPackQty';
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
    { label: `散存(${storageLabel})`, prop: goodsProp, minWidth: 140, align: 'center' },
    { label: `包存(${storageLabel})`, prop: defProp, minWidth: 140, align: 'center' },
    { label: `包预锁(${storageLabel})`, prop: packProp, minWidth: 120, align: 'center' },
    { label: '补货包数', minWidth: 120, align: 'center', slot: 'bhPackCount' },
    { label: '备货在途(散)', prop: 'onWay', minWidth: 120, align: 'center' },
    { label: '分组名称', prop: 'Group_Name', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { label: '中标价', prop: 'Price', minWidth: 120, align: 'center' },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 120, showOverflowTooltip: true },
    { label: '是否RFID', minWidth: 120, align: 'center', slot: 'relatedRfid' },
    { label: '消耗类型', minWidth: 120, align: 'center', slot: 'consumptionType' },
    { label: '下单类型', minWidth: 120, align: 'center', slot: 'orderType' }
  ];
  if (hp.showKubao) {
    cols.push({ label: '是否库宝', minWidth: 100, align: 'center', slot: 'isKuBao' });
  }
  return cols;
}

export function buildDirectiveListColumns() {
  return [
    { label: '拣配单号', prop: 'Pack_Directive_Number', minWidth: 140, showOverflowTooltip: true },
    { label: '科室名称', prop: 'Dept_Two_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '创建人', minWidth: 80, align: 'center', slot: 'creator' },
    { label: '创建时间', minWidth: 155, slot: 'createTime' },
    { label: '拣配状态', minWidth: 120, align: 'center', slot: 'packState' },
    { label: '操作', minWidth: 80, align: 'center', slot: 'action' }
  ];
}

export function buildDirectiveDetailColumns() {
  return [
    selectionCol(),
    { label: '品种(材料)编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 150, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '系数', prop: 'Coefficient', minWidth: 60, align: 'center' },
    { label: '拣配数量', prop: 'Except_Pack_Quantity', minWidth: 90, align: 'center' }
  ];
}

export function buildApplyDeptColumns() {
  return [
    { label: '二级科室编码', prop: 'dept_two_code', minWidth: 100, showOverflowTooltip: true },
    { label: '二级科室名称', prop: 'dept_two_name', minWidth: 120, showOverflowTooltip: true },
    { label: '未打印单据', minWidth: 90, align: 'center', slot: 'isPrint' },
    { label: '未申领单据', prop: 'COUNT_DEPT', minWidth: 90, align: 'center' },
    { label: '院区', prop: 'STORAGE_NAME', minWidth: 80 }
  ];
}

export function buildApplyVarietieColumns(hp = monitorHpFlags) {
  const cols = [
    selectionCol(),
    { label: '院区', prop: 'NAME', minWidth: 75, align: 'center' },
    { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 125, showOverflowTooltip: true },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 120, showOverflowTooltip: true },
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 120, showOverflowTooltip: true },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '包装规格', prop: 'PAG_TYPE', minWidth: 90, showOverflowTooltip: true },
    { label: '散货库存', prop: 'Goodsstock', minWidth: 100, align: 'right' },
    { label: '生产批号', prop: 'Batch', minWidth: 100, showOverflowTooltip: true },
    { label: '生产日期', minWidth: 110, slot: 'batchProdDate' },
    { label: '失效日期', minWidth: 110, slot: 'batchValidDate' },
    { label: '申领数量', minWidth: 100, align: 'center', slot: 'applySum' }
  ];
  if (!hp.isHnPagType) {
    cols.push(
      { label: '大包装数量', prop: 'BIG_BOX_COUNT', minWidth: 100, align: 'center' },
      { label: '中包装数量', prop: 'MIDDLE_PACKAGE_COUNT', minWidth: 100, align: 'center' }
    );
  }
  cols.push({ label: '收货单号', prop: 'DELIVERY_NOTE_NUMBER', minWidth: 120, showOverflowTooltip: true });
  return cols;
}

export function buildApplyListColumns(hp = monitorHpFlags) {
  if (hp.isSzlh || hp.isCg) {
    return [
      { label: '申领单号', prop: 'Operate_Number', minWidth: 140, showOverflowTooltip: true },
      { label: '类型', minWidth: 120, align: 'center', slot: 'operateType' },
      { label: '医商云状态', minWidth: 100, align: 'center', slot: 'sendYsy' },
      { label: '申领状态', minWidth: 90, align: 'center', slot: 'operateState' },
      { label: '时间', minWidth: 155, slot: 'operateTime' },
      { label: '打印次数', prop: 'Print_Count', minWidth: 90, align: 'center' },
      { label: '订单备注', minWidth: 90, align: 'center', slot: 'orderRemark' },
      { label: '标记状态', minWidth: 160, showOverflowTooltip: true, slot: 'signState' },
      { label: '标记', minWidth: 90, align: 'center', slot: 'signAction' },
      { label: '标记备注', minWidth: 90, align: 'center', slot: 'signRemark' }
    ];
  }
  return [
    { label: '申领单号', prop: 'Operate_Number', minWidth: 140, showOverflowTooltip: true },
    { label: '类型', minWidth: 120, align: 'center', slot: 'operateType' },
    { label: '申领状态', minWidth: 90, align: 'center', slot: 'operateState' },
    { label: '打印次数', prop: 'Print_Count', minWidth: 90, align: 'center' },
    { label: '备注', minWidth: 80, align: 'center', slot: 'orderRemark' },
    { label: '推送HIS状态', minWidth: 110, align: 'center', slot: 'sendHisState' },
    { label: '推送HIS', minWidth: 90, align: 'center', slot: 'sendHisAction' },
    { label: '时间', minWidth: 155, slot: 'operateTime' },
    { label: '标记状态', minWidth: 160, showOverflowTooltip: true, slot: 'signState' },
    { label: '标记', minWidth: 90, align: 'center', slot: 'signAction' },
    { label: '标记备注', minWidth: 90, align: 'center', slot: 'signRemark' },
    { label: '订单类型(改)', minWidth: 110, align: 'center', slot: 'orderTypeEdit' },
    { label: '订单类型', minWidth: 90, align: 'center', slot: 'orderType' },
    { label: '订单类型备注', prop: 'ORDER_TYPE_MARK', minWidth: 120, showOverflowTooltip: true },
    { label: '同步计划', minWidth: 90, align: 'center', slot: 'syncPlan' }
  ];
}

export function buildApplyDetailColumns(options = {}) {
  const showErp = options.showErp ?? hasMonitorPermission('上药ERP品种编码');
  const showStorageTwo = options.showStorageTwo ?? hasMonitorPermission('仓库-二级仓库');
  const isNew = options.isNew ?? false;
  const cols = [
    selectionCol(),
    { type: 'index', label: '序号', width: 55, align: 'center', columnKey: 'index' },
    { label: '库区院房', prop: 'STORAGE_NAME', minWidth: 90, showOverflowTooltip: true },
    { label: '品种（材料）编码', prop: 'Varietie_Code_New', minWidth: 120, showOverflowTooltip: true },
    { label: '计费编码', prop: 'CHARGING_CODE', minWidth: 110, showOverflowTooltip: true },
    ...(showErp
      ? [{ label: 'ERP操作码', prop: 'SPH_ERP_VARIETIE_CODE', minWidth: 110, showOverflowTooltip: true }]
      : []),
    { label: '品种全称', prop: 'Varietie_Name', minWidth: 140, showOverflowTooltip: true },
    { label: '型号/规格', prop: 'Specification_Or_Type', minWidth: 110, showOverflowTooltip: true },
    { label: '申领数量', prop: 'quanity', minWidth: 85, align: 'center' },
    { label: '价格', prop: 'supply_price', minWidth: 80, align: 'right' },
    { label: '最近出库价', minWidth: 100, align: 'right', slot: 'zjSupplyPrice' },
    { label: '单位', prop: 'Unit', minWidth: 60, align: 'center' },
    { label: '生产企业名称', prop: 'Manufacturing_Ent_Name', minWidth: 120, showOverflowTooltip: true },
    { label: '供应商名称', prop: 'supplier_name', minWidth: 120, showOverflowTooltip: true },
    { label: '散货库存', minWidth: 120, showOverflowTooltip: true, slot: 'goodsStock' },
    { label: '生产批号', prop: 'Batch', minWidth: 100, showOverflowTooltip: true },
    { label: '生产日期', minWidth: 110, slot: 'batchProdDate' },
    { label: '失效日期', minWidth: 110, slot: 'batchValidDate' },
    ...(showStorageTwo
      ? [{ label: '仓库位置', prop: 'STORAGE_TWO_NAME', minWidth: 100, showOverflowTooltip: true }]
      : []),
    { label: '计划单号', prop: 'Plan_Number', minWidth: 120, showOverflowTooltip: true },
    { label: '备注', prop: 'SQREMARK', minWidth: 100, showOverflowTooltip: true },
    { label: '科室备注', prop: 'SPDBZ', minWidth: 100, showOverflowTooltip: true },
    { label: '关联计划', minWidth: 90, align: 'center', slot: 'linkPlan' },
    ...(isNew ? [{ label: '操作', minWidth: 70, align: 'center', fixed: 'right', slot: 'detailAction' }] : [])
  ];
  return cols;
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
  // Excel 在站点根路径：API 是 .../spdapi/api，文件是 .../spdapi/Excel，需去掉 /api
  const base = getStaticBaseUrl();
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
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
    EnableState: '0',
    SearchName: '',
    EnableLowUp: '1',
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
