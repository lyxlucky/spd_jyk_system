import { HOME_HP } from '@/config/setting';
import {
  fmtConsumptionType,
  fmtContractType,
  fmtDate10,
  fmtHisPrice,
  fmtPatientInfo,
  fmtPriceNum,
  fmtPriceWithDiff,
  fmtYesNo01
} from './utils';

const hp = HOME_HP;
const isBd = hp === 'bd';
const isLg = hp === 'lg';
const isStzx = hp === 'stzx';
const isStzl = hp === 'stzl';
const isBdrm = hp === 'bdrm';

export function getConsumeColumns() {
  return [
    { columnKey: 'selection', type: 'selection', width: 45, align: 'center', fixed: 'left' },
    { prop: 'Dept_One_Name', label: '收货一级科室', minWidth: 160, showOverflowTooltip: true },
    { prop: 'Dept_Two_Name', label: '收货二级科室', minWidth: 160, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Dept_Name', label: '计费科室名称', minWidth: 160, showOverflowTooltip: true },
    { prop: 'JS_STORAGE_NAME', label: '结算科室', minWidth: 120, showOverflowTooltip: true },
    {
      prop: 'SPD_COST_DEPT_NAME',
      label: 'SPD消耗成本二级科室',
      minWidth: 250,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    {
      prop: 'DEPT_TWO_NAME_JYK',
      label: '打印科室',
      minWidth: 120,
      sortable: 'custom',
      showOverflowTooltip: true,
      hidden: !isStzx
    },
    {
      prop: 'SPD_COST_DEPT_ONE_NAME',
      label: '微讯通成本科室',
      minWidth: 160,
      sortable: 'custom',
      hidden: !isBd,
      formatter: (row) =>
        `${row.SPD_COST_DEPT_ONE_NAME || ''}(${row.SPD_COST_HERP_DEPT_ONE_CODE || ''})`
    },
    {
      prop: 'COST_DEPT_CODE',
      label: '财务成本科室编码',
      minWidth: 180,
      sortable: 'custom',
      hidden: !isLg
    },
    {
      prop: 'COST_DEPT_NAME',
      label: '财务成本科室名称',
      minWidth: 200,
      sortable: 'custom',
      hidden: !isLg
    },
    { prop: 'CLASSIFIC_NAME2', label: '分类属性', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    { prop: 'XTLB', label: '系统类别', minWidth: 120, hidden: !isStzl, showOverflowTooltip: true },
    { prop: 'XTMC', label: '产品系统名称', minWidth: 160, hidden: !isStzl, showOverflowTooltip: true },
    {
      prop: 'Specification_Or_Type',
      label: '型号/规格',
      minWidth: 120,
      hidden: isBdrm,
      showOverflowTooltip: true
    },
    {
      prop: 'Specification_Or_Type2',
      label: '型号',
      minWidth: 90,
      hidden: !isBdrm,
      showOverflowTooltip: true
    },
    {
      prop: 'Specification_Or_Type3',
      label: '规格',
      minWidth: 90,
      hidden: !isBdrm,
      showOverflowTooltip: true
    },
    { prop: 'Unit', label: '单位', width: 80, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 160, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Approval_Number', label: '批准文号', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Batch', label: '生产批号', minWidth: 120, sortable: 'custom' },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      minWidth: 125,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.Batch_Production_Date)
    },
    {
      prop: 'Batch_Validity_Period',
      label: '失效日期',
      minWidth: 125,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.Batch_Validity_Period)
    },
    {
      prop: 'DISINFECTION_VALID_DATE',
      label: '灭菌失效日期',
      minWidth: 160,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.DISINFECTION_VALID_DATE)
    },
    { prop: 'Coefficient', label: '系数', width: 85, align: 'center', sortable: 'custom' },
    { prop: 'Def_No_Pkg_Code', label: '定数码', minWidth: 115, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'Supply_Price',
      label: '单价',
      minWidth: 80,
      align: 'right',
      sortable: 'custom',
      formatter: (row) => fmtPriceWithDiff(row)
    },
    { prop: 'Goods_Qty', label: '消耗数量', width: 120, align: 'right' },
    {
      prop: 'Cost',
      label: '金额',
      minWidth: 90,
      align: 'right',
      sortable: 'custom',
      formatter: (row) => fmtPriceNum(row, 'Cost')
    },
    { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', width: 70 },
    { prop: 'CLASS_ONE', label: '一级目录', minWidth: 120, showOverflowTooltip: true },
    { prop: 'CLASS_TWO', label: '二级目录', minWidth: 120, showOverflowTooltip: true },
    { prop: 'CLASS_THREE', label: '三级目录', minWidth: 120, showOverflowTooltip: true },
    {
      label: '消耗方式',
      minWidth: 120,
      sortable: 'custom',
      prop: 'Consumption_Type',
      formatter: (row) => fmtConsumptionType(row.Consumption_Type)
    },
    { prop: 'Consume_Time', label: '消耗时间', minWidth: 140, sortable: 'custom' },
    { prop: 'Operate_Person', label: '消耗人', minWidth: 80, sortable: 'custom' },
    { prop: 'Dept_Code', label: '计费科室编码', minWidth: 160 },
    {
      prop: 'HIS_CHARGING_PRICE',
      label: 'his计费价格',
      minWidth: 95,
      formatter: (row) => fmtHisPrice(row)
    },
    {
      label: '住院号/病患号/病人姓名',
      minWidth: 240,
      showOverflowTooltip: true,
      formatter: (row) => fmtPatientInfo(row)
    },
    { prop: 'Brand', label: '品牌', width: 60 },
    { prop: 'High_Or_Low_Class', label: '高低值', width: 100 },
    { prop: 'Trade_Type', label: '国产/进口', width: 125 },
    {
      prop: 'IS_CHARGE',
      label: '是否计费',
      width: 125,
      formatter: (row) => (row.IS_CHARGE == 1 ? '是' : row.IS_CHARGE == 0 ? '否' : '')
    },
    {
      prop: 'Day_Clearing_Id',
      label: '是否日清',
      width: 125,
      formatter: (row) =>
        row.Day_Clearing_Id == 0 ? '未日清' : row.Day_Clearing_Id > 0 ? '已日清' : '未知'
    },
    {
      prop: 'Month_Id',
      label: '是否月结',
      width: 120,
      formatter: (row) =>
        row.Month_Id == 0
          ? '未月结'
          : row.Month_Id > 0
            ? `已月结(${row.MONTHLY_BALANCE_NUMBER || ''})`
            : '未知'
    },
    { prop: 'MONTHLY_TIME', label: '月结月份', width: 120 },
    { prop: 'SEND_WXT_MARK', label: '微讯通结算月份', minWidth: 160 },
    {
      prop: 'Reverse_State',
      label: '是否允许逆向',
      width: 160,
      formatter: (row) => (row.Reverse_State == 1 ? '允许逆向消耗' : '禁止逆向消耗')
    },
    { prop: 'Note_Description', label: '收货备注', minWidth: 120, showOverflowTooltip: true },
    { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 120, showOverflowTooltip: true },
    {
      prop: 'Contract_Type',
      label: '合同类型',
      width: 125,
      sortable: 'custom',
      formatter: (row) => fmtContractType(row.Contract_Type)
    },
    { prop: 'MONTHBILLNUM', label: '发票号', minWidth: 90 },
    { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 120 },
    { prop: 'DELIVERY_NOTE_NUMBER', label: '入库单号', minWidth: 90 },
    {
      label: '出库单号',
      minWidth: 90,
      formatter: (row) => row.STOCK_OUT_DISTRIBUTE_NUMBER || row.OPERATE_MAIN_NUMBER || ''
    },
    { prop: 'MARK', label: '出库单备注', minWidth: 140, showOverflowTooltip: true },
    { prop: 'SOURCE_FROM', label: '阳光平台来源', width: 140 },
    {
      prop: 'IS_JC',
      label: '是否集采',
      width: 120,
      formatter: (row) => fmtYesNo01(row.IS_JC)
    },
    { prop: 'UDI_TOP', label: 'UDI', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Mgmt_Cat_Name', label: '管理类别名称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'Prod_Big_Class_Name', label: '产品大类名称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'Regulatory_Cat_Name', label: '监管类别名称', minWidth: 150, showOverflowTooltip: true },
    { prop: 'MEDICAL_NAME', label: '医保通用名', minWidth: 140, showOverflowTooltip: true },
    { prop: 'HIGH_CLASS_XH', label: '高值重点治疗序号', width: 180 },
    {
      prop: 'SEND_UDI',
      label: '是否发送UDI',
      width: 95,
      formatter: (row) => fmtYesNo01(row.SEND_UDI)
    },
    { prop: 'YG_CODE', label: '阳光产品码', minWidth: 140, showOverflowTooltip: true },
    { prop: 'YG_ORDER_ID', label: '阳光订单号', minWidth: 140, showOverflowTooltip: true },
    { prop: 'YG_HOSPITAL_ID', label: '阳光订单明细', minWidth: 140, showOverflowTooltip: true },
    { prop: 'TB_PJ_NAME', label: '套包名称', minWidth: 120, showOverflowTooltip: true },
    { prop: 'BZ', label: '备注', minWidth: 80, showOverflowTooltip: true },
    { prop: 'HISBZ', label: '消耗备注', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Id', label: 'Id', hidden: true }
  ];
}
