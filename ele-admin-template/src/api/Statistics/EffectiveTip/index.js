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

function basePaging({ page, size, field, order, monty }) {
  return {
    Token: token(),
    page: page || 1,
    size: size || 10,
    monty: monty ?? '0',
    field: field || '',
    order: order || ''
  };
}

export async function searchProdAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchProdAuthExpired', {
    ...basePaging(params),
    SearchType: params.searchType ?? '0'
  });
  return unwrap(res);
}

export async function searchSupplierAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchSupplierAuthExpired', {
    ...basePaging(params),
    supplierEnum: params.supplierEnum ?? '0'
  });
  return unwrap(res);
}

export async function searchContractAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchContractAuthExpired', {
    ...basePaging(params),
    contractAuthenum: params.contractAuthenum ?? '0'
  });
  return unwrap(res);
}

export async function searchContractVarietieAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchContractVarietieAuthExpired', {
    ...basePaging(params)
  });
  return unwrap(res);
}

export async function searchDeptOneVarietieAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchDeptOneVarietieAuthExpired', {
    ...basePaging(params)
  });
  return unwrap(res);
}

export async function searchDeptTwoVarietieAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchDeptTwoVarietieAuthExpired', {
    ...basePaging(params)
  });
  return unwrap(res);
}
