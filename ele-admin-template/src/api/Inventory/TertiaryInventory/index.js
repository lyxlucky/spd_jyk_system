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

/** 与旧 TertiaryInventory.cshtml TertiaryInventoryList 参数一致 */
export function buildTertiaryInventoryParams(where = {}, page = 1, size = 30) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    manufacturing_ent_name: where.manufacturing_ent_name || '',
    varietie_code: where.varietie_code || '',
    varietie_name: where.varietie_name || '',
    charging_code: where.charging_code || '',
    DEPT_TWO_NAME: where.DEPT_TWO_NAME || ''
  };
}

export async function tertiaryInventoryList(where, page, size) {
  const res = await postForm(
    '/ThirdInventory/TertiaryInventoryList',
    buildTertiaryInventoryParams(where, page, size)
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export function buildTertiaryDetailParams(
  varietieCode,
  deptTwoCode,
  page = 1,
  size = 50,
  tibdStar = '',
  tibdEnd = ''
) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    varietie_code: varietieCode || '',
    dept_two_code: deptTwoCode || '',
    TIBD_STAR: tibdStar || '',
    TIBD_END: tibdEnd || ''
  };
}

export async function tertiaryInventoryDetailList(
  varietieCode,
  deptTwoCode,
  page,
  size,
  tibdStar,
  tibdEnd
) {
  const res = await postForm(
    '/ThirdInventory/TertiaryInventoryDetailList',
    buildTertiaryDetailParams(varietieCode, deptTwoCode, page, size, tibdStar, tibdEnd)
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}
