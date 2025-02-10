import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function GetSurgicalScheduling(data) {
    var data2 = {};
    data2.VARIETIE_NAME = data.where.VARIETIE_NAME ? data.where.VARIETIE_NAME : '';
    data2.MAIN_ID = data.where.MAIN_ID ? data.where.MAIN_ID : '';
    data2.page = data.where.page ? data.where.page : '1';
    data2.size = data.where.limit ? data.where.limit : '10';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/GetSurgicalScheduling', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
