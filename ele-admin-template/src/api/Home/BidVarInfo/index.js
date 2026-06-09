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

function buildSearchFields(where, page, size) {
  return {
    Token: token(),
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW ?? '',
    PROD_REGISTRATION_NAME: where.PROD_REGISTRATION_NAME ?? '',
    APPROVAL_NUMBER: where.APPROVAL_NUMBER ?? '',
    SUP_NAME: where.SUP_NAME ?? '',
    USE_DEPT: where.USE_DEPT ?? '',
    IS_ENABLE: where.IS_ENABLE ?? '',
    IS_USE: where.IS_USE ?? '',
    IS_HAVE: where.IS_HAVE ?? '',
    HIGH_OR_LOW_CLASS: where.HIGH_OR_LOW_CLASS ?? '',
    HIGH_CLASS_XH: where.HIGH_CLASS_XH ?? '',
    IS_PRICE: where.IS_PRICE ?? '',
    KC: where.KC ?? '',
    GG: where.GG ?? '',
    MANUFACTURING_ENT_NAME: where.MANUFACTURING_ENT_NAME ?? '',
    IS_IN_COUNTRY_IMPORT: where.IS_IN_COUNTRY_IMPORT ?? '',
    CONTRACT_CODE: where.CONTRACT_CODE ?? '',
    CREATE_BATCH: where.CREATE_BATCH ?? '',
    CREATE_BATCH2: where.CREATE_BATCH2 ?? '',
    start_time: where.start_time ?? '',
    end_time: where.end_time ?? '',
    page,
    size
  };
}

/** 中标目录列表 */
export async function searchBidVarInfo(where, page = 1, size = 30) {
  const res = await request.post(
    '/VarietieBasicInfo/searchBID_VAR_INFO',
    formdataify(buildSearchFields(where, page, size))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 按 ID 查询单条（编辑） */
export async function searchBidVarInfoById(id) {
  const res = await request.post(
    '/VarietieBasicInfo/searchBID_VAR_INFOByID',
    formdataify({ Token: token(), ID: String(id ?? '') })
  );
  const data = unwrap(res);
  return (data.result || [])[0] || null;
}

/** 更新中标信息 */
export async function updateBidVarInfo(payload) {
  const fields = { Token: token(), ...payload };
  const res = await request.post('/VarietieBasicInfo/UpdataBidVarInfo', formdataify(fields));
  return unwrap(res);
}

/** 更新备注 */
export async function updateBidVarInfoBz(id, remark) {
  const res = await request.post(
    '/VarietieBasicInfo/UpdateBidVarInfoBZ',
    formdataify({ Token: token(), ID: String(id ?? ''), REMARK: remark ?? '' })
  );
  return unwrap(res);
}

/** 批量备注 */
export async function bidVarUpLargeBz(ids, remark) {
  const res = await request.post(
    '/VarietieBasicInfo/BID_VAR_UpLarge_BZ',
    formdataify({ Token: token(), ID: ids, REMARK: remark ?? '' })
  );
  return unwrap(res);
}

/** 启用/停用 */
export async function bidVarInfoEnableCommit(rows, state) {
  const res = await request.post(
    '/VarietieBasicInfo/BID_VAR_INFOIsEnbaleCommit',
    formdataify({
      Token: token(),
      json: JSON.stringify(rows || []),
      state: String(state)
    })
  );
  return unwrap(res);
}

/** 同步品种字段 */
export async function synchVarByBidVarInfo(ids, updataField) {
  const res = await request.post(
    '/VarietieBasicInfo/SynchVarByBidVarInfo',
    formdataify({
      Token: token(),
      IDS: ids,
      updataField: JSON.stringify(updataField || {})
    })
  );
  return unwrap(res);
}

/** 同步新增品种 */
export async function synchAddVar(rows) {
  const res = await request.post(
    '/VarietieBasicInfo/SynchAddVar',
    formdataify({ Token: token(), updata: JSON.stringify(rows || []) })
  );
  return unwrap(res);
}

/** 导入中标目录 */
export async function importBidVar(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/VarietieBasicInfo/ImportBIDVAR', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** 批量停用导入 */
export async function importBidVarBatchStop(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/VarietieBasicInfo/ImportBidVarBatchStopState', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}
