import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function ok(res) {
  const c = res?.data?.code;
  return c === 200 || c === '200';
}

/** 上下限审批列表查询 */
export async function searchUpDownKsQuery(params) {
  const res = await request.get('/DeptTwoDefNoPackageStock/SearchUpDownKsQuery', {
    params: {
      Token: getToken(),
      DEPT_TWO_NAME: params.DEPT_TWO_NAME ?? '',
      SEARCH: params.SEARCH ?? '',
      APPROVAL_STATE: params.APPROVAL_STATE ?? '',
      starttime: params.starttime ?? '',
      endtime: params.endtime ?? '',
      page: params.page ?? 1,
      size: params.size ?? 20
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 批量审批上下限 */
export async function approvalUpDown(rows) {
  const fd = formdataify({
    Token: getToken(),
    json: JSON.stringify(rows)
  });
  const res = await request.post('/DeptTwoDefNoPackageStock/ApprovalUpDown', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '审批失败'));
}
