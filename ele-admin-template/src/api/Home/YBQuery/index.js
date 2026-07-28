import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

export async function GetYB3501List({ page, size, state, startTime, endTime }) {
  const res = await request.get('/YBManagement/GetYB3501List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3502RKList({ page, size, state, startTime, endTime }) {
  const res = await request.get('/YBManagement/GetYB3502RKList', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3502CKList({ page, size, state, startTime, endTime }) {
  const res = await request.get('/YBManagement/GetYB3502CKList', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3503List({ page, size, state, startTime, endTime }) {
  const res = await request.get('/YBManagement/GetYB3503List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

export async function GetYB3504List({ page, size, state, startTime, endTime }) {
  const res = await request.get('/YBManagement/GetYB3504List', {
    params: {
      startTime,
      endTime,
      state,
      page,
      size,
      Token: getToken()
    }
  });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}