import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Encrypt } from '@/utils/aes-util';

/**
 * 获取手术信息
 * @param {Object} params 请求参数
 * @param {string} params.MZZY 门诊住院标识，1-住院，2-门诊
 * @returns {Promise} 返回请求结果
 */
export async function getBdSzYyHisSs(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '1' ,
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

/**
 * 获取手术明细信息
 * @param {Object} params 请求参数
 * @param {string} params.MZZY 门诊住院标识，1-住院，2-门诊
 * @returns {Promise} 返回请求结果
 */
export async function getBdszgsjMainDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '1' ,
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

/**
 * 获取手术配送明细信息
 * @param {Object} params 请求参数
 * @param {string} params.MZZY 门诊住院标识，1-住院，2-门诊
 * @returns {Promise} 返回请求结果
 */
export async function getBdszZgsjMainPsDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
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

/**
 * 搜索品种批次ID
 * @param {Object} params 请求参数
 * @param {number} params.page 页码
 * @param {number} params.limit 每页数量
 * @param {string} params.varietie 品种关键词
 * @returns {Promise} 返回请求结果
 */
export async function searchVarietieBatchIds(params) {
  const formData = new FormData();
  formData.append("Token", sessionStorage.getItem(TOKEN_STORE_NAME));
  formData.append("page", params.page || 1);
  formData.append("size", params.limit || 10);
  formData.append("varietie", params.where?.varietie || "");

  let res = await request.post(
    '/DeptPlanTransfer/SearchVarietieBatchIds',
    formData,
  );
  
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}



