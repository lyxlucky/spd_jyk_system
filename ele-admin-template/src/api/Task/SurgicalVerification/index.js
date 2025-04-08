import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';


export async function getBdSzYyHisSs(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '',
    page: params.page || 1,
    size: params.limit || 10,
  }

  let res = await request.post(
    '/DeptPlanTransfer/getBdSzYyHisSs',
    formatData
  )

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
    size: params.limit || 10,
  }

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszgsjMainDel',
    formatData
  )

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function getBdszZgsjMainPsDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    BDSZ_ZQSJ_ID: params.where.BDSZ_ZQSJ_ID || '-1',
    VARIETIE_CODE_NEW: params.where.VARIETIE_CODE_NEW || '',
    MZZY: params.where.MZZY || '1',
    page: params.page || 1,
    size: params.limit || 10,
  }

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZgsjMainPsDel',
    formatData
  )

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
  )

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}
