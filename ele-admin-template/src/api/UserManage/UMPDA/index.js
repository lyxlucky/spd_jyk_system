import request from '@/utils/request';
import { formdataify, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

/** PDA 账号列表 */
export async function getPdaUserList(where, page, size) {
  const res = await request.get('/PDAAuth/GetUserList', {
    params: {
      username: where?.username ?? '',
      page,
      size,
      Token: token()
    }
  });
  const data = res?.data;
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '查询失败');
}

/** PDA 账号详情 */
export async function getPdaInfo(id) {
  const res = await request.get('/PDAAuth/PDAInfo', {
    params: { ID: id }
  });
  const data = res?.data;
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '查询失败');
}

/** 新增 PDA 账号（multipart/form-data，与旧页 FormData 一致） */
export async function setUpAccount(fields) {
  const res = await request.post(
    '/PDAAuth/SetUpAccount',
    formdataify({ ...fields, Token: token() })
  );
  return res?.data;
}

/** 编辑 PDA 账号（x-www-form-urlencoded，与旧页 $.ajax data 对象一致） */
export async function editAccount(fields) {
  const res = await request.post(
    '/PDAAuth/EditAccount',
    toUrlEncodedBody({ ...fields, Token: token() }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res?.data;
}

/** 删除 PDA 账号 */
export async function deleteAccount(id) {
  const res = await request.post('/PDAAuth/DeleteAccount', null, {
    params: { ID: id, Token: token() }
  });
  return res?.data;
}
