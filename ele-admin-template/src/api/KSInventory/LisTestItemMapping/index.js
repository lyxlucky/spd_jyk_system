import request from '@/utils/request'
import { TOKEN_STORE_NAME } from '@/config/setting'

/**
 * 查询检验项目信息
 * @param {Object} params - 查询参数
 * @param {string} params.lisKeyword - LIS项目关键词（搜索代码/名称）
 * @param {string} params.hisKeyword - HIS项目关键词（搜索代码/名称）
 * @param {string} params.varietieKeyword - 物料关键词（搜索编码/名称/简称）
 * @param {string} params.QYBZ - 启用状态
 * @param {number} params.Page - 页码
 * @param {number} params.Size - 每页数量
 * @returns {Promise} - 返回请求Promise
 */
export async function queryLisTestItems(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/QueryLisTestItems',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 同步LIS数据
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function syncLisData(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/SyncLisData',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 添加HIS对码关系
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function addLisTestItemHis(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/AddLisTestItemHis',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 批量添加HIS对码关系
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function addLisTestItemHisBatch(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/AddLisTestItemHisBatch',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 添加SPD对码关系
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function addLisTestItemSpd(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/AddLisTestItemSpd',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 批量添加SPD对码关系
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function addLisTestItemSpdBatch(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/AddLisTestItemSpdBatch',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 删除HIS对码关系（逻辑删除）
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function deleteLisTestItemHis(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/DeleteLisTestItemHis',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 删除SPD对码关系（逻辑删除）
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function deleteLisTestItemSpd(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/DeleteLisTestItemSpd',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}

/**
 * 更新LIS检验项目权重
 * @param {Object} params - 参数
 * @returns {Promise} - 返回请求Promise
 */
export async function updateLisTestItemWeight(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...params
  }

  const res = await request.post(
    '/PekingLis/UpdateLisTestItemWeight',
    formatData
  )

  if (res.data.code == 200) {
    return res.data
  } else {
    return Promise.reject(new Error(res.data.msg))
  }
}
