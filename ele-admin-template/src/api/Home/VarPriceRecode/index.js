import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
}

function postUrlEncoded(path, fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([k, v]) => {
    body.append(k, v == null ? '' : String(v));
  });
  return request.post(path, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

/** 筛选：全部 -> 空字符串（与旧 layui where 一致） */
export function normalizeVarPriceRecodeWhere(where = {}) {
  const w = { ...where };
  if (w.STATE === '全部' || w.STATE == null) w.STATE = '';
  if (w.PriceIsEqual === '全部' || w.PriceIsEqual == null) w.PriceIsEqual = '';
  return w;
}

export async function getVarPriceRecodeList({ page, size, where }) {
  const w = normalizeVarPriceRecodeWhere(where);
  const res = await postUrlEncoded('/VarietieBasicInfo/getVarPriceRecode', {
    Token: token(),
    page: page || 1,
    size: size || 30,
    VARIETIE_SEARCH_VALUE: w.VARIETIE_SEARCH_VALUE || '',
    STATE: w.STATE ?? '',
    start_time: w.start_time || '',
    end_time: w.end_time || '',
    PriceIsEqual: w.PriceIsEqual ?? ''
  });
  return unwrap(res);
}

export async function varPriceRecodeCommit(rows) {
  const res = await postUrlEncoded('/VarietieBasicInfo/varPriceRecodeCommit', {
    Token: token(),
    json: JSON.stringify(rows || [])
  });
  return unwrap(res);
}
