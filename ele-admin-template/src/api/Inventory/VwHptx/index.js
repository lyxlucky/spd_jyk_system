import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
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

/** 后端 Int32.Parse(Form["page"/"size"])，必须传合法数字字符串 */
function normPage(page) {
  const n = parseInt(page, 10);
  return String(n > 0 ? n : 1);
}

function normSize(size) {
  const n = parseInt(size, 10);
  return String(n > 0 ? n : 20);
}

/**
 * 与旧 layui 一致：application/x-www-form-urlencoded（非 multipart）
 * 避免 Form 集合读不到字段导致 page/size 为空引发 500
 */
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

/** 与旧 VwHptx.cshtml getVW_HPTX 请求参数一致 */
export function buildVwHptxParams(where = {}, page = 1, size = 20) {
  return {
    Token: token(),
    page: normPage(page),
    size: normSize(size),
    VARIETIE_NAME: where.VARIETIE_NAME || '',
    SPECIFICATION_OR_TYPE: where.SPECIFICATION_OR_TYPE || '',
    SUPPLIER_NAME: where.SUPPLIER_NAME || '',
    APPROVAL_NUMBER: where.APPROVAL_NUMBER || '',
    MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME || '',
    BATCH: where.BATCH || '',
    start: where.start || '',
    end: where.end || '',
    HPTX_MONTH: where.HPTX_MONTH || '',
    RkOrder: where.RkOrder || '',
    ORDER_JS_TYPE: where.ORDER_JS_TYPE || '',
    FP_QS_STATE: where.FP_QS_STATE || ''
  };
}

export async function getVwHptx(where, page, size) {
  const res = await postForm('/InStockCheck/getVW_HPTX', buildVwHptxParams(where, page, size));
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function upBatchFpQsState(batchId, state, rowDataJson) {
  const res = await request.post(
    '/InStockCheck/upBatchFP_QS_STATE',
    formdataify({
      Token: token(),
      batchId,
      BatchFP_QS_STATE: state,
      rowDataJson: JSON.stringify(rowDataJson)
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

export async function upBatchMonth(batchId, hptxMonth, rowDataJson) {
  const res = await request.post(
    '/InStockCheck/upBatchMonth',
    formdataify({
      Token: token(),
      batchId,
      HPTX_MONTH: hptxMonth,
      rowDataJson: JSON.stringify(rowDataJson)
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

export async function upBatchOrderJsType(batchId, orderJsType) {
  const res = await request.post(
    '/InStockCheck/upBatchOrderJsType',
    formdataify({
      Token: token(),
      batchId,
      ORDER_JS_TYPE: orderJsType
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

export async function delInStockCheck(batchIds) {
  const res = await request.post(
    '/InStockCheck/DelInStockCheck',
    formdataify({ Token: token(), ID: batchIds })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '删除失败');
}

export async function excelVwHptxCollect() {
  const res = await request.post(
    '/InStockCheck/ExcelVwHptxCollect',
    formdataify({ Token: token() })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '导出失败');
}

export async function excelConsumpData(where, page = 1, size = 999999) {
  const res = await postForm('/InStockCheck/ExcelConsumpData', buildVwHptxParams(where, page, size));
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '导出失败');
}

export { commitNydReceiptAndInvoice } from '@/api/Inventory/CentreBankTakeGoods';
