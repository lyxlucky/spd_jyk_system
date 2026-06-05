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

function postForm(path, fields) {
  return request.post(path, formdataify({ Token: token(), ...fields }));
}

/** 限制方案列表 */
export async function getProdLimitPlanMainList(params, page = 1, size = 20) {
  const res = await postForm('/DataStatics/getProdLimitPlanMainList', {
    LimitPlanName: params.limitPlanName ?? '',
    IsEnable: params.isEnable ?? '',
    ReceiptIsOverLimit: params.receiptIsOverLimit ?? '',
    StockUpIsOverLimit: params.stockUpIsOverLimit ?? '',
    page,
    size
  });
  const body = unwrap(res);
  return {
    total: body.total ?? 0,
    list: body.data ?? body.result ?? []
  };
}

/** 限制方案单条 */
export async function getProdLimitPlanMainSingle(id) {
  const res = await postForm('/DataStatics/getProdLimitPlanMainSingle', { Id: id });
  const body = unwrap(res);
  return body.data ?? body.result ?? null;
}

/** 注册证明细列表 */
export async function getProdLimitPlanDetList(id) {
  const res = await postForm('/DataStatics/getProdLimitPlanDetList', { Id: id });
  const body = unwrap(res);
  return body.data ?? body.result ?? [];
}

/** 注册证选项 */
export async function getProdRegistrationOptions(keyword, page = 1, size = 20) {
  const res = await postForm('/DataStatics/getProdRegistrationOptions', {
    Keyword: keyword ?? '',
    page,
    size
  });
  const body = unwrap(res);
  return {
    total: body.total ?? 0,
    list: body.data ?? body.result ?? []
  };
}

/** 保存限制方案 */
export async function saveProdLimitPlan(payload) {
  const res = await postForm('/DataStatics/saveProdLimitPlan', {
    Id: payload.id ?? '',
    LimitPlanName: payload.limitPlanName,
    LimitPlanNum: payload.limitPlanNum,
    LimitPlanStartTime: payload.limitPlanStartTime,
    LimitPlanEndTime: payload.limitPlanEndTime,
    IsEnable: payload.isEnable ?? '1',
    Mark: payload.mark ?? '',
    DetailsJson: JSON.stringify(payload.details || [])
  });
  return unwrap(res);
}

/** 删除限制方案 */
export async function deleteProdLimitPlan(id) {
  const res = await postForm('/DataStatics/deleteProdLimitPlan', { Id: id });
  return unwrap(res);
}

/** 启用/停用 */
export async function updateProdLimitPlanEnable(id, isEnable) {
  const res = await postForm('/DataStatics/updateProdLimitPlanEnable', {
    Id: id,
    IsEnable: isEnable
  });
  return unwrap(res);
}

/** 收货/备货统计明细 */
export async function getProdLimitReceiptStats(params, page = 1, size = 20) {
  const res = await postForm('/DataStatics/getProdLimitReceiptStats', {
    ProdLimitPlanMainId: params.prodLimitPlanMainId ?? '',
    Keyword: params.keyword ?? '',
    StartTime: params.startTime ?? '',
    EndTime: params.endTime ?? '',
    DetailType: params.detailType ?? 'receipt',
    page,
    size
  });
  const body = unwrap(res);
  return {
    total: body.total ?? 0,
    totalReceipts: body.totalreceipts ?? body.totalReceipts ?? 0,
    list: body.data ?? body.result ?? []
  };
}
