import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';


/**
 * 获取耗材监管统计
 */
export async function getMaterialStatics(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var data2 = {}
  //添加参数
  data2.Token = Token;
  data2.page = data.page
  data2.size = data.limit

  //时间解析
  const [time1StartDate, time1EndDate] = data.where.time1Range || ["2023-01", "2023-12"];
  const [time2StartDate, time2EndDate] = data.where.time2Range || ["2022-01", "2022-12"];
  data2.deptState = data.where.deptState ? data.where.deptState : "1"
  data2.varState = data.where.varState ? data.where.varState : "1"
  data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : ""
  data2.timeState = data.where.timeState ? data.where.timeState : "1"
  data2.time1Start = time1StartDate ? time1StartDate : "2023-01"
  data2.time1End = time1EndDate ? time1EndDate : "2023-12"
  data2.time2Start = time2StartDate ? time2StartDate : "2022-01"
  data2.time2End = time2EndDate ? time2EndDate : "2022-12"
  data2.orderState = data.where.orderState ? data.where.orderState : "1"
  let data3 = formdataify(data2);
  const res = await request.post('/VarietieBasicInfo/GetMaterialStatistics', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}


/**
 * 获取耗材监管统计报表
 */
export async function getMaterialStaticsSheet(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var data2 = {}
  //添加参数
  data2.Token = Token;
  data2.page = data.page
  data2.size = data.limit

  //时间解析
  const [time1StartDate, time1EndDate] = data.where.time1Range || ["2023-01", "2023-12"];
  const [time2StartDate, time2EndDate] = data.where.time2Range || ["2022-01", "2022-12"];
  data2.deptState = data.where.deptState ? data.where.deptState : "1"
  data2.varState = data.where.varState ? data.where.varState : "1"
  data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : ""
  data2.timeState = data.where.timeState ? data.where.timeState : "1"
  data2.time1Start = time1StartDate ? time1StartDate : "2023-01"
  data2.time1End = time1EndDate ? time1EndDate : "2023-12"
  data2.time2Start = time2StartDate ? time2StartDate : "2022-01"
  data2.time2End = time2EndDate ? time2EndDate : "2022-12"
  data2.orderState = data.where.orderState ? data.where.orderState : "1"

  data2.page = 1
  data2.size = 999999
  let data3 = formdataify(data2);
  
  const res = await request.post('/VarietieBasicInfo/ExcelMaterialStatistics', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

// export async function ExcelMaterialStatistics(data) {
//   var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
//   var data2 = {}
//   //添加参数
//   data2.Token = Token;
//   data2.page = data.page
//   data2.size = data.limit

//   //时间解析
//   const [time1StartDate, time1EndDate] = data.where.time1Range || ["2023-01", "2023-12"];
//   const [time2StartDate, time2EndDate] = data.where.time2Range || ["2022-01", "2022-12"];
//   data2.deptState = data.where.deptState ? data.where.deptState : "1"
//   data2.varState = data.where.varState ? data.where.varState : "1"
//   data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : ""
//   data2.timeState = data.where.timeState ? data.where.timeState : "1"
//   data2.time1Start = time1StartDate ? time1StartDate : "2023-01"
//   data2.time1End = time1EndDate ? time1EndDate : "2023-12"
//   data2.time2Start = time2StartDate ? time2StartDate : "2022-01"
//   data2.time2End = time2EndDate ? time2EndDate : "2022-12"
//   data2.orderState = data.where.orderState ? data.where.orderState : "1"

//   data2.page = 1
//   data2.size = 999999
//   let data3 = formdataify(data2);
//   const res = await request.post('/VarietieBasicInfo/ExcelMaterialStatistics', data3);
//   if (res.data.code == 200) {
//     return res.data;
//   }
//   return Promise.reject(new Error(res.data.msg));
// }