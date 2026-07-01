import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function okCode(c) {
  return c === 200 || c === '200';
}

function check301(data) {
  if (data?.code == 301 || data === 301) {
    throw new Error(data?.msg || '登录失效，请重新登录');
  }
}

function parseMonthRange(where) {
  let monthFmt = '';
  let monthFmt2 = '';
  if (where.KSConsume_cb && where.KSConsume_monthRange?.length === 2) {
    const fmt = (d) => {
      if (!d) return '';
      if (typeof d === 'string') return d.slice(0, 7);
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    };
    monthFmt = fmt(where.KSConsume_monthRange[0]);
    monthFmt2 = fmt(where.KSConsume_monthRange[1]);
  }
  return { monthFmt, monthFmt2 };
}

function parseSort(order = {}) {
  const field = order.sort || order.field || '';
  const o = order.order;
  let ord = '';
  if (o === 'asc' || o === 'ascending') ord = 'asc';
  else if (o === 'desc' || o === 'descending') ord = 'desc';
  return { field, order: ord };
}

/** 与旧 KSConsumeQuery.cshtml / DeptConsume.Search 参数一致 */
export function buildSearchParams(where = {}, page = 1, size = 20, sort = {}) {
  const { field, order } = parseSort(sort);
  const { monthFmt, monthFmt2 } = parseMonthRange(where);
  const dayClearing =
    where.KSConsumeBD_dayClearingDate == null
      ? ''
      : typeof where.KSConsumeBD_dayClearingDate === 'string'
        ? where.KSConsumeBD_dayClearingDate
        : '';

  return {
    page,
    size,
    varietie: where.KSConsume_search1 || '',
    supplier: where.KSConsume_search2 || '',
    batch: where.KSConsume_search3 || '',
    sfyj: where.sfyj || '',
    deptTwoName: where.KSConsume_search4 || '',
    DEPT_NAME: where.KSConsumeBD_search_j4 || '',
    defNoPkg: where.KSConsume_search5 || '',
    manuEntName: where.KSConsume_search6 || '',
    validDateFrom: where.start_time || '',
    validDateTo: where.end_time || '',
    field,
    order,
    highOrLow: where.ksConsumeSearch7 || '',
    trade: where.KSConsume_search8 || '',
    classificName: where.KSConsume_search9 || '',
    consumeType: where.ksConsumeSearch10 || '',
    DETAIL_CREATE_TYPE: where.ksConsumeDetailCreateType || '',
    qxfqx: where.ksConsumeQxfqx || '',
    zcz: where.KSConsume_zcz || '',
    useMonth: where.KSConsume_cb === true,
    monthFmt,
    monthFmt2,
    dayClearingDate: dayClearing,
    specType: where.KSConsume_search11 || '',
    isProtect: where.ksConsumeIsProtect || '',
    isPdaScan: where.ksConsumeIsPdaScan || '',
    isSendYg: where.ksConsumeIsSendYg || '',
    goodsQty: where.ksConsumeGoodsQty || '',
    isHisPriceDeff: where.ksConsumeIsHisPriceDeff || '',
    IS_SPECIAL_AIRCRAFT: where.ksConsumeIsSpecialAircraft || '',
    CONTRACT_TYPE: where.ksConsumeContractType || '',
    SOURCE_FROM: where.KSConsume_SOURCE_FROM || '',
    Supply_Price: where.KSConsume_Supply_Price || '',
    IS_JC: where.ksConsumeIsJc || '',
    IS_CHARGE: where.ksConsumeIsJf || '',
    ygOrder: where.KSConsume_YgOrder || '',
    Patient_Number: where.KSConsume_Patient_Number || '',
    highOrLowClassTwo: where.highOrLowClassTwo1 || '',
    SPD_COST_DEPT_NAME: where.KSConsumeBD_search_cost_dept || '',
    hp: HOME_HP,
    stzx_state: where.stzx_state ?? '-1',
    stzx_state_gz: where.stzx_gz_state ?? '-1',
    sendUdi: where.ksConsumeSearchUdi || '',
    stzx_gkjc_state: where.stzx_gkjc_state || '',
    CONFIRM_STAFF: where.KSConsume_CONFIRM_STAFF || '',
    REGULATORY_CAT_NAME: where.KSConsume_REGULATORY_CAT_NAME || '',
    HAVE_YGCODE: where.ksConsumeHaveYgcode || '',
    isSecondQuery: where.isSecondQuery ? '1' : '0',
    THE_FIRST_BATCH_OF_KEY_CONSUMA: where.stzx_THE_FIRST_BATCH_OF_KEY_CONSUMA || '',
    CLASSIFIC2: where.ksConsumeFLsearch || '',
    checkInStorage: where.checkInStorage || '',
    jsState: where.jsState || '',
    medicalCode: where.KSConsume_MEDICAL_CODE || '',
    MARK: where.KSConsume_MARK || '',
    fsSendState: where.KSConsume_FS_SEND_STATE || ''
  };
}

/** 科室消耗分页查询 DeptConsume/Search */
export async function searchConsume(where, page, size, sort) {
  const params = { Token: token(), ...buildSearchParams(where, page, size, sort) };
  const res = await request.get('/DeptConsume/Search', { params });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '查询失败');
}

/** 快速检索导出（ZIP/CSV） */
export async function exportKSConsumeQueryFast(where, sort = {}) {
  const base = buildSearchParams(where, 1, 1, sort);
  const { page, size, useMonth, ...rest } = base;
  const res = await request.post(
    '/DeptConsume/ExportKSConsumeQueryFast',
    formdataify({
      Token: token(),
      ...rest,
      useMonth: useMonth ? 'true' : 'false',
      isJp: '0'
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '导出失败');
}

/** 逆向消耗 */
export async function reverseConsume(id) {
  const res = await request.post(
    '/DeptConsume/ReverseConsume',
    formdataify({ Token: token(), id, staff: '' })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '逆向消耗失败');
}

/** 院区下拉 */
export async function getStorageList() {
  const res = await request.get('/Commons/GetStorage', { params: { Token: token() } });
  if (okCode(res.data?.code)) return res.data.result || [];
  return [];
}

/** 结算状态来源（北大） */
export async function getJsStates() {
  const res = await request.post('/PekingApplication/getTheJcStates', formdataify({ Token: token() }));
  if (res.data?.code == 200) return res.data.data || [];
  return [];
}

/** 回补成本科室 */
export async function hbCostDept(ids, deptTwoCode) {
  const res = await request.post(
    '/DeptConsume/hbCostDept',
    formdataify({
      Token: token(),
      id: JSON.stringify(ids.map((id) => ({ ID: id }))),
      deptTwoCode: deptTwoCode || ''
    })
  );
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '操作失败');
}
