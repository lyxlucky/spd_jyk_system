import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import { Decrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  const isEncrypt = store.state.user.isEncrypt;
  let data = res.data;
  if (isEncrypt && data?.devData) {
    data = JSON.parse(Decrypt(data.devData));
  }
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}

/** 华南供应商评价列表（旧页 GetSupplierScoreLast） */
export async function getSupplierScoreLastList(params) {
  const res = await request.post(
    '/Supplier/GetSupplierScoreLast',
    formdataify({
      Token: token(),
      SUPPLIER_NAME: params.SUPPLIER_NAME ?? '',
      YEAR: params.YEAR ?? '0',
      page: String(params.page ?? 1),
      size: String(params.size ?? 10)
    })
  );
  const body = unwrap(res);
  return {
    total: Number(body.total) || 0,
    result: body.result || []
  };
}

/** 分值记录（旧页 SearchSupplierScore） */
export async function searchSupplierScore(params) {
  const res = await request.post(
    '/Supplier/SearchSupplierScore',
    formdataify({
      Token: token(),
      Supplier_Code: params.Supplier_Code ?? '',
      YEAR: params.YEAR ?? '',
      page: String(params.page ?? 1),
      size: String(params.size ?? 50)
    })
  );
  const body = unwrap(res);
  return {
    total: Number(body.total) || 0,
    result: body.result || []
  };
}

/** 华南扣分评分（旧页 addSupplierScoreLast） */
export async function addSupplierScoreLast(payload) {
  const res = await request.post(
    '/Supplier/addSupplierScoreLast',
    formdataify({
      Token: token(),
      SUPPLIER_CODE: payload.SUPPLIER_CODE ?? '',
      SCORE_TYPE: payload.SCORE_TYPE ?? '',
      SCORE: String(payload.SCORE ?? ''),
      REMARK: payload.REMARK ?? '',
      OPERATOR: payload.OPERATOR ?? '',
      YEAR: payload.YEAR ?? '0'
    })
  );
  return unwrap(res);
}

/** 删除分值记录（旧页 DelSupplierScore） */
export async function delSupplierScore(payload) {
  const res = await request.post(
    '/Supplier/DelSupplierScore',
    formdataify({
      Token: token(),
      ID: String(payload.ID ?? ''),
      SCORE_TYPE: payload.SCORE_TYPE ?? '',
      SCORE: String(payload.SCORE ?? ''),
      SUPPLIER_CODE: payload.SUPPLIER_CODE ?? ''
    })
  );
  return unwrap(res);
}

/** 页面初始化生成评价（旧页 GenerationEval） */
export async function generationEval() {
  const res = await request.post(
    '/Supplier/GenerationEval',
    formdataify({ Token: token() })
  );
  return unwrap(res);
}
