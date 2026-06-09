import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import store from '@/store';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function nickname() {
  return store.state.user?.info?.Nickname || '';
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

/** 供应商快照批次列表 */
export async function searchSnapshotBatch(params) {
  const res = await request.post(
    '/SupplierVarietieStock/SearchSnapshotBatch',
    formdataify({
      Token: token(),
      supplierCode: params.supplierCode ?? '',
      dateFrom: params.dateFrom ?? '',
      dateTo: params.dateTo ?? '',
      approveState: params.approveState ?? '',
      mark: params.mark ?? '',
      snapshotBatch: params.snapshotBatch ?? '',
      page: params.page ?? 1,
      size: params.size ?? 50,
      field: params.field ?? '',
      order: params.order ?? ''
    })
  );
  return unwrap(res);
}

/** 供应商快照明细 */
export async function searchSnapshotBatchVarietie(params) {
  const res = await request.post(
    '/SupplierVarietieStock/SearchSnapshotBatchVarietie',
    formdataify({
      Token: token(),
      supplierCode: params.supplierCode ?? '',
      supplierName: params.supplierName ?? '',
      contractName: params.contractName ?? '',
      varietie: params.varietie ?? '',
      snapshotBatch: params.snapshotBatch ?? '',
      containAllZero: params.containAllZero ?? '1',
      APPROVE_STATE: params.approveState ?? '',
      IS_GET: params.isGet ?? '',
      page: params.page ?? 1,
      size: params.size ?? 50,
      field: params.field ?? '',
      order: params.order ?? ''
    })
  );
  return unwrap(res);
}

/** 创建快照 */
export async function createSnapshot(mark) {
  const res = await request.post(
    '/SupplierVarietieStock/CreateSnapshot',
    formdataify({
      Token: token(),
      containAllZero: 'true',
      creator: nickname(),
      mark: mark ?? ''
    })
  );
  const data = res.data;
  if (data?.code == 301) throw new Error(data.msg || '登录失效');
  if (data?.code == 200 || data?.code === 200) return data;
  throw new Error(data?.msg || '创建失败');
}

/** 审批批次 */
export async function approveSnapshot(snapshotBatch) {
  const res = await request.post(
    '/SupplierVarietieStock/ApproveSnapshot',
    formdataify({
      snapshotBatch,
      approveStaff: nickname()
    })
  );
  const data = res.data;
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '审批失败');
}

/** 确认收取对账函 */
export async function approveSnapshotDlt(ids) {
  const res = await request.post(
    '/SupplierVarietieStock/ApproveSnapshotDlt',
    formdataify({
      approveState: '',
      approveStaff: '',
      ids,
      approveType: '1'
    })
  );
  const data = res.data;
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '操作失败');
}

/** 库存日志批次 */
export async function searchKzList(kzStartDate, kzEndDate, page, size) {
  const res = await request.get('/CentralWarehouseDept/SearchKZList', {
    params: {
      Token: token(),
      kz_startDate: kzStartDate ?? '',
      kz_endDate: kzEndDate ?? '',
      page: page ?? 1,
      size: size ?? 10
    }
  });
  return unwrap(res);
}

/** 中心库快照明细 */
export async function searchKzDetail(params) {
  const res = await request.get('/CentralWarehouseDept/Search_KZ', {
    params: {
      Token: token(),
      ordernum: params.ordernum ?? '',
      ORT_VAR: params.ortVar ?? '',
      ORT_SUP: params.ortSup ?? '',
      ORT_BATCH: params.ortBatch ?? '',
      ORT_FLSX: params.ortFlsx ?? '',
      ORT_KFWZ: params.ortKfwz ?? '',
      ORT_SCQY: params.ortScqy ?? '',
      ORT_SSQY: params.ortSsqy ?? '',
      ORT_HTDQ: params.ortHtdq ?? '',
      page: params.page ?? 1,
      size: params.size ?? 10
    }
  });
  return unwrap(res);
}
