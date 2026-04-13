import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

/** @returns {Record<string, any>} */
function withToken(extra = {}) {
  return {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...extra
  };
}

function isSuccess(res) {
  const c = res.data && res.data.code;
  return c === 200 || c === '200';
}

/**
 * 字典类型分页列表
 * @param {object} params
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @param {string} [params.dictTypeCode]
 * @param {string} [params.dictTypeName]
 * @param {string} [params.status]
 */
export async function dictTypeList(params = {}) {
  const res = await request.post(
    '/DictManagement/DictTypeList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 10,
      DictTypeCode: params.dictTypeCode,
      DictTypeName: params.dictTypeName,
      Status: params.status
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询字典类型失败'));
}

/**
 * 按类型编码一次获取字典类型 + 字典项列表（合并 DictTypeList + DictDataList）。
 * 若传入 mgmtCatCode，则同时返回该管理类别下品种证件必填规则（rules / ruleTotal）。
 * @param {object} params
 * @param {string} params.dictTypeCode
 * @param {string} [params.status] 字典项状态，默认 1
 * @param {number} [params.size] 字典项条数上限，默认 500
 * @param {number} [params.mgmtCatCode] 管理类别编码，传入时附带 rules
 */
export async function dictDataByTypeCode(params = {}) {
  const res = await request.post(
    '/DictManagement/DictDataByTypeCode',
    withToken({
      page: 1,
      size: params.size != null ? params.size : 500,
      DictTypeCode: params.dictTypeCode,
      Status: params.status,
      MgmtCatCode: params.mgmtCatCode
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询字典失败'));
}

/**
 * 字典类型详情
 * @param {number|string} dictTypeId
 */
export async function dictTypeGet(dictTypeId) {
  const res = await request.post(
    '/DictManagement/DictTypeGet',
    withToken({ DictTypeId: dictTypeId })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取字典类型失败'));
}

/**
 * 新增或保存字典类型（新增时 DictTypeId 传 0）
 * @param {object} data
 * @param {number} [data.dictTypeId]
 * @param {string} data.dictTypeCode
 * @param {string} data.dictTypeName
 * @param {string} [data.remark]
 * @param {string} [data.status]
 * @param {number} [data.sortNum]
 */
export async function dictTypeSave(data) {
  const res = await request.post(
    '/DictManagement/DictTypeSave',
    withToken({
      DictTypeId: data.dictTypeId != null ? data.dictTypeId : 0,
      DictTypeCode: data.dictTypeCode,
      DictTypeName: data.dictTypeName,
      Remark: data.remark,
      Status: data.status,
      SortNum: data.sortNum != null ? data.sortNum : 0
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '保存字典类型失败'));
}

/**
 * 删除字典类型（含子项）
 * @param {number|string} dictTypeId
 */
export async function dictTypeDelete(dictTypeId) {
  const res = await request.post(
    '/DictManagement/DictTypeDelete',
    withToken({ DictTypeId: dictTypeId })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '删除字典类型失败'));
}

/**
 * 字典数据分页列表
 * @param {object} params
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @param {number|string} [params.dictTypeId]
 * @param {string} [params.dictValue]
 * @param {string} [params.dictLabel]
 * @param {string} [params.status]
 */
export async function dictDataList(params = {}) {
  const res = await request.post(
    '/DictManagement/DictDataList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 10,
      DictTypeId: params.dictTypeId,
      DictValue: params.dictValue,
      DictLabel: params.dictLabel,
      Status: params.status
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询字典数据失败'));
}

/**
 * 字典数据详情
 * @param {number|string} dictDataId
 */
export async function dictDataGet(dictDataId) {
  const res = await request.post(
    '/DictManagement/DictDataGet',
    withToken({ DictDataId: dictDataId })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取字典数据失败'));
}

/**
 * 新增或保存字典数据（新增时 DictDataId 传 0）
 * @param {object} data
 * @param {number} [data.dictDataId]
 * @param {number|string} data.dictTypeId
 * @param {string} data.dictValue
 * @param {string} data.dictLabel
 * @param {string} [data.tagColor]
 * @param {string} [data.tagEffect]
 * @param {string} [data.listCssClass]
 * @param {string} [data.extJson]
 * @param {string} [data.remark]
 * @param {string} [data.status]
 * @param {number} [data.sortNum]
 */
export async function dictDataSave(data) {
  const res = await request.post(
    '/DictManagement/DictDataSave',
    withToken({
      DictDataId: data.dictDataId != null ? data.dictDataId : 0,
      DictTypeId: data.dictTypeId,
      DictValue: data.dictValue,
      DictLabel: data.dictLabel,
      TagColor: data.tagColor,
      TagEffect: data.tagEffect,
      ListCssClass: data.listCssClass,
      ExtJson: data.extJson,
      Remark: data.remark,
      Status: data.status,
      SortNum: data.sortNum != null ? data.sortNum : 0
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '保存字典数据失败'));
}

/**
 * 删除字典数据
 * @param {number|string} dictDataId
 */
export async function dictDataDelete(dictDataId) {
  const res = await request.post(
    '/DictManagement/DictDataDelete',
    withToken({ DictDataId: dictDataId })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '删除字典数据失败'));
}
