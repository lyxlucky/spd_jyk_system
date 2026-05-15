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

/** 计费科室 ↔ SPD 二级（查询，参数名 searchVale 与后端一致） */
export async function searchHerpDeptInfo(params) {
  const res = await request.get('/DeptOneBasicInfo/searchHerpDeptInfo', {
    params: {
      searchVale: params.searchVale ?? '',
      Token: getToken(),
      page: params.page ?? 1,
      size: params.size ?? 20
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function addHerpDeptInfo(payload) {
  const fd = formdataify({
    Token: getToken(),
    dept_code: payload.dept_code ?? '',
    dept_name: payload.dept_name ?? '',
    dept_two_code: payload.dept_two_code ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/addHerpDeptInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '添加失败'));
}

export async function upHerpDeptInfo(payload) {
  const fd = formdataify({
    Token: getToken(),
    id: String(payload.id ?? ''),
    dept_code: payload.dept_code ?? '',
    dept_name: payload.dept_name ?? '',
    dept_two_code: payload.dept_two_code ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/upHerpDeptInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '修改失败'));
}

export async function delHerpDeptInfo(id) {
  const fd = formdataify({
    Token: getToken(),
    id: String(id)
  });
  const res = await request.post('/DeptOneBasicInfo/delHerpDeptInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '删除失败'));
}

/** 计费科室 ↔ SPD 一级 */
export async function searchOneDeptPage(params) {
  const fd = formdataify({
    Token: getToken(),
    DEPT_ONE_NAME: params.DEPT_ONE_NAME ?? '',
    page: String(params.page ?? 1),
    size: String(params.size ?? 20)
  });
  const res = await request.post('/PurchaseOrderApply/SearchHistoryConsumedAndPurchaseOneDept', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function addHerpOneDeptInfo(payload) {
  const fd = formdataify({
    Token: getToken(),
    HIS_DEPT_CODE: payload.HIS_DEPT_CODE ?? '',
    HIS_DEPT_NAME: payload.HIS_DEPT_NAME ?? '',
    DEPT_ONE_CODE: payload.DEPT_ONE_CODE ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/addHerpOneDeptInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '添加失败'));
}

export async function upHerpOneDeptInfo(payload) {
  const fd = formdataify({
    Token: getToken(),
    id: String(payload.id ?? ''),
    HIS_DEPT_CODE: payload.HIS_DEPT_CODE ?? '',
    HIS_DEPT_NAME: payload.HIS_DEPT_NAME ?? '',
    DEPT_ONE_CODE: payload.DEPT_ONE_CODE ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/upHerpOneDeptInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '修改失败'));
}

/** Excel 批量导入（列：计费科室编码、名称、SPD二级科室编码） */
export async function uploadThrirdDeptExcel(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await request.post('/PekingApplication/uploadThrirdDept', fd);
  const c = res?.data?.code;
  if (c === 200 || c === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '上传失败'));
}
