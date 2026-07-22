import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

/** 中七拦截品种列表 */
export async function QueryReceiveZQ({
  varietieCode = '',
  varietieName = '',
  page = 1,
  size = 100,
  field = '',
  order = '',
  ReceiveState = 2
} = {}) {
  const res = await request.get('/VarietieBasicInfo/QueryReceiveZQ', {
    params: {
      Token: token(),
      varietieCode: varietieCode || '',
      varietieName: varietieName || '',
      page,
      size,
      field: field || '',
      order: order || '',
      ReceiveState
    }
  });
  return unwrap(res);
}

/** 拦截品种允许进入系统 */
export async function UpVarsReceiveState(varietieCodes) {
  const res = await request.post(
    '/VarietieBasicInfo/UpVarsReceiveState',
    formdataify({
      Token: token(),
      json: JSON.stringify(varietieCodes || [])
    })
  );
  return unwrap(res);
}
