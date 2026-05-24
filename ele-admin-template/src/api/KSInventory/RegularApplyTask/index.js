import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function withToken(data) {
  return {
    ...(data || {}),
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
}

export async function searchRegularApplyTask(data) {
  const formatData = withToken({
    page: data.page || 1,
    size: data.limit || data.size || 20,
    SEARCH_KEY: data.where && data.where.SEARCH_KEY ? data.where.SEARCH_KEY : '',
    DEPT_TWO_CODE:
      data.where && data.where.DEPT_TWO_CODE ? data.where.DEPT_TWO_CODE : ''
  });
  const res = await request.post(
    '/RegularApplyTask/Search',
    formdataify(formatData)
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function saveRegularApplyTask(data) {
  const res = await request.post(
    '/RegularApplyTask/Save',
    formdataify(withToken(data))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function deleteRegularApplyTask(id) {
  const res = await request.post(
    '/RegularApplyTask/Delete',
    formdataify(withToken({ ID: id }))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function enableRegularApplyTask(id, enable) {
  const res = await request.post(
    '/RegularApplyTask/Enable',
    formdataify(withToken({ ID: id, IS_ENABLE: enable }))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function previewRegularApplyTask(id) {
  const res = await request.post(
    '/RegularApplyTask/PreviewDetails',
    formdataify(withToken({ ID: id }))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function runRegularApplyTaskOnce(id) {
  const res = await request.post(
    '/RegularApplyTask/RunOnce',
    formdataify(withToken({ ID: id }))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function scanRegularApplyTaskDue() {
  const res = await request.post(
    '/RegularApplyTask/ScanAndRunDue',
    formdataify(withToken({}))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function searchRegularApplyTaskLog(data) {
  const formatData = withToken({
    TASK_ID: data.TASK_ID || '',
    page: data.page || 1,
    size: data.limit || data.size || 20
  });
  const res = await request.post(
    '/RegularApplyTask/SearchLog',
    formdataify(formatData)
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function searchRegularApplyTaskLogDetail(logId) {
  const res = await request.post(
    '/RegularApplyTask/SearchLogDetail',
    formdataify(withToken({ LOG_ID: logId }))
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}
