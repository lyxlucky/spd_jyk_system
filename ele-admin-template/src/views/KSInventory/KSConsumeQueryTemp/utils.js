import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).substr(0, 10);
}

export function fmtConsumptionType(v) {
  const map = {
    0: 'PDA扫码消耗',
    1: 'RFID读码消耗',
    2: 'His计费消耗',
    3: '散货申领消耗',
    4: 'HIS医嘱计费消耗',
    5: '超时默认消耗',
    6: '读码消耗'
  };
  return map[v] ?? v;
}

export function fmtContractType(v) {
  if (v == 1 || v === '1') return '中标';
  if (v == 2 || v === '2') return '临采';
  return '未知';
}

export function fmtYesNo01(v) {
  if (v == 1 || v === '1') return '是';
  return '否';
}

export function fmtPriceNum(d, field = 'Supply_Price') {
  const bl = d.price_bl != null ? d.price_bl : 2;
  const val = d[field];
  if (val == null || val === '') return '';
  return Number(val).toFixed(bl);
}

export function fmtPriceWithDiff(d) {
  const bl = d.price_bl != null ? d.price_bl : 2;
  const sp = Number(d.Supply_Price).toFixed(bl);
  if (d.HIS_CHARGING_PRICE == null) return sp;
  if (sp !== Number(d.HIS_CHARGING_PRICE).toFixed(bl)) {
    return `<span style="color:red">${sp}</span>`;
  }
  return sp;
}

export function fmtHisPrice(d) {
  if (d.HIS_CHARGING_PRICE == null) return '';
  const bl = d.price_bl != null ? d.price_bl : 2;
  if (Number(d.Supply_Price).toFixed(bl) !== Number(d.HIS_CHARGING_PRICE).toFixed(bl)) {
    return `<span style="color:red">${d.HIS_CHARGING_PRICE}</span>`;
  }
  return String(d.HIS_CHARGING_PRICE);
}

export function fmtPatientInfo(d) {
  return `${d.Hospitalization_Number || ''}/${d.Patient_Number || ''}/${d.PATIENT_NAME || ''}`;
}

/** 前端导出检索列（与旧 PrintUseSingleRari_2 主字段一致） */
export const EXPORT_HEADERS = [
  '一级科室',
  '二级科室',
  '计费科室名称',
  '品种编码',
  '品种全称',
  '型号/规格',
  '单位',
  '生产企业名称',
  '供应商',
  '批准文号',
  '品牌',
  '生产批号',
  '生产日期',
  '失效日期',
  '系数',
  '定数码',
  '单价',
  '消耗数量',
  '金额',
  '高低值',
  '国产/进口',
  '消耗方式',
  '消耗时间',
  '消耗人',
  '计费科室编码',
  '住院号',
  '是否日清',
  '是否月结',
  '月结月份',
  '是否允许逆向',
  '收货备注',
  '合同名称',
  '合同类型',
  '分类属性',
  '阳光产品码',
  '阳光订单号',
  'HIS计费价格',
  '备注',
  '消耗备注'
];

export function rowToExportArray(r) {
  let consumeType = fmtConsumptionType(r.Consumption_Type);
  let dayClear = r.Day_Clearing_Id == 0 ? '未日清' : r.Day_Clearing_Id > 0 ? '已日清' : '未知';
  let month = r.Month_Id == 0 ? '未月结' : r.Month_Id > 0 ? `已月结(${r.MONTHLY_BALANCE_NUMBER || ''})` : '未知';
  let reverse = r.Reverse_State == 1 ? '允许逆向消耗' : '禁止逆向消耗';
  return [
    r.Dept_One_Name,
    r.Dept_Two_Name,
    r.Dept_Name,
    r.Varietie_Code_New,
    r.Varietie_Name,
    r.Specification_Or_Type,
    r.Unit,
    r.Manufacturing_Ent_Name,
    r.Supplier_Name,
    r.Approval_Number,
    r.Brand,
    r.Batch,
    fmtDate10(r.Batch_Production_Date),
    fmtDate10(r.Batch_Validity_Period),
    r.Coefficient,
    r.Def_No_Pkg_Code,
    fmtPriceNum(r, 'Supply_Price'),
    r.Goods_Qty,
    fmtPriceNum(r, 'Cost'),
    r.High_Or_Low_Class,
    r.Trade_Type,
    consumeType,
    r.Consume_Time,
    r.Operate_Person,
    r.Dept_Code,
    r.Hospitalization_Number,
    dayClear,
    month,
    r.MONTHLY_TIME,
    reverse,
    r.Note_Description,
    r.CONTRACT_NAME,
    fmtContractType(r.Contract_Type),
    r.Classific_Name,
    r.YG_CODE,
    r.YG_ORDER_ID,
    r.HIS_CHARGING_PRICE,
    r.BZ,
    r.HISBZ
  ];
}
