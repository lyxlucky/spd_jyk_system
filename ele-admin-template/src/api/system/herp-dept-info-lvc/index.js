import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function withToken(extra = {}) {
  return {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME) || '',
    ...extra
  };
}

function isSuccess(res) {
  const code = res?.data?.code;
  return code === 200 || code === '200';
}

/** 查询三级库低值收费专用科室对冲关系。 */
export async function herpDeptInfoLvcList(params = {}) {
  const res = await request.post(
    '/HerpDeptInfoLvc/GetList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 20,
      Keyword: params.keyword || ''
    })
  );
  if (isSuccess(res)) return res.data;
  return Promise.reject(new Error(res?.data?.msg || '查询失败'));
}

/** 新增或编辑三级库低值收费专用科室对冲关系。 */
export async function herpDeptInfoLvcSave(data) {
  const res = await request.post(
    '/HerpDeptInfoLvc/Save',
    withToken({ Data: data })
  );
  if (isSuccess(res)) return res.data;
  return Promise.reject(new Error(res?.data?.msg || '保存失败'));
}

/** 删除三级库低值收费专用科室对冲关系。 */
export async function herpDeptInfoLvcDelete(id) {
  const res = await request.post(
    '/HerpDeptInfoLvc/Delete',
    withToken({ Id: id })
  );
  if (isSuccess(res)) return res.data;
  return Promise.reject(new Error(res?.data?.msg || '删除失败'));
}
