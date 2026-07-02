export { getYbClInfo } from '@/api/Home/YgVarClSm';

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

/** 华南发送 HIS — POST /Abdzczh/SendVarDataIdSZHN */
export async function sendVarDataIdSZHN(rows) {
  const json = JSON.stringify((rows || []).map((r) => ({ ID: r.ID })));
  const res = await request.post(
    '/Abdzczh/SendVarDataIdSZHN',
    formdataify({ Token: token(), json }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 北大同步计费编码 — POST /AAPDDATE/beiDaHbHisCode */
export async function beiDaHbHisCode() {
  const res = await request.post(
    '/AAPDDATE/beiDaHbHisCode',
    formdataify({ Token: token() }),
    { timeout: 600000 }
  );
  return unwrap(res);
}
