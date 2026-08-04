import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

export async function GetYB3501List({
  page,
  size,
  state,
  startTime,
  endTime,
  deptName,
  varietieName,
  supplierName
}) {
  const res = await request.get('/YBManagement/GetYB3501List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      deptName,
      varietieName,
      supplierName,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3502RKList({
  page,
  size,
  state,
  startTime,
  endTime,
  deptName,
  varietieName,
  supplierName
}) {
  const res = await request.get('/YBManagement/GetYB3502RKList', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      deptName,
      varietieName,
      supplierName,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3502CKList({
  page,
  size,
  state,
  startTime,
  endTime,
  deptName,
  varietieName,
  supplierName
}) {
  const res = await request.get('/YBManagement/GetYB3502CKList', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      deptName,
      varietieName,
      supplierName,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3503List({
  page,
  size,
  state,
  startTime,
  endTime,
  deptName,
  varietieName,
  supplierName
}) {
  const res = await request.get('/YBManagement/GetYB3503List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      deptName,
      varietieName,
      supplierName,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3504List({
  page,
  size,
  state,
  startTime,
  endTime,
  deptName,
  varietieName,
  supplierName
}) {
  const res = await request.get('/YBManagement/GetYB3504List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      deptName,
      varietieName,
      supplierName,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

const getFormData = (params) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formData.append(key, value);
  }
  return formData;
};

export async function ExportYB3501(params) {
  delete params.sendDateStart;
  delete params.sendDateEnd;
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/ExportYB3501', formData);
  return res;
}
export async function ExportYB3502RK(params) {
  delete params.sendDateStart;
  delete params.sendDateEnd;
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/ExportYB3502RK', formData);
  return res;
}
export async function ExportYB3502CK(params) {
  delete params.sendDateStart;
  delete params.sendDateEnd;
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/ExportYB3502CK', formData);
  return res;
}
export async function ExportYB3503(params) {
  delete params.sendDateStart;
  delete params.sendDateEnd;
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/ExportYB3503', formData);
  return res;
}
export async function ExportYB3504(params) {
  delete params.sendDateStart;
  delete params.sendDateEnd;
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/ExportYB3504', formData);
  return res;
}
export async function PrintYBApiLog(params) {
  const formData = getFormData({ ...params, Token: getToken() });
  const res = await request.post('/YBManagement/PrintYBApiLog', formData);
  return res;
}