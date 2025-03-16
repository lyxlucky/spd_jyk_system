import { MessageBox } from 'element-ui';

export default class RequestTimeoutManager {
  constructor(timeoutMs, logoutCallback) {
    this.timeoutMs = timeoutMs; // 超时时间，1小时 = 3600000 毫秒
    this.logoutCallback = logoutCallback; // 超时后的回调函数
    this.lastRequestTime = Date.now(); // 最后一次请求的时间
    this.timer = null; // 定时器
    //this.startTimer();
  }

  // 更新最后一次请求的时间
  updateLastRequestTime() {
    this.lastRequestTime = Date.now();
    this.resetTimer();
  }

  // 启动定时器
  startTimer() {
    this.timer = setTimeout(() => {
      const currentTime = Date.now();
      if (currentTime - this.lastRequestTime >= this.timeoutMs) {
        MessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
          confirmButtonText: '重新登录',
          callback: (action) => {
            if (action === 'confirm') {
              this.logoutCallback(); // 触发退出逻辑
            }
          },
          beforeClose: () => {
            MessageBox.close();
          }
        });
      }
    }, this.timeoutMs);
  }

  // 重置定时器
  resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

  // 清除定时器
  clearTimer() {
    clearTimeout(this.timer);
  }
}
