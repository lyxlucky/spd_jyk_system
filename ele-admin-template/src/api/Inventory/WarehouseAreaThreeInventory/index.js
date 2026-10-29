import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

// 后端成功码兼容数字和字符串两种返回。
function okCode(code) {
  return code === 200 || code === '200';
}

// 统一处理登录失效响应。
function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

// 规范分页页码，避免空值传到后端。
function normPage(page) {
  const n = parseInt(page, 10);
  return String(n > 0 ? n : 1);
}

// 规范分页大小，默认保持当前页面表格的30条。
function normSize(size) {
  const n = parseInt(size, 10);
  return String(n > 0 ? n : 30);
}

// 本模块后端接口使用form表单参数提交。
function postForm(url, params) {
  const body = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const val = params[key];
    body.append(key, val == null ? '' : String(val));
  });
  return request.post(url, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

// 统一拆包后端ApiResponse，失败时抛出业务错误。
function unwrap(res, fallbackMsg = '查询失败') {
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || fallbackMsg);
}

// 组装三级库库存查询通用参数。
export function buildWarehouseAreaThreeInventoryParams(where = {}, page = 1, size = 30) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    WAREHOUSE_AREA_ID: where.WAREHOUSE_AREA_ID || '',
    AREA_CODE: where.AREA_CODE || where.WAREHOUSE_AREA_ID || '',
    DEPT_TWO_CODE: where.DEPT_TWO_CODE || '',
    CHARGE_CODE: where.CHARGE_CODE || '',
    BARCODE_NUMBER: where.BARCODE_NUMBER || '',
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW || '',
    VARIETIE_NAME: where.VARIETIE_NAME || '',
    SPECIFICATION_OR_TYPE: where.SPECIFICATION_OR_TYPE || '',
    MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME || '',
    STOCK_STATUS: where.STOCK_STATUS || '',
    IS_DELETE: where.IS_DELETE == null ? '1' : String(where.IS_DELETE),
    EXCLUDE_UP_SHELF_VARIETY:
      where.EXCLUDE_UP_SHELF_VARIETY == null ? '1' : String(where.EXCLUDE_UP_SHELF_VARIETY),
    STOCK_DEDUCT_TYPE: where.STOCK_DEDUCT_TYPE || '',
    HIGH_OR_LOW_CLASS: where.HIGH_OR_LOW_CLASS || '0',
    START_TIME: where.START_TIME || '',
    END_TIME: where.END_TIME || '',
    TYPE: where.TYPE || '',
    BUSINESS_TYPES: Array.isArray(where.BUSINESS_TYPES) ? where.BUSINESS_TYPES.join(',') : where.BUSINESS_TYPES || '',
    BATCH_NOS: Array.isArray(where.BATCH_NOS) ? JSON.stringify(where.BATCH_NOS) : where.BATCH_NOS || '',
    BATCH_EMPTY: where.BATCH_EMPTY === true || where.BATCH_EMPTY === '1' ? '1' : '',
    DEPT_CODE: where.DEPT_CODE || '',
    PATIENT_NUMBER: where.PATIENT_NUMBER || '',
    HOSPITALIZATION_NUMBER: where.HOSPITALIZATION_NUMBER || '',
    MEDICAL_ORDER_ID: where.MEDICAL_ORDER_ID || '',
    JF_ID: where.JF_ID || '',
    ORIGING_CODE: where.ORIGING_CODE || '',
    CREATE_START_TIME: where.CREATE_START_TIME || '',
    CREATE_END_TIME: where.CREATE_END_TIME || '',
    EXPIRY_START: where.EXPIRY_START || '',
    EXPIRY_END: where.EXPIRY_END || '',
    QTY_SIGN: where.QTY_SIGN || '',
    TRANSFER_STATUS: where.TRANSFER_STATUS || '',
    TRANSFER_REMARK: where.TRANSFER_REMARK || ''
  };
}

// 查询当前账号可访问的库房/库区下拉选项。
export async function queryAccessibleWarehouseAreaOptions(keyword = '') {
  const res = await postForm('/WarehouseAreaThreeInventory/QueryAccessibleWarehouseAreaOptions', {
    Token: token(),
    keyword
  });
  return unwrap(res);
}

// 查询库房/库区维度的耗材库存汇总。
export async function getWarehouseMaterialSummary(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetWarehouseMaterialSummary',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

// 查询库房/库区下维护关系的SPD科室列表。
export async function getWarehouseDeptList(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetWarehouseDeptList',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

// 查询选中SPD科室的耗材库存汇总。
export async function getDeptMaterialSummary(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetDeptMaterialSummary',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

// 查询三级库库存明细流水。
export async function getMaterialDetail(where, page, size) {
  const params = {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    AREA_CODE: where?.AREA_CODE || '',
    CHARGE_CODE: where?.CHARGE_CODE || ''
  };
  if (Array.isArray(where?.BATCH_NOS) && where.BATCH_NOS.length) {
    params.BATCH_NOS = JSON.stringify(where.BATCH_NOS);
  }
  if (where?.QTY_SIGN) params.QTY_SIGN = where.QTY_SIGN;
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetMaterialDetail',
    params
  );
  return unwrap(res);
}

// 返回同一实际库区下的完整候选；后端超过 5000 条会要求缩小条件。
export async function getTransferCandidates(where) {
  const res = await postForm('/WarehouseAreaThreeInventory/GetTransferCandidates', {
    ...buildWarehouseAreaThreeInventoryParams(where, 1, 5000),
    EXACT_AREA: '1'
  });
  return unwrap(res, '查询移库候选失败');
}

export async function previewTransfer(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/PreviewTransfer', {
    Token: token(),
    IDS: params.IDS,
    SOURCE_AREA_CODE: params.SOURCE_AREA_CODE,
    TARGET_AREA_CODE: params.TARGET_AREA_CODE,
    TRANSFER_REMARK: params.TRANSFER_REMARK
  });
  return unwrap(res, '移库预览失败');
}

// 确认只提交服务器签发的预览令牌，不能在此更换流水或目标库区。
export async function submitTransfer(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/SubmitTransfer', {
    Token: token(),
    PREVIEW_TOKEN: params.PREVIEW_TOKEN,
    REQUEST_ID: params.REQUEST_ID
  });
  return unwrap(res, '移库失败');
}

// 按明细主键软删除三级库库存流水。
export async function deleteMaterialDetails(ids, where = {}) {
  const idList = (Array.isArray(ids) ? ids : [ids])
    .map((id) => String(id == null ? '' : id).trim())
    .filter((id) => id && id !== '0');
  if (!idList.length) {
    throw new Error('请选择需要删除的明细');
  }
  const res = await postForm('/WarehouseAreaThreeInventory/DeleteMaterialDetails', {
    Token: token(),
    IDS: Array.from(new Set(idList)).join(','),
    AREA_CODE: where.AREA_CODE || where.WAREHOUSE_AREA_ID || ''
  });
  return unwrap(res, '删除失败');
}

export async function getMaterialLocationSummary(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetMaterialLocationSummary',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

export async function getMaterialLocationDetail(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetMaterialLocationDetail',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

// 上传Excel初始化三级库库存。
export async function importInitialInventory(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/WarehouseAreaThreeInventory/ImportInitialInventory', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res, '导入失败');
}

// 组装HIS计费和SPD入库同步接口共用参数。
function buildWarehouseSyncParams(params = {}) {
  const codes = Array.isArray(params.AREA_CODES)
    ? params.AREA_CODES.join(',')
    : params.AREA_CODES || '';
  const ids = Array.isArray(params.WAREHOUSE_AREA_IDS)
    ? params.WAREHOUSE_AREA_IDS.join(',')
    : params.WAREHOUSE_AREA_IDS || '';
  return {
    Token: token(),
    AREA_CODES: codes || ids,
    WAREHOUSE_AREA_IDS: ids,
    START_TIME: params.START_TIME || '',
    END_TIME: params.END_TIME || ''
  };
}

// 查询指定库房/库区下可用于HIS计费同步的SPD科室关系。
export async function queryHisChargeSpdDeptRelations(areaCode) {
  const res = await postForm('/WarehouseAreaThreeInventory/QueryHisChargeSpdDeptRelations', {
    Token: token(),
    AREA_CODE: areaCode || ''
  });
  return unwrap(res);
}

// 查询指定库房/库区下可用于SPD入库同步的SPD科室关系。
export async function querySpdInStockDeptRelations(areaCode) {
  const res = await postForm('/WarehouseAreaThreeInventory/QuerySpdInStockDeptRelations', {
    Token: token(),
    AREA_CODE: areaCode || ''
  });
  return unwrap(res);
}

// 预览待同步的HIS计费记录。
export async function previewHisChargeRecords(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/PreviewHisChargeRecords', {
    ...buildWarehouseSyncParams(params)
  });
  return unwrap(res, '预览失败');
}

// 同步HIS计费记录到三级库库存。
export async function syncHisChargeRecords(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/SyncHisChargeRecords', {
    ...buildWarehouseSyncParams(params)
  });
  return unwrap(res, '同步失败');
}

// 预览待同步的SPD入库记录。
export async function previewSpdInStockRecords(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/PreviewSpdInStockRecords', {
    ...buildWarehouseSyncParams(params)
  });
  return unwrap(res, '预览失败');
}

// 同步SPD入库记录到三级库库存。
export async function syncSpdInStockRecords(params) {
  const res = await postForm('/WarehouseAreaThreeInventory/SyncSpdInStockRecords', {
    ...buildWarehouseSyncParams(params)
  });
  return unwrap(res, '同步失败');
}
