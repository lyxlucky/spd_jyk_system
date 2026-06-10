import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
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

/** 权限列表 */
export async function getPermissionList() {
  const res = await request.get('/Commons/getPermissionList', {
    params: { Token: token() }
  });
  return unwrap(res);
}

/** 树形权限（父菜单下拉） */
export async function getPermissionListByTree() {
  const res = await request.get('/Commons/getPermissionListByTree', {
    params: { Token: token() }
  });
  return unwrap(res);
}

/** 新增权限 */
export async function addPermission(data) {
  const res = await request.post(
    '/Commons/AddPermission',
    formdataify({
      Token: token(),
      Permission_Name: data.Permission_Name,
      Permission_Url: data.Permission_Url,
      Remarks: data.Remarks ?? ''
    })
  );
  return res?.data;
}

/** 树型新增权限 */
export async function newAddPermission(data) {
  const res = await request.post(
    '/Commons/newAddPermission',
    formdataify({
      Token: token(),
      parent: data.parent,
      name: data.name,
      p_url: data.p_url,
      remarks: data.remarks ?? '',
      p_api: data.p_api
    })
  );
  return res?.data;
}

/** 更新权限备注 */
export async function upPermissionRemark(id, remark) {
  const res = await request.post(
    '/Commons/UpPermissionRemark',
    formdataify({
      Token: token(),
      id,
      REMARK: remark ?? ''
    })
  );
  return unwrap(res);
}

/** 删除权限，成功返回 "1" */
export async function delPermissionByID(id) {
  const res = await request.post(
    '/Commons/DelPermissionByID',
    formdataify({ ID: id, Token: token() })
  );
  return res?.data;
}
