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

function buildFields(where, page, size) {
  return {
    Token: token(),
    CONSUMABLES_CLASS_CODE: where.CONSUMABLES_CLASS_CODE ?? '',
    MEDICARE_GENERIC_NAME: where.MEDICARE_GENERIC_NAME ?? '',
    CATEGORY_ID: where.CATEGORY_ID ?? '',
    page,
    size
  };
}

/** 第一批高值医用耗材目录列表 */
export async function getHighValueConsumablesList(where, page = 1, size = 20) {
  const res = await request.post(
    '/Abdzczh/GetHighValueConsumables',
    formdataify(buildFields(where, page, size))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 同步分类代码 */
export async function syncVarConsumableType() {
  const res = await request.post(
    '/Abdzczh/SyncVarConsumableType',
    formdataify({ Token: token() })
  );
  return unwrap(res);
}
