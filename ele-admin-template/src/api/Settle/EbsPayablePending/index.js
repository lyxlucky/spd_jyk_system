import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { HOME_HP } from '@/config/setting';

export async function listEbsPayablePending(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    BatchType: data.BatchType || '',
    ComCode: data.ComCode || ''
  };
  const res = await request.post(
    '/PekingApplication/listEbsPayablePending',
    formatData
  );
  if (res.data.code == 200) {
    return res;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function listEbsPayablePendingDetail(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    id: data.where.IFACE_ID || ''
  };
  const res = await request.post(
    '/PekingApplication/listEbsPayablePendingDetail',
    formatData
  );
  if (res.data.code == 200) {
    return res;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function PushEbsPayablePendingList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    id: data.ids || ''
  };
  const res = await request.post(
    '/PekingApplication/PushEbsPayablePendingList',
    formatData
  );
  if (res.data.code == 200) {
    return res;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
