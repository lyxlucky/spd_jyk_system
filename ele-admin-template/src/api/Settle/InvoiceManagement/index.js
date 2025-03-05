import request from '@/utils/request';
import store from '@/store';
import { setToken } from '@/utils/token-util';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify, DataToObject } from '@/utils/formdataify';



export async function GetInvoiceManagement(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.LS_IS_JC = data.where.LS_IS_JC ? data.where.LS_IS_JC : '';
  data2.EXAMINE_TIMEEnd = data.where.EXAMINE_TIME && data.where.EXAMINE_TIME.length > 0 ? data.where.EXAMINE_TIME[1] : '';
  data2.EXAMINE_TIMEStart = data.where.EXAMINE_TIME && data.where.EXAMINE_TIME.length > 0 ? data.where.EXAMINE_TIME[0] : '';
  data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW ? data.where.VARIETIE_CODE_NEW : '';
  data2.QSSTATE = data.where.QSSTATE ? data.where.QSSTATE : '';
  data2.EXAMINE_STATE = data.where.EXAMINE_STATE ? data.where.EXAMINE_STATE : '';
  data2.MONTHBILLNUM = data.where.MONTHBILLNUM ? data.where.MONTHBILLNUM : '';
  data2.SUPPLIER_NAME = data.where.SUPPLIER_NAME ? data.where.SUPPLIER_NAME : '';
  data2.MONTHLY_TIMEStart = data.where.MONTHLY_TIME && data.where.MONTHLY_TIME.length > 0 ? data.where.MONTHLY_TIME[0] : '';
  data2.MONTHLY_TIMEEnd = data.where.MONTHLY_TIME && data.where.MONTHLY_TIME.length > 0 ? data.where.MONTHLY_TIME[1] : '';
  data2.EBS_CAN_SEND_INVOICE = data.where.EBS_CAN_SEND_INVOICE ? data.where.EBS_CAN_SEND_INVOICE : '0';



  var rep = formdataify(data2);

  const res = await request.post('/AJykDept/GetInvoiceManagement', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function SuerAuditNo(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);

  const res = await request.post('/HrpMonthly/SuerAuditNo', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SuerAudit(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);

  const res = await request.post('/HrpMonthly/SuerAudit', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SuerFPQS(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);

  const res = await request.post('/HrpMonthly/SuerFPQS', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function CencelFPQS(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.nickname = store.state.user.info.Nickname;
  var rep = formdataify(data2);

  const res = await request.post('/HrpMonthly/CencelFPQS', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function getFinanceAuditByItem(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    id: data.where.id || '',
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  const res = await request.get('/HrpMonthly/getFinanceAuditByItem', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function BillingDdvice(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.nickname = store.state.user.info.Nickname;
  var rep = formdataify(data2);

  const res = await request.post('/HrpMonthly/BillingDdvice', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}