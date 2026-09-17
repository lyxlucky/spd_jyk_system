import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

function unwrap(res) {
  const body = res?.data;
  check301(body);
  if (okCode(body?.code)) return body;
  throw new Error(body?.msg || '请求失败');
}

/** 分类属性下拉（对齐旧页 GetClassificProp） */
export async function GetClassificProp() {
  const res = await request.get('/VarietieBasicInfo/GetClassificProp', {
    params: { Token: token() }
  });
  return unwrap(res);
}

/** 主表查询 */
export async function SearchMonthDetailSubmit(params = {}) {
  const res = await request.post('/MonthClearingSubmitV2/SearchMonthDetailSubmit', {
    Token: token(),
    ...params
  }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
  return unwrap(res);
}

/** 导出 Excel（blob） */
export async function ExportMonthDetailSubmit(params = {}) {
  return request.post(
    '/MonthClearingSubmitV2/ExportMonthDetailSubmit',
    { Token: token(), ...params },
    {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      responseType: 'blob',
      timeout: 300000
    }
  );
}

/** 日清确认审核（勾选） */
export async function ApproveDayClearingSubmit(ids = []) {
  const res = await request.post('/MonthClearingSubmitV2/ApproveDayClearingSubmit', {
    Token: token(),
    IDS: ids
  }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
  return unwrap(res);
}

/** 批量日清确认审核（按当前查询条件） */
export async function ApproveDayClearingSubmitByQuery(params = {}) {
  const res = await request.post('/MonthClearingSubmitV2/ApproveDayClearingSubmitByQuery', {
    Token: token(),
    ...params
  }, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
  return unwrap(res);
}

/** 批量上传附件 */
export async function SaveMonthDetailAttachment({ ids = [], remark = '', file }) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('IDS', JSON.stringify(ids));
  fd.append('SZSE_FJ_MARK', remark || '');
  fd.append('file', file);
  const res = await request.post('/MonthClearingSubmitV2/SaveMonthDetailAttachment', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  return unwrap(res);
}
