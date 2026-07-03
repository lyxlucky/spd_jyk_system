import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

export {
  getPickingList,
  getPickingInfo,
  deletePickingDetails,
  getMonitorPopup,
  insertNewInfo,
  showPlanRemarks,
  updatePlanRemarks
} from '@/api/Inventory/CentralinventoryMonitoring';

export async function searchDeptOos(where, page, size) {
  const res = await request.post(
    '/DeptOutOfStock/SearchDeptOos',
    formdataify({
      Token: token(),
      varietieCode: where.varietieCode ?? '',
      varietieName: where.varietieName ?? '',
      specType: where.specType ?? '',
      manuEntName: where.manuEntName ?? '',
      supplierName: where.supplierName ?? '',
      storageId: where.storageId ?? '',
      isContainGoodsOnWay: where.isContainGoodsOnWay ?? '1',
      field: where.field ?? '',
      order: where.order ?? '',
      page,
      size
    })
  );
  const data = res.data;
  if (data.code == 301 || data.code === '301') {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data.code == 200 || data.code === '200') {
    return { total: data.total ?? 0, result: data.result || [] };
  }
  throw new Error(data.msg || '查询失败');
}

export async function searchDeptOosExtend(varietieCode, supplierCode) {
  const res = await request.post(
    '/DeptOutOfStock/SearchDeptOosExtend',
    formdataify({
      varietieCode: varietieCode ?? '',
      supplierCode: supplierCode ?? ''
    })
  );
  const data = res.data;
  if (data.code == 200 || data.code === '200') {
    return data.result?.[0] || null;
  }
  throw new Error(data.msg || '加载扩展信息失败');
}

export async function autoLockAvailableGoods(planNumbers) {
  const res = await request.post(
    '/DeptApplyDelivery/AutoLockAvailableGoods',
    formdataify({
      json: JSON.stringify(planNumbers || []),
      Token: token()
    }),
    { timeout: 30000 }
  );
  const data = res.data;
  if (data.code == 301 || data.code === '301') {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data.code == 200 || data.code === '200') {
    return data;
  }
  throw new Error(data.msg || '生成配送单失败');
}
