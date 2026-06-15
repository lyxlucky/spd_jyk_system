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

function buildQuery(where, page, size) {
  return {
    Token: token(),
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW ?? '',
    VARIETIE_NAME: where.VARIETIE_NAME ?? '',
    page: page || 1,
    size: size || 100
  };
}

/** 集采品种列表 */
export async function getVarietieJCData({ page, limit, where }) {
  const res = await request.post(
    '/VarietieBasicInfo/getVarietieJCData',
    formdataify(buildQuery(where || {}, page, limit))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 更新集采品种 */
export async function upVarJCData(payload) {
  const res = await request.post(
    '/VarietieBasicInfo/UpVarJCData',
    formdataify({
      Token: token(),
      ID: String(payload.ID ?? ''),
      PRICE: String(payload.PRICE ?? ''),
      JC_START_TIME: payload.JC_START_TIME ?? '',
      JC_END_TIME: payload.JC_END_TIME ?? '',
      REMARK: payload.REMARK ?? '',
      STATE: String(payload.STATE ?? '1')
    })
  );
  return unwrap(res);
}

/** 批量剔除集采品种 */
export async function delVarietieJCData(ids) {
  const res = await request.post(
    '/VarietieBasicInfo/DelVarietieJCData',
    formdataify({
      Token: token(),
      ID: Array.isArray(ids) ? ids.join(',') : String(ids ?? '')
    })
  );
  return unwrap(res);
}

/** 导入集采品种 Excel */
export async function importVarJCExcel(file, nickname) {
  const fd = new FormData();
  fd.append('FILE', file);
  fd.append('Token', token());
  fd.append('nikename', nickname || '');
  const res = await request.post('/VarietieBasicInfo/ImportVarJCExcel', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** 更新月结集采信息 */
export async function upJcMonth(month) {
  const res = await request.post(
    '/VarietieBasicInfo/upJcMonth',
    formdataify({
      Token: token(),
      Month: month ?? ''
    })
  );
  return unwrap(res);
}
