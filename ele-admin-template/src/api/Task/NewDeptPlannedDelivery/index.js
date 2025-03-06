import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Encrypt } from '@/utils/aes-util';

export async function SearchDeptPlanMsg(data) {
  const formatData = {
    page: data.page,
    size: 9999999,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    planNumber: data.where.planNumber || '',
    planState: data.where.planState || '6',
    varietieCodeNew: data.where.varietieCodeNew || '',
    dp_new_sup: data.where.dp_new_sup || '',
    specType: data.where.specType || '',
    manEntName: data.where.manEntName || '',
    deptTwoName: data.where.deptTwoName || '',
    dateFrom: data.where.dateFrom || '',
    dateTo: data.where.dateTo || '',
    deptPlanMan: data.where.deptPlanMan || '',
    containLeftZero: data.where.containLeftZero || '',
    isDelete: data.where.isDelete || '1',
    planIsZb: data.where.planIsZb || '',
    planIsZg: data.where.planIsZg || '',
    planIsJYK: data.where.planIsJYK || ''
  };
  const res = await request.post(
    '/DeptPlanTransfer/SearchDeptPlanMsg',
    formdataify(formatData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function GetPickingList(data) {
  console.log(data);
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    VarietieCode: data.where.keyword || '',
    BHDate: data.where.date || '',
    SenState: data.where.state || '-1',
    PlanNum: data.where.planNo || ''
  };
  const encriptData = {
    prams: Encrypt(JSON.stringify(formatData)),
    AesKey: store.state.user.encrypted.KEY,
    page: data.page ? data.page : 1,
    size: data.limit ? data.limit : 30
  };
  const res = await request.post(
    '/CentralWarehouseMonitor/GetPickingList',
    formdataify(encriptData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function GetPickingInfo(data) {
  const formatData = {
    page: data.page,
    size: 9999999,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    Stock_Up_Plan_No: data.where.Stock_Up_Plan_No || ''
  };
  const res = await request.get('/CentralWarehouseMonitor/GetPickingInfo', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
