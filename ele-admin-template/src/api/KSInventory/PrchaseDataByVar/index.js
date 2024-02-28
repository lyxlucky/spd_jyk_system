import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function getPROD_REGISTRATION_LIMIT_BUY(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.limit = data.limit;
    data2.PROD_REGISTRATION_NAME = data.where.PROD_REGISTRATION_NAME ? data.where.PROD_REGISTRATION_NAME : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.SOURCE_FROM = data.where.SOURCE_FROM ? data.where.SOURCE_FROM : '';
    data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER ? data.where.APPROVAL_NUMBER : '';
    data2.STATE = data.where.STATE ? data.where.STATE : '';
    data2.statrTime = data.where.statrTime ? data.where.statrTime : '';
    data2.endTime = data.where.endTime ? data.where.endTime : '';
    data2.statrTime2 = data.where.statrTime2 ? data.where.statrTime2 : '';
    data2.last = data.where.last ? data.where.last : '';
    data2.endTime2 = data.where.endTime2 ? data.where.endTime2 : '';
    data2.CountState = data.where.CountState ? data.where.CountState : '';
    data2.deptTwoCode = data.where.deptTwoCode ? data.where.deptTwoCode : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/ProdInfo/getPROD_REGISTRATION_LIMIT_BUY', data3);
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