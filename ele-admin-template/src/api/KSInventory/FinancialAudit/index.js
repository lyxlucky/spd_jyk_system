import request from '@/utils/request';
import store from '@/store';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

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

/** 构建 FinanceAudit 查询参数（与旧 KSConsumeQueryTemp / FinancialAudit.cshtml 一致） */
export function buildFinanceAuditParams(where = {}, page = 1, size = 50, sort = {}) {
  return {
    Token: token(),
    page,
    size,
    spStartDate: where.spStartDate || '',
    spEndDate: where.spEndDate || '',
    Supplier: where.Supplier ?? '',
    Monthbillnum: where.Monthbillnum || '',
    StartDate: where.StartDate || '',
    EndDate: where.EndDate || '',
    State: where.State ?? '-1',
    isHptx: where.isHptx || '',
    isYG: where.isYG || '',
    isDL: where.isDL || '',
    highOrLowClass: where.highOrLowClass ?? '-1',
    SaleNum: where.SaleNum || '',
    VarietieCode: where.VarietieCode || '',
    hp: HOME_HP,
    field: sort.field || '',
    order: sort.order || '',
    isFPQS: where.isFPQS || '',
    SEND_WXT_MARK: where.SEND_WXT_MARK || '',
    isSendWxt: where.isSendWxt ?? '-1',
    orderJsType: where.orderJsType || ''
  };
}

export async function financeAudit(where, page, size, sort) {
  const res = await request.get('/HrpMonthly/FinanceAudit', {
    params: buildFinanceAuditParams(where, page, size, sort)
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function getFinanceAuditByItem(monthBillNum, page = 1, size = 99999) {
  const res = await request.get('/HrpMonthly/getFinanceAuditByItem', {
    params: { Token: token(), id: monthBillNum, page, size }
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function suerFPQS(rows) {
  const payload = rows.map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/HrpMonthly/SuerFPQS',
    formdataify({ Token: token(), json: JSON.stringify(payload) })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '签收失败');
}

export async function cancelFPQS(rows) {
  const payload = rows.map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/HrpMonthly/CencelFPQS',
    formdataify({ Token: token(), json: JSON.stringify(payload), nickname: nickname() })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '取消签收失败');
}

export async function suerAudit(rows) {
  const payload = rows.map((r) => `${r.ID},${nickname()}`);
  const res = await request.post(
    '/HrpMonthly/SuerAudit',
    formdataify({ Token: token(), json: JSON.stringify(payload) })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '审批失败');
}

export async function suerAuditNo(rows) {
  const payload = rows.map((r) => `${r.ID},${nickname()}`);
  const res = await request.post(
    '/HrpMonthly/SuerAuditNo',
    formdataify({ Token: token(), json: JSON.stringify(payload) })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '取消审批失败');
}

export async function cancelFinaceAudit(rows) {
  const payload = rows.map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/HrpMonthly/cancelFinaceAudit',
    formdataify({ Token: token(), json: JSON.stringify(payload) })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '取消发票失败');
}

export async function syncYGOrder() {
  const res = await request.post('/HrpMonthly/SyncYGOrder', formdataify({ Token: token() }));
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '同步失败');
}

export async function sendInvoiceToHop(invoiceNum) {
  const res = await request.post(
    '/PekingApplication/SendInvoiceToHop',
    formdataify({ Token: token(), InvoiceNum: invoiceNum })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '发送失败');
}

/** GET 导出：返回文件名，拼 BACK_BASE_URL/Excel/files/ */
export async function excelExport(path, where, sort = {}) {
  const res = await request.get(`/HrpMonthly/${path}`, {
    params: buildFinanceAuditParams(where, 1, 999999999, sort)
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data.msg;
  throw new Error(res.data?.msg || '导出失败');
}
