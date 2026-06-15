import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

function parseLegacyList(res) {
  if (res.data === 301 || res.data === '301') {
    throw new Error('登录失效，请重新登录');
  }
  let body = res.data;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  let result = body?.result;
  if (typeof result === 'string') {
    result = JSON.parse(result);
  }
  return { list: result || [], total: body?.count ?? body?.total ?? 0 };
}

function parseLegacyArray(res) {
  if (res.data === 301 || res.data === '301') {
    throw new Error('登录失效，请重新登录');
  }
  let body = res.data;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  return Array.isArray(body) ? body : body?.result || [];
}

/** 供应商列表 */
export async function getSupplierList(params) {
  const res = await request.get('/SupplierInfo/conditions_supplier', {
    params: {
      Token: token(),
      page: params.page || 1,
      size: params.size || 999999,
      IS_ENABLE: params.IS_ENABLE ?? '1',
      supplier_code: params.supplier_code ?? '',
      supplier_name: params.supplier_name ?? ''
    }
  });
  return unwrap(res);
}

/** 供应商下合同列表 */
export async function getContractList(params) {
  const res = await request.get('/Contract/Get_Contractcode', {
    params: {
      Token: token(),
      page: params.page || 1,
      size: params.size || 999999,
      supplier_code: params.supplier_code ?? '',
      contract_code: params.contract_code ?? '',
      contract_name: params.contract_name ?? ''
    }
  });
  return unwrap(res);
}

/** 合同详情 */
export async function getContractDetails(contractCode) {
  const res = await request.get('/Contract/Get_Contractcodedetails', {
    params: { Token: token(), contract_code: contractCode }
  });
  return unwrap(res);
}

/** 合同已授权品种分页 */
export async function getContractAuthList(data) {
  const where = data.where || {};
  const order = data.order || {};
  const res = await request.get('/Contract/GetListPagealready', {
    params: {
      Token: token(),
      page: data.page || 1,
      size: data.limit || 10,
      varietie_code: where.varietie_code ?? '',
      varietie_name: where.varietie_name ?? '',
      specification_or_type: where.specification_or_type ?? '',
      unit: where.unit ?? '',
      manufacturing_ent_name: where.manufacturing_ent_name ?? '',
      approval_number: where.approval_number ?? '',
      TwoSupName: where.TwoSupName ?? '',
      contract_code: where.contract_code ?? '',
      field: order.sort ?? '',
      order:
        order.order === 'descending' ? 'desc' : order.order === 'ascending' ? 'asc' : order.order ?? ''
    }
  });
  const body = unwrap(res);
  return { total: body.total ?? 0, result: body.result || [] };
}

export async function getAllContractAuthList(where, order) {
  return getContractAuthList({ page: 1, limit: 999999, where, order });
}

/** 校验合同编码是否存在，>0 表示已存在 */
export async function isContractCode(code) {
  const res = await request.get('/Contract/IsContractcode', {
    params: { Token: token(), CONTRACT_CODE: code }
  });
  return res.data;
}

/** 新增合同 */
export async function insertContract(payload) {
  const res = await request.post('/Contract/InsertContract', formdataify({ Token: token(), ...payload }));
  return unwrap(res);
}

/** 更新合同 */
export async function updateContract(payload) {
  const res = await request.post('/Contract/UpdateContract', formdataify({ Token: token(), ...payload }));
  if (res.data === 301 || res.data === '301') throw new Error('登录失效，请重新登录');
  if (res.data === 200 || res.data === '200') return { ok: true };
  throw new Error('编辑失败');
}

/** 删除合同 */
export async function delContract(contractCode) {
  const res = await request.post(
    '/Contract/DelContract',
    formdataify({
      Token: token(),
      Contract_Code: contractCode,
      contract_code: contractCode
    })
  );
  if (res.data === 301 || res.data === '301') throw new Error('登录失效，请重新登录');
  return { msg: typeof res.data === 'string' ? res.data : res.data?.msg || '操作完成' };
}

export async function checkVarietieBasic(varietieCodes, nickname) {
  const res = await request.get('/VarietieBasicInfo/CheckVarietieBasic', {
    params: { Token: token(), VarietieCode: varietieCodes, nickname: nickname || '' }
  });
  return res.data;
}

export async function deleteContractVarieties(contractCodeGuids) {
  const res = await request.post(
    '/Contract/DeleteVarietieBasic',
    formdataify({ Token: token(), contract_code: contractCodeGuids })
  );
  if (res.data === 301) throw new Error('登录失效，请重新登录');
  if (res.data === 200 || res.data === '200') return { ok: true };
  if (res.data === 400 || res.data === '400') throw new Error('品种已应用于作业流程，拒绝删除');
  throw new Error('删除失败');
}

export async function enableGrantContractVar(payload) {
  const res = await request.post(
    '/Contract/EnableGrantContractVar',
    formdataify({
      Token: token(),
      SupplyName: payload.supplyName ?? '',
      ContractCode: payload.contractCode ?? '',
      VarietieID: payload.varietieIds ?? '',
      Operator: payload.operator ?? ''
    })
  );
  return unwrap(res);
}

/** 停用前校验，code 400 时旧页仍允许二次确认后停用 */
export async function checkGrantContractVar(contractCode, varietieIds) {
  const res = await request.get('/Contract/CheckGrantContractVar', {
    params: { Token: token(), ContractCode: contractCode, VarietieID: varietieIds }
  });
  if (res.data?.code == 301) throw new Error(res.data?.msg || '登录失效');
  return res.data;
}

export async function disableGrantContractVar(payload) {
  const res = await request.post(
    '/Contract/DisEnableGrantContractVar',
    formdataify({
      Token: token(),
      SupplyName: payload.supplyName ?? '',
      ContractCode: payload.contractCode ?? '',
      VarietieID: payload.detailGuids ?? '',
      Operator: payload.operator ?? ''
    })
  );
  return unwrap(res);
}

/** 修改结算价/采购价 */
export async function updateContractPrice(payload) {
  const res = await request.post(
    '/Contract/Up_price',
    formdataify({
      Token: token(),
      contract_detail_guid: payload.guid,
      supply_price: payload.supplyPrice,
      purchase_price: payload.purchasePrice
    })
  );
  return unwrap(res);
}

/** 修改授权到期/明细起止日期 */
export async function modifyAuthValid(payload) {
  const res = await request.post(
    '/Contract/ModifyAuthValid',
    formdataify({
      Token: token(),
      contractDetailGuid: payload.guidsJson,
      newAuthValid: payload.newAuthValid ?? '',
      addContraValidTbHt: payload.syncContract ?? '0',
      addContraValidTbzcz: payload.syncRegCert ?? '0',
      contract_start_detail: payload.startDetail ?? '',
      contract_end_detail: payload.endDetail ?? '',
      changeAuthValid: payload.changeAuthValid ?? '0',
      changeContractStart: payload.changeContractStart ?? '0',
      changeContractEnd: payload.changeContractEnd ?? '0'
    })
  );
  return unwrap(res);
}

export async function updateContractExtend(guids, origEnd, isExtended) {
  const res = await request.post(
    '/Contract/UpdateContractExtend',
    formdataify({
      Token: token(),
      guids: guids.join(','),
      origEnd,
      isExtended
    })
  );
  return unwrap(res);
}

export async function updateContractAuditMark(guids, auditTjMark) {
  const res = await request.post(
    '/Contract/UpdateContractAuditMark',
    formdataify({
      Token: token(),
      guids: guids.join(','),
      auditTjMark
    })
  );
  return unwrap(res);
}

export async function updateLcNum(guid, lcNum) {
  const res = await request.post(
    '/Contract/UpLcNumCommit',
    formdataify({ Token: token(), contract_detail_guid: guid, LC_NUM: lcNum })
  );
  return unwrap(res);
}

export async function updateContractVarType(ids, varType) {
  const res = await request.post(
    '/Contract/UpdateContractVarType',
    formdataify({ Token: token(), ids: ids.join(','), VAR_TYPE: varType })
  );
  return unwrap(res);
}

export async function copyToOtherContract(payload) {
  const res = await request.post(
    '/Contract/copyToOtherContract',
    formdataify({
      Token: token(),
      OldContractCode: payload.oldCode,
      NewContractCode: payload.newCode,
      jsonIDS: payload.guidsJson,
      SupplyCode: payload.supplyCode
    })
  );
  return unwrap(res);
}

export async function getTwoSupList(params) {
  const res = await request.get('/SupplierInfo/instwosup', {
    params: {
      Token: token(),
      page: params.page || 1,
      size: params.limit || 10,
      supplier_code: params.supplier_code ?? '',
      supplier_name: params.supplier_name ?? ''
    }
  });
  const body = unwrap(res);
  return { total: body.total ?? 0, result: body.result || [] };
}

export async function inTwoSup(json) {
  const res = await request.post('/SupplierInfo/InTwoSup', formdataify({ Token: token(), json }));
  return unwrap(res);
}

/** 品种授权：搜索可授权品种 */
export async function getAuthVarietyList(params) {
  const res = await request.get('/Contract/GetList', {
    params: {
      Token: token(),
      supplier_code: params.supplierCode ?? '',
      contract_code: params.contractCode ?? '',
      varietie_code: params.keyword ?? '',
      varietie_name: params.keyword ?? '',
      manuEntName: params.keyword ?? '',
      page: params.page || 1,
      size: params.size || 999
    }
  });
  return parseLegacyList(res);
}

/** 已授权品种编码列表 */
export async function getContractHaveAuthorized(contractCode) {
  const res = await request.get('/Contract/ContractHaveAuthorized', {
    params: { Token: token(), contract_code: contractCode }
  });
  return parseLegacyArray(res);
}

/** 按编码加载待授权品种明细 */
export async function getContractHaveAuthorizedCoding(varietieCodes) {
  const res = await request.get('/Contract/ContractHaveAuthorizedcoding', {
    params: { Token: token(), varietie_code: varietieCodes, page: 1, size: 999 }
  });
  return parseLegacyList(res);
}

/** 提交品种授权 InsertContract2 */
export async function insertContractAuth(json) {
  const res = await request.post('/Contract/InsertContract2', formdataify({ Token: token(), json }));
  return unwrap(res);
}

export async function uploadHtPic(contractCode, file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('CONTRACT_CODE', String(contractCode ?? ''));
  fd.append('FILE', file);
  const res = await request.post('/AAPDDATE/UploadHtPic', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

export async function getContractFiles(contractCode) {
  const res = await request.get('/Contract/GetContractFiles', {
    params: { Token: token(), contractCode }
  });
  return unwrap(res);
}

export async function deleteContractFile(id) {
  const res = await request.post('/Contract/DeleteContractFile', formdataify({ Token: token(), id }));
  return unwrap(res);
}

/** 查看所有合同列表 */
export async function getContactAllList(data) {
  const where = data.where || {};
  const res = await request.post(
    '/SupplierInfo/GetContactAll',
    formdataify({
      Token: token(),
      page: data.page || 1,
      size: data.limit || 30,
      CONTRACT_END_TIME: where.CONTRACT_END_TIME ?? '',
      CONTRACT_STATE: where.CONTRACT_STATE ?? '1',
      ENABLE: where.ENABLE ?? '1',
      SENDOES_STATE: where.SENDOES_STATE ?? '',
      IsOverTime: where.IsOverTime ?? '',
      IsHasAmount: where.IsHasAmount ?? '',
      CONTRACT_NAME: where.CONTRACT_NAME ?? '',
      CONTRACT_START_TIMETimeStart: where.CONTRACT_START_TIMETimeStart ?? '',
      CONTRACT_START_TIMETimeEnd: where.CONTRACT_START_TIMETimeEnd ?? '',
      CONTRACT_END_TIMETimeStart: where.CONTRACT_END_TIMETimeStart ?? '',
      CONTRACT_END_TIMETimeEnd: where.CONTRACT_END_TIMETimeEnd ?? ''
    })
  );
  return unwrap(res);
}

export async function exportContactAllVar(contractCode) {
  const res = await request.post(
    '/SupplierInfo/ExcalgetContactAllVar',
    formdataify({ Token: token(), CONTRACT_CODE: contractCode })
  );
  return unwrap(res);
}

export async function updateContactLimitPrice(contractCode, limitSumPrice) {
  const res = await request.post(
    '/SupplierInfo/upContPerce',
    formdataify({ Token: token(), CONTRACT_CODE: contractCode, LIMIT_SUM_PRICE: limitSumPrice })
  );
  return unwrap(res);
}

/** 导出所有合同（授权合同信息） */
export async function getAuthContractInfo(data) {
  const where = data.where || {};
  const res = await request.post(
    '/Contract/GetAuthContractInfo',
    formdataify({
      Token: token(),
      page: data.page || 1,
      size: data.limit || 20,
      Contract_Name: where.Contract_Name ?? '',
      Supplier_Name: where.Supplier_Name ?? '',
      HT_DEL_STATE: where.HT_DEL_STATE ?? '1',
      HT_STATE: where.HT_STATE ?? '1',
      HT_DEL_DATE_STATE: where.HT_DEL_DATE_STATE ?? '1',
      HT_DATE_STATE: where.HT_DATE_STATE ?? '1'
    })
  );
  return unwrap(res);
}

export async function getAllAuthContractInfo(where) {
  return getAuthContractInfo({ page: 1, limit: 999999, where });
}

export async function stopConWithNoVar() {
  const res = await request.post('/VarietieBasicInfo/stopConWithNoVar', formdataify({ Token: token() }));
  return unwrap(res);
}

export async function zqContractUpDel(contractCode) {
  const res = await request.post(
    '/Commons/getAndUpZqWyContralDel',
    formdataify({ Token: token(), SPD_CONTRAL_CODE: contractCode })
  );
  return unwrap(res);
}

const IMPORT_URLS = {
  contractMain: '/BtbGetVarietie/ImportContractMain',
  contractDetail: '/BtbGetVarietie/ImportContract',
  contractDetailWithoutAuth: '/BtbGetVarietie/ImportContractWithoutAuth',
  contractExtend: '/Contract/ImportContractExtend',
  contractAuditMark: '/Contract/ImportContractAuditMark',
  twoSupplier: '/PekingApplication/UpdateTwoSupplier'
};

/** Excel 导入（multipart） */
export async function importContractExcel(type, file) {
  const url = IMPORT_URLS[type];
  if (!url) throw new Error('未知导入类型');
  const fd = new FormData();
  fd.append('file', file);
  const res = await request.post(`${url}?Token=${encodeURIComponent(token())}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  if (res.data?.code == 301) throw new Error(res.data?.msg || '登录失效');
  return res.data;
}
