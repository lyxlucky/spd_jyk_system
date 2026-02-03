import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

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

/**
 * 手术单管理 - 批量修改执行科室
 * @param {Object} data - { SURGERY_NO, items: [{ ID, SOURCE_TYPE }], DEPT_CODE }
 * @returns {Promise}
 */
export async function batchUpdateExecuteDept(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SURGERY_NO: data.SURGERY_NO || '',
    items: data.items || [],
    DEPT_CODE: data.DEPT_CODE || ''
  };

  const res = await request.post(
    '/SurgeryOrder/BatchUpdateExecuteDept',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 创建手术单
 * @param {Object} data - 手术单信息
 * @returns {Promise} - 返回请求Promise
 */
export async function addSurgeryOrder(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...data,
    // 自动从全局获取申请科室信息
    APPLY_DEPT: store.state.user.info?.DeptNow?.Dept_Two_Name || '',
    APPLY_DEPT_CODE: store.state.user.info?.DeptNow?.Dept_Two_Code || ''
  };

  const res = await request.post(
    '/SurgeryOrder/AddSurgery',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 更新手术单
 * @param {Object} data - 手术单信息
 * @returns {Promise} - 返回请求Promise
 */
export async function updateSurgeryOrder(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...data
  };

  const res = await request.post(
    '/SurgeryOrder/UpdateSurgery',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 更新手术单状态
 * @param {Object} data - 包含ID和surgeryStatus
 * @returns {Promise} - 返回请求Promise
 */
export async function updateSurgeryStatus(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...data
  };

  const res = await request.post(
    '/SurgeryOrder/UpdateSurgeryStatus',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 作废手术单
 * @param {Object} data - 包含ID
 * @returns {Promise} - 返回请求Promise
 */
export async function invalidateSurgeryOrder(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...data
  };

  const res = await request.post(
    '/SurgeryOrder/InvalidateSurgery',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 获取全部手术地点
 * @returns {Promise} - 返回请求Promise
 */
export async function getAllSurgeryLocations() {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.post(`/SurgeryOrder/getAllSurgeryLocations?Token=${Token}`);

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 手术单管理 - 获取全部申请科室
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
 * 获取单个手术单详情 - 使用CRUD接口
 * @param {number} id - 手术单ID
 * @returns {Promise} - 返回请求Promise
 */
export async function getSurgeryById(id) {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.get(
    `/SurgeryOrder/GetSurgeryById?id=${id}&Token=${Token}`,
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 登记手术消耗
 * @param {Object} data - 包含SURGERY_ID, SURGERY_NO, BARCODE
 * @returns {Promise} - 返回请求Promise
 */
export async function addSurgeryConsumable(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SURGERY_ID: data.SURGERY_ID,
    SURGERY_NO: data.SURGERY_NO,
    BARCODE: data.BARCODE
  };

  const res = await request.post(
    '/SurgeryOrder/AddSurgeryConsumable',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 查询手术单列表 - 使用CRUD接口（用于替代getSurgeryOrderHzInfo）
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getSurgeryList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    SURGERY_NO: data.SURGERY_NO || '',
    PATIENT_NAME: data.PATIENT_NAME || '',
    HOSPITALIZATION_NUMBER: data.HOSPITALIZATION_NUMBER || '',
    IN_HOSP_NO: data.IN_HOSP_NO || '',
    SURGERY_LOCATION: data.SURGERY_LOCATION || '',
    APPLY_DEPT: data.APPLY_DEPT || '',
    APPLY_DEPT_CODE: data.APPLY_DEPT_CODE || '',
    SURGERY_STATUS: data.SURGERY_STATUS ? parseInt(data.SURGERY_STATUS) : null,
    CONSUME_STATUS: data.CONSUME_STATUS ? parseInt(data.CONSUME_STATUS) : null,
    CHIEF_SURGEON: data.CHIEF_SURGEON || '',
    PLAN_SURGERY_DATE_START: data.PLAN_SURGERY_DATE_START || '',
    PLAN_SURGERY_DATE_END: data.PLAN_SURGERY_DATE_END || '',
    ACTUAL_SURGERY_DATE_START: data.ACTUAL_SURGERY_DATE_START || '',
    ACTUAL_SURGERY_DATE_END: data.ACTUAL_SURGERY_DATE_END || '',
    IS_UPLOAD_IMPLANT: data.IS_UPLOAD_IMPLANT || '',
    CREATE_MAN: data.CREATE_MAN || '',
    IS_FOLLOW_STAGE: data.IS_FOLLOW_STAGE ? parseInt(data.IS_FOLLOW_STAGE) : null
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
 * 上传植入物单（真实文件上传）
 * @param {Object} data - 包含ID和file
 * @returns {Promise} - 返回请求Promise
 */
export async function uploadImplantForm(data) {
  const formData = new FormData();
  formData.append('Token', sessionStorage.getItem(TOKEN_STORE_NAME));
  formData.append('ID', data.ID);

  // 支持多个文件上传
  if (data.files && data.files.length > 0) {
    data.files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
  } else if (data.file) {
    formData.append('file', data.file);
  }

  const res = await request.post(
    '/SurgeryOrder/UploadImplantForm',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 获取植入物单路径
 * @param {number} id - 手术单ID
 * @returns {Promise} - 返回请求Promise
 */
export async function getImplantForm(id) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: id
  };

  const res = await request.post(
    '/SurgeryOrder/GetImplantForm',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 确认消耗
 * @param {Object} data - 包含SURGERY_ID和SURGERY_NO
 * @returns {Promise} - 返回请求Promise
 */
export async function confirmConsumption(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SURGERY_ID: data.SURGERY_ID,
    SURGERY_NO: data.SURGERY_NO
  };

  const res = await request.post(
    '/SurgeryOrder/ConfirmConsumption',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 删除手术消耗
 * @param {Object} data - 包含ID
 * @returns {Promise} - 返回请求Promise
 */
export async function deleteSurgeryConsumable(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID
  };

  const res = await request.post(
    '/SurgeryOrder/DeleteSurgeryConsumable',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 补打标签 - 返回文件流
 * @param {Object} data - { SURGERY_NO, Detail: [{ DEF_NO_PKG_CODE }] }
 * @returns {Promise<{data: Blob}>} - 返回带 data(Blob) 的响应
 */
export async function printGtDetail(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    format: 'json',
    inline: 'true',
    SURGERY_NO: data.SURGERY_NO || '',
    Detail: data.Detail || []
  };
  return request.post('/PrintPdf/PrintGtDetail', formatData, {
    responseType: 'blob'
  });
}
