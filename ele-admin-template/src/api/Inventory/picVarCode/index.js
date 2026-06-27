import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index';

/** 品种资质图片列表（对应老系统 picVarCode getVarPic） */
export async function getVarPicList(data) {
  const w = data.where || {};
  const formataData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page,
    size: data.limit,
    VARIETIE_NAME: w.varietyKeyword || '',
    SUPPLIER_NAME: w.supplierName || '',
    APPROVAL_NUMBER: w.approvalNumber || '',
    MANUFACTURING_ENT_NAME: w.manufacturingEntName || '',
    VARIETIE_CODE: w.varietieCode || '',
    PROD_REGISTRATION_CODE: w.prodRegistrationCode || '',
    TYPE: w.type != null && w.type !== '' ? String(w.type) : '',
    VAR_TYPE: w.varType != null && w.varType !== '' ? String(w.varType) : '',
    STATE: w.state != null && w.state !== '' ? String(w.state) : '',
    SPD_SP_STATE: w.spdSpState != null && w.spdSpState !== '' ? String(w.spdSpState) : '',
    AI_STATUS: w.aiStatus != null && w.aiStatus !== '' ? String(w.aiStatus) : '',
    AI_OUTCOME: w.aiOutcome != null && w.aiOutcome !== '' ? String(w.aiOutcome) : '',
    SUPPLIER_CODE: w.supplierCode || '',
    isUse: w.isUse != null && w.isUse !== '' ? String(w.isUse) : ''
  };
  const res = await request.post('/BtbGetVarietie/getVarPic', formdataify(formataData));
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function ApproveVarPic(data) {
  const formataData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    json: typeof data.json === 'string' ? data.json : JSON.stringify(data.json || []),
    appman: store.state.user.info.Nickname,
    appstate: String(data.appstate)
  };
  if (data.appstate == 2) {
    formataData.PASS_REASON = data.PASS_REASON || '';
  }
  const res = await request.post('/BtbGetVarietie/ApproveVarPic', formdataify(formataData));
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function ApproveVarPicSpd(data) {
  const formataData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    json: typeof data.json === 'string' ? data.json : JSON.stringify(data.json || []),
    appman: store.state.user.info.Nickname,
    appstate: String(data.appstate)
  };
  if (data.appstate == 2) {
    formataData.PASS_REASON = data.PASS_REASON || '';
  }
  const res = await request.post('/BtbGetVarietie/ApproveVarPicSpd', formdataify(formataData));
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function PicVarDiscardUse(data) {
  const res = await request.post(
    '/BtbGetVarietie/PicVarDiscardUse',
    formdataify({
      Token: sessionStorage.getItem(TOKEN_STORE_NAME),
      IDS: data.ids
    })
  );
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/** 品种资质图片上传（对应老系统 Frame/UploadPictures → UploadVarPic） */
export async function uploadVarPic(data) {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const fd = new FormData();
  fd.append('Token', Token);
  fd.append('VARIETIE_CODE', data.varietieCode || '');
  fd.append('PROD_REGISTRATION_CODE', data.prodRegistrationCode || '');
  fd.append('SUPPLIER_CODE', data.supplierCode != null ? String(data.supplierCode) : '0');
  fd.append('TYPE', data.type != null ? String(data.type) : '');
  fd.append('TB_STATE', data.tbState != null ? String(data.tbState) : '0');
  fd.append('REMARK', data.remark || '');
  fd.append('START_TIME', data.startTime || '0001-01-01');
  fd.append('END_TIME', data.endTime || '9999-01-01');
  if (data.file) {
    fd.append('FILE', data.file);
  }
  const res = await request.post('/BtbGetVarietie/UploadVarPic', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  if (res.data === '301' || res.data === 301) {
    return Promise.reject(new Error('登录失效，请重新登录'));
  }
  if (res.data.code == 200 || res.data.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '上传失败'));
}

export async function deleteVarPic(data) {
  const res = await request.post(
    '/BtbGetVarietie/deleteVarPic',
    formdataify({
      Token: sessionStorage.getItem(TOKEN_STORE_NAME),
      ID: data.id,
      TYPE: '1'
    })
  );
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export {
  submitVarPicAiReview,
  syncVarPicAiReviewStatus,
  getVarPicAiReviewDetail
} from '@/api/Home/Qualificationcheck/index';

export async function getApprovalDetail(approvalNumber) {
  const res = await request.post('/PekingApplication/getApprovalDetail', {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    APPROVAL_NUMBER: approvalNumber
  });
  if (res.data.code == 200) {
    const list = res.data.data ?? res.data.result ?? [];
    return { data: Array.isArray(list) ? list : [] };
  }
  return Promise.reject(new Error(res.data.msg));
}
