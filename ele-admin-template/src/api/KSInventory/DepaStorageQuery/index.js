import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getDeptAuthVarNew(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // var aaa = DataToObject(data,data.where);

    if (data != null) {
        var data2 = formdataify(data);
    }
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

export async function GetDeptInStockDetail(data) {
    // 获取各种类型当前时间
    var date = new Date(); //获取当前时间国标版
    var year = date.getFullYear(); // 获取年
    var month = date.getMonth() + 1; //获取当前月
    var day = date.getDate(); //日
    var now_time = year + '-' + month + '-' + day;
    data.where.EndTime = data.where.EndTime ? data.where.EndTime : now_time;

    //获取7天前的时间
    var now2 = new Date();
    var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
    var year2 = date2.getFullYear();
    var month2 = date2.getMonth() + 1;
    var day2 = date2.getDate();
    var now_time2 = year2 + '-' + month2 + '-' + day2;
    data.where.StartTime = data.where.StartTime ? data.where.StartTime : now_time2;


    data.where.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : -1;
    data.where.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS ? data.where.HIGH_OR_LOW_CLASS : -1;
    data.where.IS_BIDDING = data.where.IS_BIDDING ? data.where.IS_BIDDING : -1;
    data.where.SPECIAL_PURCHASE = data.where.SPECIAL_PURCHASE ? data.where.SPECIAL_PURCHASE : -1;
    data.where.ONEOFF_STERILIZATION_PACKAGING = data.where.ONEOFF_STERILIZATION_PACKAGING ? data.where.ONEOFF_STERILIZATION_PACKAGING : -1;
    data.where.STORAGE_TYPE = data.where.STORAGE_TYPE ? data.where.STORAGE_TYPE : -1;
    data.where.IS_EMBEDDED = data.where.IS_EMBEDDED ? data.where.IS_EMBEDDED : -1;
    data.where.IS_SERIAL_NUMBER = data.where.IS_SERIAL_NUMBER ? data.where.IS_SERIAL_NUMBER : -1;
    data.where.IS_INTERVENED = data.where.IS_INTERVENED ? data.where.IS_INTERVENED : -1;
    data.where.IS_PROTECT = data.where.IS_PROTECT ? data.where.IS_PROTECT : -1;



    var data_a = DataToObject(data, data.where);
    if (data != null) {
        var data2 = formdataify(data_a);
    }
    const res = await request.post('/AJykDept/GetDeptInStockDetail', data2);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}