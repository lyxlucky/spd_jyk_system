import store from '@/store';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

/**
 * 导出权限（对齐老系统 Home.cshtml）
 * 仅市二(szse*)默认隐藏 export-*，有对应权限码才显示；其他院始终显示
 */
export function hasExportPermission(permissionUrl) {
  if (!permissionUrl) return true;
  const isSzse = String(HOME_HP || '').startsWith('szse');
  if (!isSzse && String(permissionUrl).startsWith('export-')) {
    return true;
  }
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(permissionUrl)) return true;
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) =>
    [p.Permission_Url, p.PERMISSION_URL, p.component, p.path, p.title].some(
      (v) => v === permissionUrl
    )
  );
}

export function hasPermission(permissionUrl) {
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(permissionUrl)) return true;
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) =>
    [p.Permission_Url, p.PERMISSION_URL, p.component, p.path, p.title].some(
      (v) => v === permissionUrl
    )
  );
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).substr(0, 10);
}

/** 库存查询有效期着色（15/90天，与旧 InventoryQueryNew 一致） */
export function validityPeriodStyle(row) {
  const bvp = fmtDate10(row.Batch_Validity_Period);
  if (!bvp) return {};
  const thisDate = new Date(bvp).getTime();
  const nowDate = Date.now();
  const day15 = 15 * 24 * 60 * 60 * 1000;
  const day90 = 90 * 24 * 60 * 60 * 1000;
  if (thisDate - nowDate <= 0) {
    return { backgroundColor: '#ff0000', color: '#fff' };
  }
  if (day15 + nowDate >= thisDate) {
    return { backgroundColor: 'rgba(255,165,0,0.5)' };
  }
  if (day90 + nowDate >= thisDate) {
    return { backgroundColor: 'rgba(255,255,0,0.5)' };
  }
  return {};
}

export function mainRowClassName({ row }) {
  const bvp = fmtDate10(row.Batch_Validity_Period);
  if (!bvp) return '';
  const thisDate = new Date(bvp).getTime();
  const nowDate = Date.now();
  const day15 = 15 * 24 * 60 * 60 * 1000;
  const day90 = 90 * 24 * 60 * 60 * 1000;
  if (thisDate - nowDate <= 0) return 'inv-query-row-expired';
  if (day15 + nowDate >= thisDate) return 'inv-query-row-warning15';
  if (day90 + nowDate >= thisDate) return 'inv-query-row-warning90';
  return '';
}

export function fmtMainUpShelfState(row) {
  const v = row.Up_Shelf_State;
  let text = '';
  if (v == 1) text = '合格区';
  else if (v == 6) text = '普通隔离区';
  else if (v == 11) text = '防疫物资区';
  else if (v == 7) text = '不合格区';
  else if (v == 0) text = row.Source_Name || '';
  else if (v == 8) text = '盘损隔离区';
  else if (v == 9) text = '应急库';
  else if (v == 2) text = '拣配区';
  else if (v == -1) text = '待审核上架';
  else text = '锁定区';
  if (row.VAR_TYPE == 1) text += '-防疫物资';
  return text;
}

export function fmtDetailUpShelfState(row) {
  const v = row.Up_Shelf_State ?? row.Curr_Up_Shelf_State;
  if (v == 1) return '合格区';
  if (v == 6) return '隔离区';
  if (v == 7) return '不合格区';
  if (v == 9) return '应急库';
  if (v == 0) return row.Source_Name || '';
  if (v == 2) return '锁定';
  return v ?? '';
}

export function fmtReceiveProperty(v) {
  if (v == 0) return '普通收货';
  if (v == 1) return '盘溢收货';
  return '无';
}

export function fmtSupplyPrice(row) {
  const n = Number(row.Supply_Price);
  const bl = row.price_bl != null ? Number(row.price_bl) : 2;
  return Number.isFinite(n) ? n.toFixed(bl) : row.Supply_Price;
}

export function fmtContractEnd(val) {
  if (!val) return '';
  const bvp = fmtDate10(val);
  const thisDate = new Date(bvp).getTime();
  const nowDate = Date.now();
  if (thisDate <= nowDate) return bvp;
  const days = Math.floor((thisDate - nowDate) / (24 * 60 * 60 * 1000));
  return `${bvp}|${days}天`;
}

export function fmtType(v) {
  if (v == '1' || v == null) return '普通库';
  if (v == '2') return '缓存库';
  return '未知';
}

export function fmtDetailCreateType(v) {
  return v == 1 ? '是' : '否';
}

export function fmtSettleState(row) {
  if (row.USE_DEF_NO_PKG_CODE == row.Def_No_Pkg_Code) return '已结算';
  return '未结算';
}

/** 平台合同编码：st 系列院区显示（与老页 hide:!isSt / isSt=false 一致） */
export function isStHospital() {
  return ['stse', 'stzl', 'stzx', 'csyy', 'stzyyy', 'chrmyy'].includes(HOME_HP);
}

export function isHptxHospital() {
  return HOME_HP === 'nyd' || HOME_HP === 'lg';
}

export function isStzxHospital() {
  return ['stzx', 'stse', 'csyy'].includes(HOME_HP);
}

export function isSkuHospital() {
  return HOME_HP === 'bdrm';
}

export function isSptHospital() {
  return !['szhn', 'lg', 'bd', 'bdrm'].includes(HOME_HP);
}

export function defaultMainWhere() {
  return {
    varietie: '',
    supplier: '',
    batch: '',
    classificName: '',
    manuEntName: '',
    approvalNumber: '',
    validDateFrom: '',
    validDateTo: '',
    sourceFrom: '',
    position: '',
    storageId: '',
    upShelfState: '',
    conTime: '',
    isHptx: '',
    exportLimit: 15,
    isCharge: '-1',
    highOrLowClass: '-1',
    isBidding: '-1',
    specialPurchase: '-1',
    oneoffSterilizationPackaging: '-1',
    storageType: '-1',
    isEmbedded: '-1',
    isSerialNumber: '-1',
    isProtect: '-1',
    isIntervened: '-1',
    highOrLowClassTwo: ''
  };
}

/** 主表行上下文（联动明细） */
export function rowToDetailCtx(row) {
  if (!row) return null;
  return {
    sourceFrom: row.Source_From ?? '',
    batchId: row.Batch_Id ?? '',
    varietieCode: row.Varietie_Code ?? '',
    batch: row.Batch ?? '',
    coefficient: row.Coefficient ?? '',
    currUpShelfState: row.Up_Shelf_State ?? '',
    storageId: row.Storage_Id ?? '',
    varietieName: row.Varietie_Name ?? '',
    goodsQty: row.Goods_Qty ?? '',
    supplyPrice: row.Supply_Price ?? '',
    sourceName: row.Source_Name ?? ''
  };
}

function safeDate(v) {
  return v ? fmtDate10(v) : '';
}

function fmtExportType(v) {
  if (v == '1' || v == null || v === '') return '普通库';
  if (v == '2') return '缓存库';
  return '-';
}

function fmtExportFollow(v) {
  if (v == 0 || v === '0') return '否';
  if (v == 1 || v === '1') return '是';
  return '未知';
}

function baseExportPrefix(d) {
  return [
    d.Source_Name,
    d.STORAGE_TWO_NAME,
    fmtMainUpShelfState(d),
    fmtReceiveProperty(d.Receive_Property),
    d.Varietie_Code_New,
    d.Varietie_Name,
    d.Specification_Or_Type,
    d.Unit,
    d.Goods_Qty,
    d.Manufacturing_Ent_Name,
    d.Supplier_Name,
    d.Batch,
    safeDate(d.Batch_Production_Date),
    safeDate(d.Batch_Validity_Period),
    d.Coefficient,
    fmtSupplyPrice(d)
  ];
}

/** stzx：含定数包转散（老 InvNewPrintStzx） */
function buildStzxExportRows(list) {
  const headers = [
    '库房位置',
    '仓库',
    '所属区域',
    '收货类型',
    '品种编码',
    '品种名称',
    '规格/型号',
    '单位',
    '库存散货',
    '生产企业名称',
    '供应商',
    '生产批号',
    '生产日期',
    '有效到期',
    '系数',
    '结算价',
    '库存定数包数',
    '库存定数包数转散',
    '在库天数',
    '定数包未上架',
    '散货未上架',
    '散货锁定',
    '定数包锁定',
    '定数包预锁',
    '批次号ID',
    '品牌',
    '货位号',
    '合同名称',
    '合同到期',
    '发票',
    '库别',
    '备注',
    '科室未结算',
    '周日均用量',
    '月日均用量'
  ];
  const rows = [headers];
  (list || []).forEach((d) => {
    rows.push([
      ...baseExportPrefix(d),
      d.Def_Qty,
      (Number(d.Def_Qty) || 0) * (Number(d.Coefficient) || 0),
      d.Storaged_Days,
      d.Def_Down_Shelf_Qty,
      d.Goods_Down_Shelf_Qty,
      d.Goods_Look_Qty,
      d.Def_Locking_Qty,
      d.Pre_Lock_Sum,
      d.Batch_Id,
      d.Brand,
      d.Position,
      d.CONTRACT_NAME,
      safeDate(d.CONTRACT_END_TIME),
      d.INVOICES,
      fmtExportType(d.TYPE),
      d.NOTE_DESCRIPTION,
      d.NO_CONSUME_NUM == null ? 0 : d.NO_CONSUME_NUM,
      d.AVG7,
      d.AVG30
    ]);
  });
  return rows;
}

/** stzyyy / chrmyy：含财务属性、静态UDI（老 InvNewPrintStzy） */
function buildStzyExportRows(list) {
  const headers = [
    '库房位置',
    '仓库',
    '所属区域',
    '收货类型',
    '品种编码',
    '品种名称',
    '规格/型号',
    '单位',
    '库存散货',
    '生产企业名称',
    '供应商',
    '生产批号',
    '生产日期',
    '有效到期',
    '系数',
    '结算价',
    '库存定数包数',
    '在库天数',
    '定数包未上架',
    '散货未上架',
    '散货锁定',
    '定数包锁定',
    '定数包预锁',
    '批次号ID',
    '品牌',
    '货位号',
    '合同名称',
    '合同到期',
    '发票',
    '库别',
    '备注',
    '科室未结算',
    '周日均用量',
    '月日均用量',
    '注册证',
    '监管类别名称',
    '管理类别名称',
    '产品大类名称',
    '财务属性名称',
    '静态UDI码'
  ];
  if (isStHospital()) headers.push('平台合同编码');
  if (HOME_HP === 'chrmyy') headers.push('材料分类');
  const rows = [headers];
  (list || []).forEach((d) => {
    const row = [
      ...baseExportPrefix(d),
      d.Def_Qty,
      d.Storaged_Days,
      d.Def_Down_Shelf_Qty,
      d.Goods_Down_Shelf_Qty,
      d.Goods_Look_Qty,
      d.Def_Locking_Qty,
      d.Pre_Lock_Sum,
      d.Batch_Id,
      d.Brand,
      d.Position,
      d.CONTRACT_NAME,
      safeDate(d.CONTRACT_END_TIME),
      d.INVOICES,
      fmtExportType(d.TYPE),
      d.NOTE_DESCRIPTION,
      d.NO_CONSUME_NUM == null ? 0 : d.NO_CONSUME_NUM,
      d.AVG7,
      d.AVG30,
      d.APPROVAL_NUMBER,
      d.REGULATORY_CAT_NAME,
      d.MGMT_CAT_NAME,
      d.PROD_BIG_CLASS_NAME,
      d.CLASSIFIC_NAME,
      d.UDI_TOP
    ];
    if (isStHospital()) row.push(d.PT_HTNUM);
    if (HOME_HP === 'chrmyy') row.push(d.CLASSIFIC_NAME2);
    rows.push(row);
  });
  return rows;
}

/** 默认导出（老 InvNewPrint） */
function buildNormalExportRows(list) {
  const headers = [
    '库房位置',
    '仓库',
    '所属区域',
    '收货类型',
    '品种编码',
    '品种名称',
    '规格/型号',
    '单位',
    '库存散货',
    '生产企业名称',
    '供应商',
    '生产批号',
    '生产日期',
    '有效到期',
    '系数',
    '结算价',
    '库存定数包数',
    '在库天数',
    '定数包未上架',
    '散货未上架',
    '散货锁定',
    '定数包锁定',
    '定数包预锁',
    '批次号ID',
    '品牌',
    '货位号',
    '合同名称',
    '合同编码',
    '合同到期',
    '发票',
    '库别',
    '备注',
    '科室未结算',
    '周日均用量',
    '月日均用量',
    '注册证',
    '监管类别名称',
    '管理类别名称',
    '产品大类名称',
    'SPD入库单号',
    '是否跟台',
    '阳光产品码',
    '入库时间'
  ];
  if (HOME_HP === 'stzl') headers.push('药交ID');
  if (HOME_HP === 'bdrm') headers.push('SKU');
  const rows = [headers];
  (list || []).forEach((d) => {
    const row = [
      ...baseExportPrefix(d),
      d.Def_Qty,
      d.Storaged_Days,
      d.Def_Down_Shelf_Qty,
      d.Goods_Down_Shelf_Qty,
      d.Goods_Look_Qty,
      d.Def_Locking_Qty,
      d.Pre_Lock_Sum,
      d.Batch_Id,
      d.Brand,
      d.Position,
      d.CONTRACT_NAME,
      d.CONTRACT_CODE,
      safeDate(d.CONTRACT_END_TIME),
      d.INVOICES,
      fmtExportType(d.TYPE),
      d.NOTE_DESCRIPTION,
      d.NO_CONSUME_NUM == null ? 0 : d.NO_CONSUME_NUM,
      d.AVG7,
      d.AVG30,
      d.APPROVAL_NUMBER,
      d.REGULATORY_CAT_NAME,
      d.MGMT_CAT_NAME,
      d.PROD_BIG_CLASS_NAME,
      d.DELIVERY_NOTE_NUMBER,
      fmtExportFollow(d.DETAIL_CREATE_TYPE),
      d.YG_CODE,
      d.DELIVERY_TIME
    ];
    if (HOME_HP === 'stzl') row.push(d.PROVINCE_PLATFORM_CODE);
    if (HOME_HP === 'bdrm') row.push(d.SKU_NAME);
    rows.push(row);
  });
  return rows;
}

/** 前端导出 Excel（按院区分支，对齐老 InvNewPrint / Stzx / Stzy） */
export function buildDefaultExportRows(list) {
  if (HOME_HP === 'stzx') return buildStzxExportRows(list);
  if (HOME_HP === 'stzyyy' || HOME_HP === 'chrmyy') return buildStzyExportRows(list);
  return buildNormalExportRows(list);
}
