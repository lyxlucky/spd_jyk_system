import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  const data = res.data;
  if (data?.code == 301 || data?.code === '301') {
    throw new Error(data.msg || '登录失效，请重新登录');
  }
  if (data?.code == 200 || data?.code === '200') {
    return data;
  }
  throw new Error(data?.msg || '操作失败');
}

/** 当前月份 yyyy-MM（与旧系统 laydate 默认值一致） */
export function currentMonth() {
  const now = new Date();
  const month = now.getMonth() + 1;
  return `${now.getFullYear()}-${month < 10 ? `0${month}` : month}`;
}

/** 规范为 yyyy-MM，后端 DateTime.Parse / Oracle to_date 均要求此格式 */
function normalizeMonth(value, fallback) {
  if (value == null || value === '') {
    return fallback || currentMonth();
  }
  const str = String(value).trim();
  // el-date-picker month 模式：yyyy-MM
  if (/^\d{4}-\d{2}$/.test(str)) {
    return str;
  }
  // 兼容误传 yyyy-MM-dd
  const match = str.match(/^(\d{4}-\d{2})/);
  if (match) {
    return match[1];
  }
  return fallback || currentMonth();
}

function buildSearchParams(where = {}) {
  const month = currentMonth();
  const consumeTime = normalizeMonth(where.consumeTime, month);
  const consumeTime2 = normalizeMonth(where.consumeTime2, consumeTime);
  const bl = where.bl != null && where.bl !== '' ? String(where.bl) : '20';

  return {
    APPROVAL_NUMBER: where.approvalNumber ?? '',
    PROD_REGISTRATION_NAME: where.prodRegistrationName ?? '',
    MANUFACTURING_ENT_NAME: where.manufacturingEntName ?? '',
    CONSUME_TIME: consumeTime,
    CONSUME_TIME2: consumeTime2,
    BL: bl
  };
}

/** 主表 — POST /ProdInfo/GetRegistrationWarn */
export async function getRegistrationWarn(where, page, size) {
  const res = await request.post(
    '/ProdInfo/GetRegistrationWarn',
    formdataify({
      Token: token(),
      ...buildSearchParams(where),
      page: page ?? 1,
      size: size ?? 30
    })
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    list: data.result || []
  };
}

/** 主表全量（导出） */
export async function getRegistrationWarnAll(where) {
  return getRegistrationWarn(where, 1, 999999);
}

/** 明细 — POST /ProdInfo/GetRegistrationWarnDetail */
export async function getRegistrationWarnDetail(row, where, page, size) {
  const params = buildSearchParams(where);
  const res = await request.post(
    '/ProdInfo/GetRegistrationWarnDetail',
    formdataify({
      Token: token(),
      APPROVAL_NUMBER: row?.APPROVAL_NUMBER ?? '',
      PROD_REGISTRATION_CODE: row?.PROD_REGISTRATION_CODE ?? '',
      CONSUME_TIME: params.CONSUME_TIME,
      CONSUME_TIME2: params.CONSUME_TIME2,
      page: page ?? 1,
      size: size ?? 50
    })
  );
  const data = unwrap(res);
  return {
    total: data.total ?? 0,
    list: data.result || []
  };
}
