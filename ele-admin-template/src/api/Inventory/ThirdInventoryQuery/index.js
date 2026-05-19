import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
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
    body.append(key, val == null || val === undefined ? '' : String(val));
  });
  return request.post(url, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/** 与旧 ThirdInventoryQuery.cshtml ThirdInventoryList 参数一致 */
export function buildThirdInventoryQueryParams(where = {}, page = 1, size = 30) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    newcode: where.newcode || '',
    specification_or_type: where.specification_or_type || '',
    batch: where.batch || '',
    delivery_number: where.delivery_number || '',
    approval_number: where.approval_number || '',
    manufacturing_ent_name: where.manufacturing_ent_name || '',
    supplier_name: where.supplier_name || '',
    TimeStart: where.TimeStart || '',
    TimeEnd: where.TimeEnd || ''
  };
}

export async function thirdInventoryList(where, page, size) {
  const res = await postForm(
    '/ThirdInventory/ThirdInventoryList',
    buildThirdInventoryQueryParams(where, page, size)
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function excelThirdInventory(where) {
  const res = await postForm(
    '/ThirdInventory/ExcelThirdInventory',
    buildThirdInventoryQueryParams(where, 1, 999999)
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '导出失败');
}
