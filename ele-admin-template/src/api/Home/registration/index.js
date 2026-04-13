import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { EncryptWithCustomKey } from '@/utils/aes-util.js';

export async function SearchProdInfo(data) {
  let formatData = {};
  formatData.page = data.page;
  formatData.size = data.limit;
  formatData.prams = EncryptWithCustomKey(
    JSON.stringify({
      Token: sessionStorage.getItem(TOKEN_STORE_NAME),
      keyword: data.where.registrationNo ? data.where.registrationNo : '',
      filed: data.filed ? data.filed : '',
      //data.order ? data.order :
      order: '',
      enable: data.where.isEnable ? data.where.isEnable : '',
      scqy: data.where.manufacture ? data.where.manufacture : ''
    }),
    localStorage.getItem('AesKey')
  );
  formatData.AesKey = localStorage.getItem('AesKey');
  let req = formdataify(formatData);
  const res = await request.post('/ProdInfo/SearchProdInfo', req);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function disAppro(data) {
  let formatData = {};
  formatData.ID = data.id;
  formatData.ApproStr = data.ApproStr;
  formatData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  let req = formdataify(formatData);
  const res = await request.post('/ProdInfo/disAppro', req);
  return res.data;
}

/** 批量去重保留：items 为表格行数组，含 PROD_REGISTRATION_CODE、APPROVAL_NUMBER（JSON 请求体） */
export async function disApproBatch(items) {
  const res = await request.post('/ProdInfo/disApproBatch', {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    Items: items.map((row) => ({
      ID: row.PROD_REGISTRATION_CODE,
      ApproStr: row.APPROVAL_NUMBER
    }))
  });
  return res.data;
}

export async function DeleteProd(data) {
  let formatData = {};
  formatData.PROD_REGISTRATION_CODE = data.code;
  formatData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  let req = formdataify(formatData);
  const res = await request.post('/ProdInfo/DeleteProd', req);
  return res.data;
}


export async function getVarPic(data) {
  let formatData = {};
  formatData.PROD_REGISTRATION_CODE = data.code;
  formatData.VARIETIE_CODE = '';
  formatData.page = 1;
  formatData.size = 999999;
  formatData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  let req = formdataify(formatData);
  const res = await request.post('/BtbGetVarietie/getVarPic', req);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}