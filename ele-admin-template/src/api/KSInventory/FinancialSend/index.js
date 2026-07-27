import request from '@/utils/request';
import store from '@/store';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function nickname() {
  return store.state.user?.info?.Nickname || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

/**
 * 华南发票发送列表
 * 对接老接口：GET Abdzczh/CheckFpIndo
 */
export async function checkFpIndo(where = {}, page = 1, size = 50) {
  const res = await request.get('/Abdzczh/CheckFpIndo', {
    params: {
      Token: token(),
      search: where.search || '',
      startTime: where.startTime || '',
      endTime: where.endTime || '',
      Is_send: where.Is_send ?? '',
      page: page || 1,
      size: size || 50
    }
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

/**
 * 批量发送发票（仅推送OES，不再自动审批）
 * 对接老接口：POST Abdzczh/SendOesFP_GX
 * 超时与老系统一致：500000ms
 */
export async function sendOesFpGx(rows) {
  const payload = (rows || []).map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/Abdzczh/SendOesFP_GX',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      men: nickname()
    }),
    { timeout: 500000 }
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '发送失败');
}

/**
 * 华南发票审批（与发送拆分）
 * POST Abdzczh/ApproveSzhnFp
 */
export async function approveSzhnFp(rows) {
  const payload = (rows || []).map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/Abdzczh/ApproveSzhnFp',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      men: nickname()
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '审批失败');
}
