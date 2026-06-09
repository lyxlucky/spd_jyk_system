import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

async function getJson(url, params = {}) {
  const res = await request.get(url, { params: { Token: token(), ...params } });
  if (res.data?.code == 301) {
    return Promise.reject(new Error(res.data.msg || '登录失效，请重新登录'));
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '请求失败'));
}

async function postForm(url, data = {}) {
  const res = await request.post(url, formdataify({ Token: token(), ...data }));
  if (res.data?.code == 301) {
    return Promise.reject(new Error(res.data.msg || '登录失效，请重新登录'));
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '请求失败'));
}

/** 日清账单列表（默认：新增） */
export function getDayClearingNum(params = {}) {
  return getJson('/DayClearing/GetDayClearingNum', params);
}

/** 按月份/科室查询日清账单 */
export function searchDayClear(params = {}) {
  return getJson('/DayClearing/SerachDayClear', params);
}

/** 日清科室列表 */
export function getDayClearingDept(params) {
  return getJson('/DayClearing/GetDayClearingDept', params);
}

/** 散货及定数包日清明细 */
export function getClearingVarDtl(params) {
  return getJson('/DayClearing/GetClearingVarDtl', params);
}

/** 确认完成 */
export function insertClearingVarDtl(json) {
  return postForm('/DayClearing/InsertClearingVarDtl', { json });
}

/** 确认His计费日清 */
export function insertClearingHisCharingVarDtl(json) {
  return postForm('/DayClearing/InsertClearingHisCharingVarDtl', { json });
}

/** 日清审核（南医大） */
export function dayApproval(params) {
  return getJson('/DayClearing/DayApproval', params);
}

/** 打印日清账单等导出 */
export function dayClearingExport(action, params) {
  return getJson(`/DayClearing/${action}`, params);
}

/** 更新打印次数 */
export function updatePrint(params) {
  return getJson('/DayClearing/UpdatePrint', params);
}

/** 打印计划单 */
export function stzxMonthPlanDayClear(params) {
  return getJson('/MonthClearing/STZX_MonthPlanDayClear', params);
}

/** 打印计划单一级科室 */
export function stzxMonthPlanDayClearDeptOne(params) {
  return getJson('/MonthClearing/STZX_MonthPlanDayClearDeptOne', params);
}

/** 打印计划单(检验科) */
export function stzxMonthPlanDayClearJy(data) {
  return postForm('/MonthClearing/STZX_MonthPlanDayClear_jy', data);
}

/** 打印计划单(输血科) */
export function stzxMonthPlanDayClearSx(data) {
  return postForm('/MonthClearing/STZX_MonthPlanDayClear_SX', data);
}
