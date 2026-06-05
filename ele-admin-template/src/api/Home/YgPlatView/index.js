import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP, B2B_BASE_URL } from '@/config/setting';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function nickname() {
  return store.state.user?.info?.Nickname || sessionStorage.getItem('nickname') || '';
}

function buildQueryFields(where = {}) {
  return {
    VARIETIE_CODE_NEW: where.varietyCodeNew ?? '',
    VARIETIE_NAME: where.varietyName ?? '',
    SUPPLIER_NAME: where.supplierName ?? '',
    SOURCE_FROM: where.sourceFrom ?? '',
    MANUFACTURING_ENT_NAME: where.manufacturingEntName ?? '',
    APPROVAL_NUMBER: where.approvalNumber ?? '',
    MONTH: where.month ?? '',
    MONTH2: where.month2 ?? '',
    YGPT_CREATE_START: where.createStart ?? '',
    YGPT_CREATE_END: where.createEnd ?? '',
    YG_ORDER_ID: where.ygOrderId ?? '',
    IS_SEND: where.isSend ?? '',
    IS_ALL_FINISH: where.isAllFinish ?? ''
  };
}

function unwrapBody(res) {
  const body = res.data;
  if (body?.code == 301 || body === 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  return body;
}

function unwrapAction(res) {
  const body = unwrapBody(res);
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '操作失败');
}

/** 阳光平台发送查看列表 */
export async function getYgptSendView(where, page = 1, size = 100) {
  const res = await request.post(
    '/Importprite/GetYGPTSendView',
    formdataify({
      Token: token(),
      ...buildQueryFields(where),
      page,
      size
    })
  );
  const body = unwrapBody(res);
  if (body?.code == 200 || body?.code === '200') {
    return {
      total: body.total ?? 0,
      list: body.result || []
    };
  }
  throw new Error(body?.msg || '查询失败');
}

/** 导出用全量查询 */
export async function getYgptSendViewAll(where) {
  return getYgptSendView(where, 1, 9999999);
}

/** 重置阳光订单 */
export async function chongzhiYgSend(rows) {
  const json = JSON.stringify(
    (rows || []).map((row) => ({ YG_ORDER_ID: row.YG_ORDER_ID }))
  );
  const res = await request.post(
    '/Importprite/chongzhiYgSend',
    formdataify({ Token: token(), json })
  );
  return unwrapAction(res);
}

/** 重置异常订单 */
export async function chongzhiYgSendError(monthId) {
  const res = await request.post(
    '/Importprite/chongzhiYgSendError',
    formdataify({ Token: token(), monthId: monthId ?? '0', hp: HOME_HP }),
    { timeout: 500000 }
  );
  return unwrapAction(res);
}

/** 补发送 */
export async function createYgOrderMainMonthAllBfs(monthId) {
  const res = await request.post(
    '/Importprite/CreateYgOrderMainMonthAllBfs',
    formdataify({
      Token: token(),
      MONTH_ID: monthId ?? '0',
      hp: HOME_HP
    }),
    { timeout: 500000 }
  );
  return unwrapAction(res);
}

/** 发送勾选品种 */
export async function createYgOrderMainMonthAllBfsGx(monthId, ids) {
  const res = await request.post(
    '/Importprite/CreateYgOrderMainMonthAllBfsGx',
    formdataify({
      Token: token(),
      MONTH_ID: monthId ?? '0',
      hp: HOME_HP,
      ids: ids ?? ''
    }),
    { timeout: 500000 }
  );
  return unwrapAction(res);
}

/** 中七发送勾选品种 */
export async function createYgOrderMainMonthAllBfsGxZq(monthId, ids) {
  const res = await request.post(
    '/Commons/CreateYgOrderMainMonthAllBfsGx_ZQ',
    formdataify({
      Token: token(),
      MONTH_ID: monthId ?? '0',
      hp: HOME_HP,
      ids: ids ?? ''
    })
  );
  return unwrapAction(res);
}

/** 中七补发送（按截止日期） */
export async function zqInsertYgHrpTableMonth(date, monthId) {
  const res = await request.get('/Commons/zqInserYgHrpTableMonth', {
    params: { Token: token(), date, monthId }
  });
  const body = res.data || {};
  if (body.code == 200 || body.code === '200') {
    return body;
  }
  throw new Error(body.msg || '操作失败');
}

/** 回补 B2B 订单号 */
export async function b2bResendYgOrder(monthId, hospitalId) {
  const res = await request.get(`${B2B_BASE_URL}/api/MonthlyInvoic/getYgOrderMonthInfo`, {
    params: {
      Token: token(),
      MONTH_ID: monthId ?? '0',
      HOSPITAL_ID: hospitalId
    }
  });
  const body = res.data;
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || body || '操作失败');
}

/** 中七获取回传订单 */
export async function getZqYgHrpTableOrder() {
  const res = await request.get('/Commons/GetZqYgHrpTableOrder', {
    params: { Token: token() }
  });
  return unwrapAction(res);
}

/** 回填订单号 */
export async function hbYgOrder(rows, ygOrderId, ygOrderDetailId) {
  const res = await request.post(
    '/Importprite/hbYgOrder',
    formdataify({
      Token: token(),
      ygOrderId: ygOrderId ?? '',
      ygOrderDetailId: ygOrderDetailId ?? '',
      json: JSON.stringify(rows || [])
    }),
    { timeout: 500000 }
  );
  return unwrapAction(res);
}

/** 导入回填订单表 */
export async function importHbYgOrder(file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('nickName', nickname());
  fd.append('FILE', file);
  const res = await request.post('/Importprite/importHbYgOrder', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  const body = unwrapBody(res);
  if (body?.code == 301) {
    throw new Error(body?.msg || '登录失效');
  }
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '导入失败');
}
