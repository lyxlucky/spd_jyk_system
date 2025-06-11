import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { toDateString } from 'ele-admin';
import moment from 'moment';

export async function getBdSzYyHisSs(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY == 'ALL' ? '' : params.where.MZZY || '-1',
    SSFJ: params.where.SSFJ || '',
    start_time: params.where?.dateRange ? params.where?.dateRange[0] : '',
    end_time: params.where?.dateRange ? params.where?.dateRange[1] : '',
    SSRQ_start_time: params.where?.SSRQDateRange ? moment(params.where?.SSRQDateRange).format('YYYY-MM-DD') : params.where?.SSRQStartTime || '',
    SSRQ_end_time: params.where?.SSRQDateRange ? moment(params.where?.SSRQDateRange).format('YYYY-MM-DD') : '',
    condition: params.where.condition || '',
    page: params.page || 1,
    size: params.limit || 10,
    sort: params.order.sort || '',
    order: params.order.order || ''
  };

  let res = await request.post('/DeptPlanTransfer/getBdSzYyHisSs', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function getBdszgsjMainDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    MZZY: params.where.MZZY || '',
    page: params.page || 1,
    size: params.limit || 10
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszgsjMainDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function getBdszZgsjMainPsDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    BDSZ_ZQSJ_ID: params.where.BDSZ_ZQSJ_ID || '-1',
    SSBH: params.where.SSBH || '',
    VARIETIE_CODE_NEW: params.where.VARIETIE_CODE_NEW || '',
    MZZY: params.where.MZZY || '1',
    page: params.page || 1,
    size: params.limit || 10
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZgsjMainPsDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function updateBdszZqsjMainPsDelUse(params) {
  params[0].Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  let res = await request.post(
    '/DeptPlanTransfer/updateBdszZqsjMainPsDelUse',
    params
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//获取耗材使用明细
export async function GetBdszZqsjMainUseDel(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    VARIETIE_CODE_NEW: params.where.VARIETIE_CODE_NEW || '',
    page: params.page || 1,
    SSBH: params.where.SSBH || '',
    size: params.limit || 10
  };
  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZqsjMainUseDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//UDI扫码添加
export async function addBdszZqsjMainPsDelUse(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: params.ID || '',
    UDI: params.UDI || '',
    USE_COUNT: params.USE_COUNT,
    BDSZ_ZQSJ_PS_ID: params.BDSZ_ZQSJ_PS_ID || '',
    page: params.page || 1,
    size: params.limit || 10
  };
  let res = await request.post(
    '/DeptPlanTransfer/addBdszZqsjMainPsDelUse',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//护士审批
export async function BdSsApprove(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    qdid: params.qdid
  };
  let res = await request.post('/Abdzczh/BdSsApprove', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

//删除确认明细
export async function deleteUsedQty(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ID: params.ID
  };
  let res = await request.post('/DeptPlanTransfer/deleteUsedQty', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 扫码交接
export async function commitBdszSsyyInfo(data) {
  const formatData = {
    ...data,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };

  const reFormatData = formdataify(formatData);

  let res = await request.post('/DeptConsume/commitBdszSsyyInfo', reFormatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 勾选确认数据源
export async function GetBdszZqsjMainNoUseDel(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.limit || 10,
    SSBH: data.where.SSBH || '',
    VARIETIE_CODE_NEW: data.where.VARIETIE_CODE_NEW || ''
  };

  let res = await request.post(
    '/DeptPlanTransfer/GetBdszZqsjMainNoUseDel',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

export async function addBdszZqsjMainPsDelUseV2(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    data: data.json
  };

  let res = await request.post(
    '/DeptPlanTransfer/addBdszZqsjMainPsDelUseV2',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 术中交接
export async function addBdSzHisInSurgery(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.SSBH,
    REMARK: data.REMARK
  };

  let res = await request.post('/Commons/BdSzHisInSurgery', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 获取交接记录
export async function ListBdSzHisInSurgery(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.where?.SSBH || '',
    page: data.page || 1,
    size: data.size || 10
  };

  let res = await request.post('/Commons/ListBdSzHisInSurgery', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 新增使用
export async function addNewBdszZq(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.SSBH || '', // 手术编号
    SSFJ: data.SSFJ || '', // 手术房间
    SSTH: data.SSTH || '', // 手术台号
    ZYHM: data.ZYHM || '', // 住院号码
    BRXM: data.BRXM || '', // 病人姓名
    BRXB: data.BRXB || '', // 病人性别
    SSMC: data.SSMC || '', // 手术名称
    SSRQ: data.SSRQ || '', // 手术日期
    KSMC: data.KSMC || '', // 科室名称
    data: data.data || [] // 数据列表
  };

  let res = await request.post('/DeptPlanTransfer/addNewBdszZq', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 扫码查询信息
export async function getBdszScanInfo(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.SSBH || '', // 手术编号
    UDI: data.UDI || '' // 条码
  };

  let res = await request.post('/DeptPlanTransfer/getBdszScanInfo', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 北大深圳取消预约
export async function cancelBdszApprove(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSBH: data.SSBH
  };

  let res = await request.post(
    '/DeptPlanTransfer/cancelBdszApprove',
    formatData
  );

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}

// 获取手术房间列表
export async function getBdszZqsjSsfjList(params) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    SSFJ: params.SSFJ || ''
  };

  let res = await request.post('/DeptPlanTransfer/GetBdszZqsjSsfjList', formatData);

  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(res.data);
}
