import request from '@/utils/request';
import { getToken } from '@/utils/token-util';
import { TOKEN_STORE_NAME } from '@/config/setting';

function okCode(c) {
  return c === 200 || c === '200';
}

function str(val) {
  return val == null ? '' : String(val);
}

/** 后端 Convert.ToInt32(Form["page"/"size"])，必须传合法数字字符串 */
function normPage(page) {
  const n = parseInt(page, 10);
  return String(n > 0 ? n : 1);
}

function normSize(size) {
  const n = parseInt(size, 10);
  return String(n > 0 ? n : 10);
}

/**
 * 与旧 layui $.post 一致：application/x-www-form-urlencoded（非 multipart）
 * 避免 Form 集合读不到字段导致 page/size 解析失败引发 500
 */
function postForm(url, params) {
  const body = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const val = params[key];
    body.append(key, val == null || val === undefined ? '' : String(val));
  });
  return request.post(url, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

async function sendRequest(url, params) {
  try {
    const res = await postForm(url, { Token: getToken() || '', ...params });
    if (okCode(res.data?.code)) {
      return res.data;
    }
    const msg = res.data?.msg || res.data?.Message || '请求失败';
    return Promise.reject(new Error(msg));
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    const msg =
      (typeof data === 'string' && data) ||
      data?.msg ||
      data?.Message ||
      (status === 500 ? '服务器内部错误，请检查 page/size 等参数或联系管理员' : err.message) ||
      '请求失败';
    return Promise.reject(new Error(msg));
  }
}

function buildInStockParams(data) {
  const { page, limit, where = {}, order = {} } = data;
  const sortField = order?.sort || order?.field || 'UP_SHELF_TIME';
  const sortOrder = order?.order === 'asc' || order?.order === 'ascending' ? 'asc' : 'desc';
  return {
    page: normPage(page),
    size: normSize(limit),
    SearchVarietie: str(where.searchinplt1),
    Supplier: str(where.searchinplt2),
    Batch: str(where.searchinplt3),
    InType: str(where.searchinplt4),
    BUSINESS_BILL: str(where.searchinplt5),
    StartTime: str(where.start_time),
    EndTime: str(where.end_time),
    Specifications: str(where.cwj_searchinplt6),
    Production: str(where.searchinplt7),
    field: sortField,
    order: sortOrder,
    IS_CHARGE: str(where.isCharge || '-1'),
    HIGH_OR_LOW_CLASS: str(where.highOrLowClass || '-1'),
    IS_BIDDING: str(where.isBidding || '-1'),
    SPECIAL_PURCHASE: str(where.specialPurchase || '-1'),
    ONEOFF_STERILIZATION_PACKAGING: str(where.oneoffSterilizationPackaging || '-1'),
    STORAGE_TYPE: str(where.storageType || '-1'),
    IS_EMBEDDED: str(where.isEmbedded || '-1'),
    IS_SERIAL_NUMBER: str(where.isSerialNumber || '-1'),
    IS_INTERVENED: str(where.isIntervened || '-1'),
    IS_PROTECT: str(where.isProtect || '-1'),
    HIGH_OR_LOW_CLASS_TWO: str(where.highOrLowClassTwo || '-1'),
    IS_EQUIPMENT_CHANGE: str(where.change || '-1'),
    PREPARE_GOODS_PLAN_NUMBER: str(where.cwj_hinpPREPARE_GOODS_PLAN_NUMBER),
    REPOSITORY_FROM: str(where.repositoryFrom || '-1'),
    ORDER_JS_TYPE: str(where.orderJsType || '')
  };
}

function buildOutStockParams(data) {
  const { page, limit, where = {}, order = {} } = data;
  const sortField = order?.sort || order?.field || 'RECEIVING_TIME';
  const sortOrder = order?.order === 'asc' || order?.order === 'ascending' ? 'asc' : 'desc';
  return {
    page: normPage(page),
    size: normSize(limit),
    SearchVarietie: str(where.xsearchinplt1),
    Supplier: str(where.xsearchinplt2),
    Batch: str(where.xsearchinplt3),
    OutType: str(where.xsearchinplt4),
    BUSINESS_BILL: str(where.xsearchinplt5),
    Specifications: '',
    StartTime: str(where.start_time),
    EndTime: str(where.end_time),
    Production: str(where.xsearchinplt6),
    field: sortField,
    order: sortOrder,
    IS_CHARGE: str(where.isCharge || '-1'),
    HIGH_OR_LOW_CLASS: str(where.highOrLowClass || '-1'),
    IS_BIDDING: str(where.isBidding || '-1'),
    SPECIAL_PURCHASE: str(where.specialPurchase || '-1'),
    ONEOFF_STERILIZATION_PACKAGING: str(where.oneoffSterilizationPackaging || '-1'),
    STORAGE_TYPE: str(where.storageType || '-1'),
    IS_EMBEDDED: str(where.isEmbedded || '-1'),
    IS_SERIAL_NUMBER: str(where.isSerialNumber || '-1'),
    IS_INTERVENED: str(where.isIntervened || '-1'),
    IS_PROTECT: str(where.isProtect || '-1'),
    HIGH_OR_LOW_CLASS_TWO: str(where.highOrLowClassTwo || '-1'),
    IS_EQUIPMENT_CHANGE: str(where.change || '-1')
  };
}

// 中心库入库查询
export async function GetPDAList(data) {
  return sendRequest('/InStockCheck/GetInStockDetail', buildInStockParams(data));
}

// 中心库出库查询
export async function GetPDAList2(data) {
  return sendRequest('/InStockCheck/GetOutStockDetail', buildOutStockParams(data));
}

// 获取详情数据
export async function getSourceDetail(data) {
  const { Storage_Id, Def_No_Pkg_Code } = data;
  const token = sessionStorage.getItem(TOKEN_STORE_NAME) || getToken();
  const res = await request.get('/GS1/Trace', {
    params: {
      Token: token,
      storageId: Storage_Id,
      defNoPkgCode: Def_No_Pkg_Code
    }
  });
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '请求失败');
}
