import request from '@/utils/request';
import CryptoJS from 'crypto-js';
import store from '@/store';
import { setToken } from '@/utils/token-util';
import { TOKEN_STORE_NAME } from '@/config/setting';

/**
 * 登录
 */
export async function login(data) {
  // data.tenantId = 1; // 租户id
  data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data.username = Encrypt(data.username) != null ? Encrypt(data.username) : store.state.user.loginInfo.username;
  data.password = Encrypt(data.password) != null ? Encrypt(data.password) : store.state.user.loginInfo.password;
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

// 加密
export function Encrypt(str) {
  var KEY = store.state.user.encrypted.KEY; //32位
  var IV = store.state.user.encrypted.IV; //16位

  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);

  var encrypted = '';

  var srcs = CryptoJS.enc.Utf8.parse(str);
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString();
};

// 解密
export function Decrypt(str) {
  var KEY = store.state.user.encrypted.KEY; //32位
  var IV = store.state.user.encrypted.IV; //16位
  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);
  var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}