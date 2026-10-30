/**
 * axios 实例
 */
import axios from 'axios';
import router from '@/router';
import { MessageBox, Message } from 'element-ui';
import { API_BASE_URL, TOKEN_HEADER_NAME, LAYOUT_PATH, REQUEST_TIMEOUT } from '@/config/setting';
import { getToken, setToken } from './token-util';
import { logout } from './page-tab-util';
import RequestTimeoutManager from '@/utils/timeOut';
import { resolveLoginExpireMsg } from '@/utils/login-expire-msg';

// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
const service = axios.create({
  baseURL: API_BASE_URL,
  // 请求超时时间：2 分钟。超时会让 Promise 正常 reject，
  // 组件里的 finally 才能关掉 loading 遮挡层，避免一直卡住。
  timeout: 2 * 60 * 1000
});

/**
 * 添加请求拦截器
 */
const requestTimeoutManager = new RequestTimeoutManager(REQUEST_TIMEOUT, logout);

service.interceptors.request.use(
  (config) => {
    // 添加 token 到 header
    const token = getToken();
    if (token && config.headers) {
      config.headers.common[TOKEN_HEADER_NAME] = token;
      // 只在第一次启动定时器，后续请求只更新时间
      if (!requestTimeoutManager.timer) {
        requestTimeoutManager.startTimer();
      } else {
        // 更新最后请求时间，重置定时器
        requestTimeoutManager.updateLastRequestTime();
      }
      // config.headers.common[TOKEN_HEADER_NAME] = 'text/html, application/xhtml+xml';
      // config.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
      // config.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  (res) => {
    // 登录失效：优先展示后端诊断文案（顶号/过期/无凭证）
    if (res.data?.code === 301 || res.data?.code === '301') {
      const currentPath = router.currentRoute.path;
      const tip = resolveLoginExpireMsg(res.data);
      if (currentPath === LAYOUT_PATH) {
        logout(true);
      } else {
        MessageBox.alert(tip, '登录提示', {
          confirmButtonText: '重新登录',
          showClose: false,
          callback: (action) => {
            if (action === 'confirm') {
              logout(false, currentPath);
            }
          },
          beforeClose: () => {
            MessageBox.close();
          }
        });
      }
      return Promise.reject(new Error(tip));
    }

    const isHaveToken = getToken();
    if (isHaveToken) {
      requestTimeoutManager.updateLastRequestTime();
    }
    // token 自动续期
    const token = res.headers[TOKEN_HEADER_NAME.toLowerCase()];
    if (token) {
      setToken(token);
    }
    return res;
  },
  (error) => {
    // 请求超时：axios 触发 timeout 时 error.code 为 ECONNABORTED
    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      /timeout/i.test(error?.message || '');
    if (isTimeout) {
      // 统一成中文提示，避免各页面直接显示 timeout of xxx ms exceeded
      error.msg = '请求超时，请刷新重试';
      Message.error(error.msg);
    }
    return Promise.reject(error);
  }
);

export default service;
