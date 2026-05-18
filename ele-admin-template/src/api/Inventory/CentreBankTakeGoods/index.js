import request from '@/utils/request';
import store from '@/store';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, B2B_BASE_URL, HOME_HP } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
}

function nickname() {
  return store.state.user?.info?.Nickname || sessionStorage.getItem('nickname') || '';
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
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

/** 与旧 MVC $.post 一致：x-www-form-urlencoded，供 WebApi 绑定 BaseParam 等复杂参数 */
function postUrlEncoded(path, fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([k, v]) => {
    body.append(k, v == null ? '' : String(v));
  });
  return request.post(path, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/** 库区列表（人工收货下拉） */
export async function getStorageList() {
  const res = await request.get('/Commons/getSTORAGE');
  if (okCode(res.data?.code)) return res.data.result || [];
  return [];
}

/** 库区列表（系统收货，需 Token） */
export async function getStorageWithToken() {
  const res = await postUrlEncoded('/Commons/GetStorageWithToken', { Token: token() });
  return unwrap(res).result || [];
}

// —— 人工收货 ——
export async function searchManualReceipts(params) {
  const res = await request.get('/ManualDelivered/SearchManualDeliveredReceipts', {
    params: {
      Token: token(),
      condition: params.condition || '',
      statu: params.statu ?? '',
      timeStart: params.timeStart || '',
      timeEnd: params.timeEnd || '',
      page: params.page || 1,
      size: params.size || 999
    }
  });
  return unwrap(res);
}

export async function getManualReceiptExtend(receiptId) {
  const res = await request.get('/ManualDelivered/GetManualDeliveredReceiptExtend', {
    params: { Token: token(), receiptId }
  });
  return unwrap(res);
}

export async function getManualDeliveredVarieties(receiptId, page = 1, size = 9999) {
  const res = await request.get('/ManualDelivered/GetManualDeliveredVarietiets', {
    params: { Token: token(), receiptId, page, size }
  });
  return unwrap(res);
}

export async function searchManualVarieties(condition, page = 1, size = 50) {
  const q = condition && String(condition).trim() ? condition : 'ZHOUGONGNUIBI';
  const res = await request.get('/ManualDelivered/SearchManualVarieties', {
    params: { Token: token(), condition: q, page, size }
  });
  return unwrap(res);
}

export async function createManualReceipt({ receiveProperty = '0', storageId, noteDescription = '' }) {
  const res = await request.post(
    '/ManualDelivered/CreateManualDeliveredReceipt',
    formdataify({
      Token: token(),
      receiveProperty,
      storageId: storageId || '',
      staff: nickname(),
      noteDescription
    })
  );
  return unwrap(res);
}

export async function addManualVarieties(receiptId, json) {
  const res = await request.post(
    '/ManualDelivered/AddManualDeliveredVarieites',
    formdataify({ Token: token(), receiptId, json })
  );
  return unwrap(res);
}

export async function saveManualVarieties(json) {
  const res = await request.post(
    '/ManualDelivered/SaveDeliveredVarieties',
    formdataify({ Token: token(), json })
  );
  return unwrap(res);
}

export async function deleteManualVarieties(json) {
  const res = await request.post(
    '/ManualDelivered/DeleteDeliveredVarieties',
    formdataify({ Token: token(), json })
  );
  return res.data === true || unwrap(res);
}

export async function checkVarietieBatch(receiptId) {
  const res = await request.post(
    '/ManualDelivered/CheckVarietieBatch',
    formdataify({ Token: token(), receiptId })
  );
  return unwrap(res);
}

export async function confirmManualReceipt(receiptId) {
  const res = await request.post(
    '/ManualDelivered/ConfirmManualDeliveredReceipt',
    formdataify({ Token: token(), receiptId, staff: nickname() })
  );
  return unwrap(res);
}

export async function deleteEmptyManualDelivery(deliveryNumber) {
  const res = await request.post(
    '/ManualDelivered/DeleteEmptyDelivery',
    formdataify({ Token: token(), deliveryNumber, operatePerson: nickname() })
  );
  return unwrap(res);
}

export async function checkExpireProdInfo(expJson) {
  const res = await request.post(
    '/ManualDelivered/CheckExpireProdInfo',
    formdataify({ Token: token(), expJson })
  );
  return unwrap(res);
}

export async function searchDeliveryHistory(params) {
  const res = await request.post(
    '/SystemDelivered/SearchDeliveryHistory',
    formdataify({
      Token: token(),
      deliveryNoteNumber: params.deliveryNoteNumber || '',
      varietie: params.varietie || '',
      specType: params.specType || '',
      batch: params.batch || '',
      supplierName: params.supplierName || '',
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      page: params.page || 1,
      size: params.size || 50
    })
  );
  return unwrap(res);
}

export function getManualPrintApiPath() {
  if (['stzx', 'stse', 'csyy', 'stzl', 'stzyyy', 'chrmyy'].includes(HOME_HP)) {
    return 'SystemDelivered/CreateSystemExcel_XG';
  }
  return 'ManualDelivered/CreateTakeExcel';
}

export function getSystemPrintApiPath() {
  if (HOME_HP === 'bdrm') return 'SystemDelivered/CreateSystemExcel_BDRM';
  if (['stzx', 'stse', 'csyy', 'stzl', 'stzyyy', 'chrmyy'].includes(HOME_HP)) {
    return 'SystemDelivered/CreateSystemExcel_XG';
  }
  return 'SystemDelivered/CreateSystemExcel';
}

export async function getSystemReceiptExtend(receiptId) {
  const res = await request.get('/SystemDelivered/GetSystemDeliveredVarietietExtend', {
    params: { Token: token(), receiptId }
  });
  return unwrap(res);
}

export async function printReceiptExcel(path, params) {
  const res = await request.get(`/${path}`, {
    params: { Token: token(), homehp: HOME_HP, page: 1, size: 99999, ...params }
  });
  return unwrap(res);
}

// —— 系统收货 ——
export async function searchSystemReceipts(params) {
  const res = await request.get('/SystemDelivered/SearchSystemDeliveredReceipts', {
    params: {
      Token: token(),
      condition: params.condition || '',
      statu: params.statu ?? '',
      storageId: params.storageId || '',
      page: params.page || 1,
      size: params.size || 100
    }
  });
  return unwrap(res);
}

export async function searchSystemVarieties(receiptId, condition, page = 1, size = 300) {
  const res = await request.get('/SystemDelivered/SearchSystemDeliveredVarietiets', {
    params: {
      Token: token(),
      receiptId,
      condition: condition || '',
      page,
      size
    }
  });
  return unwrap(res);
}

export async function autoSaveNetreceipts(receiptId) {
  const res = await request.post(
    '/SystemDelivered/AutoSaveNetreceipts',
    formdataify({ Token: token(), receiptId })
  );
  return unwrap(res);
}

export async function commitVarietieNetreceipts(json) {
  const res = await request.post(
    '/SystemDelivered/CommitVarietieNetreceipts',
    formdataify({ Token: token(), json })
  );
  return unwrap(res);
}

export async function confirmSystemReceipt(receiptId) {
  const res = await request.post(
    '/SystemDelivered/ConfirmSystemDeliveredReceipt',
    formdataify({ Token: token(), receiptId, staff: nickname() })
  );
  return unwrap(res);
}

export async function confirmSystemReceiptAndSend(receiptId, type = 0) {
  const res = await request.post(
    '/SystemDelivered/ConfirmSystemDeliveredReceiptAndSend',
    formdataify({ Token: token(), receiptId, staff: nickname(), type })
  );
  return unwrap(res);
}

export async function deleteEmptySystemReceipt(receiptId) {
  const res = await request.post(
    '/SystemDelivered/DeleteEmptySystemDelivered',
    formdataify({ Token: token(), receiptId })
  );
  return unwrap(res);
}

/** 待收货详情 */
export async function getSystemDeliveredVarieties2(params = {}) {
  const res = await postUrlEncoded('/SystemDelivered/GetSystemDeliveredVarietiets2', {
    Token: token(),
    page: params.page || 1,
    size: params.size || 10,
    Delivery_Note_Number: params.deliveryNoteNumber || '',
    Varietie_Code_New: params.varietieCode || ''
  });
  return unwrap(res);
}

export async function getVarietieBatchDate(varietieCode, batch) {
  const res = await request.get('/ManualDelivered/GetVarietieBatchDate', {
    params: { Token: token(), varietieCode, batch }
  });
  return unwrap(res);
}

export async function saveDeliveredBz(json, bz) {
  const res = await request.post(
    '/ManualDelivered/SaveDeliveredBz',
    formdataify({ Token: token(), json, BZ: bz })
  );
  return unwrap(res);
}

export async function upVarOrderType(json, orderType) {
  const res = await request.post(
    '/ManualDelivered/UpVar_OrderType',
    formdataify({ Token: token(), json, orderType })
  );
  return unwrap(res);
}

export async function upVarJcType(json, jcType) {
  const res = await request.post(
    '/Abdzczh/UpVar_JcType',
    formdataify({ Token: token(), json, jcType })
  );
  return unwrap(res);
}

export async function addSysDetailFp(json, fp) {
  const res = await request.post(
    '/SystemDelivered/AddSysDetailFp',
    formdataify({ Token: token(), json, fp })
  );
  return unwrap(res);
}

export async function upShPriceCommit(detailId, price) {
  const res = await request.post(
    '/SystemDelivered/UpShPriceCommit',
    formdataify({ Token: token(), sysGetDelId: detailId, sysGetDelPrice: price })
  );
  return unwrap(res);
}

export async function upFundsSource(postData, fundsSource) {
  const res = await request.post(
    '/SystemDelivered/UpFundsSource',
    formdataify({ Token: token(), postData, FUNDS_SOURCE: fundsSource })
  );
  return unwrap(res);
}

export async function upVarTypeSource(postData, varType) {
  const res = await request.post(
    '/SystemDelivered/UpVARTYPESource',
    formdataify({ Token: token(), postData, VAR_TYPE: varType })
  );
  return unwrap(res);
}

export async function upGoodTemp(postData, temperature) {
  const res = await request.post(
    '/SystemDelivered/UpGood_Temp',
    formdataify({ Token: token(), postData, TEMPERATURE: temperature })
  );
  return unwrap(res);
}

export async function getStorageTwoInfo() {
  const res = await request.get('/SystemDelivered/getStorageTwoInfo', {
    params: { Token: token() }
  });
  return unwrap(res);
}

export async function upStorageTwo(postData, storageTwoId) {
  const res = await request.post(
    '/SystemDelivered/UpSTORAGE_TWO',
    formdataify({ Token: token(), postData, STORAGE_TWO_ID: storageTwoId })
  );
  return unwrap(res);
}

export async function initPPContract(payload) {
  const data =
    typeof payload === 'string'
      ? payload
      : JSON.stringify({
          DeliveryNoteNumber: payload.deliveryNoteNumber,
          DetailIds: payload.detailIds || []
        });
  const res = await request.post(
    '/SystemDelivered/InitPPContract',
    formdataify({ Token: token(), data })
  );
  return unwrap(res);
}

export async function rebackDeliveryNumber(number) {
  const res = await request.post(
    '/PekingApplication/rebackDeliveryNumber',
    formdataify({ Token: token(), b2bUrl: B2B_BASE_URL, number })
  );
  return unwrap(res);
}

export async function updateVarSku(batchId, skuId, deliveryNoteNumber) {
  const res = await request.post(
    '/SystemDelivered/updateVarSku',
    formdataify({
      Token: token(),
      id: batchId,
      skuId: skuId || '',
      number: deliveryNoteNumber || ''
    })
  );
  return unwrap(res);
}

export async function updateVarQualified(batchId, isQualified, deliveryNoteNumber) {
  const res = await request.post(
    '/SystemDelivered/updateVarQualified',
    formdataify({
      Token: token(),
      id: batchId,
      isQualified: isQualified ?? '1',
      number: deliveryNoteNumber || ''
    })
  );
  return unwrap(res);
}

export async function newAddDeliveredVarietiets(deliveryNoteNumber, batchId) {
  const res = await request.post(
    '/SystemDelivered/newAddDeliveredVarietiets',
    formdataify({ Token: token(), deliveryNoteNumber, id: batchId })
  );
  return unwrap(res);
}

export async function commitNydReceiptAndInvoice(formData) {
  const res = await request.post('/SystemDelivered/CommitNydReceiptAndInvoice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

export async function checkExpireProdInfoSystem(receiptId) {
  const res = await request.post(
    '/SystemDelivered/CheckExpireProdInfo',
    formdataify({ Token: token(), receiptId })
  );
  return unwrap(res);
}

export async function printHistoryDelivery(params) {
  const res = await request.get('/SystemDelivered/PreprintHistoryDelivery', {
    params: { Token: token(), homehp: HOME_HP, ...params }
  });
  return unwrap(res);
}

export async function printSystemExcel(path, params) {
  return printReceiptExcel(path, params);
}

/** B2B 拉取收货单 */
export async function fetchB2bOrder(sendOrderNum, b2bJson) {
  const b2bRes = await request.get(`${B2B_BASE_URL}/api/Stock/sendPlanToSpdByAdmin2`, {
    params: { SEND_ORDER_NUM: sendOrderNum, STOCK_UP_PLAN_NO: '1' }
  });
  const jsonStr = JSON.stringify(b2bRes.data);
  const res = await request.post(
    '/B2BNormal/getb2bOrderInfo',
    formdataify({ Token: token(), SEND_ORDER_NUM: sendOrderNum, JSON: jsonStr })
  );
  return unwrap(res);
}

/** 人工收货批次检验报告图片 */
export async function uploadManualProPic(mainid, file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('mainid', String(mainid));
  const res = await request.post(`/ManualDelivered/UploadProPic?Token=${encodeURIComponent(token())}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** 系统收货批次检验报告图片 */
export async function uploadSystemProPic(mainid, file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('mainid', String(mainid));
  const res = await request.post(`/SystemDelivered/UploadProPic?Token=${encodeURIComponent(token())}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** UDI 扫码解析 */
export async function getInfoByScanUdi(udi) {
  const res = await request.post(
    '/B2BConsumeMgmt/getInfoByscanUdi',
    formdataify({ Token: token(), UDI: udi })
  );
  return unwrap(res);
}

/** 收货添加 UDI */
export async function addShUdi(payload) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/addSH_UDI',
    formdataify({
      Token: token(),
      SERIAL_NUMBER: payload.serialNumber,
      SERIAL_NUMBER2: payload.serialNumber2 || payload.serialNumber,
      BATCH_ID: payload.batchId,
      QTY: payload.qty,
      CREATE_MAN: nickname(),
      RECEIVABLE: payload.receivable ?? 0
    })
  );
  return unwrap(res);
}

/** 系统收货单转人工收货单 */
export async function transferToManual(payload) {
  const res = await request.post(
    '/SystemDelivered/TransferToManual',
    formdataify({
      Token: token(),
      receiveProperty: payload.receiveProperty,
      storageId: payload.storageId,
      noteDescription: payload.noteDescription || '',
      deliveryId: payload.deliveryId,
      deliveryNoteNumber: payload.deliveryNoteNumber,
      prepareGoodsPlanNumber: payload.prepareGoodsPlanNumber || '',
      staff: nickname(),
      dtlIdJson: JSON.stringify(payload.dtlIds || [])
    })
  );
  return unwrap(res);
}

/** B2B 同步订单收货状态 */
export async function syncB2bOrderReceive(deliveryNoteNumber) {
  await request.get(`${B2B_BASE_URL}/api/Stock/upOrderReceive`, {
    params: { Delivery_Note_Number: deliveryNoteNumber }
  });
}
