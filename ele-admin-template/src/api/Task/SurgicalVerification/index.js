import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function getBdSzYyHisSs(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY == 'ALL' ? '' : params.where.MZZY || '-1',
    SSFJ: params.where.SSFJ || '',
    condition: params.where.condition || '',
    page: params.page || 1,
    size: params.limit || 10
  };

  let res = await request.post('/DeptPlanTransfer/getBdSzYyHisSs', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function getBdszgsjMainDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '',
    page: params.page || 1,
    size: params.limit || 10
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszgsjMainDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function getBdszZgsjMainPsDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    BDSZ_ZQSJ_ID: params.where.BDSZ_ZQSJ_ID || '-1',
    SSBH: params.where.SSBH || '',
    VARIETIE_CODE_NEW: params.where.VARIETIE_CODE_NEW || '',
    MZZY: params.where.MZZY || '1',
    page: params.page || 1,
    size: params.limit || 10
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZgsjMainPsDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function updateBdszZqsjMainPsDelUse(params) {
  params[0].Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  let res = await request.post(
    '/DeptPlanTransfer/updateBdszZqsjMainPsDelUse',
    params
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//获取耗材使用明细
export async function GetBdszZqsjMainUseDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    VARIETIE_CODE_NEW: params.where.VARIETIE_CODE_NEW || '',
    page: params.page || 1,
    SSBH: params.where.SSBH || '',
    size: params.limit || 10
  };
  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZqsjMainUseDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//UDI扫码添加
export async function addBdszZqsjMainPsDelUse(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: params.ID || '',
    UDI: params.UDI || '',
    USE_COUNT: params.USE_COUNT,
    BDSZ_ZQSJ_PS_ID: params.BDSZ_ZQSJ_PS_ID || '',
    page: params.page || 1,
    size: params.limit || 10
  };
  let res = await request.post(
    '/DeptPlanTransfer/addBdszZqsjMainPsDelUse',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//护士审批
export async function BdSsApprove(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    qdid: params.qdid
  };
  let res = await request.post('/Abdzczh/BdSsApprove', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//删除确认明细
export async function deleteUsedQty(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: params.ID
  };
  let res = await request.post('/DeptPlanTransfer/deleteUsedQty', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 扫码交接
export async function commitBdszSsyyInfo(data) {
  const formatData = {
    ...data,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };

  const reFormatData = formdataify(formatData);

  let res = await request.post('/DeptConsume/commitBdszSsyyInfo', reFormatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 勾选确认数据源
export async function GetBdszZqsjMainNoUseDel(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.limit || 10,
    SSBH: data.where.SSBH || '',
    VARIETIE_CODE_NEW: data.where.VARIETIE_CODE_NEW || ''
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZqsjMainNoUseDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function addBdszZqsjMainPsDelUseV2(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    data: data.json
  };

  let res = await request.post(
    '/DeptPlanTransfer/addBdszZqsjMainPsDelUseV2',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 术中交接
export async function addBdSzHisInSurgery(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.SSBH,
    REMARK: data.REMARK
  };

  let res = await request.post(
    '/Commons/BdSzHisInSurgery',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 获取交接记录
export async function ListBdSzHisInSurgery(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.where?.SSBH || '',
    page: data.page || 1,
    size: data.size || 10
  };

  let res = await request.post(
    '/Commons/ListBdSzHisInSurgery',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 新增使用
export async function addNewBdszZq(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SJBH: data.SJBH || '',
    ZYHM: data.ZYHM || '',
    BRXM: data.BRXM || '',
    SSMC: data.SSMC || '',
    data: data.data || []
  };

  let res = await request.post(
    '/DeptPlanTransfer/addNewBdszZq',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

