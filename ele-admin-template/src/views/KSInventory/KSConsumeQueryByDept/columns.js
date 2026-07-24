import { HOME_HP } from '@/config/setting';
import {
  fmtConsumptionType,
  fmtDate10,
  fmtLgZb,
  fmtPatientInfo,
  fmtPriceNum,
  fmtRestrictConsumable,
  fmtPdaConsumeTime,
  isHideDeptSup
} from './utils';

const isStzx = HOME_HP === 'stzx';
const showSupplier = isHideDeptSup();

export function getConsumeByDeptColumns(hidePdaCounInfo = true) {
  return [
    { prop: 'Dept_One_Name', label: '一级科室', width: 90, showOverflowTooltip: true },
    {
      prop: 'Dept_Two_Name',
      label: '二级科室',
      width: 90,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    { prop: 'Dept_Name', label: '计费科室', minWidth: 90, showOverflowTooltip: true },
    {
      prop: 'SPD_COST_DEPT_NAME',
      label: '成本科室',
      minWidth: 90,
      showOverflowTooltip: true
    },
    {
      prop: 'APPLY_DEPT',
      label: 'His领用科室',
      minWidth: 100,
      hidden: !isStzx,
      showOverflowTooltip: true
    },
    {
      prop: 'Consume_Time',
      label: '消耗时间',
      width: 100,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.Consume_Time)
    },
    {
      prop: 'Varietie_Code_New',
      label: '品种编码',
      width: 100,
      sortable: 'custom',
      showOverflowTooltip: true
    },
    { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 100, showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    {
      columnKey: 'LG_ZB',
      label: '临购/中标',
      width: 80,
      formatter: (row) => fmtLgZb(row)
    },
    {
      columnKey: 'RESTRICT',
      label: '限制性耗材',
      width: 90,
      formatter: (row) => fmtRestrictConsumable(row)
    },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 50, align: 'center' },
    {
      prop: 'Manufacturing_Ent_Name',
      label: '生产企业名称',
      width: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'Supplier_Name',
      label: '供应商',
      width: 160,
      hidden: !showSupplier,
      showOverflowTooltip: true
    },
    { prop: 'Batch', label: '生产批号', width: 90, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      width: 100,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.Batch_Production_Date)
    },
    {
      prop: 'Batch_Validity_Period',
      label: '失效日期',
      width: 100,
      sortable: 'custom',
      formatter: (row) => fmtDate10(row.Batch_Validity_Period)
    },
    { prop: 'Goods_Qty', label: '消耗数量', width: 80, align: 'center' },
    {
      prop: 'Supply_Price',
      label: '单价',
      width: 80,
      align: 'right',
      sortable: 'custom',
      formatter: (row) => fmtPriceNum(row, 'Supply_Price')
    },
    {
      prop: 'Cost',
      label: '金额',
      width: 90,
      align: 'right',
      sortable: 'custom',
      formatter: (row) => {
        if (row.Cost == null || row.Cost === '') return '';
        return Number(row.Cost).toFixed(2);
      }
    },
    { prop: 'Coefficient', label: '系数', width: 50, align: 'center', sortable: 'custom' },
    { prop: 'Def_No_Pkg_Code', label: '定数码', width: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'SERIAL_NUMBER2', label: '扫码UDI', width: 120, sortable: 'custom', showOverflowTooltip: true },
    {
      prop: 'Consumption_Type',
      label: '消耗方式',
      width: 100,
      sortable: 'custom',
      formatter: (row) => fmtConsumptionType(row.Consumption_Type)
    },
    { prop: 'Operate_Person', label: '消耗人', width: 80, sortable: 'custom' },
    {
      label: '住院号',
      minWidth: 180,
      showOverflowTooltip: true,
      formatter: (row) => fmtPatientInfo(row)
    },
    { prop: 'High_Or_Low_Class', label: '高低值', width: 70 },
    { prop: 'Trade_Type', label: '国产/进口', width: 80 },
    {
      prop: 'PDA_CONSUME_MAN',
      label: '二级库出库人(收货结算)',
      width: 140,
      hidden: hidePdaCounInfo,
      showOverflowTooltip: true
    },
    {
      prop: 'PDA_CONSUME_TIME',
      label: '二级库出库时间(收货结算)',
      width: 150,
      hidden: hidePdaCounInfo,
      formatter: (row) => fmtPdaConsumeTime(row.PDA_CONSUME_TIME)
    },
    { prop: 'MEDICAL_CODE', label: '医保编码', width: 120, showOverflowTooltip: true },
    { prop: 'STOCK_OUT_DISTRIBUTE_NUMBER', label: '收货单号', width: 120, showOverflowTooltip: true },
    { prop: 'RECEIVER', label: '收货人', width: 100 },
    { prop: 'RECEIVE_TIME', label: '收货时间', width: 120 },
    { prop: 'MONTHLY_TIME', label: '月结月份', width: 80 },
    { prop: 'BIND_USE_DEPT_NAME', label: '绑定科室', width: 90, showOverflowTooltip: true },
    { prop: 'JYK_YQM', label: '检验仪器名', width: 120, showOverflowTooltip: true }
  ];
}

export function getHzColumns(showSupplierCol = showSupplier) {
  return [
    { prop: 'Varietie_Code_New', label: '品种编码', width: 100, sortable: 'custom' },
    { prop: 'CHARGING_CODE', label: '计费编码', width: 100, sortable: 'custom' },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 60, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 180, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 160, hidden: !showSupplierCol, showOverflowTooltip: true },
    { prop: 'Approval_Number', label: '批准文号', width: 120, showOverflowTooltip: true },
    { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', width: 120 },
    { prop: 'Goods_Qty', label: '消耗数量', width: 100, align: 'right' }
  ];
}

export function getKsHzColumns(showSupplierCol = showSupplier) {
  return [
    { prop: 'SPD_COST_DEPT_NAME', label: '成本科室名称', width: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种编码', width: 100, sortable: 'custom' },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 60, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 180, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 160, hidden: !showSupplierCol, showOverflowTooltip: true },
    { prop: 'Approval_Number', label: '批准文号', width: 120, showOverflowTooltip: true },
    { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', width: 120 },
    { prop: 'Goods_Qty', label: '消耗数量', width: 100, align: 'right' },
    { prop: 'Supply_Price', label: '单价', width: 100, align: 'right' },
    { prop: 'Cost', label: '金额', width: 100, align: 'right' }
  ];
}

export function getFzHzColumns(showSupplierCol = showSupplier) {
  return [
    { prop: 'GROUP_NAME', label: '分组名称', width: 120, sortable: 'custom', showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种编码', width: 100, sortable: 'custom' },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 200, showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 140, showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', width: 60, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 180, showOverflowTooltip: true },
    { prop: 'Supplier_Name', label: '供应商', minWidth: 160, hidden: !showSupplierCol, showOverflowTooltip: true },
    { prop: 'Approval_Number', label: '批准文号', width: 120, showOverflowTooltip: true },
    { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', width: 120 },
    { prop: 'Goods_Qty', label: '消耗数量', width: 100, align: 'right' },
    { prop: 'Supply_Price', label: '单价', width: 100, align: 'right' },
    { prop: 'Cost', label: '金额', width: 100, align: 'right' }
  ];
}
