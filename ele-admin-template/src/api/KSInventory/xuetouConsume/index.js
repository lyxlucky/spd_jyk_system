import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function getHdOperateList(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    PatientName: data.PatientName || '',
    TYPESETTING_DATE_START: data.TYPESETTING_DATE_START || '',
    TYPESETTING_DATE_END: data.TYPESETTING_DATE_END || '',
    HD_CREATE_TIME_START: data.HD_CREATE_TIME_START || '',
    HD_CREATE_TIME_END: data.HD_CREATE_TIME_END || '',
    SL_CREATE_TIME_START: data.SL_CREATE_TIME_START || '',
    SL_CREATE_TIME_END: data.SL_CREATE_TIME_END || '',
    IdCard: data.IdCard || '',
    BedNumber: data.BedNumber || '',
    ConsumeableName: data.ConsumeableName || '',
    ChargeCode: data.ChargeCode || '',
    IsTransfer: data.IsTransfer || '',
    HasChargeCode: data.HasChargeCode || '',
    ScheduleShift: data.ScheduleShift || '',
    page: data.page,
    size: data.size
  };
  const res = await request.post('/HdPlan/GetHdOperateList', params);
  if (res.data.code == '200') {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function updateHdFixQuantity(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: data.ID,
    QTY: data.QTY
  };
  const res = await request.post('/HdPlan/UpdateHdFixQuantity', params);
  return res.data;
}

export async function getDialysisConsumablesRecords(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page,
    size: data.size,
    ScheduleDateStart: data.ScheduleDateStart || '',
    ScheduleDateEnd: data.ScheduleDateEnd || '',
    PatientName: data.PatientName || '',
    IdCard: data.IdCard || '',
    BedNumber: data.BedNumber || '',
    MaterialName: data.MaterialName || '',
    HisMaterialName: data.HisMaterialName || '',
    ChargeCode: data.ChargeCode || '',
    Quantity: data.Quantity || '',
    CreateTimeStart: data.CreateTimeStart || '',
    CreateTimeEnd: data.CreateTimeEnd || ''
  };
  const res = await request.post('/HdPlan/GetDialysisConsumablesRecords', params);
  if (res.data.code == '200') {
    return {
      data: res.data.data || [],
      total: res.data.total || 0
    };
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function getConsumeList(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    OperateNumber: data.OperateNumber,
    ChargeCode: data.ChargeCode || '',
    page: data.page,
    size: data.size
  };
  const res = await request.post('/HdPlan/GetConsumeList', params);
  if (res.data.code == '200') {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function bindSpdWithHdConsume(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    BindData: data.BindData
  };
  const res = await request.post('/HdPlan/BindSpdWithHdConsume', params);
  return res.data;
}

export async function hdPlanConsumeVoClearAll(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    json: data.json
  };
  const res = await request.post('/HdPlan/HdPlanConsumeVoClearAll', params);
  return res.data;
}

// 查询HD_CONSUME患者信息（支持远程搜索）
export async function getHdConsumePatientList(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 10,
    IdCardNo: data.IdCardNo || '',
    PatientName: data.PatientName || '',
    ChargeCode: data.ChargeCode || '',
    MaterialName: data.MaterialName || '',
    OrderNo: data.OrderNo || '',
    HdCreateTimeStart: data.HdCreateTimeStart || '',
    HdCreateTimeEnd: data.HdCreateTimeEnd || '',
    SpdCreateTimeStart: data.SpdCreateTimeStart || '',
    SpdCreateTimeEnd: data.SpdCreateTimeEnd || ''
  };
  const res = await request.post('/HdPlan/GetHdConsumePatientList', params);
  if (res.data.code == '200') {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 更新HD_CONSUME患者信息
export async function updateHdConsumePatientInfo(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    Ids: data.Ids || [],
    PatientName: data.PatientName || '',
    IdCardNo: data.IdCardNo || ''
  };
  const res = await request.post('/HdPlan/UpdateHdConsumePatientInfo', params);
  if (res.data.code == '200') {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}