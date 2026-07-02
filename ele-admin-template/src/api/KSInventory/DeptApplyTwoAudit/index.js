import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Encrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function aesKey() {
  return (
    store.state.user?.encrypted?.KEY ||
    sessionStorage.getItem('AesKey') ||
    localStorage.getItem('AesKey') ||
    ''
  );
}

function nickname() {
  return store.state.user?.info?.Nickname || sessionStorage.getItem('nickname') || '';
}

function deptTwoCode() {
  return (
    store.state.user?.info?.DeptNow?.Dept_Two_Code ||
    localStorage.getItem('Dept_Two_Code') ||
    ''
  );
}

function unwrap(res) {
  const data = res?.data;
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}

function postEncrypted(path, pramsObj, page, size) {
  const payload = {
    prams: Encrypt(JSON.stringify({ ...pramsObj, Token: token() })),
    AesKey: aesKey()
  };
  if (page != null) payload.page = page;
  if (size != null) payload.size = size;
  return request.post(path, formdataify(payload));
}

function buildQueryParams(where = {}) {
  return {
    PLAN_NUMBER: where.PLAN_NUMBER ?? '',
    VARIETIE_NAME: where.VARIETIE_NAME ?? '',
    DEPT_TWO_NAME: where.DEPT_TWO_NAME ?? '',
    SENCOND_APP_STATE: where.SENCOND_APP_STATE ?? '',
    StartTime: where.StartTime ?? '',
    EndTime: where.EndTime ?? ''
  };
}

/** 科室申领二级审批列表 */
export async function getDeptApplyTwoAudit(where, page, size) {
  const res = await postEncrypted(
    '/DeptApplyPlan/GetDeptApplyTwoAudit',
    buildQueryParams(where),
    page,
    size
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    list: data.result || []
  };
}

/** 审核通过/不通过 tag: 1通过 2不通过 */
export async function deptApplyAccept(ids, tag) {
  const idStr = Array.isArray(ids) ? ids.join(',') : String(ids || '');
  const res = await postEncrypted('/DeptApplyPlan/DeptApplyAccept', {
    ID: idStr,
    tag: String(tag),
    NickName: nickname(),
    SECOND_APP_DEPT_CODE: deptTwoCode()
  });
  return unwrap(res);
}
