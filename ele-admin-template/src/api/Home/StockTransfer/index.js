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

/** 目标-合同+品种查询 */
export async function searchTargetContractVarietie(data) {
  const where = data.where || {};
  const res = await request.post(
    '/StockTransfer/SearchTargetContractVarietie',
    formdataify({
      Token: token(),
      page: data.page || 1,
      size: data.limit || 10,
      targetSupplierName: where.targetSupplierName ?? '',
      targetContractName: where.targetContractName ?? '',
      targetVarietie: where.targetVarietie ?? '',
      targetSpecType: where.targetSpecType ?? ''
    })
  );
  const body = unwrap(res);
  return { total: body.total ?? 0, result: body.result || [] };
}

/** 退转单明细列表 */
export async function searchTransferVarietieDtl(data) {
  const where = data.where || {};
  const res = await request.post(
    '/StockTransfer/SearchTransferVarietieDtl',
    formdataify({
      Token: token(),
      page: data.page || 1,
      size: data.limit || 10,
      transferNumber: where.transferNumber ?? '',
      sourceSupplierName: where.sourceSupplierName ?? '',
      targetSupplierName: where.targetSupplierName ?? '',
      varietie: where.varietie ?? '',
      specType: where.specType ?? '',
      state: where.state ?? ''
    })
  );
  const body = unwrap(res);
  return { total: body.total ?? 0, result: body.result || [] };
}

/** 源-合同+品种查询 */
export async function searchSourceContractVarietie(payload) {
  const res = await request.post(
    '/StockTransfer/SearchSourceContractVarietie',
    formdataify({
      Token: token(),
      page: payload.page || 1,
      size: payload.limit || 10,
      sourceSupplierName: payload.sourceSupplierName ?? '',
      sourceContractName: payload.sourceContractName ?? '',
      sourceVarietie: payload.sourceVarietie ?? '',
      sourceSpecType: payload.sourceSpecType ?? '',
      notContainContractCode: payload.notContainContractCode ?? '',
      targetSupplierCode: payload.targetSupplierCode ?? '',
      targetContractCode: payload.targetContractCode ?? '',
      targetSupplierName: payload.targetSupplierName ?? '',
      targetContractName: payload.targetContractName ?? '',
      targetVarietie: payload.targetVarietie ?? '',
      targetSpecType: payload.targetSpecType ?? '',
      notContainSourceVarietiesJson: payload.notContainSourceVarietiesJson ?? '[]'
    })
  );
  const body = unwrap(res);
  return { total: body.total ?? 0, result: body.result || [] };
}

/** 创建退转单 */
export async function addTransferContractVarietie(payload) {
  const res = await request.post(
    '/StockTransfer/AddTransferContractVarietie',
    formdataify({
      Token: token(),
      staff: payload.staff ?? '',
      sourceSupplierName: payload.sourceSupplierName ?? '',
      sourceContractName: payload.sourceContractName ?? '',
      sourceVarietie: payload.sourceVarietie ?? '',
      sourceSpecType: payload.sourceSpecType ?? '',
      notContainContractCode: payload.notContainContractCode ?? '',
      targetSupplierCode: payload.targetSupplierCode ?? '',
      targetContractCode: payload.targetContractCode ?? '',
      targetSupplierName: payload.targetSupplierName ?? '',
      targetContractName: payload.targetContractName ?? '',
      targetVarietie: payload.targetVarietie ?? '',
      targetSpecType: payload.targetSpecType ?? '',
      notContainTargetVarietiesJson: payload.notContainTargetVarietiesJson ?? '[]',
      notContainSourceVarietiesJson: payload.notContainSourceVarietiesJson ?? '[]'
    })
  );
  return unwrap(res);
}

/** 批量审批 */
export async function approveTransferList(transferNumbers) {
  const res = await request.post(
    '/StockTransfer/ApproveList',
    formdataify({
      Token: token(),
      transferNumbersJson: JSON.stringify(transferNumbers || [])
    })
  );
  return unwrap(res);
}

/** 删除退转明细 */
export async function softDeleteTransferDtl(dtlIds) {
  const res = await request.post(
    '/StockTransfer/SofeDelete',
    formdataify({
      Token: token(),
      transferDtlIdJson: JSON.stringify(dtlIds || [])
    })
  );
  return unwrap(res);
}
