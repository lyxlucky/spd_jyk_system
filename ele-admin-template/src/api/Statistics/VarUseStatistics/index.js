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

/** 一级科室列表（统计用，含「全院」） */
export async function searchDeptOneTj(deptOneName, page = 1, size = 99999) {
  const res = await request.get('/DeptOneBasicInfo/SearchDeptOneTj', {
    params: { Token: token(), deptOneName: deptOneName ?? '', page, size }
  });
  return unwrap(res);
}

function buildConsumeParams(p) {
  return {
    Token: token(),
    IsVarNmae: p.isVarName ?? '0',
    DateStart: p.dateStart ?? '',
    DateEnd: p.dateEnd ?? '',
    DeptOneCode: p.deptOneCode ?? '',
    HeightOrLow: p.heightOrLow ?? '1',
    IS_PROTECT: p.isProtect ?? '0',
    VarCode: p.varCode ?? '',
    VarNmae: p.varName ?? '',
    isShowAll: p.isShowAll ?? '0',
    OrderVal: p.orderVal ?? 'sumPrice'
  };
}

/** 品种汇总 */
export async function getConsumeTjAll(params) {
  const res = await request.post(
    '/BigScreen/GetDEPT_HIS_DEF_PKG_CONSUME_TJ_ALL',
    formdataify(buildConsumeParams(params))
  );
  return unwrap(res);
}

/** 品种每月使用情况 */
export async function getConsumeTjLs(params) {
  const res = await request.post(
    '/BigScreen/GetDEPT_HIS_DEF_PKG_CONSUME_TJ_LS',
    formdataify(buildConsumeParams(params))
  );
  return unwrap(res);
}

/** 科室每月使用情况 */
export async function getDeptConsumeTjLs(params) {
  const res = await request.post(
    '/BigScreen/D_GetDEPT_HIS_DEF_PKG_CONSUME_TJ_LS',
    formdataify(buildConsumeParams(params))
  );
  return unwrap(res);
}
