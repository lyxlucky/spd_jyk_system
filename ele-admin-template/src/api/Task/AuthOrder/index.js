import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, B2B_BASE_URL, HOME_HP } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

/** 自助订单主单 */
export async function getAuthOrderMain(params) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/getAuthOrderMain',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: params.deliveryNoteNumber || '',
      orderState: params.orderState ?? '',
      page: params.page || 1,
      size: params.size || 30
    })
  );
  return unwrap(res);
}

/** 订单明细（后端一次返回全部，无分页） */
export async function getAuthOrderDel(deliveryNoteNumber) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/getAuthOrderDel',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber || ''
    })
  );
  return unwrap(res);
}

/** 定数码列表（后端一次返回全部，无分页） */
export async function getAuthOrderDef(deliveryNoteNumber, b2bDelId) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/getAuthOrderDef',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber || '',
      B2B_DEL_ID: b2bDelId || ''
    })
  );
  return unwrap(res);
}

/** 拒收定数码 */
export async function jsOrderDef(jsonList) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/jsOrderDef',
    formdataify({ Token: token(), json: JSON.stringify(jsonList) })
  );
  return unwrap(res);
}

/** 确认收货 */
export async function authOrderReceipt(deliveryNoteNumber, receiptId) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/authOrderReceipt',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId
    })
  );
  return unwrap(res);
}

/** 收货结算 */
export async function authOrderReceiptToUse(deliveryNoteNumber, receiptId, deptTwoCode) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/authOrderReceiptToUse',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId,
      deptTwoCode
    })
  );
  return unwrap(res);
}

/** 收货至出库 */
export async function authOrderReceiptToSend(deliveryNoteNumber, receiptId, deptTwoCode) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/authOrderReceiptToSend',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId,
      deptTwoCode
    })
  );
  return unwrap(res);
}

/** 回补出库单（结算后） */
export async function authOrderReceiptToDept(deliveryNoteNumber, receiptId, deptTwoCode) {
  const res = await request.post(
    '/B2BVarietieConsumeApprove/authOrderReceiptToDept',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId,
      deptTwoCode
    })
  );
  return unwrap(res);
}

/** B2B 补单（出库后） */
export async function b2bAuthOrderReceiptToSend(deliveryNoteNumber, receiptId, deptTwoCode) {
  const res = await request.post(
    '/B2BVarietieConsumeApprove/authOrderReceiptToSend',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId,
      deptTwoCode
    })
  );
  return unwrap(res);
}

/** 转为普通收货 */
export async function authOrderReplace(deliveryNoteNumber, receiptId) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/authOrderReplace',
    formdataify({
      Token: token(),
      DELIVERY_NOTE_NUMBER: deliveryNoteNumber,
      receiptId
    })
  );
  return unwrap(res);
}

/** 编辑批次信息 */
export async function updateInfoById(batchId, field) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/updateInfoById',
    formdataify({
      Token: token(),
      ID: batchId,
      JSON: JSON.stringify({
        batch: field.batch,
        productDate: field.productDate,
        validDate: field.validDate,
        mjBatch: field.mjBatch,
        supplierPrice: field.supplierPrice,
        purchasePrice: field.purchasePrice
      })
    })
  );
  return unwrap(res);
}

/** 打印收货单 */
export async function printAuthOrderReceipt(params) {
  const title = HOME_HP === 'stzx' ? 'PreprintHistoryDelivery_stzx' : 'PreprintHistoryDelivery';
  const res = await request.post(`/SystemDelivered/${title}`, formdataify({
    Token: token(),
    deliveryNoteNumber: params.deliveryNoteNumber,
    Delivery_Time: params.deliveryTime,
    homehp: HOME_HP,
    Receipt_Id: params.receiptId,
    CentreBankSIZE: params.size || 4
  }));
  return unwrap(res);
}

/** B2B 同步收货状态 */
export async function syncB2bOrderReceive(deliveryNoteNumber) {
  await request.get(`${B2B_BASE_URL}/api/Stock/upOrderReceive`, {
    params: { Delivery_Note_Number: deliveryNoteNumber }
  });
}

/** 二级科室选择（替代 Frame/Sel_deptTwo） */
export async function searchDeptTwoWithName(deptTwoName, page = 1, size = 20) {
  const res = await request.get('/DeptTwoBasicInfo/SearchDeptTwoWithName', {
    params: {
      Token: token(),
      deptTwoName: deptTwoName || '-1',
      deptOneCode: '',
      page,
      size
    }
  });
  return unwrap(res);
}
