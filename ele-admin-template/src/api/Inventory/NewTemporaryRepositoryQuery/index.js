import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

async function sendRequest(url, data, method = 'post') {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const requestData = { Token: token, ...data };

  let res;
  if (method === 'post') {
    res = await request.post(url, formdataify(requestData));
  } else if (method === 'get') {
    res = await request.get(url, { params: requestData });
  }

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(`请求 ${url} 失败: ${res.data.msg}`));
}

function normalizeSort(order) {
  if (!order || !order.prop) {
    return { field: '', order: '' };
  }
  const ord =
    order.order === 'descending' ? 'desc' : order.order === 'ascending' ? 'asc' : '';
  return { field: order.prop, order: ord };
}

/** 与 SYS_WEB NewTemporaryRepositoryQuery 中 hqrjks2 一致：新暂存库定数包明细 */
export async function NewSearchDeptTwoDefCodes(data) {
  const { page, limit, where = {}, order } = data;
  const { field, order: sortOrder } = normalizeSort(order);
  const requestData = {
    page,
    size: limit,
    DEPT_TWO_CODE: where.DEPT_TWO_CODE || '',
    DEPT_NAME: where.divrjks2_search_inpName || '',
    DEPT_SEARCH_CODE: where.divrjks2_search_inp || '',
    OPERATOR: where.operator || '',
    field,
    order: sortOrder
  };
  return sendRequest('/DeptTwoDefNoPkgTmpStorage/NewSearchDeptTwoDefCodes', requestData, 'get');
}

/** 导出用：与列表同一套条件拉全量（对齐原页面 TQPrintStorageSingleRari2 使用全量结果导出） */
export async function ExportNewDeptTwoDefList(data) {
  const { where = {}, order } = data;
  const { field, order: sortOrder } = normalizeSort(order);
  const requestData = {
    page: 1,
    size: 99999,
    DEPT_TWO_CODE: where.DEPT_TWO_CODE || '',
    DEPT_NAME: where.divrjks2_search_inpName || '',
    DEPT_SEARCH_CODE: where.divrjks2_search_inp || '',
    OPERATOR: where.operator || '',
    field,
    order: sortOrder
  };
  return sendRequest('/DeptTwoDefNoPkgTmpStorage/NewSearchDeptTwoDefCodes', requestData, 'get');
}

/** 智能间左侧：二级科室 */
export async function initTemporary1(data) {
  const { page, limit, where = {} } = data;
  const requestData = {
    page,
    size: limit,
    Dept_two_Code: where.temporary2_search_inp2 || ''
  };
  return sendRequest('/DeptTwoDefNoPkgTmpStorage/LoadDeptTwo', requestData, 'get');
}

/** 智能间右侧：历史暂借 */
export async function initTemporary2(data) {
  const { page, limit, where = {}, order } = data;
  const { field, order: sortOrder } = normalizeSort(order);
  const requestData = {
    page,
    size: limit,
    condition: where.temporary2_search_inp || '',
    deptName: where.deptName || '',
    startDate: where.start_time || '',
    endDate: where.end_time || '',
    order: sortOrder,
    field
  };
  return sendRequest('/DeptTwoDefNoPkgTmpStorage/GetHistoryTmp', requestData, 'get');
}

/** 智能间历史出库导出 Excel（服务端生成文件） */
export async function exportHistoryTmpFormPost(payload) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const formData = formdataify({ Token: token, ...payload });
  return request.post('/DeptTwoDefNoPkgTmpStorage/ExportHistoryTmp', formData);
}
