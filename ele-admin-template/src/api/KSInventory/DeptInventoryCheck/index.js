import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/**
 * 科室盘点 - 主表列表
 */
export async function getDeptInventoryCheckList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 20,
    PERIOD_YM: data.PERIOD_YM || '',
    DEPT_TWO_CODE: data.DEPT_TWO_CODE || '',
    DEPT_TWO_NAME: data.DEPT_TWO_NAME || '',
    STATUS: data.STATUS !== undefined && data.STATUS !== '' ? data.STATUS : '',
    CHECK_START_TIME_BEGIN: data.CHECK_START_TIME_BEGIN || '',
    CHECK_START_TIME_END: data.CHECK_START_TIME_END || ''
  };
  const res = await request.post('/DeptInventoryCheck/GetDeptInventoryCheckList', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 新建盘点单（主表 + 自动生成子表）
 */
export async function addDeptInventoryCheck(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    PERIOD_YM: data.PERIOD_YM || '',
    DEPT_TWO_CODE: store.state.user.info?.DeptNow?.Dept_Two_Code || '',
    DEPT_TWO_NAME: store.state.user.info?.DeptNow?.Dept_Two_Name || '',
    CHECK_START_TIME: data.CHECK_START_TIME || '',
    CHECK_END_TIME: data.CHECK_END_TIME || '',
    REMARK: data.REMARK || '',
    CREATE_MAN: store.state.user.info?.Nickname || '',
    REGION_CODE: data.REGION_CODE || 0,
  };
  const res = await request.post('/DeptInventoryCheck/AddDeptInventoryCheck', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 修改盘点单（仅草稿状态）
 */
export async function updateDeptInventoryCheck(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID,
    PERIOD_YM: data.PERIOD_YM || '',
    DEPT_TWO_CODE: data.DEPT_TWO_CODE || '',
    DEPT_TWO_NAME: data.DEPT_TWO_NAME || '',
    CHECK_START_TIME: data.CHECK_START_TIME || '',
    CHECK_END_TIME: data.CHECK_END_TIME || '',
    REMARK: data.REMARK || ''
  };
  const res = await request.post('/DeptInventoryCheck/UpdateDeptInventoryCheck', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 变更状态（提交/撤回/审核）
 * @param {number} id
 * @param {number} newStatus  0=撤回 1=提交 2=审核
 */
export async function updateDeptInventoryCheckStatus(id, newStatus) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: id,
    STATUS: newStatus
  };
  const res = await request.post('/DeptInventoryCheck/UpdateDeptInventoryCheckStatus', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 删除盘点单
 * 控制器签名：DeleteDeptInventoryCheck(int id, string Token) — 通过 query string 传参
 */
export async function deleteDeptInventoryCheck(id) {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const res = await request.post(
    `/DeptInventoryCheck/DeleteDeptInventoryCheck?id=${id}&Token=${Token}`
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 明细列表
 */
export async function getDeptInventoryCheckDetailList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 100,
    CHECK_ID: data.CHECK_ID || '',
    VARIETIE_NAME: data.VARIETIE_NAME || '',
    VARIETIE_CODE_NEW: data.VARIETIE_CODE_NEW || '',
    SPECIFICATION_OR_TYPE: data.SPECIFICATION_OR_TYPE || ''
  };
  const res = await request.post('/DeptInventoryCheck/GetDeptInventoryCheckDetailList', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 修改明细（实存数、盈亏备注、是否入柜 等）
 */
export async function updateDeptInventoryCheckDetail(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID,
    ACTUAL_STOCK_QTY: data.ACTUAL_STOCK_QTY !== undefined ? data.ACTUAL_STOCK_QTY : '',
    PROFIT_LOSS_REMARK: data.PROFIT_LOSS_REMARK || '',
    IS_IN_CABINET: data.IS_IN_CABINET !== undefined ? data.IS_IN_CABINET : ''
  };
  const res = await request.post('/DeptInventoryCheck/UpdateDeptInventoryCheckDetail', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 批量回填明细（导入 Excel 后回写实存数/消耗数/计费数量/盈亏值）
 * @param {Array<{ID, ACTUAL_STOCK_QTY, CONSUME_QTY, CHARGING_QTY, PROFIT_LOSS_NUMBER}>} items
 */
export async function batchUpdateDeptInventoryCheckDetail(items) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    Items: items
  };
  const res = await request.post('/DeptInventoryCheck/BatchUpdateDeptInventoryCheckDetail', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室盘点 - 导入上期库存（按品种编码新增明细行，重复编码跳过）
 * @param {number} checkId  盘点单主键
 * @param {Array<{VARIETIE_CODE_NEW: string, LAST_STOCK_QTY: number}>} items
 */
export async function importLastStockQty(checkId, items) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    CHECK_ID: checkId,
    Items: items
  };
  const res = await request.post('/DeptInventoryCheck/ImportLastStockQty', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
