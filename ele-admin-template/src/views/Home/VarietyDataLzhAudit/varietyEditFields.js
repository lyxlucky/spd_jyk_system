/** 品种编辑表单字段（对齐旧 Frame add_RarietieszjshpzV2，保存走 WebApi UpdateVarietieBasic） */

const yesNo = [
  { label: '否', value: '0' },
  { label: '是', value: '1' }
];

const enableOpts = [
  { label: '启用', value: '1' },
  { label: '冻结', value: '0' }
];

const chargeOpts = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
  { label: 'FF', value: 'FF' }
];

const storageTypeOpts = [
  { label: '常温', value: '0' },
  { label: '阴凉', value: '1' },
  { label: '冷藏(2~8°C)', value: '2' },
  { label: '冷冻', value: '3' }
];

const highLowOpts = [
  { label: '低值', value: '0' },
  { label: '高值', value: '1' },
  { label: '试剂', value: '2' },
  { label: '消毒', value: '3' }
];

const highLowTwoOpts = [
  { label: '无', value: '0' },
  { label: '非重点治理', value: '2' },
  { label: '重点治理', value: '1' }
];

const useLevelOpts = [
  { label: '普通', value: '0' },
  { label: '常用', value: '1' },
  { label: '非常用', value: '2' }
];

const storageIdOpts = [
  { label: '院内库房', value: 1 },
  { label: '院外库房', value: 2 }
];

const ybClassOpts = [
  { label: '甲类', value: '00' },
  { label: '乙类', value: '01' },
  { label: '自费', value: '03' }
];

const biddingOpts = [
  { label: '中标', value: '1' },
  { label: '不中标', value: '0' }
];

const specialPurchaseOpts = [
  { label: '非专购', value: '0' },
  { label: '专购', value: '1' }
];

const protectOpts = [
  { label: '无', value: '0' },
  { label: '防控物资', value: '1' },
  { label: '调拨物资', value: '2' },
  { label: '科研物资', value: '3' },
  { label: '捐赠物资', value: '4' }
];

const tradeTypeOpts = [
  { label: '国产', value: '0' },
  { label: '进口', value: '1' }
];

const ygVarFromOpts = [
  { label: '无', value: '0' },
  { label: '2020国家集采目录', value: '1' },
  { label: '2020省集采目录', value: '2' },
  { label: '限价目录', value: '3' },
  { label: '备选目录', value: '4' },
  { label: '定价目录', value: '5' }
];

const safetyLevelOpts = [
  { label: '无', value: '0' },
  { label: '一级', value: '1' },
  { label: '二级', value: '2' },
  { label: '三级', value: '3' }
];

const jcOpts = [
  { label: '无', value: '' },
  { label: '否', value: '0' },
  { label: '是', value: '1' }
];

export const VARIETY_EDIT_GROUPS = [
  {
    name: 'basic',
    label: '基础资料',
    fields: [
      { key: 'Varietie_Code_New', label: '品种材料编码', type: 'text', span: 8, disabled: true },
      { key: 'Varietie_Name', label: '品种全称', type: 'input', span: 8, required: true },
      { key: 'Specification_Or_Type', label: '型号/规格', type: 'input', span: 8, required: true },
      { key: 'Unit', label: '单位', type: 'input', span: 6, required: true },
      { key: 'Price', label: '中标价', type: 'number', span: 6, required: true },
      { key: 'Is_Charge', label: '是否计费', type: 'select', span: 6, options: chargeOpts },
      { key: 'Charging_Code', label: '计费编码', type: 'input', span: 6 },
      { key: 'Middle_Package_Count', label: '中包装数量', type: 'number', span: 6 },
      { key: 'MIDDLE_PACKAGE_UNIT', label: '中包装单位', type: 'input', span: 6 },
      { key: 'Big_Box_Count', label: '大包装数量', type: 'number', span: 6 },
      { key: 'BIG_BOX_UNIT', label: '大包装单位', type: 'input', span: 6 },
      { key: 'PAG_TYPE', label: '包装规格', type: 'input', span: 6 },
      { key: 'Oneoff_Sterilization_Packaging', label: '一次性灭菌包装', type: 'select', span: 6, options: yesNo },
      { key: 'Storage_Type', label: '存储条件', type: 'select', span: 6, options: storageTypeOpts },
      { key: 'Is_Embedded', label: '是否植入', type: 'select', span: 6, options: yesNo },
      { key: 'Is_Intervened', label: '是否介入', type: 'select', span: 6, options: yesNo },
      { key: 'Is_Serial_Number', label: '是否一物一码', type: 'select', span: 6, options: yesNo },
      { key: 'Is_Bidding', label: '是否中标', type: 'select', span: 6, options: biddingOpts },
      { key: 'Special_Purchase', label: '是否专购', type: 'select', span: 6, options: specialPurchaseOpts },
      { key: 'StoreHouse_Uppper', label: '库存上限', type: 'number', span: 6 },
      { key: 'StoreHouse_Lower', label: '库存下限', type: 'number', span: 6 },
      { key: 'Use_Level', label: '使用级别', type: 'select', span: 6, options: useLevelOpts },
      { key: 'STORAGE_ID', label: '主控库区', type: 'select', span: 6, options: storageIdOpts },
      { key: 'Is_Protect', label: '物资类型', type: 'select', span: 6, options: protectOpts },
      { key: 'DEF_POSITION', label: '默认货位', type: 'input', span: 6 },
      { key: 'DEF_POSITION_TWO', label: '院外货位', type: 'input', span: 6 },
      { key: 'Enable', label: '是否启用', type: 'select', span: 6, options: enableOpts },
      { key: 'IS_SPECIAL_AIRCRAFT', label: '专机专用', type: 'select', span: 6, options: yesNo },
      { key: 'JFNAME', label: '计费名称', type: 'input', span: 6 },
      { key: 'UDI_TOP', label: 'UDI', type: 'input', span: 6 },
      { key: 'HIS_ZHB', label: 'HIS转换比', type: 'number', span: 6 },
      { key: 'HIS_UNIT', label: 'HIS单位', type: 'input', span: 6 },
      { key: 'HIS_PRICE', label: 'HIS价格', type: 'number', span: 6 },
      { key: 'SUPPORTING_EQUIPMENT', label: '配套设备', type: 'input', span: 6 },
      { key: 'MATCHING_BRAND', label: '配套品牌', type: 'input', span: 6 },
      { key: 'MATCHING_MODEL', label: '配套型号', type: 'input', span: 6 },
      { key: 'IS_XJ', label: '是否小件', type: 'select', span: 6, options: yesNo },
      { key: 'CLINICAL_USE_SAFETY_LEVEL', label: '临床使用安全级别', type: 'select', span: 6, options: safetyLevelOpts }
    ]
  },
  {
    name: 'class',
    label: '分类属性',
    fields: [
      { key: 'High_Or_Low_Class', label: '高低值分类', type: 'select', span: 8, options: highLowOpts },
      { key: 'HIGH_OR_LOW_CLASS_TWO', label: '高低值下级属性', type: 'select', span: 8, options: highLowTwoOpts },
      { key: 'Classific_Properties', label: '财务分类属性', type: 'input', span: 8 },
      { key: 'hosp_class_Common_name', label: '医用类别分类', type: 'input', span: 8 },
      { key: 'HIGH_CLASS_XH', label: '高值重点治理序号', type: 'input', span: 8 },
      { key: 'IMPORT_DUAL_VAR_NAME', label: '重点治理耗材名称', type: 'input', span: 16 },
      { key: 'BACLASS_ID', label: '病案分类', type: 'input', span: 8 },
      { key: 'FYLB', label: '费用类别', type: 'input', span: 8 },
      { key: 'THE_FIRST_BATCH_OF_KEY_CONSUMA', label: '第一批重点耗材', type: 'select', span: 8, options: yesNo },
      { key: 'CHARGE_CLASSIFICATION_ID', label: '收费属性', type: 'input', span: 8 },
      { key: 'Classific_Propertie_Two', label: '下级类别', type: 'input', span: 8 },
      { key: 'Trade_Type', label: '进口/国产', type: 'select', span: 8, options: tradeTypeOpts },
      { key: 'IS_EQUIPMENT_CHANGE', label: '设备科是否修改', type: 'select', span: 8, options: yesNo },
      { key: 'Classific_Properties2', label: '分类属性2', type: 'input', span: 8 },
      { key: 'Classific_Properties3', label: '分类属性3', type: 'input', span: 8 }
    ]
  },
  {
    name: 'yg',
    label: '阳光/医保',
    fields: [
      { key: 'YG_CODE', label: '阳光产品码', type: 'input', span: 8 },
      { key: 'YG_SPE_TYPE', label: '阳光规格型号码', type: 'input', span: 8 },
      { key: 'YG_ZH_COUNT', label: '阳光换算比', type: 'number', span: 8 },
      { key: 'MEDICAL_CODE', label: '国家医保编码(20位)', type: 'input', span: 12 },
      { key: 'MEDICAL_CODE27', label: '国家医保编码(27位)', type: 'input', span: 12 },
      { key: 'MEDICAL_CODE_CZ', label: '潮州医保编码', type: 'input', span: 8 },
      { key: 'MEDICAL_NAME', label: '医保通用名', type: 'input', span: 8 },
      { key: 'MEDICAL_CZ', label: '医保材质', type: 'input', span: 8 },
      { key: 'CLASS_ONE', label: '一级目录', type: 'input', span: 8 },
      { key: 'CLASS_TWO', label: '二级目录', type: 'input', span: 8 },
      { key: 'CLASS_THREE', label: '三级目录', type: 'input', span: 8 },
      { key: 'YG_IS_CAN_SEND', label: '发送阳光平台', type: 'select', span: 8, options: yesNo },
      { key: 'YG_SEND_BEGIN_TIME', label: '发送阳光起始时间', type: 'input', span: 8, placeholder: 'yyyy-MM-dd' },
      { key: 'YG_VAR_FROM', label: '阳光平台来源', type: 'select', span: 8, options: ygVarFromOpts },
      { key: 'SOURCE_FROM', label: '来源名称', type: 'input', span: 8 },
      { key: 'IS_JC', label: '是否集采', type: 'select', span: 8, options: jcOpts },
      { key: 'IsGKJC', label: '是否骨科集采', type: 'select', span: 8, options: yesNo },
      { key: 'MEDICAL_TERMINATION_DATE', label: '医保终止日期', type: 'input', span: 8, placeholder: 'yyyy-MM-dd' },
      { key: 'HIS_PROD_END_TIME', label: '医保码结束时间', type: 'input', span: 8, placeholder: 'yyyy-MM-dd' },
      { key: 'IS_COMPLIANCE', label: '是否贯标', type: 'select', span: 8, options: yesNo },
      { key: 'IS_HANG_UP', label: '是否挂起', type: 'select', span: 8, options: yesNo },
      { key: 'YB_CLASS', label: '医保分类', type: 'select', span: 8, options: ybClassOpts },
      { key: 'SYZ', label: '适应症', type: 'select', span: 8, options: yesNo },
      { key: 'SYZ_TEXT', label: '适应症提示', type: 'input', span: 16 },
      { key: 'YB_BX', label: '医保报销限制', type: 'select', span: 8, options: yesNo },
      { key: 'YB_BX_BZ', label: '医保报销备注', type: 'input', span: 8 },
      { key: 'RESTRICTIVE_SPECIFICATION', label: '限制性耗材', type: 'input', span: 16, placeholder: '如：限胰岛素专用针头、限工伤保险' }
    ]
  },
  {
    name: 'other',
    label: '其他/平台',
    fields: [
      { key: 'Province_Platform_Code', label: '省平台编码', type: 'input', span: 8 },
      { key: 'PROVINCE_VAR_CODE', label: '省平台产品码', type: 'input', span: 8 },
      { key: 'PROVINCE_HT_CODE', label: '省平台合同编码', type: 'input', span: 8 },
      { key: 'ORIGINAL_JF_CODE', label: '原计费编码', type: 'input', span: 8 },
      { key: 'Di', label: '器械识别码(DI)', type: 'input', span: 8 },
      { key: 'PRODUCT_ID', label: '产品ID', type: 'input', span: 8 },
      { key: 'SPECIFICATION_ID', label: '规格ID', type: 'input', span: 8 },
      { key: 'Hosp_Code', label: '原医院系统编码', type: 'input', span: 8 },
      { key: 'Service_Rate', label: '服务费率%', type: 'input', span: 8 },
      { key: 'Sph_Erp_Varietie_Code', label: '上药ERP品种编码', type: 'input', span: 8 },
      { key: 'YSY_GUID', label: 'YSY_GUID', type: 'input', span: 8 },
      { key: 'Is_KuBao', label: '是否库宝品种', type: 'select', span: 8, options: yesNo },
      { key: 'KUBOLXID', label: '库宝料箱ID', type: 'input', span: 8 },
      { key: 'ZONG_CODE', label: '总目录编码', type: 'input', span: 8 },
      { key: 'PTL_IP', label: 'PTL硬件编码', type: 'input', span: 8 },
      { key: 'PTL_NUM_ONE', label: 'PTL货架', type: 'input', span: 8 },
      { key: 'PTL_NUM_TWO', label: 'PTL位码', type: 'input', span: 8 },
      { key: 'IS_LIMIT_COEF', label: '是否限制系数', type: 'select', span: 8, options: yesNo },
      { key: 'STORAGE_TWO_ID', label: '二级库区', type: 'input', span: 8 },
      { key: 'SUPPORTING_EQU', label: '配套设备(旧)', type: 'input', span: 8 },
      { key: 'SUPPORTING_EQU_BRAND', label: '配套设备品牌', type: 'input', span: 8 },
      { key: 'SUPPORTING_EQU_XH', label: '配套设备型号', type: 'input', span: 8 },
      { key: 'SUP_BZ', label: '供应商备注', type: 'input', span: 8 },
      { key: 'VAR_REMARK', label: '品种备注', type: 'textarea', span: 24 },
      { key: 'YG_CAI_PLATFORM_REMARK', label: '阳采平台备注', type: 'textarea', span: 24 }
    ]
  },
  {
    name: 'extend',
    label: '扩展属性',
    fields: [
      { key: 'MEDICAL_CONSUMABLE_GRADE', label: '医用耗材等级', type: 'input', span: 8 },
      { key: 'RISK_CATEGORY', label: '风险类别', type: 'input', span: 8 },
      { key: 'PURPOSE', label: '用途', type: 'input', span: 8 },
      { key: 'FEATURE', label: '特征', type: 'input', span: 8 },
      { key: 'IS_UDI', label: '是否UDI', type: 'select', span: 8, options: yesNo },
      { key: 'IS_GUOLIAO', label: '是否国疗', type: 'select', span: 8, options: yesNo },
      { key: 'IS_XIANJIA', label: '是否限价', type: 'select', span: 8, options: yesNo },
      { key: 'IS_JUANZENG', label: '是否捐赠', type: 'select', span: 8, options: yesNo },
      { key: 'IS_COMPARE_HIS_PRICE', label: '是否对比HIS价', type: 'select', span: 8, options: yesNo },
      { key: 'PLANNED_LIMIT', label: '计划限额', type: 'input', span: 8 },
      { key: 'IS_DB', label: '是否带量', type: 'select', span: 8, options: yesNo },
      { key: 'IS_GT', label: '是否跟台', type: 'select', span: 8, options: yesNo },
      { key: 'IS_BH', label: '是否备货', type: 'select', span: 8, options: yesNo },
      { key: 'IS_BH_APP_TWO', label: '备货需二审', type: 'select', span: 8, options: yesNo },
      { key: 'IS_DEPT_SEPLY_USE', label: '专科专用', type: 'select', span: 8, options: yesNo },
      { key: 'KEY_MONITOR_CHARGE', label: '重点收费监控', type: 'select', span: 8, options: yesNo },
      { key: 'KEY_MONITOR_USE', label: '重点使用监控', type: 'select', span: 8, options: yesNo },
      { key: 'SE_CHARGE_ITEM_CODE', label: '市二收费项目代码', type: 'input', span: 8 },
      { key: 'JYZY_CC', label: '经营专业层次', type: 'input', span: 8 },
      { key: 'MZ_USE', label: '门诊使用', type: 'input', span: 8 },
      { key: 'ZY_USE', label: '住院使用', type: 'input', span: 8 },
      { key: 'YJ_USE', label: '医技使用', type: 'input', span: 8 },
      { key: 'MIN_PKG_NUM', label: '最小包装数量', type: 'input', span: 8 },
      { key: 'MIN_PKG_UNIT', label: '最小包装单位', type: 'input', span: 8 },
      { key: 'MIN_PKG_COEF', label: '最小包装系数', type: 'input', span: 8 },
      { key: 'REUSE_COUNT', label: '复用次数', type: 'input', span: 8 },
      { key: 'UNI_ING_IDENT', label: '统一标识', type: 'input', span: 8 },
      { key: 'JYK_YQM', label: '检验科仪器码', type: 'input', span: 8 },
      { key: 'JYK_ZHB', label: '检验科转换比', type: 'input', span: 8 }
    ]
  }
];

/** 所有可编辑字段 key */
export const VARIETY_EDIT_FIELD_KEYS = VARIETY_EDIT_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
