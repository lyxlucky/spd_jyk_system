import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
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

/** 与旧页 audit buildVarietyQueryPrams 一致 */
export function buildAuditQueryParams(data) {
  const where = data.where || {};
  const order = data.order || {};
  const varietieCode = where.varietieCode || '';
  return {
    Token: token(),
    varietieCode,
    varietieName: varietieCode,
    field: order.sort ?? data.field ?? '',
    order: order.order === 'descending' ? 'desc' : order.order === 'ascending' ? 'asc' : '',
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
    HIGH_CLASS_XH: where.HIGH_CLASS_XH ?? '',
    enable: where.enable ?? '',
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
    VAROES_STATE: where.VAROES_STATE ?? '',
    FSWY_STATE: where.FSWY_STATE ?? '',
    Y_M_P_CODE: where.Y_M_P_CODE ?? '',
    UDI_TOP: where.UDI_TOP ?? ''
  };
}

/** 审批页列表 */
export async function queryAuditPageLayUI(data) {
  const pramsStr = Encrypt(JSON.stringify(buildAuditQueryParams(data)));
  const body = formdataify({
    prams: pramsStr,
    AesKey: store.state.user.encrypted.KEY,
    page: data.page || 1,
    size: data.limit || 15
  });
  const res = await request.post('/VarietieBasicInfo/QueryPageLayUI', body);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询失败'));
}

/** 发送审批 */
export async function approvalVarietieCommit(rows) {
  const res = await request.post(
    '/VarietieBasicInfo/approvalVarietieCommit',
    formdataify({
      Token: token(),
      json: JSON.stringify(rows || [])
    })
  );
  return unwrap(res);
}

/** 审批通过 / 未通过 */
export async function approvalVarietieOk(rows, approvalState, mark = '') {
  let payload = rows || [];
  if (HOME_HP === 'ybyy') {
    payload = payload.map((item) => ({
      ID: item.ID,
      Varietie_Code: item.Varietie_Code,
      Varietie_Code_New: item.Varietie_Code_New
    }));
  }
  const res = await request.post(
    '/VarietieBasicInfo/approvalVarietieOk',
    formdataify({
      Token: token(),
      json: JSON.stringify(payload),
      APPROVAL_STATE: String(approvalState),
      hp: HOME_HP,
      MARK: mark ?? ''
    })
  );
  return unwrap(res);
}

/** 更新备注 */
export async function upBZVarietie(id, remark) {
  const pramsStr = Encrypt(
    JSON.stringify({
      Token: token(),
      ID: String(id ?? ''),
      BEIZHU: remark ?? ''
    })
  );
  const res = await request.post(
    '/VarietieBasicInfo/UpBZVarietie',
    formdataify({
      prams: pramsStr,
      AesKey: store.state.user.encrypted.KEY
    })
  );
  return unwrap(res);
}

/** 库宝创建品种 */
export async function sendVarToKuBo(rows) {
  const list = (rows || []).map((row) => ({
    id: null,
    VARIETIE_CODE: row.KUBOLXID ?? '',
    VARIETIE_NAME: row.Varietie_Name ?? '',
    SPECIFICATION_OR_TYPE: row.Specification_Or_Type ?? '',
    UNIT: row.Unit ?? '',
    MANUFACTURING_ENT_NAME: row.manufacturing_ent_name ?? '',
    PROD_REGISTRATION_CODE: row.Prod_Registration_Code ?? 0
  }));
  const res = await request.post(
    '/VarietieBasicInfo/SendVarToKuBo',
    formdataify({
      Token: token(),
      json: JSON.stringify(list)
    })
  );
  return unwrap(res);
}

/** 高性能导出（与旧页 auditExportVarietyExcel 一致） */
export async function createStorageExcelCwjEpPlus(where, extra = {}) {
  const params = buildAuditQueryParams({ where, order: {} });
  const res = await request.post(
    '/VarietieBasicInfo/CreateStorageExcelCwjEpPlus',
    formdataify({
      ...params,
      HIGH_CLASS_XH_SEARCH: params.HIGH_CLASS_XH,
      hp: HOME_HP,
      IS_HANG_UP: '',
      ...extra
    }),
    { timeout: 600000 }
  );
  return unwrap(res);
}

/** 南五同步 */
export async function pullVarietieBasicInfoSync() {
  const res = await request.post(
    `/VarietieBasicInfo/PullVarietieBasicInfoSync?Token=${encodeURIComponent(token())}&toHospitalId=${encodeURIComponent(HOME_HP)}`
  );
  return unwrap(res);
}
