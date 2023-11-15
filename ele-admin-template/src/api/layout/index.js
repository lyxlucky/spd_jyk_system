import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';


/**
 * 获取当前登录的用户信息、菜单、权限、角色
 */
export async function getUserInfo(data) {
  var resData = {};
  resData.username = data.username;
  resData.password = data.password;
  resData.Token = sessionStorage.getItem('Token');
  const res = await request.post('/Commons/login', resData);
  if (res.data.code == 200 && res.data.result) {
    return res.data.result;
  } else if (res.data.code == 400) {
    sessionStorage.removeItem(TOKEN_STORE_NAME);
    location.reload();
    return Promise.reject(new Error("登录已过期，请重新登录!"));
  } else {
    this.$message.error(res.data.msg);
    return Promise.error(new Error(res.data.msg));
  }
}

/**
 * 修改当前登录的用户密码
 */
export async function updatePassword(data) {
  const res = await request.put('/auth/password', data);
  if (res.data.code === 0) {
    return res.data.message ?? '修改成功';
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询未读通知
 */
export async function getUnreadNotice() {
  return {
    notice: [
    ],
    letter: [
    ],
    todo: [
    ]
  };
}
