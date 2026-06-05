import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function buildQueryFields(where = {}) {
  return {
    VARNAME: where.varName ?? '',
    VARGGXH: where.varGgxh ?? '',
    SUPPLIER: where.supplier ?? '',
    REG: where.reg ?? '',
    MEA: where.mea ?? '',
    LY: where.ly ?? '',
    ISDM: where.isDm ?? '',
    ISSEND: where.isSend ?? '',
    isPrice: where.isPrice ?? '',
    isEnbale: where.isEnbale ?? '',
    isHtSx: where.isHtSx ?? '',
    isMark: where.isMark ?? '',
    ISDMYZ: where.isDmYz ?? ''
  };
}

function unwrapBody(res) {
  const body = res.data;
  if (body?.code == 301 || body === 301) {
    throw new Error(body?.msg || '登录失效，请重新登录');
  }
  return body;
}

function unwrapList(res) {
  const body = unwrapBody(res);
  if (body?.code == 200 || body?.code === '200') {
    return {
      total: body.total ?? 0,
      list: body.result || []
    };
  }
  throw new Error(body?.msg || '操作失败');
}

/** 解析导出类接口：200 成功 / 303 需审计 */
export function parseExportResponse(res) {
  const body = unwrapBody(res);
  if (body?.code == 303 || body?.code === '303') {
    return {
      needAudit: true,
      requestUrl: body.requesturl || body.requestUrl || '',
      dataType: body.datatype || body.dataType || '',
      keyParams: body.keyparams || body.keyParams || ''
    };
  }
  if (body?.code == 200 || body?.code === '200') {
    return { needAudit: false, ...body };
  }
  throw new Error(body?.msg || '操作失败');
}

/** 阳光本院目录列表 */
export async function getYgBaseInfo(where, page = 1, size = 20) {
  const res = await request.post(
    '/Importprite/getYgBaseInfo',
    formdataify({
      Token: token(),
      ...buildQueryFields(where),
      page,
      size
    })
  );
  return unwrapList(res);
}

/** 快速导出（后端生成 Excel） */
export async function exportYgBaseInfoFast(where) {
  const res = await request.post(
    '/Importprite/ExportYgBaseInfoFast',
    formdataify({
      Token: token(),
      ...buildQueryFields(where)
    }),
    { timeout: 600000 }
  );
  return parseExportResponse(res);
}

/** 分页导出用：单页大数据 */
export async function getYgBaseInfoExportPage(where, page) {
  const res = await request.post(
    '/Importprite/getYgBaseInfo',
    formdataify({
      Token: token(),
      ...buildQueryFields(where),
      page,
      size: 100000
    })
  );
  return parseExportResponse(res);
}

/** 修改备注 */
export async function updateYgSubcodeMark(subcodeIds, mark) {
  const res = await request.post(
    '/Importprite/UpdateYG_SUBCODE_BZ',
    formdataify({
      Token: token(),
      SUBCODEID: subcodeIds,
      YG_SUBCODEMark: mark ?? ''
    })
  );
  const body = unwrapBody(res);
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '操作失败');
}

/** 同步来源及分类 */
export async function tbSourceThree() {
  const res = await request.post('/Importprite/tbSourceThree', formdataify({ Token: token() }));
  const body = unwrapBody(res);
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '操作失败');
}

/** 单独获取产品 */
export async function fetchYgProduct(ygCode) {
  if (HOME_HP === 'zq') {
    const res = await request.get('/Commons/GetYgVarInfo', {
      params: { Token: token(), ygCode: ygCode ?? '' }
    });
    return { code: 200, msg: res.data };
  }
  const res = await request.get('/AZqVar/hospitalProcurecatalog', {
    params: {
      Token: token(),
      ygCode: ygCode ?? '',
      currentPageNumber: 1,
      isGetSup: 1
    }
  });
  const body = res.data || {};
  if (body.code == 200 || body.code === '200') {
    return body;
  }
  throw new Error(body.msg || '获取失败');
}

/** 获取全部产品 */
export async function fetchAllYgProducts() {
  if (HOME_HP === 'zq') {
    const res = await request.get('/Commons/GetYgVarInfo', {
      params: { Token: token(), ygCode: '' }
    });
    return { code: 200, msg: res.data };
  }
  const res = await request.get('/AZqVar/getYgWithHave', {
    params: { Token: token(), type: 1 }
  });
  const body = res.data || {};
  if (body.code == 200 || body.code === '200') {
    return body;
  }
  throw new Error(body.msg || '获取失败');
}

/** 导出审计申请 */
export async function applyExportAudit(payload) {
  const res = await request.post('/ExportAudit/Apply', {
    Token: token(),
    RequestUrl: payload.requestUrl,
    DataType: payload.dataType,
    ApplyRemark: payload.applyRemark,
    KeyParamsJson: payload.keyParams || ''
  });
  const body = res.data;
  if (body?.code == 200 || body?.code === '200') {
    return body;
  }
  throw new Error(body?.msg || '提交失败');
}
