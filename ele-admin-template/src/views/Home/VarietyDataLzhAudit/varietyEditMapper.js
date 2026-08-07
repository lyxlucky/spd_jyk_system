import { VARIETY_EDIT_FIELD_KEYS } from './varietyEditFields';

/** GetDetailsInfo 字段 → UpdateVarietieBasic / UpdateVarietieBasic_STSE 表单字段 */
function str(v, fallback = '') {
  if (v == null || v === undefined) return fallback;
  return String(v);
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatDateTime(v) {
  if (!v) return '';
  const s = String(v);
  if (s.includes('T')) return s.replace('T', ' ').substring(0, 19);
  return s.substring(0, 19);
}

function formatDateOnly(v) {
  if (!v) return '';
  const s = String(v);
  if (s.includes('T')) return s.substring(0, 10);
  return s.length >= 10 ? s.substring(0, 10) : s;
}

const DATE_FIELDS = new Set([
  'YG_SEND_BEGIN_TIME',
  'MEDICAL_TERMINATION_DATE',
  'HIS_PROD_END_TIME',
  'EXPIRE_TIME'
]);

const NUMERIC_DETAIL_FIELDS = new Set([
  'Price',
  'Middle_Package_Count',
  'Big_Box_Count',
  'StoreHouse_Uppper',
  'StoreHouse_Lower',
  'STORAGE_ID',
  'HIS_ZHB',
  'HIS_PRICE',
  'YG_ZH_COUNT',
  'PT_UNIT_NUM',
  'PT_UNIT_DEN'
]);

function normalizeFormValue(key, value) {
  if (value == null || value === undefined) return '';
  if (DATE_FIELDS.has(key)) return formatDateOnly(value);
  if (NUMERIC_DETAIL_FIELDS.has(key) && value !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  }
  if (
    key === 'Classific_Properties' ||
    key === 'CLASSIFIC_PROPERTIES2' ||
    key === 'CLASSIFIC_PROPERTIES3'
  ) {
    return String(value);
  }
  return value;
}

const CLASSIFIC_FORM_ALIASES = {
  Classific_Properties: ['Classific_Properties', 'CLASSIFIC_PROPERTIES'],
  CLASSIFIC_PROPERTIES2: ['CLASSIFIC_PROPERTIES2', 'Classific_Properties2'],
  CLASSIFIC_PROPERTIES3: ['CLASSIFIC_PROPERTIES3', 'Classific_Properties3']
};

function pickDetailValue(detail, key) {
  const aliases = CLASSIFIC_FORM_ALIASES[key];
  if (!aliases) return detail?.[key];
  for (const alias of aliases) {
    const v = detail?.[alias];
    if (v != null && v !== '') return v;
  }
  return detail?.[key];
}

export function buildUpdatePayload(detail, meta = {}) {
  const d = detail || {};
  const hp = meta.hp || '';
  const nickname = meta.nickname || '';
  const token = meta.token || '';

  const payload = {
    Token: token,
    VarietieCode: str(d.Varietie_Code_New),
    VarietieName: str(d.Varietie_Name),
    ProdRegistrationCode: str(d.Prod_Registration_Code),
    SpecificationOrType: str(d.Specification_Or_Type),
    Price: num(d.Price),
    Unit: str(d.Unit),
    IsIntervened: str(d.Is_Intervened, '0'),
    IsEmbedded: str(d.Is_Embedded, '0'),
    IsSerialNumber: str(d.Is_Serial_Number, '0'),
    IsCharge: str(d.Is_Charge, '0'),
    ChargingCode: str(d.Charging_Code),
    HighOrLowClass: str(d.High_Or_Low_Class, '0'),
    MiddlePackageCount: num(d.Middle_Package_Count),
    BigBoxCount: num(d.Big_Box_Count),
    PAG_TYPE: str(d.PAG_TYPE),
    OneoffSterilizationPackaging: str(d.Oneoff_Sterilization_Packaging, '0'),
    StorageType: str(d.Storage_Type, '0'),
    NoteDescription: '1',
    Relatedstorehouse: str(d.Related_storehouse),
    StoreHouseUppper: num(d.StoreHouse_Uppper),
    StoreHouseLower: num(d.StoreHouse_Lower),
    ENABLE: str(d.Enable, '1'),
    Province_Platform_Code: str(d.Province_Platform_Code),
    Classific_Properties: str(d.Classific_Properties),
    ID: str(d.ID),
    Is_Bidding: str(d.Is_Bidding, '0'),
    SphErpVarietieCode: str(d.Sph_Erp_Varietie_Code),
    Di: str(d.Di),
    Trade_Type: str(d.Trade_Type, '0'),
    useLevel: str(d.Use_Level, '0'),
    STORAGE_ID: str(d.STORAGE_ID != null ? d.STORAGE_ID : ''),
    Hosp_Code: str(d.Hosp_Code),
    Special_Purchase: str(d.Special_Purchase, '0'),
    hp,
    KUBOLXID: str(d.KUBOLXID),
    Service_Rate: str(d.Service_Rate),
    Is_Protect: str(d.Is_Protect, '0'),
    Classific_Propertie_Two: str(d.Classific_Propertie_Two),
    hosp_class_Common_name: str(d.hosp_class_Common_name),
    HIGH_OR_LOW_CLASS_TWO: str(d.HIGH_OR_LOW_CLASS_TWO),
    IS_EQUIPMENT_CHANGE: str(d.IS_EQUIPMENT_CHANGE, ''),
    nickname,
    YSY_GUID: str(d.YSY_GUID),
    MEDICAL_CODE: str(d.MEDICAL_CODE),
    YG_CODE: str(d.YG_CODE),
    YG_VAR_FROM: str(d.YG_VAR_FROM),
    YG_SPE_TYPE: str(d.YG_SPE_TYPE),
    YG_ZH_COUNT: str(d.YG_ZH_COUNT != null && d.YG_ZH_COUNT !== '' ? d.YG_ZH_COUNT : '1'),
    YG_IS_CAN_SEND: str(d.YG_IS_CAN_SEND),
    YG_SEND_BEGIN_TIME: formatDateTime(d.YG_SEND_BEGIN_TIME),
    DEF_POSITION: str(d.DEF_POSITION) || '无',
    HIGH_CLASS_XH: str(d.HIGH_CLASS_XH),
    IMPORT_DUAL_VAR_NAME: str(d.IMPORT_DUAL_VAR_NAME),
    ZONG_CODE: str(d.ZONG_CODE),
    PTL_IP: str(d.PTL_IP),
    PTL_NUM_ONE: str(d.PTL_NUM_ONE),
    PTL_NUM_TWO: str(d.PTL_NUM_TWO),
    IS_LIMIT_COEF: str(d.IS_LIMIT_COEF),
    CLASS_ONE: str(d.CLASS_ONE),
    CLASS_TWO: str(d.CLASS_TWO),
    CLASS_THREE: str(d.CLASS_THREE),
    SOURCE_FROM: str(d.SOURCE_FROM),
    IS_SPECIAL_AIRCRAFT: str(d.IS_SPECIAL_AIRCRAFT),
    STORAGE_TWO_ID: str(d.STORAGE_TWO_ID),
    SUPPORTING_EQU: str(d.SUPPORTING_EQU),
    SUPPORTING_EQU_BRAND: str(d.SUPPORTING_EQU_BRAND),
    SUPPORTING_EQU_XH: str(d.SUPPORTING_EQU_XH),
    PROVINCE_VAR_CODE: str(d.PROVINCE_VAR_CODE),
    PROVINCE_HT_CODE: str(d.PROVINCE_HT_CODE),
    ORIGINAL_JF_CODE: str(d.ORIGINAL_JF_CODE),
    UDI_TOP: str(d.UDI_TOP),
    Add_Iskubo: str(d.Is_KuBao),
    SYZ: str(d.SYZ),
    SYZ_TEXT: str(d.SYZ_TEXT),
    YB_CLASS: str(d.YB_CLASS),
    THE_FIRST_BATCH_OF_KEY_CONSUMA: str(d.THE_FIRST_BATCH_OF_KEY_CONSUMA),
    BACLASS_ID: str(d.BACLASS_ID),
    IS_JC: str(d.IS_JC),
    HIS_ZHB: num(d.HIS_ZHB, 1),
    HIS_UNIT: str(d.HIS_UNIT),
    HIS_PRICE: num(d.HIS_PRICE),
    JFNAME: str(d.JFNAME),
    MEDICAL_NAME: str(d.MEDICAL_NAME),
    MEDICAL_CZ: str(d.MEDICAL_CZ),
    MEDICAL_CODE27: str(d.MEDICAL_CODE27),
    MEDICAL_CODE_CZ: str(d.MEDICAL_CODE_CZ),
    SUPPORTING_EQUIPMENT: str(d.SUPPORTING_EQUIPMENT),
    MATCHING_BRAND: str(d.MATCHING_BRAND),
    MATCHING_MODEL: str(d.MATCHING_MODEL),
    JYK_YQM: str(d.JYK_YQM),
    JYK_ZHB: str(d.JYK_ZHB),
    MEDICAL_TERMINATION_DATE: formatDateOnly(d.MEDICAL_TERMINATION_DATE),
    PRODUCT_ID: str(d.PRODUCT_ID),
    SPECIFICATION_ID: str(d.SPECIFICATION_ID),
    SUP_BZ: str(d.SUP_BZ),
    HIS_PROD_END_TIME: formatDateOnly(d.HIS_PROD_END_TIME),
    MIDDLE_PACKAGE_UNIT: str(d.MIDDLE_PACKAGE_UNIT),
    BIG_BOX_UNIT: str(d.BIG_BOX_UNIT),
    MEDICAL_CONSUMABLE_GRADE: str(d.MEDICAL_CONSUMABLE_GRADE),
    RISK_CATEGORY: str(d.RISK_CATEGORY),
    PURPOSE: str(d.PURPOSE),
    FEATURE: str(d.FEATURE),
    CHARGE_CLASSIFICATION_ID: str(d.CHARGE_CLASSIFICATION_ID),
    DEF_POSITION_TWO: str(d.DEF_POSITION_TWO),
    IS_XJ: str(d.IS_XJ),
    IS_GUOLIAO: str(d.IS_GUOLIAO),
    IS_XIANJIA: str(d.IS_XIANJIA),
    IS_JUANZENG: str(d.IS_JUANZENG),
    CLINICAL_USE_SAFETY_LEVEL: str(d.CLINICAL_USE_SAFETY_LEVEL),
    IS_COMPLIANCE: str(d.IS_COMPLIANCE),
    IS_HANG_UP: str(d.IS_HANG_UP),
    IS_COMPARE_HIS_PRICE: str(d.IS_COMPARE_HIS_PRICE),
    PLANNED_LIMIT: str(d.PLANNED_LIMIT),
    IS_DB: str(d.IS_DB),
    IS_UDI: str(d.IS_UDI),
    REUSE_COUNT: str(d.REUSE_COUNT),
    MIN_PKG_NUM: str(d.MIN_PKG_NUM),
    MIN_PKG_UNIT: str(d.MIN_PKG_UNIT),
    MIN_PKG_COEF: str(d.MIN_PKG_COEF),
    CLASSIFIC_PROPERTIES2: str(d.CLASSIFIC_PROPERTIES2),
    CLASSIFIC_PROPERTIES3: str(d.CLASSIFIC_PROPERTIES3),
    UNI_ING_IDENT: str(d.UNI_ING_IDENT),
    PT_UNIT_NUM: d.PT_UNIT_NUM != null ? String(d.PT_UNIT_NUM) : '',
    PT_UNIT_DEN: d.PT_UNIT_DEN != null ? String(d.PT_UNIT_DEN) : '',
    KEY_MONITOR_CHARGE: str(d.KEY_MONITOR_CHARGE),
    KEY_MONITOR_USE: str(d.KEY_MONITOR_USE),
    IS_GT: str(d.IS_GT),
    IS_BH_APP_TWO: str(d.IS_BH_APP_TWO),
    IS_BH: str(d.IS_BH),
    IS_DEPT_SEPLY_USE: str(d.IS_DEPT_SEPLY_USE),
    SE_CHARGE_ITEM_CODE: str(d.SE_CHARGE_ITEM_CODE),
    YB_BX: str(d.YB_BX),
    JYZY_CC: str(d.JYZY_CC),
    JLJC: str(d.JLJC),
    MZ_USE: str(d.MZ_USE),
    ZY_USE: str(d.ZY_USE),
    YJ_USE: str(d.YJ_USE),
    MEDICAL_DBJ_NAME: str(d.MEDICAL_DBJ_NAME),
    YB_BX_BZ: str(d.YB_BX_BZ),
    VARREMARK: str(d.VAR_REMARK),
    YG_CAI_PLATFORM_REMARK: str(d.YG_CAI_PLATFORM_REMARK),
    expireTime: formatDateOnly(d.EXPIRE_TIME),
    ADD_FYLB: str(d.FYLB),
    IsGKJC: str(d.IsGKJC),
    Hospital: hp
  };

  if (meta.useStseApi) {
    payload.type = '0';
  }

  return payload;
}

/** 详情 → 表单（字段与 GetDetailsInfo 一致，未改字段保存时原样带回） */
export function detailToForm(detail) {
  const d = detail || {};
  const form = {};
  VARIETY_EDIT_FIELD_KEYS.forEach((key) => {
    form[key] = normalizeFormValue(key, pickDetailValue(d, key));
  });
  return form;
}

/** 表单 → 合并回详情 */
export function mergeFormToDetail(detail, form) {
  const merged = { ...(detail || {}) };
  if (!form) return merged;
  VARIETY_EDIT_FIELD_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(form, key)) {
      merged[key] = form[key];
    }
  });
  return merged;
}

/** 新增品种空详情（默认值对齐老页 add_RarietieszjshpzV2New / InsertVarietieBasic） */
export function createEmptyDetail() {
  const detail = {
    Varietie_Code: '',
    Varietie_Code_New: '',
    Varietie_Name: '',
    Prod_Registration_Code: '',
    Approval_Number: '',
    Common_Name: '',
    prod_big_class_name: '',
    manufacturing_ent_name: '',
    Specification_Or_Type: '',
    Unit: '',
    Price: '',
    Is_Charge: '0',
    Charging_Code: '',
    Middle_Package_Count: 0,
    Big_Box_Count: 0,
    PAG_TYPE: '',
    Oneoff_Sterilization_Packaging: '0',
    Storage_Type: '0',
    Is_Embedded: '0',
    Is_Intervened: '0',
    Is_Serial_Number: '0',
    Is_Bidding: '0',
    Special_Purchase: '0',
    StoreHouse_Uppper: 0,
    StoreHouse_Lower: 0,
    Use_Level: '0',
    STORAGE_ID: 1,
    Is_Protect: '0',
    DEF_POSITION: '无',
    DEF_POSITION_TWO: '',
    Enable: '1',
    IS_SPECIAL_AIRCRAFT: '0',
    High_Or_Low_Class: '0',
    HIGH_OR_LOW_CLASS_TWO: '0',
    YG_ZH_COUNT: 1,
    HIS_ZHB: 1,
    HIS_PRICE: 0,
    YG_IS_CAN_SEND: '0',
    Is_KuBao: '0',
    JYZY_CC: '1',
    MZ_USE: '1',
    ZY_USE: '1',
    YJ_USE: '0',
    CLASSIFIC_PROPERTIES2: '',
    CLASSIFIC_PROPERTIES3: ''
  };
  VARIETY_EDIT_FIELD_KEYS.forEach((key) => {
    if (detail[key] === undefined) detail[key] = '';
  });
  return detail;
}

/** 新增提交：复用 Update 字段映射，并补齐 Insert 必需数值默认（全部转字符串，兼容 formdataify） */
export function buildInsertPayload(detail, meta = {}) {
  const payload = buildUpdatePayload(detail, { ...meta, useStseApi: false });
  delete payload.ID;
  delete payload.ENABLE;
  delete payload.type;
  delete payload.YSY_GUID;
  // Insert 接口强制 Convert.ToInt32 / ToDecimal，空串会失败
  payload.MiddlePackageCount = String(num(detail?.Middle_Package_Count, 0));
  payload.BigBoxCount = String(num(detail?.Big_Box_Count, 0));
  payload.StoreHouseUppper = String(num(detail?.StoreHouse_Uppper, 0));
  payload.StoreHouseLower = String(num(detail?.StoreHouse_Lower, 0));
  payload.STORAGE_ID = String(num(detail?.STORAGE_ID, 1));
  payload.Price = String(num(detail?.Price, 0));
  payload.HIS_ZHB = String(num(detail?.HIS_ZHB, 1));
  payload.HIS_PRICE = String(num(detail?.HIS_PRICE, 0));
  payload.YG_ZH_COUNT = str(
    detail?.YG_ZH_COUNT != null && detail?.YG_ZH_COUNT !== '' ? detail.YG_ZH_COUNT : '1'
  );
  payload.NoteDescription = '1';
  payload.DEF_POSITION = str(detail?.DEF_POSITION) || '无';
  payload.Is_KuBao = str(detail?.Is_KuBao, '0');
  payload.Add_Iskubo = payload.Is_KuBao;
  // 表单 key 与详情字段大小写不一致时兜底
  payload.CLASSIFIC_PROPERTIES2 = str(
    detail?.CLASSIFIC_PROPERTIES2 || detail?.Classific_Properties2
  );
  payload.CLASSIFIC_PROPERTIES3 = str(
    detail?.CLASSIFIC_PROPERTIES3 || detail?.Classific_Properties3
  );
  payload.ProdRegistrationCode = str(detail?.Prod_Registration_Code);
  payload.VarietieCode = str(detail?.Varietie_Code_New);
  // 避免 formdataify 对 number 做 JSON.stringify 导致个别字段异常
  Object.keys(payload).forEach((key) => {
    const v = payload[key];
    if (v == null || v === undefined) {
      payload[key] = '';
    } else if (typeof v !== 'string') {
      payload[key] = String(v);
    }
  });
  return payload;
}
