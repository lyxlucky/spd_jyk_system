import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

/** 对齐老页 buildVarietyQueryPrams（QueryByCode） */
export function buildHealthCodeQueryParams(data) {
  const where = data.where || {};
  const order = data.order || {};
  const varietieCode = where.varietieCode || '';
  return {
    Token: token(),
    varietieCode,
    varietieName: varietieCode,
    field: order.sort ?? data.field ?? '',
    order:
      order.order === 'descending' ? 'desc' : order.order === 'ascending' ? 'asc' : '',
    state: where.filterKubao ? '1' : '0',
    IS_CHARGE: where.IS_CHARGE ?? '-1',
    IS_BIDDING: where.IS_BIDDING ?? '-1',
    SPECIAL_PURCHASE: where.SPECIAL_PURCHASE ?? '-1',
    ONEOFF_STERILIZATION_PACKAGING: where.ONEOFF_STERILIZATION_PACKAGING ?? '-1',
    STORAGE_TYPE: where.STORAGE_TYPE ?? '-1',
    IS_EMBEDDED: where.IS_EMBEDDED ?? '-1',
    IS_SERIAL_NUMBER: where.IS_SERIAL_NUMBER ?? '-1',
    IS_INTERVENED: where.IS_INTERVENED ?? '-1',
    IS_PROTECT: where.IS_PROTECT ?? '-1',
    HIGH_OR_LOW_CLASS: where.HIGH_OR_LOW_CLASS ?? '-1',
    HIGH_OR_LOW_CLASS_TWO: where.HIGH_OR_LOW_CLASS_TWO ?? '-1',
    IS_EQUIPMENT_CHANGE: where.IS_EQUIPMENT_CHANGE ?? '-1',
    // 后端读 HIGH_CLASS_XH；顺带兼容老前端误传的 HIGH_CLASS_XH_SEARCH
    HIGH_CLASS_XH: where.HIGH_CLASS_XH ?? '',
    HIGH_CLASS_XH_SEARCH: where.HIGH_CLASS_XH ?? '',
    enable: where.enable ?? '',
    IS_YBDM: where.IS_YBDM ?? '',
    priceChangeTimeStart: where.priceChangeTimeStart ?? '',
    priceChangeTimeEnd: where.priceChangeTimeEnd ?? '',
    APPROVAL_STATE: where.APPROVAL_STATE ?? '',
    vdzh_sx: where.vdzh_sx ?? '0',
    SCQY: where.SCQY ?? '',
    ZCZ: where.ZCZ ?? '',
    SUP: where.SUP ?? '',
    Specification_Or_Type: where.Specification_Or_Type ?? '',
    VARYB_STATE: where.VARYB_STATE ?? '',
    VARSB_STATE: where.VARSB_STATE ?? '',
    VARJF_STATE: where.VARJF_STATE ?? '',
    VARSPD_STATE: where.VARSPD_STATE ?? '',
    VARBZ_STATE: where.VARBZ_STATE ?? '',
    Y_M_P_CODE: where.Y_M_P_CODE ?? '',
    UDI_TOP: where.UDI_TOP ?? ''
  };
}

/** 品种医保对码列表（对码核心接口） */
export async function queryByCode(data) {
  const pramsStr = Encrypt(JSON.stringify(buildHealthCodeQueryParams(data)));
  const body = formdataify({
    prams: pramsStr,
    AesKey: store.state.user.encrypted.KEY,
    page: data.page || 1,
    size: data.limit || 15
  });
  const res = await request.post('/VarietieBasicInfo/QueryByCode', body);
  if (res.data?.code == 301 || res.data === 301) {
    return Promise.reject(new Error(res.data?.msg || '登录失效，请重新登录'));
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}
