import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function withToken(data) {
  return formdataify({
    ...(data || {}),
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  });
}

function unwrap(res) {
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function queryWarehouseArea(data) {
  const res = await request.post('/WarehouseAreaManage/QueryWarehouseArea', withToken(data));
  return unwrap(res);
}

export async function getWarehouseAreaCode(areaType) {
  const res = await request.post('/WarehouseAreaManage/GetWarehouseAreaCode', withToken({ AREA_TYPE: areaType }));
  return unwrap(res);
}

export async function saveWarehouseArea(data) {
  const res = await request.post('/WarehouseAreaManage/SaveWarehouseArea', withToken(data));
  return unwrap(res);
}

export async function enableWarehouseArea(data) {
  const res = await request.post('/WarehouseAreaManage/EnableWarehouseArea', withToken(data));
  return unwrap(res);
}

export async function queryHisDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/QueryHisDeptRel', withToken(data));
  return unwrap(res);
}

export async function saveHisDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/SaveHisDeptRel', withToken(data));
  return unwrap(res);
}

export async function deleteHisDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/DeleteHisDeptRel', withToken(data));
  return unwrap(res);
}

export async function querySpdDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/QuerySpdDeptRel', withToken(data));
  return unwrap(res);
}

export async function saveSpdDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/SaveSpdDeptRel', withToken(data));
  return unwrap(res);
}

export async function deleteSpdDeptRel(data) {
  const res = await request.post('/WarehouseAreaManage/DeleteSpdDeptRel', withToken(data));
  return unwrap(res);
}

export async function queryHisDeptOptions(keyword) {
  const res = await request.post('/WarehouseAreaManage/QueryHisDeptOptions', withToken({ keyword }));
  return unwrap(res);
}

export async function querySpdDeptOptions(keyword) {
  const res = await request.post('/WarehouseAreaManage/QuerySpdDeptOptions', withToken({ keyword }));
  return unwrap(res);
}

export async function queryWarehouseAreaOptions(keyword) {
  const res = await request.post('/WarehouseAreaManage/QueryWarehouseAreaOptions', withToken({ keyword }));
  return unwrap(res);
}
