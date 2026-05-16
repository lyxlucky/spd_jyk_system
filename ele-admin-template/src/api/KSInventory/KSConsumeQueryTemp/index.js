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

/** 将搜索表单转为接口参数（与旧 KSConsumeQueryTemp 一致） */
export function buildSearchParams(where = {}, page = 1, size = 20, sort = {}) {
  const monthRange = where.KSConsume_monthRange;
  let monthFmt = '';
  let monthFmt2 = '';
  if (where.KSConsume_cb && monthRange && monthRange.length === 2) {
    const fmt = (d) => {
      if (!d) return '';
      if (typeof d === 'string') return d.slice(0, 7);
      const dt = new Date(d);
      return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    };
    monthFmt = fmt(monthRange[0]);
    monthFmt2 = fmt(monthRange[1]);
  }
  return {
    page,
    size,
    varietie: where.KSConsume_search1 || '',
    ygcode: where.KSConsume_ygcode || '',
    supplier: where.KSConsume_search2 || '',
    batch: where.KSConsume_search3 || '',
    deptTwoName: where.KSConsume_search4 || '',
    DEPT_NAME: where.KSConsumeBD_search_j4 || '',
    defNoPkg: where.KSConsume_search5 || '',
    manuEntName: where.KSConsume_search6 || '',
    validDateFrom: where.start_time || '',
    validDateTo: where.end_time || '',
    field: sort.field || '',
    order: sort.order || '',
    highOrLow: where.ksConsumeSearch7 || '',
    CLASSIFIC2: where.ksConsumeFLsearch || '',
    trade: where.KSConsume_search8 || '',
    classificName: where.KSConsume_search9 || '',
    consumeType: where.ksConsumeSearch10 || '',
    specType: where.KSConsume_search11 || '',
    useMonth: where.KSConsume_cb ? 'true' : 'false',
    monthFmt,
    monthFmt2,
    dayClearingDate: where.KSConsumeBD_dayClearingDate || '',
    SEND_WXT_MARK: where.KSConsumeBD_SEND_WXT_MARK || '',
    isProtect: where.ksConsumeIsProtect || '',
    isPdaScan: where.ksConsumeIsPdaScan || '',
    isSendYg: where.ksConsumeIsSendYg || '',
    isHisPriceDeff: where.ksConsumeIsHisPriceDeff || '',
    IS_SPECIAL_AIRCRAFT: where.ksConsumeIsSpecialAircraft || '',
    CONTRACT_TYPE: where.ksConsumeContractType || '',
    SOURCE_FROM: where.KSConsume_SOURCE_FROM || '',
    Supply_Price: where.KSConsume_Supply_Price || '',
    IS_JC: where.ksConsumeIsJc || '',
    IS_CHARGE: where.ksConsumeIsJf || '',
    goodsQty: where.ksConsumeGoodsQty || '',
    ygOrder: where.KSConsume_YgOrder || '',
    Patient_Number: where.KSConsume_Patient_Number || '',
    SPD_COST_DEPT_NAME: where.KSConsumeBD_search_cost_dept || '',
    zcz: where.KSConsume_zcz || '',
    highOrLowClassTwo: where.highOrLowClassTwo1 || '',
    hp: HOME_HP,
    stzx_state: where.stzx_state ?? '',
    stzx_state_gz: where.stzx_gz_state ?? '',
    sendUdi: where.ksConsumeSearchUdi || '',
    stzx_gkjc_state: where.stzx_gkjc_state || '',
    CONFIRM_STAFF: where.KSConsume_CONFIRM_STAFF || '',
    MONTHBILLNUM: where.KSConsume_MONTHBILLNUM || '',
    REGULATORY_CAT_NAME: where.KSConsume_REGULATORY_CAT_NAME || '',
    MEDICAL_NAME: where.KSConsume_MEDICAL_NAME || '',
    HIGH_CLASS_XH: where.KSConsume_HIGH_CLASS_XH || '',
    IS_SEND_WXT: where.KSConsume_IS_SEND_WXT || '',
    checkInStorage: where.checkInStorageTemp || '',
    KEY_MONITOR_CHARGE: where.KSConsume_KEY_MONITOR_CHARGE || '',
    KEY_MONITOR_USE: where.KSConsume_KEY_MONITOR_USE || ''
  };
}

/** 分页查询（V2 临时表） */
export async function searchConsumeTemp(where, page, size, sort) {
  const params = { Token: token(), ...buildSearchParams(where, page, size, sort) };
  const res = await request.get('/DeptConsume/SearchDEPT_HIS_DEF_PKG_CONSUME_TEMP', { params });
  check301(res.data);
  if (okCode(res.data?.code)) {
    return res.data;
  }
  throw new Error(res.data?.msg || '查询失败');
}

/** 更新全部数据 */
export async function refreshConsumeTemp() {
  const res = await request.get('/DeptConsume/craeteDEPT_HIS_DEF_PKG_CONSUME_TEMP', {
    params: { Token: token() }
  });
  check301(res.data);
  if (okCode(res.data?.code)) return res.data;
  throw new Error(res.data?.msg || '更新失败');
}

/** 后端 EPPlus 导出 */
export async function exportConsumeEpPlus(where, sort = {}) {
  const res = await request.post(
    '/DeptConsume/ExportConsumeEpPlus',
    formdataify({ Token: token(), ...buildSearchParams(where, 1, 999999, sort) })
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
