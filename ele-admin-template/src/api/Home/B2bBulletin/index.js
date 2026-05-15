import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function ok(res) {
  const c = res?.data?.code;
  return c === 200 || c === '200';
}

/** 公告 / 通讯录 / 月结图 */
export async function getAnnounceInfo() {
  const fd = formdataify({ Token: getToken() });
  const res = await request.post('/Supplier/GetAnnounceInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '获取公告失败'));
}

export async function upAnnounceInfo(payload) {
  const fd = formdataify({
    Token: getToken(),
    ID: String(payload.ID ?? ''),
    NOTIFICATION_INFORMATION: payload.NOTIFICATION_INFORMATION ?? '',
    DEPT_CONTACT: payload.DEPT_CONTACT ?? '',
    PROJECT_LEADER: payload.PROJECT_LEADER ?? '',
    MONTHLY_SETTLE_MANAGER: payload.MONTHLY_SETTLE_MANAGER ?? '',
    WEEKEND_ACCEPTANCE_ONDUTY: payload.WEEKEND_ACCEPTANCE_ONDUTY ?? '',
    WORKING_ACCEPTANCE_ONDUTY: payload.WORKING_ACCEPTANCE_ONDUTY ?? '',
    WAREHOUSE_ADDRESS: payload.WAREHOUSE_ADDRESS ?? ''
  });
  const res = await request.post('/Supplier/UpAnnounceInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '保存失败'));
}

export async function getFeedbackInfo(params) {
  const fd = formdataify({
    Token: getToken(),
    SUPPLIER_NAME: params.SUPPLIER_NAME ?? '',
    RESPONDER: params.RESPONDER ?? '',
    UPDATE_TIMEstart: params.UPDATE_TIMEstart ?? '',
    UPDATE_TIMEend: params.UPDATE_TIMEend ?? '',
    page: String(params.page ?? 1),
    size: String(params.size ?? 10)
  });
  const res = await request.post('/Supplier/GetFeedbackInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询反馈失败'));
}

export async function upFeedBackReply(payload) {
  const fd = formdataify({
    Token: getToken(),
    ID: String(payload.ID),
    FeedBackREPLY: payload.FeedBackREPLY ?? '',
    RESPONDER: payload.RESPONDER ?? ''
  });
  const res = await request.post('/Supplier/UpFeedBackREPLY', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '回复失败'));
}

export async function getSuppAttachmentInfo(params) {
  const fd = formdataify({
    Token: getToken(),
    ID: params.ID ?? '',
    page: String(params.page ?? 1),
    size: String(params.size ?? 10)
  });
  const res = await request.post('/Supplier/GetSuppAttachmentInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询附件失败'));
}

export async function delSuppAttachmentInfo(ids) {
  const fd = formdataify({
    Token: getToken(),
    IDS: Array.isArray(ids) ? ids.join(',') : String(ids)
  });
  const res = await request.post('/Supplier/DelSuppAttachmentInfo', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '删除失败'));
}

/** 上传月结图 1 / 2：multipart，字段与旧版 layui 一致 */
export function buildAnnounceImageUploadUrl(which) {
  const base = (process.env.VUE_APP_API_BASE_URL || '/api').replace(/\/$/, '');
  return `${base}/Supplier/UpAnnounceTP${which}`;
}

export function getAnnounceUploadData(announceId) {
  return {
    Token: getToken(),
    ID: announceId != null ? String(announceId) : ''
  };
}

export async function uploadSuppAttachment(file) {
  const fd = new FormData();
  fd.append('Token', getToken());
  fd.append('HOSPITAL_CODE', HOME_HP || '');
  fd.append('FILE', file);
  const res = await request.post('/Supplier/UpattAchmentsInfo', fd);
  const c = res?.data?.code;
  if (c === 200 || c === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '上传失败'));
}
