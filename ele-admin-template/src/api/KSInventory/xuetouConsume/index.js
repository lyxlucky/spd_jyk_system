import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function getHdOperateList(data) {
  const params = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ChargingCode: data.ChargingCode || '',
    page: data.page,
    size: data.size
  };
  const res = await request.post('/HdPlan/GetHdOperateList', params);
  console.log(res)
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
  if (res.data.success) {
    return res.data;
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
