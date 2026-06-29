import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Decrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrapList(res) {
  const isEncrypt = store.state.user.isEncrypt;
  let data = res.data;
  if (isEncrypt && data?.devData) {
    data = JSON.parse(Decrypt(data.devData));
  }
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return {
      total: Number(data.total) || 0,
      result: data.result || []
    };
  }
  // 后端无数据时可能返回 400 + total:0
  if ((data?.code == 400 || data?.code === '400') && !Number(data.total)) {
    return { total: 0, result: [] };
  }
  throw new Error(data?.msg || '查询失败');
}

/** 品种修改日志（旧页 api/AAPDDATE/GetVarUpLog） */
export async function getVarUpLogList(params) {
  const res = await request.get('/AAPDDATE/GetVarUpLog', {
    params: {
      Token: token(),
      search: params.search ?? '',
      search2: params.search2 ?? '',
      Operator: params.Operator ?? '',
      Varuplog_TimeStart: params.Varuplog_TimeStart ?? '',
      Varuplog_TimeEnd: params.Varuplog_TimeEnd ?? '',
      page: params.page ?? 1,
      size: params.size ?? 20
    }
  });
  return unwrapList(res);
}
