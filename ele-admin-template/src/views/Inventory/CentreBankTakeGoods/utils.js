import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const LEGACY_WEB_BASE = (BACK_BASE_URL || '').replace(/\/$/, '');

/** 勾选列：居中 */
export const COL_SEL = { type: 'selection', width: 48, align: 'center', fixed: 'left' };

export function openExcelFile(fileName) {
  const base = LEGACY_WEB_BASE;
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

export function proPicUrl(name) {
  if (!name) return '';
  const first = String(name).split(',')[0]?.trim();
  if (!first) return '';
  return `${LEGACY_WEB_BASE}/Upload/ProPic/${first}`;
}

export function proPicList(name) {
  if (!name) return [];
  return String(name)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((f) => `${LEGACY_WEB_BASE}/Upload/ProPic/${f}`);
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

export function fmtDateTime(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

export function fmtReceiveState(v) {
  if (v == 0 || v === '0' || v === '未收货') return '未收货';
  if (v == 1 || v === '1' || v === '已收货') return '已收货';
  return v ?? '';
}

export function fmtReceiveProperty(v) {
  if (v == 0 || v === '0') return '普通收货单';
  if (v == 1 || v === '1') return '盘溢收货单';
  return '';
}

export function fmtPrintCount(v) {
  if (v == null || v <= 0) return '未打印';
  return String(v);
}

export function fmtEnable(v) {
  if (v == 0 || v === '0') return '不启用';
  if (v == 1 || v === '1') return '启用';
  return '';
}

export function fmtTemperature(v) {
  if (v == 0 || v === '0') return '常温';
  return '';
}

export function fmtFundsSource(v) {
  const m = {
    1: '自筹资金',
    2: '政府补助',
    3: '科教项目',
    4: '财政+自筹',
    5: '财政转款(发改委)',
    6: '财政转款(开办费用)',
    7: '财政资金'
  };
  return m[v] ?? '未设置';
}

export function fmtVarType(v) {
  if (v == 1 || v === '1') return '防疫物资';
  return '普通物资';
}

export function fmtOrderType(v) {
  if (v == 1 || v === '1') return '线上采购';
  if (v == 0 || v === '0') return '线下采购';
  return '';
}

export function fmtYesNo(v) {
  if (v == 1 || v === '1') return '是';
  if (v == 0 || v === '0') return '否';
  return '';
}

export function fmtUploadState(v) {
  return v ? '已上传' : '未上传';
}

export function fmtPrice(v, bl) {
  const n = Number(v);
  if (Number.isNaN(n)) return '';
  const d = bl != null ? bl : 4;
  return n.toFixed(d);
}

export function monthAheadDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildManualAddJson(rows, note = '') {
  const list = rows.map((r) => {
    const e = r._edit || {};
    const skuId = e.skuId || r._skuId || 0;
    const q = e.qualified ?? r.Hidden_IS_HG ?? '1';
    const noteDesc = (e.note || r.Hidden_Note_Description || note || '').trim();
    return `{${r.Varietie_Code},${e.batch || r.Hidden_Batch || ''},${e.prodDate || r.Hidden_Batch_Production_Date || ''},${e.validDate || r.Hidden_Batch_Validity_Period || ''},${e.netreceipts ?? r.Hidden_Netreceipts ?? 0},${r.Supplier_code || ''},${r.Supply_Price ?? 0},${r.Contract_Code || ''},${noteDesc},${e.fjBatch || r.Hidden_FJ_batch || ''},${skuId},${e.ptHtnum || r.Hidden_PT_HTNUM || ''},${q}}`;
  });
  return JSON.stringify(list);
}

export function buildManualSaveJson(rows) {
  return JSON.stringify(
    rows.map((r) =>
      `{${r.Goods_Var_Receipt_Detail_Id},${r.Batch || ''},${r.Batch_Production_Date || ''},${r.Batch_Validity_Period || ''},${r.Netreceipts ?? 0}}`
    )
  );
}

export function buildManualDeleteJson(rows) {
  return JSON.stringify(rows.map((r) => `{${r.Goods_Var_Receipt_Detail_Id}}`));
}

export function buildSystemSaveJson(rows) {
  return JSON.stringify(
    rows.map((r) => {
      const prod = fmtDate10(r.Batch_Production_Date || r._prodDate);
      const valid = fmtDate10(r.Batch_Validity_Period || r._validDate);
      return `{${r.Record_From},${r.Def_No_Pkg_Receipt_Detail_Id},${r.Netreceipts ?? 0},${prod},${valid},${r.Note_Description || ''},${r.DISINFECTION_BATCH || ''},${r.Batch || ''},${r.PT_HTNUM || ''}}`;
    })
  );
}

export function buildIdJson(rows, idField = 'Goods_Var_Receipt_Detail_Id') {
  return JSON.stringify(rows.map((r) => ({ ID: r[idField] })));
}

export function buildDefIdJson(rows) {
  return JSON.stringify(rows.map((r) => ({ ID: r.Def_No_Pkg_Receipt_Detail_Id })));
}

export function idsCsv(rows, field) {
  return rows.map((r) => r[field]).filter(Boolean).join(',');
}

/** 平台单号列：旧系统 hide: isSt && !isFszxy */
export function showPtHtnumColumn() {
  const isSt = !['stse', 'stzl', 'stzx', 'csyy', 'stzyyy', 'chrmyy'].includes(HOME_HP);
  return !isSt || HOME_HP === 'fszxy';
}

export const hpFlags = {
  isSkuShow: HOME_HP === 'bdrm',
  isCg: HOME_HP === 'szlh',
  isFszxy: HOME_HP === 'fszxy',
  /** 汕头等院区显示省平台合同列（旧 hide: isSt） */
  isStHospital: ['stse', 'stzl', 'stzx', 'csyy', 'stzyyy', 'chrmyy'].includes(HOME_HP),
  dqFs: ['fszxy', 'fsdwrmyy', 'fsdl', 'fsyb'].includes(HOME_HP),
  /** 资金来源/二级仓库：旧 Home 权限控制 hideFUNDS_SOURCE、hideSTORAGE_TWO */
  showFundsSource: false,
  /** 收货作业页工具栏物资/温度：旧 CentreBankTakeGoogs 未启用 hideVAR_TYPE，始终显示 */
  showVarType: false,
  showStorageTwo: false,
  showOverflowReceipt: HOME_HP === 'nyd',
  chrmyyPrintSize: HOME_HP === 'chrmyy'
};

export function initHpFlagsFromPermissions(permissions = []) {
  hpFlags.showFundsSource = permissions.some((p) => p.Permission_Url === '收货-资金来源');
  hpFlags.showVarType = permissions.some((p) => p.Permission_Url === '物资类型');
  hpFlags.showStorageTwo = permissions.some((p) => p.Permission_Url === '仓库-二级仓库');
}

/** UDI 扫码弹窗上下文（系统/人工收货明细行） */
export function buildUdiScanContext(row, mode = 'system') {
  if (!row) return null;
  if (mode === 'manual') {
    return {
      batchId: row.Goods_Var_Receipt_Detail_Id,
      varietyCode: row.Varietie_Code,
      varietyName: row.Varietie_Name,
      batch: row.Batch,
      prodDate: row.Batch_Production_Date,
      validDate: row.Batch_Validity_Period,
      receivable: row.Netreceipts ?? 0,
      udiTop: row.UDI_TOP || ''
    };
  }
  return {
    batchId: row.BATCH_ID,
    varietyCode: row.Varietie_Code_New || row.Varietie_Code,
    varietyName: row.Varietie_Name,
    batch: row.Batch,
    prodDate: row.Batch_Production_Date,
    validDate: row.Batch_Validity_Period,
    receivable: row.Netreceipts ?? row.Receivable ?? 0,
    udiTop: row.UDI_TOP || ''
  };
}

export function initSearchRow(row, note = '') {
  return {
    ...row,
    _edit: {
      batch: '',
      fjBatch: '',
      prodDate: fmtDate10(new Date()),
      validDate: '',
      netreceipts: 1,
      note: note,
      ptHtnum: '',
      skuId: '',
      qualified: '1'
    }
  };
}
