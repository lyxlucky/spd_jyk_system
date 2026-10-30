import { MessageBox } from 'element-ui';
import router from '@/router';
import { logout } from '@/utils/page-tab-util';
import { LAYOUT_PATH } from '@/config/setting';
import { resolveLoginExpireMsg } from '@/utils/login-expire-msg';

let loginExpiredShown = false;

export function isLoginExpired(data) {
  if (data == 301 || data === '301') {
    return true;
  }
  const code = data?.code;
  const msg = String(data?.msg || data?.message || '');
  if (code == 301 || code === '301') {
    return true;
  }
  return /登录失效|登录被顶号|登录过期|空闲超时|重新登录|登录超时|请重新登录/.test(msg);
}

export function showLoginExpiredDialog(data) {
  if (loginExpiredShown) {
    return;
  }
  loginExpiredShown = true;
  const currentPath = router.currentRoute.path;
  if (currentPath === LAYOUT_PATH) {
    logout(true);
    loginExpiredShown = false;
    return;
  }
  const tip = resolveLoginExpireMsg(data);
  MessageBox.alert(tip, '登录提示', {
    confirmButtonText: '重新登录',
    showClose: false,
    callback: (action) => {
      loginExpiredShown = false;
      if (action === 'confirm') {
        logout(false, currentPath);
      }
    },
    beforeClose: () => {
      MessageBox.close();
    }
  });
}

export function unwrapResponse(res) {
  const data = res.data;
  if (isLoginExpired(data)) {
    showLoginExpiredDialog(data);
    return Promise.reject(data);
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  return Promise.reject(data);
}
