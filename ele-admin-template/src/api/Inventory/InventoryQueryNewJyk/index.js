import {
  parseSort,
  searchMain,
  searchMainAll,
  searchDef,
  getStorageList
} from '@/api/Inventory/InventoryQueryNew';

/**
 * 将 Jyk 页面查询条件映射为 CentralWarehouseDept/Search 参数
 * 字段名与旧 InventoryQueryNew.cshtml 的 DOM id 保持一致
 */
export function mapJykWhere(where = {}) {
  return {
    varietie: where.inventoryNew_search1 ?? '',
    supplier: where.inventoryNew_search2 ?? '',
    batch: where.inventoryNew_search3 ?? '',
    sourceFrom: where.inventoryNew_search4 ?? '',
    manuEntName: where.inventoryNew_search5 ?? '',
    approvalNumber: where.inventoryNew_APPROVAL_NUMBER ?? '',
    classificName: where.inventoryNew_classificName ?? '',
    position: where.inventory_Position ?? '',
    storageId: where.STORAGE_ID ?? where.storageId ?? '',
    upShelfState: where.UpShelfState ?? '',
    conTime: where.conTime ?? '',
    isHptx: where.hptx ?? '',
    validDateFrom: where.start_time ?? '',
    validDateTo: where.end_time ?? '',
    isCharge: where.isCharge ?? '-1',
    highOrLowClass: where.highOrLowClass ?? '-1',
    isBidding: where.isBidding ?? '-1',
    specialPurchase: where.specialPurchase ?? '-1',
    oneoffSterilizationPackaging: where.oneoffSterilizationPackaging ?? '-1',
    storageType: where.storageType ?? '-1',
    isEmbedded: where.isEmbedded ?? '-1',
    isSerialNumber: where.isSerialNumber ?? '-1',
    isProtect: where.isProtect ?? '-1',
    isIntervened: where.isIntervened ?? '-1',
    highOrLowClassTwo: where.highOrLowClassTwo2 ?? ''
  };
}

/** 主表 — GET /CentralWarehouseDept/Search */
export async function GetPDAList({ page, limit, where = {}, order }) {
  const sort = parseSort(order);
  const res = await searchMain(mapJykWhere(where), page, limit, sort);
  return {
    code: res.auditRequired ? 303 : 200,
    total: res.total ?? 0,
    sum: res.sum ?? 0,
    amountSum: res.amountSum ?? 0,
    result: res.result || [],
    requesturl: res.requesturl,
    datatype: res.datatype,
    keyparams: res.keyparams,
    auditRequired: res.auditRequired
  };
}

/** 主表全量（导出） */
export async function GetPDAListAll(where = {}, order) {
  const sort = parseSort(order);
  return searchMainAll(mapJykWhere(where), sort);
}

/** 明细 — GET /CentralWarehouseDept/SearchDef */
export async function GetPDAList2({ page, limit, where = {}, order }) {
  const sort = parseSort(order);
  const ctx = {
    sourceFrom: where.sourceFrom ?? '',
    batchId: where.batchId ?? '',
    varietieCode: where.varietieCode ?? '',
    batch: where.batch ?? '',
    coefficient: where.coefficient ?? '',
    currUpShelfState: where.currUpShelfState ?? '',
    condition: where.condition ?? '',
    storageId: where.storageId ?? ''
  };
  const res = await searchDef(ctx, page, limit, sort);
  return {
    total: res.total ?? 0,
    result: res.result || []
  };
}

export { getStorageList, parseSort };
