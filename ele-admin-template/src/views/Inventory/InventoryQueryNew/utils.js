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

export function hasExportPermission(permissionUrl) {
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) => p.Permission_Url === permissionUrl);
}

export function hasPermission(permissionUrl) {
  return hasExportPermission(permissionUrl);
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

/** 前端导出 Excel 行（默认模板） */
export function buildDefaultExportRows(list) {
  const headers = [
    '库存院区',
    '仓库',
    '所属区域',
    '收货类型',
    '品种编码',
    '品种全称',
    '型号/规格',
    '单位',
    '库存散货',
    '注册证号',
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
    '货位号',
    '合同名称',
    '合同到期',
    '备注',
    '科室未结算',
    '周日均用量',
    '月日均用量'
  ];
  if (HOME_HP === 'stzl') headers.splice(10, 0, '药交ID');
  if (isSkuHospital()) headers.splice(7, 0, '品种SKU');
  const rows = [headers];
  (list || []).forEach((d) => {
    const area = fmtMainUpShelfState(d);
    const recv = fmtReceiveProperty(d.Receive_Property);
    const row = [
      d.Source_Name,
      d.STORAGE_TWO_NAME,
      area,
      recv,
      d.Varietie_Code_New,
      d.Varietie_Name,
      d.Specification_Or_Type,
      d.Unit,
      d.Goods_Qty,
      d.APPROVAL_NUMBER,
      d.Manufacturing_Ent_Name,
      d.Supplier_Name,
      d.Batch,
      fmtDate10(d.Batch_Production_Date),
      fmtDate10(d.Batch_Validity_Period),
      d.Coefficient,
      fmtSupplyPrice(d),
      d.Def_Qty,
      d.Storaged_Days,
      d.Def_Down_Shelf_Qty,
      d.Goods_Down_Shelf_Qty,
      d.Goods_Look_Qty,
      d.Def_Locking_Qty,
      d.Pre_Lock_Sum,
      d.Batch_Id,
      d.Position,
      d.CONTRACT_NAME,
      fmtContractEnd(d.CONTRACT_END_TIME),
      d.NOTE_DESCRIPTION,
      d.NO_CONSUME_NUM == null ? 0 : d.NO_CONSUME_NUM,
      d.AVG7,
      d.AVG30
    ];
    if (HOME_HP === 'stzl') row.splice(10, 0, d.PROVINCE_PLATFORM_CODE);
    if (isSkuHospital()) row.splice(7, 0, d.SKU_NAME);
    rows.push(row);
  });
  return rows;
}
