import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import store from '@/store';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function staffName() {
  return store.state.user?.info?.Nickname || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

async function postForm(url, data = {}) {
  const res = await request.post(url, formdataify({ Token: token(), ...data }));
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  return Promise.reject(new Error(res.data?.msg || '请求失败'));
}

async function getJson(url, params = {}) {
  const res = await request.get(url, { params: { Token: token(), ...params } });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  return Promise.reject(new Error(res.data?.msg || '请求失败'));
}

/** 二级科室列表（左侧） */
export async function getDeptTwoNames(dept = '') {
  const res = await request.post('/Hedge/GetDeptTwoNames', formdataify({ Token: token(), dept }));
  check301(res.data);
  if (okCode(res.data?.code)) {
    return { rows: res.data.result || [], total: res.data.total || 0 };
  }
  throw new Error(res.data?.msg || '加载科室失败');
}

/** 对冲成功主表（分页） */
export async function searchDeptTwoDefNoPkgCode(params) {
  const res = await request.post(
    '/Hedge/SearchDeptTwoDefNoPkgCode',
    formdataify({
      Token: token(),
      deptTwoCode: params.deptTwoCode || '',
      deptTwoName: params.deptTwoName || '',
      costDeptName: params.costDeptName || '',
      defNoPkgCode: params.defNoPkgCode || '',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      His_Varietie_Name: params.His_Varietie_Name || '',
      Def_No_Pkg_Code: params.Def_No_Pkg_Code || '',
      Charging_Dept: params.Charging_Dept || '',
      Charging_Code: params.Charging_Code || '',
      Serial_Number: params.Serial_Number || '',
      Patient_Number: params.Patient_Number || '',
      field: params.field || '',
      order: params.order || '',
      page: params.page || 1,
      size: params.size || 10
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) {
    return { rows: res.data.result || [], total: res.data.total || 0 };
  }
  throw new Error(res.data?.msg || '查询失败');
}

/** 定数码扩展信息 */
export async function getDeptTwoDefNoPkgCodeExtend(defNoPkgCode) {
  return getJson('/Hedge/GetDeptTwoDefNoPkgCodeExtend', { defNoPkgCode });
}

/** 对冲失败主表 */
export async function searchHedgeFailureDefNoPkgCode(params) {
  return getJson('/HedgeFailure/SearchHedgeFailureDefNoPkgCode', {
    isDelete: params.isDelete ?? '1',
    defNoPkgCode: params.defNoPkgCode || '',
    hedgeType: params.hedgeType ?? -1,
    isHaveCharingCode: params.isHaveCharingCode ?? '1',
    Def_No_Pkg_Code: params.Def_No_Pkg_Code ?? '',
    field: params.field || '',
    order: params.order || '',
    page: params.page || 1,
    size: params.size || 10
  });
}

export async function deleteHedgeDefNoPkgCode(jsonRows) {
  const res = await request.post(
    '/HedgeFailure/DeleteHedgeDefNoPkgCode',
    formdataify({ Token: token(), json: JSON.stringify(jsonRows), staff: staffName() })
  );
  return res.data === true;
}

export async function hfDeleteHedgeDefNoPkgCode(jsonRows) {
  const res = await request.post(
    '/HedgeFailure/hfDeleteHedgeDefNoPkgCode',
    formdataify({ Token: token(), json: JSON.stringify(jsonRows), staff: staffName() })
  );
  return res.data === true;
}

export async function upHedgeStateRestart(ids) {
  return postForm('/HedgeFailure/upHedgeStateRestart', { ids, staff: staffName() });
}

export async function confirmRefuse(ids) {
  return postForm('/HedgeFailure/ConfirmRefuse', {
    array: JSON.stringify(ids),
    count: 1,
    staff: staffName()
  });
}

export async function modifyBeiDaChargingCode(beiDaId, newChargingCode) {
  return postForm('/HedgeFailure/ModifyBeiDaChargingCode', { beiDaId, newChargingCode });
}

export async function getDeptId(defNoPkgCode) {
  return postForm('/DeptManual/GetDeptId', { DEF_NO_PKG_CODE: defNoPkgCode, staff: staffName() });
}

export async function loadReplaceDefNoPkgCodes(params) {
  return getJson('/HedgeFailure/LoadReplaceDefNoPkgCodes', {
    defNoPkgCode: params.defNoPkgCode,
    Charging_Code: params.Charging_Code || '',
    searchDefNoPkgCode: params.searchDefNoPkgCode || '',
    page: params.page || 1,
    size: params.size || 10000
  });
}

export async function replaceDefToPkg(beiDaId, oldDefNoPkg, newDefNoPkg) {
  return postForm('/HedgeFailure/ReplaceDefToPkg', {
    beiDaId,
    oldDefNoPkg,
    newDefNoPkg,
    staff: staffName()
  });
}

export async function searchRepaireDefNoPkgCodeArg(chargingCode, condition, page, size) {
  return getJson('/HedgeFailure/SearchRepaireDefNoPkgCodeArg', {
    chargingCode,
    condition: condition || '',
    page: page || 1,
    size: size || 10000
  });
}

export async function repairDefToBackPkg(beiDaId, defCodes) {
  return postForm('/HedgeFailure/RepairDefToBackPkg', {
    beiDaId,
    array: JSON.stringify(defCodes),
    staff: staffName()
  });
}
