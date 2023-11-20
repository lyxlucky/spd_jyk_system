import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function SerachPlanList(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.DeptCode = data.where.DeptCode;
    data2.SerachName = data.where.SerachName ? data.where.SerachName : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    const res = await request.get('/DeptApplyPlan/SerachAuthVar', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}  

export async function KeeptListDeta(data) {
    var data2 = {};
    data2.type = '1';
    data2.json =  JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/KeeptListDeta', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}  