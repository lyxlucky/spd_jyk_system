import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { EncryptWithCustomKey } from '@/utils/aes-util.js';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

export async function SearchProdInfo(data) {
  const where = data.where || {};
  const formatData = {
    page: data.page,
    size: data.limit,
    prams: EncryptWithCustomKey(
      JSON.stringify({
        Token: token(),
        keyword: where.registrationNo || '',
        filed: data.filed || data.field || '',
        order: data.order || '',
        enable: where.isEnable != null ? where.isEnable : '',
        scqy: where.manufacture || ''
      }),
      localStorage.getItem('AesKey')
    ),
    AesKey: localStorage.getItem('AesKey')
  };
  const res = await request.post('/ProdInfo/SearchProdInfo', formdataify(formatData));
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function disAppro(data) {
  const res = await request.post(
    '/ProdInfo/disAppro',
    formdataify({
      ID: data.id,
      ApproStr: data.ApproStr,
      Token: token()
    })
  );
  return res.data;
}

/** 批量去重保留 */
export async function disApproBatch(items) {
  const res = await request.post('/ProdInfo/disApproBatch', {
    Token: token(),
    Items: items.map((row) => ({
      ID: row.PROD_REGISTRATION_CODE,
      ApproStr: row.APPROVAL_NUMBER
    }))
  });
  return res.data;
}

export async function DeleteProd(data) {
  const res = await request.post(
    '/ProdInfo/DeleteProd',
    formdataify({
      PROD_REGISTRATION_CODE: data.code,
      Token: token()
    })
  );
  return res.data;
}

export async function getVarPic(data) {
  const res = await request.post(
    '/BtbGetVarietie/getVarPic',
    formdataify({
      PROD_REGISTRATION_CODE: data.code,
      VARIETIE_CODE: '',
      page: 1,
      size: 999999,
      Token: token()
    })
  );
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/** 新增注册证 */
export async function AddProdInfo(fields) {
  const res = await request.post(
    '/ProdInfo/AddProdInfo',
    formdataify({
      Token: token(),
      ...fields
    })
  );
  // 老系统可能直接返回 "True"/"0"/"301"/"200" 字符串
  if (typeof res.data === 'string') {
    const raw = res.data;
    if (raw === 'True' || raw === 'true' || raw === '200') {
      return { code: 200, msg: raw, raw };
    }
    if (raw === '301') {
      return { code: 301, msg: raw, raw };
    }
    if (raw === '0') {
      return { code: 0, msg: raw, raw };
    }
    return { code: 400, msg: raw, raw };
  }
  return res.data;
}

/** 启用/停用 state:0停用 1启用 */
export async function EnableProdInfo(ids, state) {
  const res = await request.post(
    '/ProdInfo/EnableProdInfo',
    formdataify({
      idJson: JSON.stringify(ids || []),
      state: String(state),
      Token: token()
    })
  );
  return res.data;
}

/** 导入注册证 Excel */
export async function ImportZCZ(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('Token', token());
  const res = await request.post(`/VarietieBasicInfo/ImportZCZ?Token=${encodeURIComponent(token())}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  return res.data;
}

/** 更新选定字段 Excel：updataField 1-23 */
export async function ImpProdUpdataField(file, updataField) {
  const fd = new FormData();
  fd.append('FILE', file);
  fd.append('Token', token());
  fd.append('updataField', String(updataField));
  fd.append('nickname', '');
  const res = await request.post('/ProdInfo/Imp_ProdUpdataField', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  });
  return res.data;
}

/** 即将过期/已过期注册证 */
export async function SearchExpireProdInfo({ month = 3, page = 1, size = 50 } = {}) {
  const res = await request.post(
    '/ProdInfo/SearchExpireProdInfo',
    formdataify({
      month: String(month),
      page: String(page),
      size: String(size),
      Token: token()
    })
  );
  return res.data;
}

/** 修改日志 */
export async function GetProductUpLog({ page = 1, size = 100, PROD_REGISTRATION_NAME = '' } = {}) {
  const res = await request.post(
    '/ProdInfo/GetProductUpLog',
    formdataify({
      page: String(page),
      size: String(size),
      PROD_REGISTRATION_NAME: PROD_REGISTRATION_NAME || '',
      Token: token()
    })
  );
  return res.data;
}

/** 带量采购 */
export async function PROD_REGISTRATION_LIMIT_BUY(fields) {
  const res = await request.post(
    '/ProdInfo/PROD_REGISTRATION_LIMIT_BUY',
    formdataify({
      Token: token(),
      ...fields
    })
  );
  return res.data;
}
