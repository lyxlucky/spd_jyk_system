import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

/** 后端部分接口直接返回 JSON 字符串 */
export function parseBody(data) {
  if (data == null) return null;
  if (typeof data === 'string') {
    if (data === '301') {
      throw new Error('登录失效，请重新登录');
    }
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

/** 一级科室列表（模糊名称） */
export async function searchDeptOne(deptOneName) {
  const res = await request.get('/DeptOneBasicInfo/SearchDeptOne', {
    params: { deptOneName: deptOneName ?? '', Token: getToken() }
  });
  const d = res.data;
  if (d && okCode(d.code)) {
    return d.result || [];
  }
  throw new Error(d?.msg || '查询一级科室失败');
}

/** 一级科室详情 */
export async function getDeptOne(deptOneCode) {
  const res = await request.get('/DeptOneBasicInfo/Get', {
    params: { deptOneCode, Token: getToken() }
  });
  if (res.data === '301' || res.data === 301) {
    throw new Error('登录失效，请重新登录');
  }
  const list = parseBody(res.data);
  if (!Array.isArray(list) || !list[0]) {
    throw new Error('获取一级科室详情失败');
  }
  return list[0];
}

export async function insertDeptOne(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptOneName: payload.deptOneName ?? '',
    deptOneAddress: payload.deptOneAddress || '无',
    HerpDeptOneCode: payload.HerpDeptOneCode ?? '',
    herpId: payload.herpId ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/Insert', fd);
  if (res.data && okCode(res.data.code)) return res.data;
  throw new Error(res.data?.msg || '添加失败');
}

export async function updateDeptOne(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptOneCode: payload.deptOneCode ?? '',
    deptOneName: payload.deptOneName ?? '',
    deptAddress: payload.deptAddress ?? '',
    herpDeptOneCode: payload.herpDeptOneCode ?? '',
    herpId: payload.herpId ?? ''
  });
  const res = await request.post('/DeptOneBasicInfo/Update', fd);
  if (res.data && okCode(res.data.code)) return res.data;
  throw new Error(res.data?.msg || '更新失败');
}

/** 返回是否成功（后端返回 True/False 字符串） */
export async function enableDeptOne(deptOneCode, enable) {
  const res = await request.get('/DeptOneBasicInfo/Enable', {
    params: { deptOneCode, enable, Token: getToken() }
  });
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

export async function deleteDeptOne(deptOneCode) {
  const fd = formdataify({ Token: getToken(), deptOneCode });
  const res = await request.post('/DeptOneBasicInfo/Delete', fd);
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

/** 二级科室列表 */
export async function searchDeptTwo(deptOneCode, deptTwoName) {
  const res = await request.get('/DeptTwoBasicInfo/SearchDeptTwo', {
    params: {
      deptOneCode: deptOneCode ?? '',
      deptTwoName: deptTwoName ?? '',
      Token: getToken()
    }
  });
  const d = res.data;
  if (d && okCode(d.code)) {
    return d.result || [];
  }
  throw new Error(d?.msg || '查询二级科室失败');
}

export async function getDeptTwoDetail(deptTwoCode) {
  const res = await request.get('/DeptTwoBasicInfo/GetByDeptTwoCode', {
    params: { deptTwoCode, Token: getToken() }
  });
  if (res.data === '301' || res.data === 301) {
    throw new Error('登录失效，请重新登录');
  }
  const list = parseBody(res.data);
  if (!Array.isArray(list) || !list[0]) {
    throw new Error('获取二级科室详情失败');
  }
  return list[0];
}

export async function getWareBaseList() {
  const fd = formdataify({ Token: getToken() });
  const res = await request.post('/DeptTwoBasicInfo/getWareBase', fd);
  const d = res.data;
  if (d && okCode(d.code)) {
    return d.data || [];
  }
  throw new Error(d?.msg || '获取院区失败');
}

export async function insertDeptTwo(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptTwoName: payload.deptTwoName ?? '',
    deptOneCode: payload.deptOneCode ?? '',
    herpId: payload.herpId ?? '',
    herpDeptTwoCode: payload.herpDeptTwoCode ?? '',
    receiveB2bPreEnable: String(payload.receiveB2bPreEnable ?? '0'),
    receivePlace: String(payload.receivePlace ?? '0'),
    balanceType: String(payload.balanceType ?? '0'),
    IS_MAKE_PLAN: String(payload.IS_MAKE_PLAN ?? '0'),
    VALIDITY_PERIOD: String(payload.VALIDITY_PERIOD ?? '0'),
    wareBaseId: String(payload.wareBaseId ?? ''),
    DEPT_TYPE: String(payload.DEPT_TYPE ?? '0'),
    AUTH_GET_HOUR: String(payload.AUTH_GET_HOUR ?? '0')
  });
  const res = await request.post('/DeptTwoBasicInfo/Insert', fd);
  if (res.data && okCode(res.data.code)) return res.data;
  throw new Error(res.data?.msg || '添加二级科室失败');
}

export async function updateDeptTwo(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptTwoCode: payload.deptTwoCode ?? '',
    deptTwoName: payload.deptTwoName ?? '',
    herpId: payload.herpId ?? '',
    herpDeptTwoCode: payload.herpDeptTwoCode ?? '',
    receiveB2bPreEnable: String(payload.receiveB2bPreEnable ?? '0'),
    receivePlace: String(payload.receivePlace ?? '0'),
    balanceType: String(payload.balanceType ?? '0'),
    IS_MAKE_PLAN: String(payload.IS_MAKE_PLAN ?? '0'),
    VALIDITY_PERIOD: String(payload.VALIDITY_PERIOD ?? '0'),
    wareBaseId: String(payload.wareBaseId ?? ''),
    DEPT_TYPE: String(payload.DEPT_TYPE ?? '0'),
    AUTH_GET_HOUR: String(payload.AUTH_GET_HOUR ?? '0'),
    LIMIT_REGION_USE: String(payload.LIMIT_REGION_USE ?? '0')
  });
  const res = await request.post('/DeptTwoBasicInfo/Update', fd);
  if (res.data && okCode(res.data.code)) return res.data;
  throw new Error(res.data?.msg || '更新二级科室失败');
}

export async function enableDeptTwo(deptTwoCode, enable) {
  const res = await request.get('/DeptTwoBasicInfo/Enable', {
    params: { deptTwoCode, enable, Token: getToken() }
  });
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

export async function enableThreeInventory(deptTwoCode, enable) {
  const res = await request.get('/DeptTwoBasicInfo/EnableThreeInventory', {
    params: { deptTwoCode, enable, Token: getToken() }
  });
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

export async function deleteDeptTwo(deptTwoCode) {
  const fd = formdataify({ Token: getToken(), deptTwoCode });
  const res = await request.post('/DeptTwoBasicInfo/Delete', fd);
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

/** 导出全部一二级科室 Excel，返回文件名（在站点 /Excel/files/ 下） */
export async function excelDeptOne() {
  const fd = formdataify({ Token: getToken() });
  const res = await request.post('/DeptOneBasicInfo/ExcelDeptOne', fd);
  const d = res.data;
  if (d && okCode(d.code)) {
    return d.msg;
  }
  throw new Error(d?.msg || '导出失败');
}

/** 解析返回 result 为 JSON 字符串的接口 */
export function parseStringApi(data) {
  const body = parseBody(data);
  if (body && typeof body.result === 'string') {
    return { ...body, result: JSON.parse(body.result), total: body.count ?? body.total };
  }
  return body;
}

// —— 一级科室散货授权 ——
export async function searchDeptOneAuthedVar(params) {
  const res = await request.get('/DeptOneBulkCargoAuthVar/SerachDeptOneAuthedVar', {
    params: {
      deptOneCode: params.deptOneCode ?? '',
      varietieCondition: params.varietieCondition ?? '',
      page: params.page ?? 1,
      size: params.size ?? 15,
      field: params.field ?? '',
      order: params.order ?? '',
      enbale: params.enbale ?? '',
      Token: getToken()
    }
  });
  const d = res.data;
  if (d && okCode(d.code)) {
    return { rows: d.result || [], total: d.total || 0 };
  }
  throw new Error(d?.msg || '查询散货授权失败');
}

export async function insertDeptOneBulkAuth(jsonList) {
  const fd = formdataify({ Token: getToken(), json: JSON.stringify(jsonList) });
  const res = await request.post('/DeptOneBulkCargoAuthVar/Insert', fd);
  const t = String(res.data);
  if (t === '301') throw new Error('登录失效，请重新登录');
  return t === 'True' || t === 'true';
}

export async function modifyDeptOneAuthedVar(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptOneCode: payload.deptOneCode,
    varietieCode: payload.varietieCode,
    limit: String(payload.limit),
    validDatetime: payload.validDatetime,
    autoApplyRadix: String(payload.autoApplyRadix ?? '0'),
    IS_NEED_TWO_APP: String(payload.IS_NEED_TWO_APP ?? '0')
  });
  const res = await request.post('/DeptOneBulkCargoAuthVar/ModifyDeptOneAuthedVAr', fd);
  return res.data === true || res.data === 'True';
}

export async function enableDeptOneAuthVar(deptOneCode, varietieCode) {
  const fd = formdataify({ Token: getToken(), deptOneCode, varietieCode, contractCode: '' });
  const res = await request.post('/DeptOneBulkCargoAuthVar/EnableDeptOneAuthVar', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function disableDeptOneAuthVar(deptOneCode, varietieCode) {
  const fd = formdataify({ Token: getToken(), deptOneCode, varietieCode, contractCode: '' });
  const res = await request.post('/DeptOneBulkCargoAuthVar/DisableDeptOneAuthVar', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function disableDeptOneAuthVars(deptOneCode, varietieCodes) {
  const fd = formdataify({
    Token: getToken(),
    deptOneCode,
    varietieCodes: JSON.stringify(varietieCodes)
  });
  const res = await request.post('/DeptOneBulkCargoAuthVar/DisableDeptOneAuthVars', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function upDeptOneAuthVars(deptOneCode, varietieCodes, type) {
  const fd = formdataify({
    Token: getToken(),
    deptOneCode,
    varietieCodes: JSON.stringify(varietieCodes),
    type: String(type)
  });
  const res = await request.post('/DeptOneBulkCargoAuthVar/upDeptOneAuthVars', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function deptOneAuthAll(deptOneCode) {
  const fd = formdataify({ Token: getToken(), deptone: deptOneCode });
  const res = await request.post('/AAPDDATE/DeptOneAuthAll', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '一键授权失败');
}

export async function exportDeptOneAuthedVars(payload) {
  const fd = formdataify({
    Token: getToken(),
    deptOneCode: payload.deptOneCode ?? '',
    field: payload.field ?? '',
    order: payload.order ?? '',
    varietieCondition: payload.varietieCondition ?? '',
    enbale: payload.enbale ?? ''
  });
  const res = await request.post('/DeptOneBulkCargoAuthVar/ExportDeptOneAuthedVars', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  if (okCode(res.data?.code)) return res.data.msg;
  throw new Error(res.data?.msg || '导出失败');
}

export async function upTwoAudit(deptOneCode, varietieCodes, tag) {
  const { Encrypt } = await import('@/utils/aes-util');
  const prams = {
    ID: varietieCodes.join(','),
    Dept_One_Code: deptOneCode,
    Token: getToken(),
    tag: String(tag)
  };
  const fd = formdataify({
    prams: Encrypt(JSON.stringify(prams)),
    AesKey: sessionStorage.getItem('AesKey') || ''
  });
  const res = await request.post('/DeptOneBulkCargoAuthVar/upTwoAudit', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function searchVarietiePageList(varieite, startIndex, endIndex) {
  const res = await request.get('/DeptOneBulkCargoAuthVar/SerachVarietiePageList', {
    params: { varieite, startIndex, endIndex, Token: getToken() }
  });
  if (res.data === '301') throw new Error('登录失效，请重新登录');
  const body = parseBody(res.data);
  const rows = body?.result ? JSON.parse(body.result) : [];
  return { rows, total: body?.count || 0, msg: body?.msg };
}

export async function searchDeptOneBulkForPkg(deptOneCode, varietie, startIndex, endIndex) {
  const res = await request.get('/DeptOneBulkCargoAuthVar/SearchDeptOneBulkCargoAuthVarInfoListPage', {
    params: { deptOneCode, varietie, startIndex, endIndex, Token: getToken() }
  });
  if (res.data === '301') throw new Error('登录失效，请重新登录');
  const body = parseBody(res.data);
  const rows = body?.result ? JSON.parse(body.result) : [];
  return { rows, total: body?.count || 0 };
}

export async function getDeptTwoSelectedAuthVarExtra(inConditions, startIndex, endIndex) {
  const res = await request.get('/DeptTwoDefNoPkgAuthVar/GetDeptTwoSelectedAuthVarExtra', {
    params: { inConditions, startIndex, endIndex, Token: getToken() }
  });
  if (res.data === '301') throw new Error('登录失效，请重新登录');
  const body = parseBody(res.data);
  const rows = body?.result ? JSON.parse(body.result) : [];
  return { rows, total: body?.count || 0 };
}

// —— 二级科室定数包授权 ——
export async function searchDeptTwoAuthedVar(params) {
  const res = await request.get('/DeptTwoDefNoPkgAuthVar/SearchDeptTwoAuthedVar', {
    params: {
      deptTwoCode: params.deptTwoCode ?? '',
      varietieCondition: params.varietieCondition ?? '',
      page: params.page ?? 1,
      size: params.size ?? 15,
      field: params.field ?? '',
      order: params.order ?? '',
      Token: getToken()
    }
  });
  const d = res.data;
  if (d && okCode(d.code)) {
    return { rows: d.result || [], total: d.total || 0 };
  }
  throw new Error(d?.msg || '查询定数包授权失败');
}

export async function insertDeptTwoPkgAuth(jsonList) {
  const fd = formdataify({ Token: getToken(), json: JSON.stringify(jsonList) });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/Insert', fd);
  return res.data === true || res.data === 'True' || res.data === 'true';
}

/** 二级定数包授权单条详情（与旧页 GetDeptTwoDefNoPkgAuthVarDetail 一致，用于编辑弹窗拉取后填充） */
export async function getDeptTwoDefNoPkgAuthVarDetail(deptTwoCode, varietieCode) {
  const res = await request.get('/DeptTwoDefNoPkgAuthVar/GetDeptTwoDefNoPkgAuthVarDetail', {
    params: { deptTwoCode: deptTwoCode ?? '', varietieCode: varietieCode ?? '', Token: getToken() }
  });
  if (res.data === '301' || res.data === 301) {
    throw new Error('登录失效，请重新登录');
  }
  const list = parseBody(res.data);
  if (!Array.isArray(list) || !list[0]) {
    throw new Error('获取定数包授权详情失败');
  }
  return list[0];
}

export async function modifyDeptAuthedVar(payload) {
  const fd = formdataify({
    Token: getToken(),
    PkgAuthVarCode: payload.PkgAuthVarCode,
    validDatetime: payload.validDatetime,
    upper: String(payload.upper),
    lower: String(payload.lower),
    consumptionType: String(payload.consumptionType),
    rfid: String(payload.rfid),
    varReceivePlace: String(payload.varReceivePlace),
    costDeptState: String(payload.costDeptState),
    hisNeedTempRecord: String(payload.hisNeedTempRecord),
    IS_AUTH_SEND: String(payload.IS_AUTH_SEND),
    IS_HIS_CAN_NULL: String(payload.IS_HIS_CAN_NULL),
    HIS_CAN_NULL_STATR_TIME: payload.HIS_CAN_NULL_STATR_TIME ?? '',
    DEFUL_REGION_CODE: String(payload.DEFUL_REGION_CODE ?? '2')
  });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/ModifyDeptAuthedVar', fd);
  return res.data === true || res.data === 'True';
}

export async function enableAuthedVar(pkgAuthVarCode) {
  const fd = formdataify({ Token: getToken(), pkgAuthVarCode });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/EnableAuthedVar', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function disableAuthedVar(pkgAuthVarCode) {
  const fd = formdataify({ Token: getToken(), pkgAuthVarCode });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/DisableAuthedVar', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function disableAuthedVars(authVarCodes) {
  const fd = formdataify({ Token: getToken(), authVarCodes: JSON.stringify(authVarCodes) });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/DisableAuthedVars', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function deleteDeptAuthVar(pkgAuthVarCodes) {
  const list = pkgAuthVarCodes.map((Pkg_Auth_Var_Code) => ({ Pkg_Auth_Var_Code }));
  const fd = formdataify({ Token: getToken(), JSON: JSON.stringify(list) });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/DeleteDeptAuthVar', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  return res.data;
}

export async function exportDeptTwoAuthVars(deptTwoCode) {
  const fd = formdataify({
    Token: getToken(),
    deptTwoCode: deptTwoCode ?? '',
    page: '1',
    size: '9999999'
  });
  const res = await request.post('/DeptTwoDefNoPkgAuthVar/ExportDeptTwoAuthVars', fd);
  if (res.data?.code === 301) throw new Error(res.data.msg);
  if (okCode(res.data?.code)) return res.data.msg;
  throw new Error(res.data?.msg || '导出失败');
}

// —— HIS 计费科室 ——
export async function loadDeptOneChargingDepts(deptOneCode) {
  const res = await request.get('/HisChargingDept/LoadDeptOneChargingDepts', {
    params: { deptOneCode, Token: getToken() }
  });
  const d = res.data;
  if (d && okCode(d.code)) return d.result || [];
  throw new Error(d?.msg || '查询计费科室失败');
}

export async function loadChargingDepts() {
  const res = await request.get('/HisChargingDept/LoadChargingDepts', {
    params: { Token: getToken() }
  });
  const d = res.data;
  if (d && okCode(d.code)) return d.result || [];
  throw new Error(d?.msg || '获取计费科室列表失败');
}

export async function bindChargingDept(chargingDeptId, deptOneCode, deptOneName) {
  const res = await request.get('/HisChargingDept/BindChargingDept', {
    params: { Token: getToken(), chargingDeptId, deptOneCode, deptOneName }
  });
  const d = res.data;
  if (d?.code === 301) throw new Error(d.msg);
  if (okCode(d?.code)) return d;
  throw new Error(d?.msg || '关联失败');
}

export async function deleteChargingDept(chargingDeptId) {
  const res = await request.get('/HisChargingDept/DeleteChargingDept', {
    params: { Token: getToken(), chargingDeptId }
  });
  const d = res.data;
  if (d?.code === 301) throw new Error(d.msg);
  if (okCode(d?.code)) return d;
  throw new Error(d?.msg || '删除失败');
}

// —— 财务属性 / 采购来源 ——
export async function upDepartCW(payload) {
  const fd = formdataify({
    Token: getToken(),
    Dept_Two_Code: payload.Dept_Two_Code,
    CW_CLASS_ONE: payload.CW_CLASS_ONE ?? '',
    CW_CLASS_TWO: payload.CW_CLASS_TWO ?? '',
    CW_CLASS_THREE: payload.CW_CLASS_THREE ?? ''
  });
  const res = await request.post('/DeptTwoBasicInfo/UpDepartCW', fd);
  const d = res.data;
  if (d?.code === 301) throw new Error(d.msg);
  if (okCode(d?.code)) return d;
  throw new Error(d?.msg || '保存失败');
}

export async function getPurchaseDeptSource(deptTwoCode) {
  const fd = formdataify({ Token: getToken(), deptTwoCode });
  const res = await request.post('/PurchaseOrderApply/GetPurchaseDeptSource', fd);
  const d = res.data;
  if (d?.code === 301) throw new Error(d.msg);
  if (okCode(d?.code)) return d.result;
  throw new Error(d?.msg || '获取采购来源失败');
}

export async function setPurchaseDeptSource(deptTwoCode, inDeptFrom) {
  const fd = formdataify({ Token: getToken(), deptTwoCode, inDeptFrom: String(inDeptFrom) });
  const res = await request.post('/PurchaseOrderApply/SetPurchaseDeptSource', fd);
  const d = res.data;
  if (d?.code === 301) throw new Error(d.msg);
  if (okCode(d?.code)) return d;
  throw new Error(d?.msg || '设置失败');
}
