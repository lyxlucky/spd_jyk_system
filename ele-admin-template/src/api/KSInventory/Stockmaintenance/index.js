import request from '@/utils/request';
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

/** 查询参数（与旧 Stockmaintenance.cshtml / BatchValidityCheck/Query 一致） */
export function buildQueryParams(where = {}, page = 1, size = 10, sort = {}) {
  let storageId = where.storageId ?? '0';
  if (storageId === '0' || storageId === 0) {
    storageId = '';
  }
  return {
    Token: token(),
    Varietie: where.varietie ?? '',
    Remarks: where.remark ?? '',
    SuppliyName: where.supplierName ?? '',
    Batch: where.batch ?? '',
    StartDate: where.startDate ?? '',
    EndDate: where.endDate ?? '',
    Position: where.position ?? '',
    Specifications: where.specifications ?? '',
    Up_Shelf_State: where.upShelfState ?? '',
    StorageID: storageId,
    UpStockDay: where.upStockDay ?? '',
    SendSupplierState: '',
    page,
    size,
    field: sort.field || '',
    order: sort.order || ''
  };
}

/** 库存养护分页查询（含 avgday、stockPosition） */
export async function queryStockMaintenance(where, page, size, sort) {
  const res = await request.get('/BatchValidityCheck/Query', {
    params: buildQueryParams(where, page, size, sort)
  });
  return unwrap(res);
}

/** 导出 Excel */
export async function exportStockMaintenanceExcel(where, sort = {}, page = 1, size = 999999) {
  const res = await request.get('/BatchValidityCheck/CreateExcel', {
    params: buildQueryParams(where, page, size, sort)
  });
  return unwrap(res);
}

export { updateRemarks, updateSendSupplierState } from '@/api/KSInventory/NoMoveSell';
