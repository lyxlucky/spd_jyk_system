import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function GetJykMainShelf(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.SPEC = data.where.SPEC ? data.where.SPEC : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';

    const res = await request.get('/AJykDept/GetJykMainShelf', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetJykDetailShelf(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';

    const res = await request.get('/AJykDept/GetJykDetailShelf', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}