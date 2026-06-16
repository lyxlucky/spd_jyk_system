import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import store from '@/store';
import { Encrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function staffName() {
  return store.state.user?.info?.Nickname || '';
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

function buildPlanSearchBody(where = {}) {
  const planState = Array.isArray(where.planState)
    ? where.planState.join(',')
    : where.planState || '6,3';
  return {
    page: where.page ?? 1,
    size: where.size ?? 9999999,
    Token: token(),
    planNumber: where.planNumber || '',
    planState,
    varietieCodeNew: where.varietieCodeNew || '',
    dp_new_sup: where.dp_new_sup || '',
    specType: where.specType || '',
    manEntName: where.manEntName || '',
    deptTwoName: where.deptTwoName || '',
    dateFrom: where.dateFrom || '',
    dateTo: where.dateTo || '',
    deptPlanMan: where.deptPlanMan || '',
    containLeftZero: where.containLeftZero ?? '0',
    isDelete: where.isDelete ?? '1',
    planIsZb: where.planIsZb ?? '',
    planIsZg: where.planIsZg ?? '',
    planIsJYK: where.planIsJYK ?? '',
    planIsHcfl: where.planIsHcfl ?? '',
    planIsZxk_sh: where.planIsZxk_sh ?? '',
    planIsZxk_dsb: where.planIsZxk_dsb ?? '',
    isHaveBh: where.isHaveBh ?? '',
    STORAGE_TYPE: where.STORAGE_TYPE ?? '',
    RELATED_RFID: where.RELATED_RFID ?? '',
    STORAGE_ID: where.STORAGE_ID ?? '',
    OPERATE_TYPE: where.OPERATE_TYPE ?? ''
  };
}

export async function searchDeptPlanMsg(where = {}) {
  const url =
    HOME_HP === 'szlh'
      ? '/DeptPlanTransfer/SearchDeptPlanMsg_LH'
      : '/DeptPlanTransfer/SearchDeptPlanMsg';
  const res = await request.post(url, formdataify(buildPlanSearchBody(where)));
  return unwrapRes(res);
}

export async function getPickingList(where = {}, page = 1, size = 30) {
  const formatData = {
    Token: token(),
    VarietieCode: where.keyword || '',
    BHDate: where.date || '',
    SenState: where.state ?? '-1',
    PlanNum: where.planNo || '',
    STORAGE_ID: where.storageId || ''
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
  return unwrapRes(res);
}

export async function getPickingInfo(stockUpPlanNo) {
  const res = await request.get('/CentralWarehouseMonitor/GetPickingInfo', {
    params: {
      Stock_Up_Plan_No: stockUpPlanNo || '',
      page: 1,
      size: 9999999,
      Token: token()
    }
  });
  return unwrapRes(res);
}

export async function deletePickingDetails(ids) {
  const json = JSON.stringify((ids || []).map((id) => `{${id}}`));
  const res = await request.post(
    '/CentralWarehouseMonitor/DeleteDetalis',
    formdataify({ json, Token: token() })
  );
  return unwrapRes(res);
}

export async function showPickingRemarks(stockUpPlanNo) {
  const res = await request.get('/CentralWarehouseMonitor/ShowRemarks', {
    params: { Stock_Up_Plan_No: stockUpPlanNo, Token: token() }
  });
  return unwrapRes(res);
}

export async function updatePickingRemarks(stockUpPlanNo, remarks) {
  const res = await request.get('/CentralWarehouseMonitor/UpdateRemarks', {
    params: {
      Stock_Up_Plan_No: stockUpPlanNo,
      Remarks: remarks ?? '',
      Token: token()
    }
  });
  return unwrapRes(res);
}

export async function getMonitorPopup(items) {
  const res = await request.post(
    '/CentralWarehouseMonitor/GetMonitorPopup',
    formdataify({ json: JSON.stringify(items || []), Token: token() })
  );
  return unwrapRes(res);
}

export async function insertNewInfo(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseMonitor/InsertNewInfo',
    formdataify({ json: jsonStr, Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function transferGoodsApply(goodsJson) {
  const res = await request.post(
    '/DeptPlanTransfer/TransferGoodsApply',
    formdataify({ goodsJson, Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function onlyApplyLeftQty(jsonStr) {
  const res = await request.post(
    '/DeptPlanTransfer/OnlyApplyLeftQty',
    formdataify({ JSON: jsonStr, Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function searchDeptPlanCoefficientMsg(deptPlanMsgJson) {
  const res = await request.post(
    '/DeptPlanTransfer/SearchDeptPlanCoefficientMsg',
    formdataify({
      deptPlanMsgJson,
      page: 1,
      size: 1001,
      Token: token()
    }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function prepareBagMaking(dtlIdJson, where = {}, storageId = '') {
  const res = await request.post(
    '/DeptPlanTransfer/PrepareBagMaking',
    formdataify({
      varietie: where.varietieCodeNew || '',
      planNumber: where.planNumber || '',
      specType: where.specType || '',
      page: 1,
      size: 1001,
      dtlIdJson,
      Token: token(),
      STORAGE_ID: storageId
    }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function transferDefPick(defJson) {
  const res = await request.post(
    '/DeptPlanTransfer/TransferDefPick',
    formdataify({ defJson, staff: staffName(), Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function lockVarietieQuantity(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/LockVarietieQuantity',
    formdataify({ json: jsonStr, staff: staffName(), Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function upDeptPlanZG(planNumbers, state) {
  const res = await request.post(
    '/DeptPlanTransfer/UpDeptPlanZG',
    formdataify({ json: JSON.stringify(planNumbers || []), state, Token: token() })
  );
  return unwrapRes(res);
}

export async function searchBz(dtlid) {
  const res = await request.post(
    '/DeptPlanTransfer/Searchbz',
    formdataify({ dtlid, Token: token() })
  );
  const data = res?.data;
  if (data?.code == 301) throw new Error(data?.msg || '登录失效，请重新登录');
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '获取备注失败');
}

export async function editBz(dtlid, bz) {
  const res = await request.post(
    '/DeptPlanTransfer/Editbz',
    formdataify({ dtlid, bz, Token: token() })
  );
  const data = res?.data;
  if (data?.code == 301) throw new Error(data?.msg || '登录失效，请重新登录');
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '保存失败');
}

export async function batchEditBz(dtlid, bz) {
  const res = await request.post(
    '/DeptPlanTransfer/BatchEditbz',
    formdataify({ dtlid, bz, Token: token() })
  );
  const data = res?.data;
  if (data?.code == 301) throw new Error(data?.msg || '登录失效，请重新登录');
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '保存失败');
}

export async function changeApplyQty(dtlid, applyQty, bz) {
  const res = await request.post(
    '/DeptPlanTransfer/ChangeApplyQty',
    formdataify({ dtlid, applyQty, bz, Token: token() }),
    { timeout: 60000 }
  );
  const data = res?.data;
  if (data?.code == 301) throw new Error(data?.msg || '登录失效，请重新登录');
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '变更失败');
}

export async function searchVarietieBatchIds(varietieCode, storageId) {
  const res = await request.post(
    '/DeptPlanTransfer/SearchVarietieBatchIds',
    formdataify({
      varietie: varietieCode,
      page: 1,
      size: 9999999,
      Token: token(),
      STORAGE_ID: storageId
    }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function updateVarietieBatchIdPriorityWeight(jsonStr) {
  const res = await request.post(
    '/DeptPlanTransfer/UpdateVarietieBatchIdPriorityWeight',
    formdataify({ json: jsonStr, Token: token() }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function shutdownPlanNumber(planNumbers) {
  const res = await request.post(
    '/DeptPlanTransfer/ShutdownPlanNumber',
    formdataify({
      planNumberJson: JSON.stringify(planNumbers || []),
      staff: staffName(),
      Token: token()
    })
  );
  return unwrapRes(res);
}

export async function delDetid(dtlIds) {
  const res = await request.post(
    '/DeptPlanTransfer/DelDetid',
    formdataify({ json: JSON.stringify(dtlIds || []), Token: token() })
  );
  return unwrapRes(res);
}

export async function searchReplaceVarDeptPlanMsg(varietieCodeNew, varietieName) {
  const res = await request.post(
    '/DeptPlanTransfer/SearchReplaceVarDeptPlanMsg',
    formdataify({
      Token: token(),
      varietieCodeNew: varietieCodeNew || '',
      Varietie_Name: varietieName || '',
      page: 1,
      size: 9999999
    })
  );
  return unwrapRes(res);
}

export async function commitReplaceVarDeptPlanMsg(delId, rows) {
  const res = await request.post(
    '/DeptPlanTransfer/commitReplaceVarDeptPlanMsg',
    formdataify({
      Token: token(),
      delId,
      json: JSON.stringify(rows || [])
    })
  );
  return unwrapRes(res);
}

export async function searchHistoryConsumedAndPurchaseCompare(deptTwoCode, jsonStr) {
  const res = await request.post(
    '/PurchaseOrderApply/SearchHistoryConsumedAndPurchaseCompare',
    formdataify({
      deptTwoCode,
      json: jsonStr,
      page: 1,
      size: 999999,
      Token: token()
    }),
    { timeout: 5000 }
  );
  return res?.data;
}

export { buildPlanSearchBody };
