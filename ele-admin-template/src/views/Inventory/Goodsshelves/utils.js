import store from '@/store';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const isSzseOrderJs = String(HOME_HP || '')
  .toLowerCase()
  .startsWith('szse');

export const isBdrm = HOME_HP === 'bdrm';

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
 * 导出权限：市二(szse*)需 export-* 码；其它院默认可见
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
  return hasPermission(permissionUrl);
}

export function hasPermission(permissionUrl) {
  if (!permissionUrl) return true;
  const authorities = store?.state?.user?.authorities || [];
  if (authorities.includes(permissionUrl)) return true;
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) =>
    [p.Permission_Url, p.PERMISSION_URL, p.component, p.path, p.title].some(
      (v) => v === permissionUrl
    )
  );
}

/** 对齐老系统「科室流向导出按钮」+ 市二 export-GoodsshelvesKsDc */
export function canShowOutExcelBtn() {
  const hasKsLx = hasPermission('科室流向导出按钮');
  const hasExportCode = hasExportPermission('export-GoodsshelvesKsDc');
  if (process.env.NODE_ENV === 'development') return true;
  return hasKsLx && hasExportCode;
}

/** 入库导出 Excel(新)：export-GoodsshelveszxDc（非市二默认可见） */
export function canShowInExcelBtn() {
  return hasExportPermission('export-GoodsshelveszxDc');
}

export function getOrderJsTypeText(value) {
  switch (String(value ?? '0')) {
    case '0':
      return '普通';
    case '1':
      return '临购';
    case '2':
      return '临购初始化（医院货主）';
    case '3':
      return '原HERP库存初始化（医院货主）';
    case '4':
      return '经费入库';
    case '5':
      return '初始化一出已结算';
    default:
      return '';
  }
}

export function formatHighLowClassTwo(v) {
  if (v === '1' || v === 1) return '重点治理';
  if (v === '2' || v === 2) return '非重点治理';
  if (v == null || v === '') return '未设置';
  return String(v);
}

export function formatCheckState(v) {
  if (v === '1' || v === 1) return '已出单';
  if (v === '2' || v === 2) return '已回单';
  if (v == null || v === '') return '未登记';
  return String(v);
}

export function formatUploadState(row) {
  const numEmpty = row.ORDER_NUM === '' || row.ORDER_NUM == null;
  const pic = row.Batch_Pic_Full_Name;
  const picEmpty = pic === '' || pic == null || pic === '-';
  return numEmpty && picEmpty ? '未上传' : '已上传';
}

export function formatContractType(v) {
  if (v === '1' || v === 1) return '中标';
  if (v === '2' || v === 2) return '临采';
  return v == null ? '' : String(v);
}

export function defaultOutDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  return [fmt(start), fmt(end)];
}

export const defaultInDateRange = defaultOutDateRange;

export function storageName(storageList, id) {
  const hit = (storageList || []).find((x) => Number(x.id) === Number(id));
  return hit ? hit.name : '-';
}

/** 入库列表可服务端排序字段（对齐 InStockCheckApp switch） */
export const IN_SORTABLE_PROPS = [
  'UP_SHELF_TYPE',
  'SUPPLIER_NAME',
  'UP_SHELF_TIME',
  'VARIETIE_CODE_NEW',
  'VARIETIE_NAME',
  'SPECIFICATION_OR_TYPE',
  'UNIT',
  'MANUFACTURING_ENT_NAME',
  'BATCH',
  'BATCH_PRODUCTION_DATE',
  'BATCH_VALIDITY_PERIOD',
  'COEFFICIENT',
  'GOODS_QTY',
  'DEF_NO_PKG_CODE',
  'UP_SHELF_QUANTITY',
  'BUSINESS_BILL'
];

/** 出库列表可服务端排序字段（对齐 InStockCheckApp switch） */
export const OUT_SORTABLE_PROPS = [
  'UP_SHELF_TYPE',
  'SUPPLIER_NAME',
  'RECEIVING_TIME',
  'VARIETIE_CODE_NEW',
  'VARIETIE_NAME',
  'SPECIFICATION_OR_TYPE',
  'UNIT',
  'MANUFACTURING_ENT_NAME',
  'BATCH',
  'BATCH_PRODUCTION_DATE',
  'BATCH_VALIDITY_PERIOD',
  'COEFFICIENT',
  'RECEIVING_QUANTITY',
  'GOODS_QTY',
  'BUSINESS_BILL'
];

/** 为白名单列开启 custom 排序 */
export function withCustomSort(columns, sortableProps) {
  const set = new Set(sortableProps || []);
  return (columns || []).map((col) =>
    col?.prop && set.has(col.prop) ? { ...col, sortable: 'custom' } : col
  );
}
