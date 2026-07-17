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

/** 解密/归一化非标准响应（Insert/Update/Upload 等可能返回纯字符串或布尔） */
function normalizeRaw(res) {
  const isEncrypt = store.state.user.isEncrypt;
  let data = res?.data;
  if (isEncrypt && data?.devData) {
    data = JSON.parse(Decrypt(data.devData));
  }
  return data;
}

function assertNotLoginOut(data) {
  if (data === 301 || data === '301' || data?.code == 301 || data?.code === '301') {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

/** 新增供应商（旧页 InsertSupplier，成功返回字符串 "200"） */
export async function insertSupplier(payload) {
  const res = await request.post(
    '/Supplier/InsertSupplier',
    formdataify({ Token: token(), ...payload })
  );
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data === '200' || data === 200) return { ok: true, msg: '添加成功' };
  throw new Error(typeof data === 'string' ? data : data?.msg || '添加失败');
}

/** 更新供应商（旧页 UpdateSupplier，成功 true；信用代码空返回 false） */
export async function updateSupplier(payload) {
  const res = await request.post(
    '/Supplier/UpdateSupplier',
    formdataify({ Token: token(), ...payload })
  );
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data === '企业电话和业务员电话必填其一') {
    throw new Error(data);
  }
  if (data === false || data === 'false') {
    throw new Error('社会统一信用代码不能为空');
  }
  if (data === true || data === 'true' || data?.code == 200 || data?.code === '200') {
    return { ok: true, msg: '修改成功' };
  }
  throw new Error(typeof data === 'string' ? data : data?.msg || '修改失败');
}

/** 删除供应商（旧页 DeleteSupplier；关联合同返回 code=201） */
export async function deleteSupplier(supplierCode) {
  const res = await request.post(
    '/Supplier/DeleteSupplier',
    formdataify({ Token: token(), Supplier_Code: String(supplierCode ?? '') })
  );
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data?.code == 200 || data?.code === '200') return data;
  throw new Error(data?.msg || '删除失败');
}

/** 全部监管类别（经营范围左侧） */
export async function getRegulatoryAll() {
  const res = await request.get('/Supplier/GetRegulatoryAll', {
    params: { Token: token() }
  });
  return unwrap(res);
}

/** 供应商已授权经营范围（右侧） */
export async function getScopeList(supplierCode) {
  const res = await request.get('/Supplier/GetScopeList', {
    params: { Token: token(), Supplier_Code: String(supplierCode ?? '') }
  });
  return unwrap(res);
}

/** 保存经营范围（全量覆盖：先删后写） */
export async function updateScope(supplierCode, idList) {
  const res = await request.post(
    '/Supplier/UpdateScope',
    formdataify({
      Token: token(),
      Supplier_Code: String(supplierCode ?? ''),
      array: JSON.stringify(idList || [])
    })
  );
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data === true || data === 'true' || data?.code == 200 || data?.code === '200') {
    return { ok: true };
  }
  throw new Error(typeof data === 'string' ? data : data?.msg || '保存经营范围失败');
}

/** 上传证照图片（旧页 UploadSuppPic，jpg/png；成功返回 "1"） */
export async function uploadSuppPic(supplierCode, file) {
  const fd = new FormData();
  fd.append('mainid', String(supplierCode ?? ''));
  fd.append('FILE', file);
  const res = await request.post(`/Supplier/UploadSuppPic?Token=${encodeURIComponent(token())}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data === '1' || data === 1) return { ok: true };
  throw new Error('上传失败，仅支持 jpg/png');
}

/** 删除单张证照（旧页 DeleteOneSuppPic） */
export async function deleteOneSuppPic(supplierCode, picName) {
  const res = await request.post(
    `/Supplier/DeleteOneSuppPic?supp_id=${encodeURIComponent(supplierCode)}&supppic_name=${encodeURIComponent(
      picName
    )}&Token=${encodeURIComponent(token())}`
  );
  const data = normalizeRaw(res);
  assertNotLoginOut(data);
  if (data === '1' || data === 1) return { ok: true };
  throw new Error('删除失败');
}
