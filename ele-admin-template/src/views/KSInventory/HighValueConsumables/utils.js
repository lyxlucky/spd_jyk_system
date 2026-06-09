export const CATEGORY_OPTIONS = [
  { value: '1', label: '单/多部件金属骨固定器械及附件' },
  { value: '2', label: '导丝' },
  { value: '3', label: '耳内假体' },
  { value: '4', label: '颌面部赝复及修复重建材料及制品' },
  { value: '5', label: '脊柱椎体间固定置换系统' },
  { value: '6', label: '可吸收外科止血材料' },
  { value: '7', label: '髋关节假体' },
  { value: '8', label: '颅骨矫形器械' },
  { value: '9', label: '刨骨器' },
  { value: '10', label: '球囊扩张导管' },
  { value: '11', label: '托槽' },
  { value: '12', label: '吻合器（带钉）' },
  { value: '13', label: '血管支架' },
  { value: '14', label: '阴茎假体' },
  { value: '15', label: '植入式神经刺激器' },
  { value: '16', label: '植入式心律转复除颤器' },
  { value: '17', label: '植入式药物输注设备' },
  { value: '18', label: '椎体成形导引系统' }
];

export function defaultFilters() {
  return {
    CONSUMABLES_CLASS_CODE: '',
    MEDICARE_GENERIC_NAME: '',
    CATEGORY_ID: ''
  };
}

export function buildColumns() {
  return [
    { prop: 'CATEGORY_ID', label: '类别序号', width: 90, align: 'center' },
    {
      prop: 'CONSUMABLES_CATEGORY',
      label: '耗材类别',
      minWidth: 150,
      showOverflowTooltip: true
    },
    { prop: 'TOTAL_ID', label: '总序号', width: 70, align: 'center' },
    { prop: 'PRODUCT_ID', label: '产品序号', width: 90, align: 'center' },
    {
      prop: 'CONSUMABLES_CLASS_CODE',
      label: '耗材分类代码',
      width: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'PRIMARY_CLASSIFICATION',
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
    {
      prop: 'TERTIARY_CLASSIFICATION',
      label: '三级分类',
      width: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'GENERIC_NAME_CODE',
      label: '通用名代码',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'MEDICARE_GENERIC_NAME',
      label: '医保通用名',
      minWidth: 150,
      showOverflowTooltip: true
    },
    { prop: 'MATERIAL_CODE', label: '材质代码', width: 100, showOverflowTooltip: true },
    { prop: 'MATERIAL', label: '材质', width: 120, showOverflowTooltip: true },
    { prop: 'FEATURE_CODE', label: '特征代码', width: 100, showOverflowTooltip: true },
    {
      prop: 'FEATURE_PARAMETER',
      label: '特征参数',
      minWidth: 150,
      showOverflowTooltip: true
    }
  ];
}
