import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

/**
 * 手术单管理 - 获取主表（手术单列表）信息
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getSurgeryOrderHzInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    SURGERY_LOCATION: data.SURGERY_LOCATION || '',
    APPLY_DEPT: data.APPLY_DEPT || '',
    SURGERY_STATUS: data.SURGERY_STATUS || '',
    CONSUME_STATUS: data.CONSUME_STATUS || '',
    SUBMIT_HIS_STATUS: data.SUBMIT_HIS_STATUS || '',
    IS_UPLOAD_CONSUME: data.IS_UPLOAD_CONSUME || '',
    SURGERY_NO: data.SURGERY_NO || '',
    PATIENT_NAME: data.PATIENT_NAME || '',
    HOSPITALIZATION_NUMBER: data.HOSPITALIZATION_NUMBER || '',
    SURGERY_PLAN_START: data.SURGERY_PLAN_START || '',
    SURGERY_PLAN_END: data.SURGERY_PLAN_END || '',
    SURGERY_TIME_START: data.SURGERY_TIME_START || '',
    SURGERY_TIME_END: data.SURGERY_TIME_END || '',
    IS_UPLOAD_IMPLANT: data.IS_UPLOAD_IMPLANT || '',
    PATIENT_DEPT: data.PATIENT_DEPT || '',
    CREATOR: data.CREATOR || '',
    IS_HOSPITAL_CONSIGNMENT: data.IS_HOSPITAL_CONSIGNMENT || '',
    IS_FOLLOW_STAGE: data.IS_FOLLOW_STAGE || '',
    ID: data.ID || ''
  };

  const res = await request.post(
    '/SurgeryOrder/getSurgeryOrderHzInfo',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 获取已登记手术消耗品种明细
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getRegisteredConsumablesInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    SURGERY_NO: data.SURGERY_NO || '',
    ID: data.ID || ''
  };

  const res = await request.post(
    '/SurgeryOrder/getRegisteredConsumablesInfo',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 获取领用未登记耗材明细
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getUnregisteredConsumablesInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    SURGERY_NO: data.SURGERY_NO || '',
    ID: data.ID || '',
    FILTER_TYPE: data.FILTER_TYPE || ''
  };

  const res = await request.post(
    '/SurgeryOrder/getUnregisteredConsumablesInfo',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

