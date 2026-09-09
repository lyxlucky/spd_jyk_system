import request from '@/utils/request';
import { HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import {
  assertFoshanHospital,
  buildCenterInventoryPayload,
  buildDepartmentInventoryPayload,
  buildHighValueUsagePayload,
  buildMaterialCatalogPayload
} from './utils';

const LONG_TIMEOUT = { timeout: 600000 };

function token() {
  return (
    sessionStorage.getItem(TOKEN_STORE_NAME) ||
    localStorage.getItem(TOKEN_STORE_NAME) ||
    ''
  );
}

function unwrap(res) {
  const body = res?.data;
  if (body?.code == 301 || body === 301)
    throw new Error(body?.msg || '登录失效，请重新登录');
  if (body?.code == 200 || body?.code === '200' || body?.success === true)
    return body;
  throw new Error(body?.msg || body?.message || '佛山接口调用失败');
}

function post(path, payload) {
  assertFoshanHospital(HOME_HP);
  return request
    .post(path, { Token: token(), ...payload }, LONG_TIMEOUT)
    .then(unwrap);
}

export function pushMaterialCatalog(rows, changeType = 'U') {
  return post(
    '/FoshanSpd/PushMaterialCatalog',
    buildMaterialCatalogPayload(rows, changeType)
  );
}

export function retryMaterialCatalog(rows, changeType = 'U') {
  return post(
    '/FoshanSpd/RetryMaterialCatalog',
    buildMaterialCatalogPayload(rows, changeType)
  );
}

export function pushCenterInventory(rows) {
  return post('/FoshanSpd/PushInventory', buildCenterInventoryPayload(rows));
}

export function retryCenterInventory(rows) {
  return post('/FoshanSpd/RetryInventory', buildCenterInventoryPayload(rows));
}

export function pushDepartmentInventory(rows) {
  return post(
    '/FoshanSpd/PushInventory',
    buildDepartmentInventoryPayload(rows)
  );
}

export function retryDepartmentInventory(rows) {
  return post(
    '/FoshanSpd/RetryInventory',
    buildDepartmentInventoryPayload(rows)
  );
}

export function pushHighValueUsage(receipt, details) {
  return post(
    '/FoshanSpd/PushHighValueUsage',
    buildHighValueUsagePayload(receipt, details)
  );
}

export function retryHighValueUsage(receipt, details) {
  return post(
    '/FoshanSpd/RetryHighValueUsage',
    buildHighValueUsagePayload(receipt, details)
  );
}
