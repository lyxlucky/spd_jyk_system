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
    Search: where.Search ?? '',
    PJ_NAME: where.PJ_NAME ?? '',
    VARIETIE_NAME: where.VARIETIE_NAME ?? '',
    SPECIFICATION_OR_TYPE: where.SPECIFICATION_OR_TYPE ?? '',
    MATERIALS_CODE: where.MATERIALS_CODE ?? '',
    GY_CS_IsPrice: where.GY_CS_IsPrice ?? '',
    IS_ENABLE: where.IS_ENABLE ?? '',
    IS_CHARGE: where.IS_CHARGE ?? '',
    HIS_STATE: where.HIS_STATE ?? '',
    page,
    size
  };
}

/** HIS计费目录列表 */
export async function getGyClmlSpdList(where, page = 1, size = 20) {
  const res = await request.post(
    '/Abdzczh/GY_CLML_SPDINFO',
    formdataify(buildFields(where, page, size))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}
