import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}

/** 收货 UDI 列表（原 Frame/CentreBankWatchUDI） */
export async function getShUdiData(params) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/GetSH_UDIData',
    formdataify({
      Token: token(),
      SERIAL_NUMBER: params.serialNumber || '',
      CREATE_MAN: params.createMan || '',
      BATCH_ID: params.batchId || '',
      page: params.page || 1,
      size: params.size || 100
    })
  );
  return unwrap(res);
}

/** 删除 UDI（ID 逗号分隔） */
export async function delShUdiData(ids) {
  const res = await request.post(
    '/CentralWarehouseBagMakingMgmt/DelSH_UDIData',
    formdataify({
      Token: token(),
      ID: ids
    })
  );
  return unwrap(res);
}
