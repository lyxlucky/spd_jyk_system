import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { EncryptWithCustomKey, getAesKey } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function ensureAesKey() {
  let key = sessionStorage.getItem('AesKey') || localStorage.getItem('AesKey');
  if (!key) {
    key = getAesKey();
    localStorage.setItem('AesKey', key);
  }
  return key;
}

function postEncrypted(path, pramsObj, page, size) {
  const key = ensureAesKey();
  const pramsStr = EncryptWithCustomKey(
    JSON.stringify({ ...pramsObj, Token: token() }),
    key
  );
  const body = new URLSearchParams();
  body.append('prams', pramsStr);
  body.append('AesKey', key);
  body.append('page', String(page));
  body.append('size', String(size));
  return request.post(path, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

function unwrapPaged(res) {
  const body = res.data;
  if (body?.code == 301 || body === 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  if (body?.code == 200 || body?.code === '200') {
    return {
      total: body.total ?? 0,
      list: body.result || []
    };
  }
  throw new Error(body?.msg || '操作失败');
}

/** 阳光平台收货主列表 */
export async function getYgReceiveGoodList(ygOrderId, page = 1, size = 100) {
  const res = await postEncrypted(
    '/YGReceiveGoods/GetYGReceiveGoodList',
    { YG_ORDER_ID: ygOrderId ?? '' },
    page,
    size
  );
  return unwrapPaged(res);
}

/** 分发单明细 */
export async function getYgDistributeInfo(ygOrderDetailId, page = 1, size = 10) {
  const res = await postEncrypted(
    '/YGReceiveGoods/GetYGDistributeINFO',
    { YG_ORDER_DETAIL_ID: ygOrderDetailId ?? '' },
    page,
    size
  );
  return unwrapPaged(res);
}

/** 阳光明细 */
export async function getYgOrderDetail(ygOrderDetailId, page = 1, size = 10) {
  const res = await postEncrypted(
    '/YGReceiveGoods/GetYG_ORDER_DETAIL',
    { YG_ORDER_DETAIL_ID: ygOrderDetailId ?? '' },
    page,
    size
  );
  return unwrapPaged(res);
}
