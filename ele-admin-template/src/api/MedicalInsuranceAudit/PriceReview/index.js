import request from '@/utils/request';
import store from '@/store';
import { setToken } from '@/utils/token-util';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function getPekingApplication(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  const res = await request.get('/PekingApplication/getPekingApplication', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}

export async function getPekingApplicationDTL(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    APPLICATION_NUMBER: data.APPLICATION_NUMBER
  };
  const res = await request.get('/PekingApplication/getPekingApplicationDTL', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}
