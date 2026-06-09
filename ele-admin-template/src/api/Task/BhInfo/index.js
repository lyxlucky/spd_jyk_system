import request from '@/utils/request';
import { formdataify, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Encrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

export function unwrapRes(res) {
  const data = res?.data;
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}

/** 院区下拉 */
export function getStorageList() {
  return request.post('/Commons/GetStorageWithToken', toUrlEncodedBody({ Token: token() }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/** 品种备货分析主列表 */
export async function getBhInfoList(where, page, size) {
  const res = await request.get('/AAPDDATE/Getbhck', {
    params: {
      Token: token(),
      VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW ?? '',
      DIY_STORAGE: where.DIY_STORAGE ?? '',
      VARIETIE_NAME: where.VARIETIE_NAME ?? '',
      SUPPLIER_NAME: where.SUPPLIER_NAME ?? '',
      APPROVAL_NUMBER: where.APPROVAL_NUMBER ?? '',
      MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME ?? '',
      BHFX_REMARKS: where.BHFX_REMARKS ?? '',
      IS_CG_BH: where.IS_CG_BH ?? '',
      limetPrsen: where.limetPrsen ?? '',
      STORAGE_ID: where.STORAGE_ID ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 301) {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  if (data.code == 400 || data.code === '400') {
    return { total: 0, result: [], msg: data.msg };
  }
  throw new Error(data.msg || '查询失败');
}

/** 设为/取消常备 */
export async function setCb(rows, type, storageId) {
  const res = await request.post(
    '/AAPDDATE/setCb',
    formdataify({
      Token: token(),
      json: JSON.stringify(rows || []),
      type: String(type),
      STORAGE_ID: storageId ?? ''
    }),
    { timeout: 500000 }
  );
  return unwrapRes(res);
}

/** 更新品种备注 */
export async function updateBhInfoRemark(id, remarks, storageId) {
  const res = await request.post(
    '/AAPDDATE/UpdateBhInfoBZ',
    formdataify({
      Token: token(),
      ID: id,
      BHFX_REMARKS: remarks ?? '',
      STORAGE_ID: storageId ?? ''
    })
  );
  return unwrapRes(res);
}

/** 修改库存上下限 */
export async function upVarCdesz(id, lower, upper, storageId) {
  const res = await request.post(
    '/AAPDDATE/UpVarCdesz',
    formdataify({
      Token: token(),
      JSON: JSON.stringify([{ ID: id }]),
      LOWER: lower,
      UPPPER: upper,
      STORAGE_ID: storageId ?? ''
    })
  );
  return unwrapRes(res);
}

/** 生成备货 - 弹窗数据 */
export async function getMonitorPopup(items) {
  const res = await request.post(
    '/CentralWarehouseMonitor/GetMonitorPopup',
    formdataify({
      Token: token(),
      json: JSON.stringify(items || [])
    })
  );
  const data = res.data;
  if (data.code == 301) {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  return data;
}

/** 生成备货 - 提交 */
export async function insertNewInfo(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseMonitor/InsertNewInfo',
    formdataify({
      Token: token(),
      json: jsonStr
    }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

/** 修改库房 */
export async function upVarWarehouse(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseMonitor/UpVarWarehouse',
    formdataify({
      Token: token(),
      json: jsonStr
    })
  );
  return res.data;
}

/** 备货单列表 */
export async function getPickingList(where, page, size) {
  const formatData = {
    Token: token(),
    VarietieCode: where.VarietieCode ?? '',
    BHDate: where.BHDate ?? '',
    SenState: where.SenState ?? '-1',
    PlanNum: where.PlanNum ?? '',
    STORAGE_ID: where.STORAGE_ID ?? ''
  };
  const res = await request.post(
    '/CentralWarehouseMonitor/GetPickingList',
    formdataify({
      prams: Encrypt(JSON.stringify(formatData)),
      AesKey: store.state.user.encrypted.KEY,
      page,
      size
    })
  );
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 备货单明细 */
export async function getPickingInfo(stockUpPlanNo) {
  const res = await request.get('/CentralWarehouseMonitor/GetPickingInfo', {
    params: {
      Stock_Up_Plan_No: stockUpPlanNo,
      Token: token()
    }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 删除备货单明细 */
export async function deletePickingDetails(ids) {
  const json = JSON.stringify((ids || []).map((id) => `{${id}}`));
  const res = await request.post(
    '/CentralWarehouseMonitor/DeleteDetalis',
    formdataify({ json, Token: token() })
  );
  if (res.data == 200 || res.data === '200') {
    return true;
  }
  if (res.data == 301 || res.data === '301') {
    throw new Error('登录超时，请重新登录');
  }
  throw new Error('删除失败');
}

/** 备货单备注 - 读取 */
export async function showPlanRemarks(planNo) {
  const res = await request.get('/CentralWarehouseMonitor/ShowRemarks', {
    params: { Stock_Up_Plan_No: planNo, Token: token() }
  });
  return res.data;
}

/** 备货单备注 - 保存 */
export async function updatePlanRemarks(planNo, remarks) {
  const res = await request.get('/CentralWarehouseMonitor/UpdateRemarks', {
    params: {
      Stock_Up_Plan_No: planNo,
      Remarks: remarks ?? '',
      Token: token()
    }
  });
  return res.data;
}

/** 导入条目 */
export async function importBhInfo(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/AAPDDATE/ImportBhInfo', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

/** 导入（更新备注） */
export async function importBhInfoRemark(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/AAPDDATE/ImportBhInfoRemark', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}
