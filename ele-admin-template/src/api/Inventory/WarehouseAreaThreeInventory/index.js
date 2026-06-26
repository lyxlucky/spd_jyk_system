import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(code) {
  return code === 200 || code === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

function normPage(page) {
  const n = parseInt(page, 10);
  return String(n > 0 ? n : 1);
}

function normSize(size) {
  const n = parseInt(size, 10);
  return String(n > 0 ? n : 30);
}

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

function unwrap(res, fallbackMsg = '查询失败') {
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || fallbackMsg);
}

export function buildWarehouseAreaThreeInventoryParams(where = {}, page = 1, size = 30) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    WAREHOUSE_AREA_ID: where.WAREHOUSE_AREA_ID || '',
    DEPT_TWO_CODE: where.DEPT_TWO_CODE || '',
    CHARGE_CODE: where.CHARGE_CODE || '',
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW || '',
    VARIETIE_NAME: where.VARIETIE_NAME || '',
    SPECIFICATION_OR_TYPE: where.SPECIFICATION_OR_TYPE || '',
    MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME || '',
    STOCK_STATUS: where.STOCK_STATUS || '',
    STOCK_DEDUCT_TYPE: where.STOCK_DEDUCT_TYPE || '',
    START_TIME: where.START_TIME || '',
    END_TIME: where.END_TIME || ''
  };
}

export async function queryWarehouseAreaOptions(keyword = '') {
  const res = await postForm('/WarehouseAreaManage/QueryWarehouseAreaOptions', {
    Token: token(),
    keyword
  });
  return unwrap(res);
}

export async function getWarehouseMaterialSummary(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetWarehouseMaterialSummary',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

export async function getWarehouseDeptList(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetWarehouseDeptList',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

export async function getDeptMaterialSummary(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetDeptMaterialSummary',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}

export async function getMaterialDetail(where, page, size) {
  const res = await postForm(
    '/WarehouseAreaThreeInventory/GetMaterialDetail',
    buildWarehouseAreaThreeInventoryParams(where, page, size)
  );
  return unwrap(res);
}
