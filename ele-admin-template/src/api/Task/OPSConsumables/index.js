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
  console.log(params)
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where?.MZZY || '' ,
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
    MZZY: params.where?.MZZY || '' ,
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
    MZZY: params.where?.MZZY || '',
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

/**
 * 添加手术配送明细
 * @param {Array} data 配送明细数据
 * @param {string} data[].BDSZ_ZQSJ_ID 手术ID
 * @param {string} data[].PS_COUNT 配送数量
 * @param {string} data[].BATCH_ID 批次ID
 * @param {string} data[].PS_MAN 配送人
 * @param {string} data[].PS_TIME 配送时间
 * @returns {Promise} 返回请求结果
 */
export async function addBdszZqsjMainPsDel(data) {
  data.forEach(item => {
    item.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    item.PS_MAN = store.getters.user.info.Nickname;
  });
  
  let res = await request.post(
    '/DeptPlanTransfer/AddBdszZqsjMainPsDel',
    data
  )
  console.log(res.data)
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}





