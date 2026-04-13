import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function tokenParams(extra = {}) {
  return { Token: sessionStorage.getItem(TOKEN_STORE_NAME), ...extra };
}

/** 产品类别列表 */
export async function getProTypeList() {
  const res = await request.get('/ProdBigClass/GetProTypeList', {
    params: tokenParams()
  });
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取失败'));
}

/** 按产品大类查询管理类别 */
export async function getMgmtListByProTypeID(prodBigClassCode) {
  const res = await request.get('/ProdBigClass/GetMgmtListByProTypeID', {
    params: tokenParams({ Prod_Big_Class_Code: prodBigClassCode })
  });
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取失败'));
}

/** 监管类别分页（不按管理类别） */
export async function getRegulatoryList({ keyword, page, size }) {
  const res = await request.get('/ProdBigClass/GetRegulatoryList', {
    params: tokenParams({ keyword: keyword || '', page, size })
  });
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取失败'));
}

/** 按管理类别查询监管类别分页 */
export async function getRegulatoryListByMgmnID({ mgmtCatCode, keyword, page, size }) {
  const res = await request.get('/ProdBigClass/GetRegulatoryListByMgmnID', {
    params: tokenParams({
      Mgmt_Cat_Code: mgmtCatCode,
      keyword: keyword || '',
      page,
      size
    })
  });
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取失败'));
}

/** 新增产品类别，成功返回插入行数 */
export async function insertProType(prodBigClassName) {
  const res = await request.post(
    '/ProdBigClass/InsertProType',
    formdataify(tokenParams({ prodBigClassName }))
  );
  return res.data;
}

/** 新增管理类别 */
export async function insertMgmt(Mgmt_Cat_Name, Prod_Big_Class_Code) {
  const res = await request.post(
    '/ProdBigClass/InsertMgmt',
    formdataify(tokenParams({ Mgmt_Cat_Name, Prod_Big_Class_Code }))
  );
  return res.data;
}

/** 新增监管类别 */
export async function insertRegulatory(Regulatory_Cat_Code, Regulatory_Cat_Name, Mgmt_Cat_Code) {
  const res = await request.post(
    '/ProdBigClass/InsertRegulatory',
    formdataify(
      tokenParams({
        Regulatory_Cat_Code,
        Regulatory_Cat_Name,
        Mgmt_Cat_Code
      })
    )
  );
  return res.data;
}

export async function deleteProType(prodBigClassCode) {
  const res = await request.post(
    '/ProdBigClass/DeleteProType',
    formdataify(tokenParams({ prodBigClassCode }))
  );
  return res.data;
}

export async function deleteMgmt(mgmtcatCode) {
  const res = await request.post(
    '/ProdBigClass/DeleteMgmt',
    formdataify(tokenParams({ mgmtcatCode }))
  );
  return res.data;
}

export async function deleteRegulatory(Regulatory_id) {
  const res = await request.post(
    '/ProdBigClass/DeleteRegulatory',
    formdataify(tokenParams({ Regulatory_id }))
  );
  return res.data;
}

/** 导出三大类别 Excel，成功时 code 为 200，msg 为文件名 */
export async function exportBig3Class() {
  const res = await request.post('/ProdBigClass/ExportBig3Class', formdataify(tokenParams()));
  return res.data;
}

// ---------- 管理类别 × 品种证件必填规则（MGMT_CAT_VARIETY_DOC_RULE） ----------

/**
 * 分页列表
 * @param {object} [params]
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @param {number|string} [params.ruleId]
 * @param {number} [params.mgmtCatCode]
 * @param {string} [params.dictTypeCode]
 * @param {string} [params.dictValue]
 */
export async function mgmtCatVarietyDocRuleList(params = {}) {
  const res = await request.post(
    '/MgmtCatVarietyDocRule/List',
    tokenParams({
      page: params.page ?? 1,
      size: params.size ?? 10,
      RuleId: params.ruleId,
      MgmtCatCode: params.mgmtCatCode,
      DictTypeCode: params.dictTypeCode,
      DictValue: params.dictValue
    })
  );
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询品种证件规则失败'));
}

/**
 * 一次性同步必填字典值（事务内先删后插；未出现在列表中的视为取消必填）
 * @param {object} data
 * @param {number} data.mgmtCatCode
 * @param {string[]} [data.requiredDictValues] 必填的 DICT_VALUE 列表
 * @param {string} [data.dictTypeCode] 默认 VARIETY_DOC_TYPE
 */
export async function mgmtCatVarietyDocRuleSync(data) {
  const res = await request.post(
    '/MgmtCatVarietyDocRule/Sync',
    tokenParams({
      MgmtCatCode: data.mgmtCatCode,
      DictTypeCode: data.dictTypeCode,
      RequiredDictValues: data.requiredDictValues != null ? data.requiredDictValues : []
    })
  );
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '同步品种证件规则失败'));
}

/**
 * 按主键查询
 * @param {number|string} ruleId
 */
export async function mgmtCatVarietyDocRuleGet(ruleId) {
  const res = await request.post(
    '/MgmtCatVarietyDocRule/Get',
    tokenParams({ RuleId: ruleId })
  );
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '获取品种证件规则失败'));
}

/**
 * 新增或保存（新增时 ruleId 传 0）
 * @param {object} data
 * @param {number} [data.ruleId]
 * @param {number} data.mgmtCatCode
 * @param {string} [data.dictTypeCode]
 * @param {string} data.dictValue
 * @param {string} [data.isRequired] '0' | '1'
 */
export async function mgmtCatVarietyDocRuleSave(data) {
  const res = await request.post(
    '/MgmtCatVarietyDocRule/Save',
    tokenParams({
      RuleId: data.ruleId != null ? data.ruleId : 0,
      MgmtCatCode: data.mgmtCatCode,
      DictTypeCode: data.dictTypeCode,
      DictValue: data.dictValue,
      IsRequired: data.isRequired
    })
  );
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '保存品种证件规则失败'));
}

/**
 * 删除
 * @param {number|string} ruleId
 */
export async function mgmtCatVarietyDocRuleDelete(ruleId) {
  const res = await request.post(
    '/MgmtCatVarietyDocRule/Delete',
    tokenParams({ RuleId: ruleId })
  );
  if (res.data.code === 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '删除品种证件规则失败'));
}
