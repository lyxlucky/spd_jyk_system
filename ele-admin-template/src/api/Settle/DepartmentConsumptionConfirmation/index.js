import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify } from '@/utils/formdataify';

/**
 * 科室消耗确认 - 获取汇总信息
 * @param {Object} data - 查询参数 (SpUseInfoInArry)
 * @returns {Promise} - 返回请求Promise
 */
export async function getSzseSpUseHzInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    OPEARTION_CHARGING_TIME_START: data.OPEARTION_CHARGING_TIME_START || '',
    OPEARTION_CHARGING_TIME_END: data.OPEARTION_CHARGING_TIME_END || '',
    ZX_DEPT: data.ZX_DEPT || '',
    DEPT_TWO_NAME: data.DEPT_TWO_NAME || '',
    SPECIFICATION_OR_TYPE: data.SPECIFICATION_OR_TYPE || '',
    VARIETIE_NAME: data.VARIETIE_NAME || '',
    VARIETIE_CODE_NEW: data.VARIETIE_CODE_NEW || '',
    WZ_VAR_CODE: data.WZ_VAR_CODE || '',
    IS_GT: data.IS_GT || '',
    MANUFACTURING_ENT_NAME: data.MANUFACTURING_ENT_NAME || '',
    CHARGING_CODE: data.CHARGING_CODE || '',
    SUPPLIER_NAME: data.SUPPLIER_NAME || '',
    USE_APP_STATE: data.USE_APP_STATE || '',
    ID: data.ID || ''
  };

//   const formData = formdataify(formatData);
  const res = await request.post('/DeptConsume/getSzseSpUseHzInfo', formatData);
  
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室消耗确认 - 获取明细信息
 * @param {Object} data - 查询参数 (SpUseInfoInArry)
 * @returns {Promise} - 返回请求Promise
 */
export async function getSzseSpUseDelInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    OPEARTION_CHARGING_TIME_START: data.OPEARTION_CHARGING_TIME_START || '',
    OPEARTION_CHARGING_TIME_END: data.OPEARTION_CHARGING_TIME_END || '',
    ZX_DEPT: data.ZX_DEPT || '',
    DEPT_TWO_NAME: data.DEPT_TWO_NAME || '',
    SPECIFICATION_OR_TYPE: data.SPECIFICATION_OR_TYPE || '',
    VARIETIE_NAME: data.VARIETIE_NAME || '',
    VARIETIE_CODE_NEW: data.VARIETIE_CODE_NEW || '',
    WZ_VAR_CODE: data.WZ_VAR_CODE || '',
    IS_GT: data.IS_GT || '',
    MANUFACTURING_ENT_NAME: data.MANUFACTURING_ENT_NAME || '',
    CHARGING_CODE: data.CHARGING_CODE || '',
    SUPPLIER_NAME: data.SUPPLIER_NAME || '',
    USE_APP_STATE: data.USE_APP_STATE || '',
    ID: data.ID || ''
  };

//   const formData = formdataify(formatData);
  const res = await request.post('/DeptConsume/getSzseSpUseDelInfo', formatData);
  
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 科室消耗确认 - 确认使用
 * @param {Object} data - 请求参数 { SzseSpUseHzInfoList: Array, state: string, mark: string }
 * @returns {Promise} - 返回请求Promise
 */
export async function appSzseUseInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SzseSpUseHzInfoList: data.SzseSpUseHzInfoList || [],
    state: data.state || '',
    mark: data.mark || ''
  };

  // 对于包含数组的复杂对象，直接发送JSON对象
  const res = await request.post('/DeptConsume/appSzseUseInfo', formatData);
  
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

