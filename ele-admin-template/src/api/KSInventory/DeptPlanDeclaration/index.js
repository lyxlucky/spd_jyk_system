import request from '@/utils/request';
import store from '@/store/index.js';

import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

//获取科室上申报列表
export async function getDeptPlanTableData(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  const [timeStart, timeEnd] = data.where.topTableSearchTime || '';
  data2.startTime = timeStart ? timeStart : '';
  data2.endTime = timeEnd ? timeEnd : '';
  data2.state = data.where.status ? data.where.status : '';
  data2.DEPT_TWO_CODE = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptPlanDec', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

//获取科室下申报列表
export async function getDeptPlanBottomTableData(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DEPT_PLAN_NEW_MAIN_ID = store.state.user.deptPlanNewMainId;
  data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW
    ? data.where.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME
    ? data.where.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER
    ? data.where.APPROVAL_NUMBER
    : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptPlanDecDel', data3);
  return res.data;
}

//添加科室申报
export async function addDeptPlanTableDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.DEPT_TWO_CODE = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  data2.CREATE_MAN = store.state.user.info.UserName;
  data2.TYPE = data.TYPE ? data.TYPE : '';
  data2.PLAN_MONTH_TIME = data.PLAN_MONTH_TIME ? data.PLAN_MONTH_TIME : '';
  data2.REMARK = data.REMARK ? data.REMARK : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/AddDeptPlanDecDel', data3);
  return res.data;
}

//删除科室申报
export async function deleteDeptPlanTableDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.ID = data.map((item) => item.ID).join(',');
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/DelDeptPlanDec', data3);
  return res.data;
}

//提交科室申报
export async function submitDeptPlanTableDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.ID = data.map((item) => item.ID).join(',');
  data2.APPROVE_STATE = '1';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/UpDept_APPROVE_STATE', data3);
  return res.data;
}

//导出科室申报下表格
export async function ExcelDeptPlanTableBottom(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DEPT_PLAN_NEW_MAIN_ID = store.state.user.deptPlanNewMainId;
  data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW
    ? data.where.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME
    ? data.where.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER
    ? data.where.APPROVAL_NUMBER
    : '';
  data2.size = 999999;
  data2.page = 1;
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptPlanDecDel', data3);
  return res.data;
}

//打印报表
export async function ExcelPrintDeptPlanTableBottom(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DEPT_PLAN_NEW_MAIN_ID = store.state.user.deptPlanNewMainId;
  data2.VARIETIE_CODE_NEW = data.VARIETIE_CODE_NEW
    ? data.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.MANUFACTURING_ENT_NAME
    ? data.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.APPROVAL_NUMBER ? data.APPROVAL_NUMBER : '';
  data2.size = 999999;
  data2.page = 1;
  data2.tag = 1;
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/PrintTbalePlan', data3);
  return res.data;
}

//删除科室申报下表格元素

export async function deleteDeptPlanBottomTableDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.ID = data.map((item) => item.ID).join(',');
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/DelDeptPlanDecDel', data3);
  return res.data;
}

//导出计划报表
export async function ExceTablePlan(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.IDS = data.selection.map((item) => item.ID).join(',');
  data2.VARIETIE_CODE_NEW = data.data.VARIETIE_CODE_NEW
    ? data.data.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.data.MANUFACTURING_ENT_NAME
    ? data.data.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.data.APPROVAL_NUMBER
    ? data.data.APPROVAL_NUMBER
    : '';
  data2.size = 999999;
  data2.page = 1;
  var data3 = formdataify(data2);
  const res = await request.post(
    'DeptPlanDec/ExcelBackEndDeptPDelBatch',
    data3
  );
  return res.data;
}

//添加计划品种 表格数据
export async function getDeptPlanTableDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.Dept_Two_Code = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  // data2.ID = data.ID;
  data2.Enable = '1';
  data2.VAR_ENABLE = '1';
  data2.Varietie_Name = data.where.Varietie_Name
    ? data.where.Varietie_Name
    : '';
  data2.Specification_Or_Type = data.Specification_Or_Type
    ? data.Specification_Or_Type
    : '';
  data2.APPROVAL_NUMBER = data.APPROVAL_NUMBER ? data.APPROVAL_NUMBER : '';
  data2.Manufacturing_Ent_Name = data.Manufacturing_Ent_Name
    ? data.Manufacturing_Ent_Name
    : '';
  data2.page = data.page;
  data2.size = data.limit;
  var data3 = formdataify(data2);
  const res = await request.post(
    'DeptOneBulkCargoAuthVar/getOneAuthVarWithDept',
    data3
  );
  return res.data;
}

//添加计划品种 添加品种
export async function addDeptPlanTableDataKind(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.Dept_Two_Code = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  data2.DEPT_PLAN_NEW_MAIN_ID = store.state.user.deptPlanNewMainId;
  data2.CREATE_MAN = store.state.user.info.UserName;
  data2.json = data ? data : '';
  data2.tag = '1';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/AddVarWithDeptPlanDel', data3);
  return res.data;
}

//修改明细
export async function updateDeptPlantTableDetails(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.ID = data.ID.map((item) => item.ID).join(',');
  data2.REMARK = data.where.REMARK ? data.where.REMARK : '';
  data2.PLAN_NUM = data.where.PLAN_NUM ? data.where.PLAN_NUM : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/UpIDeptPlanDecDel', data3);
  return res.data;
}

//引用计划模板左边表格
export async function getLeftTableData(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DeptCode = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.UserId = '';
  const res = await request.get('DeptApplyPlan/SerachTempletList', {
    params: data2
  });
  return res.data;
}

//引用计划模板右边表格
export async function getRightTableData(data) {
  console.log(data)
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DeptCode = store.state.user.info.DeptNow.Dept_Two_Code
    ? store.state.user.info.DeptNow.Dept_Two_Code
    : '';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.TempletMasteID = data.where.TempletMasteID ? data.where.TempletMasteID : '';
  data2.dateFrom = '';
  data2.dateTo = '';
  const res = await request.get('DeptApplyPlan/SerachTempletDeta', {
    params: data2
  });
  return res.data;
}

