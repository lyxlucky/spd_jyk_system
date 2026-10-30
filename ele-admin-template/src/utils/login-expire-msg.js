/**
 * 登录断开提示文案（与后端 LoginExpireHelper 前缀对齐，便于按提示排查）
 *
 * 【空闲超时】前端长时间无接口请求
 * 【登录被顶号】其他端 / 新老系统同账号重新登录
 * 【登录过期】Token 有效期到期且未续期
 * 【登录失效-无凭证】本地 Token 丢失
 * 【登录失效】其它/未区分原因
 */

export const LOGIN_EXPIRE_FALLBACK =
  '【登录失效】可能被其他端或新/老系统同账号重新登录顶号，或Token已过期，请重新登录';

export function idleExpireMsg(timeoutMs) {
  const hours = Math.max(1, Math.round((Number(timeoutMs) || 0) / 3600000));
  return `【空闲超时】超过约${hours}小时未向服务器请求，前端已自动退出（不是被顶号）。请重新登录`;
}

export function resolveLoginExpireMsg(data) {
  const raw = data?.msg || data?.message || '';
  const text = String(raw).trim();
  if (text) {
    return text;
  }
  return LOGIN_EXPIRE_FALLBACK;
}
