import request from '@/utils/request';
import { formdataify, DataToObject, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, B2B_BASE_URL } from '@/config/setting';
import store from '@/store';
import App from '@/App.vue';
import { getB2bHospitalCode } from '@/views/Task/FollowingGoodsPlan/utils';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

/** 库区下拉 */
export function getStorageList() {
  return request.post('/Commons/GetStorageWithToken', toUrlEncodedBody({ Token: token() }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

/* 状态汇总统计 */
export function getStockUpStateList(data) {
  var data2 = {};
  data2.page = data.page || 1;
  data2.size = data.limit || 9999;
  data2.start_time = data.where?.start_time || '';
  data2.end_time = data.where?.end_time || '';
  data2.STORAGE_ID = data.where?.STORAGE_ID || '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  return request.get('ANewStockUp/StockUpStateList', {
    params: data2
  });
}

export function getStockUpVarInfo(data) {
  let data2 = {};
  data2.page = data.page || 1;
  data2.size = data.limit || 10;
  data2.id = data.where?.id || '';
  data2.order_state = data.where?.order_state || '';
  data2.varietie_code = data.where?.varietie_code || '';
  data2.stock_up_plan_no = data.where?.stock_up_plan_no || '';
  data2.supplier_name = data.where?.supplier_name || '';
  data2.Manufacturing_Ent_Name = data.where?.Manufacturing_Ent_Name || '';
  data2.Specification_Or_Type = data.where?.Specification_Or_Type || '';
  data2.PLAN_DEPT_TWO_NAME = data.where?.PLAN_DEPT_TWO_NAME || '';
  data2.start_time = data.where?.start_time || '';
  data2.end_time = data.where?.end_time || '';
  data2.state = data.where?.state || '';
  data2.remark = data.where?.remark || '';
  data2.STORAGE_ID = data.where?.STORAGE_ID || '';
  data2.varType = data.where?.varType || '';
  data2.order_pc = data.order?.order || 'desc';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  return request.get('ANewStockUp/StockUpVarInfo', {
    params: data2
  });
}

/* 获取备货计划列表 */
export function getStockUpList(data) {
  let data2 = {};
  data2.page = data.page || 1;
  data2.size = data.limit || 10;
  data2.start_time = data.where?.start_time || '';
  data2.end_time = data.where?.end_time || '';
  data2.order_state = data.where?.order_state || '';
  data2.varietie_code = data.where?.varietie_code || '';
  data2.stock_up_plan_no = data.where?.stock_up_plan_no || '';
  data2.supplier_name = data.where?.supplier_name || '';
  data2.approve_state = data.where?.approve_state || '';
  data2.send_state = data.where?.send_state || '';
  data2.coefficient = data.where?.coefficient || '';
  data2.order_pc = data.order?.order || 'desc';
  data2.SENDHRP = data.where?.SENDHRP || '1';
  data2.isQZJS = data.where?.isQZJS ? 1 : 0;
  data2.CREATOR = data.where?.CREATOR || '';
  data2.BZ = data.where?.BZ || '';
  data2.STORAGE_ID = data.where?.STORAGE_ID || '';
  data2.REVIEW_STATE = data.where?.REVIEW_STATE || '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  return request.get('ANewStockUp/StockUpList', {
    params: data2
  });
}

//审核不通过
export function postNoApprove(data) {
  let params = {
    ID: data.ID,
    Person: data.Person || store.state.user.info.Nickname,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  let formdata = formdataify(params);
  return request.post('ANewStockUp/NoApprove', formdata);
}

/**
 * 根据医院代码判断是否需要发送Send_State参数
 * @param {string} hospitalCode 医院代码
 * @returns {boolean} 是否需要Send_State参数
 */
export function needSendState(homehp) {
  let dataJ, yycode;
  switch (homehp) {
    case 'lg':
      dataJ = { HOSPITAL_CODE: 'BH00002', Send_State: true };
      yycode = 'BH00002';
      break;
    case 'stzl':
      dataJ = { HOSPITAL_CODE: 'BH00003', Send_State: true };
      yycode = 'BH00003';
      break;
    case 'nyd':
      dataJ = { HOSPITAL_CODE: 'BH00004', Send_State: true };
      yycode = 'BH00004';
      break;
    case 'szlh':
      dataJ = { HOSPITAL_CODE: 'BH00005', Send_State: true };
      yycode = 'BH00005';
      break;
    case 'zq':
      dataJ = { HOSPITAL_CODE: 'BH00006', Send_State: true };
      yycode = 'BH00006';
      break;
    case 'spd':
      dataJ = { HOSPITAL_CODE: 'BH00041' };
      yycode = 'BH00041';
      break;
    case 'bd':
      dataJ = { HOSPITAL_CODE: 'BH00001' };
      yycode = 'BH00001';
      break;
    case 'bdrm':
      dataJ = { HOSPITAL_CODE: 'BH00261' };
      yycode = 'BH00261';
      break;
    case 'stzx':
      dataJ = { HOSPITAL_CODE: 'BH00007' };
      yycode = 'BH00007';
      break;
    case 'stse':
      dataJ = { HOSPITAL_CODE: 'BH00008' };
      yycode = 'BH00008';
      break;
    case 'szhn':
      dataJ = { HOSPITAL_CODE: 'BH00010' };
      yycode = 'BH00010';
      break;
    case 'fszxy':
      dataJ = { HOSPITAL_CODE: 'BH00009' };
      yycode = 'BH00009';
      break;
    case 'csyy':
      dataJ = { HOSPITAL_CODE: 'BH00011' };
      yycode = 'BH00011';
      break;
    case 'stzyyy':
      dataJ = { HOSPITAL_CODE: 'BH00011' };
      yycode = 'BH00012';
      break;
    case 'szlhfy':
      dataJ = { HOSPITAL_CODE: 'BH00011' };
      yycode = 'BH00014';
      break;
    case 'szsmyl':
      dataJ = { HOSPITAL_CODE: 'BH00011' };
      yycode = 'BH00015';
      break;
    case 'fsdwrmyy':
      dataJ = { HOSPITAL_CODE: 'BH00011' };
      yycode = 'BH00013';
      break;
    default:
      break;
  }
  return { dataJ, yycode };
}

/**
 * 准备关闭订单的请求数据（仅 SPD UpOvertime）
 * @param {Object} data 原始数据
 * @returns {Promise}
 */
export function PostPrepareCloseOrderData(data) {
  let { dataJ, yycode } = needSendState(data.hp);
  const hospitalCode =
    yycode || dataJ?.HOSPITAL_CODE || getB2bHospitalCode(data.hp) || data.HOSPITAL_CODE || '';
  const requestData = {
    HOSPITAL_CODE: hospitalCode,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID,
    Person: data.Person || store.state.user.info.Nickname,
    Approve_State: data.Approve_State,
    Send_State: data.Send_State
  };

  return request.post('ANewStockUp/UpOvertime', formdataify(requestData));
}

/**
 * 关闭整单-B2B
 */
export async function closeStokOrder(planNumber, hospitalCode) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  if (!base) {
    return Promise.reject(new Error('未配置 B2B 地址(VUE_APP_B2B_BASE_URL)，无法关闭已推送订单'));
  }
  try {
    const res = await request.get(`${base}/api/Stock/closeStokOrder`, {
      params: {
        PLAN_NUMBER: planNumber,
        HOSPITAL_CODE: hospitalCode
      }
    });
    return res.data;
  } catch (err) {
    const msg = err?.message || '';
    if (msg === 'Network Error' || err?.code === 'ERR_NETWORK') {
      return Promise.reject(
        new Error(`B2B关闭订单网络失败，请检查B2B地址是否可达：${base}`)
      );
    }
    return Promise.reject(new Error(msg || 'B2B订单关闭失败'));
  }
}

/**
 * 关闭订单（未发送只关 SPD；已推送先关 B2B 再关 SPD）
 * @param {Object} data
 * @param {string|number} data.ID
 * @param {string} data.STOCK_UP_PLAN_NO
 * @param {string|number} data.Send_State / data.SEND_STATE
 * @param {string} data.Approve_State
 * @param {string} [data.hp]
 */
export async function closeStockOrderLikeOld(data) {
  const sendState = data.Send_State ?? data.SEND_STATE ?? '';
  const sendStateNum = parseInt(sendState, 10);
  if (!Number.isNaN(sendStateNum) && sendStateNum > 3) {
    return Promise.reject(new Error('供应商已供货，无法关闭订单'));
  }

  let { dataJ, yycode } = needSendState(data.hp);
  const hospitalCode =
    yycode || dataJ?.HOSPITAL_CODE || getB2bHospitalCode(data.hp) || data.HOSPITAL_CODE || '';
  if (!hospitalCode) {
    return Promise.reject(new Error('非法请求：未配置院区编码'));
  }

  const planNo = data.STOCK_UP_PLAN_NO || data.stock_up_plan_no || '';
  const isUnsent =
    sendState === '0' ||
    sendState === 0 ||
    sendState === '未发送(SPD)' ||
    sendState === '' ||
    sendState == null;

  // 已推送：先通知 B2B 作废，成功后再关 SPD
  if (!isUnsent) {
    if (!planNo) {
      return Promise.reject(new Error('缺少备货单号，无法通知供应商关闭'));
    }
    const b2bRes = await closeStokOrder(planNo, hospitalCode);
    if (!(b2bRes?.code == 200 || b2bRes?.code === '200')) {
      return Promise.reject(new Error(b2bRes?.msg || 'B2B订单关闭失败'));
    }
  }

  return PostPrepareCloseOrderData({
    ID: data.ID,
    Approve_State: data.Approve_State,
    Send_State: sendState,
    hp: data.hp,
    HOSPITAL_CODE: hospitalCode,
    Person: data.Person
  });
}

export async function UpFundsSource(data) {
  let params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    FUNDS_SOURCE_TYPE: data.type
  };
  let formdata = formdataify(params);
  const res = await request.post('/ANewStockUp/UpFundsSource', formdata);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function YesApprove(data) {
  const params = {
    ID: data.ID,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    Person: store.state.user.info.Nickname
  };
  let formdata = formdataify(params);
  const res = await request.post('/ANewStockUp/YesApprove', formdata);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function CheckPlanPriceInfo(data) {
  const params = {
    Stock_Up_Plan_No: data.order,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  const res = await request.get('/CentralWarehouseMonitor/CheckPlanPriceInfo', {
    params: params
  });
  console.log(res)
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(res.data);
  }
}

export async function GetPickingInfo(data) {
  const params = {
    Stock_Up_Plan_No: data.order,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  const res = await request.get(`/CentralWarehouseMonitor/GetPickingInfo`, {
    params: params
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function ReceiveSpdStockup(data) {
  const formatdata = {
    json: data.json
  };
  const res = await fetch(
    `http://39.107.78.98:18011/api/SpdBtb/ReceiveSpdStockup`,
    {
      method: 'POST',
      body: formdataify(formatdata)
    }
  ).then((response) => response.json());
  return res;
}

export async function UpdateSendState(data) {
  const params = {
    ID: data.ID,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  let formdata = formdataify(params);
  const res = await request.post(
    '/CentralWarehouseMonitor/UpdateSendState',
    formdata
  );
  return res;
}
























