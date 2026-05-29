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
