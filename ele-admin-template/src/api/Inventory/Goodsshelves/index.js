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
      (status === 500
        ? '服务器内部错误，请检查 page/size 等参数或联系管理员'
        : err.message) ||
      '请求失败';
    return Promise.reject(new Error(msg));
  }
}

function buildInStockParams(data) {
  const { page, limit, where = {}, order = {} } = data;
  const sortField = order?.sort || order?.field || 'UP_SHELF_TIME';
  const sortOrder =
    order?.order === 'asc' || order?.order === 'ascending' ? 'asc' : 'desc';
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
    ONEOFF_STERILIZATION_PACKAGING: str(
      where.oneoffSterilizationPackaging || '-1'
    ),
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

export function buildOutStockParams(data) {
  const { page, limit, where = {}, order = {} } = data;
  const sortField = order?.sort || order?.field || 'RECEIVING_TIME';
  const sortOrder =
    order?.order === 'asc' || order?.order === 'ascending' ? 'asc' : 'desc';
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
    ONEOFF_STERILIZATION_PACKAGING: str(
      where.oneoffSterilizationPackaging || '-1'
    ),
    STORAGE_TYPE: str(where.storageType || '-1'),
    IS_EMBEDDED: str(where.isEmbedded || '-1'),
    IS_SERIAL_NUMBER: str(where.isSerialNumber || '-1'),
    IS_INTERVENED: str(where.isIntervened || '-1'),
    IS_PROTECT: str(where.isProtect || '-1'),
    HIGH_OR_LOW_CLASS_TWO: str(where.highOrLowClassTwo || '-1'),
    IS_EQUIPMENT_CHANGE: str(where.change || '-1'),
    REPOSITORY_FROM: str(where.repositoryFrom || '-1'),
    ORDER_JS_TYPE: str(where.orderJsType || ''),
    CHECK_STATE: str(where.checkState || '-1')
  };
}

// 中心库入库查询
export async function GetPDAList(data) {
  return sendRequest('/InStockCheck/GetInStockDetail', buildInStockParams(data));
}

// 中心库出库查询
export async function GetPDAList2(data) {
  return sendRequest(
    '/InStockCheck/GetOutStockDetail',
    buildOutStockParams(data)
  );
}

/** 入库查询（含 303 审计） */
export async function GetInStockDetailRaw(data) {
  const res = await postForm('/InStockCheck/GetInStockDetail', {
    Token: getToken() || '',
    ...buildInStockParams(data)
  });
  return res.data;
}

/** 出库查询（含 303 审计） */
export async function GetOutStockDetailRaw(data) {
  const res = await postForm('/InStockCheck/GetOutStockDetail', {
    Token: getToken() || '',
    ...buildOutStockParams(data)
  });
  return res.data;
}

/** bdrm 进货查验记录 */
export async function GetGoodsVarReceiptDetailList(params) {
  const token = getToken() || '';
  const res = await request.get(
    '/PekingApplication/GetGoodsVarReceiptDetailList',
    {
      params: { Token: token, ...params }
    }
  );
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '查询失败');
}

/** 导出（货位）- 时间参数为 data1/data2 */
export async function ExcelGoodsCKByHW(data) {
  const base = buildOutStockParams({ ...data, page: 1, limit: 9999999 });
  const params = {
    ...base,
    data1: base.StartTime,
    data2: base.EndTime,
    page: '1',
    size: '9999999'
  };
  delete params.StartTime;
  delete params.EndTime;
  return sendRequest('/InStockCheck/ExcelGoodsCKByHW', params);
}

/** 订单流水查询 */
export async function orderFlowingSearch(data) {
  const { page, limit, where = {} } = data;
  return sendRequest('/Commons/ORDER_FLOWING_SEARCH', {
    ORDER_NUM: str(where.ORDER_NUM),
    ORDER_TIME_START: str(where.ORDER_TIME_START),
    ORDER_TIME_END: str(where.ORDER_TIME_END),
    page: normPage(page),
    size: normSize(limit)
  });
}

/** 院区列表 */
export async function getSTORAGE() {
  const token = getToken() || '';
  const res = await request.get('/Commons/getSTORAGE', {
    params: { Token: token }
  });
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '获取院区失败');
}

/** bdrm 出库复核记录 */
export async function GetDeptTwoGoodsOperateList(params) {
  const token = getToken() || '';
  const res = await request.get('/PekingApplication/GetDeptTwoGoodsOperateList', {
    params: { Token: token, ...params }
  });
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '查询失败');
}

export async function applyExportAudit(payload) {
  const res = await request.post('/ExportAudit/Apply', {
    RequestUrl: payload.requestUrl,
    DataType: payload.dataType,
    ApplyRemark: payload.applyRemark,
    KeyParamsJson: payload.keyParams || ''
  });
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '提交失败');
}

/** 上传检验报告图片（原 Frame/UploadvarietyGoodsshelves → InStockCheck/UploadProPic） */
export async function uploadProPic(batchId, file) {
  const fd = new FormData();
  fd.append('files[]', file, file.name);
  fd.append('mainid', String(batchId ?? ''));
  const res = await request.post(
    `/InStockCheck/UploadProPic?Token=${encodeURIComponent(getToken() || '')}`,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '上传失败');
}

/**
 * 按单号/批次/批号上传订单图片（原 Frame/UploadOrderPic）
 * TYPE: 1=单号 2=批次 3=生产批号
 */
export async function uploadOrderPics(payload, file) {
  const {
    orderNum = '0',
    orderType = '0',
    type = '1',
    batchId = '0',
    batch = '0'
  } = payload || {};
  const qs = [
    `Token=${encodeURIComponent(getToken() || '')}`,
    `uploadPircOderNum=${encodeURIComponent(orderNum)}`,
    `ORDER_TYPE=${encodeURIComponent(orderType)}`,
    `TYPE=${encodeURIComponent(type)}`,
    `BATCH_ID=${encodeURIComponent(batchId)}`,
    `batch=${encodeURIComponent(batch)}`
  ].join('&');
  const fd = new FormData();
  fd.append('files[]', file, file.name);
  const res = await request.post(`/InStockCheck/UploadOrderPics?${qs}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  if (okCode(res.data?.code) || res.data === 200 || res.data?.code == null) {
    // 老插件成功时可能直接返回 {msg} 或 code
    if (res.data === 301 || res.data?.code == 301) {
      throw new Error(res.data?.msg || '登录失效');
    }
    return res.data;
  }
  if (res.data == 301 || res.data?.code == 301) {
    throw new Error('登录失效，请重新登录');
  }
  throw new Error(res.data?.msg || '上传失败');
}

/** 批次检验报告图 */
export async function getBatchPicture(batchId) {
  const res = await request.get('/SystemDelivered/GetBatchPicture', {
    params: { Token: getToken() || '', batchId }
  });
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '获取图片失败');
}

/** 订单相关图列表 */
export async function getOrderPicture(params) {
  const res = await request.get('/InStockCheck/GetOrderPicture', {
    params: {
      Token: getToken() || '',
      BATCH_ID: params.batchId || '',
      orderNum: params.orderNum || '',
      TYPE: params.type || '0',
      batch: params.batch || ''
    }
  });
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '获取图片失败');
}

/** 按文件名删图 */
export async function deletePhotoByPicName(picName) {
  return sendRequest('/InStockCheck/deletePhotoByPicName', {
    picName: str(picName)
  });
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
