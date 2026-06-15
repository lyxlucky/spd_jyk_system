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

function buildListParams(data) {
  const where = data.where || {};
  const order = data.order || {};
  return {
    Token: token(),
    page: data.page || 1,
    size: data.limit || 30,
    keyword: where.keyword ?? '',
    enable: where.enable ?? '1',
    state: where.state ?? '',
    field: order.sort ?? '',
    order:
      order.order === 'descending' ? 'desc' : order.order === 'ascending' ? 'asc' : order.order ?? ''
  };
}

/** 供应商列表（旧页 initSuppTable → GET /Supplier/GetList） */
export async function getSupplierList(data) {
  const res = await request.get('/Supplier/GetList', {
    params: buildListParams(data)
  });
  const body = unwrap(res);
  return {
    total: body.total ?? 0,
    result: body.result || []
  };
}

/** 供应商详情含证照图片（旧页 getSupplierDetail → GetSupplier） */
export async function getSupplierDetail(supplierCode) {
  const res = await request.get('/Supplier/GetSupplier', {
    params: { Token: token(), Supplier_Code: supplierCode }
  });
  return unwrap(res);
}

/** 导出全部供应商 Excel，返回文件名 */
export async function exportAllSuppliers() {
  const res = await request.post(
    '/Supplier/ExportAllSuppliers',
    formdataify({ Token: token() })
  );
  return unwrap(res);
}

/** 更新财务属性（旧页 UpdateSupCW） */
export async function updateSupCW(payload) {
  const res = await request.post(
    '/Supplier/UpdateSupCW',
    formdataify({
      Token: token(),
      Supplier_Code: String(payload.Supplier_Code ?? ''),
      CW_CLASS_ONE: payload.CW_CLASS_ONE ?? '',
      CW_CLASS_TWO: payload.CW_CLASS_TWO ?? '',
      CW_CLASS_THREE: payload.CW_CLASS_THREE ?? ''
    })
  );
  return unwrap(res);
}

/** 禁止/取消禁止配送（旧页 STOP_SEND → upSTOP_SEND，ID=Supplier_Code） */
export async function upStopSend(supplierCode, stopSend) {
  const res = await request.post(
    '/Supplier/upSTOP_SEND',
    formdataify({
      Token: token(),
      ID: String(supplierCode ?? ''),
      STOP_SEND: String(stopSend ?? '0')
    })
  );
  return unwrap(res);
}

/** 上传送货章（旧页 UpGZPicDivCommit1 → UpSupOffPic，字段 id） */
export async function upSupOffPic(supplierCode, file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('id', String(supplierCode ?? ''));
  fd.append('FILE', file);
  const res = await request.post('/Supplier/UpSupOffPic', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** 上传购销合同有效期（旧页 UpGXConPicDivCommit1 → UpSupGXConOffPic） */
export async function upSupGxConOffPic(supplierCode, gxDate, file) {
  const fd = new FormData();
  fd.append('Token', token());
  fd.append('SUPPLIER_CODE', String(supplierCode ?? ''));
  fd.append('GX_VALIDITY_PERIOD', gxDate ?? '');
  fd.append('FILE', file);
  const res = await request.post('/Supplier/UpSupGXConOffPic', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return unwrap(res);
}

/** 华南推送供应商到 OES（旧页 SendSzhnSupHis → Abdzczh/SendSupToOes） */
export async function sendSupToOes(supplierCode, men) {
  const res = await request.post(
    '/Abdzczh/SendSupToOes',
    formdataify({
      Token: token(),
      Supplier_Code: String(supplierCode ?? ''),
      men: men ?? ''
    })
  );
  return unwrap(res);
}
