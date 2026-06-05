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
    MEDICAL_INSURANCE_CODE: where.MEDICAL_INSURANCE_CODE ?? '',
    NAME_OF_MEDICAL_INSURANCE_CATA: where.NAME_OF_MEDICAL_INSURANCE_CATA ?? '',
    GENERIC_NAME_FOR_HEALTH_INSURA: where.GENERIC_NAME_FOR_HEALTH_INSURA ?? '',
    CONSUMABLES_ENTERPRISES: where.CONSUMABLES_ENTERPRISES ?? '',
    REGISTRATION_RECORD_NUMBER: where.REGISTRATION_RECORD_NUMBER ?? '',
    page,
    size
  };
}

/** 深圳医保目录列表 */
export async function getHealthInsuranceDirectory(where, page = 1, size = 100) {
  const res = await request.post(
    '/Abdzczh/healthInsuranceDirectory',
    formdataify(buildFields(where, page, size))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 导入深圳医保目录 */
export async function importHealthInsurance(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await request.post(
    `/Abdzczh/ImportHealthInsurance?Token=${encodeURIComponent(token())}`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return unwrap(res);
}

/** 剔除目录 */
export async function deleteHealthDirectory(ids) {
  const res = await request.post(
    '/Abdzczh/DeletehelthTory',
    formdataify({ Token: token(), ID: ids })
  );
  return unwrap(res);
}
