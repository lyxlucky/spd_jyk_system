import request from '@/utils/request';
import { formdataify, DataToObject, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function QueryPageLayUI(data) {

    console.log(data)

    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.varietieCode = data.where.varietieCode ? data.where.varietieCode : '';
    // enable='' 表示全部；不能用三元假值判断，否则会把「全部」回落成「启用」
    data2.enable =
      data.where.enable === undefined || data.where.enable === null
        ? '1'
        : data.where.enable;
    data2.varietieName = data.where.varietieName ? data.where.varietieName : '';
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
    // ele-pro-table 传入 order: { sort, order: ascending|descending }
    // 老系统/后端需要 field + order 字符串（asc/desc）
    const sorter = data.order && typeof data.order === 'object' ? data.order : null;
    if (sorter) {
      data2.field = typeof sorter.sort === 'string' ? sorter.sort : '';
      data2.order =
        sorter.order === 'descending'
          ? 'desc'
          : sorter.order === 'ascending'
            ? 'asc'
            : typeof sorter.order === 'string'
              ? sorter.order
              : '';
    } else {
      data2.field = typeof data.field === 'string' ? data.field : '';
      data2.order = typeof data.order === 'string' ? data.order : '';
    }


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

/** 品种资料 Excel 导入（chrmyy 走 ImportVarietieExcel_CH） */
export async function ImportVarietieExcel(formData) {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const apiName = HOME_HP === 'chrmyy' ? 'ImportVarietieExcel_CH' : 'ImportVarietieExcel';
  const res = await request.post(
    `/VarietieBasicInfo/${apiName}?Token=${encodeURIComponent(Token)}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    }
  );
  return res.data;
}

/** 批量提交医保审批（FormData: file + Token） */
export async function batchSubmitYbCheck(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post('/AAPDDATE/batchSubmitYbCheck', fd, {
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

/**
 * 对齐老系统 VarietyDataLzh.buildVarietyQueryPrams
 * （导出/列表筛选共用字段；空串需带上，避免后端 Form[].Trim() 空引用）
 */
export function buildVarietyQueryParams(where = {}, extra = {}) {
  const w = where || {};
  const code = w.varietieCode || '';
  const enable =
    w.enable === undefined || w.enable === null ? '1' : w.enable;
  return {
    Token: token(),
    varietieCode: code,
    // 老系统：名称与编码同源（同一搜索框）
    varietieName: w.varietieName || code,
    field: '',
    order: '',
    state: w.state ?? '',
    IS_CHARGE: w.IS_CHARGE ?? '-1',
    IS_BIDDING: w.IS_BIDDING ?? '-1',
    SPECIAL_PURCHASE: w.SPECIAL_PURCHASE ?? '-1',
    ONEOFF_STERILIZATION_PACKAGING: w.ONEOFF_STERILIZATION_PACKAGING ?? '-1',
    STORAGE_TYPE: w.STORAGE_TYPE ?? '-1',
    IS_EMBEDDED: w.IS_EMBEDDED ?? '-1',
    IS_SERIAL_NUMBER: w.IS_SERIAL_NUMBER ?? '-1',
    IS_INTERVENED: w.IS_INTERVENED ?? '-1',
    IS_PROTECT: w.IS_PROTECT ?? '-1',
    HIGH_OR_LOW_CLASS: w.HIGH_OR_LOW_CLASS || '-1',
    HIGH_OR_LOW_CLASS_TWO: w.HIGH_OR_LOW_CLASS_TWO || '-1',
    IS_EQUIPMENT_CHANGE: w.IS_EQUIPMENT_CHANGE ?? '-1',
    SENDYB_STATE: w.SENDYB_STATE ?? '',
    HIGH_CLASS_XH: w.HIGH_CLASS_XH ?? '',
    // 后端 CreateStorageExcelCwj 读 HIGH_CLASS_XH_SEARCH
    HIGH_CLASS_XH_SEARCH: w.HIGH_CLASS_XH ?? '',
    enable,
    enableChargingCode: w.enableChargingCode ?? '',
    updateTime: w.updateTime ?? '',
    priceChangeTimeStart: w.priceChangeTimeStart ?? '',
    priceChangeTimeEnd: w.priceChangeTimeEnd ?? '',
    APPROVAL_STATE: w.APPROVAL_STATE ?? '',
    vdzh_sx: w.vdzh_sx ?? '',
    SCQY: w.SCQY ?? '',
    SUP: w.SUP ?? '',
    Specification_Or_Type: w.Specification_Or_Type ?? '',
    ZCZ: w.ZCZ ?? '',
    CZ: w.CZ ?? '',
    VARYB_STATE: w.VARYB_STATE ?? '',
    VARSB_STATE: w.VARSB_STATE ?? '',
    VARJF_STATE: w.VARJF_STATE ?? '',
    VARSPD_STATE: w.VARSPD_STATE ?? '',
    VARBZ_STATE: w.VARBZ_STATE ?? '',
    VAROES_STATE: w.VAROES_STATE ?? '',
    FSWY_STATE: w.FSWY_STATE ?? '',
    Y_M_P_CODE: w.Y_M_P_CODE ?? '',
    CLASS_ONE: w.CLASS_ONE ?? '',
    CLASS_TWO: w.CLASS_TWO ?? '',
    CLASS_THREE: w.CLASS_THREE ?? '',
    UDI_TOP: w.UDI_TOP ?? '',
    BZ_TI: w.BZ_TI ?? '',
    JF_BJ: w.JF_BJ ?? '',
    IS_HANG_UP: w.IS_HANG_UP ?? '',
    STSEHIS_STATE: w.STSEHIS_STATE ?? '',
    HOSPITAL_SYNC: w.HOSPITAL_SYNC ?? '',
    VAR_CREATETIMESTART: w.VAR_CREATETIMESTART ?? '',
    VAR_CREATETIMEEND: w.VAR_CREATETIMEEND ?? '',
    CLASSIFIC_PROPERTIES3: w.CLASSIFIC_PROPERTIES3 ?? '',
    ...extra
  };
}

/** 老系统 PrintStorageSingleRari：走 CreateStorageExcelCwj_B 的院区 */
export function shouldUseCreateStorageExcelCwjB(hp = HOME_HP) {
  return ['szhn', 'lg', 'bd', 'zq', 'szlhfy', 'szsmyl'].includes(hp);
}

/**
 * 普通导出（非 EpPlus）
 * 对齐老系统：buildVarietyQueryPrams + hp/page/size；默认每页 50000
 * @param {object} where
 * @param {{ useB?: boolean, page?: number, size?: number }} [options]
 */
export async function createStorageExcelCwj(where = {}, options = {}) {
  // 兼容旧调用 createStorageExcelCwj(where, true)
  const opts = typeof options === 'boolean' ? { useB: options } : options || {};
  const useB =
    opts.useB !== undefined ? opts.useB : shouldUseCreateStorageExcelCwjB();
  const page = opts.page ?? 1;
  const size = opts.size ?? 50000;
  const path = useB
    ? '/VarietieBasicInfo/CreateStorageExcelCwj_B'
    : '/VarietieBasicInfo/CreateStorageExcelCwj';
  const data2 = buildVarietyQueryParams(where, {
    field: '',
    order: '',
    hp: HOME_HP || '',
    page: String(page),
    size: String(size)
  });
  const res = await request.post(path, formdataify(data2), { timeout: 600000 });
  return unwrap(res);
}

/**
 * 高性能导出（EPPlus）
 * 对齐老系统 PrintStorageEpPlus：同一套 buildVarietyQueryPrams + hp，后端内部分批写入单文件
 */
export async function createStorageExcelCwjEpPlus(where = {}, extra = {}) {
  const data2 = buildVarietyQueryParams(where, {
    field: '',
    order: '',
    hp: HOME_HP || '',
    ...extra
  });
  const res = await request.post(
    '/VarietieBasicInfo/CreateStorageExcelCwjEpPlus',
    formdataify(data2),
    { timeout: 600000 }
  );
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

/** 华南推送品种到 OES（旧页 SendSzhnVarHis → Abdzczh/SendVarToOes） */
export async function sendVarToOes(rows, men) {
  const payload = (rows || []).map((r) => ({ ID: r.ID }));
  const res = await request.post(
    '/Abdzczh/SendVarToOes',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      men: men ?? ''
    }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

const LONG_TIMEOUT = { timeout: 600000 };

function mapIdPayload(rows) {
  return (rows || []).map((r) => ({ ID: r.ID }));
}

function mapVarietieCodePayload(rows) {
  return (rows || []).map((r) => ({ Varietie_Code: r.Varietie_Code }));
}

/** 市二系：品种备注已处理 */
export async function commitVarStseBZ(rows, nickname, type = '2') {
  const payload = (rows || []).map((r) => ({ ID: r.Varietie_Code }));
  const res = await request.post(
    '/VarietieBasicInfo/CommitVarStseBZ',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      nickname: nickname ?? '',
      type: String(type)
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 市二系：提交字典 */
export async function commitVarStseSB(rows, nickname, type = '0') {
  const res = await request.post(
    '/VarietieBasicInfo/CommitVarStseSB',
    formdataify({
      Token: token(),
      json: JSON.stringify(mapIdPayload(rows)),
      nickname: nickname ?? '',
      type: String(type)
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 市二：发送同步品种 */
export async function sendStseVarHis(rows, men = '') {
  const res = await request.post(
    '/AAxtzx_his/SendStseVarHis',
    formdataify({
      Token: token(),
      json: JSON.stringify(mapIdPayload(rows)),
      men: men || ''
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 市二：SyncItem（与 SendStseVarHis 配套） */
export async function syncStseItem(rows) {
  const ids = (rows || []).map((r) => r.Varietie_Code).filter(Boolean).join(',');
  const res = await request.post(
    '/ShanTou/SyncItem',
    formdataify({ Token: token(), varietieCode: ids }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 市二调价 */
export async function stseUpdatePrice(rows) {
  const ids = (rows || []).map((r) => r.Varietie_Code).filter(Boolean).join(',');
  const res = await request.post(
    '/ShanTou/UpdatePrice',
    formdataify({ Token: token(), varietieCode: ids }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 发送品种 CSYY */
export async function sendCsyyVarHis(rows) {
  const res = await request.post(
    '/Abdzczh/CSYYVAR_H006',
    formdataify({ Token: token(), json: JSON.stringify(mapIdPayload(rows)) }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 发送品种 STZY */
export async function sendStzyVarHis(rows) {
  const res = await request.post(
    '/Abdzczh/AddVarStzy',
    formdataify({ Token: token(), json: JSON.stringify(mapVarietieCodePayload(rows)) }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 发送品种 STZL */
export async function sendStzlVarHis(rows, men = '') {
  const payload = (rows || []).map((r) => ({ ID: r.Varietie_Code, men: men || '' }));
  const res = await request.post(
    '/VarietieBasicInfo/sendMaterialToHis',
    formdataify({ Token: token(), Json: JSON.stringify(payload) }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 发送品种 CHRM（模型绑定 List） */
export async function sendChrmVarHis(rows, men = '') {
  const json = (rows || []).map((r) => ({ ID: r.Varietie_Code, men: men || '' }));
  const res = await request.post(
    '/Abdzczh/sendVarTo',
    { Token: token(), json },
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 发送品种 南中 */
export async function sendDhThreeHis(rows, men = '') {
  const res = await request.post(
    '/VarietieBasicInfo/SendDHTHREEHis',
    formdataify({
      Token: token(),
      json: JSON.stringify(mapIdPayload(rows)),
      men: men || ''
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 北大计费编码回传标记 */
export async function sendBdJfBm(rows) {
  const payload = (rows || []).map((r) => ({ CHARGING_CODE: r.CHARGING_CODE }));
  const res = await request.post(
    '/Commons/GetBDUpGzHcHis',
    formdataify({ Token: token(), json: JSON.stringify(payload) }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 佛山审批品种：fsdwrmyy→SendVarFsWy；fszxy→SaveArcItemAndTarItem */
export async function sendFsApproveVar(rows, men = '', homehp = HOME_HP) {
  const api =
    homehp === 'fszxy' ? 'SaveArcItemAndTarItem' : 'SendVarFsWy';
  const res = await request.post(
    `/Abdzczh/${api}`,
    formdataify({
      Token: token(),
      json: JSON.stringify(mapVarietieCodePayload(rows)),
      men: men || ''
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 提交医保审批（品种维护页） */
export async function tjybspCommitMain(rows, { nickname = '', bz = '', sendYbType = '' } = {}) {
  const res = await request.post(
    '/VarietieBasicInfo/tjybspCommit',
    formdataify({
      Token: token(),
      json: JSON.stringify(mapIdPayload(rows)),
      nickname: nickname || '',
      type: '1',
      BZ: bz ?? '',
      SENDYB_TYPE: sendYbType ?? ''
    }),
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 推送到 DAP */
export async function pushMaterialsToDap(varietyCodes) {
  const res = await request.post(
    '/DapMaterialPush/pushMaterialsToDap',
    {
      Token: token(),
      VarietyCodes: varietyCodes || []
    },
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 佛山：推送分院 */
export async function createVarietieBasicInfoSync({
  fromHospitalId = 'dwrmyy',
  toHospitalId,
  varietieCode = [],
  varietieCodeNew = []
}) {
  const res = await request.post(
    `/VarietieBasicInfo/CreateVarietieBasicInfoSync?Token=${encodeURIComponent(token())}`,
    {
      FROM_HOSPITAL_ID: fromHospitalId,
      TO_HOSPITAL_ID: toHospitalId,
      VARIETIE_CODE: varietieCode,
      VARIETIE_CODE_NEW: varietieCodeNew
    },
    LONG_TIMEOUT
  );
  return unwrap(res);
}

/** 佛山第六：推送 HIS */
export async function pullVarietieBasicInfoToHIS(varietieCodes) {
  const res = await request.post(
    `/VarietieBasicInfo/PullVarietieBasicInfoToHIS?Token=${encodeURIComponent(token())}`,
    varietieCodes || [],
    {
      ...LONG_TIMEOUT,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  return res.data;
}

/** 龙三：推送 HIS */
export async function pushLongGangHis(varietieCodes, operator = '') {
  const fd = new FormData();
  fd.append(
    'request',
    JSON.stringify({
      header: { operator: operator || '' },
      varietieCodes: varietieCodes || []
    })
  );
  const res = await request.post(
    `/LongGangSpdHis/spdAddNewItem?Token=${encodeURIComponent(token())}`,
    fd,
    {
      ...LONG_TIMEOUT,
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return res.data;
}

/** 导入省平台 / 添加省平台品种 */
export async function importProvinceVar(file, addMode = false) {
  const fd = new FormData();
  fd.append('file', file);
  const api = addMode ? 'ImportPROVINCE_VAR_Add' : 'ImportPROVINCE_VAR';
  const res = await request.post(
    `/VarietieBasicInfo/${api}?Token=${encodeURIComponent(token())}`,
    fd,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    }
  );
  return res.data;
}

/** 深汕中标信息导入 */
export async function importSzsmBidInfo(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await request.post(
    `/VarietieBasicInfo/ImportSzsmBidInfo?Token=${encodeURIComponent(token())}`,
    fd,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000
    }
  );
  return res.data;
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

/** 批准文号下拉（新增品种） */
export async function GetApprovalNumberList() {
  const res = await request.get('/VarietieBasicInfo/GetApprovalNumberList', {
    params: { Token: token() }
  });
  const body = res.data;
  if (body === '301' || body === 301 || body?.code == 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) || [];
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(body) ? body : body?.result || [];
}

/** 根据注册证编码取批准文号详情 */
export async function GetApprovalNumberInfo(prodRegistrationCode) {
  const res = await request.get('/VarietieBasicInfo/GetApprovalNumberInfo', {
    params: {
      Token: token(),
      ProdRegistrationCode: prodRegistrationCode || ''
    }
  });
  const body = res.data;
  if (body === '301' || body === 301 || body?.code == 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) || [];
    } catch (e) {
      return [];
    }
  }
  return Array.isArray(body) ? body : body?.result || [];
}

/** 品种编码是否已存在（新增前校验） */
export async function IsVarietieExist(varietieCode) {
  const res = await request.get('/VarietieBasicInfo/IsVarietieExist', {
    params: {
      Token: token(),
      varietieCode: varietieCode || ''
    }
  });
  return res.data === true || res.data === 'true';
}

/** 新增散货品种（字段与 UpdateVarietieBasic / 老页 InsertVarietieBasic 一致） */
export async function InsertVarietieBasic(payload) {
  const res = await request.post(
    '/VarietieBasicInfo/InsertVarietieBasic',
    formdataify(payload)
  );
  return unwrap(res);
}

/** Excel 批量更新选定字段（对齐老页 Imp_updataField） */
export async function ImpUpdataField(file, updataField, priceBox = 0) {
  const fd = new FormData();
  fd.append('FILE', file);
  fd.append('Token', token());
  fd.append('updataField', String(updataField));
  fd.append('price_box', String(priceBox ?? 0));
  fd.append('nickname', '');
  const res = await request.post('/VarietieBasicInfo/Imp_updataField', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  return res.data;
}

/** 与老 layui table/$.post 一致：x-www-form-urlencoded，供 Request.Form 绑定 */
const urlEncodedHeaders = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
};

/** 品种效期资料分页 */
export async function GetVarExpirationData({
  VARIETIE_CODE_NEW = '',
  page = 1,
  size = 30
} = {}) {
  const res = await request.post(
    '/VarietiesQuery/GetVarExpirationData',
    toUrlEncodedBody({
      Token: token(),
      VARIETIE_CODE_NEW: VARIETIE_CODE_NEW || '',
      page: String(page || 1),
      size: String(size || 30)
    }),
    urlEncodedHeaders
  );
  return unwrap(res);
}

/** 停用合同过期品种（后端实现可能不完整，保持与老页一致入口） */
export async function StopVarExpirationData() {
  const res = await request.post(
    '/VarietiesQuery/StopVarExpirationData',
    toUrlEncodedBody({ Token: token() }),
    urlEncodedHeaders
  );
  return unwrap(res);
}

/** 微讯通品种审核列表（对齐老页 WxtSpVarInfo layui table 入参） */
export async function getWxtSpVarInfo({
  page = 1,
  size = 30,
  wpmc = '',
  sycStatus = '',
  SPDstate = ''
} = {}) {
  const res = await request.post(
    '/MonthClearing/getWxtSpVarInfo',
    toUrlEncodedBody({
      Token: token(),
      page: String(page || 1),
      size: String(size || 30),
      wpmc: wpmc || '',
      sycStatus: sycStatus == null ? '' : String(sycStatus),
      SPDstate: SPDstate == null ? '' : String(SPDstate)
    }),
    urlEncodedHeaders
  );
  return unwrap(res);
}

/** 微讯通品种同步处理 */
export async function updateNewVarCode() {
  const res = await request.post(
    '/MonthClearing/updateNewVarCode',
    toUrlEncodedBody({ Token: token() }),
    urlEncodedHeaders
  );
  return unwrap(res);
}
