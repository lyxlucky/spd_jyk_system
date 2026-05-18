import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
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

/** GS1 溯源列表（GET，与旧 layui table 一致） */
export async function searchGs1({ page, size, where = {}, field = '', order = '' }) {
  const res = await request.get('/GS1/Search', {
    params: {
      Token: token(),
      page: page || 1,
      size: size || 10,
      condition: where.condition ?? '',
      bhOrYs: where.bhOrYs ?? '',
      IsEnd: where.IsEnd ?? '',
      field: field || '',
      order: order || '',
      startTime: where.startTime ?? '',
      endTime: where.endTime ?? '',
      Storage: where.Storage ?? ''
    }
  });
  return unwrap(res);
}

/** 定数码追溯明细 */
export async function traceGs1(defNoPkgCode, storageId) {
  const res = await request.get('/GS1/Trace', {
    params: {
      Token: token(),
      defNoPkgCode: defNoPkgCode || '',
      storageId: storageId ?? ''
    }
  });
  return unwrap(res);
}

export async function getStorageList() {
  const res = await request.get('/Commons/getSTORAGE', {
    params: { Token: token() }
  });
  return unwrap(res);
}
