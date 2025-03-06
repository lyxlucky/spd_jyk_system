import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { HOME_HP } from '@/config/setting';

export async function listPekingInvoice(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    isHptx: data.where.isHptx ? data.where.isHptx : '',
    isYG: data.where.isYG ? data.where.isYG : '',
    isDL: data.where.isDL ? data.where.isDL : ''
  };
  const res = await request.get('/PekingApplication/listPekingInvoice', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res;
  } else {
    return Promise.reject(new Error(res.msg));
  }
}

export async function deletePekingInvoice(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    IFACE_ID: data.IFACE_ID
  };
  const res = await request.post('/PekingApplication/deletePekingInvoice', formatData);
  if (res.data.code == 200) {
    return res;
  } else {
    return Promise.reject(new Error(res.msg));
  }
}
