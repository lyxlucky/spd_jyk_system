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
    code: where.code ?? '',
    statu: where.statu ?? '',
    minPricePk: where.minPricePk ?? '',
    avgPricePk: where.avgPricePk ?? '',
    examplePricePk: where.examplePricePk ?? '',
    varietieStatu: where.varietieStatu ?? '',
    supplierCode: where.supplierCode ?? '',
    inventoryStatu: where.inventoryStatu ?? '',
    page,
    size
  };
}

/** 阳光采购平台比价列表 */
export async function getTableList(where, page = 1, size = 20) {
  const res = await request.post('/YGCG/getTableList', formdataify(buildFields(where, page, size)));
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 更新备货价格配置 */
export async function updateConfig(config) {
  const res = await request.post(
    '/YGCG/updateConfig',
    formdataify({ Token: token(), config: config ?? '' })
  );
  return unwrap(res);
}

/** 导入阳光平台比价 Excel */
export async function importExcel(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/YGCG/importExcel', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}
