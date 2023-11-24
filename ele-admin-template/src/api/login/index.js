import request from '@/utils/request';
import { setToken } from '@/utils/token-util';
import { TOKEN_STORE_NAME } from '@/config/setting';

/**
 * 登录
 */
export async function login(data) {
  // data.tenantId = 1; // 租户id
  data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const res = await request.post('/Commons/login', data);
  if (res.data.code == 200) {
    var data2 = {};
    data2.username = res.data.result.UserName;
    data2.password = res.data.result.Password;
    data2.token = '199411@Abc';
    await request
      .post('/Commons/GetToken', data2)
      .then((res) => {
        if (res.data.code == 200) {
          setToken(res.data.token, 0);
        }
      });
    return res.data;
  } else {
    sessionStorage.clear();
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 获取Token
 */
export async function getToken(username, password, Token) {
  const res = await request.post('/Commons/GetToken', {
    username,
    password,
    Token
  });

  if (res.data.code == 200) {
    return res.data.data;
  } else if (res.data.code == 400) {
    return Promise.reject(new Error(res.data.msg));
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 获取验证码
 */
export async function getCaptcha() {
  const res = await request.get('/Commons/getCaptcha');
  if (res.data.code == 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
