import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function SearchDefRemind(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.sourceFrom = data.where.sourceFrom ? data.where.sourceFrom : '';
    data2.varietieCode = data.where.varietieCode ? data.where.varietieCode : '';
    data2.regionCode = data.where.regionCode ? data.where.regionCode : '0';
    data2.coefficient = data.where.coefficient ? data.where.coefficient : '';
    data2.currUpShelfState = data.where.currUpShelfState ? data.where.currUpShelfState : '';
    data2.condition = data.where.condition ? data.where.condition : '';
    data2.field = data.where.field ? data.where.field : '';
    data2.order = data.where.order ? data.where.order : '';
    data2.condition1 = data.where.condition1 ? data.where.condition1 : '';
    data2.jxqSatte = data.where.jxqSatte ? data.where.jxqSatte : '0';
    data2.isHaveTh = data.where.isHaveTh ? data.where.isHaveTh : '-1';

    const res = await request.get('/DeptTwoDefNoPackageStock/SearchJYkDefRemind', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}