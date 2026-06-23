import request from '@/utils/request';
import { getToken } from '@/utils/token-util';
import { HOME_HP } from '@/config/setting';

function okCode(c) {
  return c === 200 || c === '200';
}

function str(val) {
  return val == null ? '' : String(val);
}

function normPage(page) {
  const n = parseInt(page, 10);
  return n > 0 ? n : 1;
}

function normSize(size) {
  const n = parseInt(size, 10);
  return n > 0 ? n : 10;
}

/** 与旧 KSConsumeQuery.cshtml where 字段一致 */
function buildSearchParams(data) {
  const { page, limit, where = {}, order = {} } = data;
  const sortField = order?.sort || order?.field || where.field || '';
  const sortOrder =
    order?.order === 'asc' || order?.order === 'ascending'
      ? 'asc'
      : order?.order === 'desc' || order?.order === 'descending'
        ? 'desc'
        : where.order || '';
  return {
    page: normPage(page),
    size: normSize(limit),
    varietie: str(where.KSConsume_search1),
    supplier: str(where.KSConsume_search2),
    batch: str(where.KSConsume_search3),
    sfyj: str(where.sfyj),
    deptTwoName: str(where.KSConsume_search4),
    DEPT_NAME: str(where.KSConsumeBD_search_j4),
    defNoPkg: str(where.KSConsume_search5),
    manuEntName: str(where.KSConsume_search6),
    validDateFrom: str(where.start_time),
    validDateTo: str(where.end_time),
    field: str(sortField),
    order: str(sortOrder),
    highOrLow: str(where.ksConsumeSearch7),
    trade: str(where.KSConsume_search8),
    classificName: str(where.KSConsume_search9),
    consumeType: str(where.ksConsumeSearch10),
    DETAIL_CREATE_TYPE: str(where.ksConsumeDetailCreateType),
    qxfqx: str(where.ksConsumeQxfqx),
    zcz: str(where.KSConsume_zcz),
    useMonth: false,
    monthFmt: '',
    monthFmt2: '',
    dayClearingDate: str(where.KSConsumeBD_dayClearingDate),
    specType: '',
    isProtect: '',
    isPdaScan: '',
    isSendYg: '',
    goodsQty: str(where.ksConsumeGoodsQty),
    isHisPriceDeff: str(where.ksConsumeIsHisPriceDeff),
    IS_SPECIAL_AIRCRAFT: str(where.ksConsumeIsSpecialAircraft),
    CONTRACT_TYPE: str(where.ksConsumeContractType),
    SOURCE_FROM: str(where.KSConsume_SOURCE_FROM),
    Supply_Price: str(where.KSConsume_Supply_Price),
    IS_JC: str(where.ksConsumeIsJc),
    IS_CHARGE: str(where.ksConsumeIsJf),
    ygOrder: '',
    Patient_Number: '',
    highOrLowClassTwo: str(where.highOrLowClassTwo1),
    SPD_COST_DEPT_NAME: str(where.KSConsumeBD_search_cost_dept),
    hp: HOME_HP,
    stzx_state: str(where.stzx_state || '-1'),
    stzx_state_gz: str(where.stzx_gz_state || '-1'),
    sendUdi: str(where.ksConsumeSearchUdi),
    stzx_gkjc_state: str(where.stzx_gkjc_state),
    CONFIRM_STAFF: str(where.KSConsume_CONFIRM_STAFF),
    REGULATORY_CAT_NAME: str(where.KSConsume_REGULATORY_CAT_NAME),
    HAVE_YGCODE: str(where.ksConsumeHaveYgcode),
    isSecondQuery: str(where.isSecondQuery),
    THE_FIRST_BATCH_OF_KEY_CONSUMA: str(where.stzx_THE_FIRST_BATCH_OF_KEY_CONSUMA),
    CLASSIFIC2: str(where.KSConsume_FLsearch),
    checkInStorage: str(where.checkInStorage),
    jsState: str(where.jsState),
    medicalCode: str(where.KSConsume_MEDICAL_CODE),
    MARK: str(where.KSConsume_MARK),
    fsSendState: str(where.KSConsume_FS_SEND_STATE)
  };
}

async function sendGet(url, params) {
  try {
    const res = await request.get(url, {
      params: { Token: getToken() || '', ...params }
    });
    if (okCode(res.data?.code)) {
      return res.data;
    }
    throw new Error(res.data?.msg || res.data?.Message || '请求失败');
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      throw new Error(
        '接口不存在(404)：DeptConsume/Search 未在当前 WebApi 中注册，请在 Visual Studio 重新编译并启动 SYS_WebApi'
      );
    }
    const data = err.response?.data;
    const msg =
      (typeof data === 'string' && data) ||
      data?.msg ||
      data?.Message ||
      err.message ||
      '请求失败';
    throw new Error(msg);
  }
}

/** 科室消耗查询（GET，与旧 layui method:get 一致） */
export async function GetPDAList(data) {
  return sendGet('/DeptConsume/Search', buildSearchParams(data));
}

export async function GetPDAList2(data) {
  const { page, limit, where = {} } = data;
  return sendGet('/CentralWarehouseDept/SearchDef', {
    page: normPage(page),
    size: normSize(limit),
    sourceFrom: str(where.sourceFrom),
    batchId: str(where.batchId),
    varietieCode: str(where.varietieCode),
    batch: str(where.batch),
    coefficient: str(where.coefficient),
    currUpShelfState: str(where.currUpShelfState),
    condition: str(where.condition),
    field: '',
    order: '',
    storageId: str(where.storageId)
  });
}
