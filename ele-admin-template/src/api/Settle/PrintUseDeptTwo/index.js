import request from '@/utils/request';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

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

/** 日清列表 */
export function getDayClearingList(date = '') {
  const month = (date || '').replace(/-/g, '');
  if (month) {
    return getJson('/DayClearing/SerachDayClear', { Date: month, DeptName: '', page: 1, size: 9999 });
  }
  return getJson('/DayClearing/GetDayClearingNum');
}

/** 含 HIS 计费消耗数据的收货科室 */
export function getDayHisCharDeptTwo(dayClearingID, seacrchVale = '') {
  return getJson('/DeptTwoBasicInfo/getDayHisCharDeptTwo', {
    dayClearingID: dayClearingID || '',
    seacrchVale
  });
}

/** HIS 计费品种明细 */
export function getClearingVarDtlUseDeptTwoCode(params) {
  return getJson('/DayClearing/GetClearingVarDtl_J_USE_DEPT_TWO_CODE', {
    DeptCode: params.DeptCode || '',
    SerachName: params.SerachName || '',
    GoodsDayClearingDeptID: params.GoodsDayClearingDeptID || '',
    State: params.State ?? '1',
    field: params.field || '',
    order: params.order || '',
    page: params.page || 1,
    size: params.size || 99999
  });
}

/** 打印 HIS 计费日清单 */
export function printHisDayClear(params) {
  return getJson('/DayClearing/printGetClearingVarDtl_J_USE_DEPT_TWO_CODE', {
    homehp: HOME_HP,
    DeptCode: params.DeptCode || '',
    N_Dept_Two_Name: params.N_Dept_Two_Name || '',
    SerachName: params.SerachName || '',
    GoodsDayClearingDeptID: params.GoodsDayClearingDeptID || '',
    Clearing_Time: params.Clearing_Time || '',
    State: params.State ?? 1,
    page: 1,
    size: 99999
  });
}

/** 更新打印次数 */
export function updatePrint(params) {
  return getJson('/DayClearing/UpdatePrint', params);
}
