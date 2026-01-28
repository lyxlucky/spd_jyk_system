import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

/**
 * 骨科手术日清审核 - 获取手术列表（复用GetSurgeryList接口）
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getSurgeryList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    ID: data.ID || null,
    SURGERY_NO: data.SURGERY_NO || '',
    PATIENT_NAME: data.PATIENT_NAME || '',
    HOSPITALIZATION_NUMBER: data.HOSPITALIZATION_NUMBER || '',
    SURGERY_LOCATION: data.SURGERY_LOCATION || '',
    APPLY_DEPT_CODE: data.APPLY_DEPT_CODE || '',
    APPLY_DEPT: data.APPLY_DEPT || '',
    SURGERY_STATUS: data.SURGERY_STATUS != null && data.SURGERY_STATUS !== '' ? parseInt(data.SURGERY_STATUS) : null,
    CONSUME_STATUS: data.CONSUME_STATUS != null && data.CONSUME_STATUS !== '' ? parseInt(data.CONSUME_STATUS) : null,
    CHIEF_SURGEON: data.CHIEF_SURGEON || '',
    ACTUAL_SURGERY_DATE_START: data.SURGERY_DATE_START || null,
    ACTUAL_SURGERY_DATE_END: data.SURGERY_DATE_END || null,
    IS_UPLOAD_IMPLANT: data.IS_UPLOAD_IMPLANT || '',
    CREATE_MAN: data.CREATE_MAN || '',
    IS_FOLLOW_STAGE: data.IS_FOLLOW_STAGE != null && data.IS_FOLLOW_STAGE !== '' ? parseInt(data.IS_FOLLOW_STAGE) : null,
    // 骨科手术日清审核扩展字段
    IS_HIS_CHARGE_CONSISTENT: data.IS_HIS_CHARGE_CONSISTENT != null && data.IS_HIS_CHARGE_CONSISTENT !== '' ? parseInt(data.IS_HIS_CHARGE_CONSISTENT) : null,
    SUBMIT_HIS_STATUS: data.SUBMIT_HIS_STATUS != null && data.SUBMIT_HIS_STATUS !== '' ? parseInt(data.SUBMIT_HIS_STATUS) : null,
    IS_ORTHOPEDIC_SURGERY: data.IS_ORTHOPEDIC_SURGERY != null && data.IS_ORTHOPEDIC_SURGERY !== '' ? parseInt(data.IS_ORTHOPEDIC_SURGERY) : null,
    IS_CONSUME: data.IS_CONSUME != null && data.IS_CONSUME !== '' ? parseInt(data.IS_CONSUME) : null,
    AUDIT_STATE: data.AUDIT_STATE != null && data.AUDIT_STATE !== '' ? parseInt(data.AUDIT_STATE) : null,
    IS_AUDIT_BATCH_VALIDITY: data.IS_AUDIT_BATCH_VALIDITY != null && data.IS_AUDIT_BATCH_VALIDITY !== '' ? parseInt(data.IS_AUDIT_BATCH_VALIDITY) : null,
    ZX_DEPT: data.ZX_DEPT || ''
  };

  const res = await request.post(
    '/SurgeryOrder/GetSurgeryList',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 获取消耗品种明细
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getOrthopedicSurgeryDelInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    SURGERY_NO: data.SURGERY_NO || ''
  };

  const res = await request.post(
    '/DeptConsume/getOrthopedicSurgeryDelInfo',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 获取全部申请科室
 * @returns {Promise} - 返回请求Promise
 */
export async function getAllApplyDepartments() {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const res = await request.post(`/SurgeryOrder/getAllApplyDepartments?Token=${Token}`);

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 修改批号效期
 * @param {Object} data - 修改参数 { ID, BATCH_NO, VALIDITY_DATE }
 * @returns {Promise} - 返回请求Promise
 */
export async function updateBatchValidity(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID || '',
    BATCH_NO: data.BATCH_NO || '',
    VALIDITY_DATE: data.VALIDITY_DATE || ''
  };

  const res = await request.post(
    '/DeptConsume/updateBatchValidity',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 批号效期审核
 * @param {Object} data - 审核参数 { SURGERY_NOS: [] }
 * @returns {Promise} - 返回请求Promise
 */
export async function auditBatchValidity(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SURGERY_NOS: data.SURGERY_NOS || []
  };

  const res = await request.post(
    '/DeptConsume/auditBatchValidity',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 手术消耗审批
 * @param {Object} data - 审批参数 { SURGERY_NOS: [], DECISION }
 * @returns {Promise} - 返回请求Promise
 */
export async function approveConsume(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SURGERY_NOS: data.SURGERY_NOS || [],
    DECISION: data.DECISION || 'pass'
  };

  const res = await request.post(
    '/DeptConsume/approveConsume',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
