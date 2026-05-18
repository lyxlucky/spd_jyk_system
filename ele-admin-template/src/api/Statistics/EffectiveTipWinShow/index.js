import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem(TOKEN_STORE_NAME) || '';
}

function aesKey() {
  return sessionStorage.getItem('AesKey') || localStorage.getItem('AesKey') || '';
}

function postUrlEncoded(path, fields) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([k, v]) => {
    body.append(k, v == null ? '' : String(v));
  });
  return request.post(path, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

function unwrapPaged(res) {
  const data = unwrap(res);
  return { total: data.total || 0, result: data.result || [] };
}

/** 库存查询 GET /CentralWarehouseDept/Search */
export async function searchCentralWarehouse(params) {
  const res = await request.get('/CentralWarehouseDept/Search', {
    params: { Token: token(), ...params }
  });
  return unwrapPaged(res);
}

export function buildInventoryWhere(extra = {}) {
  return {
    varietie: '',
    supplier: '',
    batch: '',
    sourceFrom: '',
    manuEntName: '',
    APPROVAL_NUMBER: '',
    Up_Shelf_State: '',
    conTime: '',
    is_hptx: '',
    validDateFrom: '',
    validDateTo: '',
    field: '',
    order: '',
    isCharge: -1,
    highOrLowClass: -1,
    isBidding: -1,
    specialPurchase: -1,
    oneoffSterilizationPackaging: -1,
    storageType: -1,
    isEmbedded: -1,
    isSerialNumber: -1,
    isProtect: -1,
    classificName: '',
    isIntervened: -1,
    highOrLowClassTwo: '',
    Position: '',
    STORAGE_ID: '',
    ...extra
  };
}

export function inventoryValidDateTo180Days() {
  const d = new Date();
  d.setDate(d.getDate() + 180);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function stockVarContValTip({ page, size, days = 15 }) {
  const res = await request.get('/ANewStockUp/StockVarContValTip', {
    params: { Token: token(), page, size, days }
  });
  return unwrapPaged(res);
}

export async function searchProdAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchProdAuthExpired', {
    Token: token(),
    page: params.page || 1,
    size: params.size || 10,
    SearchType: params.SearchType ?? '0',
    monty: params.monty ?? '1',
    field: params.field || '',
    order: params.order || ''
  });
  return unwrapPaged(res);
}

export async function searchContractAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchContractAuthExpired', {
    Token: token(),
    page: params.page || 1,
    size: params.size || 10,
    contractAuthenum: params.contractAuthenum ?? '1',
    monty: params.monty ?? '0',
    field: params.field || '',
    order: params.order || ''
  });
  return unwrapPaged(res);
}

export async function searchContractVarietieAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchContractVarietieAuthExpired', {
    Token: token(),
    page: params.page || 1,
    size: params.size || 10,
    monty: params.monty ?? '1',
    field: params.field || '',
    order: params.order || '',
    authDateStart: params.authDateStart || '',
    authDateEnd: params.authDateEnd || ''
  });
  return unwrapPaged(res);
}

export async function searchSupplierAuthExpired(params) {
  const res = await postUrlEncoded('/AuthExpired/SearchSupplierAuthExpired', {
    Token: token(),
    page: params.page || 1,
    size: params.size || 9999,
    supplierEnum: params.supplierEnum ?? '0',
    monty: params.monty ?? '0',
    field: params.field || '',
    order: params.order || ''
  });
  return unwrapPaged(res);
}

export async function deactivateContractsAll(listJson) {
  const res = await postUrlEncoded('/AuthExpired/DeactivateContractsAll', {
    Token: token(),
    List: listJson
  });
  return unwrap(res);
}

export async function getVarietyReports({ page, size, pramsObj }) {
  const pramsStr = Encrypt(JSON.stringify({ ...pramsObj, Token: token() }));
  const res = await postUrlEncoded('/VarietyReport/GetVarietyReports', {
    page,
    size,
    prams: pramsStr,
    AesKey: aesKey()
  });
  return unwrapPaged(res);
}

export function buildBlsjPrams() {
  return {
    PRODUCT_NAME: '',
    REGISTRATION_NUMBER: '',
    REPORTER: '',
    USE_PLACE: '',
    Var_UseTimeStart: '-3',
    Var_UseTimeEnd: '',
    IS_HANDLE: ''
  };
}

export async function getTjVarInfo({ page, size }) {
  const res = await postUrlEncoded('/ProdInfo/get_TJVarINFO', {
    Token: token(),
    page: page || 1,
    size: size || 9999
  });
  return unwrapPaged(res);
}

export async function sendVarStzy(json) {
  const res = await postUrlEncoded('/Abdzczh/AddVarStzy', { Token: token(), json });
  return unwrap(res);
}

export async function sendVarCsyy(json) {
  const res = await postUrlEncoded('/Abdzczh/CSYYVAR_H006', { Token: token(), json });
  return unwrap(res);
}

export async function sendVarStse(json, men) {
  const res = await postUrlEncoded('/AAxtzx_his/SendStseVarHis', {
    Token: token(),
    json,
    men: men || ''
  });
  return unwrap(res);
}

export async function sendVarStzl(json) {
  const res = await postUrlEncoded('/AAxtzx_his/SendVarPrice_Stzl', { Token: token(), json });
  return unwrap(res);
}

export async function searchVarietieContract(varietieCode, contractName = '') {
  const pramsStr = Encrypt(
    JSON.stringify({
      varietie: varietieCode,
      Token: token(),
      specification: '',
      contract: contractName,
      supplier: ''
    })
  );
  const res = await postUrlEncoded('/VarietiesQuery/SearchVarietieContract', {
    prams: pramsStr,
    AesKey: aesKey(),
    page: 1,
    size: 9999
  });
  return unwrapPaged(res);
}
