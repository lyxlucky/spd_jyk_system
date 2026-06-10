import request from '@/utils/request';
import { formdataify, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

/** BaseParam / UserStorageDTO 等需 x-www-form-urlencoded，与旧页 $.post 一致 */
function postUrlEncoded(path, fields) {
  return request.post(path, toUrlEncodedBody(fields), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
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

/** 用户列表 */
export async function getUserList(where, page, size) {
  const res = await request.get('/Commons/getUserList', {
    params: {
      username: where?.username ?? '',
      dept: where?.dept ?? '',
      qx: where?.qx ?? '',
      sup: where?.sup ?? '',
      page,
      size,
      Token: token()
    }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 删除用户 */
export async function delUserByID(id) {
  const res = await request.post(
    '/Commons/DelUserByID',
    formdataify({ ID: id, Token: token() })
  );
  return res.data;
}

/** 用户详情 */
export async function getUserByID(id) {
  const res = await request.get('/Commons/getUserByID', {
    params: { ID: id, Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 新增用户 */
export async function addUser(data) {
  const res = await request.post('/Commons/AddUser', formdataify({
    Token: token(),
    UserName: data.UserName,
    Password: data.Password,
    Nickname: data.Nickname,
    Supplier_ID: data.Supplier_ID ?? '0',
    AesKey: data.AesKey,
    POSITION: data.POSITION ?? '',
    jypass: data.jypass,
    isForce: data.isForce ?? '0'
  }));
  return unwrap(res);
}

/** 更新用户资料 */
export async function updateUser(data) {
  const res = await request.post(
    '/Commons/UpdateUser',
    formdataify({
      Token: token(),
      ID: data.ID,
      Nickname: data.Nickname,
      Supplier_ID: data.Supplier_ID ?? '0',
      POSITION: data.POSITION ?? ''
    })
  );
  return res.data;
}

/** 修改密码 */
export async function updateUserPassword(data) {
  const res = await request.post(
    '/Commons/UpdateUserPassword',
    formdataify({
      Token: token(),
      ID: data.ID,
      Password: data.Password,
      AesKey: data.AesKey,
      user: data.user ?? '',
      jypass: data.jypass
    })
  );
  const body = res.data;
  if (body?.code == 301) {
    throw new Error(body.msg || '登录失效');
  }
  if (body?.code == 200) {
    return body;
  }
  throw new Error(body?.msg || '修改失败');
}

/** 权限组列表 */
export async function getGroupsList() {
  const res = await request.get('/Commons/getGroupsList', {
    params: { Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 分配权限组 */
export async function correlationUserGroups(userID, groupID) {
  const res = await request.post(
    '/Commons/correlationUser_Groups',
    formdataify({
      Token: token(),
      userID,
      groupID
    })
  );
  return res.data;
}

/** 组内权限列表 */
export async function getPermissionListByUID(groupID, uid) {
  const res = await request.get('/Commons/getPermissionListByUID', {
    params: { groupID, UID: uid, Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 保存组内排除权限 */
export async function notInGroupPost(userId, postData) {
  const res = await request.post(
    '/Commons/NotInGroupPost',
    formdataify({
      Token: token(),
      userId,
      postData
    }),
    { timeout: 30000 }
  );
  return unwrap(res);
}

/** 用户已分配科室 */
export async function getDeptTwoByUserID(userID) {
  const res = await request.get('/Commons/getDeptTwoByUserID', {
    params: { userID, Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 科室分页（分配科室左侧） */
export async function getDeptListPage(deptTwoName, assignUserId, prioritySort = 'asc') {
  const res = await request.get('/Commons/GetDeptListPage', {
    params: {
      deptTwoName,
      assignUserId,
      prioritySort,
      Token: token()
    }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 保存分配科室 */
export async function correlationUserDept(userID, deptAssign) {
  const res = await request.post(
    '/Commons/correlationUser_Dept',
    formdataify({
      Token: token(),
      userID,
      deptAssign: JSON.stringify(deptAssign)
    })
  );
  return res.data;
}

/** 耗材类别列表 */
export async function getUMUvarType() {
  const res = await request.get('/Commons/GetUMUvarType', {
    params: { Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 用户已分配耗材类别 */
export async function getUvarTypeByUserID(userID) {
  const res = await request.get('/Commons/getUvarTypeByUserID', {
    params: { userID, Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 保存耗材类别 */
export async function correlationUserVarType(userID, typeIds) {
  const res = await request.post(
    '/Commons/correlationUser_varTypeOb',
    formdataify({
      Token: token(),
      userID,
      array: JSON.stringify(typeIds)
    })
  );
  return res.data;
}

/** 全部院区 */
export async function getAllStorage() {
  const res = await postUrlEncoded('/Commons/getAllStorage', { Token: token() });
  if (res.data?.code == 200) {
    return res.data;
  }
  throw new Error(res.data?.msg || '查询失败');
}

/** 分配院区 */
export async function deliveryStorage(userId, storageId) {
  const res = await postUrlEncoded('/Commons/deliveryStorage', {
    Token: token(),
    userId: String(userId ?? ''),
    storageId: String(storageId ?? '')
  });
  return res.data;
}

/** 科室库区列表 */
export async function getDeptTwoRegion(userID) {
  const res = await postUrlEncoded('/Commons/GetDeptTwoRegion', {
    Token: token(),
    USER_ID: String(userID ?? '')
  });
  if (res.data?.code == 200) {
    return res.data;
  }
  throw new Error(res.data?.msg || '查询失败');
}

/** 用户已分配科室库区 */
export async function getDeptTwoRegionByUserID(userID) {
  const res = await request.get('/Commons/GetDeptTwoRegionByUserID', {
    params: { userID, Token: token() }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 保存科室库区 */
export async function addDeptTwoRegion(userID, regionCodes) {
  const res = await request.post(
    '/Commons/AddDeptTwoRegion',
    formdataify({
      Token: token(),
      userID,
      array: JSON.stringify(regionCodes)
    })
  );
  return res.data;
}

/** 供应商列表 */
export async function getSupplierList() {
  const res = await request.get('/Supplier/GetList', {
    params: {
      keyword: '',
      page: 1,
      size: 9999,
      field: '',
      order: '',
      enable: 1,
      state: '',
      Token: token()
    }
  });
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}

/** 北京人民 - 人员查询 */
export async function listEmployee(where, page, size) {
  const res = await request.post(
    '/PekingApplication/listEmployee',
    formdataify({
      Token: token(),
      employeeCode: where?.employeeCode ?? '',
      employeeName: where?.employeeName ?? '',
      page,
      size
    })
  );
  if (res.data.code == 200) {
    return res.data;
  }
  throw new Error(res.data.msg || '查询失败');
}
