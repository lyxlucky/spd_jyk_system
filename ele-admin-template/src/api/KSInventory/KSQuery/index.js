import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { EncryptWithCustomKey, getAesKey } from '@/utils/aes-util';
import { HOME_HP } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  const code = res.data?.code;
  if (code == 301 || code === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (code == 200 || code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

/** 解析 ele-pro-table 排序 */
export function parseSort(order) {
  if (!order || !order.sort) {
    return { field: '', order: '' };
  }
  const o = order.order;
  return {
    field: order.sort,
    order: o === 'asc' || o === 'ascending' ? 'asc' : o === 'desc' || o === 'descending' ? 'desc' : ''
  };
}

/** 用户所属二级科室编码 JSON 数组字符串（与旧 deptJson 一致） */
export function getDeptJson() {
  const list = (store.state.user?.info?.userDept || []).map((d) => d.Dept_Two_Code);
  return JSON.stringify(list);
}

/** 主表查询参数 — DeptTwoDefNoPackageStock/Search */
export function buildMainSearchParams(where = {}, page = 1, size = 10, sort = {}) {
  return {
    Token: token(),
    json: getDeptJson(),
    varietie: where.varietie ?? '',
    group: where.group ?? '',
    scqy: where.scqy ?? '',
    isContainZero: where.isContainZero === true || where.isContainZero === '1',
    page,
    size,
    field: sort.field || '',
    order: sort.order || ''
  };
}

/** 主表分页查询 */
export async function searchMainStock(where, page, size, sort) {
  const res = await request.get('/DeptTwoDefNoPackageStock/Search', {
    params: buildMainSearchParams(where, page, size, sort)
  });
  return unwrap(res);
}

/** 明细表查询参数 — DeptTwoDefNoPackageStock/SearchDef */
export function buildDetailSearchParams(where = {}, page = 1, size = 10, sort = {}) {
  const deptCode = store.state.user?.info?.DeptNow?.Dept_Two_Code || '';
  return {
    Token: token(),
    sourceFrom: where.sourceFrom ?? deptCode,
    varietieCode: where.varietieCode ?? '',
    coefficient: where.coefficient ?? '',
    currUpShelfState: where.currUpShelfState ?? '',
    regionCode: where.regionCode ?? '0',
    condition: where.condition ?? '',
    condition1: where.condition1 ?? '',
    jxqSatte: where.jxqSatte ?? '0',
    isHaveTh: where.isHaveTh ?? '0',
    page,
    size,
    field: sort.field || '',
    order: sort.order || ''
  };
}

/** 明细表分页查询 */
export async function searchDefStock(where, page, size, sort) {
  const res = await request.get('/DeptTwoDefNoPackageStock/SearchDef', {
    params: buildDetailSearchParams(where, page, size, sort)
  });
  return unwrap(res);
}

/** 导出主表 Excel */
export async function exportDeptToExcel(where, sort = {}) {
  const { page, size, ...params } = buildMainSearchParams(where, 1, 1, sort);
  const res = await request.get('/DeptTwoDefNoPackageStock/ExportDeptToExcel', { params });
  return unwrap(res);
}

/** 导出品种明细 Excel */
export async function exportDeptDefToExcel(where, sort = {}) {
  const { page, size, condition1, jxqSatte, ...params } = buildDetailSearchParams(where, 1, 1, sort);
  const res = await request.get('/DeptTwoDefNoPackageStock/ExportDeptDefToExcel', { params });
  return unwrap(res);
}

/** 导出品种明细（批号）Excel */
export async function exportDeptBatchToExcel(where, sort = {}) {
  const { page, size, condition1, jxqSatte, ...params } = buildDetailSearchParams(where, 1, 1, sort);
  const res = await request.get('/DeptTwoDefNoPackageStock/ExportDeptBatchToExcel', { params });
  return unwrap(res);
}

/** 导出盘点表 */
export async function importInventoryData() {
  const info = store.state.user?.info || {};
  const res = await request.post(
    '/DeptTwoDefNoPackageStock/ImportInventoryData',
    formdataify({
      Token: token(),
      Dept_Two_Code: info.DeptNow?.Dept_Two_Code || '',
      Dept_Two_Name: info.DeptNow?.Dept_Two_Name || ''
    })
  );
  return unwrap(res);
}

/** 提交上下限 */
export async function upDownKsQuery(payload) {
  const res = await request.post(
    '/DeptTwoDefNoPackageStock/UpDownKsQuery',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload)
    })
  );
  return unwrap(res);
}

/** 扫单入库 — 配送明细 */
export async function getDistributeDetail(stockOutDistributeNumber, page = 1, size = 10) {
  const res = await request.get('/PickDistributionmgmt/GetDistributeDetail', {
    params: {
      Token: token(),
      stock_out_distribute_number: stockOutDistributeNumber || '',
      page,
      size
    }
  });
  return unwrap(res);
}

/** 扫单入库 — 确认收货 */
export async function deptReceivingScanOrder(distributeNumber, currentScanMan = '') {
  const res = await request.post(
    '/DeptHisDefZxyy/DeptReceivingScanOrder',
    formdataify({
      Token: token(),
      DistributeNumber: distributeNumber || '',
      currentScanMan: currentScanMan || ''
    })
  );
  return unwrap(res);
}

/** 佛山中心 — 扫单前验证用户 */
export async function verifyUserByKSQuery(user, password) {
  const aesKey = getAesKey();
  const encrypted = EncryptWithCustomKey(password, aesKey);
  const res = await request.post(
    '/DeptHisDefZxyy/VerifyUserByKSQuery',
    formdataify({
      user,
      password: encrypted,
      hp: HOME_HP,
      Token: token(),
      AesKey: aesKey
    })
  );
  return unwrap(res);
}

/** SL 开头单号 — PDA 确认申领 */
export async function pdaConfirmApply(operateNumber, staff) {
  const deptTwoCode = store.state.user?.info?.DeptNow?.Dept_Two_Code || '';
  const res = await request.get('/TwoDeptApply/PdaComfirmApply', {
    params: {
      Token: token(),
      operateNumber: operateNumber || '',
      deptTwoCode,
      staff: staff || ''
    }
  });
  const data = res.data;
  if (data?.code == 301) {
    throw new Error(data.msg || '登录失效');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}
