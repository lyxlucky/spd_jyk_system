import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store/index';

export async function getStaticsDataHistogram(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    data2.time = data.time
    let data3 = formdataify(data2);
    const res = await request.post('/DataStatics/getStaticsDataHistogram', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function getStaticsDataLineChart(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    data2.time = data.time
    let data3 = formdataify(data2);
    const res = await request.post('/DataStatics/getStaticsDataLineChart', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function getCurrentDeptVarTop20(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.time = data.time;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    let data3 = formdataify(data2);
    const res = await request.post('/DataStatics/getCurrentDeptVarTop20', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function getJykUsedQty(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.time = data.time;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    const res = await request.post('/DataStatics/getJykUsedQty', data2);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

