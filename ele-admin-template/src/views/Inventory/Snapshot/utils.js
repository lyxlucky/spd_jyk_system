import { utils, writeFile } from 'xlsx';

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).substr(0, 10);
}

export function fmtPrice(v) {
  if (v == null || v === '') return '';
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : n.toFixed(2);
}

export function fmtStorageId(v) {
  if (v == '1' || v === 1) return '院内中心库';
  if (v == '2' || v === 2) return '院外中心库';
  return '未知';
}

export function fmtUpShelfStateKz(v, sourceName) {
  if (v == 1 || v === '1') return '合格区';
  if (v == 6 || v === '6') return '普通隔离区';
  if (v == 7 || v === '7') return '不合格区';
  if (v == 8 || v === '8') return '盘损隔离区';
  if (v == 9 || v === '9') return '应急库';
  if (v == 2 || v === '2') return '拣配区';
  if (v == 0 || v === '0') return sourceName || '已出库';
  return '锁定区';
}

export function fmtReceiveProperty(v) {
  if (v == 0 || v === '0') return '普通收货';
  if (v == 1 || v === '1') return '盘溢收货';
  return '无';
}

export function fmtApproveStateDtl(v) {
  if (v == 0 || v === '0') return '未审批';
  if (v == 1 || v === '1') return '审批一致';
  if (v == 2 || v === '2') return '审批有异';
  return v ?? '';
}

export function fmtIsGet(v) {
  if (v == 0 || v === '0') return '未收';
  if (v == 1 || v === '1') return '已收';
  return v ?? '';
}

export function calcAllGoodsQty(row) {
  const n = (k) => Number(row[k]) || 0;
  return (
    n('Consumed_His_Qty') +
    n('Consumed_Dept_Qty') +
    n('Receive_His_Qty') +
    n('Center_Def_Qty') +
    n('Center_Goods_Qty')
  );
}

export function isContractExpired(v) {
  if (!v) return false;
  const d = new Date(String(v).substr(0, 10)).getTime();
  return !Number.isNaN(d) && d <= Date.now();
}

/** 效期行样式（检验科 15/30 天规则简化：过期标红，近效期标黄） */
export function batchValidityClass(row) {
  const v = row.BATCH_VALIDITY_PERIOD;
  if (!v) return '';
  const bvp = new Date(String(v).substr(0, 10)).getTime();
  const now = Date.now();
  if (Number.isNaN(bvp)) return '';
  const src = row.SOURCE_NAME || '';
  if (src.indexOf('检验科') !== -1) {
    if (bvp - 1296000000 <= now) return 'snapshot-validity-danger';
    if (bvp - 2592000000 <= now) return 'snapshot-validity-warn';
  } else if (bvp - 1296000000 < now) {
    return 'snapshot-validity-warn';
  }
  return '';
}

export function initSnapshotFlags(permissionGroup = []) {
  const urls = permissionGroup.map((p) => p.Permission_Url);
  return {
    showStorageTwo: urls.includes('仓库-二级仓库'),
    showPdaConsume: urls.includes('科室结算方式-消耗结算')
  };
}

export function exportAoa(fileName, headers, rows) {
  const data = [headers, ...rows];
  const sheet = utils.aoa_to_sheet(data);
  const book = utils.book_new();
  utils.book_append_sheet(book, sheet, 'Sheet1');
  writeFile(book, fileName);
}

/** 供应商快照明细导出列 */
export const SUPPLIER_EXPORT_HEADERS = [
  '供应商名称',
  '品种编码',
  '品种名称',
  '规格型号',
  '生产企业',
  '单位',
  '合计库存',
  '中心库散货',
  '中心库定数包',
  '收货结算',
  '用后结算-科室库存',
  '用后结算数量',
  '供应商核对',
  '对账函'
];

export function supplierRowToExport(r) {
  return [
    r.Supplier_Name,
    r.Varietie_Code_New,
    r.Varietie_Name,
    r.Specification_Or_Type,
    r.MANUFACTURING_ENT_NAME,
    r.UNIT,
    calcAllGoodsQty(r),
    r.Center_Goods_Qty,
    r.Center_Def_Qty,
    r.Receive_His_Qty,
    r.Consumed_Dept_Qty,
    r.Consumed_His_Qty,
    fmtApproveStateDtl(r.Approve_State),
    fmtIsGet(r.IS_GET)
  ];
}

/** 中心库快照导出列 */
export const CENTER_EXPORT_HEADERS = [
  '快照单号',
  '快照日期',
  '库房位置',
  '所属区域',
  '收货类型',
  '品种编码',
  '计费编码',
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
  '货位号',
  '合同名称',
  '合同到期',
  '备注',
  '科室未结算'
];

export function centerRowToExport(r) {
  return [
    r.ORDER_NUM,
    fmtDate10(r.CREATE_TIME),
    r.SOURCE_NAME,
    fmtUpShelfStateKz(r.UP_SHELF_STATE, r.SOURCE_NAME),
    fmtReceiveProperty(r.RECEIVE_PROPERTY),
    r.VARIETIE_CODE_NEW,
    r.CHARGING_CODE,
    r.VARIETIE_NAME,
    r.SPECIFICATION_OR_TYPE,
    r.UNIT,
    r.GOODS_QTY,
    r.MANUFACTURING_ENT_NAME,
    r.SUPPLIER_NAME,
    r.BATCH,
    fmtDate10(r.BATCH_PRODUCTION_DATE),
    fmtDate10(r.BATCH_VALIDITY_PERIOD),
    r.COEFFICIENT,
    fmtPrice(r.SUPPLY_PRICE),
    r.DEF_QTY,
    r.STORAGED_DAYS,
    r.DEF_DOWN_SHELF_QTY,
    r.GOODS_DOWN_SHELF_QTY,
    r.GOODS_LOOK_QTY,
    r.DEF_LOCKING_QTY,
    r.PRE_LOCK_SUM,
    r.BATCH_ID,
    r.POSITION,
    r.CONTRACT_NAME,
    fmtDate10(r.CONTRACT_END_TIME),
    r.NOTE_DESCRIPTION,
    r.NO_CONSUME_NUM == null ? 0 : r.NO_CONSUME_NUM
  ];
}
