import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function unwrapList(res) {
  const data = res?.data;
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '查询失败');
}

/** 权限组列表 */
export async function getGroupsList() {
  const res = await request.get('/Commons/getGroupsList', {
    params: { Token: token() }
  });
  return unwrapList(res);
}

/** 新增权限组，成功返回非 0 */
export async function addGroup(groupName) {
  const res = await request.post(
    '/Commons/AddGroups',
    formdataify({ Group_Name: groupName, Token: token() })
  );
  return res?.data;
}

/** 删除权限组 */
export async function delGroupByID(id) {
  const res = await request.post(
    '/Commons/DelGroupByID',
    formdataify({ ID: id, Token: token() })
  );
  return res?.data;
}

/** 全部权限列表（分配权限表格） */
export async function getPermissionList() {
  const res = await request.get('/Commons/getPermissionList', {
    params: { Token: token() }
  });
  return unwrapList(res);
}

/** 权限组已分配权限 */
export async function getPermissionListByGroupsID(groupID) {
  const res = await request.get('/Commons/getPermissionListByGroupsID', {
    params: { groupID, Token: token() }
  });
  return unwrapList(res);
}

/** 树形权限列表（新分配权限） */
export async function getPermissionListByTree() {
  const res = await request.get('/Commons/getPermissionListByTree', {
    params: { Token: token() }
  });
  return unwrapList(res);
}

/** 保存权限组-权限关联 */
export async function correlationGroupsPermissions(groupID, ids) {
  const res = await request.post(
    '/Commons/correlationGroups_Permissions',
    formdataify({
      groupID,
      array: ids,
      Token: token()
    })
  );
  return res?.data;
}
