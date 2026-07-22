import request from '@/utils/request';
import { formdataify, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function unwrap(res) {
  const data = res.data;
  if (data?.code == 301 || data?.code === '301') {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}

async function postForm(url, data) {
  const res = await request.post(url, formdataify({ Token: token(), ...data }));
  return unwrap(res);
}

/** 解析 ele-pro-table 排序 */
export function parseSort(order) {
  if (!order || !order.sort) {
    return { field: '', order: '' };
  }
  const o = order.order;
  return {
    field: order.sort,
    order: o === 'asc' || o === 'ascending' ? 'asc' : o === 'desc' || o === 'descending' ? 'desc' : ''
  };
}

/** 主表查询参数（与旧 getInventoryNewSearchWhere 一致） */
export function buildMainSearchParams(where = {}, page = 1, size = 10, sort = {}) {
  return {
    Token: token(),
    varietie: where.varietie ?? '',
    supplier: where.supplier ?? '',
    batch: where.batch ?? '',
    sourceFrom: where.sourceFrom ?? '',
    manuEntName: where.manuEntName ?? '',
    APPROVAL_NUMBER: where.approvalNumber ?? '',
    STORAGE_ID: where.storageId ?? '',
    Up_Shelf_State: where.upShelfState ?? '',
    conTime: where.conTime ?? '',
    is_hptx: where.isHptx ?? '',
    validDateFrom: where.validDateFrom ?? '',
    validDateTo: where.validDateTo ?? '',
    field: sort.field ?? '',
    order: sort.order ?? '',
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
    classificName: where.classificName ?? '',
    highOrLowClassTwo: where.highOrLowClassTwo ?? '',
    Position: where.position ?? '',
    page,
    size
  };
}

/** 明细表查询参数 */
export function buildDetailSearchParams(ctx = {}, page = 1, size = 10, sort = {}) {
  return {
    Token: token(),
    sourceFrom: ctx.sourceFrom ?? '',
    batchId: ctx.batchId ?? '',
    varietieCode: ctx.varietieCode ?? '',
    batch: ctx.batch ?? '',
    coefficient: ctx.coefficient ?? '',
    currUpShelfState: ctx.currUpShelfState ?? '',
    condition: ctx.condition ?? '',
    storageId: ctx.storageId ?? '',
    field: sort.field ?? '',
    order: sort.order ?? '',
    page,
    size
  };
}

export async function getStorageList() {
  // 与老系统 $.post 一致：urlencoded，才能绑定 CommonsController.GetStorageWithToken(BaseParam)
  const res = await request.post(
    '/Commons/GetStorageWithToken',
    toUrlEncodedBody({ Token: token() }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return unwrap(res).result || [];
}

export async function getDeptTwoNameByInven() {
  const res = await request.post(
    '/CentralWarehouseDept/GetDeptTwoNameByInven',
    toUrlEncodedBody({ Token: token() }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return unwrap(res).result || [];
}

export async function getHighLowOptionConfig() {
  const res = await request.get('/VarietieBasicInfo/GetHighLowOptionConfig', {
    params: { Token: token() }
  });
  const data = unwrap(res).result || {};
  return {
    HIGH_OR_LOW_CLASS: data.HIGH_OR_LOW_CLASS || [],
    HIGH_OR_LOW_CLASS_TWO: data.HIGH_OR_LOW_CLASS_TWO || []
  };
}

export async function searchMain(where, page, size, sort) {
  const res = await request.get('/CentralWarehouseDept/Search', {
    params: buildMainSearchParams(where, page, size, sort)
  });
  const data = res.data;
  if (data?.code == 303 || data?.code === '303') {
    return {
      auditRequired: true,
      requesturl: data.requesturl,
      datatype: data.datatype,
      keyparams: data.keyparams,
      total: 0,
      sum: 0,
      amountSum: 0,
      result: []
    };
  }
  const ok = unwrap(res);
  return {
    total: ok.total ?? 0,
    sum: ok.sum ?? 0,
    amountSum: ok.amountSum ?? 0,
    result: ok.result || []
  };
}

export async function searchMainAll(where, sort) {
  return searchMain(where, 1, 999999, sort);
}

export async function searchDef(ctx, page, size, sort) {
  const res = await request.get('/CentralWarehouseDept/SearchDef', {
    params: buildDetailSearchParams(ctx, page, size, sort)
  });
  const data = unwrap(res);
  return { total: data.total ?? 0, result: data.result || [] };
}

export async function searchCenterGoodsMsg(hospClassCommonName, page = 1, size = 30) {
  return postForm('/CentralWarehouseDept/SearchCenterGoodsMsg', {
    hospClassCommonName: hospClassCommonName ?? '',
    page,
    size
  });
}

export async function searchCenterGoodsSupplierSummary(where, page, size) {
  const p = buildMainSearchParams(where, page, size, {});
  return postForm('/CentralWarehouseDept/SearchCenterGoodsSupplierSummary', {
    sourceFrom: p.sourceFrom,
    varietie: where.supplierSummaryVarietie ?? p.varietie,
    specType: where.supplierSummarySpecType ?? '',
    supplier: where.supplierSummarySupplier ?? p.supplier,
    batch: p.batch,
    manuEntName: where.supplierSummaryManuEntName ?? p.manuEntName,
    validDateFrom: p.validDateFrom,
    validDateTo: p.validDateTo,
    isCharge: p.isCharge,
    highOrLowClass: p.highOrLowClass,
    isBidding: p.isBidding,
    specialPurchase: p.specialPurchase,
    oneoffSterilizationPackaging: p.oneoffSterilizationPackaging,
    storageType: p.storageType,
    isEmbedded: p.isEmbedded,
    isSerialNumber: p.isSerialNumber,
    isProtect: p.isProtect,
    isIntervened: p.isIntervened,
    classificName: p.classificName,
    highOrLowClassTwo: p.highOrLowClassTwo,
    Up_Shelf_State: p.Up_Shelf_State,
    conTime: p.conTime,
    is_hptx: p.is_hptx,
    APPROVAL_NUMBER: p.APPROVAL_NUMBER,
    Position: p.Position,
    STORAGE_ID: p.STORAGE_ID,
    page,
    size
  });
}

export async function exportCenterDefs(where) {
  const p = buildMainSearchParams(where, 1, 99999, {});
  return postForm('/CentralWarehouseDept/ExportCenterDefs', {
    centerName: where.sourceFrom ?? '',
    VarietieCodeNew: where.varietie ?? '',
    SupplierName: where.supplier ?? '',
    Batch: where.batch ?? '',
    approvalNumber: where.approvalNumber ?? '',
    validateStart: where.validDateFrom ?? '',
    validateEnd: where.validDateTo ?? '',
    upShelfLocation: where.position ?? '',
    manufacter: where.manuEntName ?? '',
    STORAGE_ID: where.storageId ?? '',
    page: 1,
    size: 99999
  });
}

export async function excelInventoryQueryData(where, limit) {
  const p = buildMainSearchParams(where, 1, 999999, {});
  return postForm('/CentralWarehouseDept/ExcelInventoryQueryData', {
    sourceFrom: p.sourceFrom,
    varietie: p.varietie,
    supplier: p.supplier,
    batch: p.batch,
    manuEntName: p.manuEntName,
    validDateFrom: p.validDateFrom,
    validDateTo: p.validDateTo,
    isCharge: p.isCharge,
    highOrLowClass: p.highOrLowClass,
    isBidding: p.isBidding,
    specialPurchase: p.specialPurchase,
    oneoffSterilizationPackaging: p.oneoffSterilizationPackaging,
    storageType: p.storageType,
    isEmbedded: p.isEmbedded,
    isSerialNumber: p.isSerialNumber,
    isProtect: p.isProtect,
    isIntervened: p.isIntervened,
    classificName: p.classificName,
    highOrLowClassTwo: p.highOrLowClassTwo,
    Up_Shelf_State: p.Up_Shelf_State,
    STORAGE_ID: p.STORAGE_ID,
    conTime: p.conTime,
    is_hptx: p.is_hptx,
    APPROVAL_NUMBER: p.APPROVAL_NUMBER,
    position: p.Position,
    Position: p.Position,
    field: p.field,
    order: p.order,
    limit: limit ?? 10,
    page: 1,
    size: 999999
  });
}

export async function exportDeptDefs(deptName) {
  return postForm('/CentralWarehouseDept/ExportDeptDefs', {
    deptName: deptName ?? '',
    page: 1,
    size: 99999
  });
}

export async function exportCentralWareDeptDefToExcel(ctx, sort) {
  const p = buildDetailSearchParams(ctx, 1, 10, sort);
  const res = await request.get('/CentralWarehouseDept/ExportCentralWareDeptDefToExcel', { params: p });
  return unwrap(res);
}

export async function updateStorageById(ids, storageId) {
  return postForm('/CentralWarehouseDept/updateStorageById', { ids, storageId });
}

export async function generateStockData(where) {
  const p = buildMainSearchParams(where, 1, 999999, {});
  const res = await request.get('/CentralWarehouseDept/generateStockData', { params: p });
  return unwrap(res);
}

export async function addCenterWarehouseCheck(isHptx) {
  const res = await request.post('/CenterWarehouseCheck/AddCenterWarehouseCheck', {
    Token: token(),
    IS_HPTX: isHptx ?? '',
    REMARK: ''
  });
  const data = res.data;
  if (data?.code == 200 || data?.code === '200' || data?.success) {
    return data;
  }
  throw new Error(data?.msg || data?.message || '盘点失败');
}

export async function upGoodsPosition(json, hwh) {
  return postForm('/AAPDDATE/UpHWHGOODS', { json, HWH: hwh });
}

export async function upDefPosition(json, hwh) {
  return postForm('/AAPDDATE/UpHWHDEF', { json, HWH: hwh });
}

export async function upVarTypeSource(postData, varType) {
  return postForm('/SystemDelivered/UpVARTYPESource', { postData, VAR_TYPE: varType });
}

const GOODS_MOVE_URL = {
  qualified: '/CentralWarehouseDept/RemoveGoodsToQualified',
  insulated: '/CentralWarehouseDept/RemoveGoodsToInsulated',
  unqualified: '/CentralWarehouseDept/RemoveGoodsToUnqualified',
  adjustDebit: '/CentralWarehouseDept/RemoveGoodsToAdjustDebit',
  emergency: '/CentralWarehouseDept/RemoveGoodsToEmergency',
  fangyi: '/CentralWarehouseDept/RemoveGoodsToFangyi'
};

export async function removeGoodsTo(type, payload) {
  const url = GOODS_MOVE_URL[type];
  if (!url) throw new Error('未知移区类型');
  return postForm(url, payload);
}

const DEFS_MOVE_URL = {
  qualified: '/CentralWarehouseDept/RemoveDefsToQualified',
  insulated: '/CentralWarehouseDept/RemoveDefsToInsulated',
  unqualified: '/CentralWarehouseDept/RemoveDefsToUnqualified',
  emergency: '/CentralWarehouseDept/RemoveDefsToEmergency'
};

export async function removeDefsTo(type, payload) {
  const url = DEFS_MOVE_URL[type];
  if (!url) throw new Error('未知移区类型');
  return postForm(url, payload);
}

export async function loadLockingGoodsDtl(ctx, page, size) {
  const res = await request.get('/CentralWarehouseDept/LoadLockingGoodsDtl', {
    params: {
      Token: token(),
      storageId: ctx.storageId ?? '',
      varietieCode: ctx.varietieCode ?? '',
      batchId: ctx.batchId ?? '',
      batch: ctx.batch ?? '',
      page,
      size
    }
  });
  return unwrap(res);
}

export async function loadLockingDefCodes(ctx, page, size) {
  const res = await request.get('/CentralWarehouseDept/LoadLockingDefCodes', {
    params: {
      Token: token(),
      storageId: ctx.storageId ?? '',
      sourceFrom: ctx.sourceFrom ?? '',
      varietieCode: ctx.varietieCode ?? '',
      batchId: ctx.batchId ?? '',
      batch: ctx.batch ?? '',
      coefficient: ctx.coefficient ?? '',
      page,
      size
    }
  });
  return unwrap(res);
}

export async function loadPreLockingDefCodes(ctx, page, size) {
  const res = await request.get('/CentralWarehouseDept/LoadPreLockingDefCodes', {
    params: {
      Token: token(),
      storageId: ctx.storageId ?? '',
      varietieCode: ctx.varietieCode ?? '',
      coefficient: ctx.coefficient ?? '',
      page,
      size
    }
  });
  return unwrap(res);
}

export async function applyExportAudit(payload) {
  const res = await request.post('/ExportAudit/Apply', {
    Token: token(),
    RequestUrl: payload.requestUrl,
    DataType: payload.dataType,
    ApplyRemark: payload.applyRemark,
    KeyParamsJson: payload.keyParams || ''
  });
  const body = res.data;
  if (body?.code == 200 || body?.code === '200') return body;
  throw new Error(body?.msg || '提交失败');
}
