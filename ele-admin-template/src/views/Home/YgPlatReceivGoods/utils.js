export function formatIsJc(value) {
  return value == 1 || value === '1' ? '是' : '否';
}

export function formatYgCanSend(value) {
  return value == 1 || value === '1' ? '已发送' : '未发送';
}
