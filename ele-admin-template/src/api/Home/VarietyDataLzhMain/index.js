import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function QueryPageLayUI(data) {

    console.log(data)

    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.varietieCode = data.where.varietieCode ? data.where.varietieCode : '';
    data2.enable = data.where.enable ? data.where.enable : '1';
    data2.varietieName = data.where.varietieName ? data.where.varietieName : '';
    // data2.enable = data.where.enable ? data.where.enable : '';
    data2.state = data.where.state ? data.where.state : '';

    data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : '-1';
    data2.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS ? data.where.HIGH_OR_LOW_CLASS : '-1';
    data2.IS_BIDDING = data.where.IS_BIDDING ? data.where.IS_BIDDING : '-1';
    data2.SPECIAL_PURCHASE = data.where.SPECIAL_PURCHASE ? data.where.SPECIAL_PURCHASE : '-1';
    data2.ONEOFF_STERILIZATION_PACKAGING = data.where.ONEOFF_STERILIZATION_PACKAGING ? data.where.ONEOFF_STERILIZATION_PACKAGING : '-1';
    data2.STORAGE_TYPE = data.where.STORAGE_TYPE ? data.where.STORAGE_TYPE : '-1';
    data2.IS_EMBEDDED = data.where.IS_EMBEDDED ? data.where.IS_EMBEDDED : '-1';
    data2.IS_SERIAL_NUMBER = data.where.IS_SERIAL_NUMBER ? data.where.IS_SERIAL_NUMBER : '-1';
    data2.IS_INTERVENED = data.where.IS_INTERVENED ? data.where.IS_INTERVENED : '-1';
    data2.IS_PROTECT = data.where.IS_PROTECT ? data.where.IS_PROTECT : '-1';
    data2.HIGH_OR_LOW_CLASS_TWO = data.where.HIGH_OR_LOW_CLASS_TWO ? data.where.HIGH_OR_LOW_CLASS_TWO : '-1';
    data2.IS_EQUIPMENT_CHANGE = data.where.IS_EQUIPMENT_CHANGE ? data.where.IS_EQUIPMENT_CHANGE : '-1';
    data2.PRICE_CHANGE_TIME = data.where.PRICE_CHANGE_TIME ? data.where.PRICE_CHANGE_TIME : '';
    data2.priceChangeTimeStart = data.where.priceChangeTimeStart ? data.where.priceChangeTimeStart : '';
    data2.priceChangeTimeEnd = data.where.priceChangeTimeEnd ? data.where.priceChangeTimeEnd : '';
    data2.updateTime = data.where.updateTime ? data.where.updateTime : '';
    data2.APPROVAL_STATE = data.where.APPROVAL_STATE ? data.where.APPROVAL_STATE : '';
    data2.HIGH_CLASS_XH = data.where.HIGH_CLASS_XH ? data.where.HIGH_CLASS_XH : '';
    data2.SENDYB_STATE = data.where.SENDYB_STATE ? data.where.SENDYB_STATE : '';
    data2.SCQY = data.where.SCQY ? data.where.SCQY : '';
    data2.ZCZ = data.where.ZCZ ? data.where.ZCZ : '';
    data2.SUP = data.where.SUP ? data.where.SUP : '';
    data2.vdzh_sx = data.where.vdzh_sx ? data.where.vdzh_sx : '';
    data2.VARSB_STATE = data.where.VARSB_STATE ? data.where.VARSB_STATE : '';
    data2.VARYB_STATE = data.where.VARYB_STATE ? data.where.VARYB_STATE : '';
    data2.VARJF_STATE = data.where.VARJF_STATE ? data.where.VARJF_STATE : '';
    data2.VARSPD_STATE = data.where.VARSPD_STATE ? data.where.VARSPD_STATE : '';
    data2.Specification_Or_Type = data.where.Specification_Or_Type ? data.where.Specification_Or_Type : '';
    data2.VARBZ_STATE = data.where.VARBZ_STATE ? data.where.VARBZ_STATE : '';
    data2.VAROES_STATE = data.where.VAROES_STATE ? data.where.VAROES_STATE : '';
    data2.FSWY_STATE = data.where.FSWY_STATE ? data.where.FSWY_STATE : '';
    data2.enableChargingCode = data.where.enableChargingCode ? data.where.enableChargingCode : '';
    data2.YG_CODE = data.where.YG_CODE ? data.where.YG_CODE : '';
    data2.MEDICAL_CODE = data.where.MEDICAL_CODE ? data.where.MEDICAL_CODE : '';
    data2.PROVINCE_PLATFORM_CODE = data.where.PROVINCE_PLATFORM_CODE ? data.where.PROVINCE_PLATFORM_CODE : '';
    data2.UDI_TOP = data.where.UDI_TOP ? data.where.UDI_TOP : '';
    data2.BZ_TI = data.where.BZ_TI ? data.where.BZ_TI : '';
    data2.JF_BJ = data.where.JF_BJ ? data.where.JF_BJ : '';
    data2.IS_HANG_UP = data.where.IS_HANG_UP ? data.where.IS_HANG_UP : '';
    // 对齐老系统 buildVarietyQueryPrams 缺失的参数
    data2.Y_M_P_CODE = data.where.Y_M_P_CODE ? data.where.Y_M_P_CODE : '';
    data2.STSEHIS_STATE = data.where.STSEHIS_STATE ? data.where.STSEHIS_STATE : '';
    data2.HOSPITAL_SYNC = data.where.HOSPITAL_SYNC ? data.where.HOSPITAL_SYNC : '';
    data2.CLASS_ONE = data.where.CLASS_ONE ? data.where.CLASS_ONE : '';
    data2.CLASS_TWO = data.where.CLASS_TWO ? data.where.CLASS_TWO : '';
    data2.CLASS_THREE = data.where.CLASS_THREE ? data.where.CLASS_THREE : '';
    data2.CLASSIFIC_PROPERTIES3 = data.where.CLASSIFIC_PROPERTIES3 ? data.where.CLASSIFIC_PROPERTIES3 : '';
    data2.VAR_CREATETIMESTART = data.where.VAR_CREATETIMESTART ? data.where.VAR_CREATETIMESTART : '';
    data2.VAR_CREATETIMEEND = data.where.VAR_CREATETIMEEND ? data.where.VAR_CREATETIMEEND : '';

    // data2.page = data.page ? data.page : 1;
    // data2.size = data.limit ? data.limit : 30;
    data2.field = (typeof data.field === 'string') ? data.field : '';
    // 对齐老系统：order 必须为字符串（"asc"/"desc"），而不是对象
    data2.order = (typeof data.order === 'string') ? data.order : '';


    var pramsStr = Encrypt(JSON.stringify(data2))

    var inArray = {
        prams: pramsStr,
        AesKey: store.state.user.encrypted.KEY,
        page: data.page ? data.page : 1,
        size: data.limit ? data.limit : 30,
    }
    var data3 = formdataify(inArray);

    const res = await request.post('/VarietieBasicInfo/QueryPageLayUI', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// ========== 定数包品种维护 ==========

// 加载定数包品种列表
export async function GetDefinitePkgList(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const params = {
        Token,
        VARIETIE_CODE: data.VARIETIE_CODE || '',
        VARIETIE_NAME: data.VARIETIE_NAME || '',
        wheres: data.wheres || 1,
        page: data.page || 1,
        size: data.size || 30
    };
    const res = await request.get('/VarietieBasicInfo/GetDefinitePkgListpackage', { params });
    if (res.data.code == 200 || res.data.code === '200') {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 加载定数包系数方案详情
export async function GetDefinitePkgDetail(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/GetDefinitePkgALL', {
        params: { Token, varietieCode: data.varietieCode }
    });
    if (res.data.code == 200 || res.data.code === '200') {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 添加定数包系数
export async function InsertDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/InsertDefinite', formdataify({
        Token,
        DeCodeGuid: data.coefficient,
        varietieCode: data.varietieCode
    }));
    return res.data;
}

// 修改定数包系数
export async function UpdateDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/UpdateDefinite', formdataify({
        Token,
        DeCodeGuid: data.pkgCode,
        DePkgConefficient: data.coefficient,
        Enable: data.enable
    }));
    return res.data;
}

// 删除定数包系数
export async function DeleteDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/DeleteDefinite', formdataify({
        Token,
        PkgCode: data.pkgCode
    }));
    return res.data;
}

// 检查是否可以删除定数包
export async function CheckVarietieBasic(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/CheckVarietieBasic', {
        params: { Token, VarietieCode: data.varietieCode, nickname: data.nickname || '' }
    });
    return res.data;
}

// 检查定数包系数是否重复
export async function IsCoefficientSame(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/Contract/Iscoefficientsame', {
        params: {
            Token,
            varietie_code: data.varietieCode,
            def_no_pkg_coefficient: data.coefficient
        }
    });
    return res.data;
}

// 获取品种详情信息（用于新建定数包时展示品种基本信息）
export async function GetVarietyDetailsInfo(varietieCode) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/GetDetailsInfo', {
        params: { Token, VarietieCode: varietieCode }
    });
    return res.data;
}

// 导入定数包系数
export async function ImportDefinitePackages(formData) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post(`/VarietieBasicInfo/ImportDefinitePackages?Token=${encodeURIComponent(Token)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
    });
    return res.data;
}

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  if (typeof res.data === 'string' || typeof res.data === 'boolean' || typeof res.data === 'number') {
    return res.data;
  }
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

/** 删除散货品种（post varietieCode 带引号逗号串，对齐老系统） */
export async function DeleteVarietieBasic(codesQuotedCsv) {
  const res = await request.post(
    '/VarietieBasicInfo/DeleteVarietieBasic',
    formdataify({ varietieCode: codesQuotedCsv })
  );
  return res.data;
}

/** 启用/冻结 state:1启用 0冻结 */
export async function upVarEnState(rows, state) {
  const payload = (rows || []).map((r) => ({
    Varietie_Code: r.Varietie_Code,
    ID: r.ID
  }));
  const res = await request.post(
    '/VarietieBasicInfo/upVarEnState',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      state: String(state)
    })
  );
  return unwrap(res);
}

/** 临时备注 tag:1确定 2快速备注 */
export async function varUpdateTempInfo(idsCsv, tempInfo, tag = 1) {
  const res = await request.post(
    '/VarietieBasicInfo/var_update_TEMP_INFO',
    formdataify({
      Token: token(),
      TEMP_INFO: tempInfo ?? '',
      ID: idsCsv,
      tag: String(tag)
    })
  );
  return unwrap(res);
}

/** 批量备注 tag: append 勾选 1/0 */
export async function varUpdateLargeBz(idsCsv, tempInfo, tag = '0') {
  const res = await request.post(
    '/VarietieBasicInfo/var_update_Large_BZ',
    formdataify({
      Token: token(),
      TEMP_INFO: tempInfo ?? '',
      ID: idsCsv,
      tag: String(tag)
    })
  );
  return unwrap(res);
}

/** 禁止/开启科室申请 state:1禁止 0开启 */
export async function UpstopDeptSl(rows, state) {
  const payload = (rows || []).map((r) => ({
    Varietie_Code: r.Varietie_Code,
    ID: r.ID
  }));
  const res = await request.post(
    '/VarietieBasicInfo/UpstopDeptSl',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      state: String(state)
    })
  );
  return unwrap(res);
}

/** 普通导出（非 EpPlus） */
export async function createStorageExcelCwj(where = {}, useB = false) {
  const path = useB
    ? '/VarietieBasicInfo/CreateStorageExcelCwj_B'
    : '/VarietieBasicInfo/CreateStorageExcelCwj';
  const data2 = {
    Token: token(),
    varietieCode: where.varietieCode || '',
    enable: where.enable ?? '1',
    varietieName: where.varietieName || where.varietieCode || '',
    state: where.state || '0',
    HIGH_OR_LOW_CLASS: where.HIGH_OR_LOW_CLASS ?? '-1',
    HIGH_OR_LOW_CLASS_TWO: where.HIGH_OR_LOW_CLASS_TWO ?? '-1',
    IS_EQUIPMENT_CHANGE: where.IS_EQUIPMENT_CHANGE ?? '-1',
    APPROVAL_STATE: where.APPROVAL_STATE ?? '',
    vdzh_sx: where.vdzh_sx ?? '0',
    SCQY: where.SCQY || '',
    ZCZ: where.ZCZ || '',
    SUP: where.SUP || '',
    Specification_Or_Type: where.Specification_Or_Type || '',
    Y_M_P_CODE: where.Y_M_P_CODE || '',
    UDI_TOP: where.UDI_TOP || '',
    BZ_TI: where.BZ_TI || '',
    JF_BJ: where.JF_BJ || '',
    IS_HANG_UP: where.IS_HANG_UP ?? '',
    enableChargingCode: where.enableChargingCode || '',
    updateTime: where.updateTime || '',
    priceChangeTimeStart: where.priceChangeTimeStart || '',
    priceChangeTimeEnd: where.priceChangeTimeEnd || '',
    HIGH_CLASS_XH: where.HIGH_CLASS_XH || '',
    SENDYB_STATE: where.SENDYB_STATE || ''
  };
  const res = await request.post(path, formdataify(data2), { timeout: 600000 });
  return unwrap(res);
}

/** 停用已停用品种的合同 */
export async function stopConWithStopVar() {
  const res = await request.post(
    '/VarietieBasicInfo/stopConWithStopVar',
    formdataify({ Token: token() })
  );
  return unwrap(res);
}

/** 改价（启用合同结算价/采购价同步） */
export async function UpdateVarPrice(id, price) {
  const res = await request.post(
    '/VarietieBasicInfo/UpdateVarPrice',
    formdataify({
      Token: token(),
      ID: String(id ?? ''),
      Price: String(price ?? '')
    })
  );
  return unwrap(res);
}

/** 可授权科室（未授权） */
export async function getVarAccredDeptNotIn({ varietieCode, deptName = '', page = 1, size = 9999 } = {}) {
  const res = await request.post(
    '/VarietieBasicInfo/getVarAccredDeptNotIn',
    formdataify({
      Token: token(),
      DEPT_TWO_NAME: deptName || '',
      VARIETIE_CODE: varietieCode || '',
      tag: 1,
      page,
      size
    })
  );
  return unwrap(res);
}

/** 已授权科室 */
export async function GetdeptVarAccredit({ varietieCode, deptName = '', page = 1, size = 9999 } = {}) {
  const res = await request.post(
    '/VarietieBasicInfo/GetdeptVarAccredit',
    formdataify({
      Token: token(),
      DEPT_TWO_NAME: deptName || '',
      VARIETIE_CODE: varietieCode || '',
      page,
      size
    })
  );
  return unwrap(res);
}

/** 授权/取消授权科室 type:1授权 0取消 */
export async function AddDeptVarAccredit(list, type) {
  const res = await request.post(
    '/VarietieBasicInfo/AddDeptVarAccredit',
    formdataify({
      Token: token(),
      json: JSON.stringify(list || []),
      type: String(type)
    })
  );
  return unwrap(res);
}

/** 品种带量采购 */
export async function AddVarLimitBuy(fields) {
  const res = await request.post(
    '/VarietieBasicInfo/AddVar_LIMIT_BUY',
    formdataify({
      Token: token(),
      ...fields
    })
  );
  return unwrap(res);
}

/** 定数备货规则列表 */
export async function BhRuleList() {
  const res = await request.post(
    '/BhRule/List',
    formdataify({ Token: token(), page: 1, size: 500 })
  );
  return unwrap(res);
}

/** 品种绑定的备货规则 */
export async function GetVarietieBhRule(varietieCode) {
  const res = await request.post(
    '/BhRule/GetVarietieRule',
    formdataify({ Token: token(), VarietieCode: varietieCode || '' })
  );
  return unwrap(res);
}

/** 保存品种备货规则 */
export async function SaveVarietieBhRule({ varietieCode, bhRuleId, bhCycleStartDate }) {
  const res = await request.post(
    '/BhRule/SaveVarietieRule',
    formdataify({
      Token: token(),
      VarietieCode: varietieCode || '',
      BhRuleId: bhRuleId ?? '',
      BhCycleStartDate: bhCycleStartDate ?? ''
    })
  );
  return unwrap(res);
}

/** 导出物资分类品种 */
export async function ExcelVarFZdata(classificProperti = '') {
  const res = await request.post(
    '/VarietieBasicInfo/ExcelVarFZdata',
    formdataify({
      Token: token(),
      CLASSIFIC_PROPERTI: classificProperti ?? ''
    })
  );
  return unwrap(res);
}

/** 市美中标信息查询 */
export async function GetSzsmBidInfo(id) {
  const res = await request.get('/VarietieBasicInfo/GetSzsmBidInfo', {
    params: { Token: token(), id: String(id ?? '') }
  });
  return unwrap(res);
}

/** 市美中标信息保存 */
export async function UpdateSzsmBidInfo(fields = {}) {
  const res = await request.post(
    '/VarietieBasicInfo/UpdateSzsmBidInfo',
    formdataify({
      Token: token(),
      ID: fields.ID ?? '',
      PROJECT_NAME: fields.PROJECT_NAME ?? '',
      PROJECT_CODE: fields.PROJECT_CODE ?? '',
      BID_START_DATE: fields.BID_START_DATE ?? '',
      BID_END_DATE: fields.BID_END_DATE ?? '',
      DEMAND_DEPT: fields.DEMAND_DEPT ?? ''
    })
  );
  return unwrap(res);
}

/** 存在新旧注册证的品种 */
export async function GetStzxVarApp({
  VARIETIE_CODE_NEW = '',
  APPROVAL_NUMBER = '',
  page = 1,
  size = 500
} = {}) {
  const res = await request.get('/AAPDDATE/GetStzxVarApp', {
    params: {
      Token: token(),
      VARIETIE_CODE_NEW,
      APPROVAL_NUMBER,
      page,
      size
    }
  });
  const body = res.data;
  if (body?.code == 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  if (body?.code == 200 || body?.code === '200') {
    return {
      ...body,
      data: Array.isArray(body.result) ? body.result : []
    };
  }
  // 无数据时接口可能返回 400
  if (body?.code == 400 || body?.code === '400') {
    return { code: 200, msg: body.msg || '', data: [], total: 0 };
  }
  throw new Error(body?.msg || '查询失败');
}
