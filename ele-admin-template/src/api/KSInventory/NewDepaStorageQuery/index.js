import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function GetDeptInStockDetail(data){
    console.log(data);
    let deptCodeStr = store.state.user.info.userDept.map((item) => item.Dept_Two_Code).join(',') + ",";
    //添加参数
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.SearchVarietie = data.where.name ? data.where.name : '';
    data2.Batch = data.where.batch ? data.where.batch : '';
    data2.OutType = data.where.type ? data.where.type : '';
    data2.BUSINESS_BILL = data.where.code ? data.where.code : '';
    data2.Specifications = data.where.packagerSpec ? data.where.packagerSpec : '';
    let today = moment().format('YYYY-MM-DD');
    let sevenDaysBefore = moment(today).subtract(7, 'days').format('YYYY-MM-DD');
    const [startTime,EndTime] = Array.isArray(data.where.time) && data.where.time.length != 0 ? data.where.time : [sevenDaysBefore, today];
    data2.StartTime = startTime;
    data2.EndTime = EndTime;
    data2.Production = data.where.factory ? data.where.factory : '';
    data2.field = data.order.sort ? data.order.sort : '';
    data2.order = data.order.order ? data.order.order : '';
    data2.SUPPLIER_NAME = data.where.SUPPLIER_NAME ? data.where.SUPPLIER_NAME : '';
    data2.DeptCode = deptCodeStr;
    //no used
    data2.IS_CHARGE = '-1';
    data2.HIGH_OR_LOW_CLASS = '-1';
    data2.IS_BIDDING = '-1';
    data2.SPECIAL_PURCHASE = '-1';
    data2.ONEOFF_STERILIZATION_PACKAGING = '-1';
    data2.STORAGE_TYPE = '-1';
    data2.IS_EMBEDDED = '-1';
    data2.IS_SERIAL_NUMBER = '-1';
    data2.IS_INTERVENED = '-1';
    data2.IS_PROTECT = '-1';
    //no used
    var data3 = formdataify(data2);
    const res = await request.post('/DepaStorageQuery/GetDeptInStockDetail', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetDistributeDetail(data){
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.stock_out_distribute_number = data.where.name ? data.where.name : '';
    const res = await request.get('/PickDistributionmgmt/GetDistributeDetail', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DeptReceivingScanOrder(data){
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.DistributeNumber = data.name ? data.name : '';
    var data3 = formdataify(data2);
    const res = await request.post('/DeptHisDefZxyy/DeptReceivingScanOrder', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}