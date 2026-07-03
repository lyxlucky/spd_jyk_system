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

export async function getStorageList() {
  const res = await request.get('/Commons/getSTORAGE');
  return res.data?.result || [];
}

export async function searchCenterOos(where, page, size) {
  let storageId = where.storageId ?? '';
  if (storageId === '-1') storageId = '';
  const res = await request.post(
    '/CenterOutOfStock/SearchCenterOos',
    formdataify({
      Token: token(),
      varietieCode: where.varietieCode ?? '',
      varietieName: where.varietieName ?? '',
      specType: where.specType ?? '',
      manuEntName: where.manuEntName ?? '',
      supplierName: where.supplierName ?? '',
      storageId,
      isContainGoodsOnWay: where.isContainGoodsOnWay ?? 'true',
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

export async function searchCenterOosExtend(varietieCode, supplierCode) {
  const res = await request.post(
    '/CenterOutOfStock/SearchCenterOosExtend',
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

export async function searchCenterOosAll(where) {
  return searchCenterOos(where, 1, 9999999);
}
