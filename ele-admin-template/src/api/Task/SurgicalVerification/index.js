import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
<<<<<<< HEAD
import { Encrypt } from '@/utils/aes-util';

export async function getBdSzYyHisSs(data) {
  console.log(data);
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    VarietieCode: data.where.keyword || '',
    BHDate: data.where.date || '',
    SenState: data.where.state || '-1',
    PlanNum: data.where.planNo || ''
  };
  // const encriptData = {
  //   prams: Encrypt(JSON.stringify(formatData)),
  //   AesKey: store.state.user.encrypted.KEY,
  //   page: data.page ? data.page : 1,
  //   size: data.limit ? data.limit : 30
  // };
  const res = await request.post(
    '/DeptPlanTransfer/getBdSzYyHisSs',
    formdataify(formatData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function GetBdszgsjMainDel(data) {
  console.log(data);
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    // 1-门诊，2-住院
    MZZY: 1
  };

  const res = await request.post(
    '/DeptPlanTransfer/GetBdszgsjMainDel',
    formdataify(formatData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}



export async function GetBdszZgsjMainPsDel(data) {
  console.log(data);
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    // 1-门诊，2-住院
    MZZY: 1
  };

  const res = await request.post(
    '/DeptPlanTransfer/GetBdszZgsjMainPsDel',
    formdataify(formatData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
=======

export async function getBdSzYyHisSs(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '',
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

>>>>>>> 6299298dce3c3a617262213a6a1853f91df066bd
