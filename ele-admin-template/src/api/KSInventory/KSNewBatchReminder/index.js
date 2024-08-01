import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';

export async function getTableList(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.varietieCodeNew = data.where.code ? data.where.code : '';
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code;
    data2.batchConfirm = data.where.status ? data.where.status : '';
    const res = await request.get('BatchReminder/getTableList', {
        params:data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function confirmBatch(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.ids = data.code ? data.code : '';
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code;
    const formatData = formdataify(data2);
    const res = await request.post('BatchReminder/confirmBatch',formatData);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}