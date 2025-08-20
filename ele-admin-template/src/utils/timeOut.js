import { MessageBox } from 'element-ui';

export default class RequestTimeoutManager {
  constructor(timeoutMs, logoutCallback) {
    // this.timeoutMs = 1000; // 超时时间，1小时 = 3600000 毫秒
    this.timeoutMs = timeoutMs; // 超时时间，1小时 = 3600000 毫秒
    this.logoutCallback = logoutCallback; // 超时后的回调函数
    this.lastRequestTime = Date.now(); // 最后一次请求的时间
    this.timer = null; // 定时器
    //this.startTimer();
  }

  // 更新最后请求时间
  updateLastRequestTime() {
    this.lastRequestTime = Date.now();
    // 不需要重新启动定时器，定时器会定期检查
  }

  // 启动定时器
  startTimer() {
    // 清除现有定时器
    this.clearTimer();
    
    // 使用间隔检查，每分钟检查一次是否超时
    const checkInterval = 60 * 1000; // 1分钟检查一次
    
    const checkTimeout = () => {
      const currentTime = Date.now();
      // console.log(currentTime - this.lastRequestTime, this.timeoutMs)

      if (currentTime - this.lastRequestTime >= this.timeoutMs) {
        console.log(currentTime - this.lastRequestTime, this.timeoutMs)
        this.clearTimer();
        MessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
          confirmButtonText: '重新登录',
          showClose: false,
          callback: (action) => {
            if (action === 'confirm') {
              this.logoutCallback(); // 触发退出逻辑
            }
          },
          beforeClose: () => {
            MessageBox.close();
          }
        });
      } else {
        // 如果还没超时，继续检查
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
