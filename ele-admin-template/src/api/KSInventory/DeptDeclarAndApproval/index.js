import request from '@/utils/request';
import store from '@/store/index.js';

import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { digit, toDateString } from 'ele-admin';


// 此方法为获取到所有的一级科室，为后面的科室申报列表做参数铺垫
export async function GetDeptOneInfo(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = '1';
  data2.size = '100';
  data2.startTime = '';
  data2.endTime = '';
  data2.DEPT_ONE_NAME = '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptOneInfo', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 获取单个科室申报列表
export async function GetDeptPlanDecByODept(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DEPT_ONE_CODE = data.DEPT_ONE_CODE ? data.DEPT_ONE_CODE : '';
  data2.PLAN_MONTH_TIME = data.PLAN_MONTH_TIME ? data.PLAN_MONTH_TIME : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptPlanDecByODept', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 获取多个科室申报列表总和在一起
export async function getDeptPlanDecList(data) {
  try {
    let result = [];
    let res = await GetDeptOneInfo();

    let Dept_One_Code_Array = [];
    for (let i = 0; i < res.result.length; i++) {
      Dept_One_Code_Array.push([
        res.result[i].Dept_One_Code,
        res.result[i].PLAN_MONTH_TIME
      ]);
    }

    let promises = [];
    for (let i = 0; i < Dept_One_Code_Array.length; i++) {
      let DEPT_ONE_CODE = Dept_One_Code_Array[i][0];
      let PLAN_MONTH_TIME = Dept_One_Code_Array[i][1];

      let data2 = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page,
        limit: data.limit,
        DEPT_ONE_CODE: DEPT_ONE_CODE ? DEPT_ONE_CODE : '',
        PLAN_MONTH_TIME: PLAN_MONTH_TIME ? PLAN_MONTH_TIME : ''
      };
      let deptPlanRes = GetDeptPlanDecByODept(data2);
      promises.push(deptPlanRes);
    }

    let responses = await Promise.all(promises);

    responses.forEach((res) => {
      if (Array.isArray(res.result) && res.result.length != 0) {
        result.push(...res.result);
      }
    });

    let returnData = {
      code: '200',
      msg: '查找成功',
      result: result,
      total: result.length
    };

    return returnData;
  } catch (error) {
    return {
      code: '500',
      msg: '查找失败'
    };
  }
}

export async function getDeptPlanDecListInArray(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.DEPT_TWO_CODE = (store.state.user.info.userDept).map((item)=>item.Dept_Two_Code).join(",");
  data2.PLAN_MONTH_TIME = data.PLAN_MONTH_TIME ? data.PLAN_MONTH_TIME : '';
  var data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetDeptPlanDecByODeptInArray', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 审批
export async function DeptDeclarApproval(data) {
  let data2 = {};
  data2.ID = data.map((item) => item.ID).join(',');
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.APPROVE_STATE = '3';
  let data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/UpDept_APPROVE_STATE', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

//审批不通过
export async function DeptDeclarDeny(data) {
  let data2 = {};
  data2.ID = data.map((item) => item.ID).join(',');
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.APPROVE_STATE = '5';
  let data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/UpDept_APPROVE_STATE', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 获取科室申报详情列表
export async function getDeptDeclarDetailList(data) {
  console.log(data)
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.State = '';
  data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW
    ? data.where.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME
    ? data.where.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER ? data.where.APPROVAL_NUMBER : '';
  data2.DEPT_ONE_CODE = data.where.DEPT_ONE_CODE ? data.where.DEPT_ONE_CODE : '';
  data2.PLAN_MONTH_TIME = toDateString(data.where.PLAN_MONTH_TIME,'yyyy-MM') ? toDateString(data.where.PLAN_MONTH_TIME,'yyyy-MM') : '';
  data2.tag = '1';
  data2.DEPT_PLAN_NEW_MAIN_ID = data.where.DEPT_PLAN_NEW_MAIN_ID
    ? data.where.DEPT_PLAN_NEW_MAIN_ID
    : '';
  let data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetAllPlanVar', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 剔除科室详情单个元素
export async function deleteDeptDeclarDetailItem(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.ID = data.map((item) => item.ID).join(',');;
  let data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/DelDeptPlanDecDel', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


// 搜索获取科室申报详情列表
export async function searchDeptDeclarDetailList(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.State = '';
  data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW
    ? data.where.VARIETIE_CODE_NEW
    : '';
  data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME
    ? data.where.MANUFACTURING_ENT_NAME
    : '';
  data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER ? data.where.APPROVAL_NUMBER : '';
  data2.DEPT_ONE_CODE = data.where.DEPT_ONE_CODE ? data.where.DEPT_ONE_CODE : '';
  data2.PLAN_MONTH_TIME = toDateString(data.where.PLAN_MONTH_TIME,'yyyy-MM') ? toDateString(data.where.PLAN_MONTH_TIME,'yyyy-MM') : '';
  data2.tag = '1';
  data2.DEPT_PLAN_NEW_MAIN_ID = data.where.DEPT_PLAN_NEW_MAIN_ID
    ? data.where.DEPT_PLAN_NEW_MAIN_ID
    : '';
  let data3 = formdataify(data2);
  const res = await request.post('DeptPlanDec/GetAllPlanVar', data3);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}