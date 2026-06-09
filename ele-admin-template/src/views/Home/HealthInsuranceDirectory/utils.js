export function defaultFilters() {
  return {
    MEDICAL_INSURANCE_CODE: '',
    NAME_OF_MEDICAL_INSURANCE_CATA: '',
    GENERIC_NAME_FOR_HEALTH_INSURA: '',
    TEXTURE: '',
    CONSUMABLES_ENTERPRISES: '',
    REGISTRATION_RECORD_NUMBER: ''
  };
}

export function buildColumns() {
  return [
    {
      columnKey: 'selection',
      type: 'selection',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    { prop: 'ID', label: '序号', width: 100, showOverflowTooltip: true },
    { prop: 'DIRECTORY_CATEGORY', label: '目录类别', width: 100, showOverflowTooltip: true },
    {
      prop: 'SAVE_MATERIAL_CATALOG_CODING',
      label: '省材料目录编码',
      width: 120,
      showOverflowTooltip: true
    },
    { prop: 'LOCAL_CODES', label: '本地编码', width: 120, showOverflowTooltip: true },
    {
      prop: 'MEDICAL_INSURANCE_CODE',
      label: '医保目录编码',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'NAME_OF_MEDICAL_INSURANCE_CATA',
      label: '医保目录名称',
      width: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'THE_PRIMARY_CLASSIFICATION',
      label: '一级分类',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'SECONDARY_CLASSIFICATION',
      label: '二级分类',
      width: 120,
      showOverflowTooltip: true
    },
    { prop: 'RECLASSIFY', label: '三级分类', width: 120, showOverflowTooltip: true },
    {
      prop: 'GENERIC_NAME_FOR_HEALTH_INSURA',
      label: '医保通用名',
      width: 120,
      showOverflowTooltip: true
    },
    { prop: 'TEXTURE', label: '材质', width: 100, showOverflowTooltip: true },
    { prop: 'FEATURE', label: '特征', width: 120, showOverflowTooltip: true },
    {
      prop: 'REGISTRATION_RECORD_NUMBER',
      label: '注册备案号',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'NAME_OF_INDIVIDUAL_PRODUCT',
      label: '单件产品名称',
      width: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'CONSUMABLES_ENTERPRISES',
      label: '耗材企业',
      width: 150,
      showOverflowTooltip: true
    },
    { prop: 'SPEC', label: '规格', width: 90, showOverflowTooltip: true },
    { prop: 'MODEL_NUMBER', label: '型号', width: 120, showOverflowTooltip: true },
    {
      prop: 'SIGN_OF_CHARGE_TO_AN_ACCOUNT',
      label: '记账标志',
      width: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'TYPE_OF_PRODUCTION_PLACE',
      label: '生产地类别',
      width: 110,
      showOverflowTooltip: true
    },
    { prop: 'CHARGE_UNIT', label: '计价单位', width: 100, showOverflowTooltip: true },
    {
      prop: 'RESTRICTED_USE_MARK',
      label: '限制使用标志',
      width: 110,
      showOverflowTooltip: true
    },
    {
      prop: 'RESTRICTIVE_SPECIFICATION',
      label: '限制性说明',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'MEDICARE_NEGOTIATION_PRICE',
      label: '医保谈判价格',
      width: 110,
      showOverflowTooltip: true
    },
    {
      prop: 'HEALTH_CARE_NEGOTIATION_LEVEL',
      label: '医保谈判价格所属行政级别',
      width: 180,
      showOverflowTooltip: true
    },
    {
      prop: 'HEALTH_INSURANCE_CEILING',
      label: '医保最高价',
      width: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'MEDICARE_PAYMENT_CAP',
      label: '医保支付上限',
      width: 110,
      showOverflowTooltip: true
    },
    { prop: 'IN_MATERIAL', label: '集采耗材', width: 100, showOverflowTooltip: true },
    {
      prop: 'WHETHER_THE_PRODUCT_IS_SELECTE',
      label: '是否中选产品',
      width: 110,
      showOverflowTooltip: true
    },
    {
      prop: 'BASIC_MEDICAL_INSURANCE_START',
      label: '基本医保启用标志',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'LAUNCH_DATE_OF_BASIC_MEDICAL',
      label: '基本医保启用日期',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'TERMINATION_DATE_OF_BASIC_HEAL',
      label: '基本医保终止日期',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'DISCOUNT_ENABLE_LOGO',
      label: '打七折启用标志',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'DISCOUNT_ENABLE_DATE',
      label: '打七折启用日期',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'DISCOUNT_EXPIRY_DATE',
      label: '打七折终止日期',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'MATERNITY_INSURANCE_START_SIGN',
      label: '生育保险启用标志',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'COMMENCEMENT_DATE_OF_MATERNITY',
      label: '生育保险启用日期',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'TERMINATION_DATE_OF_MATERNITY',
      label: '生育保险终止日期',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'FAMILY_MEMBERS_COORDINATETHE',
      label: '家属统筹启用标志',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'FAMILY_MEMBERS_LAUNCH_DATE',
      label: '家属统筹启用日期',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'FAMILY_MEMBERS_EXPIRY_DATE',
      label: '家属统筹终止日期',
      width: 130,
      showOverflowTooltip: true
    }
  ];
}

/** 传给后端的查询条件（材质旧页未参与后端筛选） */
export function toSearchWhere(filters) {
  return {
    MEDICAL_INSURANCE_CODE: filters.MEDICAL_INSURANCE_CODE ?? '',
    NAME_OF_MEDICAL_INSURANCE_CATA: filters.NAME_OF_MEDICAL_INSURANCE_CATA ?? '',
    GENERIC_NAME_FOR_HEALTH_INSURA: filters.GENERIC_NAME_FOR_HEALTH_INSURA ?? '',
    CONSUMABLES_ENTERPRISES: filters.CONSUMABLES_ENTERPRISES ?? '',
    REGISTRATION_RECORD_NUMBER: filters.REGISTRATION_RECORD_NUMBER ?? ''
  };
}
