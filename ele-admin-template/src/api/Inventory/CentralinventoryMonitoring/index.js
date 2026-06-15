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

// ---------- 中心库库存监控 ----------

export async function searchCentralMonitor(where, page, size) {
  const res = await request.get('/CentralWarehouseMonitor/Search', {
    params: {
      Token: token(),
      IsCoefficient: where.IsCoefficient ?? '0',
      UseLevel: where.UseLevel ?? '-1',
      StorageID: where.StorageID ?? '-1',
      EnableState: where.EnableState ?? '1',
      SearchName: where.SearchName ?? '',
      EnableLowUp: where.EnableLowUp ?? '0',
      Supplier: where.Supplier ?? '',
      field: where.field ?? '',
      order: where.order ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 301) throw new Error(data.msg || '登录失效，请重新登录');
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  if (data.code == 400 || data.code === '400') {
    return { total: 0, result: [], msg: data.msg };
  }
  throw new Error(data.msg || '查询失败');
}

export async function getMonitorPopup(items) {
  const res = await request.post(
    '/CentralWarehouseMonitor/GetMonitorPopup',
    formdataify({ Token: token(), json: JSON.stringify(items || []) })
  );
  const data = res.data;
  if (data.code == 301) throw new Error(data.msg || '登录失效，请重新登录');
  return data;
}

export async function insertNewInfo(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseMonitor/InsertNewInfo',
    formdataify({ Token: token(), json: jsonStr }),
    { timeout: 60000 }
  );
  return unwrapRes(res);
}

export async function updateMonitorInfo(jsonStr) {
  const res = await request.post(
    '/CentralWarehouseMonitor/UpdateInfo',
    formdataify({ Token: token(), json: jsonStr })
  );
  return unwrapRes(res);
}

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
  if (res.data.code == 200) return res.data;
  throw new Error(res.data.msg || '查询失败');
}

export async function getPickingInfo(stockUpPlanNo) {
  const res = await request.get('/CentralWarehouseMonitor/GetPickingInfo', {
    params: { Stock_Up_Plan_No: stockUpPlanNo, Token: token() }
  });
  if (res.data.code == 200) return res.data;
  throw new Error(res.data.msg || '查询失败');
}

export async function deletePickingDetails(ids) {
  const json = JSON.stringify((ids || []).map((id) => `{${id}}`));
  const res = await request.post(
    '/CentralWarehouseMonitor/DeleteDetalis',
    formdataify({ json, Token: token() })
  );
  if (res.data == 200 || res.data === '200') return true;
  if (res.data == 301 || res.data === '301') throw new Error('登录超时，请重新登录');
  throw new Error('删除失败');
}

export async function updateApproveState(id, approver) {
  const res = await request.post(
    '/CentralWarehouseMonitor/UpdateApproveState',
    formdataify({ ID: id, Approver: approver, Token: token() })
  );
  if (res.data == 200 || res.data === '200') return true;
  if (res.data == 301 || res.data === '301') throw new Error('登录失效，请重新登录');
  throw new Error('审批失败');
}

export async function noApprove(id) {
  const res = await request.post(
    '/CentralWarehouseMonitor/NoApprove',
    formdataify({ ID: id, Token: token() })
  );
  if (res.data == '200' || res.data === 200) return true;
  if (res.data == '301' || res.data === 301) throw new Error('登录超时，请重新登录');
  throw new Error('拒绝审批失败');
}

export async function deletePickingList(id) {
  const res = await request.post(
    '/CentralWarehouseMonitor/DeleteList',
    formdataify({ ID: id, Token: token() })
  );
  if (res.data == '200' || res.data === 200) return true;
  if (res.data == '301' || res.data === 301) throw new Error('登录超时，请重新登录');
  throw new Error('删除失败');
}

export async function showPlanRemarks(planNo) {
  const res = await request.get('/CentralWarehouseMonitor/ShowRemarks', {
    params: { Stock_Up_Plan_No: planNo, Token: token() }
  });
  return res.data;
}

export async function updatePlanRemarks(planNo, remarks) {
  const res = await request.get('/CentralWarehouseMonitor/UpdateRemarks', {
    params: { Stock_Up_Plan_No: planNo, Remarks: remarks ?? '', Token: token() }
  });
  return res.data;
}

export async function importBhData(file, creator) {
  const fd = new FormData();
  fd.append('FILE', file);
  fd.append('Token', token());
  fd.append('Creator', creator ?? '');
  const res = await request.post('/CentralWarehouseMonitor/ImpartBHdata', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  return res.data;
}

export async function searchLcInfo(where, page, size) {
  const res = await request.post(
    '/CentralWarehouseMonitor/searchLcInfo',
    formdataify({
      Token: token(),
      VARIETIE_NAME: where.VARIETIE_NAME ?? '',
      SUPPLIER_NAME: where.SUPPLIER_NAME ?? '',
      CONTRACT_NAME: where.CONTRACT_NAME ?? '',
      page,
      size
    })
  );
  const data = res.data;
  if (data.code == 301 || data.code === '301') {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询失败');
}

export async function addBhXsDetalis(ids, nr) {
  const json = JSON.stringify((ids || []).map((id) => ({ ID: id })));
  const res = await request.post(
    '/CentralWarehouseMonitor/AddBhXsDetalis',
    formdataify({ json, NR: nr, Token: token() })
  );
  return res.data;
}

// ---------- 调拨单创建 ----------

export async function getAllocateListInfo(state, svc) {
  const res = await request.post(
    '/AllocateTableCreate/GetListInfo',
    formdataify({ state, svc, Token: token() })
  );
  return res.data;
}

export async function getAllocateVarInfo(where, page, size) {
  const formatData = {
    Token: token(),
    Storageid: where.Storageid ?? '0',
    Search: where.Search ?? '',
    orderby: where.orderby ?? '',
    field: where.field ?? ''
  };
  const res = await request.post(
    '/AllocateTableCreate/GetVarInfo',
    formdataify({
      prams: Encrypt(JSON.stringify(formatData)),
      AesKey: store.state.user.encrypted.KEY,
      page,
      size
    })
  );
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询失败');
}

export async function getAllocateDefInfo(where, page, size) {
  const res = await request.get('/AllocateTableCreate/GetDefInfo', {
    params: {
      Token: token(),
      Storageid: where.Storageid ?? '0',
      Search: where.Search ?? '',
      orderby: where.orderby ?? '',
      field: where.field ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询失败');
}

export async function creatAllocateVarTable(jsonStr, svc, state, allocateNumber, allocater) {
  const res = await request.post(
    '/AllocateTableCreate/CreatAllocateVarTable',
    formdataify({
      json: jsonStr,
      svc,
      state,
      ALLOCATE_NUMBER: allocateNumber ?? '',
      ALLOCATER: allocater ?? '',
      Token: token()
    }),
    { timeout: 120000 }
  );
  return res.data;
}

export async function creatAllocateTable(jsonStr, svc, state, allocateNumber, allocater) {
  const res = await request.post(
    '/AllocateTableCreate/CreatAllocateTable',
    formdataify({
      json: jsonStr,
      svc,
      state,
      ALLOCATE_NUMBER: allocateNumber ?? '',
      ALLOCATER: allocater ?? '',
      Token: token()
    }),
    { timeout: 120000 }
  );
  return res.data;
}

// ---------- 缺货统计 ----------

export async function inDefDept(rows, operator) {
  const payload = (rows || []).map((row) => ({
    Varietie_Code: row.Varietie_Code,
    Dept_Two_code: row.Dept_Two_Code,
    Shortage_Date: '0001-01-01',
    Operator: operator ?? '',
    Is_Delete: 1
  }));
  const res = await request.post(
    '/DefShortage/InDefDept',
    formdataify({ json: JSON.stringify(payload), Token: token() }),
    { timeout: 120000 }
  );
  return res.data;
}

// ---------- 二级科室定数包库存监控 ----------

export async function getDeptMonitorDept(deptName, storageId, page, size) {
  const res = await request.get('/DeptMonitor/GetDept', {
    params: {
      Token: token(),
      DeptName: deptName ?? '',
      STORAGE_ID: storageId ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询科室失败');
}

export async function searchDeptMonitor(where, page, size) {
  const res = await request.get('/DeptMonitor/Search', {
    params: {
      Token: token(),
      MonitorType: where.MonitorType ?? '0',
      Per: where.Per ?? '0.5',
      StorageID: where.StorageID ?? '',
      LowState: where.LowState ?? '1',
      EnableState: where.EnableState ?? '1',
      DeptName: where.DeptName ?? '',
      SearchName: where.SearchName ?? '',
      IS_AUTH_SEND: where.IS_AUTH_SEND ?? '1',
      ORDER_TYPE: where.ORDER_TYPE ?? '',
      CENTER_SEND_TYPE: where.CENTER_SEND_TYPE ?? '',
      HIGH_OR_LOW_CLASS: where.HIGH_OR_LOW_CLASS ?? '',
      field: where.field ?? '',
      order: where.order ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询失败');
}

export async function getDirectiveList(where, page, size) {
  const res = await request.get('/DeptMonitor/GetDirectiveList', {
    params: {
      Token: token(),
      VarietieCode: where.VarietieCode ?? '',
      State: where.State ?? '',
      STORAGE_ID: where.STORAGE_ID ?? '',
      page,
      size
    }
  });
  if (res.data.code == 200) return res.data;
  throw new Error(res.data.msg || '查询拣配单失败');
}

export async function getDirectiveDetail(jpNumber, page, size) {
  const res = await request.get('/DeptMonitor/GetDirectiveDetail', {
    params: { Token: token(), JPNumber: jpNumber, page, size }
  });
  if (res.data.code == 200) return res.data;
  throw new Error(res.data.msg || '查询拣配明细失败');
}

export async function insertDirective(jsonStr, storageId) {
  const res = await request.post(
    '/DeptMonitor/Insert',
    formdataify({ json: jsonStr, Token: token(), STORAGE_ID: storageId ?? '' })
  );
  return res.data;
}

export async function updateDirective(jsonStr, storageId) {
  const res = await request.post(
    '/DeptMonitor/Update',
    formdataify({ json: jsonStr, Token: token(), STORAGE_ID: storageId ?? '' })
  );
  return res.data;
}

export async function deleteDirectiveList(id) {
  const res = await request.post('/DeptMonitor/DeleteList', formdataify({ ID: id, Token: token() }));
  const data = res.data;
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '删除失败');
}

export async function deleteDirectiveDetail(ids) {
  const res = await request.post(
    '/DeptMonitor/DeleteDirectiveDetail',
    formdataify({ ID: ids, Token: token() })
  );
  return res.data;
}

// ---------- 二级科室散货申领 ----------

export async function getTwoDeptApplyDept(searchName, storageId, page, size) {
  const res = await request.get('/TwoDeptApply/GetDept', {
    params: {
      Token: token(),
      SearchName: searchName ?? '',
      STORAGE_ID: storageId ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询科室失败');
}

export async function getTwoDeptApplyVarietie(where, page, size) {
  const res = await request.get('/TwoDeptApply/GetVarietie', {
    params: {
      Token: token(),
      StorageID: where.StorageID ?? '',
      DeptTwoCode: where.DeptTwoCode ?? '',
      SearchName: where.SearchName ?? '',
      delNum: where.delNum ?? '',
      supplier_name: where.supplier_name ?? '',
      Specification_Or_Type: where.Specification_Or_Type ?? '',
      Batch: where.Batch ?? '',
      field: where.field ?? '',
      order: where.order ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询品种失败');
}

export async function getApplyList(where, page, size) {
  const res = await request.get('/TwoDeptApply/GetApplyList', {
    params: {
      Token: token(),
      DeptTwoCode: where.DeptTwoCode ?? '',
      SearchName: where.SearchName ?? '',
      StartTime: where.StartTime ?? '',
      EndTime: where.EndTime ?? '',
      is_sign: where.is_sign ?? '0',
      is_Print: where.is_Print ?? '',
      page,
      size
    }
  });
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询申领单失败');
}

export async function getApplyDetail(id, searchName, page, size) {
  const res = await request.get('/TwoDeptApply/GetApplyDetail', {
    params: { Token: token(), ID: id, SearchName: searchName ?? '', page, size }
  });
  if (res.data.code == 200) return res.data;
  throw new Error(res.data.msg || '查询申领明细失败');
}

export async function createApplyNum(deptTwoCode) {
  const res = await request.get('/TwoDeptApply/CreateAppltNum', {
    params: { Token: token(), DeptTwoCode: deptTwoCode }
  });
  return res.data;
}

export async function insertApplyVarietie(jsonStr) {
  const res = await request.post(
    '/TwoDeptApply/InsertVarietie',
    formdataify({ json: jsonStr, Token: token() })
  );
  return res.data;
}

export async function updateApply(jsonStr) {
  const res = await request.post('/TwoDeptApply/UpdateApply', formdataify({ json: jsonStr, Token: token() }));
  return res.data;
}

export async function deleteApplyVarietie(jsonStr) {
  const res = await request.post('/TwoDeptApply/DeleteVarietie', formdataify({ json: jsonStr, Token: token() }));
  return res.data;
}

export async function deleteApplyOrder(id) {
  const res = await request.post(
    '/TwoDeptApply/delDept_Two_Goods_operate',
    formdataify({ ID: id, Token: token() })
  );
  return res.data;
}

export async function pdaConfirmApply(deptTwoCode, operateNumber, staff) {
  const res = await request.get('/TwoDeptApply/PdaComfirmApply', {
    params: {
      Token: token(),
      deptTwoCode,
      operateNumber,
      staff
    }
  });
  return res.data;
}

export async function exportApplyListAll(params) {
  const res = await request.get('/TwoDeptApply/GetApplyListAll', { params: { Token: token(), ...params } });
  return res.data;
}

export async function createClaimExcel(apiPath, params) {
  const res = await request.get(`/TwoDeptApply/${apiPath}`, {
    params: { Token: token(), ...params },
    timeout: 120000
  });
  return res.data;
}

export async function sendLuoHuYSY(id) {
  const res = await request.get('/TwoDeptApply/SendLuoHuYSY', {
    params: { Token: token(), id }
  });
  return res.data;
}

export async function lhApplyDetailDel(ids) {
  const json = JSON.stringify((ids || []).map((id) => ({ ID: id })));
  const res = await request.post(
    '/TwoDeptApply/lh_applydatail_del',
    formdataify({ JSON: json, Token: token() })
  );
  return res.data;
}
