import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';


/* 获取补货数据*/
export async function SearchDistributeListJYK(data) {
    var data2 ={};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.stock_out_distribute_number = data.where.stock_out_distribute_number ? data.where.stock_out_distribute_number : '';

    DataToObject(data,data2)
    if(data != null){
        var data3 = formdataify(data);
    }
    const res = await request.post('/PickDistributionmgmt/SearchDistributeListJYK',data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetDistributeDefDetailNum(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.stock_out_distribute_number = data.where.stock_out_distribute_number ? data.where.stock_out_distribute_number : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    const res = await request.get('/PickDistributionmgmt/GetDistributeDefDetailNum', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
