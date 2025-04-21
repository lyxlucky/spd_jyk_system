import request from '@/utils/request';
import { formdataify, DataToObject, formatDate } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import moment from 'moment';

export async function getDeptAuthVarNew(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.Varietie_Code_New = data.where.Varietie_Code_New
    ? data.where.Varietie_Code_New
    : '';
  data2.Specification_Or_Type = data.where.Specification_Or_Type
    ? data.where.Specification_Or_Type
    : '';
  data2.Manufacturing_Ent_Name = data.where.Manufacturing_Ent_Name
    ? data.where.Manufacturing_Ent_Name
    : '';
  data2.CLASS_NUM = data.where.CLASS_NUM ? data.where.CLASS_NUM : '';
  data2.DEVICE_REMARK = data.where.DEVICE_REMARK
    ? data.where.DEVICE_REMARK
    : '';
  if (data != null) {
    var data3 = formdataify(data);
  }
  var aaa = DataToObject(data2, data2);
  const res = await request.post('/VarietieBasicInfo/getDeptAuthVarNew', data2);
  // const res = await request.post('/VarietieBasicInfo/getVar', {
  //     username,
  //     password,
  //     Token
  // });

  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 查询申领单 */
export async function SerachPlanList(data) {
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.DeptCode =
    store.state.user.info.DeptNow.Dept_Two_Code + ','
      ? store.state.user.info.DeptNow.Dept_Two_Code + ','
      : '';
  // data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
  data2.State = data.where.State ? data.where.State : '-1';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.Start = data.where.Start ? data.where.Start : '';
  data2.End = data.where.End ? data.where.End : '';
  data2.isTwoApp = data.where.isTwoApp ? data.where.DeptCode : '';
  data2.PlanNum = data.where.PlanNum ? data.where.PlanNum : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.get('/DeptApplyPlan/SerachPlanList', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 创建申领单 */
export async function CreatList(data) {
  var data2 = DataToObject(data, data);
  var data3 = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/CreatList', data3);
  return res.data;
  // if (res.code == 200) {
  //     return res.data;
  // } else {
  //     return Promise.reject(new Error(res.msg));
  // }
}

/* 查询申领单品种 */
export async function SerachPlanListDeta(data) {
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.PlanNum = data.where.PlanNum ? data.where.PlanNum : '-1';
  data2.is_second_app = data.where.is_second_app
    ? data.where.is_second_app
    : '';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.dateFrom = data.where.dateFrom ? data.where.dateFrom : '';
  data2.dateTo = data.where.dateTo ? data.where.dateTo : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.get('/DeptApplyPlan/SerachPlanListDeta', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 删除申领单 */
export async function DeletePlanList(data) {
  var data2 = {};
  data2.PlanNum = data.PlanNum ? data.PlanNum : '-1';
  data2.DeptCode = data.PlanDept ? data.PlanDept : '';
  data2.Operater = data.Operater ? data.Operater : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var aaa = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/DeletePlanList', aaa);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 删除申领单品种 */
export async function DeletePlanDeta(data) {
  var data2 = {};
  data2.ID = data.ID ? data.ID : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/DeletePlanDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 保存并提交 */
export async function PutInListDeta(data) {
  var data2 = {};
  data2.PlanNum = data.PlanNum ? data.PlanNum : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/PutInListDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function isHaveZeroDel(data) {
  var data2 = {};
  data2.PlanNum = data.PlanNum ? data.PlanNum : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/isHaveZeroDel', rep);

  return res.data;
  // if (res.data.code == 200) {
  //     return res.data;
  // } else {
  //     return Promise.reject(new Error(res.data.msg));
  // }
}

export async function deleteZeroDel(data) {
  var data2 = {};
  data2.PlanNum = data.PlanNum ? data.PlanNum : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/deleteZeroDel', rep);

  return res.data;
  // if (res.data.code == 200) {
  //     return res.data;
  // } else {
  //     return Promise.reject(new Error(res.data.msg));
  // }
}

/* 审批申领单 */
export async function ToExamine(data) {
  var data2 = {};
  data2.PlanNum = data.PlanNum ? data.PlanNum : '';
  data2.Operator = data.Operator ? data.Operator : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/ToExamine', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 审批申领单 */
export async function KeeptListDeta(data) {
  var data2 = {};
  data2.type = '0';
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/KeeptListDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 更新备注 */
export async function UpdateApplyPlanBZ(data) {
  var data2 = {};
  data2.ID = data.ID;
  data2.REMARK = data.REMARK ? data.REMARK : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/UpdateApplyPlanBZ', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SearchHistoryConsumedAndPurchaseDept(data) {
  var date = new Date(Date.now());

  date =
    `${date.toLocaleDateString().replace(/\//g, '-')}` +
    ` ${date.toTimeString().substring(0, 8)}`;

  date = formatDate(date, 'YYYY-MM-DD');

  var data2 = {};
  data2.deptTwoCode = data.deptTwoCode ? data.deptTwoCode : '';
  data2.MONTHLY_TIME = date;
  data2.page = 1;
  data2.size = 999;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post(
    '/PurchaseOrderApply/SearchHistoryConsumedAndPurchaseDept',
    rep
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function getApplyOperateTip(data) {
  var data2 = {};
  data2.VARIETIE_SEARCH_VALUE = data.where.VARIETIE_SEARCH_VALUE
    ? data.where.VARIETIE_SEARCH_VALUE
    : '';
  data2.STATE = data.where.STATE ? data.where.STATE : '';
  data2.DEPT_TWO_CODE = data.where.DEPT_TWO_CODE
    ? data.where.DEPT_TWO_CODE
    : '';
  data2.PLAN_NUMBER = data.where.PLAN_NUMBER ? data.where.PLAN_NUMBER : '';
  data2.PLAN_TIME_START = data.where.PLAN_TIME_START
    ? data.where.PLAN_TIME_START
    : '';
  data2.PLAN_TIME_END = data.where.PLAN_TIME_END
    ? data.where.PLAN_TIME_END
    : '';
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/getApplyOperateTip', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function QueryPageLayUIByJYK(data) {
  var data2 = {};
  data2.varietieCode = data.where.varietieCode ? data.where.varietieCode : '';
  data2.varietieName = data2.varietieCode;
  data2.state = data.where.state ? data.where.state : '0';
  data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : '-1';
  data2.IS_BIDDING = data.where.IS_BIDDING ? data.where.IS_BIDDING : '-1';
  data2.SPECIAL_PURCHASE = data.where.SPECIAL_PURCHASE
    ? data.where.SPECIAL_PURCHASE
    : '-1';
  data2.ONEOFF_STERILIZATION_PACKAGING = data.where
    .ONEOFF_STERILIZATION_PACKAGING
    ? data.where.ONEOFF_STERILIZATION_PACKAGING
    : '-1';
  data2.STORAGE_TYPE = data.where.STORAGE_TYPE ? data.where.STORAGE_TYPE : '-1';
  data2.IS_EMBEDDED = data.where.IS_EMBEDDED ? data.where.IS_EMBEDDED : '-1';
  data2.IS_SERIAL_NUMBER = data.where.IS_SERIAL_NUMBER
    ? data.where.IS_SERIAL_NUMBER
    : '-1';
  data2.IS_INTERVENED = data.where.IS_INTERVENED
    ? data.where.IS_INTERVENED
    : '-1';
  data2.IS_PROTECT = data.where.IS_PROTECT ? data.where.IS_PROTECT : '-1';
  data2.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS
    ? data.where.HIGH_OR_LOW_CLASS
    : '-1';
  data2.HIGH_OR_LOW_CLASS_TWO = data.where.HIGH_OR_LOW_CLASS_TWO
    ? data.where.HIGH_OR_LOW_CLASS_TWO
    : '-1';
  data2.IS_EQUIPMENT_CHANGE = data.where.IS_EQUIPMENT_CHANGE
    ? data.where.IS_EQUIPMENT_CHANGE
    : '-1';
  data2.HIGH_CLASS_XH_SEARCH = data.where.HIGH_CLASS_XH_SEARCH
    ? data.where.HIGH_CLASS_XH_SEARCH
    : '';
  data2.enable = data.where.enable ? data.where.enable : '1';
  data2.priceChangeTimeStart = data.where.priceChangeTimeStart
    ? data.where.priceChangeTimeStart
    : '';
  data2.priceChangeTimeEnd = data.where.priceChangeTimeEnd
    ? data.where.priceChangeTimeEnd
    : '';
  data2.APPROVAL_STATE = data.where.APPROVAL_STATE
    ? data.where.APPROVAL_STATE
    : '';
  data2.vdzh_sx = data.where.vdzh_sx ? data.where.vdzh_sx : '0';
  data2.SCQY = data.where.SCQY ? data.where.SCQY : '';
  data2.SUP = data.where.SUP ? data.where.SUP : '';
  data2.Specification_Or_Type = data.where.Specification_Or_Type
    ? data.where.Specification_Or_Type
    : '';
  data2.ZCZ = data.where.ZCZ ? data.where.ZCZ : '';
  data2.field = data.where.order ? data.where.order.sort : '';
  data2.order = data.where.order ? data.where.order.order : '';

  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/VarietieBasicInfo/QueryPageLayUIByJYK', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function getOneAuthVarWithDept(data) {
  var data2 = {};
  data2.Dept_Two_Code = data.where.Dept_Two_Code
    ? data.where.Dept_Two_Code
    : '';
  data2.Varietie_Name = data.where.Varietie_Name
    ? data.where.Varietie_Name
    : '';
  data2.Specification_Or_Type = data.where.Specification_Or_Type
    ? data.where.Specification_Or_Type
    : '';
  data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER
    ? data.where.APPROVAL_NUMBER
    : '';
  data2.Manufacturing_Ent_Name = data.where.Manufacturing_Ent_Name
    ? data.where.Manufacturing_Ent_Name
    : '';
  data2.Enable = data.where.Enable ? data.where.Enable : '1';
  data2.VAR_ENABLE = data.where.VAR_ENABLE ? data.where.VAR_ENABLE : '1';

  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post(
    '/DeptOneBulkCargoAuthVar/getOneAuthVarWithDept',
    rep
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function ReturnInitState(data) {
  var data2 = {};
  data2.IDs = data.IDs;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/ReturnInitState', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
export async function deleteOneAuthVarWithDeptItem(row) {
  var data2 = {};
  data2.ID = row.ID;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);
  const res = await request.post(
    '/DeptOneBulkCargoAuthVar/deleteOneAuthVarWithDeptItem',
    rep
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function deleteOneAuthVarWithDeptItems(data) {
  var data2 = {};
  data2.IDs = data.ID;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);
  const res = await request.post(
    '/DeptOneBulkCargoAuthVar/deleteOneAuthVarWithDeptItems',
    rep
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function submitStockingDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.GENERATE_MAN = data.GENERATE_MAN;
  data2.GENERATE_DATE = data.GENERATE_DATE;
  var rep = formdataify(data2);
  const res = await request.post('/AJykDept/submitStockingDataItem', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function deleteStockingDataItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.DEPT_TWO_CODE = data.DEPT_TWO_CODE;
  data2.GENERATE_DATE = data.GENERATE_DATE;
  var rep = formdataify(data2);
  const res = await request.post('/AJykDept/deleteStockingDataItem', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function ImportTempExcel(data) {
  data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const res = await request.post('/DeptApplyPlan/ImpApplyPlanV2Var', data);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function Approval(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.Operator = store.state.user.info.Nickname;
  data2.PlanNum = data.PlanNum;
  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/Approval', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function GetOrderNumById(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    id: data.where.id
  }
  const res = await request.post('/Commons/GetOrderNumById', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
