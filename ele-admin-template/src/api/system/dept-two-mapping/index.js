import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function withToken(extra = {}) {
  return {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...extra
  };
}

function isSuccess(res) {
  const c = res.data && res.data.code;
  return c === 200 || c === '200';
}

/**
 * 主表：DEPT_TWO_BASIC_INFO（SPD 二级科室）分页
 */
export async function deptTwoBasicPickList(params = {}) {
  const res = await request.post(
    '/DeptTwoMapping/GetDeptTwoBasicPickList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 10,
      Keyword: params.keyword,
      LinkFilter: params.linkFilter
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询二级科室失败'));
}

/**
 * 从表：HIS 映射分页（通常传 spdDeptCode 限定当前科室）
 */
export async function deptTwoMappingList(params = {}) {
  const res = await request.post(
    '/DeptTwoMapping/GetList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 10,
      SpdDeptCode: params.spdDeptCode,
      HisDeptCode: params.hisDeptCode,
      Keyword: params.keyword
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询失败'));
}

/**
 * 保存（新增或修改）
 */
export async function deptTwoMappingSave(data) {
  const res = await request.post(
    '/DeptTwoMapping/Save',
    withToken({ Data: data })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '保存失败'));
}

/**
 * 删除
 */
export async function deptTwoMappingDelete(id) {
  const res = await request.post(
    '/DeptTwoMapping/Delete',
    withToken({ Id: id })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '删除失败'));
}
