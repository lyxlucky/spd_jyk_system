import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function nick() {
  try {
    return JSON.parse(sessionStorage.getItem('user') || '{}')?.Nickname
      || JSON.parse(localStorage.getItem('user') || '{}')?.Nickname
      || '';
  } catch (e) {
    return localStorage.getItem('Nickname') || '';
  }
}

function unwrap(res) {
  const body = res?.data;
  if (body?.code == 301 || body === 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '操作失败');
}

/** 调价计划列表 */
export async function SearchReadjust(where = {}, page = 1, size = 30) {
  const res = await request.post(
    '/Readjust/SearchReadjust',
    formdataify({
      Token: token(),
      supplierName: where.supplierName || '',
      readjustNumber: where.readjustNumber || '',
      contractCode: where.contractCode || '',
      varietie: where.varietie || '',
      Creater: where.Creater || '',
      state: where.state || '',
      ReadjustSendState: where.ReadjustSendState || '',
      sp_startTime: where.sp_startTime || '',
      sp_endTime: where.sp_endTime || '',
      IS_CHARGE: where.IS_CHARGE || '',
      page,
      size
    })
  );
  return unwrap(res);
}

/** 调价明细 */
export async function SearchReadjustDtl({ dtlId = '', state = '' } = {}) {
  const res = await request.post(
    '/Readjust/SearchReadjustDtl',
    formdataify({ Token: token(), dtlId, state })
  );
  return unwrap(res);
}

/** 创建空计划 */
export async function CreateNewReadjustNumber() {
  const res = await request.post(
    '/Readjust/CreateNewReadjustNumber',
    formdataify({ Token: token(), staff: nick() })
  );
  return unwrap(res);
}

/** 确认提交 */
export async function CommitReadjustNumber(payload) {
  const res = await request.post(
    '/Readjust/CommitReadjustNumber',
    formdataify({
      Token: token(),
      staff: nick(),
      ...payload
    })
  );
  return unwrap(res);
}

/** 修改计划 */
export async function ModifyReadjustNumber(payload) {
  const res = await request.post(
    '/Readjust/ModifyReadjustNumber',
    formdataify({
      Token: token(),
      staff: nick(),
      ...payload
    })
  );
  return unwrap(res);
}

/** 审批通过（支持逗号串主单号） */
export async function ApproveReadjustNumber(mainNumber) {
  const res = await request.post(
    '/Readjust/ApproveReadjustNumber',
    formdataify({ Token: token(), staff: nick(), mainNumber })
  );
  return unwrap(res);
}

/** 撤销计划 */
export async function CancelReadjustNumber(mainNumber) {
  const res = await request.post(
    '/Readjust/CancelReadjustNumber',
    formdataify({ Token: token(), staff: nick(), mainNumber })
  );
  return unwrap(res);
}

/** 删除计划 */
export async function DeleteReadjustNumber(rows) {
  const json = JSON.stringify(
    (rows || []).map((r) => ({
      MainNumber: r.Main_Number,
      men: nick()
    }))
  );
  const res = await request.post(
    '/Readjust/DeleteReadjustNumber',
    formdataify({ Token: token(), Json: json })
  );
  return unwrap(res);
}

/** 立即执行 */
export async function ExecuteReadjustPlanNow(mainNumber) {
  const res = await request.post(
    '/Readjust/ExecuteReadjustPlanNow',
    formdataify({ Token: token(), mainNumber })
  );
  return unwrap(res);
}

/** 全部执行到期计划 */
export async function ExecuteDueReadjustPlans() {
  const res = await request.post('/Readjust/ExecuteDueReadjustPlans', formdataify({ Token: token() }));
  return unwrap(res);
}

/** 执行前后库存快照 */
export async function SearchReadjustSnapshots(dtlId) {
  const dtlIdArray = JSON.stringify([dtlId].filter(Boolean));
  const res = await request.post(
    '/Readjust/SearchReadjustSnapshots',
    formdataify({
      Token: token(),
      dtlId,
      dtlIdArray,
      centerPage: 1,
      centerSize: 999,
      deptPage: 1,
      deptSize: 999,
      unmonthlyPage: 1,
      unmonthlySize: 999
    })
  );
  return unwrap(res);
}

/** 供应商短列表 */
export async function SearchSupplierShortInfo({ supplierName = '', page = 1, size = 9999 } = {}) {
  const res = await request.post(
    '/Readjust/SearchSupplierShortInfo',
    formdataify({ Token: token(), supplierName, page, size })
  );
  return unwrap(res);
}

/** 合同短列表 */
export async function SearchContractShortInfo({
  supplierCode = '',
  supplierName = '',
  contractCode = '',
  contractName = '',
  page = 1,
  size = 9999
} = {}) {
  const res = await request.post(
    '/Readjust/SearchContractShortInfo',
    formdataify({
      Token: token(),
      supplierCode,
      supplierName,
      contractCode,
      contractName,
      page,
      size
    })
  );
  return unwrap(res);
}

/** 合同下品种 */
export async function SearchContractVarieties(where = {}, page = 1, size = 30) {
  const res = await request.post(
    '/Readjust/SearchContractVarieties',
    formdataify({
      Token: token(),
      varietieCodeNew: where.varietieCodeNew || '',
      varietieName: where.varietieName || '',
      specificationOrType: where.specificationOrType || '',
      manufacturingEntName: where.manufacturingEntName || '',
      approvalNumber: where.approvalNumber || '',
      supplierCode: where.supplierCode || '',
      contractCode: where.contractCode || '',
      page,
      size
    })
  );
  return unwrap(res);
}

/** 导入计划 */
export async function ImportVarReport(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await request.post(
    `/Readjust/ImportVarReport?Token=${encodeURIComponent(token())}&nickname=${encodeURIComponent(nick())}`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 120000 }
  );
  return res.data;
}

/** 发送 HIS */
export async function sendMaterialToHisTj(rows, homehp) {
  const json = JSON.stringify(
    (rows || []).map((r) => ({
      Varietie_Code: r.Varietie_Code,
      Varietie_Code_New: r.Varietie_Code_New,
      Main_Number: r.Main_Number,
      hp: homehp
    }))
  );
  const res = await request.post(
    '/VarietieBasicInfo/sendMaterialToHisTj',
    formdataify({ Token: token(), Json: json }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 创建调价库存快照日志 */
export async function createTJ_STOCK_LOG() {
  const res = await request.post(
    '/CentralWarehouseDept/createTJ_STOCK_LOG',
    formdataify({ Token: token() })
  );
  return unwrap(res);
}

/** 查询调价库存快照日志 */
export async function getTJ_STOCK_LOG(where = {}, page = 1, size = 50) {
  const res = await request.post(
    '/CentralWarehouseDept/getTJ_STOCK_LOG',
    formdataify({
      Token: token(),
      VARIETIE_SEARCH_VALUE: where.VARIETIE_SEARCH_VALUE || where.PROD_REGISTRATION_NAME || '',
      BATCH_NUM: where.BATCH_NUM || where.APPROVAL_NUMBER || '',
      SUPPLIER_NAME: where.SUPPLIER_NAME || where.ID_CODE || '',
      PRINT_STATE: where.PRINT_STATE || '',
      page,
      size
    })
  );
  return unwrap(res);
}
