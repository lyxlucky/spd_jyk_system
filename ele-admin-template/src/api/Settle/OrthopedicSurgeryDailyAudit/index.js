import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify } from '@/utils/formdataify';

/**
 * 骨科手术日清审核 - 获取主表（汇总）信息
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getOrthopedicSurgeryHzInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    APPLY_DEPT: data.APPLY_DEPT || '',
    SURGERY_STATUS: data.SURGERY_STATUS || '',
    CONSUME_STATUS: data.CONSUME_STATUS || '',
    IS_HIS_CHARGE_CONSISTENT: data.IS_HIS_CHARGE_CONSISTENT || '',
    ZX_DEPT: data.ZX_DEPT || '',
    PATIENT_NAME: data.PATIENT_NAME || '',
    HOSPITALIZATION_NUMBER: data.HOSPITALIZATION_NUMBER || '',
    SUBMIT_HIS_STATUS: data.SUBMIT_HIS_STATUS || '',
    IS_ORTHOPEDIC_SURGERY: data.IS_ORTHOPEDIC_SURGERY || '',
    IS_CONSUME: data.IS_CONSUME || '',
    SURGERY_DATE_START: data.SURGERY_DATE_START || '',
    SURGERY_DATE_END: data.SURGERY_DATE_END || '',
    AUDIT_STATE: data.AUDIT_STATE || '',
    IS_AUDIT_BATCH_VALIDITY: data.IS_AUDIT_BATCH_VALIDITY || '',
    IS_FOLLOW_STAGE: data.IS_FOLLOW_STAGE || '',
    VARIETIE_CHARGE_START: data.VARIETIE_CHARGE_START || '',
    VARIETIE_CHARGE_END: data.VARIETIE_CHARGE_END || '',
    DEPT_APPROVAL_START: data.DEPT_APPROVAL_START || '',
    DEPT_APPROVAL_END: data.DEPT_APPROVAL_END || '',
    ID: data.ID || ''
  };

  const res = await request.post(
    '/DeptConsume/getOrthopedicSurgeryHzInfo',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 骨科手术日清审核 - 获取明细信息
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getOrthopedicSurgeryDelInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    APPLY_DEPT: data.APPLY_DEPT || '',
    SURGERY_STATUS: data.SURGERY_STATUS || '',
    CONSUME_STATUS: data.CONSUME_STATUS || '',
    IS_HIS_CHARGE_CONSISTENT: data.IS_HIS_CHARGE_CONSISTENT || '',
    ZX_DEPT: data.ZX_DEPT || '',
    PATIENT_NAME: data.PATIENT_NAME || '',
    HOSPITALIZATION_NUMBER: data.HOSPITALIZATION_NUMBER || '',
    SUBMIT_HIS_STATUS: data.SUBMIT_HIS_STATUS || '',
    IS_ORTHOPEDIC_SURGERY: data.IS_ORTHOPEDIC_SURGERY || '',
    IS_CONSUME: data.IS_CONSUME || '',
    SURGERY_DATE_START: data.SURGERY_DATE_START || '',
    SURGERY_DATE_END: data.SURGERY_DATE_END || '',
    AUDIT_STATE: data.AUDIT_STATE || '',
    IS_AUDIT_BATCH_VALIDITY: data.IS_AUDIT_BATCH_VALIDITY || '',
    IS_FOLLOW_STAGE: data.IS_FOLLOW_STAGE || '',
    VARIETIE_CHARGE_START: data.VARIETIE_CHARGE_START || '',
    VARIETIE_CHARGE_END: data.VARIETIE_CHARGE_END || '',
    DEPT_APPROVAL_START: data.DEPT_APPROVAL_START || '',
    DEPT_APPROVAL_END: data.DEPT_APPROVAL_END || '',
    ID: data.ID || ''
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
