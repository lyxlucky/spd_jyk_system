import request from '@/utils/request';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import { openExcelFile } from '@/views/KSInventory/KSConsumeQuery/utils';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

function parseSort(sort = {}) {
  const field = sort.sort || sort.field || '';
  const o = sort.order;
  let order = '';
  if (o === 'asc' || o === 'ascending') order = 'asc';
  else if (o === 'desc' || o === 'descending') order = 'desc';
  return { field, order };
}

/** 与旧 KSConsumeQueryByDept.cshtml / DeptConsume.SearchDept 参数一致 */
export function buildSearchParams(where = {}, page = 1, size = 20, sort = {}, deptTwoJson = '') {
  const { field, order } = parseSort(sort);
  return {
    Token: token(),
    deptTwoJson,
    page,
    size,
    varietie: where.varietie || '',
    ygCode: where.ygCode || '',
    supplier: where.supplier || '',
    batch: where.batch || '',
    deptTwoName: where.deptTwoName || '',
    DEPT_NAME: where.DEPT_NAME || '',
    SPDDEPTNAME: where.SPDDEPTNAME || '',
    manuEntName: where.manuEntName || '',
    validDateFrom: where.validDateFrom || '',
    validDateTo: where.validDateTo || '',
    KSConsumePDA_startDate: where.KSConsumePDA_startDate || '',
    KSConsumePDA_endDate: where.KSConsumePDA_endDate || '',
    field,
    order,
    highOrLow: where.highOrLow || '',
    trade: where.trade || '',
    classificName: where.classificName || '',
    consumeType: where.consumeType || '',
    specType: where.specType || '',
    isProtect: where.isProtect || '',
    isPdaScan: where.isPdaScan || '',
    highOrLowClassTwo: where.highOrLowClassTwo || '',
    THE_FIRST_BATCH_OF_KEY_CONSUMA: where.THE_FIRST_BATCH_OF_KEY_CONSUMA || '',
    hp: HOME_HP,
    stzx_state: where.stzx_state ?? '1',
    stzx_state_gz: where.stzx_state_gz ?? '1',
    def: where.def || '',
    Patient_Number: where.Patient_Number || '',
    Hospitalization_Number: where.Hospitalization_Number || '',
    Operate_Person: where.Operate_Person || '',
    useMonth: where.useMonth === true,
    monthFmt: where.monthFmt || '',
    monthFmt2: where.monthFmt2 || '',
    dayClearingDate: where.dayClearingDate || ''
  };
}

export async function searchDept(where, page, size, sort, deptTwoJson) {
  const params = buildSearchParams(where, page, size, sort, deptTwoJson);
  const res = await request.get('/DeptConsume/SearchDept', { params });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function exportDeptConsumeExcel(where, sort, deptTwoJson) {
  const base = buildSearchParams(where, 1, 1, sort, deptTwoJson);
  const { page, size, ...rest } = base;
  const res = await request.get('/DeptConsume/ExportDeptConsumeExcel', { params: rest });
  check301(res.data);
  if (okCode(res.data?.code)) {
    openExcelFile(res.data.msg);
    return res.data;
  }
  throw new Error(res.data?.msg || '导出失败');
}

export async function searchDeptHz(where, page, size, sort, deptTwoJson) {
  const params = buildSearchParams(where, page, size, sort, deptTwoJson);
  const res = await request.get('/DeptConsume/SearchDeptHz', { params });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function searchDeptHzKs(where, page, size, sort, deptTwoJson) {
  const params = buildSearchParams(where, page, size, sort, deptTwoJson);
  const res = await request.get('/DeptConsume/SearchDeptHzKs', { params });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function searchDeptHzFz(where, page, size, sort, deptTwoJson) {
  const params = buildSearchParams(where, page, size, sort, deptTwoJson);
  const res = await request.get('/DeptConsume/SearchDeptHzFz', { params });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

export async function createTempToDay() {
  const res = await request.get('/DeptConsume/craeteDEPT_HIS_DEF_PKG_CONSUME_TEMPToDay', {
    params: { Token: token() }
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '更新失败');
}

export async function excelKSConsum(where, sort, deptTwoJson) {
  const params = buildSearchParams(where, 1, 99999, sort, deptTwoJson);
  const res = await request.get('/DeptConsume/ExcelKSConsum', { params });
  check301(res.data);
  if (okCode(res.data?.code)) {
    openExcelFile(res.data.msg);
    return res.data;
  }
  throw new Error(res.data?.msg || '导出失败');
}
