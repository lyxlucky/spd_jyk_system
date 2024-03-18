import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { HOME_HP } from '@/config/setting';


export async function SearchDept(data) {
    let data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.hp = HOME_HP;
    data2.page = data.page;
    data2.size = data.limit;

    data2.deptTwoJson = data.where.deptTwoJson ? JSON.stringify(data.where.deptTwoJson) : ''
    data2.varietie = data.where.varietie ? data.where.varietie : ''
    data2.supplier = data.where.supplier ? data.where.supplier : ''
    data2.batch = data.where.batch ? data.where.batch : ''
    data2.deptTwoName = data.where.deptTwoName ? data.where.deptTwoName : ''
    data2.DEPT_NAME = data.where.DEPT_NAME ? data.where.DEPT_NAME : ''
    data2.manuEntName = data.where.manuEntName ? data.where.manuEntName : ''
    data2.validDateFrom = data.where.validDateFrom ? data.where.validDateFrom : ''
    data2.validDateTo = data.where.validDateTo ? data.where.validDateTo : ''
    data2.KSConsumePDA_endDate = data.where.KSConsumePDA_endDate ? data.where.KSConsumePDA_endDate : ''
    data2.KSConsumePDA_startDate = data.where.KSConsumePDA_startDate ? data.where.KSConsumePDA_startDate : ''
    data2.field = data.where.field ? data.where.field : ''
    data2.order = data.where.order ? data.where.order : ''
    data2.highOrLow = data.where.highOrLow ? data.where.highOrLow : ''
    data2.trade = data.where.trade ? data.where.trade : ''
    data2.classificName = data.where.classificName ? data.where.classificName : ''
    data2.consumeType = data.where.consumeType ? data.where.consumeType : ''
    data2.useMonth = data.where.useMonth ? data.where.useMonth : false
    data2.monthFmt = data.where.monthFmt ? data.where.monthFmt : ''
    data2.monthFmt2 = data.where.monthFmt2 ? data.where.monthFmt2 : ''
    data2.dayClearingDate = data.where.dayClearingDate ? data.where.dayClearingDate : ''
    data2.specType = data.where.specType ? data.where.specType : ''
    data2.isProtect = data.where.isProtect ? data.where.isProtect : ''
    data2.isPdaScan = data.where.isPdaScan ? data.where.isPdaScan : ''
    data2.highOrLowClassTwo = data.where.highOrLowClassTwo ? data.where.highOrLowClassTwo : ''
    data2.stzx_state = data.where.highOrLowClassTwo ? data.where.highOrLowClassTwo : ''
    data2.stzx_state_gz = data.where.highOrLowClassTwo ? data.where.highOrLowClassTwo : ''
    data2.def = data.where.def ? data.where.def : ''
    data2.Patient_Number = data.where.Patient_Number ? data.where.Patient_Number : ''
    data2.SPDDEPTNAME = data.where.SPDDEPTNAME ? data.where.SPDDEPTNAME : ''
    data2.Operate_Person = data.where.Operate_Person ? data.where.Operate_Person : ''

    const res = await request.get('/DeptConsume/SearchDept', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// export async function SearchDept(rep) {
//     console.log('rep',rep)
//     var data ={};
//     // data.page = rep.page;
//     // data.size = rep.limit;
//     data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
//     data.deptTwoJson = JSON.stringify(rep.where.deptTwoJson);
//     data.varietie= rep.where.varietie;
//     // data.supplier= rep.where.supplier;
//     // data.batch= rep.where.batch;
//     // data.deptTwoName= rep.where.deptTwoName;
//     // data.DEPT_NAME= rep.where.DEPT_NAME;
//     // data.manuEntName= rep.where.manuEntName;
//     // data.validDateFrom= rep.where.validDateFrom;
//     // data.validDateTo= rep.where.validDateTo;
//     // data.KSConsumePDA_endDate= rep.where.KSConsumePDA_endDate;
//     // data.KSConsumePDA_startDate= rep.where.KSConsumePDA_startDate;
//     // data.field= rep.where.field;
//     // data.order= rep.where.order;
//     // data.highOrLow= rep.where.highOrLow;
//     // data.trade= rep.where.trade;
//     // data.classificName= rep.where.classificName;
//     // data.consumeType= rep.where.consumeType;
//     // data.useMonth= rep.where.useMonth;
//     // data.monthFmt= rep.where.monthFmt;
//     // data.monthFmt2= rep.where.monthFmt2;
//     // data.dayClearingDate= rep.where.dayClearingDate;
//     // data.specType= rep.where.specType;
//     // data.isProtect= rep.where.isProtect;
//     // data.isPdaScan= rep.where.isPdaScan;
//     // data.highOrLowClassTwo= rep.where.highOrLowClassTwo;
//     data.hp = HOME_HP;
//     // data.stzx_state= rep.where.stzx_state;
//     // data.stzx_state_gz= rep.where.stzx_state_gz;
//     // data.def= rep.where.def;
//     // data.Patient_Number= rep.where.Patient_Number;
//     // data.SPDDEPTNAME= rep.where.SPDDEPTNAME;
//     // data.Operate_Person= rep.where.Operate_Person;


//     // const res = await request.get('/DeptConsume/SearchDept', {
//     //     params: data
//     // });
//     // if (res.data.code == 200) {
//     //     return res.data;
//     // } else {
//     //     return Promise.reject(new Error(res.data.msg));
//     // }
// }
