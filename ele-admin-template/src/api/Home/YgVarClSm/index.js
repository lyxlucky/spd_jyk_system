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

function buildListFields(where, page, size, wjAuthJson) {
  return {
    Token: token(),
    VARIETIE_CODE_NEW: where.VARIETIE_CODE_NEW ?? '',
    VARIETIE_NAME: where.VARIETIE_NAME ?? '',
    GGXH: where.GGXH ?? '',
    SOURCE_FROM: where.SOURCE_FROM ?? '',
    ISDM: where.ISDM ?? '',
    SUPPLIER_NAME: where.SUPPLIER_NAME ?? '',
    IS_CHARGE: where.IS_CHARGE ?? '',
    SENDYB_STATE: where.SENDYB_STATE ?? '',
    YGVARCL_END_END: where.YGVARCL_END_END ?? '',
    YGVARCL_END_START: where.YGVARCL_END_START ?? '',
    APPROVAL_NUMBER: where.APPROVAL_NUMBER ?? '',
    APPROVAL_NAME: where.APPROVAL_NAME ?? '',
    YBBIAOJI: where.YBBIAOJI ?? '',
    ygCode: where.ygCode ?? '',
    REMARK: where.REMARK ?? '',
    TYPE: where.TYPE ?? '',
    WJ_AUTH: wjAuthJson,
    page,
    size
  };
}

/** 物价目录审核(萨米)列表 */
export async function getYbClInfo(where, page, size, wjAuthJson) {
  const res = await request.post(
    '/Abdzczh/GetYbClIngo',
    formdataify(buildListFields(where, page, size, wjAuthJson))
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 提交审批 */
export async function tjybspCommit(rows, type, bz = '') {
  const res = await request.post(
    '/VarietieBasicInfo/tjybspCommit',
    formdataify({
      Token: token(),
      json: JSON.stringify(rows || []),
      type: String(type),
      BZ: bz ?? ''
    }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 暂挂/取消暂挂 */
export async function zanGuaCommit(rows, type) {
  const res = await request.post(
    '/VarietieBasicInfo/zanGuaCommit',
    formdataify({
      Token: token(),
      json: JSON.stringify(rows || []),
      type: String(type)
    }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 一键审批 */
export async function appYbClInfoOneKey(where, type, wjAuthJson) {
  const res = await request.post(
    '/Abdzczh/appYbClIngoOneKey',
    formdataify({
      ...buildListFields(where, 1, 1, wjAuthJson),
      type: String(type)
    }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 备注 */
export async function smHandleRemark(ids, text) {
  const res = await request.post(
    '/VarietieBasicInfo/smHandleRemark',
    formdataify({ Token: token(), ids, text: text ?? '' })
  );
  return unwrap(res);
}

/** 修改提交类型 */
export async function smUpdateSubmitType(ids, type) {
  const res = await request.post(
    '/AAPDDATE/smUpdateSubmitType',
    formdataify({ Token: token(), ids, type: String(type) })
  );
  return unwrap(res);
}

/** 同步计费编码 */
export async function smSyncHis() {
  const res = await request.post('/AAPDDATE/smSyncHis', formdataify({ Token: token() }));
  return unwrap(res);
}

/** 准入推送至 HIS */
export async function smSendHis() {
  const res = await request.post('/AAPDDATE/smSendHis', formdataify({ Token: token() }));
  return unwrap(res);
}
