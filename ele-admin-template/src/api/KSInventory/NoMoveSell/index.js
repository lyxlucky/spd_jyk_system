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

/** 查询参数（与旧 NoMoveSell.cshtml / QueryStationaryPin 一致） */
export function buildQueryParams(where = {}, page = 1, size = 10, sort = {}) {
  return {
    Token: token(),
    Varietie: where.varietie ?? '',
    SuppliyName: where.supplierName ?? '',
    Batch: where.batch ?? '',
    Specifications: where.specifications ?? '',
    Remark: where.remark ?? '',
    CentralPostion: where.centralPosition ?? '0',
    UpStockDay: where.upStockDay ?? '',
    StorageID: '',
    Position: '',
    page,
    size,
    field: sort.field || '',
    order: sort.order || ''
  };
}

/** 不动销分页查询 */
export async function queryStationaryPin(where, page, size, sort) {
  const res = await request.get('/BatchValidityCheck/QueryStationaryPin', {
    params: buildQueryParams(where, page, size, sort)
  });
  return unwrap(res);
}

/** 导出 Excel，返回文件名（位于 /Excel/files/） */
export async function exportStationaryPinExcel(where, sort = {}) {
  const params = buildQueryParams(where, 1, 999999999, sort);
  const res = await request.get('/BatchValidityCheck/QueryStationaryPinExcel', {
    params
  });
  return unwrap(res);
}

/** 更新备注 */
export async function updateRemarks(rows) {
  const res = await request.post(
    '/BatchValidityCheck/UpdateRemarks',
    formdataify({ Token: token(), json: JSON.stringify(rows) })
  );
  return unwrap(res);
}

/** 通知供应商 */
export async function updateSendSupplierState(rows) {
  const res = await request.post(
    '/BatchValidityCheck/UpdateSendSupplierState',
    formdataify({ Token: token(), json: JSON.stringify(rows) })
  );
  return unwrap(res);
}
