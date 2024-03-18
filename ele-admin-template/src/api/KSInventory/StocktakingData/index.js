import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function GetStockDataMain(data){
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.GENERATE_DATE = data.where.GENERATE_DATE ? data.where.GENERATE_DATE : '';

    var data3 = formdataify(data2)

    const res = await request.post('/AJykDept/GetStockDataMain', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GenerateStockData(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.SPEC = data.where.SPEC ? data.where.SPEC : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';
    data2.DEF_NO_PKG_CODE = data.where.DEF_NO_PKG_CODE ? data.where.DEF_NO_PKG_CODE : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';
    data2.COUNT = data.where.COUNT ? data.where.COUNT : '';
    data2.DELIVERY_NUMBER = data.where.DELIVERY_NUMBER ? data.where.DELIVERY_NUMBER : '';
    data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
    data2.xqDay = data.where.xqDay ? data.where.xqDay : 0;
    data2.order = data.order ? data.order : '';
    data2.Nickname = data.Nickname ? data.Nickname : '';

    var data3 = formdataify(data2)

    const res = await request.post('/AJykDept/GenerateStockData', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetStockDataDel(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.GENERATE_DATE = data.where.GENERATE_DATE ? data.where.GENERATE_DATE : '';

    var data3 = formdataify(data2)

    const res = await request.post('/AJykDept/GetStockDataDel', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DelBatchStockDataDel(data) {
    console.log(data)
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.ID = data.ID ? data.ID : '';

    var data3 = formdataify(data2)

    const res = await request.post('/AJykDept/DelBatchStockDataDel', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

