import { MessageBox } from 'element-ui';
import { idleExpireMsg } from '@/utils/login-expire-msg';

export default class RequestTimeoutManager {
  constructor(timeoutMs, logoutCallback) {
    this.timeoutMs = timeoutMs;
    this.logoutCallback = logoutCallback;
    this.lastRequestTime = Date.now();
    this.timer = null;
  }

  updateLastRequestTime() {
    this.lastRequestTime = Date.now();
  }

  startTimer() {
    this.clearTimer();

    const checkInterval = 60 * 1000;

    const checkTimeout = () => {
      const currentTime = Date.now();

      if (currentTime - this.lastRequestTime >= this.timeoutMs) {
        this.clearTimer();
        MessageBox.alert(idleExpireMsg(this.timeoutMs), '登录提示', {
          confirmButtonText: '重新登录',
          showClose: false,
          callback: (action) => {
            if (action === 'confirm') {
              this.logoutCallback();
            }
          },
          beforeClose: () => {
            MessageBox.close();
          }
        });
      } else {
        this.timer = setTimeout(checkTimeout, checkInterval);
      }
    };

    this.timer = setTimeout(checkTimeout, checkInterval);
  }

  // 清除定时器
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
