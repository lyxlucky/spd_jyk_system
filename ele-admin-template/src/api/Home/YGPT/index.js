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
    state: where.state ?? '0',
    search: where.search ?? '',
    is_yg_code: where.is_yg_code ?? '',
    is_yg_spe_code: where.is_yg_spe_code ?? '',
    YGPTis_MEDICAL_CODE: where.YGPTis_MEDICAL_CODE ?? '',
    YGPTis_MEDICAL_CODE27: where.YGPTis_MEDICAL_CODE27 ?? '',
    YGPTis_pro: where.YGPTis_pro ?? '',
    YGPTis_UDI: where.YGPTis_UDI ?? '',
    YGPTis_IS_CHARGE: where.YGPTis_IS_CHARGE ?? '',
    YGPT_ISENABLE: where.YGPT_ISENABLE ?? '',
    YGPT_YLQX: where.YGPT_YLQX ?? '',
    page: page || 1,
    size: size || 20
  };
}

/** 平台编码审核列表 */
export async function getYGPT({ page, limit, where }) {
  const res = await request.get('/ALhyyVar/GetYGPT', {
    params: buildQuery(where || {}, page, limit)
  });
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    result: data.result || []
  };
}

/** 审批通过（state 与旧页 sp_ygpt 一致：1全部 2阳光码 3医保 4省平台 5UDI） */
export async function approvalYGPT(rows, state) {
  const list = (rows || []).map((row) => ({ ID: row.ID }));
  const res = await request.post(
    `/ALhyyVar/ApprovalYGPT?Token=${encodeURIComponent(token())}`,
    formdataify({
      json: JSON.stringify(list),
      state: String(state ?? '1')
    })
  );
  return unwrap(res);
}

/** 审批不通过（旧页 sp_ygptNo → ApprovalYGPTNo） */
export async function approvalYGPTNo(rows) {
  const list = (rows || []).map((row) => ({ ID: row.ID }));
  const res = await request.post(
    `/ALhyyVar/ApprovalYGPTNo?Token=${encodeURIComponent(token())}`,
    formdataify({ json: JSON.stringify(list) })
  );
  return unwrap(res);
}

export { buildQuery };
