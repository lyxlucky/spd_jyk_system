import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

function postForm(path, fields) {
  return request.post(path, formdataify({ Token: token(), ...fields }));
}

/** 二级科室金额排名 */
export async function deptUseCountStatistics(params, page = 1, size = 10) {
  const res = await postForm('/BigScreen/DeptUseCountStatistics', {
    DEPT_TWO_CODE: params.deptTwoCode ?? '',
    DEPT_TWO_NAME: params.deptTwoName ?? '',
    USE_PRICE: '',
    START_DAY: params.startDay ?? '',
    END_DAY: params.endDay ?? '',
    page,
    size
  });
  return unwrap(res);
}

/** 科室每月消耗 */
export async function usedByDeptMonth(params, page = 1, size = 12) {
  const res = await postForm('/BigScreen/UsedByDeptMoenth', {
    DEPT_TWO_CODE: params.deptTwoCode ?? '',
    DEPT_TWO_NAME: params.deptTwoName ?? '',
    USE_PRICE: '',
    MONTH_NUM: params.monthNum ?? '',
    START_DAY: params.startDay ?? '',
    END_DAY: params.endDay ?? '',
    page,
    size
  });
  return unwrap(res);
}

/** 科室月份品种消耗 */
export async function varUseByDeptOrMonth(params, page = 1, size = 10) {
  const res = await postForm('/BigScreen/VarUseByDeptOrMonth', {
    DEPT_TWO_CODE: params.deptTwoCode ?? '',
    USE_COUNT: '',
    USE_PRICE: '',
    VARIETIE_NAME: params.varietieName ?? '',
    MONTH_NUM: params.monthNum ?? '',
    page,
    size
  });
  return unwrap(res);
}

/** 品种分月消耗 */
export async function varUseByDeptEvenTime(params, page = 1, size = 12) {
  const res = await postForm('/BigScreen/VarUseByDeptEvenTime', {
    DEPT_TWO_CODE: params.deptTwoCode ?? '',
    USE_COUNT: '',
    USE_PRICE: '',
    VARIETIE_NAME: params.varietieName ?? '',
    OPEARTION_CHARGING_TIME: '',
    START_DAY: params.startDay ?? '',
    END_DAY: params.endDay ?? '',
    page,
    size
  });
  return unwrap(res);
}
