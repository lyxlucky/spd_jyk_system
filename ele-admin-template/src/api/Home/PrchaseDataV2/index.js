import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
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

/** 与旧 PrchaseDataV2.cshtml getPrchaseDataV2BaseWhere 一致 */
export function buildListParams(where = {}, page = 1, size = 30, sort = {}) {
  return {
    Token: token(),
    PROD_REGISTRATION_NAME: where.PROD_REGISTRATION_NAME ?? '',
    MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME ?? '',
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW ?? '',
    XM_NAME: where.XM_NAME ?? '',
    XM_NUM: where.XM_NUM ?? '',
    XM_TYPE: where.XM_TYPE ?? '',
    SOURCE_FROM: where.SOURCE_FROM ?? '',
    PRICE: where.PRICE ?? '',
    APPROVAL_NUMBER: where.APPROVAL_NUMBER ?? '',
    STATE: where.STATE ?? '',
    statrTime: where.statrTime ?? '',
    endTime: where.endTime ?? '',
    statrTime2: where.statrTime2 ?? '',
    endTime2: where.endTime2 ?? '',
    CountState: where.CountState ?? '',
    statrTime3: where.statrTime3 ?? '',
    endTime3: where.endTime3 ?? '',
    last: where.last ?? '0',
    deptTwoCode: where.deptTwoCode ?? '-1',
    DeptQuery: where.DeptQuery ?? '',
    field: sort.field ?? where.field ?? '',
    order: sort.order ?? where.order ?? '',
    page,
    size
  };
}

function postForm(path, fields) {
  return request.post(path, formdataify({ Token: token(), ...fields }));
}

export async function getLimitBuyV2List(where, page, size, sort) {
  const res = await postForm(
    '/ProdInfo/getPROD_REGISTRATION_LIMIT_BUYV2',
    buildListParams(where, page, size, sort)
  );
  return unwrap(res);
}

export async function getLimitDeptAll(where, page, size, sort) {
  const res = await postForm(
    '/ProdInfo/getPROD_REGISTRATION_LIMIT_DEPT_ALL',
    buildListParams(where, page, size, sort)
  );
  return unwrap(res);
}

export async function getVarLimitBuyXmClassV2() {
  const res = await postForm('/ProdInfo/GetVarLimitBuyXMClassV2', {});
  return unwrap(res);
}

export async function getLimitDelVar(id, page = 1, size = 20) {
  const res = await postForm('/ProdInfo/getLIMIT_DELVar', { ID: id, page, size });
  return unwrap(res);
}

export async function getLimitBuyDelV2(id, page = 1, size = 20) {
  const res = await postForm('/ProdInfo/getPROD_REGISTRATION_LIMIT_BUY_DELV2', { ID: id, page, size });
  return unwrap(res);
}

export async function getLimitDept(id, deptQuery = '', page = 1, size = 2000) {
  const res = await postForm('/ProdInfo/getPROD_REGISTRATION_LIMIT_DEPT', {
    ID: id,
    DeptQuery: deptQuery,
    page,
    size
  });
  return unwrap(res);
}

export async function getLimitDeptAddList(id, deptQuery = '', page = 1, size = 500) {
  const res = await postForm('/ProdInfo/getPROD_REGISTRATION_LIMIT_DEPT_ADD_LIST', {
    ID: id,
    DeptQuery: deptQuery,
    page,
    size
  });
  return unwrap(res);
}

export async function saveLimitDept(id, json) {
  const res = await postForm('/ProdInfo/savePROD_REGISTRATION_LIMIT_DEPT', {
    ID: id,
    JSON: typeof json === 'string' ? json : JSON.stringify(json)
  });
  return unwrap(res);
}

export async function addLimitDelVar(id, varietieCode) {
  const res = await postForm('/ProdInfo/AddLimitDelVar', {
    ID: id,
    VARIETIE_CODE: varietieCode
  });
  return unwrap(res);
}

export async function updateFraction(id, value, type) {
  const res = await postForm('/ProdInfo/updateFraction', { id, value, type });
  return unwrap(res);
}

export async function upVarIsDlTj(id, type) {
  const res = await postForm('/ProdInfo/upVarIsDlTj', { ID: id, type });
  return unwrap(res);
}

export async function upDlCount(id, type, count) {
  const res = await postForm('/ProdInfo/upDlCount', { ID: id, type, COUNT: count });
  return unwrap(res);
}

export async function upDlPrice(fields) {
  const res = await postForm('/ProdInfo/upDlPrice', fields);
  return unwrap(res);
}

export async function editSource(id, source) {
  const res = await postForm('/ProdInfo/editSource', { ID: id, SOURCE: source });
  return unwrap(res);
}

export async function addLimitBuy(fields) {
  const res = await postForm('/ProdInfo/PROD_REGISTRATION_LIMIT_BUY', {
    PROD_REGISTRATION_CODE: '',
    ...fields
  });
  return unwrap(res);
}

export async function exportLimitBuyV2Detail(ids) {
  const res = await postForm('/ProdInfo/exportPROD_REGISTRATION_LIMIT_BUYV2Detail', { ID: ids });
  return unwrap(res);
}

export async function exportJcInfo() {
  const res = await postForm('/ProdInfo/exportJcInfo', {});
  return unwrap(res);
}

export async function addDlVarWithXmbh(json) {
  const res = await postForm('/ProdInfo/AddDLVarWithXmbh', {
    JSON: typeof json === 'string' ? json : JSON.stringify(json)
  });
  return unwrap(res);
}

export async function impPrchaseData(file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('ImportDLData', file);
  const res = await request.post('/ProdInfo/ImpPrchaseData', fd);
  return unwrap(res);
}

export async function impLimitDelVar(file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('ImportDLVar', file);
  const res = await request.post('/ProdInfo/ImpLimitDelVar', fd);
  return unwrap(res);
}
