import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}
function unwrap(res) {
  if (Number(res.data?.code) === 200) return res.data;
  throw new Error(res.data?.msg || '操作失败，请稍后重试');
}
export async function applyCatalogTransfer(data) {
  return unwrap(await request.post('/departments/catalog-transfers', {
    Token: token(), PlanNumber: data.planNumber || '', DeptTwoCode: data.dept_two_code,
    VarietyCodes: data.map((row) => row.Varietie_Code)
  }));
}
export async function reconcilePending() {
  return unwrap(await request.post('/departments/catalog-reconciliations', { Token: token() }));
}
export async function searchPending(params) {
  return unwrap(await request.get('/departments/catalog-pending', { params: { ...params, Token: token() } }));
}
export async function getPackages(id) {
  return unwrap(await request.get(`/departments/catalog-packages/${encodeURIComponent(id)}`, { params: { Token: token() } }));
}
export async function savePending(PendingId, PackageCodes, form) {
  unwrap(await request.post('/departments/catalog-authorizations', {
    Token: token(), PendingId, PackageCodes, ...form,
    HIS_CAN_NULL_STATR_TIME: form.HIS_CAN_NULL_STATR_TIME || null
  }));
  return true;
}
