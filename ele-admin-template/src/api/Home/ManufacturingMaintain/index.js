import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function ok(res) {
  const c = res?.data?.code;
  return c === 200 || c === '200';
}

/** 查询生产企业列表 */
export async function getManufacturingList(params) {
  const fd = formdataify({
    Token: getToken(),
    MANUFACTURING_ENT_NAME: params.MANUFACTURING_ENT_NAME ?? '',
    startTime: params.startTime ?? '',
    endTime: params.endTime ?? '',
    page: String(params.page ?? 1),
    size: String(params.size ?? 20)
  });
  const res = await request.post('/ProdInfo/getMANUFACTURING_ENT', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 新增生产企业 */
export async function insertManufacturingEnt(payload) {
  const fd = formdataify({
    Token: getToken(),
    MANUFACTURING_ENT_NAME: payload.MANUFACTURING_ENT_NAME ?? '',
    MANUFACTURING_LICENSE: payload.MANUFACTURING_LICENSE ?? '',
    MANUFACTURING_LICENSE_TIME: payload.MANUFACTURING_LICENSE_TIME ?? '',
    MANUFACTURING_ADDRES: payload.MANUFACTURING_ADDRES ?? '',
    LICENSE_VALID: payload.LICENSE_VALID ?? '',
    MANUFACTURING_NUMBER: payload.MANUFACTURING_NUMBER ?? '',
    CREATE_MAN: payload.CREATE_MAN ?? ''
  });
  const res = await request.post('/ProdInfo/insertMANUFACTURING_ENT', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '新增失败'));
}

/** 修改生产企业 */
export async function updateManufacturingEnt(payload) {
  const fd = formdataify({
    Token: getToken(),
    ID: String(payload.ID ?? ''),
    MANUFACTURING_ENT_NAME: payload.MANUFACTURING_ENT_NAME ?? '',
    MANUFACTURING_LICENSE: payload.MANUFACTURING_LICENSE ?? '',
    MANUFACTURING_LICENSE_TIME: payload.MANUFACTURING_LICENSE_TIME ?? '',
    MANUFACTURING_ADDRES: payload.MANUFACTURING_ADDRES ?? '',
    LICENSE_VALID: payload.LICENSE_VALID ?? '',
    MANUFACTURING_NUMBER: payload.MANUFACTURING_NUMBER ?? '',
    isUpPro: payload.isUpPro ?? '1',
    CREATE_MAN: payload.CREATE_MAN ?? ''
  });
  const res = await request.post('/ProdInfo/upMANUFACTURING_ENT', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '修改失败'));
}

/** 删除生产企业 */
export async function deleteManufacturingEnt(payload) {
  const fd = formdataify({
    Token: getToken(),
    ID: String(payload.ID ?? ''),
    CREATE_MAN: payload.CREATE_MAN ?? ''
  });
  const res = await request.post('/ProdInfo/delMANUFACTURING_ENT', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '删除失败'));
}
