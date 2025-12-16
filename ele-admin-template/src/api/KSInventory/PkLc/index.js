import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

// ======================== 主单接口 (PK_LC_MAIN) ========================

/**
 * 分页查询主单列表
 * @param {Object} params - { page, limit, where, order }
 */
export async function getMainList(params) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    pageIndex: params.page || 1,
    pageSize: params.limit || 10,
    id: params.where?.id || '',
    deptTwoCode: params.where?.deptTwoCode || '',
    state: params.where?.state !== undefined ? params.where.state : null,
    searchName: params.where?.searchName !== undefined ? params.where.searchName : null
  };

  try {
    const res = await request.post('/PkLc/GetMainList', jsonData);
    if (res.data.code === 200) {
      return {
        total: res.data.total,
        result: res.data.data
      };
    } else {
      return Promise.reject(new Error(res.data.msg || '获取主单列表失败'));
    }
  } catch (error) {
    console.error('获取主单列表出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 根据ID获取主单
 * @param {Number} id - 主单ID
 */
export async function getMainById(id) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/GetMainById', { token, id });
    if (res.data.code === 200) {
      return res.data.data;
    } else {
      return Promise.reject(new Error(res.data.msg || '获取主单详情失败'));
    }
  } catch (error) {
    console.error('获取主单详情出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 新增主单
 * @param {Object} data - 主单数据
 */
export async function insertMain(data) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    data: {
      DEPT_TWO_CODE: data.DEPT_TWO_CODE,
      PHONE: data.PHONE,
      SURGICAL_PRO_NAME: data.SURGICAL_PRO_NAME,
      REMARK: data.REMARK,
      PATIENT_NAME: data.PATIENT_NAME,
      EXPIRATION_TIME: data.EXPIRATION_TIME
    },
  };

  try {
    const res = await request.post('/PkLc/InsertMain', jsonData);
    return res.data;
  } catch (error) {
    console.error('新增主单出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 更新主单
 * @param {Object} data - 主单数据（含ID）
 */
export async function updateMain(data) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    data: {
      ID: data.ID,
      PHONE: data.PHONE,
      SURGICAL_PRO_NAME: data.SURGICAL_PRO_NAME,
      REMARK: data.REMARK,
      PATIENT_NAME: data.PATIENT_NAME,
    },
  };

  try {
    const res = await request.post('/PkLc/UpdateMain', jsonData);
    return res.data;
  } catch (error) {
    console.error('更新主单出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 删除主单（逻辑删除）
 * @param {Number} id - 主单ID
 */
export async function deleteMain(id) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/DeleteMain', { token, id });
    return res.data;
  } catch (error) {
    console.error('删除主单出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 提交主单（状态改为已提交）
 * @param {Number} id - 主单ID
 */
export async function submitMain(id) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/SubmitMain', { token, id });
    return res.data;
  } catch (error) {
    console.error('提交主单出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 审批主单
 * @param {Object} data - { id, approved, spRemark }
 */
export async function approveMain(data) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    id: data.id,
    state: data.state, // 2=通过, -1=不通过
    spRemark: data.spRemark
  };

  try {
    const res = await request.post('/PkLc/ApproveMain', jsonData);
    return res.data;
  } catch (error) {
    console.error('审批主单出错:', error);
    return Promise.reject(error);
  }
}

// ======================== 明细接口 (PK_LC_DTL) ========================

/**
 * 分页查询明细列表
 * @param {Object} params - { page, limit, where }
 */
export async function getDtlList(params) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    pageIndex: params.page || 1,
    pageSize: params.limit || 10,
    keyword: params.where?.keyword || ''
  };

  try {
    const res = await request.post('/PkLc/GetDtlList', jsonData);
    if (res.data.code === 200) {
      return {
        total: res.data.total,
        result: res.data.data
      };
    } else {
      return Promise.reject(new Error(res.data.msg || '获取明细列表失败'));
    }
  } catch (error) {
    console.error('获取明细列表出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 根据ID获取明细
 * @param {Number} id - 明细ID
 */
export async function getDtlById(id) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/GetDtlById', { token, id });
    if (res.data.code === 200) {
      return res.data.data;
    } else {
      return Promise.reject(new Error(res.data.msg || '获取明细详情失败'));
    }
  } catch (error) {
    console.error('获取明细详情出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 根据主单ID获取明细列表
 * @param {Number} mainId - 主单ID
 */
export async function getDtlListByMainId(mainId) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/GetDtlListByMainId', { token, id: mainId });
    if (res.data.code === 200) {
      return res.data.data || [];
    } else {
      return Promise.reject(new Error(res.data.msg || '获取明细列表失败'));
    }
  } catch (error) {
    console.error('根据主单ID获取明细列表出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 新增明细（支持批量添加，包含计划临采次数）
 * @param {Object} data - { PK_LC_MAIN_ID, products: [{ VARIETIE_CODE, PLAN_LC_TIMES }] }
 */
export async function insertDtl(data) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    PK_LC_MAIN_ID: data.PK_LC_MAIN_ID,
    VARIETIE_CODES: data.VARIETIE_CODES,
    PLAN_LC_TIMES: data.PLAN_LC_TIMES,
  };

  try {
    const res = await request.post('/PkLc/InsertDtl', jsonData);
    return res.data;
  } catch (error) {
    console.error('新增明细出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 更新明细（仅支持修改计划临采次数）
 * @param {Object} data - { ID, PLAN_LC_TIMES }
 */
export async function updateDtl(data) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const jsonData = {
    token,
    data: {
      ID: data.ID,
      PLAN_LC_TIMES: data.PLAN_LC_TIMES
    }
  };

  try {
    const res = await request.post('/PkLc/UpdateDtl', jsonData);
    return res.data;
  } catch (error) {
    console.error('更新明细出错:', error);
    return Promise.reject(error);
  }
}

/**
 * 删除明细
 * @param {Number} id - 明细ID
 */
export async function deleteDtl(id) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/DeleteDtl', { token, id });
    return res.data;
  } catch (error) {
    console.error('删除明细出错:', error);
    return Promise.reject(error);
  }
}


export async function getAllDeptTwo() {
  try {
    const res = await request.get('/DeptTwoBasicInfo/getAll');
    const data = JSON.parse(res.data);
    return data || [];
  } catch (error) {
    console.error('获取二级科室列表出错:', error);
    return Promise.reject('获取二级科室列表出错');
  }
}

/**
 * 获取已存在的二级科室列表
 */
export async function getExistDeptTwoList() {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);
  try {
    const res = await request.post('/PkLc/GetExistDeptTwoList', { token });
    if (res.data.code === 200) {
      return res.data.data || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error('获取二级科室列表出错:', error);
    return [];
  }
}


/**
 * 获取临采明细计划列表
 * @param {Number} pkLcDtlId - 明细ID
 */
export async function GetLcDtlPlanList(pkLcDtlId) {
  const token = sessionStorage.getItem(TOKEN_STORE_NAME);

  try {
    const res = await request.post('/PkLc/GetLcDtlPlanList', { token, ID: pkLcDtlId });
    if (res.data.code === 200) {
      return res.data.data || [];
    } else {
      return Promise.reject(new Error(res.data.msg || '获取临采明细计划列表失败'));
    }
  } catch (error) {
    console.error('获取临采明细计划列表出错:', error);
    return Promise.reject(error);
  }
}

/* 获取授权品种 */
export async function SerachAuthVarPkLc(data) {
  var data2 = {};
  data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.SPECIFICATION_OR_TYPE = data.where.spec ? data.where.spec : '';
  data2.MANUFACTURING_ENT_NAME = data.where.manufacturer ? data.where.manufacturer : '';
  data2.varType = '';


  // var data2 = DataToObject(data);
  // var rep = formdataify(data2)
  const res = await request.get('/DeptApplyPlan/SerachAuthVarPkLc', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
